export const TIME_UNITS = [
  "years",
  "months",
  "weeks",
  "days",
  "hours",
  "minutes",
  "seconds",
] as const;

export const MILESTONE_PRESETS = [
  1_000,
  5_000,
  10_000,
  20_000,
  40_000,
  1_000_000,
  10_000_000,
  100_000_000,
  1_000_000_000,
];

export type Unit = typeof TIME_UNITS[number];
