**Figma 需求：OpenModels 官网专业度优化**

**目标**  
在不改变当前官网整体结构和视觉风格的基础上，进一步提升 OpenModels 的专业感、可信度和转化效率。整体继续保持白底、细线框、developer infrastructure 风格，参考 OpenRouter 的信息清晰度，但保留 OpenModels 自己的 marketplace 定位。

---

**一、Header 优化**

当前 Header 保留：

`Models / Pricing / Plans / Docs / Enterprise`

导航行为调整：

- `Models` → `#models`
- `Pricing` → `#models`
- `Plans` → `#plans`
- `Docs` → `#api`
- `Enterprise` → `#enterprise`

右侧 CTA 保持：

`Get API key`

不要新增 `Status`。

---

**二、Launch Banner 优化**

当前顶部 banner 促销感偏强，需要改成系统通知风格。

文案改为：

`Launch Credit: deposit $10, get $10 bonus credits · Direct-supply open model tokens`

CTA 改为：

`Get API key →`

视觉要求：
- 不要大面积紫蓝渐变
- 不要像 coupon
- 使用黑 / 深灰 / 白色为主
- 可保留小面积蓝色 highlight
- 高度保持 32-36px
- 像 developer system notice，而不是广告条

---

**三、Hero 保持当前结构，仅微调**

Hero 核心信息保持：

`Lowest-price direct access to open-source model tokens`

Subtitle：

`Buy verified open-source model tokens through direct supply. One API key, transparent pricing, no opaque proxy chains.`

Hero 右侧 terminal 保持，但增强专业感：

- 明确显示 `OpenAI-compatible`
- 显示 Base URL：`https://api.alephant.io/v1`
- 显示小字：`Powered by alephant.io`
- 支持 `Copy base URL`
- 保持 API key / credits / direct supply 信息

---

**四、Marketplace 优化**

Marketplace 是官网核心模块，需要更像实时 token market data。

标题建议：

`Shop open-source model tokens by price`

Subtitle：

`Compare direct-supply token prices, model availability, context length, and use case before you buy.`

状态行改为：

`● 88 live routes · 0 limited · prices updated 2m ago`

布局建议：
- 状态行放在 title / subtitle 下方
- `prices updated 2m ago` 可放右侧
- 表格仍保留：
  - Model
  - Provider
  - Input / 1M
  - Output / 1M
  - Context
  - Supply
  - Status

表格要求：
- 价格数字优先级最高
- badge 不要太大
- `Live` 不要撑满列宽
- 点击模型进入 model detail page

---

**五、Plans 文案优化**

Plans 继续放在 Marketplace 之后。

保留四档：

- Starter `$20/mo` → `$22 credits`
- Builder `$100/mo` → `$115 credits`
- Scale `$200/mo` → `$240 credits`
- Enterprise `Custom`

Section subtitle：

`Subscribe monthly and receive credits to spend across verified open-source model tokens. Usage is still billed transparently per token.`

底部说明改为：

`One-time top-ups are 1:1 and do not expire. Monthly plans renew automatically and include bonus credits each billing cycle.`

如果 monthly plan credits 有 30 天 rollover，则写：

`Monthly plan credits roll over for 30 days.`

不要模糊表达。

CTA：
- Starter / Builder / Scale：`Start plan`
- Enterprise：`Contact sales`

---

**六、Why OpenModels 优化**

这个模块要强化 OpenModels 和 routers / proxy chains 的区别。

Title：

`Direct token access, not proxy chains`

Subtitle：

`OpenModels is built for low-cost open-source model tokens with verified supply paths, transparent pricing, and one API key.`

对比表保留：

| Category | OpenModels | Model routers | Proxy chains |
|---|---|---|---|
| Focus | Open-source model tokens | Broad model routing | Shared / converted access |
| Supply | Verified direct supply | Provider-dependent | Opaque |
| Pricing | Transparent token pricing | Markup varies | Often unclear |
| Reliability | Production-oriented | Route-dependent | Unstable |
| Best for | Low-cost open-source tokens | Testing many providers | Short-term experiments |

视觉要求：
- 不要做营销卡片
- 像 infrastructure comparison table
- OpenModels 列可以轻微高亮
- 不要攻击竞品，语气保持客观

---

**七、API / Quickstart Section 优化**

API Section 需要更像开发者 quickstart。

标题：

`OpenAI-compatible API quickstart`

Subtitle：

`Add credits, create an API key, and call any supported model with your existing OpenAI SDK flow.`

三步：

1. `Add credits`
2. `Create an API key`
3. `Call any supported model`

Code block：

```bash
curl https://api.alephant.io/v1/chat/completions \
  -H "Authorization: Bearer $OM_API_KEY" \
  -d '{"model":"qwen-2.5-72b","messages":[...]}'
```

底部：

`Base URL  https://api.alephant.io/v1`

右侧：

`Powered by alephant.io`

Integrations row：

`Works with OpenAI SDK · Vercel AI SDK · LangChain · LlamaIndex`

视觉要求：
- 代码块不要过高
- 黑色代码区不要压迫页面
- Base URL 信息紧贴代码块底部
- 保持 tabs：curl / python / node
- Copy 按钮清晰

---

**八、Footer 优化**

Footer 中如果没有独立 Status 页面，删除 `Status` 链接。

Footer Product 建议：

`Models / Pricing / Plans / Docs`

或：

`Models / Pricing / Plans / API Docs`

不要保留空链接。

---

**九、全站 Base URL 统一**

所有出现 API URL 的地方统一为：

`https://api.alephant.io/v1`

所有附近小字统一：

`Powered by alephant.io`

需要覆盖：
- Hero
- API Section
- Model Detail
- Dashboard Quickstart
- API Keys 页面
- Auth Page
- Models drawer / playground
- FAQ
- Docs

---

**十、FAQ 更新**

FAQ 保留 12 个问题，但需要增加 / 确保包含：

`Can I use OpenModels without a monthly plan?`

回答：

`Yes. One-time top-ups are available at 1:1 credit value. Monthly credit plans are optional and include bonus credits.`

FAQ 中避免：
- `no monthly subscription`
- `api.openmodels.com`
- `unlimited usage`

---

**十一、视觉原则**

整体保持：
- 白底
- 细线框
- 黑白灰为主
- 蓝色用于链接 / active / CTA
- 绿色用于 Live / Verified
- 12 / 14 字号体系
- 无大圆角
- 无厚阴影
- 无大面积渐变
- 无 Web3 / crypto 风格

**验收标准**
- Header 导航没有空锚点
- Banner 不再像促销广告
- Marketplace 更像实时 token marketplace
- Plans 规则清楚，不让用户误解为 unlimited subscription
- Why OpenModels 清楚解释和 routers / proxy chains 的区别
- API Section 像真实 quickstart
- 全站 Base URL 统一为 `api.alephant.io/v1`
- 官网整体更像专业 developer infrastructure 产品