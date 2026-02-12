# 律所CRM管理系统 - 微信小程序前端

基于 UniApp Vue3 开发的律所客户关系管理（CRM）系统微信小程序前端，专为广东万方律师事务所设计，实现客户全生命周期管理、AI智能赋能、销售流程标准化和数据驱动决策。

## 项目概述

### 项目背景
在法律服务行业竞争日趋激烈的背景下，传统客户管理模式存在客户线索分散、跟进流程不规范、客户状态标记主观、销售数据难以量化分析等问题。本项目旨在通过智能化手段实现客户全生命周期管理、销售流程标准化、数据驱动决策，助力销售团队精准触达客户、高效推进业务。

### 核心功能
- **客户全生命周期管理**：公海客户 → 跟进客户 → 交案客户 → 回款客户 → 赢单客户
- **AI智能赋能**：客户状态自动标记、智能日历提醒、跟进辅助推荐、语音指挥助理
- **权限管理**：总所管理人员、分所管理人员、销售人员三级权限体系
- **销售数据分析**：多维度指标分析、可视化报告、整改建议输出

## 技术栈

- **前端框架**：UniApp + Vue3 + TypeScript
- **UI组件库**：uView Plus
- **状态管理**：Pinia + pinia-plugin-persistedstate
- **构建工具**：Vite
- **样式预处理**：SCSS
- **原子化CSS**：UnoCSS
- **代码规范**：ESLint + Prettier + TypeScript
- **HTTP客户端**：Axios
- **工具库**：Day.js、VueUse、Pinyin-pro、Lunar-javascript
- **AI集成**：@xpert-ai/chatkit-vue

## 项目结构

```
src/
├── components/           # 公共组件
│   ├── ClientPanels/    # 客户信息面板组件
│   ├── AiHeader/        # AI头部组件
│   ├── OrganizerSelector/ # 组织选择器
│   └── ...
├── pages/               # 页面文件
│   ├── tab/            # 底部Tab页面
│   │   ├── customers.vue    # 客户管理
│   │   ├── schedule.vue     # 日程管理
│   │   ├── ai.vue           # AI助理
│   │   ├── reports.vue      # 数据报表
│   │   └── mine.vue         # 我的
│   └── other/          # 其他页面
│       ├── auth/       # 认证相关
│       ├── customer/   # 客户相关
│       ├── case/       # 案件相关
│       └── ...
├── stores/             # Pinia状态管理
│   ├── user.ts        # 用户状态
│   ├── city.ts        # 城市数据
│   ├── dict.ts        # 字典数据
│   └── index.ts       # Pinia实例
├── utils/             # 工具函数
│   ├── request.ts     # HTTP请求封装
│   ├── auth.ts        # 认证相关
│   ├── storage.ts     # 本地存储
│   └── ...
├── config/            # 配置文件
│   └── env.ts         # 环境变量配置
├── mock/              # Mock数据
└── custom-tab-bar/    # 自定义TabBar
```

## 快速开始

### 环境要求
- Node.js >= 16
- pnpm >= 7
- 微信开发者工具（小程序开发）

### 安装依赖
```bash
pnpm install
```

### 环境配置
1. 复制环境变量模板：
```bash
cp .env.sample .env.development
```

2. 修改 `src/config/env.ts` 中的配置（小程序不支持.env文件）

### 开发模式
```bash
# 微信小程序开发
pnpm dev:mp-weixin

# H5开发
pnpm dev:h5

# App开发
pnpm dev:app
```

### 构建生产版本
```bash
# 微信小程序
pnpm build:mp-weixin

# H5
pnpm build:h5

# H5（启用Mock数据，用于演示）
pnpm build:h5:mock

# App
pnpm build:app
```

## 功能模块

### 1. 客户管理（Tab1）
- 客户全生命周期状态管理
- 客户信息录入与编辑
- 跟进记录管理
- 客户转交与分配
- 拜访足迹记录

### 2. 日程管理（Tab2）
- 智能日历视图
- 日程创建与编辑
- 提醒设置
- 客户关联日程
- 团队日程查看

### 3. AI助理（Tab3）
- AI对话交互
- 客户状态自动标记
- 语音指挥助理
- 销售话术推荐
- 智能提醒生成

### 4. 数据报表（Tab4）
- 销售数据统计
- 客户转化漏斗
- 跟进频次分析
- 可视化图表
- 整改建议输出

### 5. 我的（Tab5）
- 个人资料管理
- 消息提醒
- 审批中心
- 系统设置
- 反馈与支持

## 开发规范

### 代码规范
- 使用 TypeScript 进行类型检查
- 遵循 Vue3 Composition API 规范
- 组件采用单文件组件（SFC）格式
- 样式使用 SCSS 预处理器
- 代码提交前进行 ESLint 检查

### 命名规范
- 组件：PascalCase（如 `UserSelector.vue`）
- 页面：kebab-case（如 `customer-detail.vue`）
- 变量/函数：camelCase
- 常量：UPPER_SNAKE_CASE

### 状态管理
- 使用 Pinia 进行状态管理
- 状态持久化使用 pinia-plugin-persistedstate
- 模块化 store 设计

### 请求封装
- 所有 HTTP 请求通过 `src/utils/request.ts` 统一处理
- 错误处理统一在 request 层完成
- 支持请求拦截和响应拦截

## Mock数据功能

项目集成了完整的Mock数据系统，支持开发和生产环境：

### 开发环境
- 默认启用Mock数据
- 可通过环境变量 `VITE_USE_MOCK` 控制

### 生产环境
- 使用 `pnpm build:h5:mock` 构建启用Mock的版本
- 或创建 `.env.production` 文件设置 `VITE_USE_MOCK=true`

## 权限系统

### 角色划分
1. **总所管理人员**：系统最高管理权限
2. **分所管理人员**：本所范围内的管理权限
3. **销售人员**：个人负责客户的操作权限

### 权限控制
- 客户线索管理权限
- 客户信息管理权限
- AI标记管理权限
- 日程与提醒管理权限
- 销售数据分析权限

## 部署说明

### 微信小程序部署
1. 修改 `src/manifest.json` 中的微信小程序配置
2. 配置微信小程序域名白名单
3. 使用微信开发者工具上传代码

### H5部署
1. 配置生产环境API地址
2. 构建H5版本
3. 部署到Web服务器

## 文档资源

- [需求文档](docs/需求.md) - 项目详细需求说明
- [开发任务清单](docs/移动端_5Tabs_界面规划.md) - 各模块开发任务
- [系统设计分析](docs/系统设计问题分析.md) - 系统架构设计
- [API接口规范](docs/API接口规范.md) - 接口设计规范
- [Mock规范](docs/mock规范.md) - Mock数据规范

## 贡献指南

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'Add some AmazingFeature'`
4. 推送到分支：`git push origin feature/AmazingFeature`
5. 提交 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

如有问题或建议，请通过以下方式联系：

- 项目 Issues：[GitHub Issues](https://github.com/your-repo/issues)
- 邮箱：your-email@example.com

---

**注意**：本项目为广东万方律师事务所CRM管理系统，请确保在使用过程中遵守相关法律法规和平台规范。
