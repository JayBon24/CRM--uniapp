<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'
import { createChatKitSession, getChatKitConfig, type ChatKitConfig } from '../api/chatkit'
import { getEnvConfig } from '@/config/env'

// #ifdef H5
import { ChatKit, useChatKit } from '@xpert-ai/chatkit-vue'
import { filterPlaygroundOptions, type ChatKitOptions, type ClientToolMessageInput } from '@xpert-ai/chatkit-types'
// #endif

const userStore = useUserStore()

const loading = ref(true)
const errorMsg = ref<string>('')
const config = ref<ChatKitConfig | null>(null)

const queryUserId = ref<string>('')
const queryOpenid = ref<string>('')
const prefillText = ref<string>('')

onLoad((options) => {
  queryUserId.value = (options?.user_id || options?.userId || '') as string
  queryOpenid.value = (options?.openid || options?.openId || '') as string
  prefillText.value = (options?.prefill || '') as string
})

async function loadConfig() {
  config.value = await getChatKitConfig()
}

function pickChatkitUserPayload() {
  // For H5 running inside miniapp web-view, we rely on query params.
  // For standalone H5, if the user is logged in, userStore.id will be present.
  const user_id = queryUserId.value || (userStore.id ? String(userStore.id) : '')
  const openid = queryOpenid.value
  const payload: Record<string, any> = {}
  if (user_id) payload.user_id = user_id
  if (openid) payload.openid = openid
  return payload
}

async function getClientSecret(): Promise<string> {
  if (!config.value?.assistantId) {
    throw new Error('Missing assistantId')
  }
  const data = await createChatKitSession({
    assistantId: config.value.assistantId,
    ...pickChatkitUserPayload(),
  })
  if (!data.client_secret) throw new Error('Missing client_secret in response')
  return data.client_secret
}

// ============================================================================
// Playground-like config (only whitelisted options take effect)
// ============================================================================
// #ifdef H5
const playgroundConfig: Partial<ChatKitOptions> = {
  theme: {},
  composer: {
    attachments: {
      enabled: true,
      maxCount: 5,
      maxSize: 10485760,
    },
  },
  startScreen: {
    greeting: '',
    prompts: [
      { icon: 'circle-question', label: '如何使用？', prompt: '请介绍一下你能帮我做什么。' },
    ],
  },
}
const filteredPlaygroundConfig = filterPlaygroundOptions(playgroundConfig)
// #endif

// #ifdef H5
const chatkitRef = ref<ReturnType<typeof useChatKit> | null>(null)
// #endif

const canRender = computed(() => !loading.value && !errorMsg.value && !!config.value)

onMounted(async () => {
  loading.value = true
  errorMsg.value = ''
  try {
    await loadConfig()

    // #ifdef H5
    if (!config.value?.frameUrl) throw new Error('Missing frameUrl')
    chatkitRef.value = useChatKit({
      ...filteredPlaygroundConfig,
      frameUrl: config.value.frameUrl,
      api: {
        apiUrl: getEnvConfig().xpertaiApiUrl,
        xpertId: config.value.assistantId,
        getClientSecret,
      },
      onClientTool: async ({ name, params, id, tool_call_id }): Promise<ClientToolMessageInput> => {
        return {
          tool_call_id: tool_call_id || id,
          name,
          status: 'success',
          content: `Client tool invoked: ${name}, params=${JSON.stringify(params)}`,
        }
      },
      onError: (err) => {
        console.error('ChatKit error:', err)
      },
    })

    // Try best-effort prefill (for voice input from miniapp/web-view)
    if (prefillText.value) {
      const text = prefillText.value
      // Some builds may expose composer helpers on control; keep this defensive.
      try {
        const control: any = (chatkitRef.value as any)?.control
        if (control?.composer?.setText) {
          control.composer.setText(text)
        } else if (control?.composer?.update) {
          control.composer.update({ text })
        } else {
          // Fallback: clipboard so user can paste
          uni.setClipboardData({ data: text })
        }
      } catch {
        try { uni.setClipboardData({ data: text }) } catch {}
      }
    }
    // #endif
  } catch (e: any) {
    errorMsg.value = e?.message || '加载失败'
  } finally {
    loading.value = false
  }
})

// #ifndef H5
function appendQuery(baseUrl: string, params: Record<string, string>) {
  const hasQuery = baseUrl.includes('?')
  const query = Object.entries(params)
    .filter(([, v]) => !!v)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')
  if (!query) return baseUrl
  return `${baseUrl}${hasQuery ? '&' : '?'}${query}`
}

const webviewSrc = computed(() => {
  const base = config.value?.h5Url || ''
  if (!base) return ''
  const user_id = userStore.id ? String(userStore.id) : ''
  return appendQuery(base, { user_id })
})
// #endif
</script>

<template>
  <view class="page">
    <view v-if="loading" class="state">
      <text class="state-text">正在加载 ChatKit…</text>
    </view>

    <view v-else-if="errorMsg" class="state">
      <text class="state-title">加载失败</text>
      <text class="state-text">{{ errorMsg }}</text>
    </view>

    <view v-else-if="!canRender" class="state">
      <text class="state-text">配置未就绪</text>
    </view>

    <!-- #ifdef H5 -->
    <view v-else class="h5-host">
      <ChatKit v-if="chatkitRef" :control="chatkitRef.control" class="chatkit" />
    </view>
    <!-- #endif -->

    <!-- #ifndef H5 -->
    <view v-else class="miniapp-host">
      <view v-if="!webviewSrc" class="state">
        <text class="state-title">缺少 H5 中转页地址</text>
        <text class="state-text">请在后端配置 XPERTAI_CHATKIT_H5_URL，并通过 /api/ai/chatkit/config 下发。</text>
      </view>
      <web-view v-else :src="webviewSrc" />
    </view>
    <!-- #endif -->
  </view>
</template>

<style scoped>
.page {
  height: 100vh;
  background: #f7f8fa;
}

.state {
  padding: 28rpx;
}

.state-title {
  display: block;
  font-size: 34rpx;
  font-weight: 700;
  color: #111;
  margin-bottom: 10rpx;
}

.state-text {
  display: block;
  font-size: 28rpx;
  color: rgba(0, 0, 0, 0.65);
  line-height: 1.6;
}

.h5-host {
  height: 100vh;
}

.chatkit {
  height: 100%;
}
</style>


