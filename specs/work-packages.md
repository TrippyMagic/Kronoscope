# Work Packages

## WP1 - 2D/3D Interaction Parity

Goal: bring 3D marker selection, detail inspection, focus sync, and keyboard semantics closer to the 2D overlay model.

Acceptance:

- keyboard-reachable 3D marker semantics or equivalent HTML controls
- single-marker and grouped selection plan
- tests for keyboard and stale-selection cleanup

## WP2 - Dense Timeline Performance Profiling

Goal: measure Timeline behavior with large event datasets.

Acceptance:

- profiling dataset
- frame budget targets
- pan/zoom interaction metrics
- documented bottlenecks and chosen optimizations

## WP3 - Visual Regression Coverage

Goal: expand beyond smoke checks.

Acceptance:

- stable screenshot baselines for primary routes
- mobile and desktop coverage
- documented update workflow

## WP4 - Data Freshness Policy

Goal: define ownership and refresh cadence for historical, projection, phenomena, and geological datasets.

Acceptance:

- source policy
- review cadence
- confidence labels for projection updates

## WP5 - Shared UI Primitive Extraction

Goal: reduce remaining duplicated chip, detail panel, empty state, and error state patterns.

Acceptance:

- inventory of repeated patterns
- low-risk primitive proposals
- migration plan without a new design system

## WP6 - Dependency Audit Triage

Goal: review npm audit findings without forcing broad upgrades.

Acceptance:

- identify direct vs transitive issues
- document actual runtime exposure
- upgrade only where safe
