import { defineStore } from 'pinia'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, getInfo, logout, codeLogin, register, wechatLogin, wechatLoginCheck as apiWechatLoginCheck, wechatRegister as apiWechatRegister, sendSmsCode as apiSendSmsCode } from '@/api/user'
import { passWordEncrypt } from '@/utils/jsencrypt'
import { setStorage, getStorage, removeStorage } from '@/utils/storage'
import { getEnvConfig } from '@/config/env'
import type { UserRoleLevel, OrgScope } from '@/types/interfaces/user'

// 用户状态管理
export const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken(), // 从本地存储获取token
    id: '',
    name: '',
    nickName: '',
    avatar: '',
    roles: [] as string[],        // 用户角色列表
    permissions: [] as string[],  // 用户权限列表

    // ============ Tab1：组织/角色层级（用于数据范围与UI权限） ============
    // 中文注释：后端联调后应从 getInfo 接口下发；开发阶段可用本地存储覆盖
    roleLevel: (getStorage('dev_role_level') as UserRoleLevel) || 'SALES',
    orgScope: (getStorage('dev_org_scope') as OrgScope) || 'SELF',
    teamId: getStorage('dev_team_id') || '',
    branchId: getStorage('dev_branch_id') || '',
    hqId: getStorage('dev_hq_id') || ''
  }),

  getters: {
    // 获取用户信息
    userInfo: (state) => ({
      id: state.id,
      name: state.name,
      nickName: state.nickName,
      avatar: state.avatar
    }),

    // 检查是否有token
    hasToken: (state) => !!state.token,

    // 检查是否有角色
    hasRoles: (state) => state.roles.length > 0,

    // ============ Tab1：角色层级判断 ============
    isAdmin: (state) => state.roleLevel === 'HQ',
    isBranchManager: (state) => state.roleLevel === 'BRANCH',
    isTeamManager: (state) => state.roleLevel === 'TEAM',
    // 中文注释：TEAM 既有管理职能也有销售职能（可作为经办人推进自己的客户）
    isSales: (state) => state.roleLevel === 'SALES' || state.roleLevel === 'TEAM',
    isManager: (state) => state.roleLevel === 'HQ' || state.roleLevel === 'BRANCH' || state.roleLevel === 'TEAM',
  },

  actions: {
    /**
     * 开发阶段：切换角色层级（仅用于 Mock/本地测试）
     */
    setDevRoleLevel(roleLevel: UserRoleLevel) {
      this.roleLevel = roleLevel
      // 默认数据范围：管理为本级；销售为自己
      this.orgScope = roleLevel === 'SALES' ? 'SELF' : (roleLevel as OrgScope)
      setStorage('dev_role_level', roleLevel)
      setStorage('dev_org_scope', this.orgScope)
    },

    /**
     * 开发阶段：设置组织信息（仅用于 Mock/本地测试）
     */
    setDevOrg(payload: { teamId?: string | number; branchId?: string | number; hqId?: string | number }) {
      if (payload.teamId !== undefined) {
        this.teamId = payload.teamId
        setStorage('dev_team_id', payload.teamId)
      }
      if (payload.branchId !== undefined) {
        this.branchId = payload.branchId
        setStorage('dev_branch_id', payload.branchId)
      }
      if (payload.hqId !== undefined) {
        this.hqId = payload.hqId
        setStorage('dev_hq_id', payload.hqId)
      }
    },
    // 通用登录方法
    async login(userInfo: { phone: string; password: string; code?: string; uuid?: string }) {
      try {
        // 如果有密码，则进行加密
        const loginData = { ...userInfo }
        if (userInfo.password && !userInfo.code) {
          const encryptedPassword = passWordEncrypt(userInfo.password)
          if (!encryptedPassword) {
            throw new Error('密码加密失败')
          }
          loginData.password = encryptedPassword
        }

        const response = await login(loginData)
        if (response.code === 200 || response.code === 2000) {
          // 根据实际API响应结构获取数据
          const token = response.token
          this.token = token
          setToken(token) // 保存到本地存储
          return response
        }
        throw new Error(response.msg || '登录失败')
      } catch (error) {
        console.error('登录失败:', error)
        throw error
      }
    },

    // 密码登录方法
    async loginWithPassword(loginData: { phone: string; password: string }) {
      try {
        console.log('[UserStore.loginWithPassword] 开始登录，手机号:', loginData.phone)
        
        // 使用RSA加密密码
        const encryptedPassword = passWordEncrypt(loginData.password)
        if (!encryptedPassword) {
          return { success: false, message: '密码加密失败，请重试' }
        }

        const response = await login({
          phone: loginData.phone,
          password: encryptedPassword
        })

        console.log('[UserStore.loginWithPassword] 登录API响应:', response)

        // 后端返回 code: 2000 表示成功
        if (response.code === 200 || response.code === 2000) {
          // 根据实际API响应结构获取数据
          // 后端响应: { code: 2000, data: { access, refresh, username, name, userid, ... } }
          const data = (response as any).data || response
          const token = data.access || response.token
          const userInfo = data

          console.log('[UserStore.loginWithPassword] 提取的数据:', {
            hasToken: !!token,
            hasUserInfo: !!userInfo,
            userInfo
          })

          this.token = token
          setToken(token) // 保存到本地存储

          // 如果登录响应中包含用户信息，先保存基本信息
          if (userInfo) {
            // 后端字段映射：userid → id, name → nickName, username → name
            this.id = userInfo.userid || userInfo.user_id || userInfo.userId || userInfo.id || ''
            this.nickName = userInfo.name || userInfo.nickName || userInfo.nickname || ''
            this.name = userInfo.username || userInfo.userName || userInfo.name || ''
            this.avatar = userInfo.avatar || ''
            
            console.log('[UserStore.loginWithPassword] 从登录响应保存用户信息:', {
              id: this.id,
              name: this.name,
              nickName: this.nickName,
              avatar: this.avatar
            })
          } else {
            console.warn('[UserStore.loginWithPassword] 登录响应中没有 userInfo')
          }

          // 获取用户详细信息（包括角色和权限）
          try {
            await this.getInfo()
            console.log('[UserStore.loginWithPassword] 登录成功，最终用户信息:', {
              id: this.id,
              name: this.name,
              nickName: this.nickName,
              avatar: this.avatar
            })
          } catch (error) {
            console.warn('[UserStore.loginWithPassword] 获取用户详细信息失败，使用登录返回的基础信息:', error)
          }

          return { success: true, message: '登录成功' }
        } else {
          return { success: false, message: response.msg || '登录失败' }
        }
      } catch (error: any) {
        console.error('密码登录失败:', error)
        // 保留原始错误信息，如果没有则使用默认提示
        const errorMessage = error?.message || error?.msg || '网络异常，请稍后重试'
        return { success: false, message: errorMessage }
      }
    },

    // 验证码登录方法
    async loginWithCode(loginData: { phone: string; smsCode: string }) {
      try {
        const response = await codeLogin({
          phone: loginData.phone,
          smsCode: loginData.smsCode
        })

        if (response.code === 200 || response.code === 2000) {
          const data = (response as any).data || response
          const token = data.token || response.token
          const userInfo = data.userInfo || response.userInfo

          this.token = token
          setToken(token) // 保存到本地存储

          // 如果登录响应中包含用户信息，先保存基本信息
          if (userInfo) {
            this.id = userInfo.userId || userInfo.id || ''
            this.name = userInfo.userName || userInfo.name || ''
            this.nickName = userInfo.nickName || userInfo.nickname || ''
            this.avatar = userInfo.avatar || ''
          }

          // 获取用户详细信息（包括角色和权限）
          try {
            await this.getInfo()
            console.log('验证码登录成功，用户信息更新完成:', this.userInfo)
          } catch (error) {
            console.warn('获取用户详细信息失败，使用登录返回的基础信息:', error)
          }

          return { success: true, message: '登录成功' }
        } else {
          return { success: false, message: response.msg || '登录失败' }
        }
      } catch (error: any) {
        console.error('验证码登录失败:', error)
        const errorMessage = error?.message || error?.msg || '网络异常，请稍后重试'
        return { success: false, message: errorMessage }
      }
    },

    // 微信登录方法
    async loginWithWechat(loginData: { code: string; userInfo: any }) {
      try {
        console.log('调用微信登录API，参数:', { code: loginData.code })

        // 调用专门的微信登录API接口，传递code和userInfo
        const response = await wechatLogin({
          code: loginData.code,
          userInfo: loginData.userInfo
        })

        console.log('微信登录API响应:', response)

        if (response.code === 200) {
          // 根据实际API响应结构获取数据
          const token = response.token || response.data?.token
          const userInfo = response.userInfo || response.data?.userInfo

          if (token) {
            this.token = token
            setToken(token) // 保存到本地存储
          }

          // 保存用户信息
          if (userInfo) {
            this.id = userInfo.userId || userInfo.id || ''
            this.name = userInfo.userName || userInfo.name || ''
            this.nickName = userInfo.nickName || userInfo.nickname || ''
            this.avatar = userInfo.avatar || ''
          }

          // 获取用户详细信息（包括角色和权限）
          try {
            await this.getInfo()
            console.log('微信登录成功，用户信息更新完成:', this.userInfo)
          } catch (error) {
            console.warn('获取用户详细信息失败，使用登录返回的基础信息:', error)
          }

          return { success: true, message: response.msg || '微信登录成功' }
        } else {
          return { success: false, message: response.msg || '微信登录失败' }
        }
      } catch (error) {
        console.error('微信登录失败:', error)

        // 根据错误类型给出更具体的提示
        let errorMessage = '微信登录失败，请稍后重试'

        if (error.response) {
          // 服务器返回的错误
          const status = error.response.status
          const data = error.response.data

          if (status === 400) {
            errorMessage = data?.msg || '请求参数错误'
          } else if (status === 401) {
            errorMessage = '微信登录凭证无效'
          } else if (status === 403) {
            errorMessage = '微信登录被拒绝'
          } else if (status === 500) {
            errorMessage = '服务器内部错误，请稍后重试'
          } else {
            errorMessage = data?.msg || `登录失败，状态码：${status}`
          }
        } else if (error.message) {
          if (error.message.includes('timeout')) {
            errorMessage = '网络超时，请检查网络连接'
          } else if (error.message.includes('Network Error')) {
            errorMessage = '网络连接失败，请检查网络设置'
          }
        }

        return { success: false, message: errorMessage }
      }
    },

    // 微信登录：先检查用户是否已注册
    async wechatLoginCheck(params: { code: string }) {
      try {
        const response = await apiWechatLoginCheck(params)
        const normalizeData = (resp: any) => {
          if (resp?.data && typeof resp.data === 'object' && !Array.isArray(resp.data)) return resp.data
          if (resp && typeof resp === 'object' && !Array.isArray(resp)) return resp
          return {}
        }
        const data = normalizeData(response)
        const responseCode = typeof response?.code === 'number'
          ? response.code
          : (typeof response?.statusCode === 'number' ? response.statusCode : 200)
        const requestSuccess = responseCode === 200 || responseCode === 2000 || (response?.code === undefined && response?.statusCode === undefined)
        const needRegister = !!data.needRegister

        if (requestSuccess) {
          if (!needRegister) {
            const token = data.token || response.token
            const userInfo = data.userInfo || response.userInfo
            if (token) {
              this.token = token
              setToken(token)
            }
            if (userInfo) {
              this.id = userInfo.userId || userInfo.id || ''
              this.name = userInfo.userName || userInfo.name || ''
              this.nickName = userInfo.nickName || userInfo.nickname || ''
              this.avatar = userInfo.avatar || ''
            }
            try {
              await this.getInfo()
            } catch {}
          }
          return { success: true, data, message: response.msg || (needRegister ? '需要完善信息' : '登录成功') }
        }
        if (needRegister) {
          return { success: true, data, message: response.msg || '需要完善信息' }
        }
        return { success: false, data: null, message: response.msg || response?.message || '微信登录失败' }
      } catch (error: any) {
        return { success: false, data: null, message: error?.message || '微信登录失败，请稍后重试' }
      }
    },

    // 微信注册：支持一键手机号/手动验证码
    async wechatRegister(params: { openid: string; unionid?: string; encryptedData?: string; iv?: string; phone?: string; smsCode?: string; userInfo?: any }) {
      try {
        const response = await apiWechatRegister(params)
        const normalizeData = (resp: any) => {
          if (resp?.data && typeof resp.data === 'object' && !Array.isArray(resp.data)) return resp.data
          if (resp && typeof resp === 'object' && !Array.isArray(resp)) return resp
          return {}
        }
        const data = normalizeData(response)
        const responseCode = typeof response?.code === 'number'
          ? response.code
          : (typeof response?.statusCode === 'number' ? response.statusCode : 200)
        const requestSuccess = responseCode === 200 || responseCode === 2000
        if (requestSuccess) {
          const token = data.token || response.token
          const userInfo = data.userInfo || response.userInfo
          if (token) {
            this.token = token
            setToken(token)
          }
          if (userInfo) {
            this.id = userInfo.userId || userInfo.id || ''
            this.name = userInfo.userName || userInfo.name || ''
            this.nickName = userInfo.nickName || userInfo.nickname || ''
            this.avatar = userInfo.avatar || ''
          }
          try {
            await this.getInfo()
          } catch {}
          return { success: true, data, message: response.msg || '注册成功' }
        }
        return { success: false, data: null, message: response.msg || response?.message || '注册失败' }
      } catch (error: any) {
        return { success: false, data: null, message: error?.message || '注册失败，请重试' }
      }
    },

    // 用户注册方法
    async userRegister(registerData: { phone: string; password: string; username: string; code: string }) {
      try {
        // 使用RSA加密密码
        const encryptedPassword = passWordEncrypt(registerData.password)
        if (!encryptedPassword) {
          return { success: false, message: '密码加密失败，请重试' }
        }

        const response = await register({
          phone: registerData.phone,
          password: encryptedPassword,
          username: registerData.username,
          code: registerData.code
        })

        if (response.code === 200 || response.code === 2000) {
          const data = (response as any).data || response
          const token = data.token || response.token
          const userInfo = data.userInfo || response.userInfo

          this.token = token
          setToken(token) // 保存到本地存储

          // 保存用户信息
          if (userInfo) {
            this.id = userInfo.userId
            this.name = userInfo.userName
            this.nickName = userInfo.nickName
            this.avatar = userInfo.avatar
          }

          // 获取用户详细信息（包括角色和权限）
          try {
            await this.getInfo()
          } catch (error) {
            console.warn('获取用户详细信息失败，使用注册返回的基础信息:', error)
          }

          return { success: true, message: '注册成功' }
        } else {
          return { success: false, message: response.msg || '注册失败' }
        }
      } catch (error: any) {
        console.error('用户注册失败:', error)
        const errorMessage = error?.message || error?.msg || '网络异常，请稍后重试'
        return { success: false, message: errorMessage }
      }
    },

    // 发送短信验证码方法
    async sendSmsCode(params: { phone: string; type: string }) {
      try {
        // 调用真实的短信发送API
        const response = await apiSendSmsCode(params)
        if ((response as any)?.code === 2000 || (response as any)?.code === 200) {
          return { success: true, message: (response as any)?.msg || '验证码已发送', data: response }
        }
        return { success: false, message: (response as any)?.msg || '发送失败，请稍后重试', data: response }
      } catch (error) {
        console.error('发送验证码失败:', error)
        return { success: false, message: '发送失败，请稍后重试' }
      }
    },

    // 获取用户信息
    async getInfo() {
      try {
        const response = await getInfo()
        console.log('[UserStore.getInfo] API响应:', response)

        // 后端返回 code: 2000 表示成功
        if (response.code === 200 || response.code === 2000) {
          // 简化的用户对象提取逻辑
          // 后端响应格式: { code: 2000, msg: '获取成功', data: { user_id, name, username, ... } }
          const data = (response as any).data
          const roles = (response as any).roles || []
          const permissions = (response as any).permissions || []

          console.log('[UserStore.getInfo] 提取的数据:', {
            data,
            dataType: typeof data,
            hasUserId: data?.user_id,
            hasName: data?.name,
            hasUsername: data?.username,
            roles,
            permissions
          })

          // 直接从 response.data 中提取用户对象
          let user: any = null
          if (data && typeof data === 'object') {
            // data 就是用户对象
            if (data.user_id || data.username || data.name) {
              user = data
              console.log('[UserStore.getInfo] 从 response.data 提取用户对象成功')
            } else {
              // 兼容嵌套结构 (如果 data 内还有 user 或 userInfo)
              user = data.user || data.userInfo || null
              if (user) {
                console.log('[UserStore.getInfo] 从 response.data.user/userInfo 提取用户对象')
              }
            }
          }

          // 兼容旧的响应结构（用户对象直接在 response 顶层）
          if (!user) {
            user = (response as any).user || (response as any).userInfo || null
            if (user) {
              console.log('[UserStore.getInfo] 从 response.user/userInfo 提取用户对象（兼容模式）')
            }
          }

          // 更新用户信息
          // 后端字段映射：user_id → id, name → nickName, username → name
          if (user && typeof user === 'object') {
            this.id = user.user_id || user.userId || user.id || ''
            // 后端的 name 字段是显示名称（如"张三"），username 是用户名（如"zhangsan"）
            this.nickName = user.name || user.nickName || user.nickname || ''
            this.name = user.username || user.userName || user.name || ''
            this.avatar = user.avatar || ''

            console.log('[UserStore.getInfo] 用户信息更新成功:', {
              id: this.id,
              name: this.name,
              nickName: this.nickName,
              avatar: this.avatar
            })
          } else {
            console.warn('[UserStore.getInfo] 未找到有效的用户对象，响应数据:', response)
          }

          this.roles = Array.isArray(roles) ? roles : []
          this.permissions = Array.isArray(permissions) ? permissions : []

          // Tab1：尽量从后端 user 对象读取组织/角色（若存在），否则使用开发默认值
          try {
            const env = getEnvConfig()
            const u: any = user || {}
            // 优先使用后端字段（如果有）
            const backendRoleLevel = u.roleLevel || u.role_level || u.role_level_name
            const backendOrgScope = u.orgScope || u.org_scope
            const backendTeamId = u.teamId || u.team_id
            const backendBranchId = u.branchId || u.branch_id
            const backendHqId = u.hqId || u.hq_id
            const backendDeptId = u.deptId || u.dept_id

            if (backendRoleLevel) this.roleLevel = backendRoleLevel
            if (backendOrgScope) this.orgScope = backendOrgScope
            if (backendTeamId !== undefined) this.teamId = backendTeamId
            if (backendBranchId !== undefined) this.branchId = backendBranchId
            if (backendHqId !== undefined) this.hqId = backendHqId

            // 组织字段兜底：部分账号仅有 dept_id，按角色回退，避免分所/团队筛选拿不到ID
            if (!this.branchId && this.roleLevel === 'BRANCH' && backendDeptId !== undefined) {
              this.branchId = backendDeptId
            }
            if (!this.teamId && this.roleLevel === 'TEAM' && backendDeptId !== undefined) {
              this.teamId = backendDeptId
            }

            // Mock 模式下允许本地 dev_* 覆盖（方便测试权限）
            if (env.useMock) {
              const devRole = getStorage('dev_role_level')
              if (devRole) this.roleLevel = devRole
              const devScope = getStorage('dev_org_scope')
              if (devScope) this.orgScope = devScope
              const devTeam = getStorage('dev_team_id')
              if (devTeam) this.teamId = devTeam
              const devBranch = getStorage('dev_branch_id')
              if (devBranch) this.branchId = devBranch
              const devHq = getStorage('dev_hq_id')
              if (devHq) this.hqId = devHq
            }
          } catch (e) {
            console.warn('Tab1 角色/组织解析失败（可忽略）:', e)
          }

          return response
        }
        throw new Error(response.msg || '获取用户信息失败')
      } catch (error) {
        console.error('获取用户信息失败:', error)
        throw error
      }
    },

    // 退出登录
    async logOut() {
      try {
        await logout()
      } catch (error) {
        console.error('退出登录失败:', error)
      } finally {
        // 清除本地数据
        this.token = ''
        this.id = ''
        this.name = ''
        this.nickName = ''
        this.avatar = ''
        this.roles = []
        this.permissions = []

        // 清除 Tab1 开发态角色缓存（避免下次误用）
        removeStorage('dev_role_level')
        removeStorage('dev_org_scope')
        removeStorage('dev_team_id')
        removeStorage('dev_branch_id')
        removeStorage('dev_hq_id')
        this.roleLevel = 'SALES'
        this.orgScope = 'SELF'
        this.teamId = ''
        this.branchId = ''
        this.hqId = ''
        removeToken() // 清除本地存储的token

        // 清除自动登录信息
        this.clearAutoLoginInfo()
      }
    },

    // 重置用户状态
    resetState() {
      this.token = ''
      this.id = ''
      this.name = ''
      this.nickName = ''
      this.avatar = ''
      this.roles = []
      this.permissions = []
    },

    // 保存自动登录信息
    saveAutoLoginInfo(info: {
      type: 'password' | 'code' | 'wechat'
      phone: string
      password?: string
    }) {
      try {
        // 保存自动登录信息到本地存储，设置7天过期
        const expireTime = 7 * 24 * 60 * 60 * 1000 // 7天
        setStorage('autoLoginInfo', info, expireTime)
        console.log('自动登录信息已保存:', info)

        // 同时保存用户基本信息到本地存储
        const userBasicInfo = {
          phone: info.phone,
          loginType: info.type,
          lastLoginTime: Date.now()
        }
        setStorage('userBasicInfo', userBasicInfo, expireTime)
      } catch (error) {
        console.error('保存自动登录信息失败:', error)
      }
    },

    // 获取自动登录信息
    getAutoLoginInfo() {
      try {
        return getStorage('autoLoginInfo')
      } catch (error) {
        console.error('获取自动登录信息失败:', error)
        return null
      }
    },

    // 获取用户基本信息
    getUserBasicInfo() {
      try {
        return getStorage('userBasicInfo')
      } catch (error) {
        console.error('获取用户基本信息失败:', error)
        return null
      }
    },

    // 清除自动登录信息
    clearAutoLoginInfo() {
      try {
        removeStorage('autoLoginInfo')
        removeStorage('userBasicInfo')
        console.log('自动登录信息已清除')
      } catch (error) {
        console.error('清除自动登录信息失败:', error)
      }
    },

    // 执行自动登录
    async executeAutoLogin() {
      try {
        const autoLoginInfo = this.getAutoLoginInfo()
        if (!autoLoginInfo) {
          console.log('没有找到自动登录信息')
          return { success: false, message: '没有保存的自动登录信息' }
        }

        // 验证自动登录信息的完整性
        if (!autoLoginInfo.type || !autoLoginInfo.phone) {
          console.log('自动登录信息不完整:', autoLoginInfo)
          this.clearAutoLoginInfo()
          return { success: false, message: '自动登录信息不完整' }
        }

        console.log('开始执行自动登录:', autoLoginInfo)

        let result
        if (autoLoginInfo.type === 'password' && autoLoginInfo.password) {
          console.log('使用密码方式自动登录')
          // 密码登录
          result = await this.loginWithPassword({
            phone: autoLoginInfo.phone,
            password: autoLoginInfo.password
          })
        } else if (autoLoginInfo.type === 'code') {
          console.log('验证码登录不支持自动登录')
          // 验证码登录需要重新获取验证码，这里暂时不支持自动登录
          return { success: false, message: '验证码登录不支持自动登录' }
        } else if (autoLoginInfo.type === 'wechat') {
          console.log('使用微信方式自动登录')
          // 微信登录
          result = await this.loginWithWechat({
            code: 'auto_login',
            userInfo: {}
          })
        } else {
          console.log('不支持的登录方式:', autoLoginInfo.type)
          this.clearAutoLoginInfo()
          return { success: false, message: '不支持的登录方式' }
        }

        if (result.success) {
          console.log('自动登录成功，用户信息:', this.userInfo)
          return { success: true, message: '自动登录成功' }
        } else {
          console.log('自动登录失败:', result.message)
          // 自动登录失败，清除保存的信息
          this.clearAutoLoginInfo()
          return { success: false, message: result.message }
        }
      } catch (error) {
        console.error('自动登录执行失败:', error)
        // 自动登录失败，清除保存的信息
        this.clearAutoLoginInfo()
        return { success: false, message: '自动登录失败，请重新登录' }
      }
    },

    // 验证token是否有效
    async validateToken() {
      try {
        if (!this.token) {
          return false
        }

        // 尝试获取用户信息来验证token
        await this.getInfo()
        return true
      } catch (error) {
        console.log('Token验证失败:', error)
        return false
      }
    }
  }
})
