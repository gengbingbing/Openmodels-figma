**OpenModels Home 优化 Figma 需求 v1.1**

**目标**

在当前 Home 页面设计基础上优化，不改变页面结构、不重做布局。

本次重点不是 redesign，而是强化 OpenModels 的核心定位：

```text
最低价
直供
不是中转站
不是 sub2api 式代理
不是虚假 reseller key
```

用户进入官网后，需要 3 秒内理解：

```text
OpenModels sells low-price, direct-supply open-source model tokens.
It is not an opaque proxy chain or unstable reseller key service.
```

中文理解：

```text
OpenModels 是开源模型 tokens 的低价直供市场，不是中转站。
```

**不变的页面结构**

请保持当前 Home 结构：

```text
Header
Announcement bar
Hero left copy + CTA + stats
Hero right terminal
Marketplace table
Pricing / proof section
API section
Status section
Use cases
FAQ
Footer
```

不要重排模块，不要新增复杂大模块，不要改变当前 opencode-like 页面骨架。

**设计方向**

继续保持当前视觉风格：

```text
Developer-first
Vercel / Geist-inspired
Restrained modernism
Neutral grayscale
Border-first
Compact product UI
Terminal / marketplace feel
```

不要做成：

```text
Web3 token exchange
Crypto site
AI SaaS marketing page
Gradient-heavy landing page
Stock illustration page
```

**核心文案定位**

当前页面表达偏：

```text
One API key for open-source model tokens
```

需要升级为：

```text
Lowest-price direct access to open-source model tokens
```

推荐 Hero H1：

```text
Lowest-price direct access to open-source model tokens
```

推荐副标题：

```text
Buy credits and use verified open-source models through direct supply, not opaque proxy chains or unstable reseller keys.
```

推荐 Eyebrow：

```text
Direct supply · Lowest listed prices · No proxy chains
```

Primary CTA：

```text
Buy API key
```

Secondary CTA：

```text
Compare prices
```

**Header 调整**

当前 Header 结构不变：

```text
OpenModels
Models
Pricing
Docs
Status
Enterprise
Sign in
CTA
```

只改 CTA 文案：

```text
Buy API key
```

视觉保持当前黑底白字按钮，但更强调购买入口。

**Announcement Bar**

保留当前 announcement bar 样式和位置。

推荐文案：

```text
NEW Direct DeepSeek R1 supply now live · lowest listed input price · Updated 2m ago
Compare prices →
```

目标：从普通产品通知变成“直供 + 低价”的市场信号。

视觉要求：

```text
NEW badge 保持黑底白字
价格 / model ID 使用 mono
Compare prices 使用 blue link
不要变成彩色营销 banner
```

**Hero 左侧**

保留当前布局：

```text
Eyebrow
H1
Subtitle
CTA group
Stats
Small note
```

更新内容：

Eyebrow：

```text
Direct supply · Lowest listed prices · No proxy chains
```

H1：

```text
Lowest-price direct access to open-source model tokens
```

Subtitle：

```text
Buy credits and use verified open-source models through direct supply, not opaque proxy chains or unstable reseller keys.
```

CTA：

```text
Buy API key
Compare prices
```

Stats 推荐三列：

```text
18+
verified models

0
proxy chains

99.9%
tracked uptime
```

或备选：

```text
18+
verified models

Lowest
listed prices

Direct
supply paths
```

小注：

```text
Pricing, supply paths, and availability are monitored continuously.
```

**Hero 右侧 Terminal**

保持右侧 terminal 的位置、大小和整体结构，不重做。

将 terminal 内容从普通 API key terminal 优化为：

```text
DIRECT SUPPLY
Verified open-model access

PRICE CHECK
Lower proxy-chain markup

API KEY
om_live_••••••

ROUTING
No proxy chains
```

也可以保留 credits 信息：

```text
CREDITS
$100 available
```

右侧 terminal 要表达：

```text
这是直供 access
不是 proxy-chain 中转
价格更接近 direct token cost
买 key 后可直接使用
```

视觉要求：

```text
保持黑/白/灰 + blue accent
Direct supply / No proxy chains 用明确 status row
Live / Verified 可以用 green status pill
不要变成复杂 dashboard
不要加太多小字
```

**Marketplace Table**

保留当前 marketplace 模块和表格结构。

建议调整字段：

```text
Model ID
Provider
Input /1M
Output /1M
Supply
Availability
Action
```

新增或替换一列：

```text
Supply
```

Supply 状态：

```text
Direct
Verified
Limited
```

Action 按钮：

```text
Buy access
```

或：

```text
Buy direct access
```

Marketplace 描述文案改为：

```text
Compare direct token prices, provider availability, and supply status before you buy credits.
```

**Proof / Pricing Section**

保留当前 PricingProof / proof section，不改变结构，只改文案重点。

Section title：

```text
Direct supply means lower prices
```

Subtitle：

```text
OpenModels cuts out proxy-chain markup so developers can buy open-source model tokens with transparent pricing and stable access.
```

三点内容：

```text
No proxy-chain markup
Pay closer to direct token cost without stacked reseller margins.

Verified supply paths
Use open-source models through direct or verified provider access.

Transparent token rates
See input/output pricing, availability, and supply status before you buy.
```

**API Section**

API section 保留。

需要强调：

```text
OpenAI-compatible endpoint
Direct-supply token access
Stable API key
No hidden proxy routing
```

可以增加一行 label：

```text
Direct-supply API access
```

避免让 API section 看起来像普通中转 API wrapper。

**Status Section**

Status section 保留。

状态指标建议加入：

```text
Supply status
Provider verification
Price freshness
Availability monitoring
```

让 status 不只是 uptime，而是体现：

```text
价格是否最新
供应是否验证
是否直供
是否可用
```

**FAQ**

FAQ 必须加入反中转解释。

新增问题：

```text
Is OpenModels a proxy reseller?
```

回答：

```text
No. OpenModels is built for direct and verified open-source model token supply, not opaque proxy chains or sub2api-style shared keys.
```

新增问题：

```text
Why are prices lower?
```

回答：

```text
OpenModels reduces reseller layers and proxy-chain markup, so users can buy credits closer to direct token cost.
```

新增问题：

```text
How do I know the supply is real?
```

回答：

```text
OpenModels shows pricing, availability, and supply status for supported open-source models before users buy or route traffic.
```

**视觉细节要求**

继续保持当前设计系统：

```text
H1 only: 40px
Base UI: 14px
Meta: 12px
Mono for model IDs, prices, API keys
Blue only for brand / links / access signal
Green only for verified / live / operational
Border-first hierarchy
No excessive cards
No gradients as main visual
```

重点增强这些视觉信号：

```text
Direct
Verified
No proxy chains
Lowest listed price
Supply status
```

可以使用 small status pill，但不要过度装饰。

**Figma 交付要求**

请基于当前 Home 输出：

```text
1. Updated desktop Home 1440px
2. Updated mobile Home 390px
3. Hero left revised copy
4. Hero right Direct Supply Terminal
5. Marketplace table with Supply column
6. PricingProof / proof section copy update
7. FAQ new anti-proxy entries
8. Header CTA state: Buy API key
```

**验收标准**

设计通过标准：

```text
1. 没有改变当前 Home 的页面结构
2. 第一屏明确传递最低价
3. 第一屏明确传递直供，不是中转站
4. 仍然保持高级、克制、developer infra 风格
5. 用户能理解 OpenModels 和 sub2api-style reseller 的区别
6. 用户能理解为什么价格更低
7. CTA 明确引导 Buy API key
```

**最终方向一句话**

```text
Keep the current Home design structure, but reposition OpenModels as the lowest-price direct-supply alternative to opaque open-model token resellers.
```