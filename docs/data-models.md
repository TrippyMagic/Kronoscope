# Data Models

## Timeline Events

`src/components/timeline/types.ts` defines the public `TimelineEvent` contract used by Milestones, Timeline 2D, Timeline 3D, and tests.

Important fields:

- `id`, `label`, and `value` identify and place the event.
- `lane` is `personal` or `global`.
- `semanticKind` distinguishes personal markers, events, and projections.
- `category` is validated against known event categories.
- `projectionType` and `certainty` are valid only for projected events.
- `placement`, `accent`, `markerShape`, and `color` are render metadata.

Timeline scene adapters preserve the public shape but enforce runtime identity and geometry invariants: the first finite event for an ID wins, later duplicate IDs are ignored, and non-finite values do not enter either scene.

## Public Data Files

The app loads JSON from:

- `/data/historical-events.json`
- `/data/projected-events.json`
- `/data/timescale-phenomena.json`
- `/data/geological-eras.json`

Rows are parsed as `unknown` and validated before becoming domain types.

## Historical and Projected Events

`src/types/events.ts` validates:

- finite parseable dates
- known event categories
- known projection type and certainty values
- safe placement values

Invalid rows are skipped instead of being trusted by Timeline.

## Timescale Phenomena

`src/types/phenomena.ts` validates finite positive durations and known categories.

## Geological and Cosmic Explorer Data

`src/types/geological.ts` validates explorer rows, ranks, date ranges, and nested child units. Invalid rows are filtered from the loaded tree.

## User Profile

`UserProfileContext` stores optional profile fields only when values match known ranges and known activity levels.
