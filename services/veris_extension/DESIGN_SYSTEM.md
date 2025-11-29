# 🎨 Design System - Veris Extension

Veris extension uses a professional and luxurious design system matching the web app theme.

## Color Palette

### Primary (Deep Blue - Trust & Professionalism)
- 50: `#eff6ff` - Lightest backgrounds
- 100: `#dbeafe` - Light backgrounds
- 500: `#3b82f6` - Main brand color
- 600: `#2563eb` - Primary actions
- 700: `#1d4ed8` - Hover states
- 900: `#1e3a8a` - Dark text

### Accent (Emerald - Success & Growth)
- 50: `#ecfdf5` - Success backgrounds
- 500: `#10b981` - Success indicators
- 600: `#059669` - Success hover

### Neutral (Slate - Modern & Clean)
- 50: `#f8fafc` - Page backgrounds
- 100: `#f1f5f9` - Card backgrounds
- 500: `#64748b` - Secondary text
- 900: `#0f172a` - Primary text

### Status Colors
- Success: `#22c55e` - Verified claims
- Danger: `#ef4444` - False claims
- Warning: `#f97316` - Disputed claims
- Neutral: `#64748b` - Unverifiable claims

## Typography

### Font Families
- Primary: `Inter` - Body text, UI elements
- Heading: `Poppins` - Headings, titles
- Monospace: `JetBrains Mono` - Code snippets

### Font Weights
- Light: 300
- Normal: 400
- Medium: 500
- Semibold: 600
- Bold: 700
- Extrabold: 800

## Components

### Buttons
```tsx
// Primary Button
<button className="btn-primary">Verify Claim</button>

// Secondary Button
<button className="btn-secondary">Cancel</button>
```

### Cards
```tsx
<div className="card">
  <h2>Card Title</h2>
  <p>Card content</p>
</div>
```

### Badges
```tsx
<span className="badge-verified">TRUE</span>
<span className="badge-false">FALSE</span>
<span className="badge-disputed">DISPUTED</span>
<span className="badge-unverifiable">UNVERIFIABLE</span>
```

## Shadows
- `shadow-sm`: Subtle elevation (1-2px)
- `shadow-md`: Medium elevation (4-6px)
- `shadow-lg`: Large elevation (10-15px)
- `shadow-xl`: Extra large elevation (20-25px)
- `shadow-2xl`: Maximum elevation (25-50px)

## Animations

### Available Animations
- `animate-fade-in`: Fade in with slide up
- `animate-slide-down`: Slide down from top
- `animate-scale-in`: Scale in from 95%

### Transitions
- Fast: 150ms
- Base: 200ms
- Slow: 300ms

## Spacing Scale
- 1: 4px
- 2: 8px
- 3: 12px
- 4: 16px
- 5: 20px
- 6: 24px
- 8: 32px
- 10: 40px
- 12: 48px
- 16: 64px

## Border Radius
- sm: 4px
- md: 6px
- lg: 8px
- xl: 12px
- 2xl: 16px
- 3xl: 24px
- full: 9999px

## Accessibility

### Focus States
All interactive elements have clear focus indicators:
```css
.button:focus {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}
```

### Color Contrast
- All text meets WCAG 2.1 AA standards (4.5:1 minimum)
- Status colors are distinguishable for color-blind users

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Tab order follows logical flow
- Escape key closes modals/dialogs

## Usage Examples

### Fact-Check Result Card
```tsx
<div className="card animate-scale-in">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xs font-bold text-neutral-700 uppercase">
      Verification Result
    </h2>
    <span className="badge-verified">TRUE</span>
  </div>
  <p className="text-sm text-neutral-700 leading-relaxed">
    This claim has been verified as accurate.
  </p>
</div>
```

### Loading State
```tsx
<button className="btn-primary" disabled={isLoading}>
  {isLoading ? (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
  ) : (
    'Verify Claim'
  )}
</button>
```

### Notification Toast
```tsx
<div className="bg-success-500 text-white p-3 rounded-xl shadow-xl animate-slide-down">
  <p className="text-sm font-medium">Claim verified successfully!</p>
</div>
```
