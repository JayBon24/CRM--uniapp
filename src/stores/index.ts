import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()

// 配置pinia持久化插件，兼容微信小程序
pinia.use(piniaPluginPersistedstate)

// 注意：不要在这里重新导出store，避免重复导入
// 直接从对应的store文件导入使用即可

export default pinia
