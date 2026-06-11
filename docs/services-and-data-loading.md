# Services and Data Loading

Kronoscope loads public JSON files through small hooks and keeps each hook return contract stable.

## Shared Resource Helper

`src/utils/fetchJsonResource.ts` provides:

- request status: `idle`, `loading`, `success`, `error`
- per-resource memory cache
- abort/cancellation support
- parser injection
- stable hook return shapes for consumers

## Hooks

| Hook | Data source | Return shape |
| --- | --- | --- |
| `useHistoricalEvents` | `/data/historical-events.json` | `{ events, status, error }` |
| `useProjectedEvents` | `/data/projected-events.json` | `{ events, status, error }` |
| `useTimescalePhenomena` | `/data/timescale-phenomena.json` | `{ phenomena, status, error }` |
| `useGeologicalEras` | `/data/geological-eras.json` | `{ data, status, error }` |

## Validation Boundary

Loaded JSON is never cast directly into trusted domain types. Parsers validate and filter rows before data reaches Timeline, Timescales, or Explorer rendering.
