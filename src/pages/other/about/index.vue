<template>
  <view class="page-container">
    <!-- 内容 -->
    <scroll-view class="content" scroll-y>
      <!-- 应用信息 -->
      <view class="app-info">
        <!-- 使用运行时绑定，避免生成主包 common/assets.js 资源模块 -->
        <image :src="logoUrl" class="app-logo" mode="aspectFit"></image>
        <text class="app-name">律所 AI CRM</text>
        <text class="app-version">版本 v1.0.0</text>
      </view>

      <!-- 应用介绍 -->
      <view class="about-section">
        <view class="section-title">应用介绍</view>
        <view class="section-content">
          <text class="content-text">
            本应用是面向律所销售与管理的「AI 赋能 CRM」。围绕客户全生命周期（公海→跟进→交案→回款→赢单）沉淀过程数据（跟进、拜访、计划、合同/回款/律师费），并通过 AI 助理帮助“识别信息 → 生成建议 → 确认写入 → 留痕闭环”。
          </text>
        </view>
      </view>

      <!-- 功能特色 -->
      <view class="about-section">
        <view class="section-title">功能特色</view>
        <view class="feature-list">
          <view class="feature-item">
            <view class="feature-icon">
              <u-icon name="plus-circle" size="24" color="#667eea"></u-icon>
            </view>
            <view class="feature-info">
              <text class="feature-title">客户全生命周期管理</text>
              <text class="feature-desc">公海/跟进/交案/回款/赢单一页聚合，推进流程更清晰</text>
            </view>
          </view>
          <view class="feature-item">
            <view class="feature-icon">
              <u-icon name="arrow-upward" size="24" color="#52c41a"></u-icon>
            </view>
            <view class="feature-info">
              <text class="feature-title">跟进 / 拜访 / 计划</text>
              <text class="feature-desc">记录过程数据，形成有效拜访与计划提醒，减少遗忘与漏跟</text>
            </view>
          </view>
          <view class="feature-item">
            <view class="feature-icon">
              <u-icon name="eye" size="24" color="#fa8c16"></u-icon>
            </view>
            <view class="feature-info">
              <text class="feature-title">合同 / 回款 / 律师费</text>
              <text class="feature-desc">关键节点录入与凭证留存，支撑交案、回款、赢单闭环</text>
            </view>
          </view>
          <view class="feature-item">
            <view class="feature-icon">
              <u-icon name="heart" size="24" color="#f5222d"></u-icon>
            </view>
            <view class="feature-info">
              <text class="feature-title">AI 助理与管理审批</text>
              <text class="feature-desc">AI 对话辅助结构化信息；管理角色可在审批中心处理申领/新增/转交</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 联系方式 -->
      <view class="about-section">
        <view class="section-title">联系我们</view>
        <view class="contact-list">
          <view class="contact-item">
            <text class="contact-label">产品定位</text>
            <text class="contact-value">万方律所 AI CRM</text>
          </view>
          <view class="contact-item">
            <text class="contact-label">支持</text>
            <text class="contact-value">请在「我的-反馈与支持」提交</text>
          </view>
          <view class="contact-item">
            <text class="contact-label">使用建议</text>
            <text class="contact-value">优先沉淀跟进/拜访/计划数据</text>
          </view>
          <view class="contact-item">
            <text class="contact-label">工作时间</text>
            <text class="contact-value">周一至周五 9:00-18:00</text>
          </view>
        </view>
      </view>

      <!-- 版权信息 -->
      <view class="copyright">
        <text class="copyright-text">© 2024 律所 AI CRM. All rights reserved.</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
// 页面逻辑：关于页使用系统导航栏返回按钮即可

// Logo 地址：微信端使用分包路径，其它端可按需调整
// #ifdef MP-WEIXIN
const logoUrl = '/pages/other/static/logo.png'
// #endif
// #ifndef MP-WEIXIN
const logoUrl = '/static/logo.png'
// #endif
</script>

<style scoped>
.page-container {
  height: 100vh;
  background-color: #f5f5f5;
  /* 使用弹性布局，避免内部滚动区域撑破容器宽度 */
  display: flex; /* 中文注释：使子元素可按列布局并撑满空间 */
  flex-direction: column; /* 中文注释：纵向排列内容 */
  overflow-x: hidden; /* 中文注释：禁止横向滚动，避免右侧越界 */
}

.header {
  background-color: #fff;
  padding: 40rpx 20rpx;
  text-align: center;
  border-bottom: 1rpx solid #e0e0e0;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.content {
  flex: 1;
  padding: 20rpx;
  width: 100%; /* 中文注释：确保滚动容器占满父容器宽度 */
  box-sizing: border-box; /* 中文注释：包含内边距防止出现横向溢出 */
  overflow-x: hidden; /* 中文注释：禁止横向滚动 */
}

.app-info {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 60rpx 20rpx;
  text-align: center;
  margin-bottom: 20rpx;
}

.app-logo {
  width: 120rpx;
  height: 120rpx;
  margin-bottom: 20rpx;
}

.app-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}

.app-version {
  font-size: 26rpx;
  color: #666;
  display: block;
}

.about-section {
  background-color: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
}

.section-title {
  padding: 30rpx 20rpx 20rpx;
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  background-color: #f8f9fa;
}

.section-content {
  padding: 20rpx;
}

.content-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

.feature-list {
  padding: 20rpx;
}

.feature-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.feature-item:last-child {
  border-bottom: none;
}

.feature-icon {
  margin-right: 20rpx;
}

.feature-info {
  flex: 1;
  min-width: 0; /* 中文注释：允许内容在弹性布局中收缩，避免文本将容器挤出边界 */
}

.feature-title {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 8rpx;
  display: block;
}

.feature-desc {
  font-size: 26rpx;
  color: #666;
  display: block;
}

.contact-list {
  padding: 20rpx;
}

.contact-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.contact-item:last-child {
  border-bottom: none;
}

.contact-label {
  font-size: 28rpx;
  color: #333;
}

.contact-value {
  font-size: 28rpx;
  color: #666;
  word-break: break-all; /* 中文注释：长链接或连续字符自动换行，避免横向溢出 */
}

.copyright {
  text-align: center;
  padding: 40rpx 20rpx;
}

.copyright-text {
  font-size: 24rpx;
  color: #999;
}
</style>
