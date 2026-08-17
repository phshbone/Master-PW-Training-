# FRICTION AUDIT

**App:** Master Poll Worker Guide / Poll Worker Training
**Branch:** `clean-rebuild`
**Mode:** Predictive Friction Audit
**Basis:** static inspection of clean rebuild source. Real-device PWA behavior remains unverified.

## Primary journeys reviewed

1. Switch between Early Voting and Election Day.
2. Find an immediate field procedure.
3. Run opening/closing routines.
4. Use global Search to jump to an answer.
5. Record training status and daily notes.
6. Use Today’s Briefing / Board Questions.
7. Recover/export/import local state.

## Findings

### 1. Search result navigation is not equally precise across modules

**Category:** Navigation friction
**Severity:** HIGH
**Evidence:** Search results carry an `id`, but `Router.go(route,{id})` only produces precise deep-open behavior for procedures/guide through additional handling. Reference and MPW results can land on the top of a long section rather than the exact searched item.
**Why it matters:** Search is intended as the fastest field path. Landing near, but not at, the desired answer adds scrolling and hesitation.
**Smallest fix:** Add a stable target contract for every searchable module and scroll/focus the matched card/section after route open.
**Risk / tradeoff:** Minor implementation complexity; no product redesign.

### 2. Opening/Closing cards default to all phases collapsed

**Category:** Tap / navigation friction
**Severity:** MEDIUM
**Evidence:** Routine phase state defaults closed and requires a phase tap or Expand All before the worker sees operational steps.
**Why it matters:** Opening and closing are sequential workflows. The first action after entering the routine should be immediately visible.
**Smallest fix:** Default the first phase of the selected routine open when no saved phase state exists.
**Risk / tradeoff:** Slightly more initial vertical content, but preserves one-level accordion design.

### 3. Procedure category navigation can hide the active direct-search context

**Category:** State / navigation friction
**Severity:** MEDIUM
**Evidence:** Direct procedure results replace the category grid with a Back control. The user cannot immediately see which category the procedure belongs to except the small category badge.
**Why it matters:** In training, workers may need to understand where the answer lives for later retrieval.
**Smallest fix:** Change the back label to include the category, e.g. `← Back to ePollbook Flags`, or show the category in the page subheading.
**Risk / tradeoff:** None meaningful.

### 4. Training status labels create two overlapping concepts: completion checkbox and status

**Category:** Decision / state friction
**Severity:** MEDIUM
**Evidence:** Guide lessons have both `Covered / verified` checkbox and four status buttons (`Explained`, `Live`, `Review`, `Not reached`).
**Why it matters:** A trainer can produce contradictory states, such as checked Covered plus Not reached. The user has to decide how two status systems relate.
**Smallest fix:** Define one source of truth. Prefer deriving completion from status (`Explained` or `Live`) and remove the separate completion checkbox, or make the checkbox explicitly an action check rather than a completion status.
**Risk / tradeoff:** Existing migrated progress must be mapped carefully.

### 5. `Start Tomorrow` calculates tomorrow from the device clock, not from the displayed report date

**Category:** State friction
**Severity:** MEDIUM
**Evidence:** The action creates `new Date()` and adds one day rather than incrementing `training.reportDate`.
**Why it matters:** If a user is entering or reviewing a prior day, Start Tomorrow can jump to the wrong date.
**Smallest fix:** Parse the current report date and increment that date.
**Risk / tradeoff:** None beyond date parsing tests.

### 6. Finish Day can create duplicate history snapshots

**Category:** Recovery / repetition friction
**Severity:** MEDIUM
**Evidence:** `training/finish` appends a snapshot every time Finish Day is tapped; there is no same-date duplicate guard or visual state.
**Why it matters:** Accidental double taps or uncertainty about whether the action worked can duplicate history entries.
**Smallest fix:** If a snapshot already exists for the active report date, update/replace it or ask before creating a duplicate. Show a short saved state afterward.
**Risk / tradeoff:** Must preserve intentional re-save behavior.

### 7. Board Question removal is immediate and easy to hit on mobile

**Category:** Recovery / mobile friction
**Severity:** MEDIUM
**Evidence:** Each question has a small `×` remove button and deletion is immediate.
**Why it matters:** Questions are user-created operational data; accidental deletion is harder to recover than toggling complete.
**Smallest fix:** Use a larger target and either a short undo toast or one confirmation only for remove.
**Risk / tradeoff:** Confirmation adds one tap; undo is preferable if simple.

### 8. Menu-contained Search is correct architecturally but needs a clearly dominant entry

**Category:** Visual / mobile friction
**Severity:** LOW-MEDIUM
**Evidence:** Search is intentionally removed from bottom navigation and placed in the hamburger/reference layer.
**Why it matters:** Search is a high-frequency emergency retrieval path. If styled like ordinary reference links, users may hesitate or scroll the menu.
**Smallest fix:** Keep it in the menu as locked, but place Search at the bottom in a persistent visually distinct control with large tap target.
**Risk / tradeoff:** None if it remains within the locked hamburger architecture.

### 9. Text-field persistence has no visible saved state

**Category:** State friction
**Severity:** LOW-MEDIUM
**Evidence:** Today’s Briefing, workers present, training notes, and daily notes persist on input but no explicit saved indicator is shown.
**Why it matters:** In a field PWA, users may wonder whether closing the app will lose their notes.
**Smallest fix:** Add a subtle `Saved locally` indicator that updates after text persistence. Do not add Save buttons.
**Risk / tradeoff:** Avoid noisy animations or constant status changes.

### 10. End-of-night checklist is reference-only, not checkable

**Category:** Decision / repetition friction
**Severity:** LOW
**Evidence:** Destination lists are plain bullets.
**Why it matters:** A user may want to mark items while physically packing, but this was not explicitly locked as a checklist-state requirement.
**Smallest fix:** Leave unchanged for this build unless observed use shows repeated manual tracking workarounds.
**Risk / tradeoff:** Adding persistent checklist state creates reset/date semantics and more complexity.

## Prioritization

### FIX NOW

1. Make Search deep-link precisely to the matched item in every searchable module.
2. Remove or reconcile the duplicate Guide completion/status concepts.
3. Increment Start Tomorrow from the displayed report date.
4. Prevent or safely handle duplicate Finish Day snapshots.
5. Improve Board Question deletion recovery.
6. Default the first Opening/Closing phase open when entering a routine with no prior phase state.

### CONSIDER

1. Add a subtle `Saved locally` indicator for note fields.
2. Make direct-procedure Back language category-specific.
3. Strengthen visual prominence of Search inside the hamburger while keeping it there.

### LEAVE ALONE

1. Keep Search out of bottom navigation; the locked hamburger/search architecture reduces nav crowding.
2. Keep Early Voting and Election Day as a persistent mode switch.
3. Keep one-level collapsible phases rather than nesting accordions.
4. Keep explicit critical warnings for high-consequence actions even though they add visual weight.
5. Keep the end-of-night destination lists non-checkable until real use demonstrates a need.
6. Keep local-first/offline behavior and simple JSON backup rather than adding cloud sync.

## TOP FRICTION

1. Search can land at the correct screen but not always the exact answer.
2. Guide lesson completion and training status can contradict each other.
3. Daily-report date/history actions can produce wrong-day or duplicate records.
4. Routine entry adds an unnecessary tap before the first phase is visible.
5. User-created Board questions can be deleted too easily on a phone.

## EASY WINS

- Open the first routine phase by default.
- Increment tomorrow from the current report date.
- Replace same-date Finish Day history instead of blindly appending.
- Add category text to procedure Back behavior.
- Add a simple saved-local indicator for text notes.

## DO NOT TOUCH

- No new framework.
- No new navigation tab.
- No redesign of the locked visual identity.
- No cloud/account system.
- No deeper accordion nesting.
- No reduction of safety-critical warnings merely to save space.

## NEEDS REAL-WORLD TESTING

1. Thumb reach and bottom-nav/menu reachability on the actual iPhone models used in the field.
2. Installed-PWA safe-area behavior and keyboard obstruction.
3. Search speed and result quality with the full procedure corpus.
4. Offline startup after a fresh install and after an update.
5. Service-worker update behavior when a newer build is deployed.
6. Long procedure/routine scrolling during actual poll-opening and closing work.
7. Whether the Election Day end-of-night destination list should become a temporary checkable checklist.
8. Whether users naturally find Search in the hamburger under time pressure.

## Current vs proposed high-value changes

**Current:** Search opens the destination route, but some result types do not focus the exact matched section.  
**Proposed:** Every search document exposes an open-target/focus id.  
**Benefit:** Removes scrolling and uncertainty in the highest-speed retrieval workflow.  
**Cost:** Small route/focus contract change.

**Current:** Guide uses both a completion checkbox and a training-status choice.  
**Proposed:** One authoritative status model, with completion derived from it.  
**Benefit:** Removes contradictory states and one decision per lesson.  
**Cost:** Requires migration mapping for old checked progress.

**Current:** Finish Day always appends; Start Tomorrow uses the device date.  
**Proposed:** Save/update one record per report date and advance from that date.  
**Benefit:** Prevents accidental duplicate/wrong-date history.  
**Cost:** Minimal logic change.

---

**FRICTION status:** COMPLETE — predictive audit. No implementation changes were made by FRICTION itself.
