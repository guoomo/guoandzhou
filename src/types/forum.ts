// 帖子列表项
export interface ForumItem {
  id: number
  title: string
  author: string
  createTime: string
  preview: string
}

// 帖子列表返回结构
export interface ForumListResult {
  total: number
  list: ForumItem[]
}

// 帖子详情
export interface ForumPost {
  id: number
  title: string
  author: string
  createTime: string
  content: string
  imgUrl: string
  likeCount: number
}

// 发帖参数
export interface ForumPublishParams {
  title: string
  content: string
  imgs: string[]
}
