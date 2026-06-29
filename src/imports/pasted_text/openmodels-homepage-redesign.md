下面是最终版，可直接发给 Figma 设计师。

**OpenModels Home Page 视觉与转化升级需求 v1.0**

**项目目标**

在不改变当前首页整体布局的前提下，进一步提升 OpenModels 官网的：

```text
高级感
科技感
可信任感
交易感
卖 API key / credits 的明确性
```

当前页面已经表达了 “open-source model token marketplace”，但还不够明确传递：

```text
用户来这里可以买 API key
充值 credits
用 credits 调用开源模型 tokens
```

新版本首页需要让用户 3 秒内理解：

```text
Buy one API key.
Add credits.
Spend across verified open-source models.
```

**核心定位**

OpenModels 不是普通 AI SaaS 官网，也不是模型信息展示页。

它是：

```text
An API key marketplace for open-source model tokens.
```

中文理解：

```text
一个售卖开源大模型 tokens API key 和 credits 的 marketplace。
```

**设计总方向**

结构继续参考：

```text
opencode.ai
```

视觉继续参考：

```text
Alephantobserve0422
Vercel / Geist
Restrained Modernism
```

最终感觉：

```text
Developer-first
High-trust
Infra-grade
Precise
Commercially clear
Slightly futuristic
Not flashy
```

避免：

```text
不要 Web3 / crypto 风
不要 AI 插画
不要大面积渐变
不要营销 SaaS hero
不要过度圆角卡片
不要 dashboard 堆卡片
不要只像 docs 页面
```

**首页叙事调整**

当前叙事偏：

```text
我们有 open-source model tokens
```

需要升级为：

```text
你可以买一个 API key，用 credits 调用 open-source model tokens
```

首页主线：

```text
1. Buy API key
2. Add credits
3. Compare live token prices
4. Use one OpenAI-compatible endpoint
5. Track usage and availability
```

**Hero 文案**

H1 推荐：

```text
One API key for open-source model tokens
```

备选：

```text
Buy API keys for open-source model tokens
```

推荐使用第一版，更高级、更克制。

副标题：

```text
Purchase credits, get an API key, and spend across verified open-source models with live pricing and usage-based billing.
```

Eyebrow：

```text
Instant key issuance · Live pricing · Usage-based billing
```

Primary CTA：

```text
Buy API key
```

Secondary CTA：

```text
View live pricing
```

不要再用太泛的 `Get API key` 作为主按钮。`Buy API key` 更明确传递售卖属性。

**Header 调整**

当前结构保留：

```text
OpenModels
Models
Pricing
Docs
Status
Enterprise
Sign in
Get API key
```

建议改为：

```text
OpenModels
Models
Pricing
Docs
Status
Enterprise
Sign in
Buy API key
```

视觉要求：

```text
Header 高度保持 48px
背景 rgba(250,250,250,0.86)
Backdrop blur 14px
边框细，但外层边框略强于内部线
CTA 黑底白字，带轻微 inset highlight
```

**Announcement Bar**

目标：从营销通知变成市场交易信号。

推荐文案：

```text
NEW DeepSeek R1 key access now live · $0.50 / 1M input · Updated 2m ago
View live pricing →
```

视觉：

```text
NEW badge 黑底白字
价格用 mono
Updated 2m ago 用 muted gray
View live pricing 用 brand blue
保持紧凑，不要做彩色 banner
```

**Hero 左侧视觉**

保留当前左侧布局，但强化层级。

内容结构：

```text
Eyebrow
H1
Subtitle
CTA group
Stats
Small trust note
```

Stats 改为更贴近购买链路：

```text
18+
verified models

$20
starter credits

99.9%
tracked uptime
```

或者：

```text
18+
verified models

Instant
key issuance

99.9%
tracked uptime
```

下方小注：

```text
Pricing, availability, and usage are monitored continuously.
```

**Hero 右侧：从 Model Terminal 升级为 Key Purchase Terminal**

这是最重要的视觉升级点。

当前右侧是：

```text
model price table
code block
```

需要升级成：

```text
API key purchase terminal
+
live model pricing
+
code request
```

不要改变右侧整体位置和大小，只调整内部信息。

推荐右侧结构：

**顶部：API Key Summary**

```text
OPENMODELS API KEY
om_live_••••••••••••

Credits
$100 available

Spend across
18 verified open models

Endpoint
api.openmodels.com/v1

Status
Ready to use
```

视觉建议：

```text
顶部可以使用深色 header 或深色 key strip
黑色/深灰背景只用于 key 区域，增强科技感
API key 使用 mono
Ready to use 使用 green status pill
```

**中部：Live Pricing Table**

字段：

```text
MODEL
INPUT
OUTPUT
ACCESS
```

示例：

```text
llama-3.1-70b     $0.40 / 1M     $0.70 / 1M     Included
qwen-2.5-72b      $0.35 / 1M     $0.60 / 1M     Included
deepseek-v3       $0.28 / 1M     $0.55 / 1M     Included
mistral-large     $0.45 / 1M     $0.80 / 1M     Limited
```

底部 metadata：

```text
Updated 2m ago · Routed through verified providers
```

**底部：Code Block**

保留 tabs：

```text
curl
python
node
```

上方 label：

```text
OpenAI-compatible request
```

代码内容继续展示 API key 调用方式。

**关键视觉要求**

右侧 terminal 要让人感觉：

```text
这个 key 已经可以用
有 credits
有模型价格
有 endpoint
有状态
可以复制代码马上调用
```

这比单纯展示模型列表更能传递“卖 key”。

**Pricing / Credits 表达**

首页需要出现更明确的 credits 购买信号。

如果不新增大模块，可以在现有 Pricing / Cost Calculator 附近强化：

```text
Starter key
$20 credits
Instant access

Growth key
$100 credits
For apps and agents

Scale key
Custom credits
Team limits and SLA
```

按钮：

```text
Buy API key
Add credits
```

避免：

```text
Subscribe
Start plan
Choose plan
```

因为 OpenModels 是 credits/token marketplace，不是订阅 SaaS。

**Marketplace Section 调整**

标题保持：

```text
Shop tokens by model
```

描述建议：

```text
Compare live token prices, provider availability, and model fit before spending credits with your API key.
```

表格 CTA 建议：

```text
Use with key
```

或：

```text
Buy access
```

不建议继续只用 `Use`，太弱。

字段建议：

```text
Model ID
Provider
Input /1M
Output /1M
Context
Use case
Availability
Action
```

Action：

```text
Use with key
```

**信任元素**

全页需要反复但克制地出现这些短语：

```text
Instant key issuance
Verified providers
Live pricing
Tracked uptime
OpenAI-compatible endpoint
Usage-based billing
Spend limits
No subscription required
```

这些比“reliable / cheap / powerful”更可信。

**Typography**

继续保持当前简化字号体系：

```text
H1 only: 40px
Base UI: 14px
Meta: 12px
```

原则：

```text
不要新增 10/11/13/15/20/24 等字号
用字重、颜色、间距做层级
价格、模型 ID、API key、endpoint 用 mono
```

**视觉高级感细节**

请重点处理：

```text
1. 右侧 API key 区域增加深色科技感，但不要全站变暗
2. 表格边框分层：outer / section / row 不要同色
3. CTA 要像付费入口，不像普通按钮
4. Status pill 统一规范
5. Pricing / credits 信息要更像真实交易数据
6. 蓝色只用于品牌、链接、focus，不铺满页面
7. 绿色只用于 ready/live/operational
8. 页面整体保持克制、精密、可信
```

**Figma 交付内容**

请输出：

```text
1. Desktop homepage 1440px
2. Mobile homepage 390px
3. Hero right API Key Purchase Terminal 组件
4. Header CTA 改版状态
5. Buy API key / View live pricing CTA states
6. Status pill: Ready / Live / Limited / Soon
7. Marketplace table row with “Use with key”
8. Credits / key purchase mini component
9. Light mode visual token sheet
```

可选：

```text
Dark mode sample
```

**验收标准**

设计通过标准：

```text
1. 不改变当前首页大布局
2. 首屏明确传递“可以买 API key”
3. 用户能理解 credits 和 model tokens 的关系
4. 页面比当前更精致、更可信、更像 infra 产品
5. 右侧 terminal 看起来像真实可用产品，而不是 mockup
6. 视觉保持 opencode-like 结构和 Alephantobserve0422 的克制高级感
```

**最终一句话方向**

```text
Make OpenModels feel like a premium API key marketplace where developers buy credits and instantly spend them across verified open-source model tokens.
```