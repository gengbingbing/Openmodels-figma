**OpenModels Website 高级质感升级 Figma 需求说明 v0.3**

**项目目标**

在不改变当前官网布局的前提下，将 OpenModels 官网从“可用的开发者 landing page”升级为一个更有质感、更可信、更像真实交易市场的 **open source LLM token marketplace**。

核心不是让页面更炫，而是让用户一眼感觉：

```text
这里的价格是真实的
模型供应是可验证的
API 是生产可用的
平台是稳定可靠的
这是一个严肃的 developer infra marketplace
```

**设计方向**

结构继续参考：

```text
opencode.ai
```

视觉继续参考：

```text
Alephantobserve0422
Vercel / Geist-inspired
Restrained Modernism
```

最终气质：

```text
高级
克制
精密
可信
开发者友好
基础设施产品感
实时 marketplace 感
```

避免方向：

```text
不要 AI 插画
不要大面积渐变
不要 Web3 / crypto 交易所风
不要营销 SaaS 风
不要过度圆角
不要堆卡片
不要过度蓝色主题
```

**核心设计原则**

1. 保持当前布局  
   Header、Announcement、Hero 左右结构、Marketplace、API、Status 等模块顺序不变。

2. 用真实数据感提升高级感  
   多使用 price、status、updated time、provider、availability、uptime、API request 等信息。

3. 用细节层级提升质感  
   通过边框灰度、surface 层级、微弱 shadow、状态 pill、mono 字体形成高级产品 UI。

4. 信任感来自“可验证措辞”  
   少用空泛形容词，多用 verified、live、tracked、routed、updated、compatible 等表达。

**整体视觉系统**

颜色建议：

```text
Page background: #FAFAFA
Main panel: #FFFFFF
Inset surface: #F7F7F7
Table header: #F3F3F3
Code background: #F8F8F8

Text primary: #0A0A0A
Text secondary: #555555
Text muted: #8A8A8A
Text faint: #B5B5B5

Outer border: #DADADA
Section border: #E2E2E2
Row border: #F0F0F0
Strong border: #D6D6D6

Brand blue: #0047FF
Success green: #16A34A
Warning amber: #D97706
Neutral gray: #737373
```

字体：

```text
Sans: Geist / Inter / system-ui
Mono: Geist Mono / SFMono / Menlo
```

字体使用：

```text
H1: Sans, bold, compact
Body: Sans, 14-15px
Navigation: Sans, 13px
Model ID: Mono
Price: Mono
API code: Mono
Status metadata: Sans, 10-12px
```

**Header 升级**

当前结构保持：

```text
OpenModels | Models | Pricing | Docs | Status | Enterprise | Sign in | Get API key
```

视觉要求：

```text
Header height 保持紧凑
Background: rgba(250,250,250,0.86)
Backdrop blur: 12-16px
Bottom border: #E2E2E2
Logo section / CTA section 保留 vertical border
```

Logo：

```text
Open 使用 #0047FF
Models 使用 #0A0A0A
Font weight 700
整体更稳，不要像普通文字链接
```

Primary CTA：

```text
Get API key
Black background
White text
Height 40px
Font 13px / 600
Border #111
Inset highlight: inset 0 1px 0 rgba(255,255,255,0.12)
Hover: #1F1F1F
```

**Announcement Bar**

目标：像真实市场更新，而不是营销横幅。

文案建议：

```text
NEW DeepSeek R1 tokens now live · $0.50 / 1M input · Updated 2m ago
View models →
```

视觉要求：

```text
NEW badge: black background, white text
Price: mono font
Updated 2m ago: muted text
View models: brand blue
整体高度紧凑
不要做成彩色 banner
```

**Hero 左侧**

H1 保持：

```text
The open source model token marketplace
```

Eyebrow 建议：

```text
Verified open model supply · Live pricing · Pay per token
```

副标题建议：

```text
Buy reliable, low-cost tokens for open source LLMs. Compare live prices, use one API key, and pay only for what you use.
```

视觉要求：

```text
绿色小点保留，但更精细
小点可加 subtle outer glow: rgba(22,163,74,0.18)
Eyebrow 颜色不要太浅，建议 #555555
H1 保持强势，但不要营销大字
正文 line-height 1.7 左右
```

CTA：

```text
Primary: Get API key
Secondary: View models
```

Secondary button：

```text
Transparent / white
Border #D6D6D6
Text #444444
Hover border #AAAAAA
不要像 disabled
```

**Hero Stats**

当前 stats 保留三列，但文案升级。

推荐：

```text
18+
verified models

$0.04
from / 1M tokens

99.9%
tracked uptime
```

下方增加小注：

```text
Pricing and availability are monitored continuously.
```

视觉要求：

```text
数字使用 mono
Label 使用 muted sans
分割线用 #ECECEC
整体像 dashboard metric，不像营销数字
```

**Hero 右侧：Marketplace Terminal**

这是最重要的升级区域。

目标：让右侧看起来像真实的 token marketplace terminal。

结构保持：

```text
上方：Model price table
下方：API code block
```

表格字段：

```text
MODEL
INPUT
OUTPUT
STATUS
```

价格格式必须完整：

```text
$0.40 / 1M
$0.70 / 1M
```

不要只写 `$0.40`。

Status 使用 pill，不要只用绿点。

状态：

```text
Live
Limited
Soon
```

Live pill：

```text
Background: #F0FDF4
Border: #BBF7D0
Text: #15803D
Dot: #16A34A
Radius: 999px
Height: 20-22px
Font: 10-11px / 500
```

Limited pill：

```text
Background: #FFFBEB
Border: #FDE68A
Text: #B45309
Dot: #D97706
```

Soon pill：

```text
Background: #F5F5F5
Border: #E5E5E5
Text: #737373
Dot: #A3A3A3
```

表格底部增加 metadata：

```text
Updated 2m ago · Routed through verified providers
```

这个信息非常关键，用来提升 marketplace 信任感。

**Code Block**

Tabs 保持：

```text
curl
python
node
```

增加小标签：

```text
OpenAI-compatible request
```

视觉要求：

```text
Code background: #FAFAFA / #F8F8F8
Tab active border: #111111
Inactive tab text: #999999
Copy button 不要太浅
Code text: #444444
Endpoint / model / key 可以略微加深
```

Code block 不要做得像装饰图，要像真实 docs 组件。

**Marketplace Section**

标题保持：

```text
Shop tokens by model
```

描述建议：

```text
Compare live token prices, provider availability, context length, and model fit before you buy.
```

表格字段建议：

```text
Model ID
Provider
Input /1M
Output /1M
Context
Use case
Availability
```

`Status` 建议改成：

```text
Availability
```

更符合 marketplace 语义。

行 CTA 建议：

```text
Buy tokens
```

比 `Use →` 更符合“售卖 tokens”的定位。

Filter 保持：

```text
All
Chat
Coding
Reasoning
Embedding
```

视觉要求：

```text
Active filter: dark text + underline 或 subtle blue
Inactive: muted
Hover: darker text
不要做成大 pill 按钮
```

**高级感细节**

请重点处理这些微细节：

```text
1. 所有边框不要同一个颜色
2. 表格 header 和 row 背景要有轻微差异
3. Hero 右侧 terminal 需要比左侧更像真实产品界面
4. CTA 有轻微 inset highlight
5. Status pill 统一规范
6. Metadata 文案要存在，但视觉要安静
7. 蓝色只做品牌和链接，不要铺满页面
8. 绿色只用于 live / operational
```

**Figma 交付内容**

请输出：

```text
1. Desktop homepage 1440px
2. Mobile homepage 390px
3. Header default / hover / mobile
4. Hero right marketplace terminal
5. Status pill variants: Live / Limited / Soon
6. Button variants: Primary / Secondary / Hover / Focus
7. Marketplace table component
8. Light mode visual token sheet
```

可选：

```text
Dark mode sample
```

**验收标准**

设计合格标准：

```text
不改变当前布局
更像真实 token marketplace
价格、状态、更新时间、provider 信号更明显
页面更高级，但不花哨
更像 developer infra 产品
更有信用感
视觉上与 Alephantobserve0422 一致
```

**一句话总结**

```text
Keep the opencode-like structure, but make OpenModels feel like a verified, live-pricing marketplace for open source model tokens.
```