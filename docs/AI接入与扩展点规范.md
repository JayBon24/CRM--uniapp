# AI 接入与扩展点规范（统一口径）

> 目标：确保在完成 5 个 Tab 的业务闭环后，能够**无痛接入 AI**（对话/识别/建议/自动化操作），且不需要大改现有页面与请求层。
>
> 原则：**AI 不直接改数据**，AI 只产出“建议/动作草案”，最终由用户确认或按策略自动执行，并且必须可审计（留痕/可追溯）。

---

## 1. 核心概念

### 1.1 AI Action（可执行动作）
AI 输出统一结构的动作草案（Action Draft），前端渲染为“建议卡片”，用户可：
- 确认执行
- 编辑后执行
- 拒绝（可选：提供原因）

**Action 类型（一期覆盖 Tab1/Tab2/Tab5，后续可扩展）**
- `CLIENT_CREATE`：新建线索/客户
- `CLIENT_UPDATE`：更新客户字段（等级/催收类别/保全/法院/律师/基础信息等）
- `FOLLOWUP_CREATE`：新增跟进记录
- `VISIT_CREATE`：新增拜访记录
- `PLAN_CREATE` / `PLAN_UPDATE`：新增/修改计划
- `SCHEDULE_CREATE` / `SCHEDULE_UPDATE`：新增/修改日程（Tab2）
- `HANDOVER_APPLY`：发起客户转交申请
- `APPROVAL_DECIDE`：审批通过/驳回（仅管理角色）
- `ATTACHMENT_INGEST`：附件入库（知识库/向量库/文件库）

### 1.2 AI Context（上下文）
所有 AI 能力必须携带可追溯上下文：
- `operator_user_id`：操作人
- `source`：触发来源（Tab3 对话 / Tab1 详情页快捷入口 / Tab5 审批详情等）
- `entity`：关联实体（如 `client_id`、`followup_id`、`visit_id`）
- `text`：对话/输入文本（可选）
- `attachments[]`：附件引用（见 2）

### 1.3 审计与留痕（必做）
所有由 AI 建议触发的写操作必须写入日志：
- `ai_trace_id`：一次 AI 推理链路 ID（贯穿多步）
- `action_type`、`before/after`（字段级 diff）
- `approved_by_user`（若需用户确认）
- `timestamp`

---

## 2. 附件上传与“入知识库”预留

### 2.1 统一附件对象（前端/后端约定）
前端上传成功后得到标准 `Attachment`：
- `attachment_id`
- `url`（可带鉴权签名）
- `mime_type`
- `size`
- `sha256`（或 etag）
- `origin_name`
- `owner_user_id`
- `biz_type`（followup/visit/contract/payment/legal_fee/feedback）
- `biz_id`（对应记录 id）

### 2.2 附件入库（知识库/向量库）动作
为每个有附件的功能预留“入库”入口与 API：
- **手动入库**：用户点击“加入知识库/用于 AI 总结”
- **自动入库**（可配置）：满足条件（如合同/拜访录音）自动入库

入库请求建议：
- `POST /ai/knowledge/ingest`
- body：`{ attachment_id, client_id?, tags?, source, trace_id? }`

入库状态建议：
- `pending` / `processing` / `done` / `failed`
- 前端需要可见 “入库中/失败重试/已入库”

---

## 3. CRUD + AI “识别并操作”的预留方式

### 3.1 每个页面的“AI 入口点”
每个核心页面必须预留统一入口（不一定都做 UI，至少预留调用点）：
- Tab1 客户详情：`AI 对话（带 client 上下文）`
- 跟进/拜访/合同/回款/费用：`AI 辅助填写（从文本/附件中抽取字段）`
- Tab5 审批详情：`AI 总结申请 / 风险提示 / 一键通过草案（仍需确认）`

### 3.2 Action 执行通道（不破坏现有 API）
AI 不需要“新接口替代 CRUD”，而是走现有 CRUD API：
- AI 产生 `action.payload`
- 前端按 action_type 调用已有 API（如 `createFollowup` / `updateClient`）
- 成功后写入 `ai_action_log`

如后端希望统一入口，也可提供：
- `POST /ai/actions/execute`（服务端再路由到各业务服务）
但前端仍应保留“直接调用业务 API”的能力，避免 AI 成为单点。

---

## 4. 角色与安全（AI 不能越权）
AI 只能提出建议，最终执行必须满足：
- 当前用户权限（role/org scope）
- 数据范围（owner/team/branch/hq）
- 高危操作二次确认（删除、转交、分配、审批）

---

## 5. 与当前项目约定的最小落地清单（MVP）
- 为 Tab1/Tab2/Tab5 的核心写操作统一加上：
  - `trace_id`（可选）
  - `ai_source`（可选）
  - `attachments[]` 统一结构（见 2.1）
- 为上传组件预留：`onUploaded(Attachment[])` + “入库”按钮位
- 新增 `docs/AI接入与扩展点规范.md` 并在各 Tab 规划/任务清单中引用



