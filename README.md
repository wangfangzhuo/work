# 个人工作项目

> 工作项目管理 + PM Vibe Coding 学习实践

## 工作项目

### 自营低价项目 (`docs/projects/自营低价`)
1药城平台通过"竞价直通车（JBP）"机制驱动商家主动卷低价，形成低价→流量增长→交易增长的正向循环。

**核心机制：** 商家将价格调至自营最低价 → 搜索置顶+打标"自营低价"+智能采购曝光
**当前阶段：** 运营推进中，核心指标低价订单GMV占比目标65%（现约50%）
**关键瓶颈：** 打标SKU仅贡献27%GMV，商家自动跟价功能待开发
**详细总结：** [docs/projects/自营低价/项目总结.md](docs/projects/自营低价/项目总结.md)

### 整件购项目 (`docs/projects/整件购`)
1药城上线"整件购"专区，让客户按整件倍数下单，提升仓储效率、降低拆零成本。

**两种模式：** 预售整件购（以销定采）+ 实物整件购（有现货库存）
**当前阶段：** 3月目标GMV 1600W，已有多家JBP商家报名
**核心挑战：** 整件需求仅占3%，需精准选品+强运营驱动
**详细总结：** [docs/projects/整件购/项目总结.md](docs/projects/整件购/项目总结.md)

### 资源位管理项目 (`docs/projects/资源位管理`)
基于 OpenClaw（感知-记忆-执行-反馈四层能力模型），将资源位配置从"16步×4角色×5系统"的人工流程改造为"3次确认，15分钟"的 AI 全流程智能化。

**核心价值：** 运营从执行者变为决策者，单次配置从2-3小时降至15分钟
**落地节奏：** 三阶段9周（AI当眼睛→AI当双手→AI当搭档）
**技术方案：** 1个 Skill + 11个底座 API（腾讯文档、神策、CRM、优惠券、落地页等）
**详细方案：** [docs/projects/资源位管理/OpenClaw资源位管理方案.md](docs/projects/资源位管理/OpenClaw资源位管理方案.md) | [汇报版](docs/projects/资源位管理/OpenClaw资源位管理-汇报版.md)

### 资质管理项目 (`docs/projects/资质管理`)
1药城注册环节的企业资质审核规则梳理，覆盖10种企业类型、30+填写字段、10+证照的完整审核标准。

**覆盖范围：** 医疗机构（公立/非公立/诊所）、药品经营企业（单体药店/连锁/批发）、生产企业
**核心内容：** 注册字段规则、证照上传要求、经营范围勾选逻辑、各证照审核标准、特殊情况处理
**产品目标：** 为资质审核自动化 Skill 提供知识库基础
**详细文档：** [docs/projects/资质管理/注册字段与证照要求-完整版.md](docs/projects/资质管理/注册字段与证照要求-完整版.md)

### OpenClaw (`docs/projects/openclaw`)
药城版 OpenClaw 落地方案及相关分享材料。

**详细方案：** [docs/projects/openclaw/药城版OpenClaw落地方案.md](docs/projects/openclaw/药城版OpenClaw落地方案.md)

## 产品方向（Vibe Coding）

### 跨平台采购助手 (`apps/procurement-assistant`)
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

### 1药城AI交互改造 (`apps/1药城AI交互改造`)
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
├── apps/                              # 应用项目（Vibe Coding）
│   ├── procurement-assistant/         # 跨平台采购助手
│   ├── 跨平台采购助手/               # 跨平台采购助手（中文版）
│   └── 1药城AI交互改造/              # 1药城AI交互改造
├── docs/
│   ├── projects/                      # 按项目归档
│   │   ├── procurement-assistant/     # 采购助手调研 & 提示词迭代
│   │   ├── yiyaocheng-ai/            # 1药城AI交互改造调研
│   │   ├── openclaw/                  # OpenClaw 落地方案 & 分享材料
│   │   ├── 整件购/                   # 整件购项目材料 & 总结
│   │   ├── 自营低价/                 # 自营低价项目材料 & 总结
│   │   ├── 资源位管理/               # OpenClaw资源位全流程智能化方案
│   │   └── 资质管理/                 # 注册环节资质审核规则
│   ├── knowledge/                     # 通用知识沉淀（跨项目可复用）
│   ├── meetings/                      # 会议纪要
│   ├── presentations/                 # 汇报 & 演讲材料
│   └── tools/                         # 工具脚本 & 生成产物
└── infra/                             # 部署配置
```

## 开发进度

- [x] 项目初始化
- [x] 采购助手 - AI 对话原型（Google AI Studio 生成）
- [x] 采购助手 - MVP 上线 → [work1-4orv.vercel.app](https://work1-4orv.vercel.app/)
- [ ] 采购助手 - 接入真实比价数据（1药城、药师帮、小药药、药九九）
- [ ] 1药城 - 交互流程调研
- [ ] 1药城 - AI 改造 Demo
