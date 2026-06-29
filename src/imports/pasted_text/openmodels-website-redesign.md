**OpenModels 官网 Figma 执行需求**

**项目目标**  
在不改变当前网站信息架构和页面布局的前提下，提升官网的高级感、科技感、可信任感，并更明确传递 OpenModels 的核心定位：

OpenModels 是 open-source model token marketplace。  
核心卖点是：**最低价、直供 tokens、不是中转站、不是 sub2api 式代理链路、一个 API key 调用多个开源模型。**

---

**一、设计原则**

1. **不改变当前结构**
   - Header、Hero 左右分栏、右侧模型价格表 + API 示例、Marketplace、Why OpenModels、Calculator、API Section、Status、FAQ 等模块结构保持不变。
   - 只优化视觉层级、文案表达、组件质感、信任信号和 CTA 一致性。

2. **全站 CTA 统一**
   - 所有主 CTA 统一为：`Get API key`
   - 不再出现 `Buy access`、`Buy key`、`Claim offer` 作为主按钮文案。
   - Marketplace 表格行按钮可以使用：
     - `Get key`
     - 或 `Use with key`
   - 但主按钮必须统一为 `Get API key`。

3. **促销活动要增强，不是弱化**
   - Header / Hero 中的 “deposit $10, get $10 free credits” 活动需要更有曝光度。
   - 但视觉不能像低价优惠券，要做成“平台启动激励 / developer credit campaign”的感觉。
   - 活动表达应高级、克制、可信。

4. **强化最低价 + 直供**
   - 页面首屏必须让用户第一眼理解：
     - OpenModels 是卖 open-source model tokens 的 marketplace。
     - 价格低。
     - token 供应是 direct supply。
     - 不是 proxy chain。
     - 一个 API key 即可使用。

---

**二、视觉方向**

参考当前 opencode 风格结构，但视觉质感升级为更精密的 developer infrastructure 风格。

关键词：

- precise
- technical
- premium
- verified
- low-noise
- infrastructure-grade
- direct-supply marketplace
- developer trust

视觉上避免：

- 过多字号
- 促销感太强
- 蓝色大面积滥用
- 过度 marketing hero
- 卡片堆叠
- 圆角过大
- 低质表格样式
- 过多 badge 和小标签造成杂乱

建议使用：

- 黑白灰为主
- 蓝色只作为 trust / active / data highlight
- 绿色只用于 live / verified / supply status
- 更细的边框
- 更统一的 spacing
- 更像交易终端 / API 控制台 / cloud infra pricing page

---

**三、Typography 要求**

控制为 2 个主要字号体系：

1. **Display / Hero**
   - 用于 H1、大数字、核心价格数字。
   - Hero H1 可以保留大字号，但只在首屏使用。
   - 字重强，但行距更紧凑、字距不要负值。

2. **Base / Interface**
   - 用于导航、表格、按钮、说明文案、标签、状态、代码。
   - 表格、badge、描述、小标题尽量统一到同一字号。
   - 不要在一个页面里同时出现 12 / 13 / 14 / 15 / 16 / 18 多套字号。

允许例外：

- Section title 可以比 base 稍大，但必须统一。
- Code block 使用 monospace，可独立处理。

---

**四、Header 需求**

当前结构不变，但提升信任和活动曝光。

Header 内容建议：

左侧：
- OpenModels logo

中间：
- Models
- Pricing
- Docs
- Status
- Enterprise

右侧：
- Sign in
- `Get API key`

Header 下方保留活动条，但改成更高级的 system notice：

推荐文案：

`Launch credit: deposit $10, get $10 bonus credits · Direct-supply open model tokens`

右侧链接：

`Get API key →`

视觉要求：

- 不要像促销 banner。
- 更像 developer console 的 system announcement。
- 黑色 `NEW` 或 `LAUNCH` 小标签可以保留。
- 活动条需要比现在更清晰，但不要抢过 Hero H1。

---

**五、Hero 需求**

Hero 当前左右布局不变。

左侧内容优化方向：

Eyebrow：

`Direct supply · Lowest listed prices · No proxy chains`

H1：

`Lowest-price direct access to open-source model tokens`

Subtitle：

`Buy verified open-source model tokens through direct supply. One API key, transparent pricing, no opaque proxy chains.`

主 CTA：

`Get API key`

次 CTA：

`View models`

Hero 中的活动表达保留并增强，但不要做成单独大卡。建议放在 CTA 下方或 stats 上方：

`Launch credit: deposit $10, get $10 bonus credits on your first deposit.`

Stats 建议：

- `18+ verified models`
- `$0.04 / 1M from`
- `0 proxy chains`
- `99.9% tracked uptime`

注意：如果只能放 3 个 stats，优先保留：

- `Lowest price from $0.04 / 1M`
- `0 proxy chains`
- `99.9% uptime`

---

**六、Hero 右侧模块**

当前价格表 + API 示例结构保留，但需要更像可信的 marketplace terminal。

右侧应表达：

- model pricing is live
- supply is direct / verified
- endpoint is OpenAI-compatible
- API key ready to use

建议右侧模块包含：

顶部小卡：

`API key`
`om_live_••••••••`
`Ready to use`

信息行：

- `Supply: Direct / Verified`
- `Routing: No proxy chains`
- `Credits: $100 available`
- `Endpoint: api.openmodels.com/v1`

价格表列建议：

- Model
- Input
- Output
- Supply
- Status

状态用词：

- `Direct`
- `Verified`
- `Live`
- `Limited`

视觉要求：

- 表格线条更细。
- 表头灰度更轻。
- 数字对齐清晰。
- 代码区不要太灰，要像真实 API console。
- 蓝色只用于 key highlight 或 active tab，不要过度。

---

**七、Marketplace Section**

当前结构不变，但文案更明确 marketplace 属性。

Section label：

`MARKETPLACE`

Title：

`Shop tokens by model`

Subtitle：

`Compare direct-supply token prices, model availability, context length, and use case before you buy.`

表格列建议：

- Model ID
- Provider
- Input / 1M
- Output / 1M
- Context
- Use case
- Supply
- Availability
- CTA

行 CTA：

`Get key`

不要使用 `Buy access`，避免和全站 CTA 冲突。

---

**八、Why OpenModels Section**

这个模块需要成为“信任解释区”，重点解释为什么便宜、为什么可信。

建议卡片方向：

1. **Direct supply**
   - `Tokens come from verified supply paths, not opaque reseller chains.`

2. **Lowest listed prices**
   - `Compare model token prices before you route traffic.`

3. **No proxy chains**
   - `No sub2api-style hidden routing or unstable shared keys.`

4. **One API key**
   - `Use one OpenAI-compatible key across supported open-source models.`

视觉要求：

- 不要做过度营销卡片。
- 更像 infra product 的 trust checklist。
- 每个点要短、硬、可信。

---

**九、Calculator Section**

当前成本计算器保留，但设计上改成“价格证明模块”。

Title：

`See the price difference before you route traffic`

Subtitle：

`Estimate monthly token cost across OpenModels and other providers.`

视觉要求：

- 数字区域更精致。
- 差价高亮要克制。
- 不要像 SaaS ROI 营销组件。
- 输入控件和结果区域保持清晰、工具感强。

---

**十、API Section**

CTA 文案统一：

`Get API key`

Section 重点表达：

- OpenAI-compatible API
- one key
- direct-supply routing
- transparent pricing

推荐文案：

`Use one OpenAI-compatible API key to access verified open-source model tokens through direct supply.`

按钮样式：

- 主 CTA 使用黑色按钮。
- 蓝色只作为链接或 active accent。
- 避免这个区域突然变成蓝色主视觉，破坏一致性。

---

**十一、Status Section**

这个模块需要承担“可信任”的证据，而不是普通 status list。

需要强调：

- Live model availability
- Verified supply
- Uptime monitoring
- Route transparency

文案方向：

`Track model availability, supply status, and uptime before routing production traffic.`

视觉要求：

- 像 infrastructure status dashboard。
- 绿色只表达 live / healthy。
- 不要过多彩色标签。

---

**十二、Dashboard / App 内部一致性**

不只官网，系统内部也要统一。

需要审计并同步以下页面：

- Auth / Sign in
- Dashboard
- API Keys
- Credits
- Models
- Usage
- Quickstart
- Referral
- Settings

统一要求：

1. 主 CTA 统一为 `Get API key`
2. 充值相关 CTA 可用：
   - `Add credits`
   - `Deposit credits`
3. 免费活动统一表达：
   - `Deposit $10, get $10 bonus credits`
4. Referral `$5` 如果保留，要和 `$10 bonus credits` 区分清楚，避免用户觉得规则混乱。
5. Dashboard 中也要出现轻量信任信号：
   - `Direct supply`
   - `No proxy chains`
   - `Transparent pricing`
   - `Verified model supply`

---

**十三、活动表达规范**

当前活动不是删除，而是升级为更可信的 campaign。

统一活动名建议：

`Launch Credit`

统一文案：

`Deposit $10, get $10 bonus credits on your first deposit.`

短版：

`$10 bonus credits on first deposit`

避免：

- `free free free`
- `claim now`
- `limited deal`
- `cheap`
- `discount`

可以使用：

- `Launch credit`
- `Developer credits`
- `First-deposit bonus`
- `Bonus credits`

---

**十四、设计交付物**

请 Figma 输出以下内容：

1. **Homepage Desktop**
   - 1440px 宽
   - 保持当前页面结构
   - 完整首屏 + marketplace + trust sections

2. **Homepage Mobile**
   - 390px 宽
   - 确保 Hero、表格、CTA 不拥挤
   - 活动条在移动端要清晰但不能压迫首屏

3. **Dashboard 样式抽样**
   - Dashboard home
   - API Keys page
   - Credits page
   - Models page

4. **Design System Tokens**
   - Color tokens
   - Typography tokens
   - Border / radius / shadow
   - Button styles
   - Badge styles
   - Table styles
   - Code block styles

5. **Component Variants**
   - Primary button: `Get API key`
   - Secondary button
   - Text link
   - Status badge: Live / Limited / Direct / Verified
   - Campaign banner
   - Model price row
   - API key card
   - Pricing table

---

**十五、最终验收标准**

设计完成后需要满足：

- 首屏 3 秒内能理解：OpenModels 是卖 open-source model tokens 的 marketplace。
- 明确感知：最低价、直供、不是中转站。
- 全站主 CTA 统一为 `Get API key`。
- 活动曝光增强，但不廉价。
- 字号体系明显减少，页面更干净。
- 官网和 Dashboard 视觉一致。
- 表格、代码、状态、价格都有 developer infrastructure 的可信感。
- 不改变当前网站结构，只做视觉、文案和组件系统升级。