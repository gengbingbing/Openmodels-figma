Alephant CSS Design System Optimization Request
Please optimize Alephant’s UI design system at the CSS / design-token level only, using a Vercel / Geist-inspired product UI direction.

Goal
Alephant should feel more consistent, restrained, and system-driven across the product:

Neutral grayscale foundation
Crisp border hierarchy
Minimal shadow
Compact product UI density
Consistent component sizing
Clear overlay and surface roles
Reusable typography styles
Clear separation between tabs, segmented controls, chips, and badges
This work should focus on CSS foundations and shared UI styling, not page structure or business logic.

1. Foundations to Optimize
1.1 Surface System
Please define a clear surface token system:

Surface	Purpose
Page	Main app canvas
Panel	Layout shell, sidebar, page sections
Card	Standard content container
Raised	Toolbar or secondary raised area
Overlay	Modal, drawer, popover content surface
Backdrop	Modal / drawer dimming layer
Important:

Overlay surface and Backdrop scrim must be separate visual concepts.
Popover, modal, drawer content should not use the same token meaning as the dimming backdrop.
1.2 Elevation System
Please define a restrained elevation map:

Elevation	Use
Flat	Default cards and panels
Hover	Interactive card hover
Popover	Dropdown, Select menu, Popover, Command menu
Modal	Dialog / Alert dialog
Drawer	Side sheets and detail panels
For each level, define:

Background surface
Border treatment
Radius
Shadow strength
Dark mode treatment
1.3 Radius System
Please finalize radius roles:

Radius Role	Usage
Control	Buttons, inputs, selects
Card	Standard cards and table containers
Overlay	Popovers and dropdowns
Modal	Dialogs and larger overlays
Pill	Badges, chips, avatars, switches
Direction:

Keep controls restrained
Avoid large-radius cards as the default product style
Use pill radius only for clearly pill-like components
1.4 Typography System
Please define reusable UI text styles instead of page-specific arbitrary text styling.

Required text styles:

Text Style	Use
Page Title	Main product page title
Section Title	Major section heading
Panel Title	Card / modal / drawer title
Body	Default product text
Label	Form label / metadata label
Caption	Helper and secondary text
Table Header	Column heading
Table Body	Dense table text
Metric	KPI number
Code / Mono	Keys, IDs, request paths
For each style, define:

Font size
Line height
Weight
Letter spacing
Uppercase rule if any
Sans vs Mono usage
Direction:

Reduce overuse of uppercase + wide tracking
Keep labels consistent
Avoid arbitrary micro text styles becoming default UI typography
2. Shared Components to Standardize
Please provide CSS-oriented specs for:

Button
Icon Button
Input
Select
Textarea
Card
Table
Badge
Status Pill
Filter Chip
Tier Tag
Primary Tabs
Secondary Tabs
Segmented Control
Popover
Dropdown / Select Menu
Modal
Drawer
3. Key Component Separations
3.1 Tabs vs Segmented Control
Please clearly separate:

Component	Use
Primary Tabs	Page-level section navigation
Secondary Tabs	In-panel content switching
Segmented Control	Mode switch / binary or ternary choice
Filter Chips	Quick filters and scopes
Recommended direction:

Primary tabs should use a clean navigation style, such as underline or border-based selection
Segmented control should remain an enclosed compact switch
Filter chips should be visually lighter than buttons
Please provide default, hover, active, focus, and disabled states.

3.2 Overlay Components
Please define a consistent visual system for:

Modal
Drawer
Popover
Dropdown / Select menu
Modal
Define:

Surface
Backdrop
Border
Radius
Shadow
Header/footer spacing
Close button size
Drawer
Define:

Surface
Side border
Radius rule
Shadow
Width sizes
Header/footer spacing
Close button size
Popover / Dropdown
Define:

Surface
Border
Radius
Shadow
Item hover and active states
3.3 Badge vs Status Pill vs Filter Chip vs Tier Tag
Please keep these visually distinct:

Component	Purpose
Badge	Static metadata
Status Pill	Semantic state, e.g. Active / Warning / Error
Filter Chip	Clickable scope or filter
Tier Tag	Plan label, e.g. Free / Pro / Team / Enterprise
They should not all look like variants of the same badge.

4. Control Sizing
Please define the final sizing matrix.

Buttons
XS
SM
MD
LG
Icon SM
Icon MD
Icon LG
Form Controls
Compact
Default
Modal / overlay usage if different
Direction:

Default buttons and default form controls should align visually in height
Modal and drawer footer buttons should be consistent
Icon button sizes should use a limited fixed scale
5. Dark Mode
Please include dark mode specs for:

Surface hierarchy
Border contrast
Overlay surface
Backdrop darkness
Popover / modal / drawer shadow
Focus states
Brand accent contrast
Status colors
Dark mode should preserve hierarchy without relying on overly heavy shadows.

6. Visual Direction
Use this direction:

Vercel / Geist-inspired product UI
Border-first hierarchy
Neutral surfaces
Minimal elevation
Compact information density
Clear component roles
Consistent typography and spacing
Avoid:

Decorative shadow-heavy cards
Large-radius default dashboard cards
Tabs and segmented controls sharing the same visual identity
Treating modal surface and backdrop as the same concept
Too many arbitrary text sizes
Too many shadow levels
Too many independent radius values
7. Deliverables
Please provide:

Foundations
Surface token map
Elevation token map
Radius token map
Typography style map
Control size map
Dark mode mapping
Component specs
Buttons and icon buttons
Form controls
Cards and tables
Badge / Status Pill / Filter Chip / Tier Tag
Tabs / Segmented Control
Popover / Dropdown
Modal / Drawer
Reference examples
Please show examples of:

Dashboard cards
Table with toolbar and filters
Modal
Drawer
Popover / dropdown
Tabs vs segmented control
8. Priority
P0
Surface semantics
Overlay surface vs backdrop separation
Modal / Drawer / Popover elevation mapping
Tabs vs Segmented Control separation
P1
Typography UI styles
Radius finalization
Control sizing matrix
Badge / Status / Chip / Tier Tag separation
P2
Dark mode refinement
Migration guidance for older CSS patterns
Final Request
Please optimize Alephant’s CSS design system toward a Vercel / Geist-inspired product UI, focusing on shared CSS foundations and component rules: surfaces, overlay/backdrop separation, elevation, radius, typography, control sizing, tabs vs segmented controls, modal/drawer/popover consistency, and badge/status/filter