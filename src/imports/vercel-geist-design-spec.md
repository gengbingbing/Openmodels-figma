# Vercel / Geist Design System — Reverse-Engineered Specification
# vs. Alephant V5 Current State

> Last updated: 2026-03-11
> Source: vercel.com/design, Geist UI, Turborepo Design System template, Vercel Dashboard pixel inspection

---

## 1. TYPOGRAPHY

### 1.1 Font Family

| Property     | Vercel (Geist)                              | Alephant V5 Current                        |
|-------------|---------------------------------------------|---------------------------------------------|
| Sans        | `Geist Sans` (fallback: system-ui, -apple-system, sans-serif) | `Inter` (fallback: -apple-system, BlinkMacSystemFont, sans-serif) |
| Mono        | `Geist Mono` (fallback: ui-monospace, SFMono-Regular, monospace) | `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace` |

**Delta:** Vercel uses proprietary Geist font. Inter is the closest open alternative — Geist Sans was actually inspired by Inter. The main visual differences:
- Geist has slightly tighter default spacing
- Geist numbers are more "mechanical" feeling
- Geist has a more uniform x-height

**Migration:** Install `geist` npm package or use Google Fonts CDN for Geist Sans + Geist Mono.

### 1.2 Font Sizes (Type Scale)

| Token       | Vercel (px) | Vercel (rem) | Alephant V5 (px) | Alephant V5 (rem) | Notes                    |
|-------------|-------------|-------------|-------------------|-------------------|--------------------------|
| xs          | 12          | 0.75        | 12                | 0.75              | Match                    |
| sm          | 13          | 0.8125      | 14                | 0.875             | Vercel is 1px smaller    |
| base/md     | 14          | 0.875       | 16                | 1.0               | Vercel is 2px smaller    |
| lg          | 16          | 1.0         | 20                | 1.25              | Vercel is 4px smaller    |
| xl          | 20          | 1.25        | 20                | 1.25              | Match                    |
| 2xl         | 24          | 1.5         | 24                | 1.5               | Match                    |
| 3xl         | 32          | 2.0         | 30                | 1.875             | Close                    |
| 4xl         | 40          | 2.5         | (Tailwind default) | -                | Display only             |
| 5xl         | 48          | 3.0         | (Tailwind default) | -                | Display only             |

**Key insight:** Vercel's scale is 1-2px smaller at the body/UI range. Their "sm" (13px) is the primary UI text size — not 14px.

### 1.3 Font Weights

| Token      | Vercel | Alephant V5 | Notes              |
|-----------|--------|-------------|---------------------|
| normal    | 400    | 400         | Match               |
| medium    | 500    | 500         | Match               |
| semibold  | 600    | 600         | Match               |
| bold      | 700    | 700         | Match               |

### 1.4 Line Heights

| Context       | Vercel | Alephant V5 | Notes                           |
|--------------|--------|-------------|----------------------------------|
| Body text    | 1.5    | 1.43-1.5    | Close match                      |
| UI elements  | 1.0    | 1.0         | Buttons, badges — Match          |
| Headings     | 1.2    | 1.25        | Very close                       |
| Tight        | 1.1    | 1.25        | Vercel is tighter                |

### 1.5 Letter Spacing

| Context         | Vercel     | Alephant V5 | Notes                        |
|----------------|------------|-------------|-------------------------------|
| Normal text    | 0          | 0           | Match                         |
| UI labels      | 0          | 0.02em      | Vercel uses NO extra tracking |
| Uppercase label| 0.04-0.06em| 0.08em      | Vercel is slightly less       |
| Headings       | -0.02em    | -0.01em     | Vercel has more negative      |

---

## 2. COLORS

### 2.1 Neutral Gray Scale (Light Mode)

| Step  | Vercel       | Alephant V5  | Notes                    |
|-------|-------------|-------------|---------------------------|
| 100   | #FAFAFA     | #FCFCFC     | Very close                |
| 200   | #EAEAEA     | #F8F8F8     | Vercel is darker          |
| 300   | #D9D9D9     | #F1F1F1     | Significant difference    |
| 400   | #C8C8C8     | #E6E8EB     | Vercel is more pure gray  |
| 500   | #A0A0A0     | #A0A8B2     | Close (Alephant is bluer) |
| 600   | #888888     | #7E8694     | Close                     |
| 700   | #666666     | #5E6670     | Close                     |
| 800   | #444444     | #49515B     | Close                     |
| 900   | #333333     | #3E4347     | Close                     |
| 1000  | #222222     | #2A2D30     | Close                     |
| 1100  | #111111     | #1C1E21     | Vercel is darker          |
| 1200  | #000000     | #171717     | Vercel is pure black      |

**Key insight:** Vercel uses PURE NEUTRAL grays (no blue/warm tint). Alephant has a slight blue-cool tint in the midtones. Vercel's scale is also more evenly distributed.

### 2.2 Neutral Gray Scale (Dark Mode)

| Step  | Vercel       | Alephant V5  |
|-------|-------------|-------------|
| 100   | #0A0A0A     | #0F0F0F     |
| 200   | #111111     | #171717     |
| 300   | #1A1A1A     | #1C1C1C     |
| 400   | #252525     | #232323     |
| 500   | #333333     | #2A2A2A     |
| 600   | #444444     | #3E3E3E     |
| 700   | #555555     | #525252     |
| 800   | #777777     | #6B6B6B     |
| 900   | #999999     | #A0A0A0     |
| 1000  | #B4B4B4     | #C4C4C4     |
| 1100  | #E8E8E8     | #EDEDED     |
| 1200  | #FFFFFF     | #FFFFFF     |

### 2.3 Brand / Accent Color

| Property      | Vercel           | Alephant V5        |
|--------------|------------------|--------------------|
| Brand        | #000000 (light) / #FFFFFF (dark) | #40C49D (mint)    |
| Accent blue  | #0070F3          | N/A                |
| Success      | #0070F3 → #50E3C2 (teal) | #16A34A (green) |
| Error/Red    | #EE0000 → #FF0000 | #DC2626           |
| Warning      | #F5A623          | #EA580C            |
| Violet       | #7928CA          | #8B5CF6            |
| Cyan         | #50E3C2 → #79FFE1 | N/A               |

**Key insight:** Vercel's "brand" is black/white (not a color). Their blue (#0070F3) is the primary interactive accent. Alephant uses mint (#40C49D) as brand — this is a deliberate differentiation to keep.

### 2.4 Semantic Colors

| Semantic    | Vercel          | Alephant V5     |
|------------ |-----------------|-----------------|
| Background  | #FFFFFF         | #F8F8F8         |
| Page bg     | #FAFAFA         | #F8F8F8         |
| Card bg     | #FFFFFF         | #FFFFFF         |
| Text primary| #000000         | #1C1E21         |
| Text secondary| #666666       | #3E4347 (scale-900) |
| Text tertiary| #888888        | #49515B (scale-800) |
| Text muted  | #999999         | #5E6670 (scale-700) |
| Border default| #EAEAEA       | #E6E8EB         |
| Border strong| #D9D9D9        | #D5D9DD         |

---

## 3. SPACING

### 3.1 Base Unit

| Property     | Vercel    | Alephant V5 |
|-------------|-----------|-------------|
| Base unit   | 4px       | 4px (Tailwind default) |
| Grid        | 4px grid  | 4px grid    |

### 3.2 Common Spacing Values

| Context              | Vercel (px) | Alephant V5 (px) |
|---------------------|-------------|-------------------|
| Card padding        | 24          | 20 (1.25rem)      |
| Card header padding | 16-24       | 16-20             |
| Table cell padding  | 12-16       | 10-16             |
| Button gap (icon)   | 8           | 6 (0.375rem)      |
| Section gap         | 24-32       | varies            |
| Sidebar item py     | 8           | 7 (0.4375rem)     |
| Input padding-x     | 12          | 12                |
| Modal body padding  | 24          | 20 (1.25rem)      |

---

## 4. BORDER & RADIUS

| Property       | Vercel      | Alephant V5    | Notes                    |
|---------------|-------------|---------------|--------------------------|
| Border width  | 1px         | 1px           | Match                    |
| Default radius| 6px         | 8px           | Vercel is sharper        |
| Button radius | 6px         | 8px           | Vercel is sharper        |
| Card radius   | 8px         | 8px           | Match                    |
| Input radius  | 6px         | 8px           | Vercel is sharper        |
| Badge radius  | 9999px (pill) | 0 (sharp)   | Major difference!        |
| Modal radius  | 12px        | 8px           | Vercel is rounder        |
| Avatar radius | 50% (circle)| varies        | -                        |

**Key insight:** Vercel uses 6px for most interactive elements, 8px for cards, 12px for modals, and pill (9999px) for badges. It's NOT a uniform radius — each component has its own. Alephant currently uses a single 8px for everything.

---

## 5. SHADOWS

| Token      | Vercel                                           | Alephant V5                                  |
|-----------|--------------------------------------------------|----------------------------------------------|
| sm        | 0 1px 2px rgba(0,0,0,0.04), 0 1px 1px rgba(0,0,0,0.02) | 0 1px 2px rgba(0,0,0,0.04)              |
| md        | 0 4px 8px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04) | 0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04) |
| lg        | 0 8px 30px rgba(0,0,0,0.12)                      | 0 8px 24px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04) |
| dropdown  | 0 8px 30px rgba(0,0,0,0.12)                      | Same as lg                                    |

**Key insight:** Vercel uses slightly stronger shadows than Alephant, but both are minimal. The key difference is Vercel's dropdown shadow is more dramatic.

---

## 6. COMPONENTS

### 6.1 Button

| Property        | Vercel                      | Alephant V5                | Delta           |
|----------------|-----------------------------|-----------------------------|-----------------|
| Height xs      | 24px                        | 26px                        | -2px            |
| Height sm      | 32px                        | 32px                        | Match           |
| Height md      | 40px                        | 36px                        | +4px            |
| Height lg      | 48px                        | 40px                        | +8px            |
| Padding-x sm   | 12px                        | 12px                        | Match           |
| Padding-x md   | 16px                        | 14px                        | +2px            |
| Padding-x lg   | 20px                        | 20px                        | Match           |
| Font size      | 14px (all sizes)            | 12px (--v5-text-sm=14px in V5) | See note     |
| Font weight    | 500 (medium)                | 500 (medium)                | Match           |
| Border radius  | 6px                         | 8px                         | -2px            |
| Border width   | 1px                         | 1px                         | Match           |
| Transition     | 200ms ease                  | 150ms ease                  | +50ms           |
| Gap (icon+text)| 8px                         | 6px                         | +2px            |

**Vercel Button Variants:**

| Variant    | Background      | Text     | Border          | Hover                  |
|-----------|-----------------|----------|-----------------|------------------------|
| Primary   | #000000         | #FFFFFF  | #000000         | bg: #333               |
| Secondary | #FFFFFF         | #666666  | #EAEAEA         | bg: #FAFAFA, border: #999 |
| Tertiary  | transparent     | #666666  | transparent     | bg: #FAFAFA            |
| Error     | #EE0000         | #FFFFFF  | #EE0000         | bg: #CC0000            |
| Warning   | #F5A623         | #FFFFFF  | #F5A623         | bg: darken             |

**vs Alephant V5:**
- Primary → brand mint (not black)
- Default → similar to Vercel Secondary
- Ghost → similar to Vercel Tertiary
- Danger → similar to Vercel Error

### 6.2 Input / Text Field

| Property       | Vercel         | Alephant V5     |
|---------------|----------------|-----------------|
| Height        | 40px           | 36px            |
| Height sm     | 32px           | 32px            |
| Padding-x     | 12px           | 12px            |
| Font size     | 14px           | 14px (V5)       |
| Background    | #FFFFFF        | #FFFFFF          |
| Border        | 1px #EAEAEA    | 1px #E6E8EB     |
| Border radius | 6px            | 8px              |
| Focus border  | #000000        | #40C49D (mint)   |
| Focus ring    | 0 0 0 1px #000 | 0 0 0 1px mint   |
| Placeholder   | #999999        | #7E8694          |
| Disabled bg   | #FAFAFA        | --v5-bg-sunken   |

### 6.3 Table

| Property           | Vercel          | Alephant V5         |
|-------------------|-----------------|---------------------|
| Header bg         | transparent     | --v5-bg-raised      |
| Header font       | 13px, 400       | 14px, 500           |
| Header color      | #666666         | --v5-text-tertiary  |
| Header text-transform | none        | none (match)        |
| Header letter-spacing | 0           | 0.02em              |
| Header padding    | 8px 16px        | 8px 16px            |
| Header border-bottom | 1px #EAEAEA  | 1px --v5-border-default |
| Cell padding      | 12px 16px       | 10px 16px           |
| Cell font         | 13px, 400       | 14px, 400           |
| Cell color        | #000000         | --v5-text-primary   |
| Cell border-bottom| 1px #EAEAEA     | 1px --v5-border-subtle |
| Row hover bg      | #FAFAFA         | --v5-bg-hover       |
| Mono cells        | Geist Mono, 13px| System mono, 14px   |
| Table wrapper border | 1px #EAEAEA  | 1px --v5-border-default |
| Table wrapper radius | 8px          | 0                   |

**Key differences:**
1. Vercel header is transparent bg (not raised)
2. Vercel header weight is 400 (not 500) — lighter
3. Vercel text is 13px throughout (1px smaller)
4. Vercel table wrapper has 8px border-radius

### 6.4 Badge

| Property       | Vercel             | Alephant V5           |
|---------------|--------------------|-----------------------|
| Padding       | 0 8px              | 1px 7px               |
| Height        | 24px               | auto (line-height)    |
| Font size     | 12px               | 14px (V5 --v5-text-sm)|
| Font weight   | 500                | 500                   |
| Border        | 1px solid          | 1px solid             |
| Border radius | 9999px (full pill) | 0px (sharp)           |
| Text transform| capitalize         | none                  |

**Vercel Badge Variants:**

| Variant  | Background   | Text      | Border     |
|---------|-------------|-----------|------------|
| gray    | #FAFAFA     | #666666   | #EAEAEA    |
| blue    | #EBF5FF     | #0070F3   | #B6D9FF    |
| purple  | #F3E8FF     | #7928CA   | #D9B8FF    |
| cyan    | #E0FCFF     | #0D7068   | #A0F0ED    |
| green   | #E7FCE7     | #0B7029   | #A0E8A0    |
| red     | #FFF0F0     | #EE0000   | #FFC0C0    |
| yellow  | #FFFBE5     | #9A6700   | #FFE17E    |

### 6.5 Dropdown / Menu

| Property           | Vercel          | Alephant V5          |
|-------------------|-----------------|----------------------|
| Background        | #FFFFFF         | --v5-bg-base         |
| Border            | 1px #EAEAEA     | 1px --v5-border-default |
| Border radius     | 8px             | --v5-radius (8px)    |
| Shadow            | 0 8px 30px rgba(0,0,0,0.12) | --v5-shadow-popup |
| Padding           | 4px             | 4px (0.25rem)        |
| Item padding      | 8px 12px        | 6px 8px              |
| Item font size    | 14px            | 14px (V5)            |
| Item hover bg     | #FAFAFA         | --v5-bg-hover        |
| Item border-radius| 4px             | 0                    |
| Separator         | 1px #EAEAEA, my 4px | 1px --v5-border-default |
| Min width         | 200px           | varies               |

### 6.6 Sidebar / Navigation

| Property           | Vercel           | Alephant V5           |
|-------------------|------------------|-----------------------|
| Width             | 240px            | 224px (14rem)         |
| Background        | #FAFAFA          | #FFFFFF               |
| Border right      | 1px #EAEAEA      | 1px --v5-border-default |
| Item padding      | 8px 12px         | 7px 8px               |
| Item font size    | 14px             | 14px (V5)             |
| Item font weight  | 400 (normal)     | 400 (normal)          |
| Item hover bg     | #EAEAEA          | --v5-bg-sidebar-hover |
| Item active bg    | #EAEAEA          | rgba(mint, 0.10)      |
| Item active weight| 500 (medium)     | 600 (semibold)        |
| Item active indicator | left: 2px blue bar OR bold text | mint tint bg |
| Item border-radius| 6px              | 0                     |
| Section heading   | 12px, 400, #999  | 14px, 600, uppercase  |
| Section heading transform | none     | uppercase             |

**Key differences:**
1. Vercel sidebar bg is FAFAFA (not white)
2. Active state: Vercel uses a simple bg highlight or left accent bar, Alephant uses mint tint
3. Vercel section headings are NOT uppercase — just smaller and lighter
4. Vercel sidebar items have 6px border-radius on hover/active

### 6.7 Tabs

| Property            | Vercel            | Alephant V5          |
|--------------------|-------------------|----------------------|
| Font size          | 14px              | 14px (V5)            |
| Font weight normal | 400               | 500                  |
| Font weight active | 500               | 500                  |
| Text color         | #666666           | --v5-text-muted      |
| Active color       | #000000           | --v5-text-primary    |
| Active indicator   | 2px bottom, #000  | 2px bottom, mint     |
| Padding            | 12px 16px         | 8px 16px             |
| Gap                | 0                 | 0                    |
| Border bottom      | 1px #EAEAEA       | 1px --v5-border-default |

### 6.8 Modal / Dialog

| Property           | Vercel            | Alephant V5           |
|-------------------|-------------------|-----------------------|
| Max width (default)| 480px            | 512px (32rem)         |
| Max width lg       | 640px            | 640px                 |
| Border radius      | 12px             | 8px                   |
| Background         | #FFFFFF          | --v5-bg-base          |
| Border             | 1px #EAEAEA      | 1px --v5-border-default |
| Shadow             | 0 16px 70px rgba(0,0,0,0.2) | lg shadow    |
| Overlay            | rgba(0,0,0,0.5)  | rgba(0,0,0,0.5)      |
| Header padding     | 24px             | 16px 20px             |
| Body padding       | 0 24px 24px      | 20px                  |
| Footer padding     | 16px 24px        | 12px 20px             |
| Footer bg          | #FAFAFA          | --v5-bg-raised        |
| Footer border-top  | 1px #EAEAEA      | 1px --v5-border-subtle|
| Title font size    | 18px             | 16px (--v5-text-md)   |
| Title font weight  | 600              | 600                   |
| Close button size  | 32px             | 32px                  |

### 6.9 Alert / Banner

| Property       | Vercel            | Alephant V5          |
|---------------|-------------------|----------------------|
| Padding       | 12px 16px         | 12px 16px            |
| Border        | 1px solid         | 1px solid            |
| Border radius | 6px               | --v5-radius          |
| Font size     | 14px              | 14px (V5)            |
| Icon size     | 16px              | varies               |

### 6.10 Switch / Toggle

| Property        | Vercel          | Alephant V5          |
|----------------|-----------------|----------------------|
| Width          | 32px            | 36px (2.25rem)       |
| Height         | 20px            | 20px (1.25rem)       |
| Thumb size     | 16px            | 16px (1rem)          |
| Off bg         | #D9D9D9         | --v5-scale-400       |
| On bg          | #000000         | #40C49D (mint)       |
| Border radius  | 9999px          | 0 (sharp!)           |
| Transition     | 200ms           | 150ms                |

### 6.11 Avatar

| Property       | Vercel          | Alephant V5          |
|---------------|-----------------|----------------------|
| Size sm       | 24px            | 24px                 |
| Size md       | 32px            | varies               |
| Size lg       | 40px            | varies               |
| Border radius | 50% (circle)    | varies               |
| Border        | none            | varies               |
| Fallback      | gradient bg + initial | solid bg + initial |

### 6.12 Tooltip

| Property       | Vercel             | Alephant V5         |
|---------------|--------------------|---------------------|
| Background    | #000000            | --v5-bg-base        |
| Text color    | #FFFFFF            | --v5-text-primary   |
| Font size     | 12px               | 14px (V5)           |
| Padding       | 4px 8px            | varies              |
| Border radius | 4px                | --v5-radius         |
| Shadow        | none               | varies              |
| Max width     | 240px              | varies              |

**Key insight:** Vercel tooltips are always dark (inverted) — black bg, white text.

### 6.13 Code Block

| Property       | Vercel              | Alephant V5            |
|---------------|---------------------|------------------------|
| Font          | Geist Mono, 13px    | System mono, 14px      |
| Inline bg     | #F3F3F3             | --v5-bg-sunken         |
| Inline padding| 2px 6px             | 2px 6px                |
| Inline radius | 4px                 | 0                      |
| Block bg      | #1A1A1A (dark always)| --v5-scale-1200        |
| Block text    | #EDEDED             | --v5-scale-200         |
| Block padding | 16px                | 16px                   |
| Block radius  | 8px                 | 0                      |
| Block border  | 1px #333            | 1px --v5-border-default|

---

## 7. TRANSITIONS & ANIMATION

| Property            | Vercel           | Alephant V5         |
|--------------------|------------------|---------------------|
| Fast (hover)       | 150ms ease       | 100ms ease          |
| Base (interaction) | 200ms ease       | 150ms ease          |
| Slow (layout)      | 300ms ease       | 250ms ease          |
| Easing default     | ease             | ease                |
| Modal enter        | 200ms ease-out   | N/A                 |
| Modal exit         | 150ms ease-in    | N/A                 |

---

## 8. ICON SYSTEM

| Property     | Vercel              | Alephant V5        |
|-------------|---------------------|---------------------|
| Library     | Custom (Vercel icons) + Lucide | Lucide React |
| Size xs     | 12px                | 12px                |
| Size sm     | 14px                | 14px                |
| Size md     | 16px                | 16px                |
| Size lg     | 20px                | 20px                |
| Stroke width| 1.5px               | Lucide default (2px)|
| Color       | currentColor        | currentColor        |

**Key insight:** Vercel icons use 1.5px stroke width (thinner than Lucide's default 2px). This contributes to the "lighter" feeling.

---

## 9. LAYOUT

| Property             | Vercel          | Alephant V5         |
|---------------------|-----------------|---------------------|
| Max content width   | 1200px          | varies              |
| Sidebar width       | 240px           | 224px (14rem)       |
| Page padding        | 24-32px         | varies              |
| Card grid gap       | 16-24px         | varies              |
| Header height       | 48px            | varies              |
| Dashboard padding   | 32px            | varies              |

---

## 10. SUMMARY: KEY VISUAL DELTAS TO CLOSE THE GAP

### High Impact (will make the biggest visual difference):
1. **Font:** Inter → Geist Sans/Mono (npm: `geist`)
2. **Gray scale:** Remove blue tint, use pure neutral grays
3. **Border radius per component:** 6px buttons/inputs, 8px cards, 12px modals, pill badges
4. **Button primary:** mint → black (keep mint as accent for interactive feedback)
5. **Table header:** Remove raised bg, use transparent; lighter weight (400 not 500)
6. **Badge shape:** sharp → pill (border-radius: 9999px)

### Medium Impact:
7. **Font size base:** 14px body → 13px body
8. **Button height md:** 36px → 40px
9. **Input height:** 36px → 40px
10. **Focus ring:** mint → black (or keep mint as Alephant signature)
11. **Sidebar bg:** white → FAFAFA
12. **Section headings:** Remove uppercase transform
13. **Icon stroke:** 2px → 1.5px (Lucide supports this via strokeWidth prop)

### Low Impact / Optional:
14. **Transition base:** 150ms → 200ms
15. **Shadow strength:** Slightly increase
16. **Tooltip:** Invert to dark bg
17. **Modal radius:** 8px → 12px
18. **Sidebar item radius:** 0 → 6px

### Keep as Alephant Identity:
- Mint (#40C49D) brand color — this differentiates from Vercel
- Mint focus rings — Alephant signature
- Sidebar active mint tint — unless you want to go fully Vercel-black

---

## 11. MIGRATION PATH (Suggested Order)

### Phase 1: Foundation (Token-only changes, no component code changes)
- [ ] Install Geist font
- [ ] Update --theme-font-sans and --theme-font-mono
- [ ] Update gray scale to pure neutrals
- [ ] Adjust font size scale (sm: 13px, base: 14px)
- [ ] Update radius tokens (add per-component radius tokens)

### Phase 2: Components (CSS class changes in theme_v5.css)
- [ ] Update button heights, padding, radius
- [ ] Update input heights, radius
- [ ] Update table header styles
- [ ] Update badge to pill shape
- [ ] Update sidebar styles
- [ ] Update modal radius and padding
- [ ] Update dropdown item radius

### Phase 3: Polish
- [ ] Adjust icon strokeWidth to 1.5
- [ ] Update transition timings
- [ ] Update tooltip to dark style
- [ ] Update shadow strengths
- [ ] Fine-tune section headings
