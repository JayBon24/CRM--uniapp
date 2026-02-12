# Mock 开发示例文档

## 概述

本文档展示如何正确创建符合项目规范的Mock数据，包括图片处理、响应格式、错误处理等。

## 图片处理规范

### 使用 picsum.photos 远程图片

在Mock数据中，所有图片都应该使用 `picsum.photos` 的远程图片，通过 `getRandomImage()` 函数生成：

```typescript
// 正确用法
import { getRandomImage, getUserAvatarUrl } from './utils'

// 生成随机图片
const randomImage = getRandomImage('product', 400, 300)

// 生成用户头像
const avatarUrl = getUserAvatarUrl(1)

// 生成展览封面
const coverUrl = getExhibitionCoverUrl('exhibition_001')
```

### 图片尺寸规范

- 用户头像：200x200
- 商品图片：400x300
- 展览封面：400x300
- 笔记图片：400x300
- 轮播图：800x400

## 完整的Mock数据示例

### 1. 商品模块示例

```typescript
/**
 * 商品模块 Mock 数据
 * 包含商品列表、详情、分类等功能
 */

import type { MockHandler } from './utils'
import {
  createMockResponse,
  createMockError,
  MockErrorCode,
  randomInt,
  randomDate,
  generateRandomId,
  getRandomImage,
  paginateData,
  filterData,
  sortData,
  mockDelay,
  validateRequiredParams
} from './utils'

// 商品信息接口
interface IProduct {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  images: string[]
  tags: string[]
  status: 'active' | 'inactive' | 'sold'
  stock: number
  sales: number
  rating: number
  reviewCount: number
  createTime: string
  updateTime: string
}

// 模拟商品数据
const mockProducts: IProduct[] = [
  {
    id: 'product_001',
    name: '精美手工艺品',
    description: '纯手工制作，工艺精湛，适合收藏和送礼',
    price: 299.00,
    originalPrice: 399.00,
    category: 'handcraft',
    images: [
      getRandomImage('product', 400, 300),
      getRandomImage('product', 400, 300),
      getRandomImage('product', 400, 300)
    ],
    tags: ['手工', '收藏', '礼品'],
    status: 'active',
    stock: 50,
    sales: 120,
    rating: 4.8,
    reviewCount: 45,
    createTime: '2024-01-01T10:00:00.000Z',
    updateTime: '2024-01-15T14:30:00.000Z'
  },
  {
    id: 'product_002',
    name: '艺术装饰画',
    description: '现代艺术风格，为您的空间增添艺术气息',
    price: 599.00,
    originalPrice: 799.00,
    category: 'artwork',
    images: [
      getRandomImage('product', 400, 300),
      getRandomImage('product', 400, 300)
    ],
    tags: ['艺术', '装饰', '现代'],
    status: 'active',
    stock: 30,
    sales: 85,
    rating: 4.9,
    reviewCount: 32,
    createTime: '2024-01-02T11:00:00.000Z',
    updateTime: '2024-01-16T15:30:00.000Z'
  }
]

// Mock 处理器函数
function mockGetProductList(params: any) {
  const { pageNum = 1, pageSize = 10, category, keyword, status } = params

  // 数据过滤
  let result = [...mockProducts]

  if (category) {
    result = result.filter(item => item.category === category)
  }

  if (keyword) {
    result = result.filter(item =>
      item.name.includes(keyword) || item.description.includes(keyword)
    )
  }

  if (status) {
    result = result.filter(item => item.status === status)
  }

  // 分页处理
  const paginated = paginateData(result, pageNum, pageSize)

  // 添加延迟模拟网络请求
  return mockDelay().then(() => {
    return createMockResponse(paginated)
  })
}

function mockGetProductDetail({ params }: any) {
  const { id } = params

  if (!id) {
    return createMockError(MockErrorCode.BAD_REQUEST, '商品ID不能为空')
  }

  const product = mockProducts.find(p => p.id === id)
  if (!product) {
    return createMockError(MockErrorCode.NOT_FOUND, '商品不存在')
  }

  return mockDelay().then(() => {
    return createMockResponse(product)
  })
}

function mockCreateProduct(data: any) {
  // 参数验证
  const requiredFields = ['name', 'description', 'price', 'category']
  const validation = validateRequiredParams(data, requiredFields)

  if (!validation.valid) {
    return createMockError(MockErrorCode.BAD_REQUEST, validation.message)
  }

  const newProduct: IProduct = {
    id: generateRandomId('product_'),
    ...data,
    images: data.images || [getRandomImage('product', 400, 300)],
    tags: data.tags || [],
    status: 'active',
    stock: data.stock || 0,
    sales: 0,
    rating: 0,
    reviewCount: 0,
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString()
  }

  mockProducts.push(newProduct)

  return mockDelay().then(() => {
    return createMockResponse(newProduct)
  })
}

// 导出 Mock 处理器
export default [
  {
    url: '/api/products/list',
    response: ({ query }) => mockGetProductList(query)
  },
  {
    url: '/api/products/:id',
    response: ({ params }) => mockGetProductDetail({ params })
  },
  {
    url: '/api/products/create',
    response: ({ data }) => mockCreateProduct(data)
  }
] as MockHandler[]
```

### 2. 用户模块示例

```typescript
/**
 * 用户模块 Mock 数据
 * 包含用户信息、登录注册、个人资料等功能
 */

import type { MockHandler } from './utils'
import {
  createMockResponse,
  createMockError,
  MockErrorCode,
  randomInt,
  randomDate,
  generateRandomId,
  getUserAvatarUrl,
  paginateData,
  filterData,
  sortData,
  mockDelay,
  validateRequiredParams
} from './utils'

// 用户信息接口
interface IUser {
  id: string
  username: string
  nickname: string
  email: string
  phone: string
  avatar: string
  status: 'active' | 'inactive' | 'banned'
  createTime: string
  updateTime: string
}

// 模拟用户数据
const mockUsers: IUser[] = [
  {
    id: 'user_001',
    username: 'zhangsan',
    nickname: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138001',
    avatar: getUserAvatarUrl(1),
    status: 'active',
    createTime: '2024-01-01T10:00:00.000Z',
    updateTime: '2024-01-15T14:30:00.000Z'
  },
  {
    id: 'user_002',
    username: 'lisi',
    nickname: '李四',
    email: 'lisi@example.com',
    phone: '13800138002',
    avatar: getUserAvatarUrl(2),
    status: 'active',
    createTime: '2024-01-02T11:00:00.000Z',
    updateTime: '2024-01-16T15:30:00.000Z'
  }
]

// Mock 处理器函数
function mockGetUserList(params: any) {
  const { pageNum = 1, pageSize = 10, keyword, status } = params

  // 数据过滤
  let result = [...mockUsers]

  if (keyword) {
    result = result.filter(item =>
      item.username.includes(keyword) ||
      item.nickname.includes(keyword) ||
      item.email.includes(keyword)
    )
  }

  if (status) {
    result = result.filter(item => item.status === status)
  }

  // 分页处理
  const paginated = paginateData(result, pageNum, pageSize)

  return mockDelay().then(() => {
    return createMockResponse(paginated)
  })
}

function mockGetUserProfile({ params }: any) {
  const { id } = params

  if (!id) {
    return createMockError(MockErrorCode.BAD_REQUEST, '用户ID不能为空')
  }

  const user = mockUsers.find(u => u.id === id)
  if (!user) {
    return createMockError(MockErrorCode.NOT_FOUND, '用户不存在')
  }

  return mockDelay().then(() => {
    return createMockResponse(user)
  })
}

function mockUserLogin(data: any) {
  // 参数验证
  const requiredFields = ['username', 'password']
  const validation = validateRequiredParams(data, requiredFields)

  if (!validation.valid) {
    return createMockError(MockErrorCode.BAD_REQUEST, validation.message)
  }

  // 模拟登录验证
  const user = mockUsers.find(u => u.username === data.username)
  if (!user) {
    return createMockError(MockErrorCode.UNAUTHORIZED, '用户名或密码错误')
  }

  // 模拟登录成功
  const loginResult = {
    user,
    token: generateRandomId('token_'),
    expiresIn: 7200
  }

  return mockDelay().then(() => {
    return createMockResponse(loginResult)
  })
}

// 导出 Mock 处理器
export default [
  {
    url: '/api/users/list',
    response: ({ query }) => mockGetUserList(query)
  },
  {
    url: '/api/users/:id',
    response: ({ params }) => mockGetUserProfile({ params })
  },
  {
    url: '/api/auth/login',
    response: ({ data }) => mockUserLogin(data)
  }
] as MockHandler[]
```

## 关键要点

### 1. 图片处理
- ✅ 使用 `getRandomImage()` 函数生成随机图片
- ✅ 使用 `getUserAvatarUrl()` 生成用户头像
- ✅ 所有图片都来自 `picsum.photos`
- ❌ 不要使用本地图片路径

### 2. 响应格式
- ✅ 使用 `createMockResponse()` 创建成功响应
- ✅ 使用 `createMockError()` 创建错误响应
- ✅ 分页数据使用 `{ rows, total }` 格式
- ❌ 不要直接返回原始数据

### 3. 错误处理
- ✅ 使用标准的错误码（401、403、404、500等）
- ✅ 提供有意义的错误消息
- ✅ 参数验证使用 `validateRequiredParams()`

### 4. 数据生成
- ✅ 提供足够的测试数据（8-12条）
- ✅ 包含各种边界情况
- ✅ 使用有意义的示例数据
- ✅ 支持分页、过滤、排序

### 5. 性能优化
- ✅ 使用 `mockDelay()` 模拟网络延迟
- ✅ 合理使用分页机制
- ✅ 避免生成过多无用数据

## 测试验证

创建Mock数据后，请验证：

1. **响应格式**：确保返回 `{code, msg, data/rows, total}` 格式
2. **图片显示**：确保所有图片都能正常显示
3. **错误处理**：测试各种错误场景
4. **分页功能**：验证分页参数是否正常工作
5. **数据过滤**：测试搜索和筛选功能

## 总结

遵循这些规范创建Mock数据，将确保：
- 数据的一致性和真实性
- 图片资源的可用性
- 响应格式的标准化
- 错误处理的完整性
- 开发体验的流畅性
