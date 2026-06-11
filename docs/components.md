# Components

## Shared UI

`src/ui` owns reusable primitives:

- `Button`
- `Banner`
- `Field`
- `FormActions`
- `Inline`
- `Panel`
- `Stack`
- `Tabs`

These components are intentionally small. They wrap structure and behavior while visual styling stays in the existing CSS token system.

## App Shell

- `Navbar` in `src/components/common/Headers.tsx` controls route navigation and Settings exit guard integration.
- `Footer` is shared across primary pages.
- `ErrorBoundary` catches app-wide crashes.
- `SectionErrorBoundary` isolates local runtime failures in major panels.

## Product Surfaces

- `Landing` uses `BirthDatePicker`, route actions, and DOB-gated messaging.
- `Settings` is the canonical surface for birth date and optional profile data.
- `Milestones` composes age perspectives, Timeline 2D, optional Timeline 3D, filters, and global-lane loading states.
- `Timescales` composes overview, comparator, and explorer tabs.
- `About` provides the runtime help and FAQ surface.

## Timeline Components

- `Timeline.tsx` orchestrates range, viewport, pointer input, selection, focus, and render wiring.
- `TimelineSceneCanvas.tsx` renders the 2D scene.
- `TimelineInteractiveOverlay.tsx` exposes keyboard and screen-reader reachable targets.
- `TimelineDetailPanel.tsx` renders selected event details.
- `TimelineControls.tsx` owns zoom/reset controls.

## Removed Orphans

The legacy birth date wizard, unused components, old DOM timeline event element, mock card, and obsolete scale hint have been removed after type extraction and coverage.
