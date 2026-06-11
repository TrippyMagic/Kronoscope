# Architecture

Kronoscope is a React 19 + Vite app using React Router, local React contexts, plain CSS modules imported from `src/css/index.css`, Vitest/RTL, and Playwright.

## App Shell

`src/main.tsx` mounts:

```text
StrictMode
ErrorBoundary
BirthDateProvider
PreferencesProvider
UserProfileProvider
BrowserRouter
Routes
Analytics
```

## Routes

| Path | Runtime surface |
| --- | --- |
| `/` | Landing and shared birth date picker |
| `/milestones` | Age perspectives, Timeline 2D, optional Timeline 3D |
| `/timescales` | Overview, comparator, geological/cosmic explorer |
| `/settings` | Birth date and optional profile settings |
| `/about` | Product guide and FAQ |
| `/personalize` | Redirects to `/settings` for bookmark compatibility |

## Architectural Decisions

- Preserve the React/Vite/router/context architecture.
- Keep state ownership in the existing contexts.
- Use internal `src/ui` primitives for shared layout, fields, banners, buttons, panels, actions, and tabs.
- Use Radix only where it already supports active headless behavior, currently tabs.
- Keep Timeline 2D on the canvas plus accessible overlay model.
- Keep optional 3D on `@react-three/fiber` and `@react-three/drei`; do not make it required for core flows.
- Remove dead code only after replacement and focused coverage.
- Keep future work outside `/docs`; plans belong in `/specs`.
