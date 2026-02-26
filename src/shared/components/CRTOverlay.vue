<template>
  <div class="crt-overlay pointer-events-none absolute inset-0 z-[100]">
    <div class="scanlines absolute inset-0"></div>

    <div class="vignette absolute inset-0"></div>

    <div class="flicker absolute inset-0"></div>
  </div>
</template>

<style scoped>
.crt-overlay {
  overflow: hidden;
}

/* Scanlines: горизонтальные линии */
.scanlines {
  background: repeating-linear-gradient(
    to bottom,
    var(--scanline-color) 0px,
    var(--scanline-color) 1px,
    transparent 1px,
    transparent 3px
  );
}

/* Vignette: затемнение по краям */
.vignette {
  background: radial-gradient(
    circle at center,
    transparent 50%,
    rgba(0, 0, 0, 0.2) 80%,
    rgba(0, 0, 0, 0.5) 100%
  );
  box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.6);
}

/* Flicker: мягкое мерцание яркости */
.flicker {
  background: rgba(18, 16, 16, 0.02);
  opacity: 0;
  animation: flicker 0.15s infinite;
}

@keyframes flicker {
  0% { opacity: 0.1; }
  5% { opacity: 0.2; }
  10% { opacity: 0.1; }
  15% { opacity: 0.2; }
  20% { opacity: 0.15; }
  25% { opacity: 0.2; }
  30% { opacity: 0.1; }
  35% { opacity: 0.15; }
  40% { opacity: 0.2; }
  45% { opacity: 0.15; }
  50% { opacity: 0.2; }
  55% { opacity: 0.15; }
  60% { opacity: 0.1; }
  65% { opacity: 0.2; }
  70% { opacity: 0.15; }
  75% { opacity: 0.2; }
  80% { opacity: 0.15; }
  85% { opacity: 0.1; }
  90% { opacity: 0.2; }
  95% { opacity: 0.15; }
  100% { opacity: 0.1; }
}

/* Отключение анимации мерцания при prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .flicker {
    animation: none;
    display: none;
  }
}
</style>
