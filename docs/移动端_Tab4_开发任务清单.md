# 移动端 Tab4「数据报表」开发任务清单（可勾选）

> 说明：本清单基于 `.kiro/specs/tab4-reports-dashboard/` 规范文档。  
> 约定：每完成一项就在此处勾选，并同步更新 `docs/Tab4测试预期.md`。
>
> AI 预留：Tab4 的 AI 整改建议功能需预留 AI 分析与建议生成扩展点，统一规范见 `docs/AI接入与扩展点规范.md`。

---

## 0. 基础约定（命名与目录）

- Tab 页入口：`src/pages/tab/reports.vue`
- 子页面统一放：`src/pages/other/reports/**`
- 组件统一放：`src/components/reports/**`
- 图表库选择：**uCharts**（UniApp 生态，跨平台支持好）

---

## 1. 类型与枚举（src/types/interfaces）

- [ ] 新增 `src/types/interfaces/reports.ts`
  - [ ] 定义 `UserRoleLevel`（复用 user.ts 中的定义）
  - [ ] 定义 `DataScope`（SELF/TEAM/BRANCH/HQ）
  - [ ] 定义 `DimensionType`（PERSONNEL/BRANCH/SOURCE/GRADE/NONE）
  - [ ] 定义 `TimeGranularity`（day/week/month/quarter/year）
  - [ ] 定义 `ComparisonMode`（yoy/mom/none）
  - [ ] 定义 `IndicatorType`（9种指标类型）
  - [ ] 定义数据结构接口：
    - [ ] `DimensionFilter`（维度筛选参数）
    - [ ] `TimeRange`（时间范围）
    - [ ] `IndicatorData`（指标数据）
    - [ ] `DashboardData`（看板数据）
    - [ ] `FunnelData`（漏斗数据）
    - [ ] `IndicatorDetailData`（指标详情数据）
    - [ ] `Report`（报告数据）
    - [ ] `AISuggestion`（AI建议数据）

---

## 2. Mock 与 API（先让 Tab4 可本地跑通）

### 2.1 Mock handlers
- [ ] 新增 `src/mock/reports.ts`
  - [ ] `GET /api/reports/dashboard`：返回看板数据（8个指标 + 漏斗）
  - [ ] `GET /api/reports/indicator/detail`：返回指标详情（趋势数据 + 维度拆分）
  - [ ] `GET /api/reports/report/list`：返回报告列表
  - [ ] `POST /api/reports/report/generate`：生成报告
  - [ ] `GET /api/reports/report/:id`：获取报告详情
  - [ ] `POST /api/reports/report/:id/export`：导出报告
  - [ ] `POST /api/reports/report/:id/share`：分享报告
  - [ ] `GET /api/reports/ai/suggestions`：获取AI建议（可选）
  - [ ] Mock 数据生成逻辑：
    - [ ] 使用 dayjs 生成时间序列数据
    - [ ] 根据角色生成不同范围的数据
    - [ ] 确保漏斗数据递减关系
    - [ ] 生成边界情况数据（空数据、极值）

### 2.2 注册 mock
- [ ] 修改 `src/mock/index.ts`
  - [ ] `import reportsMock from './reports'`
  - [ ] 合并到 `allMockHandlers`

### 2.3 API 封装
- [ ] 新增 `src/api/reports.ts`
  - [ ] `getDashboardData(params)` - 调用 `GET /api/reports/dashboard`
  - [ ] `getIndicatorDetail(params)` - 调用 `GET /api/reports/indicator/detail`
  - [ ] `getReportList(params)` - 调用 `GET /api/reports/report/list`
  - [ ] `generateReport(params)` - 调用 `POST /api/reports/report/generate`
  - [ ] `getReportDetail(reportId)` - 调用 `GET /api/reports/report/:id`
  - [ ] `exportReport(params)` - 调用 `POST /api/reports/report/:id/export`
  - [ ] `shareReport(reportId, userIds)` - 调用 `POST /api/reports/report/:id/share`
  - [ ] `getAISuggestions(params)` - 调用 `GET /api/reports/ai/suggestions`（可选）
  - [ ] 统一使用 unwrapData 解包响应数据（参考 `src/api/client.ts`）

---

## 3. 核心组件实现

### 3.1 指标卡片组件
- [ ] 新增 `src/components/reports/MetricCard.vue`
  - [ ] Props 定义：title, value, unit, trend, trendValue, icon, clickable
  - [ ] 展示指标值和单位
  - [ ] 展示趋势指示器（上升/下降/持平）
  - [ ] 支持点击事件（跳转到指标详情）
  - [ ] 响应式布局适配

### 3.2 维度筛选器组件
- [ ] 新增 `src/components/reports/DimensionFilter.vue`
  - [ ] Props 定义：roleLevel, modelValue
  - [ ] 根据角色动态生成筛选选项：
    - [ ] SALES：仅个人 + 团队概览（无明细）
    - [ ] BRANCH：本所 + 销售人员维度
    - [ ] HQ：全所 + 分所维度
  - [ ] 支持 v-model 双向绑定
  - [ ] 选择变化时触发 update:modelValue 事件

### 3.3 图表容器组件
- [ ] 新增 `src/components/reports/ChartContainer.vue`
  - [ ] Props 定义：type, data, options, height
  - [ ] 集成 uCharts 图表库
  - [ ] 支持图表类型：line（折线图）、bar（柱状图）、funnel（漏斗图）、pie（饼图）
  - [ ] 图表配置生成逻辑
  - [ ] 响应式尺寸适配
  - [ ] 错误处理（图表渲染失败时显示提示）

### 3.4 时间范围选择器
- [ ] 新增 `src/components/reports/TimeRangeSelector.vue`
  - [ ] Props 定义：modelValue, granularity
  - [ ] 支持粒度选择：日/周/月/季度/年
  - [ ] 支持自定义时间范围选择
  - [ ] 日期计算逻辑（dayjs）
  - [ ] 支持 v-model 双向绑定

---

## 4. Tab4 页面实现（P4-1 ~ P4-4）

### 4.1 P4-1 数据看板页面（Tab）
- [ ] 改造 `src/pages/tab/reports.vue`
  - [ ] 顶部维度筛选器（DimensionFilter 组件）
  - [ ] 8个指标卡片展示（MetricCard 组件）：
    - [ ] 跟进频次（个人/团队）
    - [ ] 新客户线索获取量
    - [ ] 有效线索转化率（公海→跟进）
    - [ ] 客户拜访频次、重点客户拜访占比
    - [ ] 拜访成功率
    - [ ] 单客户平均洽谈时长
    - [ ] 客户拜访周期
  - [ ] 客户转化漏斗图（ChartContainer 组件）
    - [ ] 5个阶段：公海 → 跟进 → 交案 → 回款 → 赢单
  - [ ] 下拉刷新功能
  - [ ] 加载状态指示器
  - [ ] 空数据状态展示
  - [ ] 错误状态展示和重试按钮
  - [ ] 使用 composable: `useReportsDashboard`

### 4.2 P4-2 指标详情页面
- [ ] 新增 `src/pages/other/reports/indicator-detail.vue`
  - [ ] 接收路由参数：indicatorType
  - [ ] 顶部筛选区：
    - [ ] 时间范围选择器（TimeRangeSelector 组件）
    - [ ] 对比模式选择器（同比/环比/无对比）
    - [ ] 维度拆分选择器（人员/分所/来源渠道/客户等级）
  - [ ] 趋势图表展示（ChartContainer 组件）
    - [ ] 折线图或柱状图
    - [ ] 显示对比数据（如有）
  - [ ] 维度拆分数据展示
    - [ ] 饼图或柱状图
    - [ ] 数据表格
  - [ ] 使用 composable: `useIndicatorDetail`
  - [ ] 参数变化时自动刷新数据

### 4.3 P4-3 报告中心页面
- [ ] 新增 `src/pages/other/reports/report-center.vue`
  - [ ] 顶部操作区：
    - [ ] 生成报告按钮（周报/月报选择）
  - [ ] 报告列表展示：
    - [ ] 报告标题
    - [ ] 报告类型（周报/月报）
    - [ ] 时间范围
    - [ ] 生成状态（生成中/已完成/失败）
    - [ ] 创建时间
  - [ ] 点击报告跳转到详情页
  - [ ] 下拉刷新
  - [ ] 分页加载
  - [ ] 使用 composable: `useReportCenter`

### 4.4 P4-3.1 报告详情页面
- [ ] 新增 `src/pages/other/reports/report-detail.vue`
  - [ ] 接收路由参数：reportId
  - [ ] 报告头部信息：
    - [ ] 报告标题
    - [ ] 时间范围
    - [ ] 生成时间
  - [ ] 报告内容展示：
    - [ ] 所有指标数据
    - [ ] 图表可视化
    - [ ] 摘要信息（如有）
  - [ ] 底部操作按钮：
    - [ ] 导出按钮（Excel/PDF 选择）
    - [ ] 分享按钮（选择用户）
  - [ ] 导出功能实现
  - [ ] 分享功能实现

### 4.5 P4-4 AI整改建议页面（可选）
- [ ] 新增 `src/pages/other/reports/ai-suggestions.vue`
  - [ ] AI建议列表展示：
    - [ ] 建议标题
    - [ ] 优先级标识（高/中/低）
    - [ ] 相关指标
    - [ ] 创建时间
  - [ ] 点击查看建议详情
  - [ ] 建议详情展示：
    - [ ] 完整建议内容
    - [ ] 相关数据支撑
    - [ ] 操作建议
  - [ ] 转为任务功能（可选）
    - [ ] 记录为待办事项
    - [ ] 分配给团队成员

---

## 5. Composables 实现（业务逻辑封装）

### 5.1 看板数据管理
- [ ] 新增 `src/composables/useReportsDashboard.ts`
  - [ ] 状态管理：dashboardData, loading, error
  - [ ] 方法：fetchDashboardData, refreshData
  - [ ] 维度筛选逻辑
  - [ ] 错误处理
  - [ ] 加载状态管理

### 5.2 指标详情管理
- [ ] 新增 `src/composables/useIndicatorDetail.ts`
  - [ ] 状态管理：indicatorData, loading, error
  - [ ] 方法：fetchIndicatorDetail, updateTimeRange, updateComparisonMode
  - [ ] 参数变化监听
  - [ ] 数据转换逻辑

### 5.3 报告中心管理
- [ ] 新增 `src/composables/useReportCenter.ts`
  - [ ] 状态管理：reportList, loading, error
  - [ ] 方法：fetchReportList, generateReport, exportReport, shareReport
  - [ ] 分页逻辑
  - [ ] 报告状态轮询（生成中状态）

---

## 6. 工具函数实现

### 6.1 数据格式化
- [ ] 新增 `src/utils/reports/format.ts`
  - [ ] `formatNumber(value: number, decimals?: number)`：数字格式化
  - [ ] `formatPercent(value: number, decimals?: number)`：百分比格式化
  - [ ] `formatDuration(minutes: number)`：时长格式化
  - [ ] `formatDate(date: string, format?: string)`：日期格式化

### 6.2 数据计算
- [ ] 新增 `src/utils/reports/calculate.ts`
  - [ ] `calculateConversionRate(converted: number, total: number)`：转化率计算
  - [ ] `calculateGrowthRate(current: number, previous: number)`：增长率计算
  - [ ] `calculateTrend(current: number, previous: number)`：趋势判断
  - [ ] `calculatePercentage(part: number, total: number)`：占比计算
  - [ ] 除零保护逻辑

### 6.3 图表配置生成
- [ ] 新增 `src/utils/reports/chart-config.ts`
  - [ ] `generateLineChartConfig(data, options)`：折线图配置
  - [ ] `generateBarChartConfig(data, options)`：柱状图配置
  - [ ] `generateFunnelChartConfig(data, options)`：漏斗图配置
  - [ ] `generatePieChartConfig(data, options)`：饼图配置
  - [ ] 响应式尺寸计算

---

## 7. 路由注册（pages.json）

- [ ] 修改 `src/pages.json`
  - [ ] 确认 Tab4 入口：`pages/tab/reports`
  - [ ] 注册：`pages/other/reports/indicator-detail`
  - [ ] 注册：`pages/other/reports/report-center`
  - [ ] 注册：`pages/other/reports/report-detail`
  - [ ] 注册：`pages/other/reports/ai-suggestions`（可选）
  - [ ] 配置页面标题和导航栏样式

---

## 8. 权限与可见性（Tab4）

- [ ] 维度筛选器根据角色显示不同选项
  - [ ] SALES：仅个人和团队概览
  - [ ] BRANCH：本所和销售人员维度
  - [ ] HQ：全所和分所维度
- [ ] 数据范围根据角色和筛选条件过滤
- [ ] 管理报表入口权限控制（仅管理角色可见）

---

## 9. 测试相关（可选）

### 9.1 单元测试
- [ ] 测试工具函数：
  - [ ] 数据格式化函数测试
  - [ ] 数据计算函数测试（含边界情况）
  - [ ] 图表配置生成测试
- [ ] 测试组件：
  - [ ] MetricCard 组件测试
  - [ ] DimensionFilter 组件测试
  - [ ] ChartContainer 组件测试
  - [ ] TimeRangeSelector 组件测试
- [ ] 测试 Composables：
  - [ ] useReportsDashboard 测试
  - [ ] useIndicatorDetail 测试
  - [ ] useReportCenter 测试

### 9.2 属性测试（Property-Based Testing）
- [ ] 使用 fast-check 进行属性测试
- [ ] 测试数据结构完整性
- [ ] 测试权限和过滤逻辑
- [ ] 测试数据转换和计算
- [ ] 测试状态管理
- [ ] 每个测试至少运行 100 次迭代

### 9.3 集成测试
- [ ] 测试完整的用户交互流程
- [ ] 测试页面间导航
- [ ] 测试数据流转
- [ ] 测试 Mock 数据场景

---

## 10. 性能优化

- [ ] 图表数据懒加载
- [ ] 大数据量虚拟滚动
- [ ] 报告数据缓存（Pinia 持久化）
- [ ] 图表渲染性能优化
- [ ] 防抖和节流处理（筛选器变化）

---

## 11. 移动端适配

- [ ] 响应式布局实现
- [ ] 触摸手势支持（图表缩放、滑动）
- [ ] 图表自适应尺寸
- [ ] 横屏适配（可选）
- [ ] 小屏幕优化（指标卡片布局）

---

## 12. 错误处理与边界情况

- [ ] 网络错误处理
  - [ ] 显示友好错误提示
  - [ ] 提供重试按钮
  - [ ] 保留上次数据
- [ ] 空数据状态
  - [ ] 显示空状态提示
  - [ ] 提供操作指引
- [ ] 权限错误处理
  - [ ] 403 响应处理
  - [ ] 隐藏无权限内容
- [ ] 计算错误处理
  - [ ] 除零保护
  - [ ] 无效值处理
- [ ] 图表渲染错误
  - [ ] 捕获渲染异常
  - [ ] 显示降级方案（数据表格）

---

## 13. 文档维护

- [ ] 新增 `docs/Tab4测试预期.md`
  - [ ] P4-1 数据看板：指标展示/筛选/刷新
  - [ ] P4-2 指标详情：时间范围/对比/维度拆分
  - [ ] P4-3 报告中心：生成/列表/详情/导出/分享
  - [ ] P4-4 AI建议：列表/详情/转任务（可选）
  - [ ] 权限测试：不同角色的数据可见性
  - [ ] 边界情况：空数据/错误/极值

---

## 14. 开发阶段划分

### Phase 1: 核心数据看板（优先级最高）
- [ ] 完成任务 1-2（类型定义、Mock、API）
- [ ] 完成任务 3.1-3.2（指标卡片、维度筛选器）
- [ ] 完成任务 4.1（数据看板页面）
- [ ] 完成任务 5.1（看板数据管理 composable）
- [ ] 完成任务 6.1-6.2（工具函数）

### Phase 2: 指标详情（优先级高）
- [ ] 完成任务 3.3-3.4（图表容器、时间选择器）
- [ ] 完成任务 4.2（指标详情页面）
- [ ] 完成任务 5.2（指标详情管理 composable）
- [ ] 完成任务 6.3（图表配置生成）

### Phase 3: 报告中心（优先级中）
- [ ] 完成任务 4.3-4.4（报告中心、报告详情）
- [ ] 完成任务 5.3（报告中心管理 composable）

### Phase 4: AI建议与优化（优先级低/可选）
- [ ] 完成任务 4.5（AI建议页面）
- [ ] 完成任务 10-11（性能优化、移动端适配）
- [ ] 完成任务 9（测试）

---

## 15. 验收标准

### 功能验收
- [ ] 数据看板正确展示所有指标
- [ ] 维度筛选功能正常工作
- [ ] 指标详情页面数据准确
- [ ] 时间范围和对比功能正常
- [ ] 报告生成、导出、分享功能正常
- [ ] 图表渲染正确且响应式

### 性能验收
- [ ] 页面首次加载时间 < 2秒
- [ ] 图表渲染流畅，无卡顿
- [ ] 筛选器变化响应及时
- [ ] 大数据量场景性能可接受

### 兼容性验收
- [ ] 微信小程序正常运行
- [ ] H5 正常运行
- [ ] iOS/Android 正常运行
- [ ] 不同屏幕尺寸适配良好

### 用户体验验收
- [ ] 交互流畅自然
- [ ] 错误提示友好
- [ ] 空状态提示清晰
- [ ] 加载状态明确

---

**说明**：
- 标记 `[ ]` 的任务为待完成
- 标记 `[x]` 的任务为已完成
- 可选任务在任务描述中标注"（可选）"
- 建议按 Phase 顺序逐步实现，确保核心功能优先完成

---

## 附录：后端接口清单

> 前端完成后，提供给后端团队实现的接口列表

### 接口规范说明
- 所有接口路径需加 `/api` 前缀
- 请求/响应格式参考 `.kiro/specs/tab4-reports-dashboard/design.md` 中的 TypeScript 接口定义
- 响应格式统一为：`{ code: 200, data: {...}, msg: 'success' }`

### 必需接口

#### 1. 获取看板数据
```
GET /api/reports/dashboard
Query参数: DimensionFilter (scope, dimension, userId, branchId)
响应: DashboardData (包含8个指标 + 漏斗数据)
```

#### 2. 获取指标详情
```
GET /api/reports/indicator/detail
Query参数: 
  - indicatorType: 指标类型
  - timeRange: 时间范围 (start, end, granularity)
  - comparisonMode: 对比模式 (yoy/mom/none)
  - dimensionFilter: 维度筛选
  - dimensionType: 维度拆分类型（可选）
响应: IndicatorDetailData (趋势数据 + 维度拆分数据)
```

#### 3. 获取报告列表
```
GET /api/reports/report/list
Query参数: 
  - type: 报告类型 (weekly/monthly)（可选）
  - status: 报告状态 (generating/completed/failed)（可选）
  - page: 页码
  - pageSize: 每页数量
响应: { rows: Report[], total: number }
```

#### 4. 生成报告
```
POST /api/reports/report/generate
Body参数:
  - type: 报告类型 (weekly/monthly)
  - timeRange: 时间范围
  - dimensionFilter: 维度筛选
响应: { reportId: number | string }
```

#### 5. 获取报告详情
```
GET /api/reports/report/:id
Path参数: id (报告ID)
响应: Report (完整报告数据)
```

#### 6. 导出报告
```
POST /api/reports/report/:id/export
Path参数: id (报告ID)
Body参数:
  - format: 导出格式 (excel/pdf)
响应: { url: string } (下载链接)
```

#### 7. 分享报告
```
POST /api/reports/report/:id/share
Path参数: id (报告ID)
Body参数:
  - userIds: number[] (目标用户ID列表)
响应: { code: 200, msg: 'success' }
```

### 可选接口

#### 8. 获取AI建议（可选功能）
```
GET /api/reports/ai/suggestions
Query参数: DimensionFilter
响应: AISuggestion[] (AI生成的改进建议列表)
```

### 数据计算说明

后端需要根据客户数据计算以下指标：

1. **跟进频次**：统计时间范围内的跟进记录数（个人/团队）
2. **新客户获取**：统计新增客户数量
3. **有效线索转化率**：(跟进中客户数 / 公海客户数) × 100%
4. **客户拜访频次**：统计拜访记录数
5. **重点客户拜访占比**：(A级客户拜访数 / 总拜访数) × 100%
6. **拜访成功率**：(有效拜访数 / 总拜访数) × 100%
7. **单客户平均洽谈时长**：总洽谈时长 / 客户数
8. **客户拜访周期**：平均两次拜访之间的天数
9. **客户转化漏斗**：统计各阶段客户数量（公海→跟进→交案→回款→赢单）

### 权限控制

后端需要根据用户角色返回对应范围的数据：
- **SALES（销售）**：仅返回个人数据
- **TEAM（团队长）**：返回团队数据
- **BRANCH（分所管理）**：返回分所数据
- **HQ（总所管理）**：返回全所数据
