# Known Limitations

- 3D interaction does not yet have full keyboard-first parity with the 2D accessible overlay.
- Dense Timeline datasets need deeper profiling beyond current smoke and unit coverage.
- Visual regression coverage is smoke-level only.
- Historical and projected datasets do not yet have a formal freshness policy.
- Some CSS remains global and page-coupled even after orphan style pruning.
- Dependency audit output currently reports vulnerabilities that need separate triage.
- `/personalize` remains as a compatibility redirect and should not be removed without a migration.
