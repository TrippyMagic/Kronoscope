# Kronoscope

Kronoscope is a React 19 + Vite application for exploring a lifetime through age perspectives, a two-lane time map, and long-horizon timescales.

## Commands

```bash
npm install
npm run dev
npm run lint
npm test -- --run
npm run test:e2e
npm run build
```

On Windows PowerShell, use `npm.cmd` if script execution policy blocks `npm`.

## Documentation

- Current system documentation: [docs/README.md](docs/README.md)
- Future work and specifications: [specs/README.md](specs/README.md)
- Architecture overview: [docs/architecture.md](docs/architecture.md)
- Timeline runtime: [docs/timeline.md](docs/timeline.md)
- Storage contracts: [docs/storage-and-persistence.md](docs/storage-and-persistence.md)
- Testing guide: [docs/testing.md](docs/testing.md)

## Runtime Shape

The app keeps its existing React/Vite/router/context architecture. Active routes are `/`, `/milestones`, `/timescales`, `/settings`, `/about`, and the legacy-compatible `/personalize` redirect to `/settings`.

Timeline 2D uses a canvas scene with an accessible HTML overlay. Optional 3D remains lazy-loaded and WebGL-gated.

## Verification

Verified on 2026-06-11:

- `npm run lint` passes with one existing Fast Refresh warning in `src/context/UserProfileContext.tsx`.
- `npm test -- --run` passes 128 tests across 22 files.
- `npm run test:e2e` passes 12 Playwright smoke tests across desktop and mobile Chromium.
- `npm run build` succeeds.

See [docs/testing.md](docs/testing.md) for the maintained verification commands.
