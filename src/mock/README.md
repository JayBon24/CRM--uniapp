# Mock 数据系统说明

## 概述

本项目采用基于规范的 Mock 数据系统，通过 `vite-plugin-mock` 插件实现 API 请求拦截和模拟数据返回。

## 系统架构

### 核心文件

- `src/mock/utils.ts` - 工具函数和错误码定义
- `src/mock/index.ts` - Mock 入口文件，统一注册所有处理器
- `src/mock/[module].ts` - 各模块的 Mock 数据文件

### 支持的模块

1. **用户模块** (`user.ts`)
   - 用户登录、注册、信息管理
   - 验证码发送、微信登录
   - 用户权限和统计数据

2. **展览模块** (`exhibition.ts`)
   - 展览列表、详情、创建
   - 展览管理、收藏、点赞
   - 分页查询和状态过滤

3. **字典模块** (`dict.ts`)
   - 系统字典数据管理
   - 展览相关配置选项
   - 用户性别等基础数据

## 使用方式

### 1. 环境配置

通过环境变量 `VITE_USE_MOCK` 控制是否启用 Mock：

```bash
# .env.development
VITE_USE_MOCK=true

# .env.production
VITE_USE_MOCK=false
```

### 2. API 调用

前端调用方式与真实 API 完全一致：

```typescript
import { http } from '@/utils/request'

// 用户登录
const login = async (params: LoginParams) => {
  const response = await http.post('/auth/login', params)
  return response
}

// 获取展览列表
const getExhibitions = async (params: any) => {
  const response = await http.get('/exhibition/list', params)
  return response
}
```

### 3. 响应格式

所有 Mock 响应都遵循统一格式：

```typescript
{
  code: 200,         // 状态码
  msg: 'success',    // 消息提示
  data: any          // 响应数据
}
```

分页接口额外包含：

```typescript
{
  code: 200,
  msg: 'success',
  rows: [],          // 数据列表
  total: 100         // 总条数
}
```

## 开发规范

### 1. 文件命名

- 使用小写字母和连字符
- 例如：`user-profile.ts`、`exhibition-manage.ts`

### 2. 数据结构

- 使用 TypeScript 接口定义
- 提供真实有意义的示例数据
- 包含各种边界情况

### 3. 错误处理

使用标准错误码：

```typescript
export const MockErrorCode = {
  SUCCESS: 200,      // 操作成功
  BAD_REQUEST: 400,  // 参数错误
  UNAUTHORIZED: 401, // 未授权
  FORBIDDEN: 403,    // 权限不足
  NOT_FOUND: 404,    // 资源不存在
  SERVER_ERROR: 500  // 服务器错误
}
```

### 4. 工具函数

提供丰富的工具函数：

```typescript
// 创建标准响应
createMockResponse(data)

// 创建错误响应
createMockError(code, message)

// 生成随机数据
randomInt(min, max)
generateRandomId(prefix)
getRandomImage(category)

// 数据处理
paginateData(data, pageNum, pageSize)
filterData(data, filters)
sortData(data, orderByColumn, isAsc)
```

## 最佳实践

### 1. 数据生成

```typescript
// 使用工具函数生成真实数据
function generateMockUser(id?: string): UserInfo {
  return {
    id: id || randomInt(1, 10000),
    username: `user${randomInt(1000, 9999)}`,
    nickname: '书法爱好者',
    avatar: getUserAvatarUrl(randomInt(1, 10)),
    // ...其他字段
  }
}
```

### 2. 参数验证

```typescript
function mockCreateExhibition(params: any) {
  const validation = validateRequiredParams(params, [
    'title', 'description', 'type'
  ])

  if (!validation.valid) {
    return createMockError(MockErrorCode.BAD_REQUEST, validation.message!)
  }

  // 处理业务逻辑...
}
```

### 3. 分页处理

```typescript
function mockGetExhibitionList(params: any) {
  const { pageNum = 1, pageSize = 10, status, type } = params

  let result = generateExhibitionList(pageNum, pageSize)

  // 状态过滤
  if (status) {
    result.rows = result.rows.filter(item => item.status === status)
  }

  return createMockResponse(result)
}
```

## 注意事项

1. **保持一致性**：与后端 API 响应格式保持一致
2. **数据质量**：提供真实有意义的示例数据
3. **性能考虑**：避免生成过多无用数据
4. **维护性**：及时更新 Mock 数据与接口文档同步
5. **测试覆盖**：包含各种边界情况和异常场景

## 扩展指南

### 添加新模块

1. 创建 `src/mock/[module].ts` 文件
2. 定义数据接口和模拟数据
3. 实现 Mock 处理函数
4. 在 `src/mock/index.ts` 中注册处理器

### 添加新接口

1. 在对应模块文件中添加处理函数
2. 在模块的导出数组中添加接口配置
3. 更新相关文档和类型定义

## 故障排除

### 常见问题

1. **Mock 不生效**：检查环境变量 `VITE_USE_MOCK` 设置
2. **接口未找到**：确认 URL 路径匹配正确
3. **响应格式错误**：检查是否使用 `createMockResponse` 函数
4. **循环依赖**：避免在 `request.ts` 中直接引入 mock 文件

### 调试技巧

1. 查看控制台日志，Mock 请求会显示 `📦 模拟数据响应`
2. 使用 `console.log` 在 Mock 处理函数中调试
3. 检查网络面板，Mock 请求不会发送真实网络请求
