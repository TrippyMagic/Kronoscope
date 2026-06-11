# Timescales

Timescales is a three-tab surface persisted by `PreferencesContext`.

## Tabs

- `overview`
- `comparator`
- `explorer`

The tab shell uses `src/ui/Tabs`, backed by Radix Tabs.

## Overview

`TimescaleOverview` renders a logarithmic scale of phenomena from very short durations to cosmic durations. The page-level category filters are local state.

## Comparator

`PhenomenaComparator` compares two selected phenomena and uses accessible search controls with duplicate exclusion.

## Explorer

`GeoCosmicExplorer` exposes geological and cosmic data through nested drilldown and detail panels.

## Shared Helpers

`src/utils/temporalScale.ts` owns absolute-log ratio, percent, exponent rounding, and exponent label formatting used by Timescales consumers.
