import type * as THREE_TYPES from 'three';
import { THEME_COLORS, WIREFRAME_COLORS } from '@/shared/constants/theme';
import type { ThemeName } from '@/shared/constants/theme';

export function createProjectCube(
  THREE: typeof THREE_TYPES,
  slug: string,
  theme: ThemeName
): THREE_TYPES.Mesh {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const color = THEME_COLORS[theme];

  if (ctx) {
    ctx.fillStyle = '#0B0F10';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = color.css;
    ctx.lineWidth = 20;
    ctx.strokeRect(40, 40, 432, 432);

    ctx.fillStyle = color.css;
    ctx.font = 'bold 60px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(slug.toUpperCase(), 256, 256);

    ctx.shadowColor = color.css;
    ctx.shadowBlur = 20;
    ctx.strokeRect(60, 60, 392, 392);
  }

  const texture = new THREE.CanvasTexture(canvas);
  const geometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.9,
    color: color.hex
  });

  const wireframeGeometry = new THREE.BoxGeometry(1.22, 1.22, 1.22);
  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: WIREFRAME_COLORS[theme],
    wireframe: true,
    transparent: true,
    opacity: 0.3
  });

  const projectCube = new THREE.Mesh(geometry, material);
  const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
  projectCube.add(wireframe);

  projectCube.scale.setScalar(0);
  projectCube.rotation.x = Math.PI * 2;
  projectCube.rotation.y = Math.PI * 2;

  return projectCube;
}
