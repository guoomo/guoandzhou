import { mockEnabled, mockRequest } from '@/mock'
import { useMemberStore } from '@/stores'

// 基地址：在 .env 中配置 VITE_APP_BASE_URL；后端未就绪时留空，走 src/mock
const baseURL = import.meta.env.VITE_APP_BASE_URL ?? ''

// 请求拦截器：拼接基地址、超时、请求头、token
const httpInterceptor = {
  invoke(options: UniApp.RequestOptions) {
    if (baseURL && !options.url.startsWith('http')) {
      options.url = baseURL + options.url
    }
    options.timeout = 100000
    options.header = {
      ...options.header,
      'source-client': 'miniapp',
    }
    const memberStore = useMemberStore()
    const token = memberStore.profile?.token
    if (token) {
      options.header.Authorization = token
    }
  },
}

uni.addInterceptor('request', httpInterceptor)
uni.addInterceptor('uploadFile', httpInterceptor)

// 统一响应结构
interface Data<T> {
  code: number
  message: string
  result: T
}

// 封装请求方法，支持泛型
export function http<T>(options: UniApp.RequestOptions) {
  // 后端未就绪：直接返回写死的假数据，页面无需感知
  if (mockEnabled) {
    return mockRequest<T>(options)
  }

  return new Promise<Data<T>>((resolve, reject) => {
    uni.request({
      ...options,
      // 响应成功
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as Data<T>)
        }
        else if (res.statusCode === 401) {
          // token 失效，清理并跳登录
          const memberStore = useMemberStore()
          memberStore.clearProfile()
          uni.navigateTo({ url: '/pages/login/login' })
          reject(res)
        }
        else {
          uni.showToast({
            icon: 'none',
            title: (res.data as Data<T>).message || '请求错误',
          })
          reject(res)
        }
      },
      // 响应失败
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '网络失败，请稍后再试',
        })
        reject(err)
      },
    })
  })
}
