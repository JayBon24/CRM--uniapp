import { resolve } from 'node:path'
import process from 'node:process'
import uni from '@dcloudio/vite-plugin-uni'
import UniHelperComponents from '@uni-helper/vite-plugin-uni-components'
import UniHelperLayouts from '@uni-helper/vite-plugin-uni-layouts'
import UniHelperManifest from '@uni-helper/vite-plugin-uni-manifest'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import UniPolyfill from 'vite-plugin-uni-polyfill'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
      // https://github.com/uni-helper/vite-plugin-uni-manifest
      // UniHelperManifest(),
      // https://github.com/uni-helper/vite-plugin-uni-layouts
      UniHelperLayouts(),
      // https://github.com/uni-helper/vite-plugin-uni-components
      UniHelperComponents({
        dts: 'src/components.d.ts',
        directoryAsNamespace: true,
        exclude: [
          /[\\/]node_modules[\\/]/,
          /[\\/]\.git[\\/]/,
        ],
      }),
      // H5 环境下 ChatKit 使用 Web Components，需要将其声明为自定义元素
      // 注意：这里不要放在 defineConfig 顶层的 `vue` 字段（Vite 不支持该字段），否则会报错。
      uni({
        vueOptions: {
          template: {
            compilerOptions: {
              isCustomElement: (tag) => tag === 'xpertai-chatkit',
            },
          },
        },
      } as any),
      UniPolyfill(),
      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: ['vue', '@vueuse/core', 'uni-app'],
        dts: 'src/auto-imports.d.ts',
        dirs: ['src/composables', 'src/stores', 'src/utils'],
        // 排除只在分包中使用的文件，避免被打入主包
        exclude: [
          /[\\/]node_modules[\\/]/,
          /[\\/]\.git[\\/]/,
          /[\\/]\.nuxt[\\/]/,
          // 排除只在分包中使用的 composables
          /src[\\/]composables[\\/]useIndicatorDetail\.ts$/,
          // 排除只在分包中使用的 stores
          /src[\\/]stores[\\/]client\.ts$/,
          // 排除只在分包中使用的 services
          /src[\\/]services[\\/]case-schedule\.ts$/,
          // 排除只在分包中使用的 utils
          /src[\\/]utils[\\/]addressParser\.ts$/,
          /src[\\/]utils[\\/]attachment\.ts$/,
          /src[\\/]utils[\\/]calendar\.ts$/,
          /src[\\/]utils[\\/]pinyin\.ts$/,
          // 排除只在分包中使用的 api
          /src[\\/]api[\\/]auth\.ts$/,
          /src[\\/]api[\\/]chatkit\.ts$/,
          /src[\\/]api[\\/]config\.ts$/,
          // 排除只在分包中使用的类型定义（已移动到分包目录）
          /src[\\/]pages[\\/]other[\\/]types[\\/]interfaces[\\/]case-milestone\.ts$/,
          // 排除 mock 文件，使用动态导入避免打包进主包
          /src[\\/]mock[\\/]/,
        ],
        vueTemplate: true,
      }),
      // 已移除 UnoCSS，避免小程序端样式产物异常，统一走 UniApp/SCSS 构建链路
    ],
    css: {
      preprocessorOptions: {
        scss: {
          // 取消sass废弃API的报警
          silenceDeprecations: ['legacy-js-api', 'color-functions', 'import'],
          // 引入uView Plus的全局SCSS变量（必需，用于编译时变量解析）
          additionalData: `@import "uview-plus/theme.scss";`,
        },
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },

    // 开发服务器配置
    server: {
      host: '0.0.0.0',
      port: 3001,
      open: true,
      // 中文注释：已移除 .env 代理配置，如需代理请在 src/config/env.ts 扩展并在此启用
      proxy: {},
    },

    // 优化配置
    optimizeDeps: {
      include: [],
      exclude: [],
    },

    // 构建配置
    build: {
      // 中文注释：统一使用默认输出目录与 sourcemap 配置
      outDir: 'dist',
      sourcemap: false,
      // 生产环境代码压缩配置
      minify: 'terser',
      terserOptions: {
        compress: {
          // 中文注释：根据 NODE_ENV 判断是否为生产环境
          drop_console: process.env.NODE_ENV === 'production',
          drop_debugger: process.env.NODE_ENV === 'production',
          // 移除未使用的代码
          dead_code: true,
          // 移除未使用的变量
          unused: true,
          // 简化条件表达式
          conditionals: true,
          // 简化布尔值
          booleans: true,
          // 简化循环
          loops: true,
          // 移除不可达代码
          if_return: true,
          // 合并变量声明
          join_vars: true,
          // 简化表达式
          evaluate: true,
          // 移除重复的键
          collapse_vars: true,
          // 内联简单函数
          inline: 2,
        },
        mangle: {
          // 混淆变量名
          toplevel: true,
          // 混淆函数名
          keep_fnames: false,
        },
        format: {
          // 移除注释
          comments: false,
          // 美化输出（可选，压缩时通常设为 false）
          beautify: false,
        },
      },
      // 代码分割配置（主要用于 H5，小程序会自动根据 pages.json 处理分包）
      rollupOptions: {
        // 排除 mock 文件，避免打包进生产环境
        external: (id) => {
          // 在生产环境排除所有 mock 文件
          if (process.env.NODE_ENV === 'production') {
            if (id.includes('/mock/') || id.includes('\\mock\\')) {
              return true
            }
          }
          return false
        },
        output: {
          // 手动分包（仅对 H5 有效，小程序由 UniApp 自动处理）
          manualChunks: {
            // 将 Vue 相关库单独打包
            'vue-vendor': ['vue', 'pinia'],
            // 将 UI 库单独打包
            'ui-vendor': ['uview-plus'],
            // 将工具库单独打包
            'utils-vendor': ['axios', 'dayjs', 'pinyin-pro'],
          },
        },
      },
      // 压缩 CSS
      cssCodeSplit: true,
      // 启用 gzip 压缩
      reportCompressedSize: true,
    },
})
