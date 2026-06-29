## Figma 需求：OpenModels 多 Provider 模型市场升级

**目标**  
把 OpenModels 升级为真正的 multi-provider open-source LLM token marketplace：同一个模型可以由多个 provider 提供，不同 provider 有不同价格、延迟、可用性和供应等级。官网默认展示该模型当前可用的最低价格，但表头不写 `Best`，保持简洁。

核心表达：

> Same model. Multiple providers. Lowest available price by default.

---

# 1. 核心产品逻辑

当前逻辑是：

`一个模型 = 一个 provider = 一个价格`

升级为：

`一个模型 = 多个 provider routes = 多个价格`

例如：

`qwen-2.5-72b`

可以有：
- Alibaba route
- DeepInfra route
- Novita route

每个 route 有自己的：
- input price
- output price
- latency
- availability
- supply type
- status
- route id

默认逻辑：
- 官网模型表默认显示当前可用 route 中的最低价格
- 用户点击模型详情页后，可以查看所有 provider routes
- 默认 API 调用不指定 provider 时，OpenModels 自动使用最低可用价格 route
- 高级用户可以指定 provider

---

# 2. 首页 Hero 右侧模块

当前 Hero 右侧 `Live token prices` 需要升级成多 provider 视角。

**模块标题**
`Live token prices`

**副说明**
`Lowest available route shown by default`

**表格字段**
- Model
- Input / 1M
- Routes
- Status

不要写：
- `Best input`
- `Best output`

表格价格默认就是最低可用价格。

**示例**
| Model | Input / 1M | Routes | Status |
|---|---:|---|---|
| qwen-2.5-72b | $0.32 | 3 routes | Live |
| deepseek-v3 | $0.28 | 2 routes | Live |
| llama-3.1-70b | $0.38 | 4 routes | Live |

底部说明：
`Default route: lowest available live price`

保留：
`Base URL: api.alephant.io/v1`  
`Powered by alephant.io`

---

# 3. 首页 Marketplace 表格

首页 Marketplace 按 **Model 聚合展示**，不要展开所有 provider。

**Section Title**
`Compare open-source model prices across providers`

**Description**
`Each model can be supplied by multiple verified providers. OpenModels shows the lowest available token price by default, with full provider-route transparency on every model detail page.`

**表格字段**
- Model ID
- Input / 1M
- Output / 1M
- Context
- Routes
- Supply
- Status

不要使用：
- `Best input`
- `Best output`

价格字段含义：
- `Input / 1M` = 当前 live routes 中最低 input price
- `Output / 1M` = 当前 live routes 中最低 output price

**Routes 字段**
显示：
- `1 route`
- `2 routes`
- `3 routes`

点击模型进入详情页查看 provider routes。

**Supply 字段规则**
- 如果有 Direct route，显示 `Direct`
- 如果没有 Direct 但有 Verified route，显示 `Verified`
- 如果只有受限路线，显示 `Limited`

**Status 字段规则**
- 有 live route：`Live`
- 只有 limited route：`Limited`
- 没有可用 route：`Offline` / `Soon`

**示例**
| Model ID | Input / 1M | Output / 1M | Context | Routes | Supply | Status |
|---|---:|---:|---|---|---|---|
| qwen-2.5-72b | $0.32 | $0.58 | 128K | 3 routes | Verified | Live |
| deepseek-v3 | $0.28 | $0.55 | 128K | 2 routes | Direct | Live |
| llama-3.1-70b | $0.38 | $0.68 | 128K | 4 routes | Verified | Live |

---

# 4. Model Detail 页新增 Provider Routes

Model Detail 是多 provider 的核心页面。

**新增 section**
`Provider routes`

**位置**
放在 Overview 下方，Pricing summary 上方。

**Description**
`Compare providers offering this model. OpenModels uses the lowest available live price by default, but you can choose a specific provider route when needed.`

**表格字段**
- Provider
- Input / 1M
- Output / 1M
- Latency
- Availability
- Supply
- Route
- Action

**示例**
| Provider | Input / 1M | Output / 1M | Latency | Availability | Supply | Route | Action |
|---|---:|---:|---:|---|---|---|---|
| Novita | $0.32 | $0.58 | 780ms | Live | Verified | Lowest price | Select |
| Alibaba | $0.35 | $0.60 | 540ms | Live | Direct | Recommended | Select |
| DeepInfra | $0.38 | $0.68 | 620ms | Live | Verified | Auto eligible | Select |

**Badge**
- `Lowest price`
- `Recommended`
- `Lowest latency`
- `Direct`
- `Limited capacity`
- `Auto eligible`

---

# 5. Model Detail 快捷导航

由于详情页栏目很多，需要增加 sticky section nav。

**位置**
Overview 下方，Provider routes 上方。

**导航项**
- Overview
- Providers
- Pricing
- Endpoints
- Specs
- Examples
- Supply
- Related

**样式**
- 横向 tabs
- sticky
- 当前 section 蓝色下划线
- 移动端横向滚动

---

# 6. Provider Route 选择交互

默认选中：

`Auto · lowest available price`

在 Provider routes 表格中，用户可以点击某一行的 `Select`。

选中 provider 后：
- Pricing summary 更新为该 provider 价格
- Code example 更新 route 参数
- Provider routes 表格中该行显示 `Selected`
- Route note 显示当前选择：
  `Selected route: Alibaba`
- URL 可选更新：
  `?provider=alibaba`

---

# 7. API 调用方式

## 默认：不指定 provider

默认使用最低可用 live price route。

```json
{
  "model": "qwen-2.5-72b",
  "messages": [...]
}
```

说明文案：

`If no provider is specified, OpenModels uses the lowest available live price route by default.`

## 指定 provider

推荐方式：

```json
{
  "model": "qwen-2.5-72b",
  "route": {
    "provider": "alibaba"
  },
  "messages": [...]
}
```

## 指定策略

未来支持：

```json
{
  "model": "qwen-2.5-72b",
  "route": {
    "strategy": "lowest_price"
  },
  "messages": [...]
}
```

可选策略：
- `lowest_price`
- `lowest_latency`
- `direct_supply`
- `balanced`

## Route alias

高级 shortcut，可支持：

```json
{
  "model": "qwen-2.5-72b@alibaba",
  "messages": [...]
}
```

但 UI 主推荐使用 `route.provider`。

---

# 8. Code Example 升级

Model Detail 的 `Use this model` code example 增加 route selector。

**Selector**
`Route: Auto · lowest available price`

可切换：
- Auto · lowest available price
- Alibaba
- DeepInfra
- Novita

Auto 状态代码：

```json
{
  "model": "qwen-2.5-72b",
  "messages": [...]
}
```

选择 provider 后代码：

```json
{
  "model": "qwen-2.5-72b",
  "route": {
    "provider": "alibaba"
  },
  "messages": [...]
}
```

---

# 9. Dashboard Models 页面升级

产品内部 Models 页面也要体现多 provider。

**列表字段**
- Model
- Input / 1M
- Output / 1M
- Context
- Routes
- Status

价格默认显示最低可用价格。

点击模型后右侧 drawer 展示：
- Overview
- Provider routes
- Test playground
- Route preference

---

# 10. Dashboard Model Drawer

新增 `Provider routes` 区域。

字段：
- Provider
- Input
- Output
- Latency
- Supply
- Status
- Action

支持选择：
- Auto · lowest available price
- Specific provider

选择后 playground 使用该 provider route。

---

# 11. API Key Routing Policy

后续 API Key 页面支持默认路由策略。

**Routing policy card**
- Default strategy:
  - Lowest available price
  - Lowest latency
  - Balanced
  - Direct supply only

- Allowed providers:
  - All providers
  - Selected providers

- Fallback:
  - Enabled
  - Disabled

---

# 12. Usage / Billing 升级

Usage 需要显示实际使用的 provider。

字段：
- Timestamp
- Model
- Provider
- Route ID
- Input tokens
- Output tokens
- Input price
- Output price
- Total cost
- Routing mode

这样用户能看到：
- 使用了哪个 provider
- 价格是多少
- 为什么扣费

---

# 13. Route 状态定义

**Status**
- `Live`: 当前可用
- `Limited`: 容量有限
- `Offline`: 当前不可用
- `Coming soon`: 即将开放

**Supply**
- `Direct`: 直接供应路线
- `Verified`: 已验证供应路线
- `Limited`: 受限供应路线

**Route label**
- `Lowest price`
- `Recommended`
- `Lowest latency`
- `Auto eligible`
- `Selected`

---

# 14. 文案规范

使用：
- `lowest available price`
- `provider routes`
- `route transparency`
- `multiple providers`
- `same model, different prices`
- `auto route`
- `select provider`

避免：
- `Best input`
- `Best output`
- `cheapest provider` 过度营销
- `unlimited`
- 过度强调 provider 平台

核心文案：

`Same model. Multiple providers. Lowest available price by default.`

`OpenModels shows the lowest available token price by default. For advanced control, select a provider route.`

---

# 15. MVP 范围

**MVP 必做**
- 首页 Marketplace 聚合模型展示
- 表格增加 Routes 字段
- 价格默认显示最低可用价格
- Model Detail 新增 Provider routes
- Provider routes 支持 Select
- Code example 支持 `route.provider`
- API 默认不指定 provider 时使用最低可用 live route

**MVP 暂缓**
- Provider onboarding
- Provider dashboard
- API key routing policy
- Region selection
- SLA / contract route
- Complex fallback chain

---

# 16. 最终体验

用户路径：

1. 首页看到某个模型的最低可用价格
2. 看到该模型有几个 routes
3. 点击模型进入详情页
4. 查看多个 provider 的价格、延迟、供应状态
5. 默认直接使用最低可用价格
6. 如需控制，选择具体 provider
7. Code example 自动更新
8. Usage 里看到实际 provider 和扣费明细

---

# 17. 最终目标

OpenModels 要形成明确 marketplace 心智：

> 同一个模型，多个 provider，不同价格。  
> 官网默认展示最低可用价格。  
> 用户可以透明比较，也可以指定 provider。  
> 这就是 OpenModels 区别于普通中转站的核心。