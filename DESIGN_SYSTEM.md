# SnackHub - Monochrome Charcoal Design System

## 🎨 Color Palette

Your website now follows a **Monochrome Charcoal Layering Technique** with strategic Cyber Yellow accents.

### Core Colors

| Color Name | Hex Value | Usage | CSS Variable |
|-----------|-----------|-------|--------------|
| **Base Background** | `#0A0A0A` | Main page background | `--bg-base` |
| **Component Surface** | `#161616` | Cards, modals, navbars | `--bg-component` |
| **Hover State** | `#1F1F1F` | Card hover backgrounds | `--bg-hover` |
| **Borders** | `#262626` | 1px thin borders | `--border-color` |
| **Primary Text** | `#FFFFFF` | Headings, main text | `--text-primary` |
| **Secondary Text** | `#a1a1a6` | Navigation, secondary info | `--text-secondary` |
| **Muted Text** | `#71717A` | Tertiary labels, hints | `--text-muted` |
| **Accent (Primary)** | `#FACC15` | Buttons, prices, highlights | `--accent-primary` |
| **Accent (Hover)** | `#f5c707` | Button hover state | `--accent-hover` |

---

## 🏗️ Component Architecture

### 1. **Product Cards**
- **Background**: `#161616`
- **Border**: 1px `#262626`
- **On Hover**: Changes to `#1F1F1F` + border to `#FACC15`
- **Title**: `#FFFFFF` (semi-bold)
- **Category/Stock**: `#71717A` (muted)
- **Price**: `#FACC15` (bold, accent only)
- **Button**: `#FACC15` background, black text
- **Padding**: 24px (`p-6`)
- **Gap**: 24-32px between cards

### 2. **Navigation Bar**
- **Background**: `#161616`
- **Border**: 1px bottom `#262626`
- **Logo**: White text (no gradient needed)
- **Links**: `#a1a1a6` → hover to `#FACC15`
- **Admin Panel Button**: `#262626` bg → hover to `#FACC15`
- **Cart Badge**: `#FACC15` bg, black text
- **Logout Button**: `#FACC15` bg, black text

### 3. **Page Backgrounds**
- All pages use `#0A0A0A` (pure black base)
- Provides elevation contrast with `#161616` components

### 4. **Form Inputs & Controls**
- **Background**: `#0A0A0A`
- **Border**: 1px `#262626`
- **Focus Ring**: `#FACC15` with 2px ring
- **Text**: `#FFFFFF`
- **Labels**: `#a1a1a6`

### 5. **Status Indicators**
- **Pending**: `bg-[#FACC15]/20 text-[#FACC15]`
- **Confirmed/Preparing**: `bg-blue-500/20 text-blue-400`
- **Out for Delivery**: `bg-purple-500/20 text-purple-400`
- **Delivered**: `bg-green-500/20 text-green-400`
- **Cancelled**: `bg-red-500/20 text-red-400`

---

## 📐 Spacing Guidelines

| Element | Padding | Margin |
|---------|---------|--------|
| Product Cards | `p-6` (24px) | `gap-6` to `gap-8` |
| Page Container | `px-4 py-8` | `mx-auto` |
| Card Internal Sections | Dividers at 1px `#262626` | `mb-4` between sections |
| Buttons | `py-3 px-4` | `gap-2` (icons) |

---

## ✨ Design Principles

### Why This Works:

1. **Monochrome Base**: `#0A0A0A` and `#161616` create a unified dark material that feels premium
2. **Visual Hierarchy**: Lighter = closer. Cards lift naturally without loud colors
3. **Restraint**: Yellow is only used for:
   - Primary action buttons ("Add to Cart", "Checkout")
   - Price text
   - Hover states
   - Badge indicators
4. **Consistency**: All orange, navy, and purple gradients replaced with cohesive charcoal palette

---

## 🎯 Tailwind Classes Quick Reference

### Backgrounds
```tailwind
/* Page Background */
bg-[#0A0A0A]

/* Component Surfaces */
bg-[#161616]

/* Hover States */
hover:bg-[#1F1F1F]

/* Borders */
border border-[#262626]
```

### Text Colors
```tailwind
/* Primary */
text-white / text-[#FFFFFF]

/* Secondary */
text-[#a1a1a6]

/* Muted */
text-[#71717A]

/* Accent */
text-[#FACC15]
```

### Buttons
```tailwind
/* Primary Action */
bg-[#FACC15] text-black hover:bg-[#f5c707]

/* Secondary Action */
bg-[#262626] text-[#a1a1a6] hover:border-[#FACC15] hover:text-[#FACC15]
```

### Transitions
```tailwind
/* Smooth transitions */
transition-all duration-300

/* Hover lift effect */
whileHover={{ y: -8 }}
```

---

## 📦 Updated Components

The following components have been redesigned:

- ✅ **ProductCard.jsx** - Premium card with hover elevation
- ✅ **Navbar.jsx** - Sleek navigation bar
- ✅ **Home.jsx** - Category filter buttons updated
- ✅ **Cart.jsx** - Checkout flow redesigned
- ✅ **Checkout.jsx** - Form inputs with new color scheme
- ✅ **Orders.jsx** - Order status cards updated
- ✅ **SkeletonCard.jsx** - Loading states match design
- ✅ **App.css** - Global CSS variables set
- ✅ **index.css** - Root variables & scrollbar styling

---

## 🔄 Maintaining the Design

When adding new components:

1. Use CSS variables: `var(--bg-base)`, `var(--text-primary)`, etc.
2. Always apply 1px borders with `#262626`
3. Use `#FACC15` ONLY for primary actions and prices
4. Increase padding to at least `p-6` for cards
5. Maintain 24-32px gap between elements
6. Use `#161616` for any new card/modal surfaces
7. Test hover states with `bg-[#1F1F1F]` transition

---

## 🎨 CSS Variables (in index.css)

```css
:root {
  /* Monochrome Charcoal Palette */
  --bg-base: #0A0A0A;
  --bg-component: #161616;
  --bg-hover: #1F1F1F;
  --border-color: #262626;
  --text-primary: #FFFFFF;
  --text-secondary: #a1a1a6;
  --text-muted: #71717A;
  --accent-primary: #FACC15;
  --accent-hover: #f5c707;
}
```

---

## 🚀 Result

Your SnackHub website now has:
- ✨ **Premium, professional dark theme**
- 🎯 **Clear visual hierarchy** without clutter
- 🟡 **Strategic yellow accents** guiding user attention
- 🎨 **Cohesive monochrome foundation** with elevation depth
- 📱 **Consistent spacing & typography** across all pages
- ♿ **Improved contrast & readability**

The "messed up" look is gone. Everything now feels like premium e-commerce. 🎉
