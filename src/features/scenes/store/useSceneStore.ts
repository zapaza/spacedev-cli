import { defineStore } from 'pinia';
import { ref } from 'vue';
import { SCENE_NAMES } from '@/shared/constants/scenes';

export type SceneType = (typeof SCENE_NAMES)[keyof typeof SCENE_NAMES] | string;

const SCENE_CHANGE_DELAY_MS = 300;

export const useSceneStore = defineStore('scene', () => {
  const currentScene = ref<SceneType>(SCENE_NAMES.IDLE);
  const isLoading = ref(false);
  const nextScene = ref<SceneType | null>(null);
  const sceneParams = ref<Record<string, unknown> | null>(null);

  function setScene(scene: SceneType, params: Record<string, unknown> | null = null) {
    nextScene.value = scene;
    isLoading.value = true;
    currentScene.value = SCENE_NAMES.LOADING;
    sceneParams.value = params;

    setTimeout(() => {
      currentScene.value = scene;
      isLoading.value = false;
      nextScene.value = null;
    }, SCENE_CHANGE_DELAY_MS);
  }

  return {
    currentScene,
    isLoading,
    nextScene,
    sceneParams,
    setScene
  };
});
