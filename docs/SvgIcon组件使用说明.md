# SvgIcon 全局组件使用说明

## 功能特性

SvgIcon 是一个全局SVG图标组件，支持以下特性：

- ✅ **全局注册**：在 `main.ts` 中全局注册，可在任何页面直接使用
- ✅ **动态大小**：支持传入 `size` 属性定义图标大小，默认40rpx
- ✅ **动态颜色**：支持传入 `color` 属性动态改变图标颜色
- ✅ **响应式**：组件内置响应式样式，自动适配大小变化
- ✅ **事件支持**：支持点击事件 `@click`
- ✅ **性能优化**：使用CSS滤镜实现颜色变化，性能优秀

## 使用方式

### 基础使用

```vue
<SvgIcon name="building" />
```

### 自定义大小

```vue
<!-- 数字类型（rpx单位） -->
<SvgIcon name="account-group" :size="60" />

<!-- 字符串类型 -->
<SvgIcon name="shopping" size="80rpx" />
```

### 自定义颜色

```vue
<!-- 激活状态 -->
<SvgIcon name="file-document" color="#667eea" />

<!-- 默认状态 -->
<SvgIcon name="building" color="#666" />
```

### 完整示例

```vue
<view 
  class="nav-item"
  @click="handleClick"
>
  <SvgIcon 
    name="building" 
    :size="40" 
    color="#666"
    @click="onIconClick"
  />
  <text class="nav-text">协会简介</text>
</view>
```

## 支持的图标

| 图标名称 | 显示效果 | 文件路径 |
|---------|---------|---------|
| `building` | 建筑图标 | `/static/icons/building.svg` |
| `account-group` | 用户组图标 | `/static/icons/account-group.svg` |
| `shopping` | 购物车图标 | `/static/icons/shopping.svg` |
| `file-document` | 文档图标 | `/static/icons/file-document.svg` |
| `ai` | AI人工智能图标 | `/static/icons/ai.svg` |
| `plus` | 加号图标 | `/static/icons/plus.svg` |
| `arrow-left` | 返回左箭头图标 | `/static/icons/arrow-left.svg` |

## Props 参数

| 参数名 | 类型 | 默认值 | 说明 |
|-------|------|-------|------|
| `name` | `string` | 必需 | 图标名称，对应iconMap中的键 |
| `size` | `string \\| number` | `40` | 图标大小，支持数字（rpx）或字符串 |
| `color` | `string` | `#666` | 图标颜色，支持CSS颜色值 |
| `mode` | `string` | `aspectFit` | 图片显示模式，同uni-app image组件 |

## 事件

| 事件名 | 说明 |
|-------|------|
| `click` | 点击图标时触发 |

## 样式说明

- **颜色变化**：使用CSS滤镜实现，不影响SVG文件本身
- **大小自适应**：width和height始终保持一致
- **过渡动画**：颜色变化时有0.3s的平滑过渡效果
- **布局兼容**：支持flex布局，自动适配不同容器

## 注意事项

1. **SVG文件路径**：所有SVG文件必须放在 `src/static/icons/` 目录下
2. **图标映射**：如需添加新图标，请在组件的 `iconMap` 中添加映射
3. **颜色限制**：由于使用CSS滤镜，某些颜色可能无法完美还原
4. **性能考虑**：大量使用时会自动复用CSS滤镜，性能良好

## 技术实现

- **框架**：Vue 3 + TypeScript
- **样式**：SCSS + CSS Filters
- **图标格式**：SVG（矢量图形）
- **注册方式**：全局组件注册
- **兼容性**：支持H5、微信小程序、App等平台
