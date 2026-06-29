## Figma 需求：Model Detail 页面专业化升级

目标：优化 OpenModels 模型详情页，让页面更像 OpenRouter / Vercel 风格的 developer marketplace 详情页。重点提升字体层级、Provider routes 比价区、section header、sticky nav、pricing summary 和 code example 的专业感。

---

# 1. 全局字体调整

当前问题：
- `PROVIDER ROUTES / API ENDPOINTS / TOKEN PRICING` 这类大写标题太粗、太大、太像后台模板。
- 表格里价格、provider、badge 的层级不清。
- 详情页缺少视觉锚点，用户扫读成本高。

**统一字体规范**

页面正文：
- Font：Geist Sans
- Size：`13px`
- Line height：`20px`
- Weight：`400`

Section label：
- Font：Geist Sans
- Size：`11px`
- Line height：`16px`
- Weight：`600`
- Letter spacing：`0.04em`
- Color：`#9A9A9A`
- Uppercase 保留，但要更轻、更小

Model title：
- Font：Geist Mono
- Size：`20px`
- Line height：`28px`
- Weight：`650`
- Letter spacing：`0`
- 不要负字距

Provider / model id / price：
- Font：Geist Mono
- Size：`13px`
- Line height：`20px`
- Weight：价格用 `600`，普通值用 `400-500`

Badge：
- Font：Geist Sans
- Size：`10px`
- Line height：`14px`
- Weight：`500`
- Height：`22px`
- Padding：`6-8px`
- 圆角：`999px`

---

# 2. Section Header 样式重做

当前 section header 是灰底大条，显得笨重。

**改为更轻的 Vercel 风格**

每个 section header：
- 背景：`#FAFAFA`
- Border bottom：`1px #EAEAEA`
- Padding：`10px 24px`
- Label：`11px / 600 / #9A9A9A`
- Letter spacing：`0.04em`
- 不要红框中那种大块粗标题感

示例：
`PROVIDER ROUTES` 应该看起来像轻量分区 label，而不是一个大标题。

---

# 3. 顶部 Overview 区升级

**结构**
- Breadcrumb
- Model title
- Tags / status / supply
- Description
- CTA buttons

**建议补充**
Overview 右侧加一个小型 `Route mode` 状态：

`Default route: lowest available price`

样式：
- 小卡片或 inline badge
- 背景：`#F5F8FF`
- 边框：`#DCE6FF`
- 文案：`12px`
- 蓝色小点

这样用户一进入详情页就知道：默认走最低价 route。

---

# 4. Sticky 快捷导航优化

当前有：
`Providers / Pricing / Endpoints / Specs / Examples / Supply / Related`

保留，但样式精细化：

- 高度：`44px`
- Sticky 在 header 下方
- 背景：`rgba(255,255,255,0.92)`
- Backdrop blur
- Border bottom：`#EAEAEA`
- 字号：`13px`
- 默认颜色：`#777`
- Active：`#111`
- Active 下划线：`2px #0047FF`
- 移动端横向滚动

建议顺序：
- Providers
- Pricing
- Endpoints
- Specs
- Examples
- Supply
- Related

---

# 5. Provider Routes 模块优化

这是模型详情页最核心模块，要做得像真正 marketplace 比价表。

## Section title

`PROVIDER ROUTES`

## Description

改短一点：

`Compare live provider routes for this model. OpenModels uses the lowest available price by default.`

不要太长，避免压住表格。

## 表格字段

建议字段：
- Provider
- Input / 1M
- Output / 1M
- Latency
- Availability
- Supply
- Route
- Action

## 列宽建议

- Provider：`16%`
- Input：`12%`
- Output：`12%`
- Latency：`12%`
- Availability：`14%`
- Supply：`14%`
- Route：`12%`
- Action：`8%`

## 表格样式

- 表头背景：`#F5F5F5`
- 表头字号：`11px`
- 表头字重：`600`
- 表头颜色：`#A3A3A3`
- 行高：`48px`
- 行 hover：`#FAFAFA`
- Selected row：`#F5F8FF`
- Selected row 左侧加 `2px #0047FF` 竖线
- 不要整行蓝底太重，保持轻量

## Provider 行内容

Provider 名称：
- `13px / 600 / #111`

价格：
- Geist Mono
- `13px / 600`
- 当前最低价可以加 `Lowest price` badge

Latency：
- `13px / Geist Mono / #666`

Availability：
- `Live` badge

Supply：
- `Verified / Direct` badge

Route：
- `Lowest price`
- `Recommended`
- `Auto eligible`
- `Selected`

Action：
- 未选中：`Select`
- 选中：`Selected`
- 按钮高度：`28px`
- 选中按钮可变成浅蓝底

---

# 6. Selected Route Summary

当前 `Selected route: Mistral` 太弱，像普通文字。

改成 provider routes 表格下方的 summary strip。

**样式**
- 背景：`#FAFAFA`
- Border top：`1px #EAEAEA`
- Padding：`12px 24px`
- 一行展示

**内容**
`Selected route: Mistral · $0.04 input · $0.08 output · Direct supply`

右侧：
`Change route in code example`

或：
`Route provider: mistral`

---

# 7. Pricing Summary Cells

当前 Input / Output / Context 看起来还可以，但可以更专业。

**字段**
- Input
- Output
- Context
- Selected route

如果空间允许，把 `Selected route` 加进去，替代 Supply。

**样式**
- 4列均分
- Label：`11px / #A3A3A3`
- Value：`13px / 600`
- Price：Geist Mono
- 边框：`#EAEAEA`
- Padding：`16px 20px`

示例：
- Input：`$0.04 / 1M tokens`
- Output：`$0.08 / 1M tokens`
- Context：`32K`
- Route：`Mistral`

---

# 8. API Endpoints 模块

当前 endpoint box 太空，只有一行，信息感不足。

建议改成两列小表：

字段：
- Protocol
- Endpoint
- Method

示例：
- OpenAI
- `/v1/chat/completions`
- POST

如果只有一个 endpoint，也保持表格样式，显得更稳定。

Action：
- 右侧 copy icon
- hover 显示 `Copy endpoint`

---

# 9. Token Pricing 模块

如果已经有 provider routes，Token pricing 应该表达当前 selected route 的价格。

Section description 增加一句：

`Prices shown for selected route: Mistral`

表格字段：
- Tier
- Billing
- Input / 1M
- Output / 1M
- Cache write / 1M
- Cache read / 1M

价格字体保持 Geist Mono。

---

# 10. Model Specs 模块

Model specs 建议改成更紧凑的 definition list。

字段：
- Context window
- Max output
- Features
- Release date
- Provider
- Use cases

样式：
- Label column：`180px`
- Value column：剩余空间
- 行高：`40px`
- Border bottom：`#F0F0F0`
- Label：`13px #777`
- Value：`13px #111`

如果 provider routes 多 provider，`Provider` 字段不应该只显示一个 provider。改为：
`Available through 2 providers`

---

# 11. Code Example / Use this model

这个模块要和 provider route 联动。

顶部加 Route selector：

`Route: Auto · lowest available price`

Dropdown options：
- Auto · lowest available price
- Groq
- Mistral

Auto 代码：

```json
{
  "model": "mistral-7b",
  "messages": [...]
}
```

选择 Mistral 后：

```json
{
  "model": "mistral-7b",
  "route": {
    "provider": "mistral"
  },
  "messages": [...]
}
```

旁边小字：
`If no provider is specified, OpenModels uses the lowest available live price route by default.`

---

# 12. Supply Path 模块

现在 Supply path 是说明文本，可以增强信任。

增加 3 个小点：
- `Provider routes checked`
- `Prices monitored`
- `No proxy chains`

样式：
- 小 badge / checklist
- 不要大卡片

---

# 13. Related Models

Related model card 增加 route count：

- Model name
- Input / Output
- `2 routes`
- Status

这样保持多 provider 心智一致。

---

# 14. 页面整体顺序

最终顺序建议：

1. Breadcrumb
2. Overview
3. Sticky section nav
4. Provider routes
5. Pricing summary
6. API endpoints
7. Token pricing
8. Model specs
9. Use this model
10. Supply path
11. Related models
12. Footer actions

---

# 15. 视觉对标 OpenRouter 的重点

不是照搬 OpenRouter，而是学习这些点：

- 模型详情页信息要密集但清晰
- provider / price / context / endpoint 要一眼可比
- CTA 不要太多
- code example 要靠后，但要和 route selector 强关联
- 价格与供应状态是核心视觉资产
- 所有技术字段用 mono
- 状态和 route 用小 badge
- section header 要轻，不要大块灰条

---

# 16. 最终效果

页面完成后应该做到：

- 一眼看到这个模型有哪些 provider routes
- 默认路线是最低可用价格
- 用户能比较价格、延迟、供应类型
- 用户能快速选择 provider
- 代码示例自动反映 route 选择
- 页面不像普通文档页，而像模型 token marketplace 的商品详情页
- 字体更小、更轻、更专业，不再粗笨。