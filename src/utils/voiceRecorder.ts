/**
 * 语音录音工具类
 * 封装uni.getRecorderManager()实现录音功能
 */

export interface RecorderOptions {
  /** 录音时长，单位ms，默认60秒 */
  duration?: number
  /** 采样率，默认16000（适合语音识别） */
  sampleRate?: number
  /** 录音通道数，默认1（单声道） */
  numberOfChannels?: number
  /** 编码码率，默认48000 */
  encodeBitRate?: number
  /** 音频格式，默认mp3 */
  format?: 'mp3' | 'aac' | 'wav'
  /** 帧大小，单位KB，默认50 */
  frameSize?: number
}

export interface RecorderResult {
  /** 录音文件临时路径 */
  tempFilePath: string
  /** 录音时长，单位ms */
  duration: number
  /** 文件大小，单位byte */
  fileSize: number
}

export type RecorderState = 'idle' | 'recording' | 'paused' | 'stopped'

/**
 * 语音录音管理器
 */
export class VoiceRecorder {
  private recorderManager: UniApp.RecorderManager | null = null
  private state: RecorderState = 'idle'
  private startTime: number = 0
  private duration: number = 0

  constructor() {
    this.initRecorder()
  }

  /**
   * 初始化录音管理器
   */
  private initRecorder(): void {
    this.recorderManager = uni.getRecorderManager()

    // 录音开始事件
    this.recorderManager.onStart(() => {
      console.log('🎤 录音开始')
      this.state = 'recording'
      this.startTime = Date.now()
    })

    // 录音暂停事件
    this.recorderManager.onPause(() => {
      console.log('⏸️ 录音暂停')
      this.state = 'paused'
    })

    // 录音停止事件
    this.recorderManager.onStop((res) => {
      console.log('⏹️ 录音停止', res)
      this.state = 'stopped'
      this.duration = Date.now() - this.startTime
    })

    // 录音错误事件
    this.recorderManager.onError((err) => {
      console.error('❌ 录音错误:', err)
      this.state = 'idle'
      uni.showToast({
        title: `录音失败: ${err.errMsg || '未知错误'}`,
        icon: 'none',
        duration: 2000,
      })
    })
  }

  /**
   * 开始录音
   * @param options 录音选项
   */
  start(options?: RecorderOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.recorderManager) {
        reject(new Error('录音管理器未初始化'))
        return
      }

      if (this.state === 'recording') {
        reject(new Error('录音已在进行中'))
        return
      }

      // 默认配置（适合语音识别）
      const defaultOptions: UniApp.RecorderManagerStartOptions = {
        duration: options?.duration || 60000, // 60秒
        sampleRate: options?.sampleRate || 16000, // 16kHz采样率
        numberOfChannels: options?.numberOfChannels || 1, // 单声道
        encodeBitRate: options?.encodeBitRate || 48000,
        format: options?.format || 'mp3',
        frameSize: options?.frameSize || 50,
      }

      try {
        this.recorderManager.start(defaultOptions)
        resolve()
      } catch (error) {
        console.error('启动录音失败:', error)
        reject(error)
      }
    })
  }

  /**
   * 暂停录音
   */
  pause(): void {
    if (this.recorderManager && this.state === 'recording') {
      this.recorderManager.pause()
    }
  }

  /**
   * 继续录音
   */
  resume(): void {
    if (this.recorderManager && this.state === 'paused') {
      this.recorderManager.resume()
      this.state = 'recording'
    }
  }

  /**
   * 停止录音
   * @returns 录音结果
   */
  stop(): Promise<RecorderResult> {
    return new Promise((resolve, reject) => {
      if (!this.recorderManager) {
        reject(new Error('录音管理器未初始化'))
        return
      }

      if (this.state === 'idle') {
        reject(new Error('未开始录音'))
        return
      }

      // 监听停止事件
      const onStop = (res: { tempFilePath: string; duration?: number; fileSize?: number }) => {
        // uni-app 的 RecorderManager 不支持 offStop，所以使用一次性 Promise 模式
        // 通过 Promise 的 resolve 确保回调只执行一次
        this.state = 'idle'

        resolve({
          tempFilePath: res.tempFilePath,
          duration: res.duration || this.duration,
          fileSize: res.fileSize || 0,
        })
      }

      this.recorderManager.onStop(onStop)
      this.recorderManager.stop()
    })
  }

  /**
   * 获取当前录音状态
   */
  getState(): RecorderState {
    return this.state
  }

  /**
   * 获取录音时长（毫秒）
   */
  getDuration(): number {
    if (this.state === 'recording') {
      return Date.now() - this.startTime
    }
    return this.duration
  }

  /**
   * 检查是否正在录音
   */
  isRecording(): boolean {
    return this.state === 'recording'
  }

  /**
   * 检查是否已暂停
   */
  isPaused(): boolean {
    return this.state === 'paused'
  }

  /**
   * 销毁录音管理器
   */
  destroy(): void {
    if (this.recorderManager) {
      if (this.state === 'recording' || this.state === 'paused') {
        this.recorderManager.stop()
      }
      this.recorderManager = null
      this.state = 'idle'
    }
  }
}

/**
 * 创建录音管理器实例
 */
export function createVoiceRecorder(): VoiceRecorder {
  return new VoiceRecorder()
}

