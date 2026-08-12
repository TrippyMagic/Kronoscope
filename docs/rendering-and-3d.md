# Rendering and 3D

## 2D Rendering

Timeline 2D renders dense visual elements through canvas and exposes interaction through an HTML overlay. This keeps marker density from creating many DOM nodes while preserving keyboard access and detail inspection.

The canvas uses a bounded high-DPI backing store. Runtime event normalization removes non-finite positions and repeated IDs before render-item grouping, while the accessible overlay continues to use the same normalized targets.

## 3D Rendering

The optional 3D Timeline uses:

- `@react-three/fiber`
- `@react-three/drei`
- lazy loading through `Timeline3DWrapper`
- WebGL gating through `src/utils/webgl.ts`
- runtime policy through `src/components/3d/runtimePolicy.ts`

3D remains optional. Core Milestones behavior must work without WebGL.

## Shared Scene Contracts

`src/components/timeline-core/buildTimeline3DScene.ts` builds the 3D scene model. Single-marker detail descriptors are shared with the Timeline interaction layer.

The scene adapter only emits markers inside the renderable range. Near markers in the same lane and placement are assigned deterministic stack levels, so distinct events do not collapse onto the same point. Marker hit areas are larger than their visible geometry without changing the rendered size.

## Visual Quality and Labels

- Balanced rendering uses an antialiased DPR range up to `2`; low-power rendering remains bounded but antialiased.
- Adaptive pixelated canvas scaling is not used.
- Lane, tick, and event labels keep world-space anchors with screen-space typography, so camera zoom changes their position without shrinking the text below a readable size.
- The focus animation is static in the low-power/reduced-motion profile.
- Rails use a separate low-opacity glow pass and markers expose selection/hover halos.

## Runtime Constraints

- Keep 3D isolated from required page rendering.
- Keep 2D and 3D consuming the same `TimelineEvent` data contract.
- Reject invalid ranges before mounting the WebGL scene.
- Do not add 3D features before 2D stability and accessibility are protected.
