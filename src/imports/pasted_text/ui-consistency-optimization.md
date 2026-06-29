**全局 UI 一致性优化需求**

目标：以 Dashboard 当前视觉规范为主，把 Website 的字体、字号、按钮、表格、badge、边框、圆角、留白统一到同一套系统里。不是重做设计，而是让官网和系统内部看起来像同一个产品。

**Dashboard 当前视觉基准**

从现有 Dashboard 看，OpenModels 的系统风格应该是：

```text
字体：Geist Sans 为主，Geist Mono 只用于代码、API key、model id、价格、endpoint
背景：#F7F7F7 / #FAFAFA / #FFFFFF
主色：#0047FF
文本主色：#111
次级文本：#555 / #777
弱文本：#A3A3A3 / #C0C0C0
边框：#E5E5E5
内部分割线：#EFEFEF
圆角：6px 为主
按钮高度：30px / 34px / 40px
交互 hover：#F0F0F0 / #FAFAFA
```

Dashboard 字号系统：

```text
Label: 10px
Body: 13px
Title: 14px
Primary number: 21px
Code: 11-12px
```

Website 可以保留更强的营销层级，但不能和 Dashboard 割裂。

**Website 字号统一方案**

Website 不完全使用 Dashboard 的 10/13/14，因为首页需要更强表达，但要收敛到同一气质。

统一为：

```text
Hero H1: 36px / 42px / 650
Section title: 18px / 26px / 600
Card title: 14px / 20px / 600
Body: 13px / 21px / 400
Table text: 13px / 20px
Table header: 10px / 14px / 500
Badge / meta: 10px / 14px / 500
Button: 13px / 600
Code: 12px / 20px
```

要求：

- 取消过大的 section title。
- Website 的 section title 不要继续用 `T.lg = 14px` 这种“靠粗体撑标题”的方式，应统一成 18px。
- Dashboard 内部仍保持更紧凑的 `D.title = 14px`。
- Hero 是唯一允许使用 36px 以上字号的地方。
- 不再使用明显负 letter-spacing，例如 `-0.04em`。
- 统一 letter spacing：
  - 正文、标题：`0`
  - label：`0.04em`
  - 不使用 `0.1em` 这种过宽 uppercase。

**字体使用规范**

统一规则：

```text
Geist Sans:
导航、标题、正文、按钮、label、badge、状态

Geist Mono:
model id、价格、token 数字、API key、endpoint、代码
```

需要修正：

- Website 里 stats 数字不要全部用粗 mono，金额可以用 mono，但数量类如 `88+ live routes` 建议用 Geist Sans tabular numbers。
- Dashboard balance 已经使用 Sans tabular，Website 也跟随。
- 不要在品牌标题、普通 section title 上用 mono。

**按钮规范**

统一三种按钮：

1. Primary black

```text
background: #111
color: #fff
height: 36px 或 40px
border-radius: 6px
font-size: 13px
font-weight: 600
hover: #2A2A2A
```

2. Primary blue

```text
background: #0047FF
color: #fff
height: 36px 或 40px
border-radius: 6px
font-size: 13px
font-weight: 600
hover opacity: 0.82
```

3. Secondary

```text
background: #fff / transparent
border: 1px solid #E5E5E5
color: #555
border-radius: 6px
hover: #F7F7F7 / border #999
```

需要修正：

- Website 的 Header CTA、Hero CTA、Plans CTA、CostCalculator CTA 要统一圆角和高度。
- 不要有的按钮 0 圆角，有的 6px，有的 pill。
- CTA 文案统一 `Get API key`。

**Badge / Pill 规范**

统一为两类：

1. Status pill

```text
height: 18-22px
font-size: 10px
border-radius: 999
dot: 4px
padding: 0 7px
```

2. Feature chip

```text
font-size: 10px
padding: 2px 8px
border-radius: 999
background: #F5F5F5
border: #E5E5E5
color: #555
```

需要修正：

- Website hero 的四个 feature badge 不要太大。
- Marketplace / Provider / Status badge 颜色降低饱和。
- 不要同一页面里 badge 有 10px、11px、12px 混用。

**表格规范**

Website 和 Dashboard 表格统一：

```text
Header background: #F7F7F7 或 #FAFAFA
Header font: 10px / 500 / #A3A3A3
Body font: 13px
Row height: 44-52px
Border: #EFEFEF
Hover: #FAFAFA
```

需要修正：

- Website Marketplace table、Hero price table、Model Detail provider table、Dashboard API keys table 统一行高和表头风格。
- 表头不要过重 uppercase，保留 uppercase 时 letter spacing 只用 `0.04em`。
- 数字列对齐一致。
- 价格列可加 `font-weight: 600`，但不要所有数字都很粗。

**Card / Section 规范**

统一容器：

```text
border: 1px solid #E5E5E5
border-radius: 6px 或 8px
background: #fff
```

Website 主 section：

- `max-width` 统一为 `1120px`
- section 内 padding：
  - header area: `32px`
  - content area: `24-32px`
- section 之间保留 border-top，但不要每块都像表格堆叠。

Dashboard：

- 继续保持紧凑。
- page header padding 保持 `32px 28px 24px`。
- table/card 内部保持 `24px 28px`。

需要修正：

- Website 目前很多 section 是 `maxWidth: 960`，需要统一到 `1120`。
- `PageColumn`、Hero、Marketplace、Plans、FAQ、CostCalculator、Footer 等容器宽度统一。
- Website 里 section header 不要大量蓝色 uppercase eyebrow，减少视觉噪音。

**颜色规范**

统一色板：

```text
Blue: #0047FF
Black: #111111
Text primary: #111111
Text secondary: #555555
Text muted: #777777
Text weak: #A3A3A3
Border: #E5E5E5
Border soft: #EFEFEF
Background app: #F7F7F7
Background section: #FFFFFF
Background subtle: #FAFAFA
Success: #16A34A
Warning: #D97706
Danger: #DC2626
```

需要修正：

- 统一 `#e2e2e2` 到 `#E5E5E5`。
- 统一 `#eeeeee` 到 `#EFEFEF`。
- Website 不要同时出现太多灰阶。
- Blue 只用于主操作、active、链接，不要用于过多装饰。

**圆角规范**

Dashboard 已经偏 Vercel 风格，应统一：

```text
Button: 6px
Card: 6px / 8px
Input: 4px / 6px
Badge: 999px
Table container: 6px / 8px
```

需要修正：

- Website 很多按钮和容器还是 0 圆角，应统一加 6px。
- 表格外层容器使用 8px。
- 不要出现大圆角卡片。

**Header / Navigation**

Website Header 应向 Dashboard Header 靠齐：

- 高度保持 56px。
- 背景白色或 `rgba(255,255,255,0.92)`。
- border `#E5E5E5`。
- nav font `13px`。
- logo font `14px / 600`。
- Header CTA 高度 36px，radius 6px。
- Launch banner 字号 12px，颜色弱化，不要抢 Get API key。

**需要重点检查的不一致点**

1. Website section 宽度 `960px`，Dashboard 内容更宽，应统一 Website 到 `1120px`。
2. Website Hero H1 负 letter-spacing 太强，要收敛。
3. Website section title 目前有的 14px、有的 18px、有的靠 700 粗体，需统一。
4. Website 和 Dashboard button 圆角不一致，统一 6px。
5. Website badge 字号和颜色不一致，统一 10px。
6. Website 表格 header 过度 uppercase，统一 10px / 500 / #A3A3A3。
7. Dashboard 部分老页面仍使用 `T.xs / T.sm / T.md`，需要逐步替换为 `D.label / D.body / D.title`。
8. Settings 页面视觉和当前 Dashboard 主规范有偏差，后续需要单独清理。
9. ModelDetail 已接近新规范，但 title 22px、section title 15px 与 Dashboard/Website 的统一规范需要确认边界。
10. Auth page、Legal pages、Footer 也需要套同一套按钮、输入框、section title 规范。

**执行优先级**

P0：先统一 tokens

- 明确 `D` 用于 Dashboard。
- 明确 `W` 或 website tokens 用于 Website。
- 统一 border、radius、colors、button styles。

P1：统一 Website

- Header
- Hero
- Marketplace
- Plans
- FAQ
- Footer
- ApiSection / CostCalculator

P2：统一 Dashboard 老页面

- SettingsPage
- ApiKeysPage 中残留的 `T.*`
- modal / input / danger area
- table header / button radius

P3：抽象组件

后续可以抽出：

```text
PageShell
SectionFrame
SectionHeader
Button
Badge
StatusPill
Table
Tabs
MetricCell
CodeBlock
```

**最终标准**

做完后，用户从官网进入 dashboard，不应该感觉是两个不同产品。

统一后的气质应该是：

```text
Vercel-like compact
Geist typography
white / subtle gray surfaces
thin borders
small precise labels
clear tables
consistent 6px radius
blue only for action and active states
```