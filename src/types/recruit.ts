// 招新/岗位列表项
export interface RecruitItem {
  id: number
  title: string
  type: 0 | 1 // 0 毕业生岗位，1 社团招新
  publisher: string
  createTime: string
  summary: string
}

// 招新/岗位详情
export interface RecruitDetail {
  id: number
  title: string
  type: 0 | 1
  publisher: string
  createTime: string
  content: string
  imgUrl: string
}

// 列表返回结构
export interface RecruitListResult {
  total: number
  list: RecruitItem[]
}

// 发布招新参数
export interface RecruitPublishParams {
  title: string
  type: 0 | 1
  content: string
  img: string
}

// 我的发布（社团）
export interface MyRecruitItem extends RecruitItem {
  status: 'published' | 'reviewing' | 'offline'
}

// 我的投递（学生）
export interface ApplyItem {
  id: number
  recruitId: number
  title: string
  publisher: string
  createTime: string
  status: 'pending' | 'viewed' | 'pass' | 'reject'
}
