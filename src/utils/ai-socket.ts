import mitt from 'mitt'

type ConversationPayload = {
  id: number
  title: string
  pinned?: boolean
  last_message_time?: string
}

type Events = {
  token: { sessionId?: string; conversationId?: number; textDelta: string }
  final: { sessionId?: string; conversationId?: number; answer: string }
  error: { code: string; message: string; operationId?: string }
  session: { sessionId: string; conversationId?: number }
  conversationMeta: { conversationId: number; title?: string; sessionId?: string | null }
  conversationCreated: { conversation: ConversationPayload }
  card: { sessionId?: string; conversationId?: number; card: any }
  cardUpdated: { sessionId?: string; conversationId?: number; operationId?: string; card: any }
  actionResult: { operationId?: string; conversationId?: number; result: any }
  needClarify: { sessionId?: string; conversationId?: number; payload: any }
  scopeHint: { scope: any }
  capabilities: { capabilities: any }
  close: { code?: number }
}

type QueueMessage = {
  payload: Record<string, any>
}

const STORAGE_KEY = 'tab3_conversation_sessions'

function loadSessionMap(): Record<string, string> {
  try {
    const raw = uni.getStorageSync(STORAGE_KEY)
    if (!raw) return {}
    if (typeof raw === 'string') {
      const parsed = JSON.parse(raw)
      return parsed && typeof parsed === 'object' ? parsed : {}
    }
    return raw && typeof raw === 'object' ? raw : {}
  } catch {
    return {}
  }
}

function saveSessionMap(map: Record<string, string>) {
  try {
    uni.setStorageSync(STORAGE_KEY, map)
  } catch {}
}

export class AISocket {
  private socket: UniNamespace.SocketTask | null = null
  private url: string
  private token: string
  private emitter = mitt<Events>()
  private pendingMessages: QueueMessage[] = []
  private isConnecting = false
  private isOpen = false
  private currentConversationId: number | null = null
  private sessionByConversation: Record<string, string> = {}

  constructor(opts: { url: string; token: string; conversationId?: number | null; sessionMap?: Record<string, string> }) {
    this.url = opts.url
    this.token = opts.token
    this.currentConversationId = opts.conversationId || null
    this.sessionByConversation = opts.sessionMap || loadSessionMap()
  }

  on = this.emitter.on
  off = this.emitter.off

  setConversation(conversationId: number | null, sessionId?: string | null) {
    this.currentConversationId = conversationId
    if (conversationId && sessionId) {
      this.sessionByConversation[String(conversationId)] = sessionId
      saveSessionMap(this.sessionByConversation)
    }
  }

  getSessionMap() {
    return { ...this.sessionByConversation }
  }

  private getSessionId(conversationId?: number | null): string | null {
    const cid = conversationId || this.currentConversationId
    if (!cid) return null
    return this.sessionByConversation[String(cid)] || null
  }

  private rememberSession(sessionId?: string | null, conversationId?: number | null) {
    if (!sessionId) return
    const cid = conversationId || this.currentConversationId
    if (!cid) return
    this.sessionByConversation[String(cid)] = sessionId
    saveSessionMap(this.sessionByConversation)
  }

  private sendOrQueue(payload: Record<string, any>) {
    if (this.socket && this.isOpen) {
      this.socket.send({ data: JSON.stringify(payload) })
      return
    }
    this.pendingMessages.push({ payload })
    if (!this.isConnecting && !this.isOpen) {
      this.connect()
    }
  }

  connect() {
    if (this.socket && this.isOpen) return
    if (this.isConnecting) return

    this.isConnecting = true
    let wsUrl = this.url
    if (wsUrl.startsWith('http://')) {
      wsUrl = wsUrl.replace('http://', 'ws://')
    } else if (wsUrl.startsWith('https://')) {
      wsUrl = wsUrl.replace('https://', 'wss://')
    } else if (!wsUrl.startsWith('ws://') && !wsUrl.startsWith('wss://')) {
      wsUrl = `ws://${wsUrl}`
    }
    const tokenParam = this.token ? `?token=${encodeURIComponent(this.token)}` : ''
    wsUrl = wsUrl + tokenParam

    this.socket = uni.connectSocket({
      url: wsUrl,
      success: () => {},
      fail: (err) => {
        this.isConnecting = false
        this.isOpen = false
        const errMsg = err?.errMsg || err?.message || '连接失败'
        this.emitter.emit('error', { code: 'connect_failed', message: `连接失败: ${errMsg}` })
        this.socket = null
        this.pendingMessages = []
      },
    })

    if (!this.socket) {
      this.isConnecting = false
      this.isOpen = false
      this.emitter.emit('error', { code: 'socket_null', message: 'WebSocket 初始化失败' })
      return
    }

    this.socket.onOpen(() => {
      this.isConnecting = false
      this.isOpen = true
      while (this.pendingMessages.length > 0) {
        const item = this.pendingMessages.shift()
        if (!item || !this.socket || !this.isOpen) break
        this.socket.send({ data: JSON.stringify(item.payload) })
      }
      if (this.currentConversationId) {
        this.sendSwitchConversation(this.currentConversationId)
      }
    })

    this.socket.onMessage((res) => {
      try {
        const data = JSON.parse(res.data as string)
        if (data.type === 'token') this.emitter.emit('token', data)
        if (data.type === 'final') this.emitter.emit('final', data)
        if (data.type === 'error') this.emitter.emit('error', data)
        if (data.type === 'scope_hint') this.emitter.emit('scopeHint', data)
        if (data.type === 'capabilities') this.emitter.emit('capabilities', data)
        if (data.type === 'card') this.emitter.emit('card', data)
        if (data.type === 'card_updated') this.emitter.emit('cardUpdated', data)
        if (data.type === 'action_result') this.emitter.emit('actionResult', data)
        if (data.type === 'need_clarify') this.emitter.emit('needClarify', data)
        if (data.type === 'conversation_meta') this.emitter.emit('conversationMeta', data)
        if (data.type === 'conversation_created' && data.conversation) {
          this.emitter.emit('conversationCreated', data)
        }
        if (data.type === 'session_created') {
          this.rememberSession(data.sessionId, data.conversationId)
          this.emitter.emit('session', data)
        }

        if (data.conversationId) {
          this.currentConversationId = Number(data.conversationId)
        }
        if (data.sessionId) {
          this.rememberSession(data.sessionId, data.conversationId)
        }
      } catch (err) {
        console.warn('[AISocket] WS message parse error', err)
      }
    })

    this.socket.onError(() => {
      this.isConnecting = false
      this.isOpen = false
      this.emitter.emit('error', { code: 'socket_error', message: '连接错误' })
      this.pendingMessages = []
    })

    this.socket.onClose((res) => {
      this.isConnecting = false
      this.isOpen = false
      this.emitter.emit('close', { code: res.code })
      this.socket = null
      this.pendingMessages = []
    })
  }

  sendMessage(
    message: string,
    attachments?: string[],
    opts?: { conversationId?: number | null; sessionId?: string | null; editingOperationId?: string | null },
  ) {
    const conversationId = opts?.conversationId || this.currentConversationId
    const sessionId = opts?.sessionId || this.getSessionId(conversationId)
    this.sendOrQueue({
      type: 'user_message',
      message,
      attachments,
      conversationId,
      sessionId,
      editingOperationId: opts?.editingOperationId || undefined,
    })
  }

  sendSwitchConversation(conversationId: number) {
    this.currentConversationId = conversationId
    this.sendOrQueue({
      type: 'switch_conversation',
      conversationId,
    })
  }

  confirmAction(operationId: string, editedFields?: Record<string, any>, idempotencyKey?: string) {
    this.sendOrQueue({
      type: 'confirm_action',
      operationId,
      editedFields: editedFields || {},
      idempotencyKey,
    })
  }

  cancelAction(operationId: string) {
    this.sendOrQueue({
      type: 'cancel_action',
      operationId,
    })
  }

  editPendingAction(
    operationId: string,
    patchText: string,
    opts?: {
      conversationId?: number | null
      sessionId?: string | null
      editedFields?: Record<string, any>
      idempotencyKey?: string
    },
  ) {
    const conversationId = opts?.conversationId || this.currentConversationId
    const sessionId = opts?.sessionId || this.getSessionId(conversationId)
    this.sendOrQueue({
      type: 'edit_pending_action',
      operationId,
      patchText,
      editedFields: opts?.editedFields || {},
      idempotencyKey: opts?.idempotencyKey,
      conversationId,
      sessionId,
    })
  }

  close() {
    this.socket?.close({})
    this.socket = null
    this.isOpen = false
  }
}
