<script setup lang="ts">
import type { ForumPublishParams } from '@/types/forum'
import { onLoad } from '@dcloudio/uni-app'
import { reactive, ref } from 'vue'
import FormField from '@/components/FormField.vue'
import { useAuthGuard } from '@/composables/useAuthGuard'
import { publishForumAPI } from '@/services/forum'

const form = reactive({ title: '', content: '' })
const imgs = ref<string[]>([])
const submitting = ref(false)

onLoad(() => {
  useAuthGuard()
})

function chooseImage() {
  const rest = 3 - imgs.value.length
  if (rest <= 0)
    return
  uni.chooseImage({
    count: rest,
    success: (res) => {
      imgs.value = [...imgs.value, ...(res.tempFilePaths as string[])]
    },
  })
}

function removeImage(index: number) {
  imgs.value.splice(index, 1)
}

function validate(): string {
  if (!form.title.trim())
    return '请输入标题'
  if (!form.content.trim())
    return '请输入正文'
  return ''
}

async function onSubmit() {
  const err = validate()
  if (err) {
    uni.showToast({ title: err, icon: 'none' })
    return
  }

  submitting.value = true
  try {
    await publishForumAPI({ ...form, imgs: imgs.value } as ForumPublishParams)
    uni.showToast({ title: '发布成功', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 800)
  }
  catch (error) {
    uni.showToast({
      title: (error as { data?: { message?: string } })?.data?.message || '发布失败',
      icon: 'none',
    })
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <view class="post">
    <FormField label="标题" required>
      <input v-model="form.title" class="input" placeholder="请输入帖子标题" placeholder-class="input__placeholder">
    </FormField>

    <FormField label="正文" required>
      <textarea
        v-model="form.content"
        class="input input--area"
        placeholder="分享你的想法..."
        placeholder-class="input__placeholder"
        :maxlength="-1"
      />
    </FormField>

    <FormField label="配图（最多 3 张）">
      <view class="uploader">
        <view v-for="(img, index) in imgs" :key="img" class="uploader__item">
          <image class="uploader__img" :src="img" mode="aspectFill" />
          <text class="uploader__del" @click="removeImage(index)">×</text>
        </view>
        <view v-if="imgs.length < 3" class="uploader__add" @click="chooseImage">
          +
        </view>
      </view>
    </FormField>

    <button class="submit" :loading="submitting" :disabled="submitting" @click="onSubmit">
      发布
    </button>

    <!-- 后端未搭建：图片仅保留本地临时路径，未真正上传 -->
    <text class="post__tip">当前为 mock 模式：图片仅本地预览，发布后写入本地假数据</text>
  </view>
</template>

<style lang="scss" scoped>
.post { min-height: 100vh; padding: 24rpx; box-sizing: border-box; background: #f6f8fc; }
.input { width: 100%; min-height: 56rpx; font-size: 30rpx; color: #1f2d3d; }
.input--area { min-height: 220rpx; line-height: 1.6; }
.input__placeholder { color: #c0c4cc; }
.uploader { display: flex; flex-wrap: wrap; }
.uploader__item { position: relative; width: 160rpx; height: 160rpx; margin: 0 16rpx 16rpx 0; }
.uploader__img { width: 160rpx; height: 160rpx; border-radius: 12rpx; }
.uploader__del { position: absolute; top: -12rpx; right: -12rpx; width: 40rpx; height: 40rpx; line-height: 36rpx; border-radius: 50%; background: rgba(0, 0, 0, .5); color: #fff; font-size: 28rpx; text-align: center; }
.uploader__add { width: 160rpx; height: 160rpx; line-height: 152rpx; border: 2rpx dashed #dcdfe6; border-radius: 12rpx; color: #c0c4cc; font-size: 56rpx; text-align: center; }
.submit { margin-top: 48rpx; height: 88rpx; line-height: 88rpx; border-radius: 44rpx; background: #2f6bff; color: #fff; font-size: 30rpx; }
.submit::after { border: none; }
.post__tip { display: block; margin-top: 32rpx; font-size: 22rpx; line-height: 1.6; color: #b0b3bb; text-align: center; }
</style>
