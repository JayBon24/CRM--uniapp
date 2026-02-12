#

基于 UniApp Vue3 的微信小程序应用

## 技术栈

- **前端框架**：UniApp + Vue3 + TypeScript
- **UI组件库**：uView Plus
- **状态管理**：Pinia
- **构建工具**：Vite
- **样式预处理**：SCSS
- **代码规范**：ESLint + Prettier

## 快速开始

### 环境要求
- Node.js >= 16
- pnpm >= 7


# copy .env.sample to .env and modify the values as needed 打包到小程序后是不支持.env的，需要修改src/config/env.ts文件

### 安装依赖
```bash
pnpm install
```

### 开发模式
```bash
# 微信小程序
pnpm dev:mp-weixin

# H5
pnpm dev:h5

# App
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


## 开发规范

- 使用 TypeScript 进行类型检查
- 遵循 Vue3 Composition API 规范
- 组件采用单文件组件（SFC）格式
- 样式使用 SCSS 预处理器
- 代码提交前进行 ESLint 检查

## Mock数据功能

项目集成了完整的Mock数据系统，支持开发和生产环境：

### 开发环境
- 默认启用Mock数据
- 可通过环境变量 `VITE_USE_MOCK` 控制

### 生产环境
- 使用 `pnpm build:h5:mock` 构建启用Mock的版本
- 或创建 `.env.production` 文件设置 `VITE_USE_MOCK=true`

详细使用说明请参考：[生产环境Mock使用说明](docs/生产环境Mock使用说明.md)

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

**注意**：本项目为书画作品评选打分管理系统，请确保在使用过程中遵守相关法律法规和平台规范。



# H5
pnpm dev:h5



创建一个cursor长期记忆(Generate Memories)，只限当前项目，以后生成接口和 mock 时，自动参考这两个规范 docs\mock规范.md 与 docs\API接口规范.md
创建一个cursor长期记忆(Generate Memories)，mock的图片使用 picsum.photos的远程图片
创建一个cursor长期记忆(Generate Memories) 在uni-app中，我们应该从 @dcloudio/uni-app 导入所有的生命周期钩子
创建一个cursor长期记忆(Generate Memories)，所有的请求由 src\utils\request.ts 统计处理异常，页面使用时，每个API调用时都不需要处理，


创建的展览，有一些是一次评选，有的是二次评选，相应的，评委级也要动态切换，怎么怎么这个系统？
