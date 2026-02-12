<template>
  <view class="page-container">
    <!-- 统一表单 -->
    <view class="form-section">
      <!-- 头像 -->
      <view class="form-item avatar-item">
        <view class="form-label">头像</view>
        <view class="form-content">
          <ImageUploader v-model="userInfo.avatar" :width="80" :height="80" shape="circle" />
        </view>
      </view>

      <!-- 用户名称 -->
      <view class="form-item">
        <view class="form-label required">用户名称</view>
        <view class="form-content">
          <input
            v-model="userInfo.nickName"
            placeholder="请输入用户名称"
            type="text"
            class="form-input"
            @input="onNameInput"
          />
        </view>
      </view>

      <!-- 姓名拼音 -->
      <view class="form-item">
        <view class="form-label required">姓名拼音</view>
        <view class="form-content">
          <input
            v-model="userInfo.pinYin"
            placeholder="自动生成拼音首字母"
            type="text"
            class="form-input"
            @focus="onPinyinFocus"
            @input="onPinyinInput"
            @blur="validatePinyin"
            maxlength="50"
          />
          <view v-if="pinyinError" class="error-tip">{{ pinyinError }}</view>
        </view>
      </view>

      <!-- 性别 -->
      <view class="form-item">
        <view class="form-label required">性别</view>
        <view class="form-content">
          <DictRadio v-model="userInfo.sex" dict-name="sys_user_sex" />
        </view>
      </view>

      <!-- 出生年月 -->
      <view class="form-item">
        <view class="form-label required">出生年月</view>
        <view class="form-content">
          <DateSelector v-model="userInfo.birthDate" placeholder="请选择出生年月" />
        </view>
      </view>
      <!-- 手机号 -->
      <view class="form-item">
        <view class="form-label required">手机号</view>
        <view class="form-content">
          <view class="phone-display">
            <text class="phone-text">{{ userInfo.phonenumber || '未设置' }}</text>
            <view class="phone-btn">
              <u-button
                type="primary"
                size="mini"
                @click="openPhonePopup"
                :customStyle="{ borderRadius: '20rpx', fontSize: '24rpx' }"
                >修改</u-button
              >
            </view>
          </view>
        </view>
      </view>

      <!-- 通讯地址 -->
      <view class="form-item">
        <view class="form-label required">通讯地址</view>
        <view class="form-content">
          <input
            v-model="userInfo.address"
            placeholder="请输入详细通讯地址"
            type="text"
            class="form-input"
          />
        </view>
      </view>

      <!-- 工作单位 -->
      <view class="form-item">
        <view class="form-label required">工作单位</view>
        <view class="form-content">
          <input
            v-model="userInfo.workUnit"
            placeholder="请输入工作单位"
            type="text"
            class="form-input"
          />
        </view>
      </view>

      <!-- 职业岗位 -->
      <view class="form-item">
        <view class="form-label required">职业岗位</view>
        <view class="form-content">
          <input
            v-model="userInfo.jobPosition"
            placeholder="请输入职业岗位"
            type="text"
            class="form-input"
          />
        </view>
      </view>

      <!-- 保存按钮 -->
      <view class="form-item">
        <view class="form-content">
          <u-button
            type="primary"
            text="保存资料"
            @click="saveProfile"
            :loading="saving"
            class="save-button"
          ></u-button>
        </view>
      </view>
    </view>

    <!-- 修改手机号弹窗：仅更新本页数据，与其他资料一起提交 -->
    <u-popup
      v-model:show="showPhonePopup"
      mode="bottom"
      :safe-area-inset-bottom="true"
      :close-on-click-overlay="false"
      :z-index="999"
      :adjust-position="true"
      :keyboard-height="0"
      @close="closePhonePopup"
    >
      <view class="popup-body">
        <view class="popup-title">修改手机号</view>
        <view class="popup-item">
          <view class="popup-label">新手机号</view>
          <u-input v-model="tempPhone" placeholder="请输入新手机号" type="number" maxlength="11" />
        </view>
        <view class="popup-item">
          <view class="popup-label">验证码</view>
          <u-input v-model="tempCode" placeholder="请输入验证码" type="number" maxlength="6">
            <template #suffix>
              <u-button
                size="mini"
                type="primary"
                :disabled="codeCountdown > 0 || !isValidPhone(tempPhone)"
                @click="sendSmsCode"
                style="margin-left: 8rpx"
              >
                {{ codeCountdown > 0 ? codeCountdown + 's' : '获取验证码' }}
              </u-button>
            </template>
          </u-input>
        </view>
        <view class="popup-actions">
          <u-button
            type="primary"
            @click="confirmPhoneChange"
            text="确认修改"
            :customStyle="{ width: '100%' }"
          />
        </view>
      </view>
    </u-popup>
  </view>
</template>

<!-- 姓名汉字、姓名拼音、性别、出生年月、联系电话、通讯地址、工作单位、职业岗位 -->

<script setup>
  import { ref, reactive, onMounted } from 'vue'
  import { updateUserProfile, getUserProfile, changeUserPhone } from '@/api/user'
  import DictRadio from '@/components/DictRadio/index.vue'
  import DateSelector from '@/components/DateSelector/index.vue'
  import ImageUploader from '@/components/ImageUploader/index.vue'
  import { getPinyinInitials } from '../utils/pinyin'
  import { sendSmsCode as apiSendSmsCode } from '../api/auth'

  // 响应式数据
  const saving = ref(false)

  // 使用 pinyin-pro 库进行汉字转拼音首字母

  // 用户信息
  const userInfo = reactive({
    userId: '',
    deptId: '',
    userName: '',
    nickName: '',
    userType: '',
    phonenumber: '',
    sex: '',
    avatar: '',
    status: '',
    delFlag: '',
    pinYin: '',
    birthDate: '',
    address: '',
    workUnit: '',
    jobPosition: '',
  })

  // 加载用户信息
  const loadUserInfo = async () => {
    try {
      const response = await getUserProfile()
      if (response && response.data) {
        Object.assign(userInfo, response.data)
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      uni.showToast({
        title: '获取用户信息失败',
        icon: 'none',
      })
    }
  }

  // 页面加载时获取用户信息
  onMounted(() => {
    loadUserInfo()
  })

  // 用户名称输入事件处理
  const onNameInput = e => {
    const name = e.detail.value
    // 自动生成拼音首字母
    const pinyin = getPinyinInitials(name)
    userInfo.pinYin = pinyin
  }

  // 拼音输入框焦点事件处理
  const onPinyinFocus = () => {
    // 如果拼音为空，自动生成
    if (!userInfo.pinYin && userInfo.nickName) {
      userInfo.pinYin = getPinyinInitials(userInfo.nickName)
    }
  }

  // 拼音输入验证
  const pinyinError = ref('')

  // 拼音输入事件处理
  const onPinyinInput = e => {
    const value = e.detail.value
    // 只允许大写字母和空格
    const filteredValue = value.replace(/[^A-Z\s]/g, '').toUpperCase()

    // 如果输入了非法字符，更新为过滤后的值
    if (filteredValue !== value) {
      userInfo.pinYin = filteredValue
    }

    // 清除错误提示
    pinyinError.value = ''
  }

  // 拼音验证
  const validatePinyin = () => {
    const value = userInfo.pinYin?.trim()

    if (!value) {
      pinyinError.value = '请输入姓名拼音'
      return false
    }

    // 验证只包含大写字母和空格
    if (!/^[A-Z\s]+$/.test(value)) {
      pinyinError.value = '姓名拼音只能包含大写字母和空格'
      return false
    }

    // 验证不能有连续空格
    if (/\s{2,}/.test(value)) {
      pinyinError.value = '姓名拼音不能有连续空格'
      return false
    }

    // 验证不能以空格开头或结尾
    if (value.startsWith(' ') || value.endsWith(' ')) {
      pinyinError.value = '姓名拼音不能以空格开头或结尾'
      return false
    }

    pinyinError.value = ''
    return true
  }

  // 头像上传改由 ImageUploader 组件处理，这里无需手动选择逻辑

  const changePhone = () => {
    uni.navigateTo({
      url: '/pages/profile/change-phone',
    })
  }

  // 修改手机号弹窗状态与字段（仅修改本页数据）
  const showPhonePopup = ref(false) // 弹窗显示开关
  const tempPhone = ref('') // 弹窗中的新手机号
  const tempCode = ref('') // 弹窗中的验证码
  const codeCountdown = ref(0) // 短信倒计时（秒）
  let codeTimer = null // 计时器句柄

  // 打开修改手机号弹窗
  const openPhonePopup = () => {
    // 预填现有手机号，便于用户修改
    tempPhone.value = userInfo.phonenumber || ''
    tempCode.value = ''
    showPhonePopup.value = true
  }

  // 关闭弹窗并清理计时器
  const closePhonePopup = () => {
    showPhonePopup.value = false
    tempCode.value = ''
    if (codeTimer) {
      clearInterval(codeTimer)
      codeTimer = null
    }
  }

  // 手机号格式校验（中国大陆 11 位）
  const isValidPhone = phone => {
    return /^1\d{10}$/.test(phone || '')
  }

  // 发送短信验证码（调用后端接口）
  const sendSmsCode = async () => {
    if (!isValidPhone(tempPhone.value)) {
      uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }
    if (codeCountdown.value > 0) return
    try {
      await apiSendSmsCode({ phone: tempPhone.value, scene: 'change_phone' })
      uni.showToast({ title: '验证码已发送', icon: 'success' })
    } catch (e) {
      // 统一错误由拦截器处理，这里兜底提示
      uni.showToast({ title: '发送失败，请稍后再试', icon: 'none' })
      return
    }
    codeCountdown.value = 60
    codeTimer = setInterval(() => {
      if (codeCountdown.value <= 1) {
        clearInterval(codeTimer)
        codeTimer = null
        codeCountdown.value = 0
      } else {
        codeCountdown.value -= 1
      }
    }, 1000)
  }

  // 确认修改：调用专用接口更新手机号，成功后同步本页数据
  const confirmPhoneChange = async () => {
    if (!isValidPhone(tempPhone.value)) {
      uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }
    if (!/^\d{4,6}$/.test(tempCode.value)) {
      uni.showToast({ title: '请输入正确的验证码', icon: 'none' })
      return
    }

    try {
      // 调用专用修改手机号接口
      const res = await changeUserPhone({ phone: tempPhone.value, smsCode: tempCode.value })
      if (res && res.code === 200) {
        userInfo.phonenumber = tempPhone.value
        closePhonePopup()
        uni.showToast({ title: '手机号已更新', icon: 'success' })
      }
    } catch (e) {
      uni.showToast({ title: '更新失败，请稍后重试', icon: 'none' })
    }
  }

  const saveProfile = async () => {
    if (!userInfo.nickName) {
      uni.showToast({
        title: '请输入用户名称',
        icon: 'none',
      })
      return
    }

    // 验证拼音格式
    if (!validatePinyin()) {
      return
    }

    if (!userInfo.sex) {
      uni.showToast({
        title: '请选择性别',
        icon: 'none',
      })
      return
    }

    if (!userInfo.birthDate) {
      uni.showToast({
        title: '请选择出生年月',
        icon: 'none',
      })
      return
    }

    if (!userInfo.phonenumber) {
      uni.showToast({
        title: '请设置手机号',
        icon: 'none',
      })
      return
    }

    if (!userInfo.address) {
      uni.showToast({
        title: '请输入通讯地址',
        icon: 'none',
      })
      return
    }

    if (!userInfo.workUnit) {
      uni.showToast({
        title: '请输入工作单位',
        icon: 'none',
      })
      return
    }

    if (!userInfo.jobPosition) {
      uni.showToast({
        title: '请输入职业岗位',
        icon: 'none',
      })
      return
    }

    try {
      saving.value = true
      const res = await updateUserProfile(userInfo)
      if (res && res.code === 200) {
        uni.showToast({ title: '保存成功', icon: 'success', duration: 2000 })
        setTimeout(() => {
          uni.navigateBack({ delta: 1 })
        }, 800)
      }
    } catch (err) {
      console.error('保存失败', err)
      uni.showToast({ title: '保存失败', icon: 'none' })
    } finally {
      saving.value = false
    }
  }
</script>

<style scoped>
  .page-container {
    background-color: #f5f5f5;
    /* 预留与底部固定按钮的空间，防止内容被遮挡 */
    padding-bottom: calc(140rpx + env(safe-area-inset-bottom));
  }

  .profile-status {
    margin-top: 16rpx;
  }

  .status-text {
    color: #fff;
    font-size: 24rpx;
    padding: 8rpx 16rpx;
    border-radius: 20rpx;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10rpx);
  }

  .status-text.complete {
    background: rgba(25, 190, 107, 0.8);
  }

  .form-section {
    background: #fff;
    margin: 20rpx;
    border-radius: 16rpx;
    padding: 30rpx;
    padding-bottom: 50px;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
  }

  .section-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 30rpx;
    padding-left: 20rpx;
    border-left: 4rpx solid #667eea;
  }

  .form-label {
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
    margin-bottom: 16rpx;
    display: block;
  }

  .form-label.required::after {
    content: ' *';
    color: #ff4d4f;
  }

  .form-input {
    width: 100%;
    height: 80rpx;
    background: #f8f9fa;
    border: 2rpx solid #e9ecef;
    border-radius: 12rpx;
    padding: 0 24rpx;
    font-size: 30rpx;
    color: #333;
    transition: all 0.3s ease;
  }

  .form-input:focus {
    border-color: #667eea;
    background: #fff;
    box-shadow: 0 0 0 6rpx rgba(102, 126, 234, 0.1);
  }

  .form-input::placeholder {
    color: #adb5bd;
  }

  .form-tip {
    font-size: 24rpx;
    color: #6c757d;
    margin-top: 8rpx;
    display: block;
  }

  .phone-display {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f8f9fa;
    border: 2rpx solid #e9ecef;
    border-radius: 12rpx;
    padding: 20rpx 24rpx;
  }

  .phone-text {
    font-size: 30rpx;
    color: #333;
  }

  .phone-btn {
    width: 100rpx;
  }

  .picker-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f8f9fa;
    border: 2rpx solid #e9ecef;
    border-radius: 12rpx;
    padding: 20rpx 24rpx;
    min-height: 80rpx;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .picker-trigger:active {
    background: #e9ecef;
  }

  .picker-text {
    font-size: 30rpx;
    color: #333;
  }

  .picker-text:empty::before {
    content: '请选择出生日期';
    color: #adb5bd;
  }

  .radio-group {
    display: flex;
    gap: 40rpx;
  }

  .radio-item {
    display: flex;
    align-items: center;
  }

  .radio-label {
    font-size: 28rpx;
    color: #333;
    margin-left: 12rpx;
  }

  .save-button {
    width: 100%;
    height: 88rpx;
    border-radius: 44rpx;
    font-size: 32rpx;
    font-weight: 600;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    color: #fff;
    margin-top: 20rpx;
  }

  .save-button:active {
    transform: scale(0.98);
  }

  /* 弹窗样式优化：整体留白更大，按钮与输入同一行 */
  .popup-body {
    padding: 40rpx;
    padding-bottom: 50px;
    background: #fff;
    max-height: 80vh;
    overflow-y: auto;
    /* 键盘适配 */
    position: relative;
    z-index: 1000;
    /* 确保在键盘弹出时内容可见 */
    transform: translateY(0);
    transition: transform 0.3s ease;
  }

  /* 键盘弹出时的适配 */
  .popup-body.keyboard-active {
    transform: translateY(-100rpx);
    max-height: 60vh;
  }

  /* 错误提示样式 */
  .error-tip {
    color: #f56c6c;
    font-size: 24rpx;
    margin-top: 8rpx;
    line-height: 1.4;
  }
  .popup-title {
    font-size: 34rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 28rpx;
  }
  .popup-item {
    margin-bottom: 32rpx;
  }
  .popup-label {
    font-size: 28rpx;
    color: #666;
    margin-bottom: 16rpx;
  }
  .code-row {
    display: flex;
    align-items: center;
    gap: 20rpx;
  }
  .code-input {
    flex: 1;
  }
  .code-btn {
    white-space: nowrap;
  }
  .popup-actions {
    display: flex;
    gap: 20rpx;
    margin-top: 20rpx;
  }

  /* 表单项左右布局 */
  .form-item {
    display: flex;
    align-items: center;
    padding: 24rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
    box-sizing: border-box;
  }

  .form-item:last-child {
    border-bottom: none;
  }

  .form-label {
    width: 160rpx;
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
    flex-shrink: 0;
    padding-top: 8rpx;
  }

  .form-label.required::after {
    content: ' *';
    color: #ff4757;
  }

  .form-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8rpx;
    min-width: 0;
    box-sizing: border-box;
  }

  .form-input {
    width: 100%;
    padding: 16rpx 20rpx;
    border: 2rpx solid #e0e0e0;
    border-radius: 12rpx;
    font-size: 28rpx;
    color: #333;
    background: #fff;
    transition: all 0.3s ease;
    box-sizing: border-box;
  }

  .form-input:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 4rpx rgba(102, 126, 234, 0.1);
  }

  .form-tip {
    font-size: 22rpx;
    color: #999;
    margin-top: 4rpx;
  }

  /* 头像项特殊样式：头像右对齐 */
  .avatar-item .form-content {
    justify-content: flex-end;
    align-items: flex-end;
  }
</style>
