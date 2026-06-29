**Provider Apply 最终更新需求**

**目标**
`/providers/apply` 支持两种申请方式：
- `Community`：快速接入中转站 / 自提交 provider gateway，通过自动验证后即可上架为 Community supply。
- `Apply for Verified`：申请成为 Verified supply，需要人工审核后上架。

**Footer 入口**
Footer → Marketplace → `Become a provider`  
跳转：`/providers/apply`

**页面头部**
Label：`PROVIDER APPLICATION`

Title：`Become an OpenModels provider`

Description：
`Connect your provider gateway to OpenModels. Community providers can be listed after automated validation. Verified providers require manual review before listing.`

Notice：
`Community supply is self-submitted and labeled experimental. Verified supply is manually reviewed by OpenModels.`

---

## 顶部 Tabs

Tabs：
- `Community`
- `Apply for Verified`

默认选中：
`Community`

---

# Community Tab

**定位**
快速接入中转站 / provider gateway。只填写最小必要信息，通过系统自动验证后即可上架。

**说明文案**
Title：
`Community provider`

Description：
`For self-submitted provider gateways that want fast listing. OpenModels will test your API access and /models endpoint before listing your routes as Community supply.`

Badge：
`Fast listing`

**表单字段**

**1. Provider**
- `Provider name` required  
  placeholder：`Neolink`

- `Desired slug` required  
  placeholder：`neolink`  
  helper：`Lowercase letters, numbers, and hyphens only.`

- `Provider label` optional  
  placeholder：`Tencent · Gemini · Claude · Grok`

**2. Contact**
说明：
`Provide at least one contact method.`

- `Email` optional  
  placeholder：`support@openmodels.market`

- `Telegram` optional  
  placeholder：`@openmodels`

- `WhatsApp` optional  
  placeholder：`+1 000 000 0000`

规则：
Email / Telegram / WhatsApp 至少填写一个。

**3. API access**
- `Auth type` required  
  select：
  - `Authorization Bearer`
  - `API Key`
  - `Custom header`

- `Provider API key` required  
  password input  
  helper：`Used only for validation and route testing. Never shown publicly.`

- `API Base URL` required  
  placeholder：`https://api.provider.com/v1`

- `URL to /models API` required  
  placeholder：`https://api.provider.com/v1/models`

Helper：
`Your /models endpoint must return available models, pricing, context length, and readiness status.`

**4. Basic data policy**
- `Prompts/completions may be logged?` required  
  radio：`Yes / No`

- `Used for training?` required  
  radio：`Yes / No`

**5. Confirmation**
Required checkbox：

`I confirm that this provider gateway can serve the listed model routes and that OpenModels may test the submitted API before listing.`

**CTA**
`Submit for validation`

**提交成功**
Title：
`Submitted for validation`

Copy：
`OpenModels will test your API access and /models endpoint. Providers that pass validation may be listed as Community supply automatically.`

---

# Apply for Verified Tab

**定位**
申请成为 Verified supply。需要人工审核，适合希望进入默认 marketplace 和生产级 routes 的 provider。

**说明文案**
Title：
`Apply for Verified`

Description：
`For providers that want to be listed as Verified supply. OpenModels manually reviews authorization, pricing, reliability, availability, and data policy before approval.`

Badge：
`Manual review`

**表单字段**

**1. Provider identity**
- `Website` required  
  placeholder：`https://openmodels.market`

- `Provider name` required  
  placeholder：`Neolink`

- `Company legal name` required

- `Desired slug` required  
  placeholder：`neolink`

- `Provider label` optional  
  placeholder：`Tencent · Gemini · Claude · Grok`

- `Provider description` optional  
  textarea

**2. Contact**
- `Business email` required
- `Telegram` optional
- `WhatsApp` optional

**3. API access**
- `Auth type` required  
  select：
  - `Authorization Bearer`
  - `API Key`
  - `Custom header`

- `Provider API key` required  
  password input

- `API Base URL` required

- `URL to /models API` required

**4. Inference capability**
- `Inference locations` required  
  placeholder：`US, EU, SG`

- `Supported output modalities` required，多选：
  - `Text`
  - `Image`
  - `Audio`
  - `Video`
  - `Embeddings`
  - `Rerank`
  - `TTS`

**5. Data policy**
- `Prompt/completion logging` required  
  select：
  - `Not logged`
  - `Logged temporarily`
  - `Logged for abuse monitoring`
  - `Other`

- `Retention period` optional  
  select：
  - `None`
  - `< 24 hours`
  - `7 days`
  - `30 days`
  - `Custom`

- `Training use` required  
  radio：
  - `Not used for training`
  - `May be used for training`

- `Data policy notes` optional  
  textarea

**6. Authorization**
- `Authorization details` required  
  textarea  
  placeholder：`Describe your model serving rights, provider agreements, or authorization to serve these routes.`

- `Status page URL` optional

- `SLA / uptime commitment` optional

**7. Confirmation**
Required checkbox：

`I confirm that this provider has authorization to serve the listed model routes, that the submitted data policy is accurate, and that OpenModels may test the submitted API during review.`

**CTA**
`Submit for Verified review`

**提交成功**
Title：
`Submitted for Verified review`

Copy：
`OpenModels will manually review your provider access, authorization, pricing, reliability, and data policy before listing any route as Verified supply.`

---

## 右侧说明区

Title：
`Supply trust levels`

**Community**
- `Self-submitted provider gateway`
- `Automated validation`
- `Fast listing`
- `Experimental label`

**Verified**
- `Manual review`
- `Authorization review`
- `Reliability and data policy review`
- `Eligible for default marketplace routes`

---

## 视觉要求

- Tabs 放在表单顶部。
- Community tab 表单明显更短。
- Apply for Verified tab 表单更完整。
- 保持 OpenModels dashboard / website 风格。
- 白底、细线、低圆角、无重阴影。
- Submit 按钮黑色。
- Required 用小字标注。
- Password/API key 字段强调不公开展示。
- Community 不使用绿色背书色，建议用灰色或橙色实验标签。
- Verified 可使用蓝色/绿色信任标签。