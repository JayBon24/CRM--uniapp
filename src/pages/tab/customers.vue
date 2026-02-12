<template>
  <view class="customers-page">
    <view class="quick-panels">
      <view class="panel">
        <view class="panel-title">{{ panelTitles.customer }}</view>
        <view class="panel-grid">
          <view
            v-for="item in customerManageEntries"
            :key="item.value"
            class="panel-item"
            @click="handleStageEntry(item)"
          >
            <SvgIcon :name="item.icon" :size="56" color="#fff" class="panel-icon" />
            <text class="panel-text">{{ item.label }}</text>
          </view>
        </view>
      </view>

      <view class="panel">
        <view class="panel-title">{{ panelTitles.other }}</view>
        <view class="panel-grid">
          <view
            v-for="item in otherEntriesToShow"
            :key="item.value"
            class="panel-item"
            @click="handleStageEntry(item)"
          >
            <SvgIcon :name="item.icon" :size="56" color="#fff" class="panel-icon" />
            <text class="panel-text">{{ item.label }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 自定义 TabBar -->
    <CustomTabBar ref="tabBarRef" />
  </view>
</template>

<script setup lang="ts">
// @ts-nocheck
import { computed, ref } from 'vue'
import { getCurrentInstance } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'
import SvgIcon from '@/components/SvgIcon/index.vue'
import CustomTabBar from '@/custom-tab-bar/index.vue'

const userStore = useUserStore()
const tabBarRef = ref()

const panelTitles = {
  customer: '客户管理',
  other: '其他功能'
}

const customerManageEntries = computed(() => [
  { label: '商机', value: 'BLANK', icon: 'building' },
  { label: '跟进', value: 'MEETING', icon: 'account-group' },
  { label: '交案', value: 'CASE', icon: 'file-document' },
  { label: '回款', value: 'PAYMENT', icon: 'shopping' },
  { label: '赢单', value: 'WON', icon: 'target' },
  { label: '案件', value: 'CASE_MANAGEMENT', icon: 'grid' }
])

const otherEntries = computed(() => [
  { label: '公海分配', value: 'PUBLIC_POOL', icon: 'publish', hiddenForSales: true },
  { label: '案源清单', value: 'CASE_LIST', icon: 'grid' },
  { label: '新增', value: 'CLIENT_ADD', icon: 'plus' }
])

const otherEntriesToShow = computed(() =>
  otherEntries.value.filter(item => !(item.hiddenForSales && userStore.roleLevel === 'SALES'))
)

function handleStageEntry(item: { value: string }) {
  if (item.value === 'CLIENT_ADD') {
    handleClientAdd()
    return
  }
  if (item.value === 'CASE_MANAGEMENT') {
    uni.navigateTo({ url: '/pages/other/case/list/index' })
    return
  }
  // 案源清单：单独使用 fromCaseList 标记，不继承上一次的展业阶段
  if (item.value === 'CASE_LIST') {
    const url = `/pages/other/customer/list/index?fromCaseList=1&title=案源清单`
    uni.navigateTo({ url })
    return
  }

  const stage = item.value
  const title = ''
  if (userStore.roleLevel === 'SALES' && stage === 'PUBLIC_POOL') return
  const url = `/pages/other/customer/list/index?stage=${stage}${title ? `&title=${title}` : ''}`
  uni.navigateTo({ url })
}

function handleClientAdd() {
  uni.showActionSheet({
    itemList: ['公海新增', '案件新增'],
    success: (res) => {
      if (res.tapIndex === 0) {
        uni.navigateTo({
          url: '/pages/other/customer/create/index'
        })
      } else if (res.tapIndex === 1) {
        uni.navigateTo({
          url: '/pages/other/customer/create-with-case/index'
        })
      }
    }
  })
}

onShow(() => {
  // 设置当前 Tab 为客户（索引 0）
  if (tabBarRef.value && typeof tabBarRef.value.setSelected === 'function') {
    tabBarRef.value.setSelected(0)
  }
})
</script>

<style scoped lang="scss">
.customers-page {
  min-height: 100vh;
  background: #F5F7FA;
}

.quick-panels {
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.panel {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.04);
}

.panel-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12rpx;
}

.panel-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx 16rpx;
}

.panel-item {
  background: linear-gradient(135deg, #ffa940, #ff7a45);
  border-radius: 16rpx;
  padding: 18rpx 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  color: #fff;
}

.panel-text {
  font-size: 26rpx;
  font-weight: 600;
}
</style>
