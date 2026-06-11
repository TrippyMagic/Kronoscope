# Timeline

Timeline is the highest-risk runtime subsystem. It is intentionally stabilized in place.

## Runtime Model

Timeline 2D is composed from:

- scene/model helpers in `src/components/timeline-core`
- orchestration in `src/components/timeline/Timeline.tsx`
- canvas rendering in `TimelineSceneCanvas.tsx`
- accessible targets in `TimelineInteractiveOverlay.tsx`
- detail inspection in `TimelineDetailPanel.tsx`

The old DOM marker renderer is not active.

## Invariants

- Public `TimelineEvent` shape is stable.
- Personal and global lanes remain distinct.
- Bare-axis pointer selection must still call `onChange`.
- Event/group target activation opens details without changing bare-axis focus.
- Keyboard activation must work through the accessible overlay.
- Selection, hover, and focus state must be cleared when filters remove the target.
- Pointer capture release must be guarded because capture can fail or be lost.

## Input Behavior

- Drag pans the visible range.
- Ctrl+wheel zooms the range.
- Touch/pinch is integrated through the existing pinch hook.
- Pointer hit testing prioritizes interactive targets before bare-axis selection.

## Empty, Loading, and Error States

Milestones separates:

- global event loading
- global event load errors
- true empty results from filters/range
- no visible lanes
- invalid timeline range

This avoids false empty warnings while data is still loading.
