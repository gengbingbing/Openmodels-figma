OpenModels Website 视觉升级需求 v0.2
目标
在不改变当前页面布局和信息结构的前提下，提升官网的 质感、信用感、交易可信度和基础设施产品感。
当前页面结构已经成立：Header、Announcement、Hero 左侧文案、Hero 右侧 model table + code block、Marketplace section 都保留。设计师不要重做布局，重点做视觉升级。
核心方向：
OpenModels = open source LLM token marketplace
不是普通 AI SaaS landing page
不是 Web3 token 交易所
不是模型平台
而是可信、稳定、透明的开源模型 token 售卖市场
参考结构：
opencode.ai
参考视觉：
Alephantobserve0422
Vercel / Geist-inspired
Restrained Modernism
Border-first
Neutral grayscale
Compact developer UI
当前问题
现有页面偏原型感，信用感不足，主要原因：
1. 所有边框灰度接近，层级太平
2. 右侧表格像 demo，不像真实 marketplace terminal
3. 价格、状态、uptime 缺少可信上下文
4. CTA 黑块偏硬，缺少精致产品感
5. 页面缺少 verified、live、status、provider、updated 等市场信任信号
设计原则
请保持当前布局，只升级视觉表现：
不改变页面结构
不改变模块顺序
不做大幅重排
不加复杂插画
不加大面积渐变
不做 Web3 / crypto 风
不做传统 SaaS hero
不做过度圆角卡片
目标观感：
developer-first
trustworthy
infrastructure-grade
marketplace-like
pricing-transparent
stable
precise
整体视觉方向
页面应该更像一个“实时模型 token 市场终端”，而不是营销页。
关键词：
Live pricing
Verified providers
Open model supply
Transparent token cost
API-ready
Operational reliability
视觉语言：
中性灰背景
白色主面板
细边框建立层级
轻微 shadow 提升质感
mono font 表达价格、模型 ID、API
status pill 表达运行状态
蓝色只用于链接、CTA 辅助、focus 和品牌强调
绿色只用于 operational/live 状态
颜色建议
基础色：
Page background: #FAFAFA
Panel background: #FFFFFF
Inset background: #F7F7F7
Table header: #F3F3F3
Code background: #F8F8F8

Text primary: #0A0A0A
Text secondary: #555555
Text muted: #8A8A8A
Text faint: #B5B5B5

Border subtle: #ECECEC
Border default: #E2E2E2
Border strong: #D6D6D6

Brand blue: #0047FF
Success green: #16A34A
Warning amber: #D97706
Disabled gray: #A3A3A3
不要让页面变成蓝色主题。蓝色只做少量强调。
字体
Sans: Geist / Inter / system-ui
Mono: Geist Mono / SFMono / Menlo
使用规则：
H1: Sans, heavy, compact
Navigation: Sans, 13px
Body: Sans, 14-15px
Model IDs: Mono
Prices: Mono
API code: Mono
Status metadata: Sans or Mono, small size
不要过度使用 letter spacing。只有 section label 可用 uppercase + 轻微 tracking。
Header 升级
当前布局保持：
OpenModels | Models | Pricing | Docs | Status | Enterprise | Sign in | Get API key
视觉升级：
Header background: rgba(250,250,250,0.86)
Backdrop blur: 12-16px
Bottom border: #E2E2E2
Logo area border 保留
CTA area border 保留
Logo：
Open 用 brand blue
Models 用 near-black
字重 700
整体更稳，不要太像普通文字链接
CTA：
Get API key
黑底白字
6px 或 0-2px restrained radius，按当前系统统一
增加轻微 inset highlight:
inset 0 1px 0 rgba(255,255,255,0.16)
hover: #1F1F1F
Announcement Bar
当前内容：
NEW DeepSeek R1 now available · $0.50 / 1M input
View models →
建议升级为：
NEW DeepSeek R1 tokens now live · $0.50 / 1M input · Updated 2m ago
View models →
视觉要求：
NEW badge 黑底白字
价格用 mono
Updated 2m ago 用 muted text
View models 用 brand blue
整条保持紧凑，不要变成营销横幅
Hero 左侧
H1 保持：
The open source model token marketplace
副标题建议改为：
Buy reliable, low-cost tokens for open source LLMs. Compare live prices, use one API key, and pay only for what you use.
Eyebrow 建议改为：
Verified open model supply · Live pricing · Pay per token
视觉：
绿色小点保留，但更精细
文字颜色从 #888 提升到 #666
不要让 eyebrow 太弱，因为它承担信用感
CTA：
Primary: Get API key
Secondary: View models
Primary button 应更精致：
黑底
清晰边框
轻微内高光
hover 稳重
icon spacing 8px
Secondary button：
白底或透明
1px border
hover border 加深
不要像 disabled button
Hero Stats
当前：
18+ open models
$0.04 min per 1M tokens
99.9% average uptime
建议改成：
18+
verified models

$0.04
from / 1M tokens

99.9%
tracked uptime
可以增加一条非常小的说明：
Pricing and availability are monitored continuously.
设计要求：
数字用 mono
label 用 muted sans
分割线更轻
数字不要太大，但要更像 dashboard metric
Hero 右侧：Marketplace Terminal
这是本次升级重点。当前右侧需要更像真实 marketplace，而不是 mock table。
保持现有上下结构：
上方：model price table
下方：code snippet
表格建议字段：
MODEL
INPUT
OUTPUT
STATUS
价格展示：
$0.40 / 1M
$0.70 / 1M
不要只写 $0.40，否则不像真实售卖信息。
Status 从小绿点升级为 pill：
Live
Limited
Soon
Live pill 视觉：
background: #F0FDF4
border: #BBF7D0
text: #15803D
green dot: #16A34A
pill radius: 999px
表格底部增加一行小 metadata：
Updated 2m ago · Routed through verified providers
这行非常关键，直接提升信用感。
Code Block
当前 code block 保留，但升级标题语境。
Tabs 保持：
curl
python
node
建议在 code 区域右上或上方加入小 label：
OpenAI-compatible request
Copy 按钮保留。
视觉要求：
code background: #FAFAFA 或 #F8F8F8
tab active border 更清晰
copy icon 不要太浅
代码颜色从 #555 提升到 #444
endpoint / model / key 可以略微加深
Marketplace Section
当前标题保留：
Shop tokens by model
描述建议改为：
Compare live token prices, provider availability, context length, and model fit before you buy.
Section label：
MARKETPLACE
保留蓝色 uppercase，但 tracking 不要过大。
表格升级：
字段建议：
Model ID
Provider
Input /1M
Output /1M
Context
Use case
Availability
Status 建议改成 Availability，更像供应市场。
行 CTA：
当前：
Use →
建议改为：
Buy tokens
或：
Get key
更符合 marketplace。
Filter chips：
All
Chat
Coding
Reasoning
Embedding
当前像 tabs，可以保留结构，但视觉要更精细：
Active: underline 或 subtle blue text
Inactive: muted
Hover: darker text
不要做成大 pill 按钮
信用感元素
在不改变布局的情况下，建议设计师加入这些小型 trust signals：
Verified providers
Live pricing
No subscription
OpenAI-compatible
Tracked uptime
Usage-based billing
可以出现在：
Hero eyebrow
Announcement bar
Hero right table metadata
Stats label
Marketplace description
不要新增大模块，只嵌入现有位置。
组件细节
Button：
Height: 40px
Font: 13px / 600
Radius: 6px 或当前 sharp style
Primary: black
Secondary: white/transparent with border
Focus: #0047FF ring
Status Pill：
Height: 20-22px
Padding: 4px 8px
Radius: 999px
Font: 11px / 500
Dot: 5px
Table：
Header background: #F5F5F5
Header text: #9A9A9A
Header font: 10-11px uppercase
Row height: 36-40px
Row hover: #FAFAFA
Border: #EEEEEE
Code block：
Mono 11-12px
Line height: 1.7-1.9
Background: #FAFAFA
Border top/bottom consistent
Copy button visible but quiet
需要 Figma 输出的内容
请输出以下设计稿：
1. Desktop homepage hero polish, 1440px
2. Mobile homepage hero polish, 390px
3. Header states: default / hover / mobile
4. Hero right marketplace terminal component
5. Marketplace table component
6. Button states
7. Status pill states: Live / Limited / Soon
8. Light mode token sheet
可选：
Dark mode sample
验收标准
设计通过的标准：
1. 不改变当前页面布局
2. 一眼能看出这是 token marketplace
3. 价格、状态、更新时间、provider 可信信号更明显
4. 页面更像真实开发者基础设施产品
5. 视觉仍然克制，不营销、不花哨
6. 与 Alephantobserve0422 的 restrained modernism 保持一致
一句话设计方向
Keep the opencode-like structure, but make OpenModels feel like a verified, live-pricing marketplace for open source model tokens.