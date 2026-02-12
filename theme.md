为了统一所有页面的主题配色，我建议创建一个全局的主题配置文件。这样可以集中管理颜色，并确保所有页面保持一致。我来帮您实现：

1. 首先创建主题配置文件：
2. 在 uni.scss 中引入主题文件：
3. 让我们用新的主题样式重构一个页面作为示例：
这个主题系统的主要优点：

1. 集中管理：
   - 所有颜色都在 theme.scss 中统一管理
   - 使用 SCSS 变量和函数便于维护
   - 可以轻松切换主题

2. 常用混入（mixins）：
   - flex-center/flex-between：布局
   - text-ellipsis：文本省略
   - card-style：卡片样式
   - click-effect：点击效果
   - gradient：渐变背景
   - shadow：阴影效果
   - transition：过渡动画
   - safe-area：安全区适配

3. 使用方法：
```scss
.my-component {
  // 使用主题色
  background-color: theme(bg-base);
  color: theme(text-primary);
  
  // 使用混入
  @include flex-center;
  @include card-style;
  @include click-effect;
}
```

4. 优点：
   - 统一的视觉风格
   - 易于维护和修改
   - 减少重复代码
   - 提高开发效率

要在其他页面使用这个主题系统，只需：
1. 导入 theme.scss
2. 使用 theme() 函数获取颜色
3. 使用提供的 mixins 实现常用样式

您觉得这个主题系统如何？我们可以：
1. 调整颜色方案
2. 添加更多混入
3. 创建多套主题
4. 添加主题切换功能


我来为您写一些常用的主题样式示例，这些示例可以直接复用：
我创建了一个完整的样式示例文件，包含了多个常用组件的样式。让我为您展示如何使用这些样式：

1. 按钮示例：
```html
<view class="btn btn-primary">主要按钮</view>
<view class="btn btn-secondary">次要按钮</view>
<view class="btn btn-plain">朴素按钮</view>
```

2. 卡片示例：
```html
<view class="card">
  <view class="card-header">
    <text class="title">卡片标题</text>
    <text class="extra">更多</text>
  </view>
  <view class="card-content">
    卡片内容
  </view>
  <view class="card-footer">
    <view class="btn btn-plain">取消</view>
    <view class="btn btn-primary">确定</view>
  </view>
</view>
```

3. 列表示例：
```html
<view class="list">
  <view class="list-item">
    <view class="content">
      <view class="title">列表标题</view>
      <view class="desc">列表描述信息</view>
    </view>
    <u-icon name="arrow-right" class="arrow" />
  </view>
</view>
```

4. 标签示例：
```html
<view class="tag tag-primary">主要</view>
<view class="tag tag-success">成功</view>
<view class="tag tag-warning">警告</view>
<view class="tag tag-error">错误</view>
```

5. 表单示例：
```html
<view class="form">
  <view class="form-item">
    <view class="label">用户名</view>
    <input class="input" placeholder="请输入用户名" />
    <view class="error">请输入正确的用户名</view>
  </view>
</view>
```

6. 网格示例：
```html
<view class="grid grid-4">
  <view class="grid-item">
    <u-icon name="home" class="icon" />
    <text class="text">首页</text>
  </view>
</view>
```

7. 空状态示例：
```html
<view class="empty">
  <u-icon name="info" class="icon" />
  <text class="text">暂无数据</text>
  <view class="btn btn-primary">刷新</view>
</view>
```

8. 加载状态示例：
```html
<view class="loading">
  <view class="spinner" />
  <text class="text">加载中...</text>
</view>
```

9. 价格标签示例：
```html
<view class="price">
  <text class="price-symbol">¥</text>
  <text class="price-integer">99</text>
  <text class="price-decimal">.99</text>
  <text class="price-original">¥199.99</text>
</view>
```

使用这些样式的优点：
1. 统一的视觉风格
2. 可复用的组件样式
3. 响应式设计
4. 统一的主题色
5. 内置交互效果

要使用这些样式，只需要：
1. 在 uni.scss 中引入 examples.scss
2. 在组件中使用对应的类名
3. 根据需要自定义或扩展样式

您觉得这些示例如何？我们可以：
1. 添加更多组件样式
2. 调整现有样式
3. 添加更多交互效果
4. 创建更多变体

请告诉我是否需要进一步调整或添加其他示例。