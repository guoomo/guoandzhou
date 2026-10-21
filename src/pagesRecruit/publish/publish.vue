<script setup lang="ts">
import type { RecruitPublishParams } from '@/types/recruit'
import { onLoad } from '@dcloudio/uni-app'
import { reactive, ref } from 'vue'
import FormField from '@/components/FormField.vue'
import { useAuthGuard } from '@/composables/useAuthGuard'
import { publishRecruitAPI } from '@/services/recruit'

const form = reactive({ title: '', type: 1 as 0 | 1, content: '' })
const cover = ref('')
const submitting = ref(false)

// 权限拦截：仅社团可进入
onLoad(() => {
  useAuthGuard('club')
})

function chooseImage() {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      cover.value = (res.tempFilePaths as string[])[0] || ''
    },
  })
}

function validate(): string {
  if (!form.title.trim())
    return '请输入标题'
  if (!form.content.trim())
    return '请输入正文内容'
  if (!cover.value)
    return '请上传海报图片'
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
    await publishRecruitAPI({ ...form, img: cover.value } as RecruitPublishParams)
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
  <view class="publish">
    <FormField label="标题" required>
      <input v-model="form.title" class="input" placeholder="请输入标题" placeholder-class="input__placeholder">
    </FormField>

    <FormField label="类型" required>
      <view class="types">
        <view
          class="types__item"
          :class="{ 'types__item--active': form.type === 0 }"
          @click="form.type = 0"
        >
          毕业生岗位
        </view>
        <view
          class="types__item"
          :class="{ 'types__item--active': form.type === 1 }"
          @click="form.type = 1"
        >
          社团招新
        </view>
      </view>
    </FormField>

    <FormField label="正文" required>
      <textarea
        v-model="form.content"
        class="input input--area"
        placeholder="请输入正文内容"
        placeholder-class="input__placeholder"
        :maxlength="-1"
      />
    </FormField>

    <FormField label="海报图片" required>
      <view class="uploader">
        <view v-if="cover" class="uploader__item">
          <image class="uploader__img" :src="cover" mode="aspectFill" />
          <text class="uploader__del" @click="cover = ''">×</text>
        </view>
        <view v-else class="uploader__add" @click="chooseImage">
          +
        </view>
      </view>
    </FormField>

    <button class="submit" :loading="submitting" :disabled="submitting" @click="onSubmit">
      发布
    </button>

    <!-- 后端未搭建：图片仅保留本地临时路径，未真正上传 -->
    <text class="publish__tip">当前为 mock 模式：图片仅本地预览，发布后写入本地假数据</text>
  </view>
</template>

<style lang="scss" scoped>
.publish { min-height: 100vh; padding: 24rpx; box-sizing: border-box; background: #f6f8fc; }
.input { width: 100%; min-height: 56rpx; font-size: 30rpx; color: #1f2d3d; }
.input--area { min-height: 240rpx; line-height: 1.6; }
.input__placeholder { color: #c0c4cc; }
.types { display: flex; }
.types__item { margin-right: 20rpx; padding: 12rpx 32rpx; border: 2rpx solid #dcdfe6; border-radius: 32rpx; font-size: 26rpx; color: #606266; }
.types__item--active { border-color: #2f6bff; background: #e8f0ff; color: #2f6bff; }
.uploader { display: flex; }
.uploader__item { position: relative; width: 200rpx; height: 200rpx; }
.uploader__img { width: 200rpx; height: 200rpx; border-radius: 12rpx; }
.uploader__del { position: absolute; top: -12rpx; right: -12rpx; width: 40rpx; height: 40rpx; line-height: 36rpx; border-radius: 50%; background: rgba(0, 0, 0, .5); color: #fff; font-size: 28rpx; text-align: center; }
.uploader__add { width: 200rpx; height: 200rpx; line-height: 192rpx; border: 2rpx dashed #dcdfe6; border-radius: 12rpx; color: #c0c4cc; font-size: 56rpx; text-align: center; }
.submit { margin-top: 48rpx; height: 88rpx; line-height: 88rpx; border-radius: 44rpx; background: #2f6bff; color: #fff; font-size: 30rpx; }
.submit::after { border: none; }
.publish__tip { display: block; margin-top: 32rpx; font-size: 22rpx; line-height: 1.6; color: #b0b3bb; text-align: center; }
</style>
