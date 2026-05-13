---
version: "alpha"
name: "Coldwave — Cold outreach that lands in primary"
description: "Coldwave Cold Pricing Section is designed for comparing plans and supporting conversion decisions. Key features include plan comparison blocks and conversion-oriented actions. It is suitable for subscription pricing pages and plan comparison experiences."
colors:
  primary: "#F5B867"
  secondary: "#DAB2EF"
  tertiary: "#80B2FF"
  neutral: "#1A1A1A"
  background: "#000000"
  surface: "#F2EBE1"
  text-primary: "#1A1A1A"
  text-secondary: "#666666"
  border: "#000000"
  accent: "#F5B867"
typography:
  display-lg:
    fontFamily: "Playfair Display"
    fontSize: "96px"
    fontWeight: 400
    lineHeight: "96px"
    letterSpacing: "-0.05em"
  body-md:
    fontFamily: "Space Mono"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "16px"
    letterSpacing: "0.1em"
    textTransform: "uppercase"
  label-md:
    fontFamily: "Space Mono"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "16px"
    letterSpacing: "1.2px"
    textTransform: "uppercase"
rounded:
  md: "0px"
spacing:
  base: "4px"
  sm: "1px"
  md: "2px"
  lg: "4px"
  xl: "8px"
  gap: "1px"
  card-padding: "14px"
  section-padding: "24px"
components:
  button-primary:
    backgroundColor: "{colors.background}"
    textColor: "{colors.surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "12px"
  button-secondary:
    textColor: "{colors.neutral}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "16px"
  button-link:
    textColor: "{colors.text-secondary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "0px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "32px"
---

## Overview

- **Composition cues:**
  - Layout: Grid
  - Content Width: Full Bleed
  - Framing: Framed
  - Grid: Strong

## Colors

The color system uses light mode with #F5B867 as the main accent and #1A1A1A as the neutral foundation.

- **Primary (#F5B867):** Main accent and emphasis color.
- **Secondary (#DAB2EF):** Supporting accent for secondary emphasis.
- **Tertiary (#80B2FF):** Reserved accent for supporting contrast moments.
- **Neutral (#1A1A1A):** Neutral foundation for backgrounds, surfaces, and supporting chrome.

- **Usage:** Background: #000000; Surface: #F2EBE1; Text Primary: #1A1A1A; Text Secondary: #666666; Border: #000000; Accent: #F5B867

## Typography

Typography pairs Playfair Display for display hierarchy with Space Mono for supporting content and interface copy.

- **Display (`display-lg`):** Playfair Display, 96px, weight 400, line-height 96px, letter-spacing -0.05em.
- **Body (`body-md`):** Space Mono, 12px, weight 400, line-height 16px, letter-spacing 0.1em, uppercase.
- **Labels (`label-md`):** Space Mono, 12px, weight 400, line-height 16px, letter-spacing 1.2px, uppercase.

## Layout

Layout follows a grid composition with reusable spacing tokens. Preserve the grid, full bleed structural frame before changing ornament or component styling. Use 4px as the base rhythm and let larger gaps step up from that cadence instead of introducing unrelated spacing values.

Treat the page as a grid / full bleed composition, and keep that framing stable when adding or remixing sections.

- **Layout type:** Grid
- **Content width:** Full Bleed
- **Base unit:** 4px
- **Scale:** 1px, 2px, 4px, 8px, 12px, 16px, 24px, 32px
- **Section padding:** 24px, 32px, 40px, 64px
- **Card padding:** 14px, 24px, 32px, 40px
- **Gaps:** 1px, 8px, 12px, 16px

## Elevation & Depth

Depth is communicated through outlined, border contrast, and reusable shadow or blur treatments. Keep those recipes consistent across hero panels, cards, and controls so the page reads as one material system.

Surfaces should read as outlined first, with borders, shadows, and blur only reinforcing that material choice.

- **Surface style:** Outlined
- **Borders:** 0.56px #000000; 0.56px #F2EBE1

### Techniques
- **Gradient border shell:** Use a thin gradient border shell around the main card. Wrap the surface in an outer shell with 1px padding and a 0px radius. Drive the shell with linear-gradient(135deg, rgba(218, 178, 239, 0.6), rgba(241, 172, 255, 0.2), rgba(0, 0, 0, 0)) so the edge reads like premium depth instead of a flat stroke. Keep the actual stroke understated so the gradient shell remains the hero edge treatment. Inset the real content surface inside the wrapper with a slightly smaller radius so the gradient only appears as a hairline frame.

## Shapes

Shapes rely on a tight radius system anchored by 9999px and scaled across cards, buttons, and supporting surfaces. Icon geometry should stay compatible with that soft-to-controlled silhouette.

Use the radius family intentionally: larger surfaces can open up, but controls and badges should stay within the same rounded DNA instead of inventing sharper or pill-only exceptions.

- **Corner radii:** 9999px
- **Icon treatment:** Linear
- **Icon sets:** Solar

## Components

Anchor interactions to the detected button styles. Reuse the existing card surface recipe for content blocks.

### Buttons
- **Primary:** background #000000, text #F2EBE1, radius 0px, padding 12px, border 0px solid rgb(229, 231, 235).
- **Secondary:** text #1A1A1A, radius 0px, padding 16px, border 0.555556px 0px 0px solid rgba(0, 0, 0, 0.15).
- **Links:** text #666666, radius 0px, padding 0px, border 0px solid rgb(229, 231, 235).

### Cards and Surfaces
- **Card surface:** background #F2EBE1, border 0px solid rgb(229, 231, 235), radius 0px, padding 32px, shadow none.
- **Card surface:** border 0.555556px solid rgba(0, 0, 0, 0.1), radius 0px, padding 24px, shadow none.
- **Card surface:** border 0.555556px solid rgba(0, 0, 0, 0.15), radius 0px, padding 32px, shadow none.

### Iconography
- **Treatment:** Linear.
- **Sets:** Solar.

## Do's and Don'ts

Use these constraints to keep future generations aligned with the current system instead of drifting into adjacent styles.

### Do
- Do use the primary palette as the main accent for emphasis and action states.
- Do keep spacing aligned to the detected 4px rhythm.
- Do reuse the Outlined surface treatment consistently across cards and controls.
- Do keep corner radii within the detected 9999px family.

### Don't
- Don't introduce extra accent colors outside the core palette roles unless the page needs a new semantic state.
- Don't exceed the detected moderate motion intensity without a deliberate reason.

## Motion

Motion feels controlled and interface-led across text, layout, and section transitions. Timing clusters around 150ms. Easing favors ease and cubic-bezier(0.4. Hover behavior focuses on opacity and text changes. Scroll choreography uses GSAP ScrollTrigger for section reveals and pacing.

**Motion Level:** moderate

**Durations:** 150ms

**Easings:** ease, cubic-bezier(0.4, 0, 0.2, 1)

**Hover Patterns:** opacity, text, stroke, color

**Scroll Patterns:** gsap-scrolltrigger
