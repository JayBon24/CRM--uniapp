<template>
  <!-- 图片上传组件：通过 maxCount 限制数量，默认1张；点击图片或占位区域重新选择 -->
  <view>
    <!-- 圆形样式（头像） -->
    <view v-if="shape === 'circle'">
      <view class="avatar-uploader">
        <!-- 头像容器 -->
        <view class="avatar-container" :style="containerStyle" @click="chooseImage">
          <!-- 头像图片 -->
          <u-avatar :src="innerValue ? getRenderSource(innerValue) : '/static/default-avatar.png'" size="100%"
            shape="circle" class="avatar-image" />

          <!-- 编辑遮罩 -->
          <view class="edit-overlay">
            <u-icon name="camera" size="20" color="#fff" />
          </view>


          <!-- 上传进度 -->
          <view v-if="uploading" class="upload-progress">
            <u-loading-icon mode="spinner" size="16" color="#fff" />
          </view>
        </view>
      </view>

    </view>
    <!-- 矩形样式（普通图片/附件） -->
    <view v-else class="image-uploader">
      <view v-if="isMultiple" class="multi-uploader">
        <view class="multi-grid">
          <view v-for="(item, index) in innerList" :key="`${item}-${index}`" class="multi-item">
            <image
              v-if="isImageFile(item)"
              :src="getRenderSource(item)"
              mode="aspectFill"
              class="preview-image rect-image"
              :style="imageStyle"
              @click="previewMultiple(index)"
              @error="onImageError(item)"
            />
            <view v-else class="file-preview" @click="openFile(item)">
              <SvgIcon name="file-document" :size="40" color="#909399" />
              <text class="file-name">{{ getFileName(item) }}</text>
            </view>
            <view v-if="showDelete && !disabled && !uploading" class="delete-btn rect-delete" @click.stop="removeAt(index)">
              <u-icon name="close" size="14" color="#fff" />
            </view>
          </view>
          <view
            v-if="canAdd"
            class="upload-placeholder rect-placeholder"
            @click="chooseFiles"
            :style="placeholderStyle"
          >
            <u-icon name="camera" size="48" color="#ccc" />
            <text class="upload-text">{{ label }}</text>
            <text class="upload-desc">{{ placeholder }}</text>
            <view v-if="uploading" class="upload-progress rect-progress">
              <u-loading-icon mode="spinner" size="20" color="#fff" />
              <text class="progress-text">上传中...</text>
            </view>
          </view>
        </view>
      </view>
      <view v-else>
        <!-- 预览区 -->
        <view v-if="innerValue" class="image-preview rect-preview" :style="containerStyle">
          <image
            :src="displaySrc"
            mode="aspectFill"
            class="preview-image rect-image"
            :style="imageStyle"
            @click="previewImage"
            @error="onImageError(innerValue)"
          />
          <!-- 删除按钮 -->
          <view v-if="showDelete && !disabled && !uploading" class="delete-btn rect-delete" @click.stop="deleteImage">
            <u-icon name="close" size="14" color="#fff" />
          </view>
          <!-- 上传进度遮罩 -->
          <view v-if="uploading" class="upload-progress rect-progress">
            <u-loading-icon mode="spinner" size="24" color="#fff" />
            <text class="progress-text">上传中...</text>
          </view>
        </view>

        <!-- 占位区 -->
        <view v-else class="upload-placeholder rect-placeholder" @click="chooseImage" :style="placeholderStyle">
          <u-icon name="camera" size="48" color="#ccc" />
          <text class="upload-text">{{ label }}</text>
          <text class="upload-desc">{{ placeholder }}</text>
        </view>
      </view>
    </view>

  </view>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { uploadFileToServer } from '@/utils/upload'
import { openAttachmentDocument, resolveAttachmentUrl } from '@/utils/attachment'

// 组件属性（JS 版本，内含默认值）
const props = defineProps({
  modelValue: { type: [String, Array], default: '' },
  label: { type: String, default: '图片' },
  placeholder: { type: String, default: '点击选择图片' },
  disabled: { type: Boolean, default: false },
  maxSize: { type: Number, default: 5 * 1024 * 1024 },
  maxCount: { type: Number, default: 1 },
  width: { type: [String, Number], default: '220rpx' },
  height: { type: [String, Number], default: '220rpx' },
  showDelete: { type: Boolean, default: true },
  showPreview: { type: Boolean, default: true },
  // 新增：shape 圆形用于头像
  shape: { type: String, default: 'rect' }, // rect | circle
  mode: { type: String, default: 'aspectFill' },
  accept: { type: String, default: 'image' }
})

// 缩放 	scaleToFill 	不保持纵横比缩放图片，使图片的宽高完全拉伸至填满 image 元素
// 缩放 	aspectFit 	保持纵横比缩放图片，使图片的长边能完全显示出来。也就是说，可以完整地将图片显示出来。
// 缩放 	aspectFill 	保持纵横比缩放图片，只保证图片的短边能完全显示出来。也就是说，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取。
// 缩放 	widthFix 	宽度不变，高度自动变化，保持原图宽高比不变
// 缩放 	heightFix 	高度不变，宽度自动变化，保持原图宽高比不变 App 和 H5 平台 HBuilderX 2.9.3+ 支持、微信小程序需要基础库 2.10.3
// 裁剪 	top 	不缩放图片，只显示图片的顶部区域
// 裁剪 	bottom 	不缩放图片，只显示图片的底部区域
// 裁剪 	center 	不缩放图片，只显示图片的中间区域
// 裁剪 	left 	不缩放图片，只显示图片的左边区域
// 裁剪 	right 	不缩放图片，只显示图片的右边区域
// 裁剪 	top left 	不缩放图片，只显示图片的左上边区域
// 裁剪 	top right 	不缩放图片，只显示图片的右上边区域
// 裁剪 	bottom left 	不缩放图片，只显示图片的左下边区域
// 裁剪 	bottom right 	不缩放图片，只显示图片的右下边区域

// 组件事件
const emit = defineEmits(['update:modelValue', 'change', 'remove'])

// 内部值
const innerValue = ref('')
const innerList = ref([])
const uploading = ref(false)
const imageFallbackMap = ref({})
const fallbackLoadingSet = new Set()
const isMultiple = computed(() => Array.isArray(props.modelValue))
const canAdd = computed(() => innerList.value.length < props.maxCount)

watch(
  () => props.modelValue,
  val => {
    if (Array.isArray(val)) {
      innerList.value = val.filter(Boolean).map(String)
      return
    }
    innerValue.value = val || ''
  },
  { immediate: true }
)

// 图片展示地址（项目全局有 $getImageUrl 可选）
const resolveDisplayUrl = (value) => {
  return resolveAttachmentUrl(value)
}

const getRenderSource = (value) => {
  const resolved = resolveDisplayUrl(value)
  return imageFallbackMap.value[resolved] || resolved
}

const displaySrc = computed(() => getRenderSource(innerValue.value))

// 尺寸处理函数
const formatSize = (size) => {
  if (typeof size === 'number') {
    return `${size}rpx`
  }
  return size
}

// 容器样式（预览状态）
// 中文注释：当 shape 为 circle 时，容器与图片都采用圆形样式（用于头像）
const containerStyle = computed(() => {
  const isCircle = props.shape === 'circle'
  return {
    width: formatSize(props.width),
    height: formatSize(props.height),
    maxWidth: '100%',
    borderRadius: isCircle ? '50%' : '12rpx',
    overflow: isCircle ? 'hidden' : 'visible',
    border: '2rpx solid #eeeeee',
  }
})

// 图片样式
const imageStyle = computed(() => {
  const isCircle = props.shape === 'circle'
  return {
    width: '100%',
    height: '100%',
    borderRadius: isCircle ? '50%' : '12rpx',
  }
})

// 占位符样式
const placeholderStyle = computed(() => {
  const isCircle = props.shape === 'circle'
  return {
    width: formatSize(props.width),
    height: formatSize(props.height),
    maxWidth: '100%',
    borderRadius: isCircle ? '50%' : '12rpx',
    overflow: isCircle ? 'hidden' : 'visible',
    border: '2rpx dashed #dddddd',
  }
})

const isImageFile = (url) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url || '')
const getFileName = (url) => {
  if (!url) return '附件'
  const cleaned = url.split('?')[0]
  const parts = cleaned.split('/')
  return parts[parts.length - 1] || '附件'
}

const tryDownloadImageFallback = (value) => {
  const resolved = resolveDisplayUrl(value)
  if (!resolved) return
  if (resolved.startsWith('wxfile://') || resolved.startsWith('file://') || resolved.startsWith('blob:') || resolved.startsWith('data:')) return
  if (imageFallbackMap.value[resolved] || fallbackLoadingSet.has(resolved)) return
  fallbackLoadingSet.add(resolved)
  uni.downloadFile({
    url: resolved,
    success: (res) => {
      if (res?.statusCode === 200 && res.tempFilePath) {
        imageFallbackMap.value = {
          ...imageFallbackMap.value,
          [resolved]: res.tempFilePath
        }
      }
    },
    complete: () => {
      fallbackLoadingSet.delete(resolved)
    }
  })
}

const onImageError = (value) => {
  tryDownloadImageFallback(value)
}

const canChooseFile = computed(() => /pdf|doc|docx|xls|xlsx|ppt|pptx|file/i.test(props.accept))
const canChooseImage = computed(() => /image|jpg|jpeg|png|gif|webp/i.test(props.accept) || !canChooseFile.value)

const chooseImage = () => {
  if (props.disabled || uploading.value) return
  if (canChooseFile.value && canChooseImage.value) {
    uni.showActionSheet({
      itemList: ['拍照', '相册', '聊天记录'],
      success: (res) => {
        if (res.tapIndex === 0) return chooseFromCamera()
        if (res.tapIndex === 1) return chooseFromAlbum()
        return chooseMessageFile()
      }
    })
    return
  }
  if (canChooseFile.value) {
    chooseMessageFile()
    return
  }
  chooseFromAlbum(true)
}

const chooseFromCamera = () => chooseFromAlbum(false, true)
const chooseFromAlbum = (allowCamera = true, cameraOnly = false) => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: cameraOnly ? ['camera'] : allowCamera ? ['album', 'camera'] : ['album'],
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0]
      uploadSingle(tempFilePath)
    },
    fail: (err) => {
      console.error('选择图片失败:', err)
      uni.showToast({
        title: '选择图片失败',
        icon: 'none'
      })
    }
  })
}

const chooseMessageFile = () => {
  uni.chooseMessageFile({
    count: 1,
    type: 'file',
    success: (res) => {
      const file = res.tempFiles?.[0]
      if (!file?.path) return
      uploadSingle(file.path, file.name)
    },
    fail: (err) => {
      console.error('选择文件失败:', err)
      uni.showToast({
        title: '选择文件失败',
        icon: 'none'
      })
    }
  })
}

const uploadSingle = async (filePath, fileName) => {
  if (!filePath) return
  uploading.value = true
  try {
    const fileInfo = await new Promise((resolve, reject) => {
      uni.getFileInfo({
        filePath,
        success: resolve,
        fail: reject
      })
    })
    if (fileInfo?.size && fileInfo.size > props.maxSize) {
      uni.showToast({
        title: `文件不能超过${Math.round(props.maxSize / 1024 / 1024)}M`,
        icon: 'none'
      })
      return
    }
    const uploaded = await uploadFileToServer(filePath, fileName)
    if (!uploaded?.url) throw new Error('上传失败')
    innerValue.value = uploaded.url
    emit('update:modelValue', uploaded.url)
    emit('change', uploaded)
  } catch (error) {
    console.error('上传失败:', error)
    uni.showToast({
      title: error?.message || '上传失败',
      icon: 'none'
    })
  } finally {
    uploading.value = false
  }
}

const chooseFiles = () => {
  if (!canAdd.value) return
  if (props.disabled || uploading.value) return
  if (canChooseFile.value && canChooseImage.value) {
    uni.showActionSheet({
      itemList: ['拍照', '相册', '聊天记录'],
      success: (res) => {
        if (res.tapIndex === 0) return chooseMultiFromCamera()
        if (res.tapIndex === 1) return chooseMultiFromAlbum()
        return chooseMultiMessageFile()
      }
    })
    return
  }
  if (canChooseFile.value) {
    chooseMultiMessageFile()
    return
  }
  chooseMultiFromAlbum(true)
}

const chooseMultiFromCamera = () => chooseMultiFromAlbum(false, true)
const chooseMultiFromAlbum = (allowCamera = true, cameraOnly = false) => {
  const remaining = props.maxCount - innerList.value.length
  if (remaining <= 0) return
  uni.chooseImage({
    count: Math.min(remaining, 9),
    sizeType: ['compressed'],
    sourceType: cameraOnly ? ['camera'] : allowCamera ? ['album', 'camera'] : ['album'],
    success: (res) => {
      const files = res.tempFilePaths.map(path => ({ path }))
      uploadMultiple(files)
    },
    fail: (err) => {
      console.error('选择图片失败:', err)
      uni.showToast({
        title: '选择图片失败',
        icon: 'none'
      })
    }
  })
}

const chooseMultiMessageFile = () => {
  const remaining = props.maxCount - innerList.value.length
  if (remaining <= 0) return
  uni.chooseMessageFile({
    count: Math.min(remaining, 9),
    type: 'file',
    success: (res) => {
      const files = (res.tempFiles || []).map(file => ({ path: file.path, name: file.name }))
      uploadMultiple(files)
    },
    fail: (err) => {
      console.error('选择文件失败:', err)
      uni.showToast({
        title: '选择文件失败',
        icon: 'none'
      })
    }
  })
}

const uploadMultiple = async (files) => {
  if (!files.length) return
  uploading.value = true
  const nextList = [...innerList.value]
  try {
    for (const file of files) {
      const fileInfo = await new Promise((resolve, reject) => {
        uni.getFileInfo({
          filePath: file.path,
          success: resolve,
          fail: reject
        })
      })
      if (fileInfo?.size && fileInfo.size > props.maxSize) {
        uni.showToast({
          title: `文件不能超过${Math.round(props.maxSize / 1024 / 1024)}M`,
          icon: 'none'
        })
        continue
      }
      const uploaded = await uploadFileToServer(file.path, file.name)
      if (uploaded?.url) {
        nextList.push(uploaded.url)
      }
    }
    innerList.value = nextList
    emit('update:modelValue', nextList)
    emit('change', nextList)
  } catch (error) {
    console.error('批量上传失败:', error)
    uni.showToast({
      title: error?.message || '上传失败',
      icon: 'none'
    })
  } finally {
    uploading.value = false
  }
}

// 删除图片
const deleteImage = () => {
  if (props.disabled || uploading.value) return

  uni.showModal({
    title: '确认删除',
    content: '确定要删除这张图片吗？',
    success: (res) => {
      if (res.confirm) {
        console.log('删除图片')
        innerValue.value = ''
        emit('update:modelValue', '')
        emit('remove')
        uni.showToast({
          title: '已删除',
          icon: 'success',
          duration: 1500
        })
      }
    }
  })
}

const removeAt = (index) => {
  if (props.disabled || uploading.value) return
  const nextList = innerList.value.filter((_, idx) => idx !== index)
  innerList.value = nextList
  emit('update:modelValue', nextList)
  emit('change', nextList)
}

// 预览大图
const previewImage = () => {
  if (!props.showPreview || !innerValue.value || uploading.value) {
    // 如果不支持预览或没有图片或正在上传，则触发重新选择
    chooseImage()
    return
  }

  console.log('预览大图:', displaySrc.value)
  uni.previewImage({
    urls: [displaySrc.value],
    current: displaySrc.value,
    fail: (err) => {
      console.error('预览图片失败:', err)
      uni.showToast({
        title: '预览失败',
        icon: 'none'
      })
    }
  })
}

const previewMultiple = (index) => {
  const images = innerList.value.filter(isImageFile)
  const current = images[index] || images[0]
  if (!current) return
  uni.previewImage({
    urls: images.map(resolveDisplayUrl),
    current: resolveDisplayUrl(current)
  })
}

const openFile = (url) => {
  if (!url) return
  openAttachmentDocument(resolveDisplayUrl(url))
}

// 保留 remove 事件以兼容外部，但本组件不再显示按钮
const onRemove = () => {
  innerValue.value = ''
  emit('update:modelValue', '')
  emit('remove')
}

</script>

<style lang="scss" scoped>
.image-uploader {
  width: 100%;
  max-width: 100%;
  display: inline-block;
}

.multi-uploader {
  width: 100%;
}

.multi-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.multi-item {
  position: relative;
  width: 220rpx;
  height: 220rpx;
  border-radius: 12rpx;
  overflow: hidden;
  background: #f8f8f8;
  border: 2rpx solid #eeeeee;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-preview {
  width: 100%;
  height: 100%;
  padding: 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  color: #606266;
  font-size: 22rpx;
  text-align: center;
  background: #f5f7fa;
}

.file-name {
  font-size: 22rpx;
  color: #606266;
  line-height: 1.4;
  word-break: break-all;
}

// 基础样式
.image-preview {
  position: relative;
  display: inline-block;
}

.preview-image {
  border: 2rpx solid #eeeeee;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
}

.upload-progress {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
}

.progress-text {
  color: #fff;
  font-size: 24rpx;
}

.delete-btn {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid #fff;
  z-index: 10;
}

.delete-btn:active {
  background-color: rgba(0, 0, 0, 0.8);
  transform: scale(0.95);
}

.upload-placeholder {
  border: 2rpx dashed #dddddd;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
  box-shadow: inset 0 0 0 1rpx rgba(0, 0, 0, 0.02);
}

.upload-text {
  font-size: 26rpx;
  color: #666666;
}

.upload-desc {
  font-size: 22rpx;
  color: #999999;
}

// 头像上传器
.avatar-uploader {
  display: flex;
  justify-content: center;
  align-items: center;
}

// 头像容器
.avatar-container {
  position: relative;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
  border: 2rpx solid #fff;
  transition: all 0.3s ease;
  cursor: pointer;
}

.avatar-container:hover {
  transform: scale(1.05);
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.15);
}

.avatar-image {
  width: 100%;
  height: 100%;
  transition: all 0.3s ease;
}

// 编辑遮罩
.edit-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  border-radius: 50%;
}

.avatar-container:hover .edit-overlay {
  opacity: 1;
}


// 上传进度
.upload-progress {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

// 矩形样式（普通图片）
.rect-preview {
  border-radius: 12rpx;
}

.rect-image {
  border-radius: 12rpx;
}

.rect-delete {
  top: -10rpx;
  right: -10rpx;
  width: 32rpx;
  height: 32rpx;
}

.rect-progress {
  border-radius: 12rpx;
}

.rect-placeholder {
  border-radius: 12rpx;
  gap: 16rpx;
}

.rect-placeholder .upload-text {
  margin-top: 16rpx;
}

.rect-placeholder .upload-desc {
  margin-top: 8rpx;
}
</style>
