<template>
  <view class="chart-container">
    <view class="chart-title" v-if="title">{{ title }}</view>

    <view v-if="type === 'funnel'" class="chart-funnel">
      <view class="funnel-fallback">
        <view
          v-for="stage in funnelStages"
          :key="stage.name"
          class="funnel-item"
        >
          <view class="funnel-label">
            <text class="funnel-name">{{ stage.name }}</text>
            <view class="funnel-values">
              <text class="funnel-value">{{ stage.value }}</text>
              <text class="funnel-percent">{{ stage.percent }}%</text>
            </view>
          </view>
          <view class="funnel-bar-bg">
            <view
              class="funnel-bar"
              :style="{ width: stage.width + '%', backgroundColor: stage.color }"
            ></view>
          </view>
        </view>
      </view>
    </view>

    <!-- iOS 上不使用 scroll-view，避免 canvas 定位问题 -->
    <view v-if="type !== 'funnel'" class="chart-canvas-wrapper" :id="`wrapper-${canvasId}`" :style="{ height: height + 'px' }">
      <!-- iOS 上使用 type="2d" 的新 API -->
      <!-- #ifdef APP-PLUS -->
      <canvas
        :id="canvasId"
        type="2d"
        class="chart-canvas"
        :style="{ height: height + 'px', width: '100%', display: 'block', position: 'static' }"
        @touchend="handleCanvasTouchEnd"
      ></canvas>
      <!-- #endif -->
      <!-- #ifdef MP-WEIXIN -->
      <canvas
        v-if="useMpWeixin2d"
        :id="canvasId"
        type="2d"
        class="chart-canvas"
        :style="{ height: height + 'px', width: '100%', display: 'block', position: 'static' }"
        @touchend="handleCanvasTouchEnd"
      ></canvas>
      <canvas
        v-else
        :id="canvasId"
        :canvas-id="canvasId"
        class="chart-canvas"
        :style="{ height: height + 'px', width: '100%', display: 'block', position: 'static' }"
        @touchend="handleCanvasTouchEnd"
      ></canvas>
      <!-- #endif -->
      <!-- 其他平台使用旧 API -->
      <!-- #ifndef APP-PLUS -->
      <!-- #ifndef MP-WEIXIN -->
      <canvas
        :id="canvasId"
        :canvas-id="canvasId"
        class="chart-canvas"
        :style="{ height: height + 'px', width: '100%', display: 'block', position: 'static' }"
        @touchend="handleCanvasTouchEnd"
      ></canvas>
      <!-- #endif -->
      <!-- #endif -->
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, getCurrentInstance, nextTick } from 'vue'
import type { FunnelData } from '@/types/interfaces/reports'

interface ChartDataPoint {
  name: string
  value: number
  percent?: number
}

interface ChartData {
  categories?: string[]
  series: Array<{
    name: string
    data: number[]
  }>
}

interface Props {
  type: 'line' | 'bar' | 'funnel' | 'pie'
  data: FunnelData | ChartData | ChartDataPoint[]
  title?: string
  height?: number
  activePointIndex?: number | null
  options?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  type: 'funnel',
  height: 400,
  activePointIndex: null,
  options: () => ({})
})

const emit = defineEmits<{
  ready: [chart: any]
  pointClick: [point: { index: number; label: string; value: number; comparisonValue?: number }]
}>()

const instance = getCurrentInstance()
const canvasId = `chart-${Math.random().toString(36).substr(2, 9)}`
const canvasRect = ref({ width: 0, height: 0 })
const canvasOffsetLeft = ref(0)
const linePointMeta = ref<Array<{ index: number; x: number; y: number; label: string; value: number; comparisonValue?: number }>>([])
const isIOS = (uni.getSystemInfoSync?.().platform || '').toLowerCase() === 'ios'
// #ifdef MP-WEIXIN
const useMpWeixin2d = isIOS
// #endif

const colors = ['#3370ff', '#5b8ff9', '#61ddaa', '#f6bd16', '#7262fd']

const needScroll = computed(() => {
  // iOS 上禁用 scroll-view，避免 canvas 定位问题
  // #ifdef APP-PLUS
  return false
  // #endif
  
  // 其他平台保持原有逻辑
  if (props.type === 'line' || props.type === 'bar') {
    const data = props.data as ChartData
    const dataCount = data.categories?.length || 0
    // 提高阈值，减少使用 scroll-view 的情况
    return dataCount > 50
  }
  return false
})

const chartWidth = computed(() => {
  if (props.type === 'line' || props.type === 'bar') {
    const data = props.data as ChartData
    const dataCount = data.categories?.length || 0
    if (dataCount > 30) {
      return dataCount * 18
    }
  }
  return 0
})

const funnelStages = computed(() => {
  if (props.type !== 'funnel') return []
  const data = props.data as FunnelData
  const stages = data?.stages || []
  const max = Math.max(1, ...stages.map(s => s.value || 0))
  return stages.map((stage, index) => ({
    ...stage,
    width: Math.round((stage.value / max) * 100),
    color: colors[index % colors.length]
  }))
})

const resolveCanvasRect = async () => {
  await nextTick()
  return new Promise<void>((resolve) => {
    // 先尝试获取容器尺寸
    const containerQuery = uni.createSelectorQuery().in(instance?.proxy)
    containerQuery.select('.chart-container').boundingClientRect((containerRect: any) => {
      let calculatedWidth = 0
      
      if (containerRect && containerRect.width > 0) {
        // 使用容器宽度减去 padding (32rpx * 2 = 64rpx，约等于 32px)
        calculatedWidth = containerRect.width - 32
        console.log('[ChartContainer] Canvas rect from container:', {
          containerWidth: containerRect.width,
          calculatedWidth
        })
      } else {
        // iOS 上可能获取不到，使用系统信息作为 fallback
        const systemInfo = uni.getSystemInfoSync()
        // 减去左右 padding 和页面 padding (16px * 2 = 32px)
        calculatedWidth = systemInfo.windowWidth - 64
        console.log('[ChartContainer] Canvas rect fallback (iOS):', {
          windowWidth: systemInfo.windowWidth,
          calculatedWidth
        })
      }
      
      // 再尝试获取 canvas 实际尺寸
      const canvasQuery = uni.createSelectorQuery().in(instance?.proxy)
      canvasQuery.select(`#${canvasId}`).boundingClientRect((rect: any) => {
        if (rect && rect.width > 0) {
          canvasRect.value = { width: rect.width, height: rect.height || props.height }
          canvasOffsetLeft.value = rect.left || 0
          console.log('[ChartContainer] Canvas rect from query:', canvasRect.value)
        } else {
          // 使用计算出的宽度
          canvasRect.value = { 
            width: calculatedWidth > 0 ? calculatedWidth : (uni.getSystemInfoSync().windowWidth - 64), 
            height: props.height 
          }
          canvasOffsetLeft.value = 0
          console.log('[ChartContainer] Canvas rect using calculated width:', canvasRect.value)
        }
        resolve()
      }).exec()
      
      // 如果查询超时，使用 fallback
      setTimeout(() => {
        if (canvasRect.value.width === 0 || canvasRect.value.width < 100) {
          const systemInfo = uni.getSystemInfoSync()
          const fallbackWidth = calculatedWidth > 0 ? calculatedWidth : (systemInfo.windowWidth - 64)
          canvasRect.value = { width: fallbackWidth, height: props.height }
          canvasOffsetLeft.value = 0
          console.log('[ChartContainer] Canvas rect timeout fallback:', canvasRect.value)
          resolve()
        }
      }, 500)
    }).exec()
  })
}

const getMaxValue = (series: ChartData['series']): number => {
  const values: number[] = []
  series.forEach(item => {
    item.data.forEach(val => values.push(val))
  })
  return Math.max(1, ...values)
}

const drawAxes = (ctx: any, width: number, height: number, padding: any, isNewAPI: boolean = false) => {
  if (isNewAPI) {
    // 新 API (type="2d")
    ctx.strokeStyle = '#e5e6eb'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(padding.left, height - padding.bottom)
    ctx.lineTo(width - padding.right, height - padding.bottom)
    ctx.stroke()
  } else {
    // 旧 API
    ctx.setStrokeStyle('#e5e6eb')
    ctx.setLineWidth(1)
    ctx.beginPath()
    ctx.moveTo(padding.left, height - padding.bottom)
    ctx.lineTo(width - padding.right, height - padding.bottom)
    ctx.stroke()
  }
}

const drawLineChart = (ctx: any, width: number, height: number, isNewAPI: boolean = false) => {
  const data = props.data as ChartData
  if (!data.categories || !data.series || data.series.length === 0) return
  linePointMeta.value = []

  const padding = { left: 6, right: 6, top: 10, bottom: 24 }
  const plotWidth = width - padding.left - padding.right
  const plotHeight = height - padding.top - padding.bottom
  if (plotWidth <= 0 || plotHeight <= 0) return

  const maxValue = getMaxValue(data.series)
  drawAxes(ctx, width, height, padding, isNewAPI)

  // 优化：当数据点多时，自动调整标签显示间隔
  const categoryCount = data.categories.length
  let step = Math.max(1, Math.ceil(categoryCount / 6))
  
  // 如果数据点很多，增加间隔以适配屏幕宽度
  if (categoryCount > 20) {
    step = Math.max(1, Math.ceil(categoryCount / 5))
  }
  
  if (isNewAPI) {
    // 新 API
    ctx.font = '10px sans-serif'
    ctx.fillStyle = '#8f959e'
    data.categories.forEach((label, index) => {
      if (index % step !== 0 && index !== data.categories.length - 1) return
      const x = padding.left + (plotWidth * index) / Math.max(1, data.categories.length - 1)
      ctx.fillText(label, Math.max(0, x - 10), height - 8)
    })

    data.series.forEach((seriesItem, seriesIndex) => {
      const color = colors[seriesIndex % colors.length]
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.beginPath()

      seriesItem.data.forEach((value, index) => {
        const x = padding.left + (plotWidth * index) / Math.max(1, seriesItem.data.length - 1)
        const y = padding.top + plotHeight * (1 - value / maxValue)
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()

      seriesItem.data.forEach((value, index) => {
        const x = padding.left + (plotWidth * index) / Math.max(1, seriesItem.data.length - 1)
        const y = padding.top + plotHeight * (1 - value / maxValue)
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fill()
      })
    })
  } else {
    // 旧 API
    ctx.setFontSize(10)
    ctx.setFillStyle('#8f959e')
    data.categories.forEach((label, index) => {
      if (index % step !== 0 && index !== data.categories.length - 1) return
      const x = padding.left + (plotWidth * index) / Math.max(1, data.categories.length - 1)
      ctx.fillText(label, Math.max(0, x - 10), height - 8)
    })

    data.series.forEach((seriesItem, seriesIndex) => {
      const color = colors[seriesIndex % colors.length]
      ctx.setStrokeStyle(color)
      ctx.setLineWidth(2)
      ctx.beginPath()

      seriesItem.data.forEach((value, index) => {
        const x = padding.left + (plotWidth * index) / Math.max(1, seriesItem.data.length - 1)
        const y = padding.top + plotHeight * (1 - value / maxValue)
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()

      seriesItem.data.forEach((value, index) => {
        const x = padding.left + (plotWidth * index) / Math.max(1, seriesItem.data.length - 1)
        const y = padding.top + plotHeight * (1 - value / maxValue)
        ctx.setFillStyle(color)
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fill()
      })
    })
  }

  const primarySeries = data.series[0]?.data || []
  const compareSeries = data.series[1]?.data || []
  linePointMeta.value = data.categories.map((label, index) => {
    const x = padding.left + (plotWidth * index) / Math.max(1, data.categories!.length - 1)
    const y = padding.top + plotHeight * (1 - Number(primarySeries[index] || 0) / maxValue)
    return {
      index,
      x,
      y,
      label,
      value: Number(primarySeries[index] || 0),
      comparisonValue: compareSeries[index] !== undefined ? Number(compareSeries[index]) : undefined
    }
  })

  const activeIndex = props.activePointIndex
  if (activeIndex === null || activeIndex === undefined) return
  const activePoint = linePointMeta.value.find(point => point.index === activeIndex)
  if (!activePoint) return

  if (isNewAPI) {
    ctx.beginPath()
    ctx.fillStyle = '#FFFFFF'
    ctx.arc(activePoint.x, activePoint.y, 7, 0, Math.PI * 2)
    ctx.fill()
    ctx.lineWidth = 2
    ctx.strokeStyle = '#3370ff'
    ctx.stroke()
    ctx.beginPath()
    ctx.fillStyle = '#3370ff'
    ctx.arc(activePoint.x, activePoint.y, 3.5, 0, Math.PI * 2)
    ctx.fill()
  } else {
    ctx.beginPath()
    ctx.setFillStyle('#FFFFFF')
    ctx.arc(activePoint.x, activePoint.y, 7, 0, Math.PI * 2)
    ctx.fill()
    ctx.setLineWidth(2)
    ctx.setStrokeStyle('#3370ff')
    ctx.stroke()
    ctx.beginPath()
    ctx.setFillStyle('#3370ff')
    ctx.arc(activePoint.x, activePoint.y, 3.5, 0, Math.PI * 2)
    ctx.fill()
  }
}

const drawBarChart = (ctx: any, width: number, height: number, isNewAPI: boolean = false) => {
  const data = props.data as ChartData
  if (!data.categories || !data.series || data.series.length === 0) return
  linePointMeta.value = []

  const padding = { left: 6, right: 6, top: 10, bottom: 24 }
  const plotWidth = width - padding.left - padding.right
  const plotHeight = height - padding.top - padding.bottom
  if (plotWidth <= 0 || plotHeight <= 0) return

  const maxValue = getMaxValue(data.series)
  drawAxes(ctx, width, height, padding, isNewAPI)

  const groupWidth = plotWidth / data.categories.length
  const barGroupWidth = groupWidth * 0.7
  const barWidth = barGroupWidth / data.series.length

  if (isNewAPI) {
    // 新 API
    ctx.font = '10px sans-serif'
    ctx.fillStyle = '#8f959e'
    data.categories.forEach((label, index) => {
      const xLabel = padding.left + groupWidth * index + groupWidth * 0.1
      ctx.fillText(label, Math.max(0, xLabel), height - 8)
    })

    data.series.forEach((seriesItem, seriesIndex) => {
      const color = colors[seriesIndex % colors.length]
      ctx.fillStyle = color

      seriesItem.data.forEach((value, index) => {
        const x = padding.left + groupWidth * index + groupWidth * 0.15 + barWidth * seriesIndex
        const barHeight = plotHeight * (value / maxValue)
        const y = padding.top + plotHeight - barHeight
        ctx.fillRect(x, y, barWidth - 2, barHeight)
      })
    })
  } else {
    // 旧 API
    ctx.setFontSize(10)
    ctx.setFillStyle('#8f959e')
    data.categories.forEach((label, index) => {
      const xLabel = padding.left + groupWidth * index + groupWidth * 0.1
      ctx.fillText(label, Math.max(0, xLabel), height - 8)
    })

    data.series.forEach((seriesItem, seriesIndex) => {
      const color = colors[seriesIndex % colors.length]
      ctx.setFillStyle(color)

      seriesItem.data.forEach((value, index) => {
        const x = padding.left + groupWidth * index + groupWidth * 0.15 + barWidth * seriesIndex
        const barHeight = plotHeight * (value / maxValue)
        const y = padding.top + plotHeight - barHeight
        ctx.fillRect(x, y, barWidth - 2, barHeight)
      })
    })
  }
}

const handleCanvasTouchEnd = (event: any) => {
  if (props.type !== 'line' || linePointMeta.value.length === 0) return
  const touch = event?.changedTouches?.[0] || event?.touches?.[0]
  const width = canvasRect.value.width > 0 ? canvasRect.value.width : (uni.getSystemInfoSync().windowWidth || 0)
  const touchLocalX = touch?.x
  let localX: number | null = null
  if (typeof touchLocalX === 'number' && touchLocalX >= 0 && touchLocalX <= width + 2) {
    localX = touchLocalX
  } else {
    const pageX = touch?.pageX ?? touch?.clientX ?? touch?.x
    if (typeof pageX === 'number') {
      localX = pageX - canvasOffsetLeft.value
    }
  }
  if (typeof localX !== 'number') return
  localX = Math.max(0, Math.min(localX, width))
  let nearest = linePointMeta.value[0]
  let minDelta = Math.abs(localX - nearest.x)
  for (let index = 1; index < linePointMeta.value.length; index += 1) {
    const point = linePointMeta.value[index]
    const delta = Math.abs(localX - point.x)
    if (delta < minDelta) {
      minDelta = delta
      nearest = point
    }
  }
  if (minDelta > 24) return
  emit('pointClick', {
    index: nearest.index,
    label: nearest.label,
    value: nearest.value,
    comparisonValue: nearest.comparisonValue
  })
}

const drawChart = async () => {
  if (props.type === 'funnel') return
  if (props.type !== 'line' && props.type !== 'bar') return
  
  // 验证数据
  const data = props.data as ChartData
  if (!data || !data.series || data.series.length === 0) {
    console.warn('[ChartContainer] drawChart - 数据无效', { data })
    return
  }
  
  // 验证系列数据
  const hasValidData = data.series.some(series => series.data && series.data.length > 0)
  if (!hasValidData) {
    console.warn('[ChartContainer] drawChart - 系列数据为空')
    return
  }
  
  console.log('[ChartContainer] drawChart - 开始绘制', {
    type: props.type,
    hasData: !!props.data,
    seriesCount: data.series.length,
    categoriesCount: data.categories?.length || 0
  })
  
  await resolveCanvasRect()
  // iOS 上不使用 scroll-view，始终使用容器宽度
  let width = canvasRect.value.width
  const height = props.height
  
  // 如果宽度仍然无效，使用系统信息作为最后的后备
  if (!width || width <= 0) {
    const systemInfo = uni.getSystemInfoSync()
    width = systemInfo.windowWidth - 64 // 减去 padding
    console.warn('[ChartContainer] drawChart - 使用系统信息计算宽度', { width })
  }
  
  console.log('[ChartContainer] drawChart - 尺寸信息', {
    width,
    height,
    canvasRect: canvasRect.value,
    needScroll: needScroll.value,
    chartWidth: chartWidth.value
  })
  
  if (!width || width <= 0 || !height || height <= 0) {
    console.warn('[ChartContainer] drawChart - 尺寸无效，无法绘制', { width, height })
    return
  }
  
  // 确保宽度不超过屏幕宽度（iOS 上特别重要）
  const systemInfo = uni.getSystemInfoSync()
  const maxWidth = systemInfo.windowWidth - 64
  if (width > maxWidth) {
    width = maxWidth
    console.warn('[ChartContainer] drawChart - 宽度超出屏幕，调整为', { width, maxWidth })
  }

  try {
    // iOS 上使用不同的方式创建 context
    // #ifdef APP-PLUS
    // iOS 上尝试使用新 API
    const query = uni.createSelectorQuery().in(instance?.proxy)
    query.select(`#${canvasId}`).fields({ node: true, size: true }).exec((res: any) => {
      if (res && res[0] && res[0].node) {
        // 使用新 API
        const canvasNode = res[0].node
        const ctx = canvasNode.getContext('2d')
        if (ctx) {
          const dpr = uni.getSystemInfoSync().pixelRatio || 1
          canvasNode.width = width * dpr
          canvasNode.height = height * dpr
          ctx.scale(dpr, dpr)
          
          ctx.clearRect(0, 0, width, height)
          
          if (props.type === 'line') {
            drawLineChart(ctx, width, height, true) // 使用新 API
          } else if (props.type === 'bar') {
            drawBarChart(ctx, width, height, true) // 使用新 API
          }
          
          console.log('[ChartContainer] drawChart - 绘制完成（iOS 新 API）')
          emit('ready', ctx)
          return
        }
      }
      
      // fallback: 使用旧 API
      const ctx = uni.createCanvasContext(canvasId, instance?.proxy)
      if (!ctx) {
        console.error('[ChartContainer] drawChart - 无法创建 canvas context')
        return
      }
      
      ctx.clearRect(0, 0, width, height)
      
      if (props.type === 'line') {
        drawLineChart(ctx, width, height, false) // 使用旧 API
      } else if (props.type === 'bar') {
        drawBarChart(ctx, width, height, false) // 使用旧 API
      }
      
      ctx.draw(true)
      console.log('[ChartContainer] drawChart - 绘制完成（iOS fallback）')
      emit('ready', ctx)
    })
    // #endif
    
    // #ifdef MP-WEIXIN
    if (useMpWeixin2d) {
      const wxQuery = uni.createSelectorQuery().in(instance?.proxy)
      wxQuery.select(`#${canvasId}`).fields({ node: true, size: true }).exec((res: any) => {
        if (!res || !res[0] || !res[0].node) {
          console.error('[ChartContainer] drawChart - canvas node not found')
          return
        }
        const canvasNode = res[0].node
        const ctx = canvasNode.getContext('2d')
        if (!ctx) {
          console.error('[ChartContainer] drawChart - canvas context not available')
          return
        }
        const dpr = uni.getSystemInfoSync().pixelRatio || 1
        canvasNode.width = width * dpr
        canvasNode.height = height * dpr
        ctx.scale(dpr, dpr)
        ctx.clearRect(0, 0, width, height)
        if (props.type === 'line') {
          drawLineChart(ctx, width, height, true)
        } else if (props.type === 'bar') {
          drawBarChart(ctx, width, height, true)
        }
        console.log('[ChartContainer] drawChart - draw done (mp-weixin 2d)')
        emit('ready', ctx)
      })
    } else {
      const ctx = uni.createCanvasContext(canvasId, instance?.proxy)
      if (!ctx) {
        console.error('[ChartContainer] drawChart - canvas context not available')
        return
      }
      ctx.clearRect(0, 0, width, height)
      if (props.type === 'line') {
        drawLineChart(ctx, width, height, false)
      } else if (props.type === 'bar') {
        drawBarChart(ctx, width, height, false)
      }
      ctx.draw(true)
      console.log('[ChartContainer] drawChart - draw done (mp-weixin legacy)')
      emit('ready', ctx)
    }
    // #endif
    
    // #ifndef APP-PLUS
    // #ifndef MP-WEIXIN
    // 非 iOS 平台使用原有方式
    const ctx = uni.createCanvasContext(canvasId, instance?.proxy)
    if (!ctx) {
      console.error('[ChartContainer] drawChart - 无法创建 canvas context')
      return
    }
    
    ctx.clearRect(0, 0, width, height)
    
    if (props.type === 'line') {
      drawLineChart(ctx, width, height, false) // 使用旧 API
    } else if (props.type === 'bar') {
      drawBarChart(ctx, width, height, false) // 使用旧 API
    }
    
    ctx.draw(true)
    console.log('[ChartContainer] drawChart - 绘制完成')
    emit('ready', ctx)
    // #endif
    // #endif
  } catch (error) {
    console.error('[ChartContainer] drawChart - 绘制失败:', error)
  }
}

onMounted(() => {
  if (isIOS) {
    setTimeout(() => {
      drawChart()
    }, 120)
    return
  }

  let retryCount = 0
  const maxRetries = 5

  const tryDraw = () => {
    retryCount++
    console.log(`[ChartContainer] onMounted - draw (${retryCount}/${maxRetries})`)
    canvasRect.value = { width: 0, height: 0 }
    drawChart()
    if (retryCount < maxRetries) {
      setTimeout(() => {
        tryDraw()
      }, 300)
    }
  }

  setTimeout(() => {
    tryDraw()
  }, 300)
})

watch(() => props.data, () => {
  const delay = isIOS ? 120 : 300
  setTimeout(() => {
    drawChart()
  }, delay)
}, { deep: true })

watch(() => props.height, () => {
  console.log('[ChartContainer] watch height - 高度变化，重新绘制')
  setTimeout(() => {
    drawChart()
  }, 300)
})

watch(() => props.activePointIndex, () => {
  const delay = isIOS ? 80 : 0
  setTimeout(() => {
    drawChart()
  }, delay)
})
</script>

<style scoped lang="scss">
.chart-container {
  width: 100%;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  box-shadow: 0 2rpx 8rpx rgba(31, 35, 41, 0.04);
  box-sizing: border-box;
  /* iOS 上确保容器正确显示 */
  position: relative !important;
  overflow: visible;
  /* 确保容器不会脱离文档流 */
  z-index: auto;
  /* iOS 上防止定位问题 */
  left: auto !important;
  top: auto !important;
  right: auto !important;
}

.chart-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1f2329;
  margin-bottom: 32rpx;
}

/* scroll-view 在 iOS 上会导致 canvas 定位问题，已禁用 */
.chart-scroll {
  width: 100%;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  /* iOS 上不使用 */
  display: none;
}

.chart-canvas-wrapper {
  width: 100%;
  position: relative;
  overflow: visible;
  min-height: 1px;
  flex-shrink: 0;
  display: block;
}


.chart-canvas {
  width: 100% !important;
  display: block !important;
  vertical-align: top;
  /* iOS 上确保 canvas 可见 */
  visibility: visible !important;
  opacity: 1 !important;
  /* iOS 上确保 canvas 正确定位 - 使用 static 而不是 relative */
  position: static !important;
  /* 防止 canvas 被压缩 */
  flex-shrink: 0;
  /* iOS 上确保 canvas 在容器内 */
  box-sizing: border-box !important;
  /* 防止 iOS 上的渲染问题 */
  -webkit-transform: none !important;
  transform: none !important;
  /* iOS 上确保 canvas 不会脱离文档流 */
  left: auto !important;
  top: auto !important;
  right: auto !important;
  margin: 0 !important;
  padding: 0 !important;
  /* 确保 canvas 在容器内 */
  z-index: auto;
}

.chart-funnel {
  position: relative;
}

.funnel-fallback {
  padding: 24rpx 32rpx 0;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 16rpx rgba(31, 35, 41, 0.08);
}

.funnel-item {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.funnel-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 24rpx;
  color: #1f2329;
}

.funnel-values {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.funnel-name {
  flex: 1;
}

.funnel-value {
  margin-left: 12rpx;
  color: #111827;
  font-weight: 600;
}

.funnel-percent {
  margin-left: 12rpx;
  color: #8f959e;
}

.funnel-bar-bg {
  width: 100%;
  height: 24rpx;
  background: #eef2f6;
  border-radius: 999rpx;
  overflow: hidden;
}

.funnel-bar {
  height: 100%;
  border-radius: 999rpx;
}
</style>
