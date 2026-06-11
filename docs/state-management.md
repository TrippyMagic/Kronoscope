# State Management

Kronoscope uses React context for app-level state. There is no global state library.

## BirthDateContext

Owns:

- `birthDate`
- `birthTime`
- `setBirthDate`
- `setBirthTime`
- `clearBirthDate`

Persisted keys:

- `dob`
- `dobTime`

Invalid dates are ignored or normalized to `null`; invalid times normalize to `00:00`.

## PreferencesContext

Owns:

- active event categories
- optional 3D toggle
- active Timescales tab
- visible Timeline lanes

Persisted keys:

- `pref_eventCategories`
- `pref_show3D`
- `pref_timescalesTab`
- `pref_visibleTimelineLanes`

Malformed persisted values normalize to safe defaults.

## UserProfileContext

Owns optional profile data and exposes:

- `profile`
- `updateProfile`
- `resetProfile`

Persisted key:

- `user_profile`

Malformed objects are filtered and numeric fields are bounded.

## Page-Local State

Milestones owns Timeline focus, selected perspective tab, progressive perspective unlock state, and toast lifetime. Timescales owns overview category filters locally while the selected tab is persisted through preferences.
