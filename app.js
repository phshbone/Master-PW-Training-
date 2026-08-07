const APP_ID = 'master-poll-worker-guide';
const STATE_VERSION = 1;
const STORAGE_KEY = 'mpwg-phase-1-v1';
const LEGACY_KEYS = ['mpwg-build-0-2', 'mpwg-build-0-1'];
const data = window.APP_DATA;
const routes = ['home', 'procedures', 'lookup', 'progress', 'report', 'dosdonts', 'board', 'current', 'settings'];

function today() {
  return new Date().toISOString().slice(0, 10);
}

function createSessionId() {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function freshState() {
  return {
    version: STATE_VERSION,
    route: 'procedures',
    mode: 'early',
    checklist: {},
    expandedProcedures: {},
    openLesson: null,
    dailyNotes: '',
    history: [],
    boardQuestions: [],
    session: {id: createSessionId(), startedOn: today()},
    lookupQuery: ''
  };
}

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function sectionItems(procedure) {
  if (procedure.type === 'teaching') {
    return procedure.lessons.map(lesson => ({id: lesson.id, label: lesson.title, lesson}));
  }
  return procedure.steps.map((label, index) => ({id: procedure.stepIds[index], label}));
}

function checklistKey(mode, procedureId, itemId) {
  return `${mode}:${procedureId}:${itemId}`;
}

function allowedChecklistKeys() {
  const keys = new Set();
  data.procedures.forEach(procedure => {
    procedure.modes.forEach(mode => {
      sectionItems(procedure).forEach(item => keys.add(checklistKey(mode, procedure.id, item.id)));
    });
  });
  return keys;
}

const validChecklistKeys = allowedChecklistKeys();

function sanitizeChecklist(value) {
  if (!isObject(value)) return {};
  return Object.fromEntries(
    Object.entries(value).filter(([key, checked]) => validChecklistKeys.has(key) && checked === true)
  );
}

function sanitizeHistory(value) {
  if (!Array.isArray(value)) return [];
  return value.slice(-50).filter(isObject).map(entry => ({
    id: typeof entry.id === 'string' ? entry.id : createSessionId(),
    date: typeof entry.date === 'string' ? entry.date : today(),
    mode: entry.mode === 'election' ? 'election' : 'early',
    summary: isObject(entry.summary) ? {
      coveredItems: Number(entry.summary.coveredItems) || Number(entry.summary.covered) || 0,
      totalItems: Number(entry.summary.totalItems) || Number(entry.summary.planned) || 0,
      completeSections: Number(entry.summary.completeSections) || 0,
      totalSections: Number(entry.summary.totalSections) || 0
    } : {coveredItems: 0, totalItems: 0, completeSections: 0, totalSections: 0}
  }));
}

function sanitizeBoardQuestions(value) {
  if (!Array.isArray(value)) return [];
  return value.slice(-100).filter(isObject).map(question => ({
    text: typeof question.text === 'string' ? question.text.slice(0, 5000) : '',
    date: typeof question.date === 'string' ? question.date : ''
  })).filter(question => question.text);
}

function sanitizeCurrentState(raw) {
  if (!isObject(raw)) throw new Error('Backup state must be an object.');
  const base = freshState();
  const mode = raw.mode === 'election' ? 'election' : 'early';
  const route = raw.route === 'training' ? 'progress' : raw.route;
  return {
    ...base,
    version: STATE_VERSION,
    route: routes.includes(route) ? route : 'procedures',
    mode,
    checklist: sanitizeChecklist(raw.checklist),
    expandedProcedures: isObject(raw.expandedProcedures)
      ? Object.fromEntries(Object.entries(raw.expandedProcedures).filter(([, open]) => open === true))
      : {},
    openLesson: typeof raw.openLesson === 'string' ? raw.openLesson : null,
    dailyNotes: typeof raw.dailyNotes === 'string' ? raw.dailyNotes.slice(0, 20000) : '',
    history: sanitizeHistory(raw.history),
    boardQuestions: sanitizeBoardQuestions(raw.boardQuestions),
    session: isObject(raw.session) && typeof raw.session.id === 'string'
      ? {id: raw.session.id, startedOn: typeof raw.session.startedOn === 'string' ? raw.session.startedOn : today()}
      : base.session,
    lookupQuery: typeof raw.lookupQuery === 'string' ? raw.lookupQuery.slice(0, 200) : ''
  };
}

function migrateLegacyState(raw) {
  if (!isObject(raw)) throw new Error('Legacy backup must be an object.');
  const next = sanitizeCurrentState({...raw, checklist: {}});
  const mode = next.mode;
  const legacyProgress = isObject(raw.procedureProgress) ? raw.procedureProgress : {};
  const legacyLessonStatus = isObject(raw.lessonStatus) ? raw.lessonStatus : {};

  data.procedures.filter(procedure => procedure.modes.includes(mode)).forEach(procedure => {
    sectionItems(procedure).forEach((item, index) => {
      let checked = false;
      if (procedure.type === 'teaching') {
        const legacyKey = `${procedure.id}:${item.id}`;
        const status = legacyLessonStatus[legacyKey]?.status;
        const actions = legacyProgress[legacyKey];
        const actionCount = item.lesson.actions?.length || 0;
        const allActionsChecked = actionCount > 0 && Array.from({length: actionCount}, (_, i) => actions?.[i] === true).every(Boolean);
        checked = ['explained', 'live', 'covered'].includes(status) || allActionsChecked;
      } else {
        checked = legacyProgress[procedure.id]?.[index] === true;
      }
      if (checked) next.checklist[checklistKey(mode, procedure.id, item.id)] = true;
    });
  });
  return next;
}

function stateFromBackupObject(parsed) {
  if (!isObject(parsed)) throw new Error('Backup must contain a JSON object.');
  if (parsed.appId || parsed.schemaVersion || parsed.state) {
    if (parsed.appId !== APP_ID || parsed.schemaVersion !== STATE_VERSION || !isObject(parsed.state)) {
      throw new Error('This backup is not compatible with this version of the app.');
    }
    return sanitizeCurrentState(parsed.state);
  }
  if ('procedureProgress' in parsed || 'lessonStatus' in parsed || 'training' in parsed) {
    return migrateLegacyState(parsed);
  }
  if (parsed.version === STATE_VERSION && isObject(parsed.checklist)) return sanitizeCurrentState(parsed);
  throw new Error('This file is not a recognized Master Poll Worker Guide backup.');
}

function loadState() {
  try {
    const current = localStorage.getItem(STORAGE_KEY);
    if (current) return sanitizeCurrentState(JSON.parse(current));
    for (const key of LEGACY_KEYS) {
      const legacy = localStorage.getItem(key);
      if (legacy) return migrateLegacyState(JSON.parse(legacy));
    }
  } catch (error) {
    console.warn('Saved progress could not be loaded.', error);
  }
  return freshState();
}

let state = loadState();
const main = document.getElementById('mainContent');
const title = document.getElementById('sectionTitle');
const sideMenu = document.getElementById('sideMenu');
const appStatus = document.getElementById('appStatus');

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function esc(value = '') {
  return String(value).replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[character]));
}

function announce(message) {
  appStatus.textContent = '';
  requestAnimationFrame(() => { appStatus.textContent = message; });
}

function modeLabel(mode = state.mode) {
  return mode === 'early' ? 'Early Voting' : 'Election Day';
}

function modeProcedures(mode = state.mode) {
  return data.procedures.filter(procedure => procedure.modes.includes(mode));
}

function sectionProgress(procedure, mode = state.mode, checklist = state.checklist) {
  const items = sectionItems(procedure);
  const covered = items.filter(item => checklist[checklistKey(mode, procedure.id, item.id)]).length;
  return {covered, total: items.length, complete: items.length > 0 && covered === items.length};
}

function overallProgress(mode = state.mode, checklist = state.checklist) {
  const procedures = modeProcedures(mode);
  const sections = procedures.map(procedure => sectionProgress(procedure, mode, checklist));
  return {
    coveredItems: sections.reduce((sum, item) => sum + item.covered, 0),
    totalItems: sections.reduce((sum, item) => sum + item.total, 0),
    completeSections: sections.filter(item => item.complete).length,
    totalSections: sections.length
  };
}

function isExpanded(procedureId) {
  return Boolean(state.expandedProcedures[`${state.mode}:${procedureId}`]);
}

function pageHeading(name, sub = '') {
  return `<div class="page-heading"><h2>${esc(name)}</h2>${sub ? `<p>${esc(sub)}</p>` : ''}</div>`;
}

function badges(items = []) {
  return `<div class="badge-row">${items.map(item => `<span class="badge">${esc(item)}</span>`).join('')}</div>`;
}

function progressSummary(progress) {
  const percent = progress.totalItems ? Math.round((progress.coveredItems / progress.totalItems) * 100) : 0;
  return `<div class="overall-progress card" aria-label="${progress.coveredItems} of ${progress.totalItems} topics covered">
    <div><strong>${progress.coveredItems} of ${progress.totalItems}</strong><span>topics covered</span></div>
    <div><strong>${progress.completeSections} of ${progress.totalSections}</strong><span>sections complete</span></div>
    <div class="progress-track" aria-hidden="true"><span style="width:${percent}%"></span></div>
  </div>`;
}

function renderHome() {
  title.textContent = 'Master Poll Worker Guide';
  const progress = overallProgress();
  return `${pageHeading('Trainer Control Center', `${modeLabel()} • session started ${state.session.startedOn}`)}
    ${progressSummary(progress)}
    <div class="card">
      <h3>Resume the trainer checklist</h3>
      <p>Checking a topic means that teaching point was covered. Your place stays on this device until you deliberately reset the checklist.</p>
      <button class="primary full" data-go="procedures">Open Checklist</button>
    </div>
    <div class="notice-box"><strong>Training aid, not official instruction.</strong> Use current Board of Elections materials and live direction whenever they differ. Unresolved notes remain clearly marked for verification.</div>
    <div class="grid two">
      <button class="card quick-card" data-go="lookup"><strong>Quick Lookup</strong><span>Find existing procedures and critical warnings.</span></button>
      <button class="card quick-card" data-go="progress"><strong>Progress</strong><span>See section completion derived from the checklist.</span></button>
      <button class="card quick-card" data-go="report"><strong>Session Summary</strong><span>Review coverage without entering it again.</span></button>
      <button class="card quick-card" data-go="board"><strong>Board Questions</strong><span>Keep unresolved questions separate from instructions.</span></button>
    </div>`;
}

function infoBlock(label, className, content) {
  if (!content || (Array.isArray(content) && !content.length)) return '';
  const body = Array.isArray(content)
    ? `<ul>${content.map(item => `<li>${esc(item)}</li>`).join('')}</ul>`
    : `<p>${esc(content)}</p>`;
  return `<section class="teaching-block ${className}"><h5>${esc(label)}</h5>${body}</section>`;
}

function sectionHeader(procedure, progress, expanded) {
  return `<button class="procedure-toggle" data-toggle-procedure="${esc(procedure.id)}" aria-expanded="${expanded}">
    <span class="procedure-title-row"><span class="procedure-title">${esc(procedure.title)}</span>
      <span class="section-progress ${progress.complete ? 'complete' : ''}">
        ${progress.complete ? '<span aria-hidden="true">✓</span> Complete' : `${progress.covered} of ${progress.total}`}
      </span>
    </span>
    <span class="summary">${esc(procedure.summary)}</span>
    ${badges(procedure.badges)}
    <span class="open-hint">${expanded ? 'Hide topics' : 'Show topics'}</span>
  </button>`;
}

function standardProcedureMarkup(procedure) {
  const progress = sectionProgress(procedure);
  const expanded = isExpanded(procedure.id);
  return `<section class="card procedure-card ${expanded ? 'expanded' : ''} ${progress.complete ? 'section-complete' : ''}" data-procedure="${esc(procedure.id)}">
    ${sectionHeader(procedure, progress, expanded)}
    <div class="procedure-detail">
      ${procedure.warning ? `<div class="warning-box">${esc(procedure.warning)}</div>` : ''}
      <div class="step-list">${sectionItems(procedure).map((item, index) => {
        const key = checklistKey(state.mode, procedure.id, item.id);
        const inputId = `topic-${state.mode}-${procedure.id}-${item.id}`;
        return `<div class="step-item"><input type="checkbox" id="${esc(inputId)}" data-cover-key="${esc(key)}" data-section="${esc(procedure.id)}" ${state.checklist[key] ? 'checked' : ''}><label for="${esc(inputId)}">${index + 1}. ${esc(item.label)}</label></div>`;
      }).join('')}</div>
    </div>
  </section>`;
}

function teachingProcedureMarkup(procedure) {
  const progress = sectionProgress(procedure);
  const expanded = isExpanded(procedure.id);
  return `<section class="card procedure-card teaching-procedure ${expanded ? 'expanded' : ''} ${progress.complete ? 'section-complete' : ''}" data-procedure="${esc(procedure.id)}">
    ${sectionHeader(procedure, progress, expanded)}
    <div class="procedure-detail lesson-stack">${sectionItems(procedure).map((item, index) => {
      const lesson = item.lesson;
      const key = checklistKey(state.mode, procedure.id, item.id);
      const openKey = `${state.mode}:${procedure.id}:${item.id}`;
      const open = state.openLesson === openKey;
      const inputId = `topic-${state.mode}-${procedure.id}-${item.id}`;
      return `<article class="lesson-card ${open ? 'active' : ''} ${state.checklist[key] ? 'topic-complete' : ''}" data-lesson-card="${esc(openKey)}">
        <div class="lesson-summary-row">
          <input type="checkbox" id="${esc(inputId)}" data-cover-key="${esc(key)}" data-section="${esc(procedure.id)}" ${state.checklist[key] ? 'checked' : ''}>
          <label for="${esc(inputId)}"><span class="lesson-number">${index + 1}</span><span class="lesson-title-wrap"><strong>${esc(lesson.title)}</strong><small>${esc(lesson.lead)}</small></span></label>
          <button class="lesson-toggle" data-open-lesson="${esc(openKey)}" aria-expanded="${open}" aria-label="${open ? 'Hide' : 'Show'} reference details for ${esc(lesson.title)}"><span class="chevron" aria-hidden="true">⌄</span></button>
        </div>
        <div class="lesson-detail">
          ${infoBlock('Official Procedure', 'official', lesson.official)}
          ${infoBlock('Why It Matters', 'why', lesson.why)}
          ${infoBlock('Master Worker Tip', 'tip', lesson.tips)}
          ${infoBlock('Common Mistake', 'mistake', lesson.mistakes)}
          ${infoBlock('Practice Points', 'actions', lesson.actions)}
        </div>
      </article>`;
    }).join('')}</div>
  </section>`;
}

function procedureMarkup(procedure) {
  return procedure.type === 'teaching' ? teachingProcedureMarkup(procedure) : standardProcedureMarkup(procedure);
}

function renderProcedures() {
  title.textContent = 'Trainer Checklist';
  const procedures = modeProcedures();
  const progress = overallProgress();
  return `${pageHeading('Trainer Checklist', `${modeLabel()} • check each topic when it has been covered`)}
    ${progressSummary(progress)}
    ${procedures.map(procedureMarkup).join('')}`;
}

function renderLookup() {
  const query = (state.lookupQuery || '').trim().toLowerCase();
  const list = modeProcedures().filter(procedure => JSON.stringify(procedure).toLowerCase().includes(query));
  title.textContent = 'Quick Lookup';
  return `${pageHeading('Quick Lookup', `Search the existing ${modeLabel()} guide and warnings.`)}
    <label class="sr-only" for="lookupInput">Search procedures</label>
    <input id="lookupInput" class="search-box" type="search" placeholder="Search mail-in, preload, reprint, spoil…" value="${esc(state.lookupQuery)}">
    <div class="lookup-results">${list.length ? list.map(procedureMarkup).join('') : '<div class="card empty">No matching procedure.</div>'}</div>`;
}

function renderProgress() {
  title.textContent = 'Checklist Progress';
  const progress = overallProgress();
  return `${pageHeading('Checklist Progress', `Every number below comes from the ${modeLabel()} checklist.`)}
    ${progressSummary(progress)}
    <div class="progress-list">${modeProcedures().map(procedure => {
      const section = sectionProgress(procedure);
      return `<button class="card progress-card ${section.complete ? 'section-complete' : ''}" data-jump-procedure="${esc(procedure.id)}">
        <span><strong>${esc(procedure.title)}</strong><small>${section.covered} of ${section.total} topics covered</small></span>
        <span class="section-progress ${section.complete ? 'complete' : ''}">${section.complete ? '✓ Complete' : 'In progress'}</span>
      </button>`;
    }).join('')}</div>`;
}

function renderDosDonts() {
  title.textContent = 'Procedure Reminders';
  const renderItems = (items, type) => items.map((item, index) => `<article class="rule-card ${type}">
    <button class="rule-toggle" data-rule-toggle="${type}-${index}" aria-expanded="false"><span class="rule-icon">${type === 'do' ? 'DO' : 'DON’T'}</span><strong>${esc(item.text)}</strong><span class="chevron" aria-hidden="true">⌄</span></button>
    <div class="rule-detail"><p>${esc(item.detail)}</p>${badges(item.tags)}</div>
  </article>`).join('');
  return `${pageHeading('Procedure Reminders', 'Fast reminders retained from the existing guide; verify current Board materials whenever instructions differ.')}
    <div class="notice-box"><strong>Source-status caution:</strong> These reminders are not labeled as Board-approved publication content. Unresolved procedural wording remains subject to verification.</div>
    <section class="card rules-section"><h3 class="do-heading">DO</h3>${renderItems(data.dosDonts.dos, 'do')}</section>
    <section class="card rules-section"><h3 class="dont-heading">DON’T</h3>${renderItems(data.dosDonts.donts, 'dont')}</section>`;
}

function snapshotSummary() {
  return overallProgress();
}

function renderReport() {
  title.textContent = 'Session Summary';
  const summary = snapshotSummary();
  const incomplete = modeProcedures().filter(procedure => !sectionProgress(procedure).complete);
  return `${pageHeading('Session Summary', `${modeLabel()} • session started ${state.session.startedOn}`)}
    ${progressSummary(summary)}
    <div class="card"><h3>Sections still in progress</h3>${incomplete.length
      ? `<ul>${incomplete.map(procedure => { const section = sectionProgress(procedure); return `<li>${esc(procedure.title)} — ${section.covered} of ${section.total}</li>`; }).join('')}</ul>`
      : '<p class="complete-message">✓ Every visible section is complete.</p>'}</div>
    <div class="card"><h3>General training notes</h3><p class="small">Do not enter voter names, addresses, signatures, voter IDs, or identifiable incident details.</p><textarea id="dailyNotes" placeholder="Generalized Board questions or follow-up only">${esc(state.dailyNotes)}</textarea></div>
    <div class="controls"><button id="saveSnapshot" class="primary">Save Session Snapshot</button></div>
    <div class="card"><h3>Saved snapshots</h3>${state.history.length ? state.history.slice().reverse().map(entry => `<div class="report-stat"><span>${esc(entry.date)} • ${esc(modeLabel(entry.mode))}</span><strong>${entry.summary.coveredItems}/${entry.summary.totalItems}</strong></div>`).join('') : '<p class="small">No session snapshots saved yet.</p>'}</div>`;
}

function renderBoard() {
  title.textContent = 'Board Questions';
  return `${pageHeading('Board Clarification Notes', 'Capture unresolved rules without treating them as official instructions.')}
    <div class="notice-box"><strong>Privacy:</strong> Do not enter voter names, addresses, signatures, voter IDs, or identifiable incident details.</div>
    <div class="card"><label class="sr-only" for="boardQuestionText">Board clarification question</label><textarea id="boardQuestionText" placeholder="Generalized issue, risk, and requested clarification"></textarea><button id="addBoardQuestion" class="primary full">Add Question</button></div>
    ${state.boardQuestions.length ? state.boardQuestions.map((question, index) => `<div class="card"><span class="pill">Needs Board Confirmation</span><p>${esc(question.text)}</p><p class="small">${esc(question.date)}</p><button class="danger" data-delete-question="${index}">Delete</button></div>`).join('') : '<div class="card empty">No Board questions saved.</div>'}`;
}

function renderCurrent() {
  title.textContent = 'Current Information';
  return `${pageHeading('Current Information', 'External official pages open outside the app when embedding is blocked.')}${data.currentLinks.map(link => `<div class="card link-card"><h3>${esc(link.title)}</h3><a href="${esc(link.url)}" target="_blank" rel="noopener">Open Official Page</a></div>`).join('')}`;
}

function renderSettings() {
  title.textContent = 'Settings & Backup';
  return `${pageHeading('Settings & Backup', 'Checklist progress remains on this device unless you export it.')}
    <div class="card"><h3>Backup</h3><p class="small">Exports use a versioned format. Compatible older app backups are migrated after validation.</p><div class="controls"><button id="exportJson" class="primary">Export JSON</button><label class="secondary file-button"><input id="importJson" type="file" accept="application/json" hidden>Import JSON</label></div></div>
    <div class="card"><h3>Reset checklist session</h3><p class="small">This is the only action that clears active checklist progress. Saved snapshots, Board questions, and notes remain.</p><button id="resetChecklist" class="danger">Reset Checklist Session</button></div>`;
}

const renderers = {home: renderHome, procedures: renderProcedures, lookup: renderLookup, progress: renderProgress, report: renderReport, dosdonts: renderDosDonts, board: renderBoard, current: renderCurrent, settings: renderSettings};

function setRoute(route) {
  state.route = routes.includes(route) ? route : 'procedures';
  saveState();
  render();
  if (sideMenu.open) sideMenu.close();
  window.scrollTo({top: 0, behavior: 'smooth'});
  main.focus({preventScroll: true});
}

function render() {
  document.querySelectorAll('.mode-button').forEach(button => {
    const active = button.dataset.mode === state.mode;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('.nav-button').forEach(button => button.classList.toggle('active', button.dataset.route === state.route));
  main.innerHTML = (renderers[state.route] || renderProcedures)();
  bindDynamic();
}

function bindDynamic() {
  document.querySelectorAll('[data-go]').forEach(button => { button.onclick = () => setRoute(button.dataset.go); });
  document.querySelectorAll('[data-toggle-procedure]').forEach(button => {
    button.onclick = () => {
      const key = `${state.mode}:${button.dataset.toggleProcedure}`;
      state.expandedProcedures[key] = !state.expandedProcedures[key];
      saveState();
      render();
    };
  });
  document.querySelectorAll('[data-cover-key]').forEach(checkbox => {
    checkbox.onchange = () => {
      if (checkbox.checked) state.checklist[checkbox.dataset.coverKey] = true;
      else delete state.checklist[checkbox.dataset.coverKey];
      const procedure = data.procedures.find(item => item.id === checkbox.dataset.section);
      const progress = sectionProgress(procedure);
      saveState();
      render();
      document.querySelector(`[data-cover-key="${CSS.escape(checkbox.dataset.coverKey)}"]`)?.focus();
      announce(progress.complete ? `${procedure.title} complete.` : `${procedure.title}: ${progress.covered} of ${progress.total} topics covered.`);
    };
  });
  document.querySelectorAll('[data-open-lesson]').forEach(button => {
    button.onclick = () => {
      const key = button.dataset.openLesson;
      state.openLesson = state.openLesson === key ? null : key;
      saveState();
      render();
      document.querySelector(`[data-open-lesson="${CSS.escape(key)}"]`)?.focus();
    };
  });
  document.querySelectorAll('[data-rule-toggle]').forEach(button => {
    button.onclick = () => {
      const card = button.closest('.rule-card');
      const expanded = card.classList.toggle('expanded');
      button.setAttribute('aria-expanded', String(expanded));
    };
  });
  document.querySelectorAll('[data-jump-procedure]').forEach(button => {
    button.onclick = () => {
      state.expandedProcedures[`${state.mode}:${button.dataset.jumpProcedure}`] = true;
      state.route = 'procedures';
      saveState();
      render();
      requestAnimationFrame(() => document.querySelector(`[data-procedure="${CSS.escape(button.dataset.jumpProcedure)}"]`)?.scrollIntoView({behavior: 'smooth', block: 'start'}));
    };
  });
  const lookup = document.getElementById('lookupInput');
  if (lookup) lookup.oninput = () => {
    const cursor = lookup.selectionStart;
    state.lookupQuery = lookup.value;
    saveState();
    render();
    const next = document.getElementById('lookupInput');
    next?.focus();
    next?.setSelectionRange(cursor, cursor);
  };
  const notes = document.getElementById('dailyNotes');
  if (notes) notes.oninput = () => { state.dailyNotes = notes.value; saveState(); };
  const snapshot = document.getElementById('saveSnapshot');
  if (snapshot) snapshot.onclick = saveSnapshot;
  const addQuestion = document.getElementById('addBoardQuestion');
  if (addQuestion) addQuestion.onclick = () => {
    const input = document.getElementById('boardQuestionText');
    const text = input.value.trim();
    if (!text) return;
    state.boardQuestions.push({text: text.slice(0, 5000), date: new Date().toLocaleString()});
    saveState();
    render();
  };
  document.querySelectorAll('[data-delete-question]').forEach(button => {
    button.onclick = () => {
      state.boardQuestions.splice(Number(button.dataset.deleteQuestion), 1);
      saveState();
      render();
    };
  });
  const exportButton = document.getElementById('exportJson');
  if (exportButton) exportButton.onclick = exportJson;
  const importInput = document.getElementById('importJson');
  if (importInput) importInput.onchange = importJson;
  const resetButton = document.getElementById('resetChecklist');
  if (resetButton) resetButton.onclick = resetChecklist;
}

function saveSnapshot() {
  const summary = snapshotSummary();
  state.history.push({id: `${state.session.id}-${Date.now()}`, date: today(), mode: state.mode, summary});
  state.history = state.history.slice(-50);
  saveState();
  render();
  announce('Session snapshot saved. Checklist progress was not reset.');
}

function resetChecklist() {
  const confirmed = confirm('Reset all active Early Voting and Election Day checklist progress? This cannot be undone. Saved snapshots, Board questions, and notes will remain.');
  if (!confirmed) return;
  state.checklist = {};
  state.session = {id: createSessionId(), startedOn: today()};
  saveState();
  render();
  announce('Checklist session reset.');
}

function exportJson() {
  const backup = {appId: APP_ID, schemaVersion: STATE_VERSION, exportedAt: new Date().toISOString(), state};
  const blob = new Blob([JSON.stringify(backup, null, 2)], {type: 'application/json'});
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(blob);
  anchor.download = `master-poll-worker-guide-${state.session.startedOn}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(anchor.href), 1000);
}

function importJson(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = stateFromBackupObject(JSON.parse(reader.result));
      if (!confirm('Replace the current app data with this validated backup?')) return;
      state = imported;
      saveState();
      render();
      alert('Backup restored.');
    } catch (error) {
      alert(error.message || 'That file could not be imported.');
    } finally {
      event.target.value = '';
    }
  };
  reader.readAsText(file);
}

document.querySelectorAll('[data-route]').forEach(button => { button.onclick = () => setRoute(button.dataset.route); });
document.querySelectorAll('.mode-button').forEach(button => {
  button.onclick = () => {
    state.mode = button.dataset.mode;
    saveState();
    render();
    announce(`${modeLabel()} checklist selected.`);
  };
});
document.getElementById('menuButton').onclick = () => sideMenu.showModal();
document.getElementById('closeMenu').onclick = () => sideMenu.close();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js'));
}

window.MPW_TEST = {sectionItems, checklistKey, sectionProgress, overallProgress, migrateLegacyState, stateFromBackupObject};
render();
