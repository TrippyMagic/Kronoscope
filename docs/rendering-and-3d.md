# Rendering and 3D

## 2D Rendering

Timeline 2D renders dense visual elements through canvas and exposes interaction through an HTML overlay. This keeps marker density from creating many DOM nodes while preserving keyboard access and detail inspection.

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

## Runtime Constraints

- Keep 3D isolated from required page rendering.
- Keep 2D and 3D consuming the same `TimelineEvent` data contract.
- Do not add 3D features before 2D stability and accessibility are protected.
