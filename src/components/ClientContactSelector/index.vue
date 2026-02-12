<!-- @ts-nocheck -->
<template>
  <view class="contact-selector">
    <view class="selected-contacts">
      <view v-for="(contact, index) in selectedContacts" :key="index" class="contact-tag">
        <text class="contact-name">{{ contact.name }}</text>
        <text v-if="contact.mobile" class="contact-mobile">{{ contact.mobile }}</text>
        <view class="remove-btn" @click="removeContact(index)">
          <SvgIcon name="close" :size="24" color="#909399" />
        </view>
      </view>
      <view class="add-btn" @click="showSelector = true">
        <SvgIcon name="add" :size="28" color="#667eea" />
        <text class="add-text">添加客户联系人</text>
      </view>
    </view>

    <!-- 选择器弹窗 -->
    <u-popup v-model:show="showSelector" mode="bottom" :round="20">
      <view class="selector-popup">
        <view class="popup-header">
          <text class="popup-title">选择客户联系人</text>
          <view class="close-btn" @click="showSelector = false">
            <SvgIcon name="close" :size="32" color="#909399" />
          </view>
        </view>

        <!-- Tab 切换：已有联系人 / 手动输入 -->
        <view class="tab-bar">
          <view
            class="tab-item"
            :class="{ active: currentTab === 'existing' }"
            @click="currentTab = 'existing'"
          >
            <text class="tab-text">已有联系人</text>
          </view>
          <view
            class="tab-item"
            :class="{ active: currentTab === 'manual' }"
            @click="currentTab = 'manual'"
          >
            <text class="tab-text">手动输入</text>
          </view>
        </view>

        <!-- 已有联系人列表 -->
        <scroll-view v-if="currentTab === 'existing'" class="contact-list" scroll-y>
          <view
            v-for="contact in existingContacts"
            :key="contact.id"
            class="contact-item"
            @click="toggleContact(contact)"
          >
            <view class="contact-info">
              <text class="contact-name">{{ contact.name }}</text>
              <text v-if="contact.mobile" class="contact-mobile">{{ contact.mobile }}</text>
            </view>
            <view class="checkbox" :class="{ checked: isSelected(contact) }">
              <SvgIcon v-if="isSelected(contact)" name="check" :size="24" color="#fff" />
            </view>
          </view>
          <view v-if="existingContacts.length === 0" class="empty">
            <text class="empty-text">暂无联系人，请手动添加</text>
          </view>
        </scroll-view>

        <!-- 手动输入表单 -->
        <view v-if="currentTab === 'manual'" class="manual-form">
          <view class="form-item">
            <text class="label">姓名 <text class="required">*</text></text>
            <input
              v-model="manualContact.name"
              class="input"
              placeholder="请输入联系人姓名"
              placeholder-style="color: #C0C4CC"
            />
          </view>
          <view class="form-item">
            <text class="label">手机号</text>
            <input
              v-model="manualContact.mobile"
              class="input"
              type="number"
              placeholder="请输入手机号"
              placeholder-style="color: #C0C4CC"
            />
          </view>
          <view class="form-actions">
            <view class="btn add-manual-btn" @click="addManualContact">
              <SvgIcon name="add" :size="28" color="#fff" />
              <text class="btn-text">添加</text>
            </view>
          </view>
        </view>

        <view class="popup-footer">
          <view class="btn cancel-btn" @click="showSelector = false">
            <text class="btn-text">取消</text>
          </view>
          <view class="btn confirm-btn" @click="confirmSelection">
            <text class="btn-text">确定</text>
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, computed, onMounted } from 'vue'

interface Contact {
  id?: number | string
  name: string
  mobile?: string
}

interface Props {
  modelValue: Contact[]
  clientId?: number | string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: Contact[]]
}>()

const selectedContacts = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const showSelector = ref(false)
const currentTab = ref<'existing' | 'manual'>('existing')
const existingContacts = ref<Contact[]>([])
const manualContact = ref<Contact>({ name: '', mobile: '' })

// Mock 数据
onMounted(() => {
  // 实际项目中应从 API 获取该客户的已有联系人
  existingContacts.value = [
    { id: 1, name: '张三', mobile: '13800138001' },
    { id: 2, name: '李四', mobile: '13900139002' }
  ]
})

function isSelected(contact: Contact) {
  return selectedContacts.value.some(c => 
    (c.id && c.id === contact.id) || (c.name === contact.name && c.mobile === contact.mobile)
  )
}

function toggleContact(contact: Contact) {
  const index = selectedContacts.value.findIndex(c => 
    (c.id && c.id === contact.id) || (c.name === contact.name && c.mobile === contact.mobile)
  )
  if (index > -1) {
    const newValue = selectedContacts.value.filter((_, i) => i !== index)
    emit('update:modelValue', newValue)
  } else {
    emit('update:modelValue', [...selectedContacts.value, contact])
  }
}

function removeContact(index: number) {
  const newValue = selectedContacts.value.filter((_, i) => i !== index)
  emit('update:modelValue', newValue)
}

function addManualContact() {
  if (!manualContact.value.name) {
    uni.showToast({
      title: '请输入联系人姓名',
      icon: 'none'
    })
    return
  }

  emit('update:modelValue', [...selectedContacts.value, { ...manualContact.value }])
  manualContact.value = { name: '', mobile: '' }
  
  uni.showToast({
    title: '添加成功',
    icon: 'success'
  })
}

function confirmSelection() {
  showSelector.value = false
}
</script>

<style scoped lang="scss">
.contact-selector {
  width: 100%;
  box-sizing: border-box;
}

.selected-contacts {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  width: 100%;
  box-sizing: border-box;
}

.contact-tag {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 12rpx 20rpx;
  background: #FFF4E6;
  border-radius: 8rpx;
  box-sizing: border-box;
  max-width: 100%;
}

.contact-name {
  font-size: 26rpx;
  color: #303133;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.contact-mobile {
  font-size: 24rpx;
  color: #909399;
  white-space: nowrap;
}

.remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 20rpx;
  background: #F5F7FA;
  border: 1rpx dashed #DCDFE6;
  border-radius: 8rpx;
  box-sizing: border-box;
}

.add-text {
  font-size: 26rpx;
  color: #667eea;
  white-space: nowrap;
}

.selector-popup {
  height: 80vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 20rpx 20rpx 0 0;
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  border-bottom: 1rpx solid #EBEEF5;
}

.popup-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #303133;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56rpx;
  height: 56rpx;
}

.tab-bar {
  display: flex;
  padding: 0 32rpx;
  border-bottom: 1rpx solid #EBEEF5;
}

.tab-item {
  flex: 1;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &.active {
    .tab-text {
      color: #667eea;
      font-weight: 600;
    }
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 60rpx;
      height: 4rpx;
      background: #667eea;
      border-radius: 2rpx;
    }
  }
}

.tab-text {
  font-size: 28rpx;
  color: #606266;
}

.contact-list {
  flex: 1;
  padding: 0 32rpx;
}

.contact-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #EBEEF5;
}

.contact-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.checkbox {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid #DCDFE6;
  border-radius: 8rpx;
  
  &.checked {
    background: #667eea;
    border-color: #667eea;
  }
}

.manual-form {
  flex: 1;
  padding: 32rpx;
  overflow-y: auto;
}

.form-item {
  margin-bottom: 32rpx;
}

.label {
  display: block;
  margin-bottom: 16rpx;
  font-size: 28rpx;
  font-weight: 500;
  color: #303133;
}

.required {
  color: #F56C6C;
}

.input {
  width: 100%;
  height: 72rpx;
  padding: 0 24rpx;
  background: #F5F7FA;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #303133;
  border: 1rpx solid transparent;
  box-sizing: border-box;
  
  &:focus {
    border-color: #667eea;
    background: #fff;
  }
}

.form-actions {
  margin-top: 48rpx;
}

.add-manual-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8rpx;
}

.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;
}

.empty-text {
  font-size: 28rpx;
  color: #909399;
}

.popup-footer {
  display: flex;
  gap: 20rpx;
  padding: 24rpx 32rpx;
  border-top: 1rpx solid #EBEEF5;
}

.btn {
  flex: 1;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8rpx;
}

.cancel-btn {
  background: #F5F7FA;
  
  .btn-text {
    color: #606266;
  }
}

.confirm-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  
  .btn-text {
    color: #fff;
  }
}

.btn-text {
  font-size: 28rpx;
  font-weight: 500;
  color: #fff;
}
</style>
