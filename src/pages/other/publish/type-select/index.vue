<template>
  <view class="container">
    <view class="top" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-row">
        <view class="back" @click="goBack">
          <u-icon name="arrow-left" size="22" color="#fff"></u-icon>
        </view>
      </view>
      <view class="title">请选择发布类型</view>
    </view>

    <view class="content">
      <view class="type-card" v-for="item in typeList" :key="item.key" @click="onSelect(item)">
        <view class="type-left">
          <view class="type-icon" :style="{ background: item.iconBg }">
            <u-icon :name="item.icon" size="26" color="#fff"></u-icon>
          </view>
          <view class="type-info">
            <view class="type-title">{{ item.title }}</view>
            <view class="type-desc">{{ item.desc }}</view>
          </view>
        </view>
        <u-icon name="arrow-right" size="18" color="#b6beca"></u-icon>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const statusBarHeight = (uni.getSystemInfoSync()?.statusBarHeight || 0) as number

const typeList = [
  {
    key: 'call-car',
    title: '我要叫车',
    desc: '土方工地快速叫车',
    icon: 'car',
    iconBg: '#2f7bff'
  },
  {
    key: 'vehicle-service',
    title: '车械服务',
    desc: '提供挖机、车队、拖车等服务',
    icon: 'account',
    iconBg: '#8b5cf6'
  },
  {
    key: 'resource-trade',
    title: '资源交易',
    desc: '发布收购或求购渣土、砂土等资源信息',
    icon: 'file-text',
    iconBg: '#22c55e'
  },
  {
    key: 'repair',
    title: '维修保养',
    desc: '发布维修、保养等服务信息',
    icon: 'warning',
    iconBg: '#fb923c'
  },
  {
    key: 'second-hand',
    title: '二手交易',
    desc: '发布或求购二手车辆、机械等设备信息',
    icon: 'box',
    iconBg: '#60a5fa'
  },
  {
    key: 'nearby',
    title: '周边服务',
    desc: '发布土石方行业各类周边服务信息',
    icon: 'chat',
    iconBg: '#fbbf24'
  }
] as const

const goBack = () => {
  uni.navigateBack()
}

const onSelect = (item: { title: string }) => {
  uni.showToast({
    title: `${item.title}功能开发中`,
    icon: 'none'
  })
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: #f6f7fb;
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
}

.top {
  background: #1976ff;
  padding: 20rpx 24rpx 40rpx;
  width: 100%;
  box-sizing: border-box;
}

.nav-row {
  height: 56rpx;
  display: flex;
  align-items: center;
}

.back {
  width: 64rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.title {
  margin-top: 18rpx;
  font-size: 44rpx;
  font-weight: 700;
  color: #fff;
  letter-spacing: 1rpx;
}

.content {
  padding: 20rpx 20rpx 40rpx;
  width: 100%;
  box-sizing: border-box;
}

.type-card {
  background: #fff;
  border-radius: 18rpx;
  padding: 22rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18rpx;
  box-shadow: 0 12rpx 30rpx rgba(15, 23, 42, 0.06);
}

.type-left {
  display: flex;
  align-items: center;
  min-width: 0;
}

.type-icon {
  width: 76rpx;
  height: 76rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 18rpx;
}

.type-info {
  min-width: 0;
}

.type-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #0f172a;
}

.type-desc {
  margin-top: 6rpx;
  font-size: 24rpx;
  color: #94a3b8;
  line-height: 34rpx;
}
</style>
