OpenModels 官网设计需求文档 v0.1
项目定位
OpenModels 是一个 open source LLM token marketplace，专门售卖开源大模型 tokens。用户可以在平台上对比、购买、使用 Llama、Qwen、DeepSeek、Mistral、Gemma 等开源模型 tokens。
核心不是“AI 平台”，而是“token 售卖市场”：
The open source model token marketplace
Buy reliable, low-cost tokens for open source LLMs.
设计参考
结构参考：opencode.ai
需要借鉴：
首屏直接说明产品是什么
开发者工具风格
页面信息密度高
文案短、硬、直接
用代码块、表格、价格、状态信息作为主要视觉内容
不做传统 SaaS 大营销页
视觉参考：项目目录 Alephantobserve0422
主要参考文件：
[theme.css](/Users/kering/Documents/New project/Alephantobserve0422/src/styles/theme.css)
[dark-theme.css](/Users/kering/Documents/New project/Alephantobserve0422/src/styles/dark-theme.css)
[aleph-design-system-spec.md](/Users/kering/Documents/New project/Alephantobserve0422/src/imports/pasted_text/aleph-design-system-spec.md)
[vercel-geist-design-spec.md](/Users/kering/Documents/New project/Alephantobserve0422/src/docs/vercel-geist-design-spec.md)
视觉方向
使用 Alephantobserve0422 的视觉语言：
Restrained Modernism
Vercel / Geist-inspired product UI
Neutral grayscale foundation
Border-first hierarchy
Minimal shadow
Compact product density
Developer-first
色彩要求：
页面背景：#FAFAFA
卡片背景：#FFFFFF
主文字：#111111
次级文字：#666666 / #444444
边框：#EAEAEA / #D9D9D9
品牌强调色：#0047FF
深色模式可参考：#0A0A0A / #171717 / #262626
字体要求：
Sans：Geist / Inter / system-ui
Mono：Geist Mono / SFMono / Menlo
UI 字体紧凑，正文 14-16px
Hero 可以大，但不要夸张营销化
代码、模型 ID、价格、API endpoint 使用 mono
圆角和阴影：
Button / Input：6px
Card / Table：6px
Overlay：8px
Modal：10px
Badge / Status：pill
默认不用重阴影，以 1px border 建立层级
页面结构
1. Header
内容：
OpenModels
Models
Pricing
Docs
Status
Enterprise
Sign in
Get tokens
设计要求：
固定顶部或首屏顶部
高度紧凑，类似开发者工具导航
Get tokens 为主 CTA
不需要复杂 dropdown
可在右侧加入 GitHub / Docs icon，但不是重点
2. Hero
目标：3 秒内让用户知道这是卖开源模型 tokens 的 marketplace。
H1：
The open source model token marketplace
副标题：
Buy reliable, low-cost tokens for open source LLMs. Compare models, purchase credits, and use them through one simple API.
CTA：
Get tokens
View models
Hero 视觉建议：
左侧：H1、副标题、CTA
右侧：terminal/code 风格的 marketplace preview
不要插画、机器人、抽象 AI 背景
视觉重点放在模型、价格、状态、API
右侧 preview 示例：
MODEL              INPUT        OUTPUT       STATUS
llama-3.1-70b      $0.40 / 1M   $0.70 / 1M   Live
qwen-2.5-72b       $0.35 / 1M   $0.60 / 1M   Live
deepseek-v3        $0.28 / 1M   $0.55 / 1M   Live
mistral-large      $0.45 / 1M   $0.80 / 1M   Live
3. Marketplace Section
标题：
Shop tokens by model
说明：
Compare prices, availability, context length, and supported use cases across open source models.
模块内容：
Model
Provider
Input price
Output price
Context
Tags
Status
CTA: Buy tokens
交互要求：
筛选：Chat / Coding / Reasoning / Embedding
排序：Cheapest / Fastest / Most reliable / Largest context
每行点击进入模型详情
状态用 status pill：Live / Limited / Coming soon
4. Why OpenModels
标题：
Open model tokens without the infrastructure work
四个卖点：
Lower token costs
Marketplace pricing for high-volume open model usage.

Open source models only
Focused on Llama, Qwen, DeepSeek, Mistral, Gemma, and other open models.

Reliable availability
Provider routing, live status, and stable token supply.

Simple developer access
Use purchased credits through an OpenAI-compatible API.
设计要求：
两列布局
信息块简洁
不做大卡片堆叠
使用小 icon 或 mono label
5. Token Credits / Pricing
标题：
Buy credits. Use them across open models.
价格结构：
Starter
$20 credits
For testing and side projects

Growth
$100 credits
For apps, agents, and internal tools

Scale
Custom
For production usage, teams, and SLA
补充文案：
No monthly minimum.
No closed-model lock-in.
Credits apply across supported open source models.
CTA：
Buy credits
View pricing
注意：
不要做成纯订阅 SaaS pricing
重点是 credits / prepaid balance / token usage
Enterprise 是补充，不是首页主卖点
6. Developer API Section
标题：
Use your tokens with one API
展示代码块：
curl https://api.openmodels.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENMODELS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen-2.5-72b",
    "messages": [
      {"role": "user", "content": "Explain token marketplaces."}
    ]
  }'
旁边展示能力：
OpenAI-compatible endpoint
API keys
Usage dashboard
Spend limits
Team access
Model switching
设计要求：
代码块是核心视觉
使用 mono font
保持 opencode 风格的开发者可信感
7. Reliability / Status
标题：
Know what is available before you buy
内容：
Live model status
Provider availability
Latency range
Rate limits
Incident history
表格示例：
MODEL          AVAILABILITY   LATENCY   STATUS
Llama 3.1      99.9%          820ms     Operational
Qwen 2.5       99.8%          760ms     Operational
DeepSeek V3    99.7%          910ms     Operational
CTA：
View status
8. Use Cases
标题：
Built for high-volume open model usage
场景：
AI coding tools
Agent workflows
Customer support automation
Internal copilots
Data extraction
Research and evaluation
设计要求：
简洁列表或紧凑网格
每个场景一句话以内
不需要长篇案例故事
9. FAQ
问题：
What is OpenModels?
Is OpenModels a model provider?
Are credits tied to one model?
Is the API OpenAI-compatible?
Which models are supported?
Do credits expire?
Is my data used for training?
设计要求：
简洁 accordion
文案直接
保持开发者文档感
10. Footer
结构：
OpenModels
The open source model token marketplace.

Product
Models
Pricing
Status
Docs

Developers
API Reference
Quickstart
Model IDs
SDKs

Company
Enterprise
Contact
About

Legal
Terms
Privacy
Data Policy
Figma 交付要求
请设计以下页面/状态：
Desktop homepage: 1440px
Mobile homepage: 390px
Model marketplace section
Pricing / credits section
Dark mode visual sample
Component states: button, input, table row, status pill, filter chip
设计师需要输出：
首页完整视觉稿
Hero 高保真方案
Marketplace table 组件
Pricing credits 组件
API code block 组件
基础设计 tokens：颜色、字体、圆角、边框、阴影
Desktop + Mobile responsive layout
关键原则
OpenModels 官网应该像一个可信的开发者基础设施 marketplace，而不是普通 AI 营销站。
最终观感：
opencode-like structure
Alephantobserve0422 visual system
developer-first
compact
neutral
border-first
token marketplace
transparent pricing