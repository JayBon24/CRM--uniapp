/**
 * 报表类型定义测试
 */
import { describe, it, expect } from 'vitest'
import type {
  IndicatorType,
  UserRoleLevel,
  DataScope,
  DimensionType,
  TimeGranularity,
  ComparisonMode
} from './reports'

describe('Reports Type Definitions', () => {
  it('should have correct indicator types', () => {
    const indicatorTypes: IndicatorType[] = [
      'lead_frequency',
      'new_customers',
      'conversion_rate',
      'visit_frequency',
      'key_customer_visit_ratio',
      'visit_success_rate',
      'avg_conversation_duration',
      'visit_cycle',
      'conversion_funnel'
    ]
    
    expect(indicatorTypes).toHaveLength(9)
    expect(indicatorTypes).toContain('lead_frequency')
    expect(indicatorTypes).toContain('conversion_funnel')
  })

  it('should have correct user role levels', () => {
    const roles: UserRoleLevel[] = ['SALES', 'TEAM', 'BRANCH', 'HQ']
    expect(roles).toHaveLength(4)
  })

  it('should have correct data scopes', () => {
    const scopes: DataScope[] = ['SELF', 'TEAM', 'BRANCH', 'HQ']
    expect(scopes).toHaveLength(4)
  })

  it('should have correct dimension types', () => {
    const dimensions: DimensionType[] = ['PERSONNEL', 'BRANCH', 'SOURCE', 'GRADE', 'NONE']
    expect(dimensions).toHaveLength(5)
  })

  it('should have correct time granularities', () => {
    const granularities: TimeGranularity[] = ['day', 'week', 'month', 'quarter', 'year']
    expect(granularities).toHaveLength(5)
  })

  it('should have correct comparison modes', () => {
    const modes: ComparisonMode[] = ['yoy', 'mom', 'none']
    expect(modes).toHaveLength(3)
  })
})
