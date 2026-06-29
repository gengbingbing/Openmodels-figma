**Figma 需求：OpenModels 第一阶段产品升级**

目标：把 OpenModels 从“API 中转感”升级为 **open-source LLM token marketplace infrastructure**。第一阶段只聚焦 5 个核心能力：多 provider routes、模型详情 route 选择、usage 透明记账、credits 充值清晰化、API key/base URL 接入强化。

**1. Models 页面：多 Provider Routes**

位置：Dashboard → Models

页面 Header 文案：

```text
MODELS
Model marketplace
Compare open-source models across verified provider routes. OpenModels uses the lowest available live route by default.
```

表格字段调整为：

```text
Model | Routes | Input / 1M | Output / 1M | Context | Latency | Status
```

字段规则：

- `Routes` 显示 `3 routes` / `2 routes` / `1 route`
- `Input / 1M` 和 `Output / 1M` 默认显示最低可用 live route 价格
- 不在列表页展开 provider
- 点击 model 后打开右侧 drawer，不挤压主表格

Row 示例：

```text
qwen-2.5-72b
Chat · Coding

3 routes
$0.35
$0.60
128K
760ms
Live
```

**2. Model Detail / Drawer：Route 选择**

位置：Dashboard Models drawer 和官网 Model Detail 页面都要统一。

新增核心区块：

```text
Provider routes
Compare providers offering this model. Auto uses the lowest available live provider.
```

表格字段：

```text
Provider | Input / 1M | Output / 1M | Latency | Supply | Availability | Route
```

状态：

- 默认最低价 route 显示：
  ```text
  Auto · Lowest price
  ```
- 手动选中 provider 后显示：
  ```text
  Selected
  ```
- Supply：
  ```text
  Direct / Verified / Limited
  ```
- Availability：
  ```text
  Live / Limited / Offline
  ```

表格下方增加 selected route summary：

```text
Selected route: Auto · lowest available live price
```

选择 provider 后：

```text
Selected route: Alibaba · $0.35 input · $0.60 output · Verified supply
Reset to auto
```

补充说明：

```text
Auto route uses the lowest available live provider. If that route becomes unavailable, OpenModels routes to the next available provider.
```

Manual provider 说明：

```text
Fixed provider requests are sent only to the selected provider.
```

**3. Code Example：跟随 Route 变化**

位置：Model Detail / Drawer 的代码示例区域。

Auto 模式代码：

```json
{
  "model": "qwen-2.5-72b",
  "messages": [...]
}
```

Manual provider 模式代码：

```json
{
  "model": "qwen-2.5-72b",
  "route": { "provider": "alibaba" },
  "messages": [...]
}
```

要求：

- route selector 和 provider table 共用同一个 selected state。
- 切换 provider 后，代码示例同步变化。
- Base URL 固定显示：

```text
https://api.alephant.io/v1
Powered by alephant.io
```

**4. Usage 页面：Provider + Cost 明细**

位置：Dashboard → Usage

目标：让用户知道每次 API 调用的钱花在哪个 provider route 上。

Usage 表格字段建议：

```text
Time | Model | Provider | Tokens | Unit price | Cost | API key
```

Row 示例：

```text
14:23
qwen-2.5-72b
Alibaba
1.2M in · 280K out
$0.35 / $0.60
$0.59
Production
```

点击 usage row 后可展开 detail：

```text
Model ID: qwen-2.5-72b
Provider: Alibaba
Route ID: qwen-2.5-72b:alibaba:auto
Input tokens: 1,200,000 × $0.35 / 1M
Output tokens: 280,000 × $0.60 / 1M
Total cost: $0.59
Routing mode: Auto
```

说明：

- 历史 usage 显示当时实际计费价格。
- 不用当前价格覆盖历史价格。
- Usage 消费 credits，不显示 points。

**5. Credits 页面：充值清晰化**

位置：Dashboard → Credits，替换当前 Add Credits 区域，其他区域不变。

结构：

```text
ADD CREDITS                                      Monthly plans are better for recurring usage  View plans →

┌───────────────────────────────┬──────────────────────────────┐
│ Buy Credits                   │ Auto top-up                  │
│ [Card] [Crypto]               │ Off [toggle]                 │
│                               │                              │
│ Amount                        │ Automatically recharge when  │
│ [$10][$25][$50][$100][$200]   │ your balance drops below $10 │
│ [$ Custom]                    │                              │
│                               │ [Add payment method]         │
│ You receive                   │                              │
│ $200 credits                  │                              │
│                               │                              │
│ [Pay $200]                    │                              │
└───────────────────────────────┴──────────────────────────────┘
```

Card 模式：

```text
Pay $200
You receive $200 credits
```

Crypto 模式：

```text
Pay 200 USDC
You receive $200 credits
```

Crypto details：

```text
Network
Base / Ethereum / Solana

You pay
200 USDC

You receive
$200 credits

Rate
1 USDC = $1 credit
```

要求：

- 不加入 points
- 不加入 Earn Points
- 不显示 bonus credits
- 不显示 discount 阶梯
- Auto top-up 独立在右侧，不挤压 Pay CTA

**6. API Keys 页面：Base URL 引导强化**

位置：Dashboard → API Keys

顶部增加或强化接入信息：

```text
API endpoint
Base URL
https://api.alephant.io/v1
Powered by alephant.io

Authorization
Bearer YOUR_API_KEY
```

要求：

- Base URL 可一键复制。
- Authorization header 可一键复制。
- 在说明中强调：

```text
One API key works across all verified open-source model routes.
```

在 Model ID usage / Quickstart 区域补充 provider route 指定方式：

```json
{
  "model": "qwen-2.5-72b",
  "route": { "provider": "alibaba" }
}
```

说明：

```text
If no provider is specified, OpenModels uses the lowest available live route by default.
```

**7. 全局文案统一**

统一使用：

```text
provider routes
lowest available live route
verified supply
direct supply
credits
API key
Base URL
Powered by alephant.io
```

避免使用：

```text
proxy
中转
bonus credits
points
provider marketplace tab
```

**8. 视觉规范**

整体保持当前 dashboard 风格：

```text
Font: Geist Sans
Mono: only model id, price, API key, endpoint, code
Body: 13px
Label: 10px
Title: 14px
Primary number: 21px
Border: #E5E5E5
Soft border: #EFEFEF
Blue: #0047FF
Radius: 6px / 8px
Background: #FFFFFF / #FAFAFA
```

不要做大卡片营销风。不要新增复杂装饰。所有新增模块都要像 dashboard 原生功能。

**第一阶段不做**

- Points
- Earn tasks
- Provider 独立页面
- Provider 排名
- 复杂 routing policy
- Enterprise controls
- SLA dashboard
- 全量 status center

**最终验收标准**

用户应该能清楚理解：

```text
一个模型可以有多个 provider route。
OpenModels 默认用最低可用 live route。
用户可以手动选择 provider。
每次 usage 都能看到 provider 和 cost。
充值 credits 清楚简单。
一个 API key + api.alephant.io/v1 可以调用所有 verified routes。
```