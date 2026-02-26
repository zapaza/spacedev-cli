export type ThemeName = 'default' | 'senior';

export const THEME_COLORS = {
  default: {
    hex: 0x33FF66,
    css: '#33FF66',
    rgbaFn: (alpha: number) => `rgba(51, 255, 102, ${alpha})`,
  },
  senior: {
    hex: 0xFF4D4D,
    css: '#FF4D4D',
    rgbaFn: (alpha: number) => `rgba(255, 77, 77, ${alpha})`,
  },
} as const satisfies Record<ThemeName, { hex: number; css: string; rgbaFn: (a: number) => string }>;

export const SCENE_COLORS = {
  about: 0x00E5FF,
  projects: 0xFFC857,
} as const;

/** Вспомогательные цвета для wireframe в senior-теме */
export const WIREFRAME_COLORS: Record<ThemeName, number> = {
  default: 0x66FF99,
  senior: 0xFF9999,
};
