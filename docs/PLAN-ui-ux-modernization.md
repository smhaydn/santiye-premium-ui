# PLAN: UI/UX Modernization - Santiye Yoneticisi

> This plan outlines the modernization of the Construction Management ERP UI/UX, focusing on a corporate, professional, and mobile-responsive approach while maintaining the core structure.

## Phase 0: Socratic Gate (Context Validation)
*To be confirmed by the user before proceeding to implementation.*

1. **Branding Confirmation**: The Design System suggests a Purple (`#7C3AED`) and Orange (`#F97316`) accent theme. Does this match your vision for "corporate and professional" or would you prefer a more traditional "Construction Blue" or "Neutral Slate" theme?
2. **Layout Transition**: We plan to move from a fixed sidebar to a "Floating Glass Sidebar" that becomes a bottom drawer or hamburger menu on mobile. Is this acceptable?
3. **Typography**: We will replace the default font with Poppins (Headings) and Open Sans (Body). Any specific font preferences for a "premium" feel?

---

## Phase 1: Foundation & Global Styling
- **Task 1.1**: update `tailwind.config.ts` with the new design tokens (Primary, Secondary, Accent, Spacing, Shadows).
- **Task 1.2**: Update `src/app/globals.css` with Google Fonts imports and base layer styles (Swiss Style principles).
- **Task 1.3**: Configure `next-themes` for seamless Dark Mode transition.

## Phase 2: Layout Re-engineering
- **Task 2.1**: Modernize `src/components/layout/sidebar.tsx`. 
    - Implement a floating/detached design.
    - Add active state indicators with subtle animations.
- **Task 2.2**: Update `src/components/layout/header.tsx`.
    - Add `backdrop-blur` (glassmorphism).
    - Modernize the user profile/notifications section.
- **Task 2.3**: Make the Layout fully responsive across all breakpoints (375px to 1440px).

## Phase 3: Component Library Modernization
- **Task 3.1**: Refactor `src/components/ui/card.tsx`.
    - Implement the "Swiss Style" card pattern (layered shadows, clean indices).
- **Task 3.2**: Refactor `src/components/ui/button.tsx`.
    - Add hover/active states with `framer-motion` for micro-interactions.
- **Task 3.3**: Replace all emojis with **Lucide-React** duotone icons.

## Phase 4: Core Pages Modernization
- **Task 4.1**: Update `src/app/page.tsx` (Dashboard).
    - Implement "Loft 777" premium style for widgets.
    - Add data visualization components for upcoming payments.
- **Task 4.2**: Standardize Form and Table layouts across all sub-pages (Beton, Demir, Personel).

## Phase 5: Verification & Optimization
- **Task 5.1**: Run `ux_audit.py` to ensure high contrast and accessibility.
- **Task 5.2**: Performance check using `lighthouse_audit.py`.
- **Task 5.3**: Visual regression test on mobile vs desktop.

---

## Agent Assignments
- **UI/UX Expert**: `@frontend-specialist`
- **Logic & Structure**: `@backend-specialist`
- **Verification**: `@qa-automation-engineer`

## Success Criteria
- [ ] 0 Emojis in the UI (only SVG/Lucide).
- [ ] Perfect mobile responsiveness (no horizontal scroll).
- [ ] Premium corporate "feel" with Poppins/Open Sans typography.
- [ ] Dark Mode consistency.
