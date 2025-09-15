# Design System - Dark Mode Mobile-First

## Core Principles

### 1. Mobile-First Approach
- Design for mobile screens first (375px - 414px)
- Progressive enhancement for larger screens
- Touch-friendly interactions (min 44px tap targets)
- Thumb-reachable UI elements

### 2. Dark Mode Native
- Dark backgrounds reduce eye strain on mobile
- OLED-friendly pure blacks save battery
- High contrast for outdoor readability
- Subtle gradients to create depth

## Color Palette

### Primary Colors
```css
/* Background Hierarchy */
--bg-primary: #000000;        /* Pure black - main background */
--bg-secondary: #0A0A0A;      /* Near black - cards/sections */
--bg-tertiary: #141414;       /* Lighter black - elevated surfaces */
--bg-hover: #1F1F1F;          /* Hover states */

/* Accent Colors */
--accent-primary: #3B82F6;    /* Blue - primary actions */
--accent-success: #10B981;    /* Green - success states */
--accent-danger: #EF4444;     /* Red - errors/destructive */
--accent-warning: #F59E0B;    /* Amber - warnings */

/* Text Hierarchy */
--text-primary: #FFFFFF;      /* Primary text */
--text-secondary: #A1A1AA;    /* Secondary text */
--text-tertiary: #71717A;     /* Disabled/hints */
--text-inverse: #000000;      /* On light backgrounds */

/* Borders & Dividers */
--border-subtle: #1F1F1F;     /* Subtle borders */
--border-default: #27272A;    /* Default borders */
--border-strong: #3F3F46;     /* Strong borders/focus */
```

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
```

### Type Scale (Mobile-First)
```css
/* Headings */
.text-display: text-4xl (36px) leading-tight font-bold
.text-h1: text-3xl (30px) leading-tight font-bold
.text-h2: text-2xl (24px) leading-snug font-semibold
.text-h3: text-xl (20px) leading-snug font-semibold

/* Body */
.text-body-lg: text-lg (18px) leading-relaxed font-normal
.text-body: text-base (16px) leading-relaxed font-normal
.text-body-sm: text-sm (14px) leading-relaxed font-normal

/* UI Text */
.text-caption: text-xs (12px) leading-normal font-medium
.text-overline: text-xs (12px) leading-normal font-semibold uppercase tracking-wider
```

## Spacing System

### Base Unit: 4px
```css
/* Padding/Margin Scale */
spacing-0: 0
spacing-1: 0.25rem (4px)
spacing-2: 0.5rem (8px)
spacing-3: 0.75rem (12px)
spacing-4: 1rem (16px)
spacing-5: 1.25rem (20px)
spacing-6: 1.5rem (24px)
spacing-8: 2rem (32px)
spacing-10: 2.5rem (40px)
spacing-12: 3rem (48px)
spacing-16: 4rem (64px)
```

## Component Patterns

### Buttons

#### Primary Button
```jsx
className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 
          text-white font-medium rounded-xl transition-all duration-200 
          transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
```

#### Secondary Button
```jsx
className="w-full px-6 py-3 bg-gray-800 hover:bg-gray-700 active:bg-gray-900 
          text-gray-100 font-medium rounded-xl border border-gray-700 
          transition-all duration-200 transform active:scale-95"
```

#### Ghost Button
```jsx
className="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800/50 
          rounded-lg transition-all duration-200"
```

### Input Fields

#### Text Input
```jsx
className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl
          text-white placeholder-gray-500 
          focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
          focus:outline-none transition-all duration-200"
```

#### Input with Error
```jsx
className="w-full px-4 py-3 bg-gray-900 border border-red-500/50 rounded-xl
          text-white placeholder-gray-500 
          focus:border-red-500 focus:ring-2 focus:ring-red-500/20 
          focus:outline-none transition-all duration-200"
```

### Cards

#### Basic Card
```jsx
className="bg-gray-900 border border-gray-800 rounded-2xl p-6 
          shadow-xl shadow-black/20"
```

#### Interactive Card
```jsx
className="bg-gray-900 border border-gray-800 rounded-2xl p-6 
          hover:bg-gray-800 hover:border-gray-700 
          transition-all duration-200 cursor-pointer
          shadow-xl shadow-black/20 hover:shadow-2xl"
```

### Modals/Sheets

#### Bottom Sheet (Mobile)
```jsx
className="fixed bottom-0 left-0 right-0 bg-gray-900 
          rounded-t-3xl border-t border-gray-800 
          p-6 pb-safe shadow-2xl shadow-black/40
          animate-slide-up"
```

#### Modal Overlay
```jsx
className="fixed inset-0 bg-black/80 backdrop-blur-sm 
          animate-fade-in"
```

### Navigation

#### Bottom Navigation (Mobile)
```jsx
className="fixed bottom-0 left-0 right-0 bg-gray-900/95 
          backdrop-blur-md border-t border-gray-800 
          px-4 pb-safe pt-2"
```

#### Tab Bar
```jsx
className="flex space-x-1 bg-gray-900 p-1 rounded-xl"

// Tab Item
className="flex-1 px-4 py-2 text-sm font-medium rounded-lg
          text-gray-400 hover:text-white 
          data-[state=active]:bg-gray-800 
          data-[state=active]:text-white
          transition-all duration-200"
```

### Lists

#### List Item
```jsx
className="flex items-center justify-between p-4 
          hover:bg-gray-800/50 active:bg-gray-800 
          transition-colors duration-200"
```

#### Swipeable List Item
```jsx
className="relative overflow-hidden rounded-xl bg-gray-900 
          border border-gray-800 mb-2"
```

## Animations

### Micro-interactions
```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Up */
@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

/* Scale */
@keyframes scale {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
```

### Tailwind Animation Classes
```jsx
animate-fade-in: animation: fadeIn 0.2s ease-out
animate-slide-up: animation: slideUp 0.3s ease-out
animate-scale: animation: scale 0.2s ease-out
```

## Mobile-Specific Utilities

### Safe Areas (iOS)
```css
/* Padding for notch/home indicator */
.pt-safe: padding-top: env(safe-area-inset-top);
.pb-safe: padding-bottom: env(safe-area-inset-bottom);
.px-safe: padding-left: env(safe-area-inset-left); 
          padding-right: env(safe-area-inset-right);
```

### Touch Interactions
```css
/* Prevent text selection on touch */
.select-none: user-select: none;

/* Smooth scrolling with momentum */
.scroll-smooth: scroll-behavior: smooth;
.overflow-touch: -webkit-overflow-scrolling: touch;

/* Tap highlight removal */
.tap-transparent: -webkit-tap-highlight-color: transparent;
```

## Responsive Breakpoints

```css
/* Mobile First */
sm: 640px   /* Large phones */
md: 768px   /* Tablets */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

## Best Practices

### 1. Performance
- Use `transform` and `opacity` for animations
- Minimize re-paints with `will-change` sparingly
- Lazy load images and heavy components
- Use CSS containment for complex layouts

### 2. Accessibility
- Maintain WCAG AA contrast ratios (4.5:1 minimum)
- Include focus states for all interactive elements
- Use semantic HTML elements
- Add proper ARIA labels

### 3. Touch Optimization
- Minimum 44px touch targets
- Add adequate spacing between interactive elements
- Use `active` states for touch feedback
- Implement swipe gestures where appropriate

### 4. Dark Mode Considerations
- Avoid pure white (#FFFFFF) text on pure black
- Use subtle shadows with transparency
- Implement smooth transitions when toggling themes
- Test in both light and dark environments

## Example Component

```jsx
// Modern Mobile Card Component
<div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 
                shadow-xl shadow-black/20 space-y-4">
  <div className="flex items-center justify-between">
    <h3 className="text-xl font-semibold text-white">Card Title</h3>
    <span className="text-sm text-gray-400">2m ago</span>
  </div>
  
  <p className="text-gray-300 leading-relaxed">
    Card content with proper spacing and readability for mobile devices.
  </p>
  
  <div className="flex gap-3">
    <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 
                       active:bg-blue-800 text-white font-medium rounded-xl 
                       transition-all duration-200 transform active:scale-95">
      Primary Action
    </button>
    <button className="px-4 py-2 text-gray-400 hover:text-white 
                       hover:bg-gray-800/50 rounded-xl transition-all duration-200">
      Cancel
    </button>
  </div>
</div>
```

## Tailwind Config Extensions

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gray: {
          900: '#0A0A0A',
          800: '#141414',
          700: '#1F1F1F',
          600: '#27272A',
          500: '#3F3F46',
          400: '#71717A',
          300: '#A1A1AA',
          200: '#D4D4D8',
          100: '#F4F4F5',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale': 'scale 0.2s ease-out',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      }
    }
  }
}
```