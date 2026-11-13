# Rubik — Canvas 3D

## Run locally

```sh
python3 -m http.server 5173 --directory dist
```

Open http://localhost:5173/. There are no dependencies to install.

## Deploy with Dokploy

The repository includes a Dockerfile serving `dist/` through the official Nginx stable Alpine image. In Dokploy, use the `Puzzles` project / `production` environment, application `Rubik`, repository `debovitch/rubik`, branch `main`, build type **Dockerfile**, Dockerfile path `Dockerfile`, context `.`, and container port **80**. The container has an HTTP health check. No environment variables, volumes, or database are required.

```sh
docker build -t rubik .
docker run --rm -p 8080:80 rubik
```

## Origins and controls

Standalone, buildless reproduction of the `rc__canvas` region at https://philoli.com/fr/projects/rubiks-cube/. The surrounding page is intentionally limited to a centered canvas. As requested, the original JavaScript scene is reused unchanged: camera, dimensions, palette, bevels, materials, lighting and mouse/touch gestures are the original implementation by Philo Li.

Serve `dist/` using any static HTTP server. No remote runtime requests, trackers, backend, or build step are needed. The original bundle already contains Three.js r184, RoundedBoxGeometry and RoomEnvironment. The Three.js MIT license is included in `dist/vendor/LICENSE`; that license covers Three.js and does not establish a license for the author's application code.

Original module: https://philoli.com/_astro/scene.EtSp5Hsc.js (retrieved November 13, 2026). It is stored without modification in `dist/vendor/scene.js`. `cube.js` is a small integration wrapper that initializes the solved state, connects the existing slice animations, and adds keyboard accessibility. The reference page's analytics, navigation and other sections are not included.

Drag a sticker to turn its slice; drag the background to orbit. Keyboard: arrows orbit, Home restores the view, U/R/F/D/L/B turn faces (Shift reverses direction), Escape resets the cube. The layout fits desktop, mobile and short landscape screens, and animation respects reduced-motion preferences.

Run `npm run check` for JavaScript syntax validation.

## Hexahedron vertex colors

The eight corner cubies use the exact `HEXAHEDRON_BALLS` colors from https://hedron.dodecamoon.com/platonic/hexahedron: `#ff0000`, `#ffff00`, `#00ff00`, `#a040ff`, `#ff5500`, `#ffaa00`, `#00ffff`, `#0000ff`. The inner square is mapped to the front face, the outer square to the back, preserving adjacency. Each corner's three stickers share one material; edge and center stickers use the neutral body material. The original dark bevels are retained.

Color belongs to the physical cubie and follows its rotations. Reset reapplies the palette after the original scene reset. This customization is isolated in `dist/vertex-colors.js`; the original scene bundle remains unchanged.
