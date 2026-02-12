import gsap, { PREMIUM_EASE } from '@/lib/gsap';

/**
 * Standard staggered entry for a list of elements
 */
export const animateStaggeredEntry = (targets: gsap.DOMTarget, delay = 0) => {
    return gsap.from(targets, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: PREMIUM_EASE,
        delay: delay,
        clearProps: "all"
    });
};

/**
 * Hero/Header entry animation
 */
export const animateHeaderEntry = (target: gsap.DOMTarget) => {
    return gsap.from(target, {
        x: -30,
        opacity: 0,
        duration: 1,
        ease: PREMIUM_EASE
    });
};

/**
 * Fade in animation for cards or sections
 */
export const animateFadeIn = (target: gsap.DOMTarget, delay = 0) => {
    return gsap.fromTo(target,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, delay, ease: "power2.out" }
    );
};
