---
name: Digital Artisan
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#20201f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e5e2e1'
  on-surface-variant: '#bdcab8'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#889484'
  outline-variant: '#3e4a3c'
  surface-tint: '#6bde71'
  primary: '#6bde71'
  on-primary: '#00390c'
  primary-container: '#36ab45'
  on-primary-container: '#00370b'
  inverse-primary: '#006e1f'
  secondary: '#98d862'
  on-secondary: '#1a3700'
  secondary-container: '#3b7300'
  on-secondary-container: '#b4f77c'
  tertiary: '#c5c7c5'
  on-tertiary: '#2e3130'
  tertiary-container: '#949694'
  on-tertiary-container: '#2c2f2e'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#88fb8a'
  primary-fixed-dim: '#6bde71'
  on-primary-fixed: '#002204'
  on-primary-fixed-variant: '#005315'
  secondary-fixed: '#b3f57b'
  secondary-fixed-dim: '#98d862'
  on-secondary-fixed: '#0c2000'
  on-secondary-fixed-variant: '#285000'
  tertiary-fixed: '#e1e3e1'
  tertiary-fixed-dim: '#c5c7c5'
  on-tertiary-fixed: '#191c1b'
  on-tertiary-fixed-variant: '#454746'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353535'
typography:
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Space Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-mono:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin: 32px
---

## Brand & Style

The design system is anchored in a "Developer-Centric Minimalism" aesthetic. It targets a professional yet creative audience, specifically within the tech and design sectors. The UI is designed to evoke a sense of precision, technical proficiency, and modern sophistication.

The visual style merges **Minimalism** with elements of **Soft Brutalism**. It prioritizes high-contrast readability and a "dark mode first" philosophy. By utilizing monospaced-inspired typography and a vibrant green accent palette, the design system mimics the focused environment of a code editor while maintaining the refined polish of a premium portfolio. The atmosphere is intentional, clean, and engineered.

## Colors

The color palette is built on a high-contrast dark foundation. The primary background utilizes a deep, near-black neutral to provide maximum depth. 

- **Primary & Secondary Greens:** These are used exclusively for highlights, calls to action, and interactive states. The vibrant primary green (#36AB45) signals growth and "system-ready" status, while the secondary lighter green (#7DBB49) provides a softer alternative for secondary actions or gradients.
- **Tertiary/Ink:** The off-white (#F9FAF8) is the primary color for typography and icons, ensuring high legibility against the dark background without the harshness of pure white.
- **Neutral:** The base surface (#1A1A1A) provides a consistent canvas for all components.

## Typography

This design system uses **Space Grotesk** across all levels to capture a technical, geometric, and futuristic spirit that mirrors the monospaced aesthetic of the brand's source. 

Headlines are bold and tightly tracked to create impact. Body text maintains a generous line height to ensure long-form content remains accessible. Labels and small metadata should be set in a "mono" style (uppercase with increased letter spacing) to reinforce the developer-centric aesthetic. The typography is the primary vehicle for the brand’s "engineered" personality.

## Layout & Spacing

The layout follows a **Fluid Grid** model with a standard 12-column structure for desktop. The spacing rhythm is strictly based on an 8px modular scale to ensure mathematical harmony across the UI.

Components should utilize generous internal padding (`md` or 24px) to create a sense of breathability within the dark interface. Gutters are kept consistent at 24px to provide clear separation of content blocks. On mobile devices, side margins should shrink to 20px while maintaining the vertical rhythm.

## Elevation & Depth

This design system rejects heavy shadows in favor of **Tonal Layers** and **Low-Contrast Outlines**. 

Depth is communicated through subtle shifts in surface color. Primary surfaces use the base neutral, while elevated elements (like cards or menus) use a slightly lighter grey hex or a semi-transparent white overlay at 5% opacity. 

To define boundaries, use **1px solid borders** using a muted version of the secondary green or a dark grey. This creates a "blueprint" or "wireframe" feel that aligns with the professional portfolio aesthetic. Interaction is shown through color fills rather than vertical lifts.

## Shapes

The shape language is "Soft-Technical." By choosing a **Soft (0.25rem)** roundedness, the UI maintains a structured and precise appearance without feeling aggressive or sharp. 

Buttons, cards, and input fields all share this consistent corner radius. Large containers may occasionally use `rounded-lg` (0.5rem) to provide a subtle hierarchy, but the primary aesthetic should feel clipped and intentional.

## Components

### Buttons
- **Primary:** Solid Primary Green background with Dark Neutral text. No shadow, 1px border of the same green.
- **Secondary:** Transparent background with a Primary Green 1px border and Primary Green text.
- **Ghost:** No background, white text, underlines on hover.

### Cards
- Cards use a slightly lighter neutral background than the main page. 
- They feature a 1px border in a low-opacity white or dark grey.
- Content inside cards should be padded with the `md` spacing unit.

### Inputs & Form Elements
- Inputs are dark-filled with a 1px border that turns Primary Green on focus.
- Labels sit above the field in the `label-mono` type style.
- Checkboxes and Radios are custom-styled using the Primary Green for the "checked" state.

### Chips & Tags
- Used for "Skills" or "Categories." 
- Small, `label-mono` text.
- Subtle green border with a 5% green tint background.

### Navigation
- Top-aligned, fixed on scroll with a backdrop-blur (Glassmorphism) effect to maintain context while keeping the "dark mode" depth.