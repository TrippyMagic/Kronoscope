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
- Pointer activation completes before a normal capture release can emit `lostpointercapture`.
- Scene input drops non-finite event values and repeated event IDs deterministically.
- Invalid source ranges render the local Timeline fallback instead of a synthetic epoch view.

## Input Behavior

- Drag pans the visible range.
- Ctrl+wheel zooms the range.
- Touch/pinch is integrated through the existing pinch hook.
- Wheel and touch listeners follow the current axis node across fallback and remount transitions.
- Pointer hit testing prioritizes interactive targets before bare-axis selection.

## Rendering Safety

- Event input is normalized before lane splitting so selection keys stay unique in both lanes.
- Render items sort their own input before collision and edge grouping.
- Canvas backing resolution is DPR-aware, capped to safe dimensions, and independent from CSS layout size.
- The scene builder returns empty lanes and ticks for invalid ranges instead of propagating invalid geometry.

## Empty, Loading, and Error States

Milestones separates:

- global event loading
- global event load errors
- true empty results from filters/range
- no visible lanes
- invalid timeline range

This avoids false empty warnings while data is still loading.
