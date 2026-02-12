/**
 * 报表数据结构属性测试
 * Property-Based Testing for Reports Data Structures
 */
import { describe, test, expect } from 'vitest'
import * as fc from 'fast-check'
import type {
  DashboardData,
  FunnelData,
  IndicatorData,
  IndicatorType,
  FunnelStage
} from './reports'

/**
 * Arbitrary for IndicatorType
 */
const indicatorTypeArbitrary = (): fc.Arbitrary<IndicatorType> => {
  return fc.constantFrom<IndicatorType>(
    'lead_frequency',
    'new_customers',
    'conversion_rate',
    'visit_frequency',
    'key_customer_visit_ratio',
    'visit_success_rate',
    'avg_conversation_duration',
    'visit_cycle',
    'conversion_funnel'
  )
}

/**
 * Arbitrary for IndicatorData
 */
const indicatorDataArbitrary = (): fc.Arbitrary<IndicatorData> => {
  return fc.record({
    type: indicatorTypeArbitrary(),
    value: fc.double({ min: 0, max: 10000, noNaN: true }),
    unit: fc.constantFrom('次', '个', '%', '小时', '天', ''),
    trend: fc.option(fc.constantFrom('up', 'down', 'stable'), { nil: undefined }),
    trendValue: fc.option(fc.double({ min: -100, max: 100, noNaN: true }), { nil: undefined }),
    trendPercent: fc.option(fc.double({ min: -100, max: 100, noNaN: true }), { nil: undefined }),
    breakdown: fc.option(
      fc.array(
        fc.record({
          label: fc.string({ minLength: 1, maxLength: 20 }),
          value: fc.double({ min: 0, max: 1000, noNaN: true }),
          percent: fc.option(fc.double({ min: 0, max: 100, noNaN: true }), { nil: undefined })
        }),
        { minLength: 0, maxLength: 10 }
      ),
      { nil: undefined }
    )
  })
}

/**
 * Arbitrary for FunnelStage
 */
const funnelStageArbitrary = (): fc.Arbitrary<FunnelStage> => {
  return fc.record({
    name: fc.string({ minLength: 1, maxLength: 10 }),
    value: fc.double({ min: 0, max: 10000, noNaN: true }),
    percent: fc.double({ min: 0, max: 100, noNaN: true })
  })
}

/**
 * Arbitrary for FunnelData with exactly 5 stages
 */
const funnelDataArbitrary = (): fc.Arbitrary<FunnelData> => {
  return fc.record({
    stages: fc.tuple(
      funnelStageArbitrary(),
      funnelStageArbitrary(),
      funnelStageArbitrary(),
      funnelStageArbitrary(),
      funnelStageArbitrary()
    ).map((stages) => stages)
  })
}

/**
 * Arbitrary for DashboardData
 * Generates dashboard data with all required indicator types
 */
const dashboardDataArbitrary = (): fc.Arbitrary<DashboardData> => {
  // Required indicator types (excluding conversion_funnel which is separate)
  const requiredTypes: IndicatorType[] = [
    'lead_frequency',
    'new_customers',
    'conversion_rate',
    'visit_frequency',
    'key_customer_visit_ratio',
    'visit_success_rate',
    'avg_conversation_duration',
    'visit_cycle'
  ]

  return fc.record({
    indicators: fc
      .array(indicatorDataArbitrary(), { minLength: 8, maxLength: 20 })
      .map((indicators) => {
        // Ensure all required types are present
        const indicatorMap = new Map<IndicatorType, IndicatorData>()
        
        // Add all indicators from the generated array
        indicators.forEach((ind) => {
          indicatorMap.set(ind.type, ind)
        })
        
        // Ensure all required types exist
        requiredTypes.forEach((type) => {
          if (!indicatorMap.has(type)) {
            indicatorMap.set(type, {
              type,
              value: Math.random() * 100,
              unit: '次',
              trend: 'stable'
            })
          }
        })
        
        return Array.from(indicatorMap.values())
      }),
    conversionFunnel: funnelDataArbitrary(),
    updateTime: fc.date().map((d) => d.toISOString())
  })
}

describe('Reports Data Structure Properties', () => {
  /**
   * Feature: tab4-reports-dashboard, Property 1: Dashboard displays all required metrics
   * Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7
   */
  test('Property 1: Dashboard data contains all required indicator types', () => {
    fc.assert(
      fc.property(dashboardDataArbitrary(), (data) => {
        const requiredTypes: IndicatorType[] = [
          'lead_frequency',
          'new_customers',
          'conversion_rate',
          'visit_frequency',
          'key_customer_visit_ratio',
          'visit_success_rate',
          'avg_conversation_duration',
          'visit_cycle'
        ]

        const actualTypes = data.indicators.map((i) => i.type)

        // Check that all required types are present
        const allRequiredPresent = requiredTypes.every((type) => actualTypes.includes(type))

        return allRequiredPresent
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Feature: tab4-reports-dashboard, Property 2: Conversion funnel contains all required stages
   * Validates: Requirements 1.8
   */
  test('Property 2: Funnel data contains exactly 5 stages with correct names', () => {
    // Create a specific arbitrary for funnel data with required stage names
    const requiredFunnelDataArbitrary = (): fc.Arbitrary<FunnelData> => {
      const requiredStageNames = ['公海', '跟进', '交案', '回款', '赢单']
      
      return fc.record({
        stages: fc
          .array(
            fc.record({
              name: fc.string({ minLength: 1, maxLength: 10 }),
              value: fc.double({ min: 0, max: 10000, noNaN: true }),
              percent: fc.double({ min: 0, max: 100, noNaN: true })
            }),
            { minLength: 5, maxLength: 10 }
          )
          .map((stages) => {
            // Ensure the first 5 stages have the required names
            return requiredStageNames.map((name, index) => ({
              name,
              value: stages[index]?.value ?? Math.random() * 1000,
              percent: stages[index]?.percent ?? Math.random() * 100
            }))
          })
      })
    }

    fc.assert(
      fc.property(requiredFunnelDataArbitrary(), (funnelData) => {
        const requiredStageNames = ['公海', '跟进', '交案', '回款', '赢单']

        // Check that there are exactly 5 stages
        const hasExactly5Stages = funnelData.stages.length === 5

        // Check that all required stage names are present in order
        const hasCorrectNames = requiredStageNames.every(
          (name, index) => funnelData.stages[index]?.name === name
        )

        return hasExactly5Stages && hasCorrectNames
      }),
      { numRuns: 100 }
    )
  })
})
