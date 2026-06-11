# Timeline Improvements

Future Timeline work should preserve the current `TimelineEvent` contract unless a migration plan explicitly changes it.

## Candidate Improvements

- full 2D/3D interaction parity
- keyboard-first 3D marker semantics
- group selection in 3D
- more explicit input state separation for pointer, touch, wheel, and keyboard logic
- dense dataset profiling and culling budgets
- better test fixtures for invalid dates and extreme ranges
- richer empty-state diagnostics for filtered global lanes

## Constraints

- Do not replace the Timeline architecture without a measured reason.
- Do not remove the accessible overlay model.
- Do not make 3D required for core Milestones behavior.
