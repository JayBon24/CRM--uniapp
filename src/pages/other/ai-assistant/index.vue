<template>
  <view class="container">
    <!-- 聊天内容区域 -->
    <scroll-view
      class="chat-content"
      scroll-y
      :scroll-top="scrollTop"
      :scroll-with-animation="true"
    >
      <view class="message-list">
        <!-- AI消息 -->
        <view class="message-item ai-message">
          <view class="message-bubble">
            <text class="message-text">你好~今天准备寄点什么呢? 可以试试对我说:</text>
          </view>
        </view>

        <view class="message-item ai-message">
          <view class="message-bubble">
            <text class="message-text">帮我寄晕车贴给林部长></text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部交互区域 -->
    <view class="bottom-area">
      <!-- 快速操作按钮 -->
      <view class="quick-actions">
        <view
          v-for="(person, index) in quickPersons"
          :key="index"
          class="quick-btn"
          @click="quickSend(person)"
        >
          <text class="quick-btn-text">寄给{{ person }}</text>
        </view>
      </view>

      <!-- 输入栏 -->
      <view class="input-bar">
        <view
          class="mic-btn"
          @touchstart="startRecord"
          @touchend="endRecord"
          @touchcancel="cancelRecord"
        >
          <u-icon name="mic" size="22" :color="isRecording ? '#ef4444' : '#2f7bff'" />
        </view>

        <view class="text-wrap">
          <textarea
            v-model="textMessage"
            class="text-input"
            placeholder="输入消息..."
            :auto-height="true"
            :maxlength="500"
            @confirm="sendText"
          />
        </view>

        <view class="send-btn" @click="sendText">
          <text class="send-text">发送</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'

// 滚动位置
const scrollTop = ref(0)

// 快速联系人列表
const quickPersons = ref(['林部长', '龚雅雅', '林静恬', '李泽标'])

// 录音相关
const isRecording = ref(false)
let recordTimer: any = null

const textMessage = ref('')

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 处理更多选项
const handleMore = () => {
  uni.showActionSheet({
    itemList: ['清空对话', '设置', '帮助'],
    success: (res) => {
      if (res.tapIndex === 0) {
        // 清空对话
        uni.showToast({
          title: '清空对话',
          icon: 'none'
        })
      } else if (res.tapIndex === 1) {
        // 设置
        uni.showToast({
          title: '设置',
          icon: 'none'
        })
      } else if (res.tapIndex === 2) {
        // 帮助
        uni.showToast({
          title: '帮助',
          icon: 'none'
        })
      }
    }
  })
}

// 处理靶心图标
const handleTarget = () => {
  uni.showToast({
    title: '聚焦功能',
    icon: 'none'
  })
}

// 快速寄件
const quickSend = (person: string) => {
  uni.showToast({
    title: `寄给${person}`,
    icon: 'none'
  })
  // TODO: 实现快速寄件逻辑
}

const sendText = () => {
  const text = textMessage.value?.trim()
  if (!text) return
  uni.showToast({
    title: '已发送',
    icon: 'none'
  })
  textMessage.value = ''
}

// 开始录音
const startRecord = () => {
  isRecording.value = true
  uni.showToast({
    title: '开始录音',
    icon: 'none',
    duration: 1000
  })

  // TODO: 调用录音API
  // uni.startRecord({
  //   success: (res) => {
  //     console.log('录音成功', res)
  //   }
  // })
}

// 结束录音
const endRecord = () => {
  if (!isRecording.value) return

  isRecording.value = false
  uni.showToast({
    title: '录音结束',
    icon: 'none',
    duration: 1000
  })

  // TODO: 停止录音并发送
  // uni.stopRecord({
  //   success: (res) => {
  //     console.log('录音结束', res)
  //   }
  // })
}

// 取消录音
const cancelRecord = () => {
  if (!isRecording.value) return

  isRecording.value = false
  uni.showToast({
    title: '已取消录音',
    icon: 'none',
    duration: 1000
  })
}

onLoad(() => {
  console.log('AI寄件页面加载')
})
</script>

<style lang="scss" scoped>
.container {
  background-color: #f6f7fb;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

// 聊天内容区域
.chat-content {
  flex: 1;
  padding: 26rpx 22rpx;
  padding-bottom: calc(360rpx + env(safe-area-inset-bottom));
  overflow-y: auto;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.message-item {
  display: flex;

  &.ai-message {
    justify-content: flex-start;
  }

  &.user-message {
    justify-content: flex-end;
  }
}

.message-bubble {
  max-width: 70%;
  padding: 20rpx 24rpx;
  border-radius: 16rpx;
  background-color: #f5f5f5;

  .message-text {
    font-size: 28rpx;
    color: #333;
    line-height: 1.6;
  }
}

// 底部交互区域
.bottom-area {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 16rpx 18rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  background-color: #fff;
  border-top: 1rpx solid rgba(15, 23, 42, 0.06);
}

// 快速操作按钮
.quick-actions {
  display: flex;
  gap: 16rpx;
  padding-bottom: 14rpx;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
}

.quick-btn {
  flex-shrink: 0;
  padding: 12rpx 24rpx;
  background-color: #f5f5f5;
  border-radius: 30rpx;

  .quick-btn-text {
    font-size: 24rpx;
    color: #666;
  }

  &:active {
    background-color: #e8e8e8;
  }
}

// 输入栏
.input-bar {
  display: flex;
  align-items: flex-end;
  gap: 12rpx;
  margin-bottom: 10rpx;
}

.mic-btn {
  height: 80rpx;
  padding: 0 18rpx;
  border-radius: 16rpx;
  background: rgba(47, 123, 255, 0.08);
  display: flex;
  align-items: center;
  gap: 10rpx;
  flex-shrink: 0;

  &:active {
    background: rgba(47, 123, 255, 0.12);
  }
}

.mic-text {
  font-size: 26rpx;
  color: #2f7bff;
  font-weight: 600;
}

.text-wrap {
  flex: 1;
  min-height: 80rpx;
  border-radius: 16rpx;
  background: #f6f7fb;
  border: 1rpx solid rgba(15, 23, 42, 0.06);
  display: flex;
  align-items: stretch;
  padding: 20rpx 18rpx;
  box-sizing: border-box;
}

.text-input {
  width: 100%;
  font-size: 28rpx;
  color: #0f172a;
  line-height: 40rpx;
  height: 40rpx;
  min-height: 40rpx;
  padding: 0;
  background: transparent;
}

.send-btn {
  height: 80rpx;
  padding: 0 22rpx;
  border-radius: 16rpx;
  background: #2f7bff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:active {
    background: #2563eb;
  }
}

.send-text {
  font-size: 28rpx;
  color: #fff;
  font-weight: 700;
}

// AI生成提示
.ai-tip {
  text-align: center;

  .ai-tip-text {
    font-size: 22rpx;
    color: #999;
  }
}
</style>
