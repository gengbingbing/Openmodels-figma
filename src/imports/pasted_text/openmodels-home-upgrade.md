## Figma 需求：OpenModels Home 最终升级版

**目标**  
基于当前 Home 页面全面升级视觉和内容，让 OpenModels 看起来更专业、精致、可信，并清晰表达：

> OpenModels 是面向开发者购买 open-source LLM tokens 的 marketplace，不是普通中转站。  
> 核心优势是低价、verified direct supply、transparent pricing、one API key、no proxy chains。

---

## 1. Header

**导航保留**
- Models
- Pricing
- Plans
- Docs

**右侧**
- Sign in
- Get API key

**删除**
- Providers
- Enterprise

**视觉**
- 白底
- 细边框
- Header CTA `Get API key` 保持黑底白字
- 不要让 Header 过重

---

## 2. Launch Banner

**文案**
`Launch Credit: deposit $10, get $10 bonus credits · verified open-source model tokens`

**样式**
- 背景：`#F4F7FF`
- 边框：`#DCE6FF`
- 正文：`#333333`
- `Launch` badge：浅蓝底，蓝色文字
- `$10 bonus credits`：品牌蓝 `#0047FF`
- CTA：蓝色 text link `Get API key →`
- 不使用黑色按钮，避免和 Header CTA 冲突

---

## 3. Hero

**H1**
`Buy open-source LLM tokens from verified direct supply`

**Subtitle**
`Compare transparent prices, choose verified open-source models, and use one API key to access direct-supply token routes without proxy chains.`

**Badges**
- Lowest-price open-source tokens
- Verified direct supply
- One API key
- No proxy chains

**CTA**
- Primary：`Get API key`
- Secondary：`View models`

**Hero 右侧模块**
把当前代码块升级为 marketplace 面板。

标题：
`Live token prices`

小字：
`Updated 2m ago`

表格字段：
- Model
- Provider
- Input / 1M
- Status

示例行：
- deepseek-v3 / DeepSeek / `$0.28` / Live
- qwen-2.5-72b / Alibaba / `$0.35` / Live
- llama-3.1-70b / Meta / `$0.40` / Live

底部：
`Base URL: api.alephant.io/v1`  
`Powered by alephant.io`

**Hero 指标**
- `88+` live routes
- `$0.04` from / 1M tokens
- `24+` verified providers

---

## 4. Marketplace Section

**Section Label**
`MARKETPLACE`

**Title**
`Compare open-source token prices before you buy`

**Description**
`View live token prices, provider availability, context length, and supply status across verified open-source models.`

**Summary Bar**
在表格上方增加：
- `88 live routes`
- `24 verified providers`
- `0 proxy chains`
- `prices updated 2m ago`

**表格字段**
- Model
- Provider
- Input / 1M
- Output / 1M
- Context
- Supply
- Availability
- Action

**Action**
`Buy tokens`

**Badge**
- Direct：浅绿
- Verified：浅蓝
- Live：浅绿
- Limited：浅橙

---

## 5. Trusted by Builders

新增可信度证明模块。

**Section Label**
`TRUSTED BY BUILDERS`

**Title**
`Teams use OpenModels to lower open-source inference costs`

**Description**
`Developers and AI teams use OpenModels to buy verified open-source model tokens with transparent pricing, prepaid credits, and one API key.`

**Testimonials**

1.  
`“OpenModels makes open-source model access predictable. We can compare prices, top up credits, and route requests with one API key.”`  
`AI application team · Production inference`

2.  
`“The biggest value is transparency. We know the token price, supply status, and verified route before sending traffic.”`  
`Developer tools team · Model API integration`

3.  
`“We moved away from unstable proxy routes and started using verified open-source token supply with clearer billing.”`  
`Agent startup · Open-source LLM usage`

**视觉**
- 3 个轻量 quote cards
- 白底、细边框
- 不使用虚假 logo
- 不要营销感

---

## 6. Supply Network Section

**Section Label**
`SUPPLY NETWORK`

**Title**
`Verified supply behind every token`

**Description**
`OpenModels works with verified open-source model supply routes so developers can buy tokens with clearer pricing, availability, and routing confidence.`

**三列**
1. `Verified routes`  
   `Supply routes are checked and labeled so buyers know what they are using.`

2. `Live availability`  
   `Model availability and route status are monitored before production traffic.`

3. `Transparent pricing`  
   `Input and output token prices are shown clearly before purchase.`

**目的**
表达 OpenModels 不是 proxy chain，而是 verified supply network。

---

## 7. Why OpenModels

**Section Label**
`WHY OPENMODELS`

**Title**
`Buy tokens without proxy-chain uncertainty`

**Description**
`OpenModels gives developers a clearer way to buy and use open-source model tokens: verified supply, transparent pricing, prepaid credits, and one API key.`

**对比表列**
- OpenModels
- Generic proxy
- Single provider

**对比字段**
- Supply source
- Pricing
- Availability
- Billing
- API access
- Data policy

---

## 8. Pricing / Plans

**Section Label**
`PRICING`

**Title**
`Transparent token pricing with prepaid credits`

**Description**
`Buy credits once and use them across verified open-source model supply. Monthly plans include bonus credits for consistent usage.`

**内容点**
- One-time credits：1:1 top-up
- Monthly plans：bonus credits
- Crypto payments：USDC support
- Volume pricing：for larger usage

**Plans**
- Starter：`$20/mo → $22 credits`
- Builder：`$100/mo → $115 credits`
- Scale：`$200/mo → $240 credits`
- Enterprise：`Custom`

不要使用 `unlimited`。

---

## 9. Quickstart

**Section Label**
`QUICKSTART`

**Title**
`One API key for verified open-source models`

**Description**
`OpenModels is OpenAI-compatible. Change the base URL, choose a model, and start routing requests through verified supply.`

**Steps**
1. Add credits
2. Create an API key
3. Call any verified model

**Code Base URL**
`https://api.alephant.io/v1`

小字：
`Powered by alephant.io`

---

## 10. FAQ

FAQ 需要围绕购买和信任。

必须包含：
- What is OpenModels?
- Is OpenModels a proxy service?
- What does verified direct supply mean?
- How is pricing calculated?
- How do credits work?
- Can I pay with crypto?
- How is this different from OpenRouter?
- What base URL should I use?
- Does OpenModels store prompts?
- Can teams use OpenModels?

---

## 11. Footer

**分组**
Product：
- Models
- Pricing
- Plans
- Docs

Marketplace：
- Supply Network
- Direct Supply
- Token Pricing

Company：
- About
- Contact

Legal：
- Terms
- Privacy
- Data Policy

底部文案：
`OpenModels is operated by Alephant AI LLC. Powered by alephant.io.`

---

## 12. 全局视觉要求

**风格参考**
Vercel / Stripe / OpenRouter，但保持 OpenModels 自己的黑白蓝系统。

**颜色**
- Background：`#FAFAFA`
- Card：`#FFFFFF`
- Text：`#0A0A0A`
- Secondary text：`#666666`
- Muted text：`#A3A3A3`
- Border：`#E5E5E5`
- Blue：`#0047FF`
- Green：`#12B76A`
- CTA black：`#111111`

**字体**
- Sans：Geist Sans
- Mono：Geist Mono
- 价格、模型 ID、API endpoint 使用 Mono
- 普通标题和正文使用 Sans

**组件**
- Badge：小胶囊，`11px`
- 表头：`11px uppercase`
- 正文：`13-14px`
- 按钮：`13px`
- 卡片：白底、细边框、`8px` 圆角以内
- 不要大面积渐变和营销式插画

**最终效果**
首页需要同时做到：
- 一眼知道可以买 open-source LLM tokens
- 明确价格便宜、透明、直供
- 看起来像 marketplace
- 有团队反馈增强可信度
- 能区分普通 proxy / 中转站
- 看起来像长期的 inference supply 交易基础设施