# 个人工作项目

> 工作项目管理 + PM Vibe Coding 学习实践

## 工作项目

### 3. 自营低价项目 (`docs/自营低价`)
1药城平台通过"竞价直通车（JBP）"机制驱动商家主动卷低价，形成低价→流量增长→交易增长的正向循环。

**核心机制：** 商家将价格调至自营最低价 → 搜索置顶+打标"自营低价"+智能采购曝光
**当前阶段：** 运营推进中，核心指标低价订单GMV占比目标65%（现约50%）
**关键瓶颈：** 打标SKU仅贡献27%GMV，商家自动跟价功能待开发
**详细总结：** [docs/自营低价/项目总结.md](docs/自营低价/项目总结.md)

## 产品方向（Vibe Coding）

### 1. 跨平台采购助手 (`apps/procurement-assistant`)
用 AI 帮助企业/个人跨平台比价、整理采购需求、生成报价单。

**线上地址：** https://work1-4orv.vercel.app/
**技术栈：** React + Vite + Tailwind + Gemini AI
**部署平台：** Vercel

**目标场景：** B2B 药品采购比价

**比价平台：** 1药城、药师帮、小药药、药九九

**核心功能规划：**
- 输入药品需求 → AI 解析结构化采购清单
- 多平台价格聚合对比
- 一键导出报价单

### 2. 1药城AI交互改造 (`apps/yiyaocheng-ai`)
基于 AI 对药品电商平台的交互流程进行智能化改造。

**核心功能规划：**
- 症状描述 → AI 推荐药品
- 用药咨询 RAG 对话（基于药品知识库）
- 智能搜索与个性化推荐

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React + Vite + Tailwind CSS |
| 后端 | Node.js + Express |
| AI | 阿里云通义系列 / DeepSeek |
| 数据库 | Supabase (PostgreSQL + pgvector) |
| 部署 | Vercel（前端）+ Railway（后端）|

## 目录结构

```
.
├── apps/
│   ├── procurement-assistant/   # 跨平台采购助手
│   │   ├── frontend/
│   │   └── backend/
│   └── yiyaocheng-ai/          # 1药城AI交互改造
│       ├── frontend/
│       └── backend/
├── packages/
│   ├── ui/                     # 公共组件库
│   └── ai-client/              # 封装 AI API 调用
├── docs/                       # 产品文档 & 调研笔记
│   ├── 自营低价/              # 自营低价项目材料 & 总结
│   ├── procurement-assistant/
│   └── yiyaocheng-ai/
└── infra/                      # 部署配置
```

## 开发进度

- [x] 项目初始化
- [x] 采购助手 - AI 对话原型（Google AI Studio 生成）
- [x] 采购助手 - MVP 上线 → [work1-4orv.vercel.app](https://work1-4orv.vercel.app/)
- [ ] 采购助手 - 接入真实比价数据（1药城、药师帮、小药药、药九九）
- [ ] 1药城 - 交互流程调研
- [ ] 1药城 - AI 改造 Demo
