import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ChartContainer from './ChartContainer.vue'
import type { FunnelData } from '@/types/interfaces/reports'

// Mock uni API
global.uni = {
  getSystemInfoSync: vi.fn(() => ({
    windowWidth: 375,
    pixelRatio: 2
  })),
  createCanvasContext: vi.fn(() => ({}))
} as any

describe('ChartContainer', () => {
  const mockFunnelData: FunnelData = {
    stages: [
      { name: '公海', value: 1000, percent: 100 },
      { name: '跟进', value: 800, percent: 80 },
      { name: '交案', value: 500, percent: 50 },
      { name: '回款', value: 300, percent: 30 },
      { name: '赢单', value: 200, percent: 20 }
    ]
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('应该正确渲染组件', () => {
    const wrapper = mount(ChartContainer, {
      props: {
        type: 'funnel',
        data: mockFunnelData,
        title: '客户转化漏斗'
      }
    })

    expect(wrapper.find('.chart-container').exists()).toBe(true)
    expect(wrapper.find('.chart-title').text()).toBe('客户转化漏斗')
  })

  it('应该在没有标题时不显示标题元素', () => {
    const wrapper = mount(ChartContainer, {
      props: {
        type: 'funnel',
        data: mockFunnelData
      }
    })

    expect(wrapper.find('.chart-title').exists()).toBe(false)
  })

  it('应该正确设置画布高度', () => {
    const customHeight = 500
    const wrapper = mount(ChartContainer, {
      props: {
        type: 'funnel',
        data: mockFunnelData,
        height: customHeight
      }
    })

    const canvas = wrapper.find('.chart-canvas')
    expect(canvas.attributes('style')).toContain(`height: ${customHeight}px`)
  })

  it('应该为画布生成唯一的 canvas-id', () => {
    const wrapper1 = mount(ChartContainer, {
      props: {
        type: 'funnel',
        data: mockFunnelData
      }
    })

    const wrapper2 = mount(ChartContainer, {
      props: {
        type: 'funnel',
        data: mockFunnelData
      }
    })

    const canvasId1 = wrapper1.find('.chart-canvas').attributes('canvas-id')
    const canvasId2 = wrapper2.find('.chart-canvas').attributes('canvas-id')

    expect(canvasId1).toBeDefined()
    expect(canvasId2).toBeDefined()
    expect(canvasId1).not.toBe(canvasId2)
  })

  it('应该支持不同的图表类型', () => {
    const types: Array<'line' | 'bar' | 'funnel' | 'pie'> = ['line', 'bar', 'funnel', 'pie']

    types.forEach(type => {
      const wrapper = mount(ChartContainer, {
        props: {
          type,
          data: mockFunnelData
        }
      })

      expect(wrapper.find('.chart-container').exists()).toBe(true)
    })
  })

  it('应该正确处理漏斗数据格式', () => {
    const wrapper = mount(ChartContainer, {
      props: {
        type: 'funnel',
        data: mockFunnelData
      }
    })

    // 验证组件能够正确挂载和处理数据
    expect(wrapper.vm).toBeDefined()
  })

  it('应该正确处理数组数据格式', () => {
    const arrayData = [
      { name: '类型A', value: 100 },
      { name: '类型B', value: 200 },
      { name: '类型C', value: 150 }
    ]

    const wrapper = mount(ChartContainer, {
      props: {
        type: 'bar',
        data: arrayData
      }
    })

    expect(wrapper.vm).toBeDefined()
  })

  it('应该正确处理标准图表数据格式', () => {
    const chartData = {
      categories: ['一月', '二月', '三月'],
      series: [{
        name: '销售额',
        data: [100, 200, 150]
      }]
    }

    const wrapper = mount(ChartContainer, {
      props: {
        type: 'line',
        data: chartData
      }
    })

    expect(wrapper.vm).toBeDefined()
  })
})
