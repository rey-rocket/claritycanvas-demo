# Clarity Canvas Brand Guide

This file documents the visual language and tokens extracted from your original Base44 project so you can style the new project to match.

---

## 1. Brand Overview

**Brand feel:** calm, organised, optimistic, “friendly data dashboard”.

**Core ideas**

- Light, almost pastel background with strong teal/green brand color.
- High contrast for important text (dark blue-grey), no pure black.
- Heavy use of rounded corners and pill shapes.
- Subtle shadows, very few harsh borders.

---

## 2. Design Tokens (CSS Custom Properties)

You can drop these straight into a global CSS file (for non‑Tailwind usage):

```css
:root {
  /* Colors */
  --cc-teal: #2F7379;
  --cc-teal-dark: #246C6C;
  --cc-lime: #ABCA20;
  --cc-lime-soft: #D7E77C;
  --cc-coral: #FF6F61;
  --cc-blue-pill: #D9E4FF;
  --cc-blue-pill-text: #3056D3;
  --cc-red-pill: #FF4A4A;
  --cc-green-good: #36A852;

  --cc-bg: #F9FAFB;
  --cc-surface: #FFFFFF;
  --cc-surface-soft: #E9FBF7;
  --cc-border-subtle: #E5E7EB;
  --cc-border-strong: #D1D5DB;
  --cc-text-main: #111827;
  --cc-text-muted: #6B7280;
  --cc-text-soft: #9CA3AF;

  --cc-gradient-primary: linear-gradient(90deg, #246C6C 0%, #ABCA20 100%);

  /* Typography */
  --cc-font-display: "Poppins", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --cc-font-body: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  /* Radii */
  --cc-radius-lg: 20px;
  --cc-radius-md: 16px;
  --cc-radius-sm: 12px;
  --cc-radius-pill: 9999px;

  /* Spacing */
  --cc-space-page: 32px;
  --cc-space-section: 24px;
  --cc-space-card: 24px;

  /* Shadows */
  --cc-shadow-card: 0 14px 28px rgba(15, 23, 42, 0.08);
  --cc-shadow-tile: 0 10px 18px rgba(15, 23, 42, 0.06);
  --cc-shadow-btn-primary: 0 10px 20px rgba(36, 108, 108, 0.25);
  --cc-shadow-btn-secondary: 0 6px 15px rgba(15, 23, 42, 0.06);
  --cc-shadow-soft: 0 6px 14px rgba(15, 23, 42, 0.04);
}
```

---

## 3. Tailwind Configuration

### 3.1 Basic `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        cc: {
          teal: "#2F7379",
          "teal-dark": "#246C6C",
          lime: "#ABCA20",
          "lime-soft": "#D7E77C",
          coral: "#FF6F61",
          "blue-pill": "#D9E4FF",
          "blue-pill-text": "#3056D3",
          "red-pill": "#FF4A4A",
          "green-good": "#36A852",
          bg: "#F9FAFB",
          surface: "#FFFFFF",
          "surface-soft": "#E9FBF7",
          "border-subtle": "#E5E7EB",
          "border-strong": "#D1D5DB",
          "text-main": "#111827",
          "text-muted": "#6B7280",
          "text-soft": "#9CA3AF"
        }
      },
      fontFamily: {
        display: ["Poppins", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"]
      },
      borderRadius: {
        lg: "20px",
        md: "16px",
        sm: "12px",
        pill: "9999px"
      },
      boxShadow: {
        card: "0 14px 28px rgba(15, 23, 42, 0.08)",
        tile: "0 10px 18px rgba(15, 23, 42, 0.06)",
        "btn-primary": "0 10px 20px rgba(36, 108, 108, 0.25)",
        "btn-secondary": "0 6px 15px rgba(15, 23, 42, 0.06)",
        soft: "0 6px 14px rgba(15, 23, 42, 0.04)"
      },
      spacing: {
        page: "32px",
        section: "24px",
        card: "24px"
      },
      backgroundImage: {
        "gradient-cc-primary": "linear-gradient(90deg, #246C6C 0%, #ABCA20 100%)"
      }
    }
  },
  plugins: []
};
```

### 3.2 Tailwind usage examples

```html
<!-- Page background -->
<body class="min-h-screen bg-cc-bg font-body text-cc-text-main">

<!-- Top bar with logo + primary CTA -->
<header class="flex items-center justify-between px-page py-6">
  <div class="text-2xl font-display font-bold">
    <span class="text-cc-teal-dark">The Clarity</span>
    <span class="bg-gradient-cc-primary bg-clip-text text-transparent"> Canvas</span>
  </div>

  <button class="shadow-btn-primary bg-gradient-cc-primary text-white rounded-pill px-6 py-2 font-display text-sm font-semibold">
    + New Project
  </button>
</header>

<!-- KPI tile -->
<div class="bg-cc-surface rounded-md shadow-tile p-card">
  <p class="text-xs font-medium text-cc-text-muted mb-1">Weekly Workload (All IDs)</p>
  <p class="text-2xl font-display font-bold text-cc-teal-dark">39 hrs</p>
  <p class="text-xs text-cc-green-good font-semibold mt-1">1 hrs remaining</p>
</div>
```

---

## 4. Design Tokens JSON

Use this if you prefer a single JSON source of truth (e.g. for a design system, theming, or to feed both Tailwind and other platforms).

```json
{
  "colors": {
    "teal": "#2F7379",
    "tealDark": "#246C6C",
    "lime": "#ABCA20",
    "limeSoft": "#D7E77C",
    "coral": "#FF6F61",
    "bluePill": "#D9E4FF",
    "bluePillText": "#3056D3",
    "redPill": "#FF4A4A",
    "greenGood": "#36A852",
    "bg": "#F9FAFB",
    "surface": "#FFFFFF",
    "surfaceSoft": "#E9FBF7",
    "borderSubtle": "#E5E7EB",
    "borderStrong": "#D1D5DB",
    "textMain": "#111827",
    "textMuted": "#6B7280",
    "textSoft": "#9CA3AF"
  },
  "typography": {
    "fontDisplay": "\"Poppins\", system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
    "fontBody": "\"Inter\", system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
    "baseFontSize": 16,
    "scale": {
      "logo": 32,
      "sectionHeading": 24,
      "cardTitle": 18,
      "metricNumber": 22,
      "body": 14,
      "meta": 12
    }
  },
  "radii": {
    "lg": 20,
    "md": 16,
    "sm": 12,
    "pill": 9999
  },
  "spacing": {
    "page": 32,
    "section": 24,
    "card": 24
  },
  "shadows": {
    "card": "0 14px 28px rgba(15, 23, 42, 0.08)",
    "tile": "0 10px 18px rgba(15, 23, 42, 0.06)",
    "buttonPrimary": "0 10px 20px rgba(36, 108, 108, 0.25)",
    "buttonSecondary": "0 6px 15px rgba(15, 23, 42, 0.06)",
    "soft": "0 6px 14px rgba(15, 23, 42, 0.04)"
  },
  "gradients": {
    "primary": "linear-gradient(90deg, #246C6C 0%, #ABCA20 100%)"
  }
}
```

---

## 5. Implementation Notes

- Consider installing the fonts via Google Fonts or hosting them locally: **Poppins** (for display) and **Inter** (for body).
- For best visual match, keep most cards on white (`bg-cc-surface`) over the soft grey app background (`bg-cc-bg`), and rely on shadows rather than borders to separate layers.
- Use pill radii (`rounded-pill`) for buttons, badges, and small key UI elements to keep the “friendly” feeling consistent.

This guide should be enough to recreate the original Base44 UI very closely in Tailwind / React or any other stack.
