# Performance Rules

## ⚡ Performance Protocol

**Read `@[skills/performance-profiling]` for optimization strategies.**

### 1. Core Web Vitals
- Optimize for LCP (Largest Contentful Paint).
- Minimize CLS (Cumulative Layout Shift).
- Ensure low FID/INP (Interaction Next Paint).

### 2. Code Efficiency
- **Lazy Loading**: Import heavy components/libraries only when needed.
- **Bundle Size**: Monitor import costs. Use `import { x }` instead of `import *`.
- **Memoization**: Use `useMemo`/`useCallback` appropriately (don't overuse).

### 3. Image Optimization
- Use WebP/AVIF formats.
- Explicitly set width/height attributes to prevent layout shifts.
