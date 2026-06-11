# Testing

## Commands

```bash
npm run lint
npm test -- --run
npm run test:e2e
npm run build
```

On Windows PowerShell, use `npm.cmd`.

## Current Verification

Verified on 2026-06-11:

- `npm run lint` passes with one existing Fast Refresh warning in `src/context/UserProfileContext.tsx`.
- `npm test -- --run` passes 128 tests across 22 files.
- `npm run test:e2e` passes 12 Playwright smoke tests across desktop and mobile Chromium.
- `npm run build` succeeds.

## Unit and Integration Tests

Vitest and React Testing Library cover:

- storage normalization
- public JSON data validation
- Timeline scene and interaction helpers
- Timeline overlay keyboard and pointer behavior
- Milestones toast cleanup
- Timescales components
- 3D runtime policy and scene adapters

## Playwright Smoke Tests

Playwright covers:

- `/`
- `/settings`
- `/milestones`
- `/timescales`
- `/personalize` redirect compatibility
- desktop and mobile Chromium viewports
- horizontal overflow checks
- obvious clipped or covered text checks
- default and empty Timeline states

If browsers are missing, run:

```bash
npx playwright install chromium
```
