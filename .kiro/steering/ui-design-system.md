---
inclusion: fileMatch
fileMatchPattern: "**/{components,pages,app,styles}/**/*.{tsx,jsx,css,scss}"
---

# UI Design System - The Veris Chronicle (Old Newspaper + Modern Tech)

## Color Palette

### Primary Colors (Sepia & Ink)
```css
:root {
  /* Paper Tones */
  --paper-50: #fdfbf7;
  --paper-100: #f9f4e6;
  --paper-200: #f0e6cc;
  --paper-300: #e6d5aa;
  --paper-400: #dcc488;
  --paper-500: #d2b46e; /* Main aged paper color */
  --paper-600: #a89058;
  --paper-700: #7e6c42;
  --paper-800: #54482c;
  --paper-900: #2a2416;

  /* Ink Colors */
  --ink-50: #f2f2f2;
  --ink-100: #d9d9d9;
  --ink-200: #bfbfbf;
  --ink-300: #a6a6a6;
  --ink-400: #8c8c8c;
  --ink-500: #737373;
  --ink-600: #595959;
  --ink-700: #404040;
  --ink-800: #262626;
  --ink-900: #1a1a1a; /* Main text color */
  --ink-950: #0d0d0d;

  /* Tech Accents (Holographic/Glitch) */
  --tech-cyan: #00f3ff;
  --tech-magenta: #ff00ff;
  --tech-yellow: #ffff00;
  --tech-accent: rgba(0, 243, 255, 0.7);
}
```

### Semantic Colors
```css
:root {
  /* Status Colors (Muted/Stamped look) */
  --success: #2d5a27; /* Stamped Green */
  --warning: #8a6d3b; /* Aged Gold */
  --error: #8a1f1f;   /* Dried Blood Red */
  --info: #1f4e79;    /* Faded Blue Ink */

  /* Background Colors */
  --bg-primary: var(--paper-100);
  --bg-secondary: var(--paper-200);
  --bg-tertiary: var(--paper-300);
  --bg-dark: var(--ink-900);

  /* Text Colors */
  --text-primary: var(--ink-900);
  --text-secondary: var(--ink-700);
  --text-tertiary: var(--ink-600);
  --text-inverse: var(--paper-100);

  /* Border Colors */
  --border-light: var(--paper-300);
  --border-medium: var(--paper-400);
  --border-dark: var(--ink-800);
}
```

## Typography

### Font Families
```css
:root {
  /* Headlines - Classic Serif */
  --font-heading: 'Playfair Display', 'Times New Roman', serif;
  
  /* Body Text - Readable Serif */
  --font-body: 'Merriweather', 'Georgia', serif;
  
  /* Meta/Technical - Typewriter */
  --font-mono: 'Courier Prime', 'Courier New', monospace;
}
```

## Component Patterns

### Newspaper Card
```css
.newspaper-card {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-medium);
  padding: var(--space-4);
  box-shadow: 2px 2px 0px rgba(0,0,0,0.1);
  position: relative;
}

.newspaper-card::after {
  /* Paper texture overlay */
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: url("data:image/svg+xml,..."); /* Noise texture */
  opacity: 0.05;
  pointer-events: none;
}
```

### Glitch Effect (Modern Tech)
```css
.glitch-text {
  position: relative;
  animation: glitch-skew 1s infinite linear alternate-reverse;
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch-text::before {
  left: 2px;
  text-shadow: -1px 0 var(--tech-magenta);
  clip: rect(44px, 450px, 56px, 0);
  animation: glitch-anim 5s infinite linear alternate-reverse;
}

.glitch-text::after {
  left: -2px;
  text-shadow: -1px 0 var(--tech-cyan);
  clip: rect(44px, 450px, 56px, 0);
  animation: glitch-anim2 5s infinite linear alternate-reverse;
}
```

