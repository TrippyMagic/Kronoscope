# Visual Consistency

Future visual work should consolidate existing patterns rather than introduce a new design system.

## Candidate Work

- shared empty state primitive
- shared error state primitive
- shared filter chip primitive
- shared detail panel surface
- stronger visual regression coverage
- route-level responsive audits beyond smoke tests
- continued reduction of global CSS coupling

## Constraints

- Preserve current route behavior.
- Keep visual changes conservative.
- Keep Timeline screens aligned with the rest of the app.
- Avoid adding one-off page-specific controls when `src/ui` can cover the pattern.
