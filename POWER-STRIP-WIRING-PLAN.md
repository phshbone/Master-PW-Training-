# POWER STRIP WIRING PLAN

**App:** Master Poll Worker Guide / Poll Worker Training

**Power Strip Version:** 1.0

**Source:** Existing-app conversion into a clean rebuild

## Locked Objective

Build a clean, mobile-first Morris County poll-worker training/reference PWA that preserves the settled Early Voting vs. Election Day distinctions, supports fast field procedures, trainer/reference material, Master Poll Worker operational guidance, global search, notes/Board questions, local progress tracking, and offline use without inheriting the patch-on-patch structure of TEST-APP-2.

The rebuild must preserve the product decisions already settled in the project, including:

- separate Early Voting and Election Day modes;
- Procedures for immediate field answers;
- Guide/Training material for teaching normal workflow;
- Master Poll Worker/reference material in the hamburger/reference layer;
- global Search in the hamburger layer, not as a bottom-nav tab;
- compact source links and explicit official-vs-field-practice labeling;
- local persistence for user progress, notes, and training status;
- current-source precedence when older Morris material conflicts with newer specific guidance;
- the governing escalation rule: **STOP — DO NOT GUESS. CONTACT THE BOARD OF ELECTIONS.**

## Nerve Center

| Responsibility | Status | Notes |
|---|---|---|
| State coordination | ADD | One small application store with namespaced module state and controlled update actions. No undifferentiated mutable global object. |
| Storage coordination | MODIFY | Preserve local-first behavior, but replace direct scattered `localStorage` writes with one storage adapter and schema version. |
| Lifecycle coordination | ADD | One startup/restore path and one coordinated visibility/pageshow path. Modules do not register competing lifecycle systems. |
| Navigation | MODIFY | One router/controller owns route, mode, menu/search overlay, back behavior, and scroll policy. |
| PWA infrastructure | MODIFY | Keep installable/offline PWA; centralize service-worker version/update behavior and offline shell strategy. |
| Migration | ADD | Versioned persisted-state schema with explicit migration from legacy keys where useful. |
| Recovery | ADD | Corrupt/missing local state falls back safely without losing static content; import/restore hook reserved. |
| Module registration | ADD | Small registry declares module id, routes, state ownership, outlets, search content, and tests. |
| Testing hooks | ADD | Stable store/router/storage/search interfaces exposed for structured tests; avoid tests depending only on DOM clicking. |

## Active Outlets

| Outlet | Why Active | Owner / Adapter |
|---|---|---|
| Local Storage | Persist mode, progress, training status, notes, Board questions, and settings locally | `storage` adapter in Nerve Center |
| Navigation | Core route switching, mode-aware screens, hamburger/reference routes, back/return behavior | `router` |
| Lifecycle | Restore state and coordinate PWA reopen/visibility behavior | `lifecycle` |
| Search | Global search across procedures, aliases, guide topics, forms, equipment, Master Reference | `search` service/index |
| PWA / Offline | App is used in polling environments where connectivity may be unreliable | `pwa` adapter + service worker |
| Import / Export / Backup | Existing product includes Settings & Backup and local data has operational value | `backup` adapter; simple JSON export/import first |
| History / Daily Report | Training/report history and carry-forward notes already exist | reporting/history module via storage |

## Dormant / Available Outlets

| Outlet | Expansion Reason |
|---|---|
| Cloud Sync | Possible future multi-device continuity; do not implement now |
| Shared Identity / Permissions | Needed only if operations message board/shared staff features become real |
| External Data / API | Future attendance integration or Board/current-information feed |
| Share Sheet | Could support sharing/exporting reports later |
| PDF / Printing | Possible future printable reports/checklists; no current implementation required |
| Notifications | Only if future reminders or operations alerts are explicitly added |

## Modules

### MODULE: Home / Control Center

- **Purpose:** Fast entry point, current mode, high-priority shortcuts, at-a-glance status.
- **State owned:** Home-only UI preferences such as collapsed/expanded dashboard state.
- **Persistence:** Local, optional/minimal.
- **Uses outlets:** navigation, storage.
- **Dependencies:** Reads training/progress summaries through exported read contracts only.
- **Contracts exported:** none required beyond route registration.
- **Lifecycle participation:** none beyond normal render.
- **Shared/local status:** local.
- **Tests:** mode display, route shortcuts, summary counts, no duplicated state ownership.

### MODULE: Guide / Trainer Checklist

- **Purpose:** Teach normal poll-worker workflows and track lesson/checklist completion.
- **State owned:** guide progress, lesson open state, lesson training status.
- **Persistence:** local persistent progress/status; transient open/closed UI state may remain session/local.
- **Uses outlets:** storage, navigation, search, history/reporting.
- **Dependencies:** procedure cross-links through route ids, not direct procedure internals.
- **Contracts exported:** `guide-summary-read`, `guide-topic-open`.
- **Lifecycle participation:** none.
- **Shared/local status:** local.
- **Tests:** status updates, progress counts, reload persistence, mode filtering, cross-link navigation.

### MODULE: Field Procedures

- **Purpose:** Immediate "what do I do now?" operational cards for flags, records, provisional, assistance, primary, equipment, opening/closing, and unusual situations.
- **State owned:** procedure category, target procedure, procedure-local checklist progress if used.
- **Persistence:** category/target optional; checklist progress persistent only where operationally useful.
- **Uses outlets:** navigation, search, storage, source/reference links.
- **Dependencies:** Guide and Master Reference only through route contracts; source metadata through content model.
- **Contracts exported:** `procedure-open(id)`, `procedure-search-documents-read`.
- **Lifecycle participation:** none.
- **Shared/local status:** local content + local user progress.
- **Tests:** mode filtering, decision cards, warnings, related links, source footer rendering, aliases, Board-escalation rendering.

### MODULE: Opening / Closing Routines

- **Purpose:** Large routine cards for Early Voting and Election Day opening/closing with one-level collapsible phases.
- **State owned:** phase expansion and optional checklist progress.
- **Persistence:** progress may be local persistent per current session/day; architecture should allow reset by day/mode.
- **Uses outlets:** storage, navigation, search.
- **Dependencies:** shared procedure content model; no direct dependency on training tracker.
- **Contracts exported:** routine ids searchable/openable like other procedures.
- **Lifecycle participation:** none.
- **Shared/local status:** local.
- **Tests:** correct mode visibility, one-level phase behavior, expand/collapse-all, critical warnings, distinct EV vs ED close logic.

### MODULE: Master Poll Worker Reference

- **Purpose:** First-round checks, staffing, ADA/electioneering rounds, connectivity, pilot/co-pilot, conflict handling, escalation, site-management reminders, Today’s Briefing.
- **State owned:** Today’s Briefing notes and any MPW-only local checklist state.
- **Persistence:** local persistent.
- **Uses outlets:** storage, search, navigation.
- **Dependencies:** may link to procedures/reference entries through route ids.
- **Contracts exported:** `mpw-reference-search-documents-read`.
- **Lifecycle participation:** none.
- **Shared/local status:** local.
- **Tests:** notes save/reload, search indexing, links to relevant procedures.

### MODULE: Search

- **Purpose:** One global search entry in hamburger/reference layer across Procedures, Guide, Master Reference, aliases, forms, equipment, and references.
- **State owned:** query, result selection, optional recent searches.
- **Persistence:** query/session state only by default; no need to persist history unless later requested.
- **Uses outlets:** navigation.
- **Dependencies:** consumes read-only search document providers from content modules.
- **Contracts exported:** `search(query, mode)`, `open-result(ref)`.
- **Lifecycle participation:** build/rebuild index on app/content initialization only.
- **Shared/local status:** local.
- **Tests:** ranking, aliases, mode filtering, empty/no-result behavior, direct navigation.

### MODULE: Training Tracker / Daily Report

- **Purpose:** Record worker training status, notes, end-of-day summary, carry-forward priorities, and saved history.
- **State owned:** worker presence text, topic statuses, topic notes, daily notes, report history, report date.
- **Persistence:** local persistent with schema versioning.
- **Uses outlets:** storage, history, backup.
- **Dependencies:** reads Guide topic ids through stable ids; does not own Guide lesson state.
- **Contracts exported:** `training-summary-read`, `report-history-read`.
- **Lifecycle participation:** date normalization on startup; explicit Finish Day / Start Tomorrow actions.
- **Shared/local status:** local.
- **Tests:** save/reload, date handling, status calculations, finish/start-day behavior, legacy migration.

### MODULE: Board Questions / Verification Queue

- **Purpose:** Separate unresolved procedure questions from daily operational notes.
- **State owned:** user-added Board questions plus static verification items when appropriate.
- **Persistence:** local persistent.
- **Uses outlets:** storage, search, backup.
- **Dependencies:** procedures may link to a Board-question id, but cannot mutate this module directly except through `board-question-add` action.
- **Contracts exported:** `board-question-add`, `board-questions-read`.
- **Lifecycle participation:** none.
- **Shared/local status:** local.
- **Tests:** add/edit/remove if supported, reload, export/import.

### MODULE: Current Information / References

- **Purpose:** Important dates/rules, official source links, reference library, source/version notes.
- **State owned:** minimal UI state only; content is static/versioned app content.
- **Persistence:** no user persistence required except optional bookmarks later.
- **Uses outlets:** navigation, search, external-link handling.
- **Dependencies:** none.
- **Contracts exported:** `reference-search-documents-read`, `reference-open`.
- **Lifecycle participation:** none.
- **Shared/local status:** static app content.
- **Tests:** source links, mode/jurisdiction labels, search indexing.

### MODULE: Settings / Backup

- **Purpose:** Export/import local user state, reset selected data, display app/content/schema version.
- **State owned:** settings preferences only.
- **Persistence:** local.
- **Uses outlets:** storage, backup, PWA version information.
- **Dependencies:** receives serialized state through Nerve Center backup contract; never reaches directly into module internals.
- **Contracts exported:** none beyond route.
- **Lifecycle participation:** none.
- **Shared/local status:** local.
- **Tests:** export round-trip, import validation, safe reset, corrupted import rejection.

## State Ownership Map

| State | Owner | Persistence | Other Readers | Other Writers / Contract |
|---|---|---|---|---|
| active mode | Nerve Center / router | local | all mode-aware modules | only `setMode(mode)` |
| active route / overlay | router | session/local optional | shell | only router actions |
| guide progress | Guide | local | Home, Report | Guide actions only |
| lesson training status | Guide | local | Training/Report through mapping contract if retained | Guide actions; explicit sync adapter only |
| field procedure category/target | Field Procedures | session/local optional | Search/router | procedure navigation actions |
| routine checklist progress | Opening/Closing | local/session-by-day | Home optional | routine actions only |
| Today’s Briefing | Master Poll Worker Reference | local | Search optional | MPW note actions only |
| Board questions | Board Questions | local | Search, Report optional | `board-question-*` contract |
| training topic status/notes | Training Tracker | local | Home, Report | Training actions only |
| daily notes/report history | Daily Report | local | Settings/Backup | Report actions only |
| search query/results | Search | session | Search UI | Search actions only |
| settings | Settings | local | Nerve Center as needed | Settings actions only |
| content data | Static content modules | bundled app files | Search/renderers | build-time only |

## Dependency Map

| Consumer | Provider | Contract | Access | Required? | Failure Behavior |
|---|---|---|---|---|---|
| Home | Guide | `guide-summary-read` | read | optional | show no/zero summary, keep navigation usable |
| Home | Training | `training-summary-read` | read | optional | omit tracker summary |
| Search | Procedures | `procedure-search-documents-read` | read | required | search remains available for other providers; log missing provider in dev |
| Search | Guide | `guide-search-documents-read` | read | required | same |
| Search | MPW Reference | `mpw-reference-search-documents-read` | read | required | same |
| Procedures | Router | `openRoute/openProcedure` | action | required | remain on current card; no state mutation |
| Guide | Router | route/open contracts | action | required | remain in Guide |
| Training | Guide | stable topic-id mapping/read summary only | read | optional | no automatic sync rather than corrupting either owner |
| Settings | Nerve Center storage | `exportState/importState/resetState` | action | required | reject invalid operation safely |
| All persistent modules | Storage | namespaced read/write | read/write | required | fallback to in-memory/default state and surface recovery notice if needed |

## Event / Lifecycle Map

| Event | Emitter / Owner | Listener(s) | Payload / Rule | Duplication Risk |
|---|---|---|---|---|
| app:init | Nerve Center | router, storage, search, modules | normalized state + schema version | HIGH if modules also self-init globally |
| state:changed | Nerve Center/store | renderer, persistence adapter | changed namespace/action | MEDIUM; batch/route through one dispatcher |
| mode:changed | router/store | mode-aware modules, search | `early` / `election` | MEDIUM if modules attach their own global mode listeners |
| route:changed | router | shell/render layer | route + params + scroll rule | MEDIUM |
| storage:loaded | storage | Nerve Center | normalized persisted state | LOW |
| storage:error | storage | recovery UI/log hook | non-sensitive error code | LOW |
| content:ready | content registry | search | provider docs/version | LOW |
| visibility/pageshow | lifecycle | storage verification/PWA adapter only as needed | event metadata | HIGH if every module adds listeners |
| sw:update-available | PWA adapter | shell/settings | version/update state | LOW |

## Persistence / Sync Map

- **Primary persistence:** browser `localStorage` through one adapter for this build.
- **State shape:** namespaced by module under one versioned application schema, e.g. `mpw.state.v1`.
- **Migration:** inspect legacy keys such as `mpwg-build-0-1` / `mpwg-build-0-2`; migrate only user-created state worth preserving. Static obsolete app content is not migrated.
- **Corruption handling:** failed parse/validation must not prevent app startup; preserve raw backup where feasible, fall back to defaults, and expose reset/import recovery.
- **Sync:** none in current build. Cloud/shared sync remains a dormant outlet.
- **Backup:** JSON export/import of versioned local user state. Validate schema before replacing current state.

## Testing Hooks

BUILD should expose small stable interfaces, names may vary by implementation:

- `AppStore.getState()` / `AppStore.dispatch(action)`
- `Storage.load()` / `Storage.save(namespace, value)` / `Storage.export()` / `Storage.import()`
- `Router.go(route, params)` / `Router.setMode(mode)`
- `Search.query(text, mode)` returning structured result ids rather than rendered HTML
- `Registry.getModule(id)` / `Registry.listSearchProviders()`
- pure render/data helpers for decision cards, badges, source footers, and mode filtering where practical

No feature should require tests to mutate private globals directly.

## Contract Violations / Exceptions

Existing app violations to eliminate during rebuild:

1. Current `app.js` uses one large mutable `state` object and direct `localStorage` save/load from the application layer.
2. Rendering, navigation, state mutation, persistence, and domain behavior are concentrated in one large script.
3. TEST-APP-2 adds multiple late-loaded override scripts that repeatedly wrap/replace render functions and listeners.
4. Current bottom navigation contains Lookup even though the locked design moves Search to the hamburger/reference layer.
5. Current service-worker logic is functional but versioning/update policy is manually embedded and should be owned by the PWA adapter.

No architectural exception is required for the clean rebuild.

## BUILD Rules

1. Build on `clean-rebuild`; do not modify TEST-APP-2 during the clean implementation.
2. Keep the Nerve Center small: store, storage, router, lifecycle, registry, PWA adapter. Domain content does not belong there.
3. Static procedure/reference content and user-created state must remain separate.
4. Each meaningful state area has exactly one owner.
5. Modules communicate through ids/contracts, never by mutating another module's private state.
6. No patch scripts that monkey-patch `render`, global listeners, or source data after load.
7. One coordinated render/event-binding strategy; avoid repeated post-render listener installation.
8. One Search service/index. Providers contribute structured searchable documents.
9. One storage adapter and one schema version. No scattered raw `localStorage` calls.
10. One lifecycle coordinator. Modules do not independently attach overlapping `pageshow`, visibility, orientation, or service-worker update systems unless registered through the coordinator.
11. Preserve offline/PWA behavior and test it explicitly on real iPhone/PWA installation.
12. Preserve source/version discipline in the content model; newer specific official guidance may supersede older wording without deleting historical source metadata when useful.
13. Critical-warning styling is reserved for high-consequence errors; ordinary notes use ordinary callouts.
14. Opening/closing routines may use one level of named collapsible phases; avoid accordion-inside-accordion architecture.
15. Do not implement dormant outlets merely because seams are defined.

## Validation Plan

### Architecture Tests

- initialize with no stored state;
- initialize with valid stored state;
- initialize with corrupt/partial stored state;
- migrate preserved legacy user state where mapped;
- save and reload each persistent namespace;
- switch mode without cross-mode state collision;
- route changes and back/return behavior;
- Search provider registration and mode filtering;
- module registration uniqueness;
- no duplicate global lifecycle listeners;
- service-worker version/update flow where automatable.

### Module Tests

- Guide progress/status operations;
- procedure category/open/cross-link behavior;
- EV vs ED opening/closing visibility and content selection;
- Search ranking/aliases/direct open;
- Today’s Briefing save/reload;
- Board Questions save/reload;
- Training tracker/report calculations;
- backup export/import/reset;
- source footer and critical-warning rendering.

### Integration Tests

- Guide → Procedure → Return;
- Search → result in Guide/Procedure/Reference;
- mode change while on a mode-specific card;
- training/progress summaries on Home after updates;
- Finish Day / Start Tomorrow with persisted report history;
- backup export → reset → import → state equivalence;
- multiple modules saving without overwriting one another;
- PWA reopen with last meaningful state restored according to route policy.

### Real-Device / Live-Service Tests

**REAL-DEVICE TEST REQUIRED**

- iPhone Safari and installed-PWA layout;
- safe-area/top/bottom navigation behavior;
- offline cold reopen after prior successful load;
- service-worker update after deploying a new build;
- localStorage persistence across normal close/reopen;
- keyboard/search overlay behavior on phone;
- orientation changes where relevant;
- external official-source links from installed PWA.

## Expansion Notes

Preserve seams, but do not build these now:

- attendance/staffing integration can plug into External Data/API and Identity later;
- operations message board can become a separate Shared Operations module using Cloud Sync + Identity if approved later;
- PDF/printable reports can plug into the Report module through the dormant PDF/Printing outlet;
- notifications/reminders can be added through the Notifications outlet without changing procedure/content ownership.

---

**POWER STRIP status:** FROZEN FOR BUILD unless implementation reveals a material architectural conflict. BUILD should treat this wiring plan as the architectural contract for the clean rebuild.
