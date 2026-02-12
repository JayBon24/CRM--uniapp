# 书画作品评选打分管理系统 - 状态分析报告

## 1. 现有状态分析

### 1.1 字典状态（已实现）
根据 `src/mock/dict.ts` 分析，项目已定义以下字典状态：

#### 展览相关状态
- **展览状态** (`exhibition_status`)
  - `draft` - 建档中
  - `submitting` - 征稿中
  - `statistics` - 统计中
  - `reviewing` - 评选中
  - `published` - 公布展示

- **展览标准可见性** (`exhibition_standard_visibility`)
  - `public` - 公开
  - `private` - 私密
  - `participant` - 仅参与者可见

- **展览评分可见性** (`exhibition_score_visibility`)
  - `public` - 公开
  - `private` - 私密
  - `judge` - 仅评委可见

- **评委身份** (`exhibition_judge_identity`)
  - `public` - 公开
  - `anonymous` - 匿名

- **评论可见性** (`exhibition_comment_visibility`)
  - `public` - 公开
  - `private` - 私密
  - `participant` - 仅参与者可见

- **作品公布方式** (`exhibition_publication_type`)
  - `public` - 公开
  - `private` - 不公开

- **作品分数分布方式** (`exhibition_score_distribution`)
  - `public` - 默认公开
  - `private` - 不公开

- **投稿类型** (`exhibition_submission_type`)
  - `online` - 在线投稿
  - `offline` - 线下投稿
  - `both` - 线上线下

- **评选模式** (`exhibition_evaluation_mode`)
  - `single` - 一次评选
  - `double` - 二次评选

#### 基础状态
- **用户性别** (`sys_user_sex`)
  - `0` - 男
  - `1` - 女
  - `2` - 未知

### 1.2 业务状态（已实现）

#### 展览状态（代码中使用）
- `draft` - 草稿/建档中
- `pending` - 待审核
- `approved` - 已通过
- `rejected` - 已拒绝
- `ongoing` - 进行中
- `ended` - 已结束
- `cancelled` - 已取消

#### 作品状态
- `submitted` - 已提交
- `reviewing` - 审核中
- `selected` - 已通过/入选
- `rejected` - 已拒绝

#### 评选状态
- `pending` - 待开始
- `in_progress` - 进行中
- `completed` - 已完成
- `cancelled` - 已取消

#### 评选阶段
- `primary` - 初选
- `secondary` - 复选
- `final` - 最终结果

#### 参展会员状态
- `pending` - 待审核
- `approved` - 已通过
- `rejected` - 已拒绝

#### 创办方状态
- `active` - 激活
- `inactive` - 未激活

#### 区域状态
- `0` - 正常
- `1` - 停用

## 2. 缺失的状态分析

### 2.1 作品投稿相关状态

#### 作品审核状态（建议新增）
```sql
-- 作品审核状态
INSERT INTO `sys_dict_type` (`dict_name`, `dict_type`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('作品审核状态', 'artwork_review_status', '0', 'admin', NOW(), 'admin', NOW(), '作品审核状态：待审核、审核中、通过、不通过、需修改');
INSERT INTO `sys_dict_data` (`dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES
(1, '待审核', 'pending', 'artwork_review_status', '', 'warning', 'Y', '0', 'admin', NOW(), 'admin', NOW(), '等待审核'),
(2, '审核中', 'reviewing', 'artwork_review_status', '', 'primary', 'N', '0', 'admin', NOW(), 'admin', NOW(), '正在审核'),
(3, '通过', 'approved', 'artwork_review_status', '', 'success', 'N', '0', 'admin', NOW(), 'admin', NOW(), '审核通过'),
(4, '不通过', 'rejected', 'artwork_review_status', '', 'danger', 'N', '0', 'admin', NOW(), 'admin', NOW(), '审核不通过'),
(5, '需修改', 'revision', 'artwork_review_status', '', 'warning', 'N', '0', 'admin', NOW(), 'admin', NOW(), '需要修改后重新提交');
```

#### 作品类型（建议新增）
```sql
-- 作品类型
INSERT INTO `sys_dict_type` (`dict_name`, `dict_type`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('作品类型', 'artwork_type', '0', 'admin', NOW(), 'admin', NOW(), '作品类型：书法、绘画、篆刻等');
INSERT INTO `sys_dict_data` (`dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES
(1, '书法', 'calligraphy', 'artwork_type', '', 'primary', 'Y', '0', 'admin', NOW(), 'admin', NOW(), '书法作品'),
(2, '国画', 'traditional_painting', 'artwork_type', '', 'success', 'N', '0', 'admin', NOW(), 'admin', NOW(), '国画作品'),
(3, '油画', 'oil_painting', 'artwork_type', '', 'info', 'N', '0', 'admin', NOW(), 'admin', NOW(), '油画作品'),
(4, '水彩', 'watercolor', 'artwork_type', '', 'warning', 'N', '0', 'admin', NOW(), 'admin', NOW(), '水彩作品'),
(5, '篆刻', 'seal', 'artwork_type', '', 'danger', 'N', '0', 'admin', NOW(), 'admin', NOW(), '篆刻作品'),
(6, '其他', 'other', 'artwork_type', '', 'default', 'N', '0', 'admin', NOW(), 'admin', NOW(), '其他类型');
```

### 2.2 评选流程相关状态

#### 评委角色（建议新增）
```sql
-- 评委角色
INSERT INTO `sys_dict_type` (`dict_name`, `dict_type`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('评委角色', 'judge_role', '0', 'admin', NOW(), 'admin', NOW(), '评委角色：初选评委、复选评委、首席评委');
INSERT INTO `sys_dict_data` (`dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES
(1, '初选评委', 'first_judge', 'judge_role', '', 'primary', 'Y', '0', 'admin', NOW(), 'admin', NOW(), '负责初选阶段评审'),
(2, '复选评委', 'final_judge', 'judge_role', '', 'success', 'N', '0', 'admin', NOW(), 'admin', NOW(), '负责复选阶段评审'),
(3, '首席评委', 'chief_judge', 'judge_role', '', 'warning', 'N', '0', 'admin', NOW(), 'admin', NOW(), '负责最终决策');
```

#### 评分标准类型（建议新增）
```sql
-- 评分标准类型
INSERT INTO `sys_dict_type` (`dict_name`, `dict_type`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('评分标准类型', 'scoring_criteria_type', '0', 'admin', NOW(), 'admin', NOW(), '评分标准类型：分数型、否决型');
INSERT INTO `sys_dict_data` (`dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES
(1, '分数型', 'score', 'scoring_criteria_type', '', 'success', 'Y', '0', 'admin', NOW(), 'admin', NOW(), '按分数评判'),
(2, '否决型', 'reject', 'scoring_criteria_type', '', 'danger', 'N', '0', 'admin', NOW(), 'admin', NOW(), '一票否决制');
```

### 2.3 系统管理相关状态

#### 通知类型（建议新增）
```sql
-- 通知类型
INSERT INTO `sys_dict_type` (`dict_name`, `dict_type`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('通知类型', 'notification_type', '0', 'admin', NOW(), 'admin', NOW(), '系统通知类型');
INSERT INTO `sys_dict_data` (`dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES
(1, '系统通知', 'system', 'notification_type', '', 'primary', 'Y', '0', 'admin', NOW(), 'admin', NOW(), '系统自动发送的通知'),
(2, '展览通知', 'exhibition', 'notification_type', '', 'success', 'N', '0', 'admin', NOW(), 'admin', NOW(), '展览相关通知'),
(3, '评选通知', 'evaluation', 'notification_type', '', 'warning', 'N', '0', 'admin', NOW(), 'admin', NOW(), '评选流程通知'),
(4, '作品通知', 'artwork', 'notification_type', '', 'info', 'N', '0', 'admin', NOW(), 'admin', NOW(), '作品相关通知');
```

#### 操作日志类型（建议新增）
```sql
-- 操作日志类型
INSERT INTO `sys_dict_type` (`dict_name`, `dict_type`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('操作日志类型', 'operation_log_type', '0', 'admin', NOW(), 'admin', NOW(), '系统操作日志类型');
INSERT INTO `sys_dict_data` (`dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES
(1, '登录', 'login', 'operation_log_type', '', 'success', 'Y', '0', 'admin', NOW(), 'admin', NOW(), '用户登录'),
(2, '创建', 'create', 'operation_log_type', '', 'primary', 'N', '0', 'admin', NOW(), 'admin', NOW(), '创建操作'),
(3, '修改', 'update', 'operation_log_type', '', 'warning', 'N', '0', 'admin', NOW(), 'admin', NOW(), '修改操作'),
(4, '删除', 'delete', 'operation_log_type', '', 'danger', 'N', '0', 'admin', NOW(), 'admin', NOW(), '删除操作'),
(5, '查询', 'query', 'operation_log_type', '', 'info', 'N', '0', 'admin', NOW(), 'admin', NOW(), '查询操作');
```

### 2.4 业务流程状态

#### 展览征稿方式（建议新增）
```sql
-- 展览征稿方式
INSERT INTO `sys_dict_type` (`dict_name`, `dict_type`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('展览征稿方式', 'exhibition_recruitment_type', '0', 'admin', NOW(), 'admin', NOW(), '展览征稿方式：公开征稿、定向征稿');
INSERT INTO `sys_dict_data` (`dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES
(1, '公开征稿', 'open', 'exhibition_recruitment_type', '', 'success', 'Y', '0', 'admin', NOW(), 'admin', NOW(), '面向所有用户公开征稿'),
(2, '定向征稿', 'invitation', 'exhibition_recruitment_type', '', 'warning', 'N', '0', 'admin', NOW(), 'admin', NOW(), '仅向特定用户发出征稿邀请');
```

#### 支付状态（建议新增）
```sql
-- 支付状态
INSERT INTO `sys_dict_type` (`dict_name`, `dict_type`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('支付状态', 'payment_status', '0', 'admin', NOW(), 'admin', NOW(), '支付状态：待支付、已支付、支付失败、已退款');
INSERT INTO `sys_dict_data` (`dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES
(1, '待支付', 'pending', 'payment_status', '', 'warning', 'Y', '0', 'admin', NOW(), 'admin', NOW(), '等待用户支付'),
(2, '已支付', 'paid', 'payment_status', '', 'success', 'N', '0', 'admin', NOW(), 'admin', NOW(), '支付成功'),
(3, '支付失败', 'failed', 'payment_status', '', 'danger', 'N', '0', 'admin', NOW(), 'admin', NOW(), '支付失败'),
(4, '已退款', 'refunded', 'payment_status', '', 'info', 'N', '0', 'admin', NOW(), 'admin', NOW(), '已退款');
```

#### 文件上传状态（建议新增）
```sql
-- 文件上传状态
INSERT INTO `sys_dict_type` (`dict_name`, `dict_type`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('文件上传状态', 'file_upload_status', '0', 'admin', NOW(), 'admin', NOW(), '文件上传状态：上传中、上传成功、上传失败');
INSERT INTO `sys_dict_data` (`dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES
(1, '上传中', 'uploading', 'file_upload_status', '', 'primary', 'Y', '0', 'admin', NOW(), 'admin', NOW(), '文件正在上传'),
(2, '上传成功', 'success', 'file_upload_status', '', 'success', 'N', '0', 'admin', NOW(), 'admin', NOW(), '文件上传成功'),
(3, '上传失败', 'failed', 'file_upload_status', '', 'danger', 'N', '0', 'admin', NOW(), 'admin', NOW(), '文件上传失败');
```

## 3. 系统状态优化建议

### 3.1 状态一致性问题
- **问题**: 代码中的展览状态与字典中的展览状态不完全一致
- **建议**: 统一状态定义，建议以字典中的状态为准：
  - `draft` → `submitting` → `statistics` → `reviewing` → `published`

### 3.2 状态扩展建议

#### 展览状态扩展
```sql
-- 展览状态扩展（添加暂停和取消状态）
INSERT INTO `sys_dict_data` (`dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES
(6, '暂停', 'paused', 'exhibition_status', '', 'warning', 'N', '0', 'admin', NOW(), 'admin', NOW(), '展览暂停进行'),
(7, '取消', 'cancelled', 'exhibition_status', '', 'danger', 'N', '0', 'admin', NOW(), 'admin', NOW(), '展览已取消');
```

#### 用户账户状态
```sql
-- 用户账户状态
INSERT INTO `sys_dict_type` (`dict_name`, `dict_type`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('用户账户状态', 'user_account_status', '0', 'admin', NOW(), 'admin', NOW(), '用户账户状态：正常、冻结、禁用');
INSERT INTO `sys_dict_data` (`dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES
(1, '正常', 'normal', 'user_account_status', '', 'success', 'Y', '0', 'admin', NOW(), 'admin', NOW(), '账户正常'),
(2, '冻结', 'frozen', 'user_account_status', '', 'warning', 'N', '0', 'admin', NOW(), 'admin', NOW(), '账户被冻结'),
(3, '禁用', 'disabled', 'user_account_status', '', 'danger', 'N', '0', 'admin', NOW(), 'admin', NOW(), '账户被禁用');
```

## 4. 实施建议

### 4.1 优先级排序
1. **高优先级**: 作品审核状态、作品类型、评委角色 - 核心业务功能需要
2. **中优先级**: 通知类型、展览征稿方式、支付状态 - 用户体验相关
3. **低优先级**: 操作日志类型、文件上传状态 - 系统管理功能

### 4.2 实施步骤
1. 首先补充核心业务状态的字典定义
2. 更新相关接口类型定义文件
3. 修改前端页面中硬编码的状态映射
4. 统一状态管理，使用字典数据替代硬编码

### 4.3 代码改进建议
1. 创建统一的状态管理工具类
2. 使用字典数据动态生成状态选项
3. 建立状态变更的业务规则验证
4. 添加状态变更的审计日志

这些状态的补充将使系统更加完整和易于维护，同时提供更好的用户体验和管理功能。
