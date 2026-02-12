import { getEnvConfig } from '@/config/env'
import { useUserStore } from '@/stores/user'

/**
 * 语音识别API
 */

export interface VoiceRecognitionResponse {
  /** 识别出的文本内容 */
  text: string
  /** 任务ID */
  task_id?: string
  /** 音频ID */
  audio_id?: string
}

export interface VoiceRecognitionError {
  code: number
  msg: string
  message?: string
}

/**
 * 语音识别接口
 * @param filePath 录音文件路径（uni.getRecorderManager()返回的tempFilePath）
 * @param baseUrlOverride 可选的基础地址覆盖（用于特定页面指定）
 * @returns 识别结果
 */
export const recognizeVoice = async (filePath: string, baseUrlOverride?: string): Promise<VoiceRecognitionResponse> => {
  return new Promise((resolve, reject) => {
    const userStore = useUserStore()
    const token = userStore.token
    const envConfig = getEnvConfig()
    let baseUrl = baseUrlOverride || envConfig.apiBaseUrl
    if (!baseUrl) {
      reject({
        code: -1,
        msg: 'API地址未配置',
        message: 'API地址未配置',
      } as VoiceRecognitionError)
      return
    }
    baseUrl = baseUrl.replace(/\/api\/?$/, '').replace(/\/$/, '')

    // 构建完整URL
    const url = `${baseUrl}/api/ai/voice/recognize/`

    // 构建请求头
    const header: Record<string, string> = {}
    if (token) {
      header['Authorization'] = `Bearer ${token}`
    }

    console.log('🎤 开始上传音频文件进行识别:', {
      url,
      filePath,
      hasToken: !!token,
    })

    // 使用uni.uploadFile上传文件
    uni.uploadFile({
      url,
      filePath,
      name: 'audio', // 后端接收的文件字段名
      header,
      success: (res) => {
        console.log('✅ 语音识别上传成功:', res)

        try {
          // 解析响应数据
          const data = JSON.parse(res.data) as any

          // 检查响应状态
          if (data.code === 2000 || data.code === 200) {
            // 成功
            resolve({
              text: data.data?.text || '',
              task_id: data.data?.task_id,
              audio_id: data.data?.audio_id,
            })
          } else {
            // 业务错误
            const errorMsg = data.msg || data.message || '语音识别失败'
            console.error('❌ 语音识别业务错误:', {
              code: data.code,
              msg: errorMsg,
              data: data.data,
            })
            reject({
              code: data.code,
              msg: errorMsg,
              message: errorMsg,
            } as VoiceRecognitionError)
          }
        } catch (error) {
          console.error('❌ 解析响应数据失败:', error)
          reject({
            code: -1,
            msg: '解析响应数据失败',
            message: '解析响应数据失败',
          } as VoiceRecognitionError)
        }
      },
      fail: (error) => {
        console.error('❌ 语音识别上传失败:', error)
        reject({
          code: error.errMsg ? -1 : error.statusCode || -1,
          msg: error.errMsg || '上传失败',
          message: error.errMsg || '上传失败',
        } as VoiceRecognitionError)
      },
    })
  })
}

