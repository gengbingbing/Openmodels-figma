明白，不做左侧 nav，也不改成 tab。继续保持当前纵向信息结构，但要把“信息墙”变成 **清晰的纵向商品详情页**。

核心思路：**不是减少信息，而是重新组织视觉节奏。**

## 主要问题

现在 Model Detail 看起来密集，主要不是因为内容太多，而是因为：

- 每个 section 都是同样重量的灰色标题条
- Provider routes、Pricing、Endpoints、Specs、Examples 都连续堆叠，没有主次
- 表格和 summary cells 太贴近，缺少呼吸感
- Section label 太像后台字段，不像产品详情页标题
- 页面宽度偏窄，provider routes 表格天然拥挤
- Selected route 信息像一行普通文字，没有形成清晰状态

## 最终方案：纵向分组 + 主次层级

保持当前结构，但改成 4 个视觉分组：

1. **Model Overview**
2. **Route & Pricing**
3. **Integration**
4. **Details & Trust**

不需要左侧 nav，也不需要 tab，只是在视觉上形成分组。

---

# Figma 需求：Model Detail 清晰化升级

## 1. 页面宽度

当前 `960px` 对 provider routes 太窄。

建议：
- 页面最大宽度：`1120px`
- 内容左右 padding：`32px`
- 移动端保持单列

这样 provider routes 表格不会挤。

---

## 2. Overview 区

顶部保持模型介绍，但要更像 OpenRouter 的清晰摘要。

**结构**
- Model name
- Model ID + copy
- Tags / status / supply
- Description，最多 2 行
- `Show more`
- 右侧 CTA：`Get API key` / `View docs`

**Summary cards 放在 Overview 下方**
一行 4 个：

- Input / 1M
- Output / 1M
- Context
- Routes

示例：
- `$0.04`
- `$0.08`
- `32K`
- `2 providers`

这组卡片应该在 Provider routes 之前，让用户先获得摘要。

---

## 3. Section Header 改轻

不要再用很重的灰色大条。

每个 section header 改成：

- 背景：`#FFFFFF`
- Padding：`24px 0 12px`
- Title：`15px / 22px / 600 / #111`
- Description：`13px / 20px / #666`
- 下方内容再用 card/table 承载

例如：

**Provider routes**  
`Compare live providers offering this model. OpenModels uses the lowest available price by default.`

不要只显示 `PROVIDER ROUTES` 这种灰条。

---

## 4. Provider Routes 作为主模块

Provider routes 是详情页最重要模块，需要变成页面视觉中心。

**位置**
Overview + Summary cards 下方。

**模块样式**
- 整体白色 card
- Border：`#E5E5E5`
- Radius：`8px`
- Header 区：标题 + 描述 + route mode
- Table 放在 card 内

**Header 左侧**
Title：
`Provider routes`

Description：
`Compare providers offering this model. Lowest available price is used by default.`

**Header 右侧**
Route mode chip：
`Auto · lowest available price`

样式：
- 浅蓝底
- 蓝色小点
- `12px`

**表格字段**
- Provider
- Input / 1M
- Output / 1M
- Latency
- Availability
- Supply
- Route
- Action

**表格样式**
- Header：`12px / 500 / #888`
- Row height：`48px`
- Row border：`#EFEFEF`
- Selected row：不要整行蓝底太重
  - 左侧 `2px #0047FF`
  - 背景 `#F8FAFF`
- 价格用 Geist Mono
- Badge 用 `10px`

---

## 5. Selected Route Summary 改成状态条

当前 `Selected route: Mistral` 太弱。

改成 Provider routes card 底部状态条：

`Selected route: Mistral · $0.04 input · $0.08 output · Direct supply`

右侧：
`Used in code examples`

样式：
- 背景：`#FAFAFA`
- Border top：`#EAEAEA`
- Padding：`12px 20px`
- 字号：`13px`
- 关键值用 mono

这样用户清楚知道“我选了哪个 provider”。

---

## 6. Pricing Summary 不要紧贴 Provider 表

当前 provider routes 后面马上接 Input / Output / Context，视觉重复。

建议：
- 如果顶部已经有 summary cards，下面的 Pricing summary 可以删除或改成 `Selected route pricing`
- 放在 Token Pricing section 里，而不是单独夹在中间

更推荐：

Provider routes 后面直接进入：

`API endpoints`

价格详情放到：

`Token pricing`

这样结构更顺：
- 先选 provider
- 再看如何调用
- 再看详细价格

---

## 7. API Endpoints 做成轻量表格

当前 endpoint box 太空。

改成 card 表格：

字段：
- Protocol
- Endpoint
- Method
- Action

示例：
`OpenAI | /v1/chat/completions | POST | Copy`

样式：
- card border
- row height `44px`
- endpoint 用 Geist Mono
- copy icon 放最右

---

## 8. Token Pricing 延后并解释清楚

Token Pricing 不要紧贴 Provider routes，否则像重复价格。

Section title：
`Token pricing`

Description：
`Prices shown for selected route: Mistral.`

表格保留：
- Tier
- Billing
- Input / 1M
- Output / 1M
- Cache write
- Cache read

表格视觉比 Provider routes 更轻，不要抢主模块。

---

## 9. Model Specs 改成两列 definition list

不要让 specs 像另一张重表格。

样式：
- 白色 card
- 每行 `Label / Value`
- Label 宽 `180px`
- Row height `40px`
- Label：`13px #777`
- Value：`13px #111`

字段：
- Context window
- Max output
- Features
- Release date
- Providers
- Use cases

其中 `Providers` 写：
`2 providers available`

---

## 10. Use This Model 放在 Details 后

Code example 信息量很大，建议不要太靠前。

顺序建议：

1. Overview
2. Summary cards
3. Provider routes
4. API endpoints
5. Token pricing
6. Model specs
7. Use this model
8. Supply path
9. Related models

这样用户先完成“选 provider + 看 endpoint”，再看完整代码。

---

## 11. Code Example 降低视觉重量

代码块不要太高，默认展示 curl。

- 默认高度控制在 `220-260px`
- tab：curl / python / node
- 顶部增加 Route selector：
  `Route: Auto · lowest available price`
- 如果选择 provider，代码里显示 `route.provider`

说明：
`If no provider is specified, OpenModels uses the lowest available live price route by default.`

---

## 12. Related Models 做成横向轻卡

Related 放最后，视觉要轻。

每张卡：
- Model ID
- Input / Output
- Routes count
- Status

不要大段描述。

---

# 字体系统

减少字号数量：

- Page title：`20px`
- Section title：`15px`
- Body：`13px`
- Table：`13px`
- Table header：`12px`
- Meta / badge：`10-11px`
- Code：`12px`

不要：
- 大量 uppercase section bar
- 大量 `700`
- 负字距
- 每个模块都同样粗

---

# 最终页面结构

保留纵向结构，但视觉上变成：

**Overview**
- model title
- description
- CTA

**Summary**
- input / output / context / routes

**Route & Pricing**
- Provider routes card
- selected route summary
- token pricing

**Integration**
- API endpoints
- use this model

**Details**
- model specs
- supply path
- related models

---

# 最重要的判断

不要把所有 section 都设计成同样重量。  
Model Detail 里只有一个主角：**Provider routes**。

其他内容都要降级：
- Endpoints 是辅助
- Token pricing 是详情
- Specs 是参数
- Code 是集成
- Supply 是信任说明
- Related 是最后的探索

这样即使保持纵向页面，也会清晰很多。