# 移动端 Tab1「客户」开发任务清单

> 基于 `docs/移动端_Tab1「客户」_规划增强版.md` 生成的可落地开发任务清单。
>
> 口径：`status` 枚举为 `PUBLIC_POOL/FOLLOW_UP/CASE/PAYMENT/WON`；列表接口返回 `followup_count/visit_count/valid_visit_count/sales_stage`；筛选器支持**生命周期(status)** + **展业(sales_stage)** 两维。
>
> AI 预留：所有 Tab1 写操作与附件相关功能必须按统一规范预留扩展点，见 `docs/AI接入与扩展点规范.md`。
>
> **权限配置修复**：根据 `docs/系统设计问题分析.md` 和 `docs/系统角色权限与客户状态流转分析.md`，需要修复权限配置相关问题。

---

## 0. 权限配置修复（高优先级）

### 0.1 审批链逻辑修复（问题1、问题2）
- [ ] 修改 `src/mock/approval-store.ts` 中的 `buildApprovalChain` 函数
  - [ ] TEAM申领时，审批链改为 `BRANCH → HQ`（跳过自己）
  - [ ] 明确HQ/BRANCH不能申领（根据权限对比表，只有TEAM和SALES可以申领）
- [ ] 前端限制：Tab1客户列表页，HQ/BRANCH角色不显示"申领"按钮
- [ ] 前端限制：Tab1客户详情页，HQ/BRANCH角色不显示"申领线索"按钮
- [ ] 参考文档：`docs/系统设计问题分析.md` 问题1、问题2

### 0.2 分配功能权限限制（问题3）
- [ ] 修改 `src/components/UserSelector/index.vue`，添加角色过滤功能
  - [ ] 添加 `excludeRoles` 属性，支持过滤指定角色
  - [ ] 在分配页面调用时传入：`excludeRoles: ['HQ', 'BRANCH']`
- [ ] 修改 `src/pages/other/mine/management/leads.vue`，分配时过滤HQ/BRANCH角色
- [ ] 修改 `src/pages/tab/customers.vue` 的分配功能，过滤HQ/BRANCH角色
- [ ] 后端Mock校验：检查分配目标用户的角色，如果是HQ/BRANCH则拒绝
- [ ] 参考文档：`docs/系统设计问题分析.md` 问题3

### 0.3 客户详情页权限控制优化（问题6）
- [ ] 修改 `src/pages/other/customer/detail/index.vue`
  - [ ] 根据角色权限控制操作按钮显示：
    - [ ] HQ/BRANCH：隐藏"新增跟进"、"记录拜访"、"确认合同"等推进按钮（只能查看和编辑基础信息）
    - [ ] TEAM：显示所有按钮（双重职能）
    - [ ] SALES：只显示自己负责的客户的操作按钮
  - [ ] 明确规则：管理角色可以查看和编辑客户基础信息，但不能代替经办人推进客户
- [ ] 参考文档：`docs/系统设计问题分析.md` 问题6

---

## 1. 基础建设（类型/枚举/映射/请求层接入）

### 1.1 定义枚举与类型（status、sales_stage、聚合字段）
- [x] 新增 `src/types/interfaces/client.ts`
  - [x] 定义 `ClientStatus` 类型：`'PUBLIC_POOL' | 'FOLLOW_UP' | 'CASE' | 'PAYMENT' | 'WON'`
  - [x] 定义 `SalesStage` 类型：`'PUBLIC_POOL' | 'BLANK' | 'MEETING' | 'CASE' | 'PAYMENT' | 'WON'`
  - [x] 定义 `ClientListItem` 接口（包含 status、sales_stage、followup_count、visit_count、valid_visit_count、聚合字段）
  - [x] 定义 `ClientDetail` 接口（详情页字段）
  - [x] 定义 `ClientCreateParams` / `ClientUpdateParams` 接口
- [x] 新增 `src/types/interfaces/client-visit.ts`
  - [x] 定义 `LocationStatus` 类型：`'success' | 'fail' | 'denied' | 'offline'`
  - [x] 定义 `ClientVisit` 接口（含 location_status、lng/lat、system_users、client_contacts）
- [x] 新增 `src/types/interfaces/client-followup.ts`
  - [x] 定义 `FollowupType` 类型：`'phone' | 'wechat' | 'meeting' | 'other'`
  - [x] 定义 `ClientFollowup` 接口
- [x] 新增 `src/types/interfaces/client-plan.ts`
  - [x] 定义 `ClientPlan` 接口
- [x] 新增 `src/types/interfaces/client-contract.ts`
  - [x] 定义 `ClientContract` 接口（合同最小字段 + attachments）
- [x] 新增 `src/types/interfaces/client-payment.ts`
  - [x] 定义 `ClientPayment` 接口（回款记录）
- [x] 新增 `src/types/interfaces/client-legal-fee.ts`
  - [x] 定义 `ClientLegalFee` 接口（律师费用）
- [x] 新增 `src/types/interfaces/client-handover.ts`
  - [x] 定义 `ClientHandover` 接口（转交日志/申请）
- [x] 新增 `src/types/interfaces/client-contacts.ts`
  - [x] 定义 `ClientContact` 接口（外部联系人）

### 1.2 前端枚举展示映射（用于 UI 文案/筛选项）
- [x] 新增 `src/utils/client-enums.ts`
  - [x] 导出 `CLIENT_STATUS_MAP`（status → label/color/icon）
  - [x] 导出 `SALES_STAGE_MAP`（sales_stage → label/color）
  - [x] 导出 `SALES_STAGE_FILTER_OPTIONS`（默认顺序：公海/空白/面谈/交案/回款/赢单）
  - [x] 导出 `CLIENT_GRADE_MAP`（A/B/C/D → label/color）
  - [x] 导出 `LOCATION_STATUS_MAP`（success/fail/denied/offline → label/icon）
- [x] 修改 `src/utils/index.ts`（导出 client-enums）

### 1.3 API 模块（对接后端接口）
- [x] 新增 `src/api/client.ts`
  - [x] `getClientList(params)` - 列表（含筛选/排序/分页）
  - [x] `getClientDetail(id)` - 详情
  - [x] `createClient(data)` - 新增线索/客户
  - [x] `updateClient(id, data)` - 编辑
  - [x] `applyClient(id)` - 申领公海线索
  - [x] `assignClient(id, userId)` - 分配（管理权限）
  - [x] `approveClientApply(applyId, approved)` - 审批申领
- [x] 新增 `src/api/client.ts`（已包含所有子模块API）
  - [x] `createFollowup(data)` - 新增跟进记录
  - [x] `getFollowupList(clientId)` - 跟进记录列表
  - [x] `createVisit(data)` - 记录拜访
  - [x] `getVisitList(clientId)` - 拜访足迹列表
  - [x] `createPlan(data)` - 新增跟进计划
  - [x] `updatePlan(id, data)` - 编辑计划
  - [x] `getPlanList(clientId)` - 计划列表
  - [x] `confirmContract(data)` - 合同确认（上传 + 手工字段）
  - [x] `getContractList(clientId)` - 合同列表
  - [x] `createPayment(data)` - 回款录入
  - [x] `getPaymentList(clientId)` - 回款记录列表
  - [x] `createLegalFee(data)` - 律师费用录入
  - [x] `getLegalFeeList(clientId)` - 律师费用列表
  - [x] `applyHandover(data)` - 发起客户转交申请
  - [x] `approveHandover(id, approved)` - 审批转交
  - [x] `getHandoverLog(clientId)` - 转交日志列表
  - [x] `getClientContacts(clientId)` - 客户联系人列表
  - [x] `createClientContact(data)` - 新增联系人

### 1.3.x AI 扩展点（统一预留）
- [x] 为 Tab1 相关写接口统一预留字段（不影响原业务）：`trace_id` / `ai_source`
- [x] 附件上传完成后返回统一 `Attachment` 结构（已在 AiAttachment 中定义并引用）
- [ ] 预留“附件入知识库/向量库”动作入口：`POST /ai/knowledge/ingest`（或同等能力）

### 1.4 Mock（让 Tab1 可本地独立跑通）
- [x] 新增 `src/mock/client.ts`
  - [x] Mock `GET /crm/client/list`
    - [x] 返回字段包含：status、sales_stage、followup_count、visit_count、valid_visit_count
    - [x] 返回聚合字段：last_followup_at、last_visit_at、next_plan_at、recycle_risk_level、recycle_deadline
    - [x] 支持筛选参数：status、sales_stage、keyword、grade、collection_category（支持多选）、owner_user_id、team_id、branch_id、recycle_risk_level、page、pageSize
  - [x] Mock `GET /crm/client/:id` - 详情
  - [x] Mock `POST /crm/client` - 创建
  - [x] Mock `POST /crm/client/:id/apply` - 申领
- [x] 完善 `src/mock/area.ts`
  - [x] 使用 `china-area-data` 生成完整省市区数据
  - [x] 34个省级行政区（完整）
  - [x] 375个地级市（完整）
  - [x] 3397个区县（完整）
- [ ] 新增 `src/mock/client-followup.ts`（可选，按需）
- [ ] 新增 `src/mock/client-visit.ts`（可选，按需）
- [ ] 新增 `src/mock/client-plan.ts`（可选，按需）
- [ ] 新增 `src/mock/client-contract.ts`（可选，按需）
- [ ] 新增 `src/mock/client-payment.ts`（可选，按需）
- [ ] 新增 `src/mock/client-legal-fee.ts`（可选，按需）
- [ ] 新增 `src/mock/client-handover.ts`（可选，按需）
- [x] 修改 `src/mock/index.ts`
  - [x] `import clientMock from './client'`
  - [x] 添加到 `allMockHandlers` 数组
  - [x] 注册所有 Tab1 相关 mock handlers

### 1.5 状态管理（筛选器/列表状态缓存）
- [x] 新增 `src/stores/client.ts`
  - [x] 定义 `clientStore`
  - [x] 状态：currentStatus、currentSalesStage、filters（等级/催收类别/经办人/团队/临近回收）
  - [x] 状态：列表数据、分页信息、加载状态
  - [x] 方法：`setFilters`、`resetFilters`、`fetchList`
- [ ] 修改 `src/stores/index.ts`（统一导出）

---

## 2. Tab1 页面（P1-1 ~ P1-10）实现任务

### 2.1 P1-1 客户列表页（五段分栏 + 双维筛选 + 聚合字段展示）
- [x] 修改 `src/pages/tab/customers.vue`（从占位升级为完整列表页）
  - [x] 集成 ScrollableTabs 实现生命周期分段（PUBLIC_POOL/FOLLOW_UP/CASE/PAYMENT/WON）
  - [x] 集成 ClientFilterBar（搜索/生命周期/展业状态/客户等级/催收类别/回收风险/排序）
  - [x] 使用 ClientCard 展示列表项（含 status、sales_stage、聚合字段、标签）
  - [x] 实现搜索功能（客户名/手机号）
  - [x] 实现排序功能（最近跟进/最近创建/最近拜访）
  - [x] 实现下拉刷新与上拉加载
  - [x] 集成 DraggableFab 浮动按钮（快捷新增）
  - [x] 根据角色显示不同操作（销售：申领；管理：分配/审核）
  - [ ] 团队管理角色（TEAM）公海客户操作按钮优化：同时显示"申领"和"分配"两个按钮（需修改 `src/components/ClientCard/index.vue`，传入roleLevel属性判断）
- [x] 新增 `src/components/ClientFilterBar/index.vue`
  - [x] 生命周期筛选（status）
  - [x] 展业筛选（sales_stage，默认顺序：公海/空白/面谈/交案/回款/赢单）
  - [x] 客户等级筛选（A/B/C/D）
  - [x] 催收类别筛选（仲裁/调解/诉讼）
  - [x] 经办人筛选（管理可用；销售默认自己）
  - [x] 分所/团队筛选（管理可用）
  - [x] 临近回收筛选（recycle_risk_level）
- [x] 新增 `src/components/ClientCard/index.vue`
  - [x] 展示客户名 + 等级（来源 AI/人工）
  - [x] 展示当前状态（status + sales_stage）
  - [x] 展示 last_followup_at / next_plan_at
  - [x] 展示标签（催收类别、保全、recycle_risk_level + recycle_deadline）
  - [x] 展示经办人（管理可见）
  - [ ] 优化按钮显示逻辑：团队管理角色（TEAM）在公海状态下同时显示"申领"和"分配"两个按钮（需传入roleLevel属性判断）
- [x] 新增 `src/components/SalesStageTag/index.vue`
  - [x] 根据 sales_stage 显示对应文案/颜色
  - [x] 支持 PUBLIC_POOL/BLANK/MEETING/CASE/PAYMENT/WON

### 2.2 P1-2 客户详情页（统一详情 + 按 status 动态模块）
- [x] 新增 `src/pages/other/customer/detail/index.vue`
  - [x] 实现顶部固定区（客户名称、status、sales_stage、grade、owner、recycle风险）
  - [x] 实现快捷动作按钮（新增跟进、记录拜访、添加计划、AI对话）
  - [x] 集成各模块面板（按 status 动态显示）
- [x] 新增 `src/components/ClientDetailHeader/index.vue`
  - [x] 展示客户名称/简称
  - [x] 展示 status + sales_stage
  - [x] 展示 grade（人工优先）
  - [x] 展示经办人
  - [x] 展示回收风险（recycle_risk_level + recycle_deadline）
- [x] 新增 `src/components/ClientPanels/BaseInfoPanel.vue`（基础信息）
- [x] 新增 `src/components/ClientPanels/AiTagsPanel.vue`（AI标记）
- [x] 新增 `src/components/ClientPanels/FollowupTimelinePanel.vue`（跟进时间线）
- [x] 新增 `src/components/ClientPanels/VisitPanel.vue`（拜访足迹）
- [x] 新增 `src/components/ClientPanels/PlanPanel.vue`（跟进计划）
- [x] 新增 `src/components/ClientPanels/ContractPanel.vue`（合同与案件，交案后显示）
- [x] 新增 `src/components/ClientPanels/PaymentPanel.vue`（回款记录，回款后显示）
- [x] 新增 `src/components/ClientPanels/LegalFeePanel.vue`（律师费用，赢单后显示）
- [x] 新增 `src/components/ClientPanels/HandoverLogPanel.vue`（转交日志，按权限可见）

### 2.3 P1-3 新增线索/客户页（销售自有线索→待审核→公海）
- [x] 新增 `src/pages/other/customer/create/index.vue`
  - [x] 表单字段：公司/客户名、联系人、手机号、地区、需求摘要、来源渠道、引荐人
  - [x] 经办人字段（默认当前人；管理可改）
  - [x] 复用 AreaSelector 组件（已补齐完整省市区数据：34省375市3397区县）
  - [x] 复用字典组件（等级/渠道，使用 ActionSheet 实现）
  - [x] 区分流程：销售新增→待审核；管理新增→直接公海
  - [x] 表单校验与提交

### 2.4 P1-4 新增跟进记录页
- [x] 新增 `src/pages/other/customer/followup/create.vue`
  - [x] 跟进方式选择（电话/微信/面谈/其他）
  - [x] 跟进摘要输入（必填）
  - [x] 关键结论输入（可选）
  - [x] 是否需要下次跟进 + 时间（可一键生成日程）
  - [x] 附件上传（图片/录音/文件）
  - [x] 复用 ImageUploader 组件（Mock 模式下直回填本地路径）
  - [x] 表单提交

### 2.5 P1-5 记录拜访页（定位兜底 + 参与人员结构化）
- [x] 新增 `src/pages/other/customer/visit/create.vue`
  - [x] 拜访时间选择
  - [x] 洽谈时长输入
  - [x] 核心价值信息输入
  - [x] 地点选择（强提示定位但不强制；允许手输地址）
  - [x] 参与人员选择（system_users + client_contacts）
  - [x] 附件上传（照片/录音/文档）
  - [x] 定位兜底 UI（失败/拒绝授权/无网）
- [x] 新增 `src/components/LocationStatusBadge/index.vue`
  - [x] 展示定位状态（success/fail/denied/offline）
- [x] 新增 `src/components/UserSelector/index.vue`
  - [x] 内部用户多选（来源 lsl_system_users）
- [x] 新增 `src/components/ClientContactSelector/index.vue`
  - [x] 外部联系人多选（来源 client_contacts）
  - [x] 支持临时手输

### 2.6 P1-6 跟进计划页（新增/编辑 + 同步日程的入口）
- [x] 新增 `src/pages/other/customer/plan/edit.vue`
  - [x] 计划事项输入
  - [x] 时间点选择（可多条）
  - [x] 关联客户（默认带入）
  - [x] 提醒方式与提前量设置（读取个人偏好）
  - [x] 同步到 Tab2 日程选项（一期可先做接口预留）
  - [x] 表单提交

### 2.7 P1-7 合同上传与确认页（一期：上传 + 手工最小字段）
- [x] 新增 `src/pages/other/customer/contract/confirm.vue`
  - [x] 合同附件上传（PDF/Word/图片）
  - [x] 手工填写最小字段：合同编号、合同金额、期限、服务类型、客户主体
  - [x] 复用 ImageUploader 组件
  - [x] 确认完成 → 生成合同档案 + 最小案件字段 → status 转交案
  - [x] 表单提交

### 2.8 P1-8 回款录入页
- [x] 新增 `src/pages/other/customer/payment/create.vue`
  - [x] 回款时间选择
  - [x] 金额输入
  - [x] 催收类别选择（仲裁/调解/诉讼）
  - [x] 凭证上传
  - [x] 保存成功 → status 转回款（支持多笔）
  - [x] 表单提交

### 2.9 P1-9 律师费用录入页
- [x] 新增 `src/pages/other/customer/legal-fee/create.vue`
  - [x] 支付时间选择
  - [x] 金额输入
  - [x] 凭证上传
  - [x] 保存成功 → status 转赢单（支持多笔）
  - [x] 表单提交

### 2.10 P1-10 客户转交申请页
- [x] 新增 `src/pages/other/customer/handover/apply.vue`
  - [x] 目标经办人选择
  - [x] 转交原因输入（必填）
  - [x] 备注/附件（可选）
  - [x] 审批：团队/分所/总所按数据范围与就近原则
  - [x] 表单提交

### 2.11 P1-11 拜访足迹详情页
- [x] 新增 `src/pages/other/customer/visit/detail.vue`
  - [x] 展示拜访时间、时长、参与人员（内部/客户）
  - [x] 展示定位状态、详细地址、经纬度
  - [x] 展示洽谈内容/核心价值
  - [x] 展示现场附件（图片预览）
- [x] 修改 `src/components/ClientPanels/VisitPanel.vue`
  - [x] 点击列表项跳转至详情页

---

## 3. 权限与团队层级适配（UI/数据范围）

### 3.1 前端角色/组织信息读取
- [x] 修改 `src/stores/user.ts`
  - [x] 确保能拿到：总所/分所/团队/销售的标识（`roleLevel`）
  - [x] 确保能拿到 teamId/orgScope 字段（`teamId/branchId/hqId/orgScope`，支持 dev_* 本地覆盖）
  - [x] 提供 `isAdmin`、`isTeamManager`、`isBranchManager`、`isSales`、`isManager` 等计算属性
- [x] 修改/复用 `src/components/PermissionWrapper/index.vue`
  - [x] 支持 `managerOnly/salesOnly`（Tab1 管理视角控件开关）
  - [x] 修复缺失 `computed` 导致的运行异常风险

### 3.2 列表与详情的"管理视角"能力
- [x] 在客户列表页实现按角色控制筛选器显示
  - [x] 管理可筛选经办人、分所/团队（一期：在筛选弹窗提供 ID 输入）
  - [x] 销售默认自己且不可切换（自动设置 `owner_user_id=self`）
- [x] 在客户详情页实现按角色控制操作按钮
  - [x] 销售：只能操作自己负责的客户（转交按钮按 owner 校验）
  - [x] 管理：可查看并操作（一期先放开）

---

## 4. pages.json（路由注册）

- [x] 修改 `src/pages.json`
  - [x] 保持 Tab 页：`pages/tab/customers` 不变
  - [x] 新增客户详情页路由：`pages/other/customer/detail/index`
  - [x] 新增新增客户页路由：`pages/other/customer/create/index`
  - [x] 新增跟进记录页路由：`pages/other/customer/followup/create`
  - [x] 新增拜访记录页路由：`pages/other/customer/visit/create`
  - [x] 新增跟进计划页路由：`pages/other/customer/plan/edit`
  - [x] 新增合同确认页路由：`pages/other/customer/contract/confirm`
  - [x] 新增回款录入页路由：`pages/other/customer/payment/create`
  - [x] 新增律师费用页路由：`pages/other/customer/legal-fee/create`
  - [x] 新增转交申请页路由：`pages/other/customer/handover/apply`

---

## 5. Mock 功能接入（Tab1 全链路可本地跑通）

### 5.1 新增 Tab1 Mock handlers（最少先做列表+详情）
- [x] 新增 `src/mock/client.ts`
  - [x] 提供 `GET /crm/client/list` mock
    - [x] 返回字段包含：status、sales_stage、followup_count、visit_count、valid_visit_count
    - [x] 返回聚合字段：last_followup_at、last_visit_at、next_plan_at、recycle_risk_level、recycle_deadline
    - [x] 支持筛选参数：status、sales_stage、keyword、grade、collection_category（支持多选）、owner_user_id、team_id、branch_id、recycle_risk_level、page、pageSize
  - [x] 提供 `GET /crm/client/:id` mock
  - [x] 提供 `POST /crm/client` mock
  - [x] 提供 `POST /crm/client/:id/apply` mock（申领）
  - [x] 提供 `POST /crm/client/:id/assign` mock（分配）
  - [x] 提供 `POST /crm/client/approve/:applyId` mock（审批）
- [x] 新增 `src/mock/client-followup.ts`（已在 client.ts 中统一 Mock）
- [x] 新增 `src/mock/client-visit.ts`（已在 client.ts 中统一 Mock）
- [x] 新增 `src/mock/client-plan.ts`（已在 client.ts 中统一 Mock）
- [x] 新增 `src/mock/client-contract.ts`（已在 client.ts 中统一 Mock）
- [x] 新增 `src/mock/client-payment.ts`（已在 client.ts 中统一 Mock）
- [x] 新增 `src/mock/client-legal-fee.ts`（已在 client.ts 中统一 Mock）
- [x] 新增 `src/mock/client-handover.ts`（已在 client.ts 中统一 Mock）

### 5.2 把 mock handlers 注册进 mock 入口
- [x] 修改 `src/mock/index.ts`
  - [x] `import clientMock from './client'`
  - [x] 添加到 `allMockHandlers` 数组
  - [x] 注册所有 Tab1 相关 mock handlers

### 5.3 补充 mock 使用说明（让团队知道怎么开/怎么调）
- [x] 修改 `src/mock/README.md`（可选）
  - [x] 写清楚 Tab1 mock 的 URL
  - [x] 写清楚 query 参数（status/sales_stage/keyword/page/pageSize 等）
  - [x] 写清楚返回结构示例

---

## 6. `src/types/interfaces`（Tab1 类型体系落地，避免字段乱飞）

### 6.1 新增 Tab1 领域类型文件
- [x] 新增 `src/types/interfaces/client.ts`
  - [x] `ClientStatus` 类型：`'PUBLIC_POOL' | 'FOLLOW_UP' | 'CASE' | 'PAYMENT' | 'WON'`
  - [x] `SalesStage` 类型：`'PUBLIC_POOL' | 'BLANK' | 'MEETING' | 'CASE' | 'PAYMENT' | 'WON'`
  - [x] `ClientListItem` 接口（包含列表所有字段）
  - [x] `ClientDetail` 接口（详情字段）
  - [x] `ClientCreateParams` / `ClientUpdateParams` 接口
- [x] 新增 `src/types/interfaces/client-visit.ts`
  - [x] `LocationStatus` 类型：`'success' | 'fail' | 'denied' | 'offline'`
  - [x] `ClientVisit` 接口（含 location_status、lng/lat、参与人结构）
- [x] 新增 `src/types/interfaces/client-followup.ts`
  - [x] `FollowupType` 类型：`'phone' | 'wechat' | 'meeting' | 'other'`
  - [x] `ClientFollowup` 接口
- [x] 新增 `src/types/interfaces/client-plan.ts`
  - [x] `ClientPlan` 接口
- [x] 新增 `src/types/interfaces/client-contract.ts`
  - [x] `ClientContract` 接口（合同最小字段 + attachments）
- [x] 新增 `src/types/interfaces/client-payment.ts`
  - [x] `ClientPayment` 接口（回款记录）
- [x] 新增 `src/types/interfaces/client-legal-fee.ts`
  - [x] `ClientLegalFee` 接口（律师费用）
- [x] 新增 `src/types/interfaces/client-handover.ts`
  - [x] `ClientHandover` 接口（转交日志/申请）
- [x] 新增 `src/types/interfaces/client-contacts.ts`
  - [x] `ClientContact` 接口（外部联系人）

### 6.2 API 层引用类型
- [x] 修改 `src/api/client.ts` 等 Tab1 api 文件
  - [x] 所有请求/响应返回值用上述 interface 标注
  - [x] 例如：`getClientList(params): Promise<{ rows: ClientListItem[]; total: number }>`

### 6.3 Mock 层引用类型（确保 mock 与真实接口一致）
- [x] 修改 `src/mock/client.ts` 等
  - [x] mock 的 response 直接构造 `ClientListItem[]`
  - [x] 确保字段类型与 interface 一致

### 6.4 组件/页面引用类型
- [x] 修改 `src/pages/tab/customers.vue`
  - [x] 使用 `ClientListItem/ClientStatus/SalesStage` 类型
- [x] 修改 `src/components/ClientCard/index.vue`
  - [x] props 使用 `ClientListItem` 类型
- [ ] 其他组件/页面按需引用类型，避免 `any`

---

## 验收关键点

- [x] 列表接口必须展示/可筛：`status` + `sales_stage` + `followup_count/visit_count/valid_visit_count`
- [x] 展业默认筛选项顺序：公海 / 空白 / 面谈 / 交案 / 回款 / 赢单
- [x] `valid_visit` 判定：`location_status=success` 或 `lng/lat` 任一非空（影响 `valid_visit_count` 与 `sales_stage=MEETING`）
- [x] 筛选器支持两维：生命周期（status）+ 展业（sales_stage）
- [x] 所有表单页包含必填校验与提交成功提示
- [x] Mock 能支持列表/详情/创建的基本流程调通
- [x] 类型定义完整，组件/页面无 `any` 类型滥用 (持续优化中)

---

## 备注

- 本清单基于 `docs/移动端_Tab1「客户」_规划增强版.md` 生成
- 开发过程中如发现需求不明确或冲突，及时回看规划文档或与团队沟通确认
- Mock 数据结构需与后端接口约定保持一致，方便前后端联调

