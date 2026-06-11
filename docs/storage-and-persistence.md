# Storage and Persistence

All storage remains local to the browser. Storage keys have not changed.

## Helper Layer

`src/utils/storage.ts` wraps `localStorage` access:

- reads return safe defaults when storage is unavailable
- JSON parse failures return fallback values
- writes and removals are caught to avoid crashes in restricted environments

## Keys

| Key | Owner | Shape |
| --- | --- | --- |
| `dob` | `BirthDateContext` | ISO date string |
| `dobTime` | `BirthDateContext` | `HH:mm` |
| `pref_eventCategories` | `PreferencesContext` | event category array |
| `pref_show3D` | `PreferencesContext` | boolean |
| `pref_timescalesTab` | `PreferencesContext` | `overview`, `comparator`, or `explorer` |
| `pref_visibleTimelineLanes` | `PreferencesContext` | `personal` and/or `global` |
| `pref_unlockedPerspectives` | `Milestones` | known perspective tab names excluding `Classic` |
| `user_profile` | `UserProfileContext` | optional profile object |

## Normalization Rules

- Invalid or future birth dates are not accepted.
- Invalid birth times become `00:00`.
- Malformed category, lane, tab, and boolean values become defaults.
- Unknown perspective unlock values are ignored.
- Unknown user profile fields are ignored.
- Out-of-range profile numbers are ignored.
