// 全局变量定义
// 这些变量可以在任何组件中直接使用，无需导入

import { navBarHeight, statusBarHeight } from './system'

// 导出全局变量，供其他文件使用 不同机型会不同  statusBarHeight 是胶囊之前的高度，navBarHeight 是胶囊之下的高度
export const globalNavBarHeight = navBarHeight  //wx:91   H5:44  
export const globalStatusBarHeight = statusBarHeight  //wx:47   H5:0

// 也可以直接挂载到 window 对象上（在浏览器环境中）
if (typeof window !== 'undefined') {
  (window as any).$navBarHeight = navBarHeight 
  (window as any).$statusBarHeight = statusBarHeight
}
