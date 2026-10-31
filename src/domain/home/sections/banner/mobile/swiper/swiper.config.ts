// swiper.config.ts
import { EffectCards } from 'swiper/modules';
import { Autoplay } from 'swiper/modules';
export const mobileSwiperConfig = {
  modules: [Autoplay, EffectCards],
  effect: "cards",
  cardsEffect: {
    slideShadows: false, // Better performance
    perSlideOffset: 8, // Subtle stack effect
    perSlideRotate: 2, // Minimal rotation for polish
    rotate: true, // Enable rotation
  },
  autoplay: {
    delay: 4000, // Optimal for engagement
    disableOnInteraction: false, // Resume after interaction
    pauseOnMouseEnter: false, // Mobile-first, no hover
    stopOnLastSlide: false, // Loop continuously
  },
  speed: 400, // Smooth but snappy
  grabCursor: false, // Better for touch
  touchRatio: 1, // Responsive touch
  resistance: true, // Natural feel
  resistanceRatio: 0.85, // Bounce effect
};
