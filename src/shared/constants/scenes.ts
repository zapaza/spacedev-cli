export const SCENE_NAMES = {
  IDLE: 'idle',
  PROJECTS: 'projects',
  ABOUT: 'about',
  MATRIX: 'matrix',
  LOADING: 'loading',
  ASCII_ASSEMBLE: 'asciiAssemble',
  NOT_FOUND: 'notFound',
  DOOM: 'doom',
} as const;

/** Сцены, занимающие весь экран (скрывают 3D и показывают 2D canvas) */
export const FULLSCREEN_SCENES = [SCENE_NAMES.MATRIX, SCENE_NAMES.ASCII_ASSEMBLE, SCENE_NAMES.NOT_FOUND, SCENE_NAMES.DOOM] as const;

export type FullscreenScene = (typeof FULLSCREEN_SCENES)[number];

export function isFullscreenScene(scene: string): scene is FullscreenScene {
  return (FULLSCREEN_SCENES as readonly string[]).includes(scene);
}
