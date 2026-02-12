# 移动端 Tab5「我的」开发任务清单（可勾选）

> 说明：本清单以 `uniapp-vue3/docs/移动端_Tab5「我的」_规划增强版.md` 为准。  
> 约定：每完成一项就在此处勾选，并同步更新 `docs/Tab5测试预期.md`。
>
> AI 预留：Tab5 的审批/反馈等能力需预留 AI 总结/建议与可追溯字段扩展点，统一规范见 `docs/AI接入与扩展点规范.md`。
>
> **权限配置修复**：根据 `docs/系统设计问题分析.md` 和 `docs/系统角色权限与客户状态流转分析.md`，需要修复权限配置相关问题。

---

## 0. 权限配置修复（高优先级）

### 0.1 审批链逻辑修复（问题1、问题2）
- [ ] 修改 `src/mock/approval-store.ts` 中的 `buildApprovalChain` 函数
  - [ ] TEAM申领时，审批链改为 `BRANCH → HQ`（跳过自己）
  - [ ] 明确HQ/BRANCH不能申领（根据权限对比表，只有TEAM和SALES可以申领）
- [ ] 审批中心页面：根据权限对比表，只有TEAM/BRANCH/HQ可以审批，SALES不能审批
- [ ] 参考文档：`docs/系统设计问题分析.md` 问题1、问题2

### 0.2 公海分配权限限制（问题3）
- [ ] 修改 `src/pages/other/mine/management/leads.vue`
  - [ ] 用户选择器中过滤掉HQ/BRANCH角色（只显示TEAM和SALES）
  - [ ] 调用UserSelector时传入：`excludeRoles: ['HQ', 'BRANCH']`
- [ ] 后端Mock校验：检查分配目标用户的角色，如果是HQ/BRANCH则拒绝
- [ ] 参考文档：`docs/系统设计问题分析.md` 问题3

---

## 0. 基础约定（命名与目录）

- Tab 页入口：`src/pages/tab/mine.vue`
- 子页面统一放：`src/pages/other/mine/**`
- 现有可复用页面：
  - `src/pages/other/settings/index.vue`
  - `src/pages/other/about/index.vue`
  - `src/pages/other/profile/edit.vue`（当前业务偏“书画展览助手”，不建议直接用于 CRM；可后续重做）

---

## 1. 类型与枚举（src/types/interfaces）

- [x] 检查/新建 `src/types/interfaces/user.ts`
  - [x] 统一定义 `UserRoleLevel`（HQ/BRANCH/TEAM/SALES）与 `OrgScope`（HQ/BRANCH/TEAM/SELF）
  - [x] Tab1 与 Tab5 共用该枚举（不要在 `mine.ts` 重复定义）
- [x] 新增 `src/types/interfaces/mine.ts`
  - [x] `ReminderPreference`（仅提前量：15/30 分钟）
  - [x] `FeedbackTicket`（支持可选 `context`）
  - [x] `ApprovalTask`（审批中心，payload 必须区分类型）
    - [x] `LeadClaimPayload`：`{ client_id, name, reason }`
    - [x] `LeadCreatePayload`：包含“新建线索表单所有字段”
    - [x] `ClientTransferPayload`：`{ client_id, from_user, to_user, reason }`

---

## 2. Mock 与 API（先让 Tab5 可本地跑通）

### 2.1 Mock handlers
- [x] 新增 `src/mock/mine.ts`
  - [x] `GET /mine/profile`：返回当前用户信息（头像/姓名/组织/角色）
  - [x] `POST /mine/feedback`：提交反馈
  - [x] `GET /mine/feedback/list`：反馈列表
  - [x] `GET /mine/approval/list`：审批任务列表（pending/handled）
  - [x] `POST /mine/approval/:id/approve`：审批通过/驳回

### 2.2 注册 mock
- [x] 修改 `src/mock/index.ts`
  - [x] `import mineMock from './mine'`
  - [x] 合并到 `allMockHandlers`

### 2.3 API 封装（可选：也可直接页面用 request）
- [x] 新增 `src/api/mine.ts`
  - [x] `getMineProfile()`
  - [x] `submitFeedback(data, context?)`（可选：`context: { client_id?: string; field?: string }`）
  - [x] `getApprovalList()`
  - [x] `approveTask()`

---

## 3. Tab5 页面实现（P5-1~P5-4）

### 3.1 P5-1 个人中心首页（Tab）
- [x] 改造 `src/pages/tab/mine.vue`
  - [x] 顶部用户卡片（头像/姓名/角色/组织）
  - [x] 通用入口：个人资料 / 设置 / 反馈与支持 / 关于
  - [x] 管理入口（仅 `userStore.isManager` 可见）：审批中心 / 公海分配 / 团队日程 / 规则配置
- [x] 新增管理入口功能页（初步）：
  - [x] `src/pages/other/mine/management/leads.vue`（公海分配：列表/分配占位）
  - [x] `src/pages/other/mine/management/team-schedule.vue`（团队日程：视图占位）
  - [x] `src/pages/other/mine/management/rules.vue`（规则配置：时限/频率配置占位）

### 3.2 P5-2 我的设置
- [x] 路由注册并打通跳转：`src/pages/other/settings/index.vue`
  - [x] 仅保留“提前量设置（15分钟/30分钟）”，隐藏渠道选择
  - [x] 保留 Mock 环境“开发者角色切换”（已存在）
  - [x] 退出登录（Logout）：清空 store + token，跳转登录页
  - [x] 用户协议与隐私政策入口（静态页或 WebView）

### 3.3 P5-3 我的数据（一期占位）
- [x] 新增 `src/pages/other/mine/data/index.vue`
  - [x] 展示个人指标汇总（一期占位）

### 3.4 P5-4 反馈与支持
- [x] 新增 `src/pages/other/mine/feedback/index.vue`
  - [x] 类型选择（bug / 建议 / AI标记反馈）
  - [x] 文本输入（必填）
  - [x] 图片上传（复用 `ImageUploader`，可选）
  - [x] 联系方式（可选）
  - [x] 提交（走 mock）

---

## 4. 管理中心详细实现（P5-M1 ~ P5-M5）

### 4.1 P5-M1 审批中心
- [x] 新增 `src/pages/other/mine/approval/index.vue`
  - [x] Tab：待审批/已处理（2个Tab）
  - [x] 列表（走 mock）
- [x] 新增 `src/pages/other/mine/approval/detail.vue`
  - [x] 详情展示（申请人/客户/内容/附件）
  - [x] 底部两个按钮：通过/驳回
  - [x] 驳回：弹窗输入 `reject_reason`（必填），走 mock

### 4.2 P5-M2 公海分配（管理角色）
- [x] 完善 `src/pages/other/mine/management/leads.vue`
  - [x] 公海客户列表展示
  - [x] 批量勾选与指派经办人
  - [ ] 搜索与基本筛选（地区/等级/来源渠道）
- [x] Mock 接入：`GET /crm/pool/list` & `POST /crm/pool/assign`（已通过client.ts的list接口实现）

### 4.3 P5-M3 团队日程（管理角色）
- [ ] 完善 `src/pages/other/mine/management/team-schedule.vue`
  - [ ] 集成周/月日历组件（展示团队全员计划）
  - [ ] 下方展示选中日期的日程明细（含人员标识）
- [ ] Mock 接入：`GET /crm/team/schedule`

### 4.4 P5-M4 管理报表入口（管理角色）
- [x] 在 `src/pages/tab/mine.vue` 中点击该入口跳转至 `pages/tab/reports`
- [ ] 跳转时携带特定参数，指示报表页展示管理维度（可选优化）

### 4.5 P5-M5 规则配置（管理角色）
- [ ] 完善 `src/pages/other/mine/management/rules.vue`
  - [ ] 回收时限配置表单（A/B/C/D 四档天数）
  - [ ] 跟进频率标准配置（面谈/交案/回款各阶段）
- [ ] Mock 接入：`GET /sys/config/crm` & `POST /sys/config/crm`

---

## 5. 路由注册（pages.json）

- [x] 修改 `src/pages.json`
  - [x] 注册：`pages/other/settings/index`
  - [x] 注册：`pages/other/about/index`
  - [x] 注册：`pages/other/mine/profile/index`
  - [x] 注册：`pages/other/mine/data/index`
  - [x] 注册：`pages/other/mine/feedback/index`
  - [x] 注册：`pages/other/mine/feedback/list`
  - [x] 注册：`pages/other/mine/approval/index`
  - [x] 注册：`pages/other/mine/approval/detail`
  - [x] 注册：`pages/other/mine/management/leads`
  - [x] 注册：`pages/other/mine/management/team-schedule`
  - [x] 注册：`pages/other/mine/management/rules`
  - [x] 注册：`pages/other/mine/legal/user-agreement` / `privacy-policy`
  - [x] 注册：`pages/other/auth/login`（用于 Logout 跳转）

---

## 6. 权限与可见性（Tab5）

- [x] 在 Tab5 入口处按角色显示“管理入口折叠区”
- [x] 审批中心入口仅管理角色可见
- [x] 进入审批中心页时再校验角色（非管理则提示并返回）

---

## 7. 测试预期（文档维护）

- [x] 新增 `docs/Tab5测试预期.md`
  - [x] P5-1 个人中心：首页展示/跳转/管理入口显示规则
  - [x] P5-2 设置：提醒偏好/隐私授权/开发者角色切换（Mock）
  - [x] P5-4 反馈：表单校验/图片上传/提交成功
  - [x] P5-M1 审批中心：待审批/已处理列表 + 通过/驳回


