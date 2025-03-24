import { gsap } from 'gsap';

export const revealHomeTitle = (): void => {
    const title = document.getElementById('homeTitle');
    const topLine = document.getElementById('topLine');
    const bottomLine = document.getElementById('bottomLine');
    if (title != null) {
        const tl = gsap.timeline();
        tl.to(title, { opacity: 1, duration: 1, y: 0, ease: "back.out(1.7)" })
            .to(topLine, { scaleX: 1, duration: 1, ease: "back.out(1.7)" }, "-=0.5")
            .to(bottomLine, { scaleX: 1, duration: 1, ease: "back.out(1.7)" }, "-=0.5");
    }
};