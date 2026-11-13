// The original, unmodified Philo Li scene module contains Three.js and the
// complete rendering/gesture implementation. This wrapper mounts the scene
// and applies the requested Hexahedron vertex palette.
import { createVertexColoring } from './vertex-colors.js';
const mount = document.querySelector('.rc__canvas-mount');
const loading = document.querySelector('.loading');
const error = document.querySelector('.error');
const status = document.querySelector('#cube-status');
const solved = Uint8Array.from({ length: 54 }, (_, index) => Math.floor(index / 9));
const defaultAzimuth = Math.PI * 0.75;
const defaultElevation = Math.atan(1 / Math.sqrt(2));
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

try {
  const { CubeScene } = await import('./vendor/scene.js');
  let scene;
  const turn = async move => {
    if (scene.isAnimating()) return;
    await scene.animateMove(move, reducedMotion.matches ? 1 : 300);
    status.textContent = move.notation ? `Rotation ${move.notation}.` : 'Tranche tournée.';
  };
  scene = new CubeScene(mount, { onLayerMove: turn });
  const applyVertexColors = createVertexColoring(scene);
  const resetCube = () => {
    scene.reset(solved);
    applyVertexColors();
  };
  resetCube();
  const canvas = scene.getCanvas();
  canvas.tabIndex = 0;
  canvas.setAttribute('role', 'application');
  canvas.setAttribute('aria-label', 'Rubik’s Cube 3D');
  canvas.setAttribute('aria-describedby', 'cube-instructions');
  canvas.addEventListener('pointerdown', () => canvas.focus({ preventScroll: true }));
  canvas.addEventListener('keydown', event => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const orbit = { ArrowLeft: [-0.12, 0], ArrowRight: [0.12, 0], ArrowUp: [0, -0.12], ArrowDown: [0, 0.12] }[event.key];
    if (orbit) {
      event.preventDefault();
      scene.setView(scene.azimuth + orbit[0], Math.max(-1.45, Math.min(1.45, scene.elevation + orbit[1])));
      return;
    }
    if (event.key === 'Home') {
      event.preventDefault();
      scene.setView(defaultAzimuth, defaultElevation);
      return;
    }
    if (event.key === 'Escape' && !scene.isAnimating()) {
      event.preventDefault();
      resetCube();
      scene.setView(defaultAzimuth, defaultElevation);
      status.textContent = 'Cube réinitialisé.';
      return;
    }
    const face = event.key.toUpperCase();
    const definition = { U: ['y', 1], R: ['x', 1], F: ['z', 1], D: ['y', -1], L: ['x', -1], B: ['z', -1] }[face];
    if (definition) {
      event.preventDefault();
      void turn({ axis: definition[0], layers: [definition[1]], turns: event.shiftKey ? 3 : 1, notation: face + (event.shiftKey ? "'" : '') });
    }
  });
  const overlay = document.querySelector('.rc__canvas-overlay');
  const overlaySize = new ResizeObserver(() => {
    overlay.width = canvas.width;
    overlay.height = canvas.height;
  });
  overlaySize.observe(mount);
  canvas.addEventListener('webglcontextlost', () => { error.hidden = false; });
  canvas.addEventListener('webglcontextrestored', () => { error.hidden = true; scene.markDirty(); });
  loading.hidden = true;
} catch (cause) {
  loading.hidden = true;
  error.hidden = false;
  console.error('Impossible de charger le cube 3D.', cause);
}
