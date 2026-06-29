/**
 * Typography — 3-level system
 *
 * h1   40px   Hero H1 only. No other element uses this size.
 * base 14px   Body, nav, buttons, section headings, table content, prices, model IDs.
 * meta 12px   Labels (UPPERCASE), table headers, badges, captions, metadata, status pills.
 *
 * Use fontWeight (400–700), color, and spacing to create hierarchy within levels.
 * Never introduce a new font size to signal importance — use weight or color instead.
 */
export const T = {
  meta: 12,    // labels, badges, captions, table headers, metadata, status pills
  base: 14,    // body, nav, buttons, prices, section headings, table body
  h1:   40,    // Hero H1 ONLY

  // Legacy aliases — kept so existing component imports continue to compile.
  xs:    12,   // was 11 → meta
  sm:    14,   // was 13 → base
  md:    14,   // was 20 → base
  lg:    14,   // was 28 → base (section H2 — use fontWeight 700 for hierarchy)
  xl:    40,   // was 42 → h1
  num:   14,   // was 22 → base (stat numbers — use mono + 700 instead)
  numLg: 24,   // was 34 → dashboard primary balance (sole allowed exception)
} as const;

/** Font families */
export const F = {
  sans: "var(--font-sans, 'Geist', system-ui, sans-serif)",
  mono: "var(--font-mono, 'Geist Mono', monospace)",
} as const;

/**
 * Dashboard typography — Vercel-style compact scale.
 *
 * label 10px  Quiet uppercase labels: BALANCE, MENU, table headers.
 *             weight 500, color #A3A3A3, letterSpacing 0.04em.
 * body  13px  Nav, table rows, body text. weight 400/500.
 * title 14px  Page titles, card titles. weight 600.
 * numLg 21px  Balance and metrics — use F.sans + fontVariantNumeric tabular-nums.
 *             Do NOT use F.mono for balance/count numbers. weight 600.
 */
export const D = {
  label:  10,
  body:   13,
  title:  14,
  numLg:  21,
} as const;

/**
 * Website (marketing / landing) typography scale.
 * Use W.* in all landing page components instead of T.*.
 *
 * hero    36px  Hero H1 only.
 * section 18px  Section titles (h2) — "Compare prices", "Provider routes", etc.
 * card    14px  Card-level titles, sub-section headings.
 * body    13px  Body text, descriptions, nav items.
 * meta    10px  Labels, badges, table headers, eyebrow text.
 * code    12px  Code blocks, monospace UI.
 */
export const WS = {
  hero:    36,
  section: 18,
  card:    14,
  body:    13,
  meta:    10,
  code:    12,
} as const;

/** Design tokens shared across website and dashboard */
export const tokens = {
  borderMain:   "1px solid #E5E5E5",
  borderSoft:   "1px solid #EFEFEF",
  radiusBtn:    6,
  radiusCard:   8,
  radiusBadge:  999,
} as const;

/** Border shorthand — kept for backward compat */
export const border = "1px solid #e2e2e2";
export const borderInner = "1px solid #eeeeee";
