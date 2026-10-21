<script setup lang="ts">
import type { Resume } from '@/types/resume'
import { onLoad } from '@dcloudio/uni-app'
import { reactive, ref } from 'vue'
import FormField from '@/components/FormField.vue'
import { useAuthGuard } from '@/composables/useAuthGuard'
import { getResumeAPI, saveResumeAPI } from '@/services/resume'

const form = reactive<Omit<Resume, 'id'>>({ name: '', major: '', phone: '', intro: '', skill: '' })
const loading = ref(false)
const saving = ref(false)
const showPreview = ref(false)

onLoad(async () => {
  if (!useAuthGuard())
    return
  loading.value = true
  try {
    const res = await getResumeAPI()
    if (res.result)
      Object.assign(form, res.result)
  }
  catch (error) {
    uni.showToast({
      icon: 'none',
      title: (error as { data?: { message?: string } })?.data?.message || '加载失败，请稍后重试',
    })
  }
  finally {
    loading.value = false
  }
})

function validate(): string {
  if (!form.name.trim())
    return '请输入姓名'
  if (!form.major.trim())
    return '请输入专业'
  if (!/^1\d{10}$/.test(form.phone))
    return '请输入正确的手机号'
  if (!form.intro.trim())
    return '请输入自我介绍'
  if (!form.skill.trim())
    return '请输入技能'
  return ''
}

async function onSave() {
  const err = validate()
  if (err) {
    uni.showToast({ title: err, icon: 'none' })
    return
  }

  saving.value = true
  try {
    await saveResumeAPI({ ...form })
    uni.showToast({ title: '保存成功', icon: 'success' })
  }
  catch (error) {
    uni.showToast({
      title: (error as { data?: { message?: string } })?.data?.message || '保存失败',
      icon: 'none',
    })
  }
  finally {
    saving.value = false
  }
}
</script>

<template>
  <view class="resume">
    <FormField label="姓名" required>
      <input v-model="form.name" class="input" placeholder="请输入姓名" placeholder-class="input__placeholder">
    </FormField>

    <FormField label="专业" required>
      <input v-model="form.major" class="input" placeholder="请输入专业" placeholder-class="input__placeholder">
    </FormField>

    <FormField label="联系方式" required>
      <input v-model="form.phone" class="input" type="number" placeholder="请输入手机号" placeholder-class="input__placeholder">
    </FormField>

    <FormField label="自我介绍" required>
      <textarea
        v-model="form.intro"
        class="input input--area"
        placeholder="介绍一下自己"
        placeholder-class="input__placeholder"
        :maxlength="-1"
      />
    </FormField>

    <FormField label="技能" required>
      <textarea
        v-model="form.skill"
        class="input input--area"
        placeholder="如：Photoshop、视频剪辑"
        placeholder-class="input__placeholder"
        :maxlength="-1"
      />
    </FormField>

    <view class="actions">
      <button class="btn btn--plain" @click="showPreview = true">
        预览简历
      </button>
      <button class="btn" :loading="saving" :disabled="saving || loading" @click="onSave">
        保存简历
      </button>
    </view>

    <!-- 简历预览 -->
    <view v-if="showPreview" class="mask" @click="showPreview = false">
      <view class="preview" @click.stop>
        <text class="preview__name">{{ form.name || '未填写' }}</text>
        <text class="preview__info">{{ form.major || '未填写专业' }} · {{ form.phone || '未填写联系方式' }}</text>
        <text class="preview__label">自我介绍</text>
        <text class="preview__text">{{ form.intro || '暂无' }}</text>
        <text class="preview__label">技能</text>
        <text class="preview__text">{{ form.skill || '暂无' }}</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.resume { min-height: 100vh; padding: 24rpx; box-sizing: border-box; background: #f6f8fc; }
.input { width: 100%; min-height: 56rpx; font-size: 30rpx; color: #1f2d3d; }
.input--area { min-height: 160rpx; line-height: 1.6; }
.input__placeholder { color: #c0c4cc; }
.actions { margin-top: 48rpx; }
.btn { height: 88rpx; line-height: 88rpx; border-radius: 44rpx; background: #2f6bff; color: #fff; font-size: 30rpx; }
.btn::after { border: none; }
.btn--plain { margin-bottom: 20rpx; border: 2rpx solid #2f6bff; background: #fff; color: #2f6bff; }
.mask { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, .45); }
.preview { width: 560rpx; padding: 40rpx; border-radius: 20rpx; background: #fff; }
.preview__name { font-size: 36rpx; font-weight: 700; color: #1f2d3d; }
.preview__info { display: block; margin-top: 12rpx; font-size: 26rpx; color: #2f6bff; }
.preview__label { display: block; margin-top: 28rpx; font-size: 24rpx; color: #909399; }
.preview__text { display: block; margin-top: 8rpx; font-size: 28rpx; color: #3a3f47; line-height: 1.6; }
</style>
