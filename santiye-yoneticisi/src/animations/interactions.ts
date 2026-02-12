import gsap, { SOFT_EASE } from '@/lib/gsap';

/**
 * Magnetic button effect (subtle)
 */
export const animateMagnetic = (e: React.MouseEvent<HTMLElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(btn, {
        x: x * 0.2, // Movement intensity
        y: y * 0.2,
        duration: 0.3,
        ease: "power2.out"
    });
};

export const resetMagnetic = (e: React.MouseEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)"
    });
};

/**
 * Subtle glow/hover for cards
 */
export const animateCardHover = (target: gsap.DOMTarget) => {
    gsap.to(target, {
        y: -4,
        scale: 1.01,
        duration: 0.4,
        ease: SOFT_EASE,
        boxShadow: "0 20px 25px -5px rgb(124 58 237 / 0.1), 0 8px 10px -6px rgb(124 58 237 / 0.1)"
    });
};

export const resetCardHover = (target: gsap.DOMTarget) => {
    gsap.to(target, {
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: SOFT_EASE,
        boxShadow: "0 4px 6px -1px rgb(124 58 237 / 0.1), 0 2px 4px -2px rgb(124 58 237 / 0.1)"
    });
};
