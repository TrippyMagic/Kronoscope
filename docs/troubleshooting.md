# Troubleshooting

## Local Storage Looks Corrupt

Clear these keys and reload:

- `dob`
- `dobTime`
- `pref_eventCategories`
- `pref_show3D`
- `pref_timescalesTab`
- `pref_visibleTimelineLanes`
- `pref_unlockedPerspectives`
- `user_profile`

The app now normalizes malformed values, but clearing storage is still useful when reproducing user reports.

## Timeline Is Empty

Check:

- at least one lane is enabled
- at least one global event category is enabled
- the visible time range includes global events
- data hooks are not in an error state

## 3D Is Disabled

3D requires WebGL. The app should continue to work in 2D when WebGL is unavailable.

## Playwright Fails Before Tests Start

Install Chromium:

```bash
npx playwright install chromium
```

## PowerShell Blocks npm

Use `npm.cmd`:

```powershell
npm.cmd test -- --run
```
