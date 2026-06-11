# Cleanup and Pruning

The first pruning pass removed verified orphan components, old Timeline DOM marker styles, and the unused Speed Insights dependency.

## Remaining Candidates

- further split global CSS by active feature ownership
- evaluate whether `src/pages/Personalize.tsx` can be removed after redirect compatibility is no longer needed
- continue reducing page-level CSS duplication around cards, filters, and state panels
- review stale comments and mojibake text in existing source files
- review dependency audit findings

## Rules

- Remove only after reference scans and coverage.
- Do not delete compatibility behavior without a migration plan.
- Do not refactor active architecture only for tidiness.
