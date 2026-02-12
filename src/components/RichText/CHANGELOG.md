# RichText 组件更新日志

## v1.1.0 - 样式集中管理

### 🎨 新增功能
- **样式集中管理**：将所有富文本相关样式集中到组件内部
- **预设样式类**：新增多个预设样式类，适用于不同场景
- **优化结构**：移除页面中的冗余样式代码

### 📦 新增预设样式类

#### 1. 展览描述样式 (`exhibition-description-text`)
- 适用于展览详情页的描述内容
- 渐变背景：`#f8f9fa` → `#ffffff`
- 圆角边框和阴影效果
- 标题有特殊的颜色和边框样式

#### 2. 文章内容样式 (`article-content`)
- 适用于文章详情页
- 白色背景，带阴影效果
- 较大的字体 (30rpx) 和行高 (1.8)

#### 3. 评论内容样式 (`comment-content`)
- 适用于评论列表
- 灰色背景 (`#f8f9fa`)，左侧有边框
- 较小的字体 (26rpx)，适合短内容

#### 4. 卡片内容样式 (`card-content`)
- 适用于卡片组件
- 渐变背景，带阴影
- 中等字体大小 (28rpx)

#### 5. 简洁样式 (`simple-content`)
- 无背景，无边框
- 适用于内嵌显示
- 最简洁的样式

### 🔧 优化内容

#### 样式管理优化
- 将所有富文本相关 CSS 从页面移动到组件内部
- 减少页面代码冗余
- 提高样式的可维护性

#### 代码结构优化
- 删除 `src/pages/exhibition/detail.vue` 中的富文本样式
- 保持组件功能完整性
- 优化样式加载性能

### 📝 使用示例

```vue
<!-- 展览描述 -->
<RichText :content="exhibition.description" custom-class="exhibition-description-text" />

<!-- 文章内容 -->
<RichText :content="article.content" custom-class="article-content" />

<!-- 评论内容 -->
<RichText :content="comment.content" custom-class="comment-content" />

<!-- 卡片内容 -->
<RichText :content="card.content" custom-class="card-content" />

<!-- 简洁显示 -->
<RichText :content="content" custom-class="simple-content" />
```

### 🎯 优势

1. **统一管理**：所有富文本样式集中在一个组件中
2. **易于维护**：修改样式只需要在一个地方进行
3. **可复用性**：预设样式类可以在任何页面使用
4. **性能优化**：减少重复的 CSS 代码
5. **开发效率**：提供开箱即用的样式类

### 🔄 迁移指南

如果您之前在其他页面中使用了富文本样式，可以：

1. 导入 RichText 组件
2. 选择合适的预设样式类
3. 删除页面中的相关 CSS 代码
4. 使用 `custom-class` 属性应用样式

### 📚 文档更新

- 更新了 README.md 文档
- 新增预设样式类说明
- 更新使用示例
- 添加迁移指南
