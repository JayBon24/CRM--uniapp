# sales_stage（展业状态）计算规则说明

## 概述
`sales_stage` 是一个**后端计算的派生字段**，用于更细粒度地跟踪客户的销售进展。它基于客户的 `status`、`followup_count`、`visit_count` 和 `valid_visit_count` 计算得出。

## 计算规则

### 1. PUBLIC_POOL（公海池）
**条件**：`status === 'PUBLIC_POOL'`  
**说明**：客户在公海池中，未被任何销售人员申领

### 2. BLANK（空白）
**条件**：`status === 'FOLLOW_UP' && valid_visit_count === 0`  
**说明**：客户已分配给销售，但还没有任何有效拜访记录（哪怕有电话跟进记录，未面谈前仍算空白）

### 3. MEETING（面谈）
**条件**：`status === 'FOLLOW_UP' && valid_visit_count > 0`  
**说明**：客户已有有效拜访记录（定位成功或有经纬度坐标）

**有效拜访定义**：
- `location_status === 'success'`（定位成功）
- **或** `lng` 和 `lat` 字段非空（有坐标信息）

### 4. CASE（交案）
**条件**：`status === 'CASE'`  
**说明**：客户已确认合同并交案，与 status 一致

### 5. PAYMENT（回款）
**条件**：`status === 'PAYMENT'`  
**说明**：客户已有回款记录，与 status 一致

### 6. WON（赢单）
**条件**：`status === 'WON'`  
**说明**：客户已支付律师费，与 status 一致

---

## 状态转换流程

```
PUBLIC_POOL (公海池)
    ↓ 申领
FOLLOW_UP + BLANK (空白)
    ↓ 有效拜访
FOLLOW_UP + MEETING (面谈)
    ↓ 确认合同
CASE (交案)
    ↓ 录入回款
PAYMENT (回款)
    ↓ 录入律师费
WON (赢单)
```

---

## Mock 数据示例

### 示例 1：空白状态
```javascript
{
  id: 2,
  status: 'FOLLOW_UP',
  sales_stage: 'BLANK', // followup_count=2 但 valid_visit_count=0
  followup_count: 2,
  visit_count: 0,
  valid_visit_count: 0, // 没有有效拜访
  // ...
}
```

### 示例 2：面谈状态
```javascript
{
  id: 3,
  status: 'FOLLOW_UP',
  sales_stage: 'MEETING', // valid_visit_count=2 > 0
  followup_count: 5,
  visit_count: 3,
  valid_visit_count: 2, // 有有效拜访
  // ...
}
```

---

## 前端使用

### 1. 列表筛选
前端支持按 `status`（生命周期）和 `sales_stage`（展业状态）双维度筛选：

```typescript
// 筛选参数
{
  status: 'FOLLOW_UP',      // 生命周期：跟进中
  sales_stage: 'MEETING'    // 展业状态：面谈
}
```

### 2. 状态标签显示
```vue
<SalesStageTag :stage="client.sales_stage" />
```

### 3. 状态映射
```typescript
export const salesStageMap = {
  PUBLIC_POOL: { label: '公海', color: '#909399' },
  BLANK: { label: '空白', color: '#E6A23C' },
  MEETING: { label: '面谈', color: '#409EFF' },
  CASE: { label: '交案', color: '#67C23A' },
  PAYMENT: { label: '回款', color: '#67C23A' },
  WON: { label: '赢单', color: '#F59A23' }
}
```

---

## 注意事项

1. **`sales_stage` 由后端计算**：前端只负责展示，不负责计算
2. **有效拜访的判断**：定位成功 **或** 有坐标即可，不要求两者同时满足
3. **状态转换触发（核心逻辑）**：
   - **申领公海** → `status` 变为 `FOLLOW_UP`，`valid_visit_count` 为 0，则 `sales_stage` 自动变为 `BLANK`（空白）。
   - **记录有效拜访** → 只要 `valid_visit_count` 从 0 变为 >0，且 `status` 为 `FOLLOW_UP`，`sales_stage` 会**立即且自动**从 `BLANK` 变更为 `MEETING`（面谈）。
   - **确认合同** → `status` 变为 `CASE`，`sales_stage` 随之同步。
   - **录入回款** → `status` 变为 `PAYMENT`，`sales_stage` 随之同步。
   - **录入律师费** → `status` 变为 `WON`，`sales_stage` 随之同步。

---

**最后更新**：2024-12-25

