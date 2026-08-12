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

Structural Timeline changes must pass the full command set above. The only accepted lint warning is the existing Fast Refresh warning in `src/context/UserProfileContext.tsx`.

## Unit and Integration Tests

Vitest and React Testing Library cover:

- storage normalization
- public JSON data validation
- Timeline scene and interaction helpers
- Timeline overlay keyboard and pointer behavior
- invalid range, duplicate identity, and pointer-capture regressions
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
- optional 3D activation and screen-space label sizing across camera zoom

If browsers are missing, run:

```bash
npx playwright install chromium
```
