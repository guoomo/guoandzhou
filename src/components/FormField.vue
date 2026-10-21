<script setup lang="ts">
defineProps<{
  label: string
  required?: boolean
}>()
</script>

<template>
  <view class="field">
    <text class="field__label">
      {{ label }}<text v-if="required" class="field__required">*</text>
    </text>
    <slot />
  </view>
</template>

<style scoped lang="scss">
.field {
  margin-bottom: 20rpx;
  padding: 24rpx 28rpx;
  border-radius: 20rpx;
  background: #fff;
}
.field__label {
  display: block;
  margin-bottom: 12rpx;
  font-size: 26rpx;
  color: #909399;
}
.field__required {
  margin-left: 6rpx;
  color: #f56c6c;
}
</style>
