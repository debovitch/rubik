// Palette and adjacency from HEXAHEDRON_BALLS / HEXAHEDRON_FACES at:
// https://hedron.dodecamoon.com/platonic/hexahedron (2026-11-13).
// The inner square is the front face (z = +1); the outer square is the
// back face (z = -1). In each square: top-right, top-left, bottom-left,
// bottom-right. This preserves the reference's connecting edges and faces.
export const HEXAHEDRON_VERTICES = [
  { position: [ 1,  1, -1], color: '#ff0000', name: 'rouge' },
  { position: [-1,  1, -1], color: '#ffff00', name: 'jaune' },
  { position: [-1, -1, -1], color: '#00ff00', name: 'vert' },
  { position: [ 1, -1, -1], color: '#a040ff', name: 'violet' },
  { position: [ 1,  1,  1], color: '#ff5500', name: 'orange' },
  { position: [-1,  1,  1], color: '#ffaa00', name: 'orange doré' },
  { position: [-1, -1,  1], color: '#00ffff', name: 'cyan' },
  { position: [ 1, -1,  1], color: '#0000ff', name: 'bleu' },
];

export function createVertexColoring(scene) {
  const materials = new Map(HEXAHEDRON_VERTICES.map(vertex => {
    const material = scene.stickerMaterials[0].clone();
    material.color.set(vertex.color);
    return [vertex.position.join(','), material];
  }));

  return function applyVertexColors() {
    for (const sticker of scene.stickers) {
      // Original piece coordinates identify the cubie, so its color travels
      // with it during a turn instead of being reassigned to a fixed slot.
      const { x, y, z } = sticker.parent.userData;
      sticker.material = materials.get(`${x},${y},${z}`) ?? scene.cubieBodyMaterial;
    }
    scene.markDirty();
  };
}
