**Figma 需求：Credits 页 Plans Modal**

目标：在 Dashboard → Credits 页点击 `View plans →` 时，打开 Dashboard 风格的 Plans Modal，不跳转到 Home，不新增 tab。Modal 用于快速选择 Go Launch 或 monthly plan，所有 credits 都进入同一个 balance，credits never expire。

**1. 触发入口**

位置：Credits 页 Add Credits 区域右上角。

当前文案改为：

```text
Monthly plans automatically add credits to your balance  View plans →
```

交互：

```text
Click View plans → open Plans Modal
```

不要：

```text
跳转到 Home
打开新 tab
新增 Plans tab
```

**2. Modal Header**

标题：

```text
Choose a monthly plan
```

描述：

```text
Automatically add credits to your OpenModels balance every billing cycle.
```

右上角：

```text
Close icon
```

Header 样式：

```text
Padding: 20px 24px 16px
Border-bottom: 1px solid #EFEFEF
Title: 14px / 600 / #111
Description: 13px / 400 / #777
Close icon: 16px / #A3A3A3
```

**3. Modal Layout**

Modal：

```text
Width: 820px desktop
Max width: calc(100vw - 32px)
Max height: 80vh
Overflow-y: auto
Background: #FFFFFF
Border: 1px solid #E5E5E5
Border radius: 8px
Shadow: 0 20px 56px rgba(0,0,0,0.10)
Overlay: rgba(0,0,0,0.28)
```

Cards layout：

```text
Desktop: 2 columns
Mobile: 1 column
Gap: 12px
Padding: 20px 24px
```

**4. Plan Cards**

Card style：

```text
Background: #FFFFFF
Border: 1px solid #E5E5E5
Radius: 6px
Padding: 16px
Display: vertical
```

Card typography：

```text
Plan name: 13px / 600 / #111
Short label: 12px / #777
Price: 24px / 600 / #111
Billing unit: 12px / #777
Credits line: 13px / 600 / #0047FF
Description: 12-13px / #666
Included label: 10px / 500 / #A3A3A3 / uppercase
Benefits: 12px / #555
Small print: 11px / #A3A3A3
```

CTA：

```text
Height: 34px
Radius: 6px
Font: 12-13px / 600
```

**5. Card 1：Go Launch**

```text
GO LAUNCH
New user offer

$1
one-time

Get $10 credits

Try OpenModels with one API key for verified open-source model routes.

~10K lightweight requests
Fair use limits apply

[Get started]
```

What's included：

```text
WHAT'S INCLUDED

$10 credits added to your balance
~10K lightweight requests
Verified open-source model routes
Default lowest available live route
OpenAI-compatible API
Basic usage history
Community support
```

Small print：

```text
New users only. One per account. Card only. Premium, limited, or high-cost routes may be restricted.
```

Button style：

```text
Black primary
```

**6. Card 2：Starter**

```text
STARTER
Light usage

$20
/month

Adds $20 credits monthly

For testing, prototypes, and light API usage.

[Subscribe]
```

What's included：

```text
WHAT'S INCLUDED

$20 credits added monthly
Credits never expire
One API key
Verified open-source routes
Default lowest available live route
Basic usage history
Cancel anytime
```

Small print：

```text
Credits are added to your balance every billing cycle.
```

Button style：

```text
Secondary or black primary
```

**7. Card 3：Builder**

```text
BUILDER
Regular development

$100
/month

Adds $105 credits monthly

For side projects and regular development workloads.

Recommended

[Subscribe]
```

What's included：

```text
WHAT'S INCLUDED

$105 credits added monthly
5% extra credits
Usage analytics
Provider route visibility
Route-level cost history
Default lowest available live route
Cancel anytime
```

Small print：

```text
Best for developers with recurring API usage.
```

Recommended style：

```text
Border: 1px solid #0047FF
Badge: Recommended
Badge font: 10px / 500 / #0047FF
Badge bg: #EFF4FF
```

Button style：

```text
Blue primary #0047FF
```

**8. Card 4：Scale**

```text
SCALE
Production usage

$200
/month

Adds $220 credits monthly

For production workloads with higher monthly usage.

[Subscribe]
```

What's included：

```text
WHAT'S INCLUDED

$220 credits added monthly
10% extra credits
Higher rate limits
Route-level cost visibility
Usage analytics
Priority support
Cancel anytime
```

Small print：

```text
For teams running production traffic on OpenModels.
```

Button style：

```text
Secondary or black primary
```

**9. Modal Footer**

Footer note：

```text
All credits are added to one balance and never expire. Monthly plans can be canceled anytime.
```

Secondary note：

```text
API usage is charged by actual token cost based on the selected model route.
```

Footer style：

```text
Padding: 12px 24px
Border-top: 1px solid #EFEFEF
Background: #FAFAFA
Font: 12px / #777
```

**10. Interaction States**

Click plan CTA：

```text
Button text changes to Processing...
Then open checkout / billing flow
```

Success state：

```text
Plan activated
Credits will be added to your balance.
```

Close behavior：

```text
Click X closes modal
Click overlay closes modal
Esc closes modal
```

**11. Visual Style Requirements**

Must match Dashboard UI:

```text
Geist Sans
Compact layout
White / #FAFAFA surfaces
Thin borders
Small typography
Radius 6px / 8px
Blue only for active / recommended / primary CTA
No marketing gradient
No oversized pricing hero
No black pricing cards
```

**12. Do Not Include**

Do not design:

```text
points
starter credits
monthly usage balance
eligible route credits
separate balances
request-based billing
model whitelist in card
complex deduction logic
```

**Final User Understanding**

After opening the modal, user should understand:

```text
Go Launch gives $10 credits for $1 once.
Monthly plans add credits to the same balance every month.
All credits never expire.
Usage is charged by actual token cost.
```