# Model Route Groups 与 Mode Assignment 产品调整分析

日期：2026-06-25

## 1. 结论

`Model route groups` 不应该按 provider、价格、模型厂商或底层 route row 分组。它应该按“业务场景下的稳定模型别名”分组，再在每个分组内按调用意图分配模型。

推荐产品定义：

```text
Route Group = 一个业务场景的稳定 model alias
Mode Assignment = 这个 alias 下 fast / balanced / deep 三个意图档位到模型的映射
Provider Route = 某个模型底层可用供应商路线，由已有模型运行时继续解析
```

也就是说，`route:support-chat` 是用户应用代码里长期不变的模型名；`fast`、`balanced`、`deep` 是应用在同一个 alias 下选择成本、默认质量、深度推理的意图；最终的 provider route 仍由 OpenModels 现有的 provider-route 体系处理。

## 2. 当前页面现状

当前仓库是 Figma code bundle，Routes 页面仍是前端原型：

- `src/app/components/dashboard/pages/RoutesPage.tsx` 内部定义了 `INITIAL_ROUTES`，包括 `coding-agent`、`support-chat`、`batch-summary`。
- 同文件内部定义了 `AVAILABLE_MODELS`，没有复用 `src/app/lib/models-data.ts` 里的模型目录。
- `Mode Assignment` 当前把同一批候选模型在 `Fast`、`Balanced`、`Deep` 下重复展开三遍。
- API 示例使用顶层 `route_mode` 字段，但已有 provider route 文档主线使用的是 `route: { provider: ... }` 这种对象式结构。

当前可见代码里的数据层级是：

```text
RoutesPage
  INITIAL_ROUTES
    routeId: route:coding-agent
    rule: priority-fallback | mode-mapping
    models: string[]
    modeMap: { fast, balanced, deep }
    spend: number

  AVAILABLE_MODELS
    id
    input / output
    context
    routes
    status
```

这里有两个产品风险：

1. `models` 同时被用作“可选模型池”和“路由策略目标”，语义混在一起。
2. `modeMap` 是正确方向，但 UI 表达成了“三组重复 radio list”，信息密度低，也容易让用户以为三档必须选择不同模型。

## 3. 应该如何分组

### 3.1 第一层：Route Group，按业务场景分组

Route Group 是用户应用代码中会长期引用的稳定 ID。它不是某个 provider route，也不是某个模型厂商。

示例：

```text
route:coding-agent
route:support-chat
route:batch-summary
route:customer-intake
route:rag-answering
```

分组依据应该是“应用场景”：

| Route Group | 业务含义 | 典型请求 |
|---|---|---|
| `route:coding-agent` | 代码生成、代码解释、代码审查 | IDE agent、CI code review |
| `route:support-chat` | 客服、售后、用户问答 | 在线客服、工单助手 |
| `route:batch-summary` | 批量摘要、异步总结 | 日报、会议纪要、文档摘要 |
| `route:rag-answering` | 检索增强问答 | 知识库问答、企业搜索 |

用户创建 Route Group 的目的不是“整理模型”，而是“让业务代码不用关心底层模型变化”。

### 3.2 第二层：Mode，按调用意图分组

Mode 是同一个业务场景下的运行档位。第一版建议固定三档：

```text
fast
balanced
deep
```

三档含义：

| Mode | 业务含义 | 推荐模型特征 | 适合场景 |
|---|---|---|---|
| `fast` | 低延迟、低成本 | 小模型、稳定、便宜、短上下文 | 自动补全、简单分类、客服首轮回复 |
| `balanced` | 默认生产档 | 成本、质量、延迟平衡 | 大多数线上请求 |
| `deep` | 高质量、复杂推理 | 推理强、上下文更长、成本可更高 | 难题、复杂分析、升级处理 |

`balanced` 必须是默认 mode。用户不传 mode 时，网关应按 `balanced` 解析。

### 3.3 第三层：Target Model，按 mode 映射模型

每个 mode 第一版只需要映射一个默认模型：

```text
route:support-chat
  fast      -> mistral-7b
  balanced  -> deepseek-v3
  deep      -> deepseek-r1
```

也允许多个 mode 指向同一个模型：

```text
route:support-chat
  fast      -> deepseek-v3
  balanced  -> deepseek-v3
  deep      -> deepseek-r1
```

这是合理状态，表示当前产品还没有把 `fast` 和 `balanced` 分开。UI 可以提示，但不要禁止。

### 3.4 第四层：Provider Route，由底层自动解析

Mode Assignment 不应该直接分 provider。它只选择模型。模型选定后，再进入已有 provider route 体系：

```text
route:support-chat + mode=deep
  -> deepseek-r1
  -> provider route selection
  -> DeepSeek / Together AI / 其他可用 provider
```

Provider route 的选择仍按已有规则处理：

- 默认最低可用 live route。
- 如用户指定 provider，则走指定 provider。
- 如果 provider 不可用，按底层 provider-route 策略判断是否 fallback。

## 4. 为什么不按 provider 分组

不能把这个模块设计成 provider route 的另一个入口，原因有三点：

1. 已有 OpenModels 主线已经明确 provider route：一个 model 可以由多个 provider 供应，默认最低可用 live route。
2. Route Group 是应用级 alias，它解决的是“业务代码不随模型变化”的问题。
3. 如果在 Mode Assignment 里直接选择 provider，会把“业务意图”和“供应商路线”绑定死，后续价格、延迟、供应状态变化时反而难维护。

正确边界：

```text
业务代码关心：route:support-chat + mode=deep
产品配置关心：deep mode 当前用 deepseek-r1
运行时关心：deepseek-r1 当前走哪个 provider route
```

## 5. 当前截图的 UI 问题

截图里的结构是：

```text
Fast
  llama-3.1-70b
  deepseek-v3
  deepseek-r1

Balanced
  llama-3.1-70b
  deepseek-v3
  deepseek-r1

Deep
  llama-3.1-70b
  deepseek-v3
  deepseek-r1
```

问题：

1. 同一批模型重复出现三次，占用空间大。
2. 用户需要在三个区域里重复做相同动作。
3. 页面没有解释为什么某个模型适合 fast 或 deep。
4. 同一模型出现在多个 mode 时，看起来像误选。
5. 没有显示选择后的解析结果，比如默认请求最终会走哪个模型。

## 6. 推荐 UI 调整

### 6.1 第一版 UI：三行映射表

建议把重复 radio list 改成三行映射表：

```text
Mode assignment

Mode       Target model       Meaning              Preview
Fast       [mistral-7b    v]  Low latency/cost     $0.04 / $0.08 · 2 routes · Live
Balanced   [deepseek-v3   v]  Default mode         $0.28 / $0.55 · 2 routes · Live
Deep       [deepseek-r1   v]  Highest quality      $0.50 / $1.20 · 2 routes · Live
```

每一行是一个 mode，每个下拉只选一个模型。这样产品语义更直接：用户不是在维护三个模型列表，而是在配置三个调用意图。

### 6.2 允许空值，但 balanced 必填

第一版建议规则：

```text
balanced 必填
fast 可为空，空时 fallback 到 balanced
deep 可为空，空时 fallback 到 balanced
```

UI 文案：

```text
If Fast or Deep is not assigned, OpenModels uses Balanced for that mode.
```

这样用户可以先只配置一个默认模型，不被迫理解完整策略。

### 6.3 允许复用同一个模型

如果 fast 和 balanced 都选了 `deepseek-v3`，只给轻提示：

```text
Fast and Balanced currently use the same model.
```

不要报错。因为这是合理的早期配置。

### 6.4 增加 Resolution Preview

Mode Assignment 下方应显示解析预览：

```text
Resolution preview
Default request -> balanced -> deepseek-v3 -> lowest available provider route
route.mode=fast -> fast -> mistral-7b -> lowest available provider route
route.mode=deep -> deep -> deepseek-r1 -> lowest available provider route
```

这比单纯展示 API snippet 更有价值，因为用户能看懂 route group 到 model/provider 的运行路径。

### 6.5 API 示例保持对象结构

不推荐继续使用顶层 `route_mode`。建议与已有 provider route 设计保持一致：

```json
{
  "model": "route:support-chat",
  "route": {
    "mode": "deep"
  },
  "messages": [
    { "role": "user", "content": "..." }
  ]
}
```

默认请求：

```json
{
  "model": "route:support-chat",
  "messages": [
    { "role": "user", "content": "..." }
  ]
}
```

组合指定 provider 的未来形态：

```json
{
  "model": "route:support-chat",
  "route": {
    "mode": "deep",
    "provider": "deepseek"
  },
  "messages": [
    { "role": "user", "content": "..." }
  ]
}
```

## 7. 数据模型建议

### 7.1 Route Group 表

```sql
model_route_groups
  id uuid primary key
  workspace_id uuid not null
  route_id text not null
  name text not null
  description text
  policy text not null
  default_mode text
  status text not null
  version int not null default 1
  created_by uuid not null
  created_at timestamptz not null
  updated_at timestamptz not null

unique(workspace_id, route_id)
```

字段说明：

| 字段 | 含义 |
|---|---|
| `route_id` | 用户请求里传入的稳定 model alias，例如 `route:support-chat` |
| `policy` | `mode_mapping` 或 `priority_fallback` |
| `default_mode` | `mode_mapping` 下固定为 `balanced` |
| `status` | `active` 或 `paused` |
| `version` | 后续审计、缓存刷新、并发更新使用 |

### 7.2 Mode Assignment 表

```sql
model_route_group_mode_assignments
  id uuid primary key
  route_group_id uuid not null
  mode text not null
  public_model text not null
  enabled boolean not null default true
  created_at timestamptz not null
  updated_at timestamptz not null

unique(route_group_id, mode)
```

第一版只允许每个 mode 一个模型。这样足够支撑当前产品。

### 7.3 未来 fallback 扩展

如果后续需要每个 mode 支持 fallback list，再扩展为：

```sql
model_route_group_targets
  id uuid primary key
  route_group_id uuid not null
  mode text
  public_model text not null
  priority int not null
  enabled boolean not null default true

unique(route_group_id, mode, priority)
```

未来形态：

```text
route:support-chat
  fast
    priority 1 -> mistral-7b
    priority 2 -> llama-3.1-8b

  balanced
    priority 1 -> deepseek-v3

  deep
    priority 1 -> deepseek-r1
    priority 2 -> llama-3.1-70b
```

但第一版不建议直接做这个。先做单模型映射，减少产品和网关复杂度。

## 8. API 合同建议

### 8.1 前端管理 API

```text
GET    /api/v1/route-groups
POST   /api/v1/route-groups
GET    /api/v1/route-groups/:id
PATCH  /api/v1/route-groups/:id
DELETE /api/v1/route-groups/:id
GET    /api/v1/route-groups/:id/usage?range=30d
```

创建请求：

```json
{
  "name": "Support chat",
  "routeId": "route:support-chat",
  "description": "Support conversation routing.",
  "policy": "mode_mapping",
  "status": "active",
  "defaultMode": "balanced",
  "modeAssignments": {
    "fast": "mistral-7b",
    "balanced": "deepseek-v3",
    "deep": "deepseek-r1"
  }
}
```

响应：

```json
{
  "id": "rg_123",
  "name": "Support chat",
  "routeId": "route:support-chat",
  "policy": "mode_mapping",
  "status": "active",
  "defaultMode": "balanced",
  "modeAssignments": {
    "fast": {
      "model": "mistral-7b",
      "health": "live",
      "providerRoutes": 2,
      "inputPer1M": 0.04,
      "outputPer1M": 0.08
    },
    "balanced": {
      "model": "deepseek-v3",
      "health": "live",
      "providerRoutes": 2,
      "inputPer1M": 0.28,
      "outputPer1M": 0.55
    },
    "deep": {
      "model": "deepseek-r1",
      "health": "live",
      "providerRoutes": 2,
      "inputPer1M": 0.50,
      "outputPer1M": 1.20
    }
  },
  "resolutionPreview": [
    {
      "request": "default",
      "mode": "balanced",
      "model": "deepseek-v3",
      "providerSelection": "lowest_available_live_route"
    }
  ]
}
```

### 8.2 网关调用 API

默认 mode：

```json
{
  "model": "route:support-chat",
  "messages": [
    { "role": "user", "content": "..." }
  ]
}
```

指定 mode：

```json
{
  "model": "route:support-chat",
  "route": {
    "mode": "deep"
  },
  "messages": [
    { "role": "user", "content": "..." }
  ]
}
```

## 9. 网关解析规则

请求解析顺序：

```text
1. 读取 request.model
2. 如果 model 不以 route: 开头，走现有 model/provider route 解析
3. 如果 model 以 route: 开头：
   3.1 按 workspace/account + route_id 查询 route group
   3.2 检查 status 是否 active
   3.3 读取 route.mode，没有则使用 default_mode
   3.4 解析 mode 到 public_model
   3.5 检查 public_model 是否有 active provider route
   3.6 进入现有 provider route selection
   3.7 写入 usage record，记录 route_group_id、mode、resolved_model、selected_provider
```

错误语义建议：

| 场景 | 错误码 | 文案 |
|---|---|---|
| route group 不存在 | `ROUTE_GROUP_NOT_FOUND` | Route group does not exist. |
| route group 暂停 | `ROUTE_GROUP_PAUSED` | Route group is paused. |
| mode 不支持 | `ROUTE_MODE_INVALID` | Mode must be fast, balanced, or deep. |
| mode 未配置且无法回退 | `ROUTE_MODE_UNASSIGNED` | This mode has no assigned model. |
| resolved model 无可用 provider | `MODEL_ROUTE_UNAVAILABLE` | Assigned model has no live provider route. |

## 10. Usage 与计费展示

Route Group 的 spend 不能来自配置表，也不能来自前端 mock。应从 usage records 聚合。

usage record 至少需要补充：

```text
route_group_id
route_group_route_id
route_mode
requested_model
resolved_model
selected_provider
provider_route_id
fallback_used
selection_reason
input_tokens
output_tokens
cost_micro_usd
created_at
```

Routes 页面 `30d spend` 来源：

```sql
sum(cost_micro_usd)
where route_group_id = ?
and created_at >= now() - interval '30 days'
```

详情页建议显示：

```text
30d spend
requests
fallback rate
top resolved model
top selected provider
```

不要只显示金额。金额没有请求数和 fallback rate，产品判断价值不够。

## 11. 状态设计

当前只有 `Active / Paused` 不够。建议拆成两层：

### 11.1 用户配置状态

```text
active
paused
```

这是用户手动控制的状态。

### 11.2 运行健康状态

```text
ready
degraded
unavailable
```

这是系统根据 mode assignment 和底层 provider route 自动计算的状态。

计算规则：

| Health | 条件 |
|---|---|
| `ready` | balanced 已配置，且所有已配置 mode 都能解析到至少一个 live provider route |
| `degraded` | balanced 可用，但某些可选 mode 不可用或 fallback 到 balanced |
| `unavailable` | balanced 不可用，或 route group 没有任何可调用模型 |

表格展示建议：

```text
Status: Active
Health: Ready / Degraded / Unavailable
```

不要把“人工暂停”和“供应不可用”混成一个 status。

## 12. 表单校验规则

创建/编辑 Route Group 时建议校验：

| 校验 | 规则 |
|---|---|
| Route ID 格式 | 必须以 `route:` 开头，只允许小写字母、数字、短横线 |
| Route ID 唯一 | 同一 workspace 下唯一 |
| Route ID 稳定 | 创建后默认不可改，修改必须二次确认 |
| balanced | `mode_mapping` 下必填 |
| fast/deep | 可空，空时使用 balanced |
| 模型可用性 | 只能选择有 active provider route 的模型，或显示明确不可用提示 |
| status | paused 后网关应拒绝调用，不应静默 fallback 到原始模型 |

Route ID 修改尤其要谨慎，因为它直接影响用户应用代码。

## 13. 服务边界

| 模块 | 职责 |
|---|---|
| SaaS Frontend | Route Groups 页面、创建编辑表单、Mode Assignment、预览、usage 展示 |
| SaaS Backend | route group CRUD、校验、usage 聚合、runtime cache 刷新 |
| Gateway | 解析 `route:*`、mode 到 model、provider route selection、错误语义 |
| Runtime Cache | 缓存 route group 到 mode/model 的解析结果 |
| Usage/Billing | 记录请求真实解析结果、成本、provider、fallback reason |
| Provider Route 模块 | 继续负责 model 到 provider 的可用路线和价格 |

第一版不要新增独立 provider dashboard、复杂策略语言、SLA、region routing。

## 14. 最小实现路径

### 阶段 1：先修产品表达

目标：把当前 UI 从“重复 radio list”改成“mode 到 model 的映射表”。

调整：

1. `Mode Assignment` 改成三行映射表。
2. 每行一个 model select。
3. `balanced` 标记 default 并强制必填。
4. `fast/deep` 可空并提示 fallback 到 balanced。
5. 增加 `Resolution Preview`。
6. API 示例改成 `route: { mode: "deep" }`。

### 阶段 2：统一前端数据源

目标：减少 mock 漂移。

调整：

1. 删除 `RoutesPage.tsx` 内的 `AVAILABLE_MODELS`。
2. 从 `src/app/lib/models-data.ts` 派生候选模型。
3. 候选模型只展示有 provider routes 的模型。
4. 价格、routes count、status 统一来自同一模型目录。

### 阶段 3：补真实后端合同

目标：让 Route Group 成为真实产品能力。

调整：

1. 增加 route group CRUD API。
2. 增加 mode assignment 存储。
3. Gateway 支持 `model=route:*`。
4. Runtime cache 加 route group 解析缓存。
5. Usage record 记录 route group 和 mode。

### 阶段 4：再考虑高级策略

这些能力当前 UI 没有体现，也不应该在第一版 UI 里体现。它们是后续当用户已经稳定使用 Route Group 后，才可能加入的高级路由能力。

暂缓能力说明：

1. 每个 mode 多模型 fallback list：同一个 mode 下配置多候选模型，例如 `deep` 先用 `deepseek-r1`，不可用时再用 `llama-3.1-70b`。当前 UI 只需要每个 mode 选一个模型。
2. Weighted split：按权重分流，例如 90% 请求走 A 模型、10% 请求走 B 模型，用于灰度或成本测试。当前 UI 没有流量比例配置。
3. Region routing：按用户或业务区域选择模型/provider，例如 US 请求走美国供应，Asia 请求走亚洲供应。当前 UI 没有区域维度。
4. SLA routing：按延迟、可用性或企业 SLA 选择路线，例如只走满足 99.9% 可用性或 P95 延迟阈值的 provider。当前 UI 没有 SLA 指标配置。
5. API key specific route policy：不同 API key 使用不同 route policy，例如 Production key 走稳定模型，Development key 走低成本模型。当前 UI 的 route group 是 workspace 级，不绑定 API key。
6. A/B experiment：同一 route group 下做实验分组，记录实验 variant 和结果。当前 UI 没有实验、variant、指标追踪。

当前 UI 应只体现：

```text
Route Group -> Mode -> Target Model
```

也就是：

```text
route:support-chat
  fast      -> 一个模型
  balanced  -> 一个模型
  deep      -> 一个模型
```

这些能力都会显著增加网关和 billing 解释成本，不适合第一版。

## 15. 推荐页面结构

```text
Routes

Header
  Route groups
  Create stable model aliases for application workloads.

Table
  Route group
  Route ID
  Policy
  Default
  Targets
  Health
  30d spend
  Status

Detail drawer
  Basic
    name
    routeId
    status

  Policy
    Mode mapping

  Mode assignment
    Fast      [model select]
    Balanced  [model select] default
    Deep      [model select]

  Resolution preview
    default -> balanced -> deepseek-v3 -> lowest available provider route
    fast -> mistral-7b -> lowest available provider route
    deep -> deepseek-r1 -> lowest available provider route

  Usage 30d
    spend
    requests
    fallback rate

  API example
```

## 16. 文案调整边界

本阶段暂不调整页面文案。产品调整先聚焦信息架构、分组方式、交互结构、API 合同和数据来源。

暂不做：

1. 不替换页面标题、副标题、按钮文字。
2. 不新增新的英文解释文案。
3. 不改 `Fast`、`Balanced`、`Deep` 的现有显示名称。
4. 不改现有 provider route 相关对外说明。

后续如果需要做文案优化，建议单独开一轮 copy review，避免把产品结构调整和文案风格调整混在一起。

## 17. 验收标准

产品验收：

1. 用户能理解 Route Group 是应用级稳定别名。
2. 用户能理解 Mode 是同一别名下的调用意图。
3. 用户能配置 `fast / balanced / deep` 到模型的映射。
4. 用户知道不传 mode 时默认走 `balanced`。
5. 用户知道 provider route 仍由底层模型供应体系自动选择。
6. 用户能从 Resolution Preview 看懂一次请求会解析到哪个模型。

技术验收：

1. `route_id` 在 workspace 内唯一。
2. `balanced` 必填。
3. `fast/deep` 为空时能明确 fallback 到 balanced。
4. paused route group 调用会返回明确错误。
5. usage 记录包含 route group、mode、resolved model、provider、cost。
6. 30d spend 来自 usage 聚合，不来自配置表。

## 18. 最终建议

第一版不要把 `Model route groups` 做成完整 routing policy 平台。最小正确产品是：

```text
稳定 route_id + mode 到 model 的映射 + provider route 自动解析 + usage 可追踪
```

这已经能解决用户的核心需求：应用代码只传 `route:support-chat`，产品侧可以调整默认模型或不同 mode 的模型，而不需要改业务代码。

后续如果真实用户开始需要更复杂的“同一 mode 多模型 fallback”或“按区域/延迟/SLA 策略”，再从 `modeAssignments` 扩展到 `targets + priority`。第一版不需要提前做复杂策略。
