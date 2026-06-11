# Migration Plans

## Personalize Compatibility

`/personalize` currently redirects to `/settings`. Remove it only with a bookmark compatibility migration.

## Future Storage Migrations

Storage keys are stable. Any new persisted shape needs:

- versioning or tolerant parser
- fallback behavior for malformed values
- tests for old, missing, and corrupt values

## Future Contract Migrations

Public contracts that need explicit migration plans:

- route paths
- context hook return shapes
- storage keys
- public data file URLs
- `TimelineEvent`
- data parser output shapes
