import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// Register plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// Global configuration
gsap.config({
    nullTargetWarn: false, // Suppress warnings if target is not found (useful for dynamic routes)
});

// Default easing for "Loft 777" premium feel
// We use a custom cubic-bezier style ease for smoothness
export const PREMIUM_EASE = "expo.out";
export const SOFT_EASE = "power3.out";

export default gsap;
