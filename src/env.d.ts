/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 后端接口基地址；后端未就绪时留空，配合 VITE_APP_USE_MOCK 使用假数据 */
  readonly VITE_APP_BASE_URL: string
  /** 是否启用前端 mock：'false' 关闭，其余（含未配置）均开启 */
  readonly VITE_APP_USE_MOCK: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
