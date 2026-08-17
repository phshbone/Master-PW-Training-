# Build · Test · Repair Report

## Implemented

- Removed the duplicate Guide completion control. Guide lessons now use the training-status buttons as the single completion/status mechanism; Home counts `Explained` and `Live` as completed Guide lessons.
- Improved global-search destination precision for Opening/Closing routines, Master Poll Worker references, and Reference Library entries. Search results now open the matched item in isolation with a clear return control.
- Preserved existing direct opening behavior for Guide topics and Field Procedures.
- Changed Opening/Closing routines so the first phase is open by default until the user explicitly opens/closes phases. Explicit Collapse All remains respected.
- Changed `Start Tomorrow` so it advances from the report date currently displayed rather than from the device's current date.
- Prevented duplicate `Finish Day` history entries for the same report date.
- Added a confirmation step before deleting a user-added Board question.

## Validation

### Executed

- Repository diff comparison executed from the completed FRICTION audit commit (`fa32b87857a706868058503359bbcbbeff078c9a`) to the repaired `clean-rebuild` head.
- Result: exactly two implementation files changed: `app-clean.js` and `modules.js`. No unrelated files were modified.
- Attempted to clone the branch into the execution container and run Node syntax checks. The execution environment could not resolve `github.com`, so the clone/test command could not run. No runtime or syntax-pass claim is made from that attempt.

### Static

- Re-fetched the committed `app-clean.js` and `modules.js` from `clean-rebuild` after the edits and inspected the changed code paths.
- Verified that menu/search overlay ownership, route dispatch, storage interfaces, mode switching, import/export/reset handlers, procedure checkboxes, routine checkboxes, training text persistence, and service-worker registration paths were not intentionally changed by this repair pass.
- Verified search result routing continues to use the existing `route + id` contract.
- Verified the added return controls use the existing application route state rather than introducing new navigation state.
- Verified duplicate Finish Day prevention reads existing history without changing the persisted schema.
- Verified Start Tomorrow continues to use the existing `training/newDay` action and therefore preserves the current reset behavior for topic statuses and daily notes.

## Regression Check

- **Core navigation:** no primary navigation items or menu entries changed.
- **Search:** query/ranking logic unchanged; only destination rendering was tightened for matched routines/reference entries.
- **State/persistence:** no storage key, schema version, import/export shape, or legacy migration changed.
- **Guide:** legacy `guide.progress` data remains preserved in storage for compatibility, but no longer drives the active Guide UI.
- **Procedures:** procedure categories, deep links, decision cards, warnings, and checklist persistence unchanged.
- **Opening/Closing:** existing phase state remains authoritative once the user has explicitly changed it; default-open behavior applies only where no phase state has yet been recorded.
- **Training/report:** existing history format unchanged; duplicate same-date saves are blocked before dispatch.
- **Board Questions:** add/toggle behavior unchanged; removal now requires confirmation.
- **PWA:** manifest, service worker file, registration call, cache strategy, and asset paths were not changed in this repair pass.

## Remaining

- Browser/runtime interaction testing is still required on the actual deployed clean-rebuild build or a local preview. The current execution container could not access GitHub to clone/run the branch.
- Installed-PWA/offline behavior still requires real-device validation, especially iPhone standalone mode, as already identified during BUILD.

## Files Changed

- `app-clean.js`
- `modules.js`

## Result

All six actionable FRICTION findings were repaired with a two-file surgical patch. No known change-caused regression was identified by the available static and repository-level validation. Runtime and real-device PWA verification remain explicitly unverified.
