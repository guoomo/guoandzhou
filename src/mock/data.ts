import type { ForumItem } from '@/types/forum'
import type { ApplyItem, RecruitItem } from '@/types/recruit'
import type { Resume } from '@/types/resume'

/**
 * 前端写死的假数据（后端未搭建期间的唯一数据源）
 * 后端就绪后：.env 里 VITE_APP_USE_MOCK=false，本目录可直接删除
 */

// 招新 / 岗位列表（type：0 毕业生岗位，1 社团招新）
export const mockRecruitItems: RecruitItem[] = [
  {
    id: 1,
    title: '前端开发实习生',
    type: 0,
    publisher: '云启科技',
    createTime: '2026-10-19',
    summary: '参与校园招聘产品前端开发，熟悉 Vue3 / TypeScript 优先，每周到岗 3 天。',
  },
  {
    id: 2,
    title: 'Java 后端实习生',
    type: 0,
    publisher: '恒信软件',
    createTime: '2026-10-18',
    summary: '参与真实项目研发，导师带教并提供实习证明，表现优秀可转正。',
  },
  {
    id: 3,
    title: '产品经理助理',
    type: 0,
    publisher: '蓝湖科技',
    createTime: '2026-10-17',
    summary: '协助需求梳理与竞品分析，定期组织线下培训与分享会。',
  },
  {
    id: 4,
    title: '摄影协会秋季招新',
    type: 1,
    publisher: '摄影协会',
    createTime: '2026-10-16',
    summary: '欢迎热爱影像与设计的同学加入，提供相机设备与后期培训。',
  },
  {
    id: 5,
    title: '校辩论队招新',
    type: 1,
    publisher: '校辩论队',
    createTime: '2026-10-15',
    summary: '每周两次集训，校级联赛参赛机会，不限年级与专业。',
  },
  {
    id: 6,
    title: '街舞社招新',
    type: 1,
    publisher: '街舞社',
    createTime: '2026-10-14',
    summary: '零基础可加入，每周团训 + 校园演出，一起跳舞一起玩。',
  },
  {
    id: 7,
    title: '新媒体运营实习生',
    type: 0,
    publisher: '云启科技',
    createTime: '2026-10-13',
    summary: '负责公众号与短视频内容策划，有作品集者优先。',
  },
  {
    id: 8,
    title: '青年志愿者协会招新',
    type: 1,
    publisher: '青年志愿者协会',
    createTime: '2026-10-12',
    summary: '参与社区公益与支教项目，可认定志愿时长。',
  },
  {
    id: 9,
    title: '校园摄影大赛志愿者招募',
    type: 1,
    publisher: '摄影协会',
    createTime: '2026-10-11',
    summary: '负责赛事现场记录与作品整理，可获协会纪念周边。',
  },
  {
    id: 10,
    title: '测试开发实习生',
    type: 0,
    publisher: '恒信软件',
    createTime: '2026-10-10',
    summary: '负责接口自动化用例编写，熟悉 Python 或 Java 均可。',
  },
  {
    id: 11,
    title: 'UI 设计实习生',
    type: 0,
    publisher: '蓝湖科技',
    createTime: '2026-10-09',
    summary: '参与移动端界面设计，熟练使用 Figma，需提供作品集。',
  },
  {
    id: 12,
    title: '羽毛球社招新',
    type: 1,
    publisher: '羽毛球社',
    createTime: '2026-10-08',
    summary: '每周三、周日体育馆活动，欢迎各水平同学加入。',
  },
]

// 详情正文：id -> 正文 + 封面
export const mockRecruitContents: Record<number, { content: string, imgUrl: string }> = {
  1: {
    content: '岗位职责：\n1. 参与校园招聘产品的前端页面开发与迭代；\n2. 配合后端完成接口联调，保障多端表现一致；\n3. 参与组件库建设与页面性能优化。\n\n任职要求：\n1. 熟悉 Vue3、TypeScript、SCSS；\n2. 每周可到岗 3 天，实习期不少于 3 个月；\n3. 有 uni-app / 小程序经验者优先。',
    imgUrl: '',
  },
  2: {
    content: '岗位职责：\n1. 参与业务系统的接口开发与维护；\n2. 编写单元测试，参与代码评审。\n\n任职要求：\n1. 熟悉 Java 基础与 Spring Boot；\n2. 了解 MySQL、Redis；\n3. 每周到岗 4 天，可长期实习者优先。',
    imgUrl: '',
  },
  3: {
    content: '岗位职责：\n1. 协助完成需求梳理、原型绘制与文档输出；\n2. 跟踪竞品动态，输出分析报告。\n\n任职要求：\n1. 逻辑清晰，文档能力强；\n2. 每周到岗 2-3 天。',
    imgUrl: '',
  },
  4: {
    content: '社团简介：\n摄影协会成立于 2012 年，是校内规模最大的影像类社团。\n\n招新方向：\n1. 摄影组：活动跟拍、人像与风光创作；\n2. 后期组：Lightroom / Photoshop 修图与调色；\n3. 运营组：公众号排版与活动策划。\n\n福利：免费借用相机与镜头，每月一次外拍活动。',
    imgUrl: '',
  },
  5: {
    content: '招新要求：\n1. 热爱表达，愿意每周投入 4 小时以上；\n2. 不限年级与专业，零基础可参加集训。\n\n活动安排：每周二、周四晚 19:00-21:00 集训，学期内参加校级联赛。',
    imgUrl: '',
  },
  6: {
    content: '舞种方向：Hiphop / Breaking / Jazz。\n\n招新说明：零基础可加入，社团提供每周两次团训，学期末举办专场演出。',
    imgUrl: '',
  },
  7: {
    content: '岗位职责：\n1. 负责公众号选题、撰稿与排版；\n2. 参与短视频脚本撰写与拍摄。\n\n任职要求：熟悉主流社交平台，有作品集者优先。',
    imgUrl: '',
  },
  8: {
    content: '项目内容：社区公益课堂、乡村支教、赛会志愿服务。\n\n加入收获：志愿服务时长认定、志愿证书、一群志同道合的伙伴。',
    imgUrl: '',
  },
  9: {
    content: '工作时间：10 月 20 日 - 10 月 22 日（可排班）。\n\n工作内容：现场引导、作品登记、展区维护。\n\n福利：协会纪念周边 + 志愿时长 8 小时。',
    imgUrl: '',
  },
  10: {
    content: '岗位职责：\n1. 编写接口自动化测试用例并维护；\n2. 参与版本回归与缺陷跟踪。\n\n任职要求：熟悉 Python 或 Java，了解 Postman / Pytest。',
    imgUrl: '',
  },
  11: {
    content: '岗位职责：\n1. 参与移动端界面视觉设计；\n2. 输出设计规范与切图标注。\n\n任职要求：熟练使用 Figma，需提供作品集。',
    imgUrl: '',
  },
  12: {
    content: '活动时间：每周三、周日 18:00-20:00，体育馆 3 号场地。\n\n招新说明：欢迎各水平同学，社团提供训练用球。',
    imgUrl: '',
  },
}

// 论坛帖子列表
export const mockForumItems: ForumItem[] = [
  {
    id: 1,
    title: '秋招面经：前端实习三轮面试都问了什么',
    author: '张同学',
    createTime: '2026-10-19',
    preview: '一面主要问 JS 基础与事件循环，二面手写防抖和深拷贝，三面聊项目……',
  },
  {
    id: 2,
    title: '摄影协会外拍活动返图（多图）',
    author: '摄影协会',
    createTime: '2026-10-17',
    preview: '上周末去了老城区扫街，附上几张相机直出，欢迎交流构图和调色。',
  },
  {
    id: 3,
    title: '求推荐适合新生的兼职 / 实习渠道',
    author: '李同学',
    createTime: '2026-10-15',
    preview: '大一新生，想找课余时间的实习，除了学校就业网还有哪些靠谱渠道？',
  },
  {
    id: 4,
    title: '社团招新摊位怎么设计更吸引人？',
    author: '街舞社',
    createTime: '2026-10-13',
    preview: '今年想换个思路做摊位，有没有做活动策划的同学给点建议。',
  },
  {
    id: 5,
    title: '简历里的项目经历怎么写才不空洞',
    author: '王同学',
    createTime: '2026-10-11',
    preview: '写了两段项目，但总感觉像流水账，想请教一下 STAR 法则怎么落地。',
  },
  {
    id: 6,
    title: '校园论坛二手闲置交易规则（试行）',
    author: '管理员',
    createTime: '2026-10-09',
    preview: '为方便同学交易，论坛开放闲置板块，请遵守以下规则……',
  },
]

// 帖子正文：id -> 正文 + 配图 + 点赞数
export const mockForumContents: Record<number, { content: string, imgUrl: string, likeCount: number }> = {
  1: {
    content: '一面（40min）：\n- var/let/const 区别、闭包、原型链\n- 事件循环：宏任务与微任务输出顺序\n- 手写一个 debounce\n\n二面（60min）：\n- 手写深拷贝（考虑循环引用）\n- 聊 uni-app 多端适配的坑\n- 项目里最有挑战的部分\n\n三面（30min）：\n- 职业规划、到岗时间、反问环节\n\n总结：基础一定要扎实，项目要能讲清楚「为什么这么做」。',
    imgUrl: '',
    likeCount: 32,
  },
  2: {
    content: '周六下午三点集合，路线是老城区 - 河边 - 天台。\n\n设备：索尼 A7M4 + 35mm F1.8，后期用 Lightroom 简单调了色。\n\n欢迎在评论区交流构图思路。',
    imgUrl: '',
    likeCount: 18,
  },
  3: {
    content: '已知渠道：学校就业网、学院就业群、BOSS 直聘、实习僧。\n\n想问问有没有学长学姐带的内推渠道，或者适合新生的远程实习。',
    imgUrl: '',
    likeCount: 7,
  },
  4: {
    content: '去年我们摆了音响 + 一块 LED 屏循环播放演出视频，效果不错。\n\n今年预算不够，想问问有没有低成本但吸睛的方案？',
    imgUrl: '',
    likeCount: 11,
  },
  5: {
    content: '我的写法是：\n\nS（背景）：项目要解决什么问题\nT（任务）：我负责哪一块\nA（行动）：用了什么技术、做了什么取舍\nR（结果）：量化指标，比如首屏从 3s 降到 1.2s\n\n关键是把「我做了」换成「我为什么这样做」。',
    imgUrl: '',
    likeCount: 26,
  },
  6: {
    content: '1. 禁止发布违规商品与虚假信息；\n2. 交易尽量校内当面完成；\n3. 交易完成后请自行删除或标注「已出」；\n4. 纠纷请私下协商，论坛不承担担保责任。',
    imgUrl: '',
    likeCount: 5,
  },
}

// 我的投递（学生角色）
export const mockApplyList: ApplyItem[] = [
  {
    id: 1,
    recruitId: 1,
    title: '前端开发实习生',
    publisher: '云启科技',
    createTime: '2026-10-18',
    status: 'viewed',
  },
  {
    id: 2,
    recruitId: 3,
    title: '产品经理助理',
    publisher: '蓝湖科技',
    createTime: '2026-10-16',
    status: 'pending',
  },
]

// 我的简历
export const mockResume: Resume = {
  id: 1,
  name: '张同学',
  major: '计算机科学与技术',
  phone: '13800138000',
  intro: '大三在读，喜欢前端与交互设计，做过两个校园项目。',
  skill: 'Vue3、TypeScript、SCSS、Figma',
}
