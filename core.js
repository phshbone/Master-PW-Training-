(() => {
  'use strict';

  const SCHEMA_VERSION = 1;
  const STORAGE_KEY = 'mpw.state.v1';
  const LEGACY_KEYS = ['mpwg-build-0-2', 'mpwg-build-0-1'];

  const deepClone = value => JSON.parse(JSON.stringify(value));

  const DEFAULT_STATE = {
    schemaVersion: SCHEMA_VERSION,
    app: { mode: 'early', route: 'home', params: {}, menuOpen: false, searchOpen: false },
    guide: { progress: {}, lessonStatus: {}, open: null },
    procedures: { category: 'flags', target: null, progress: {} },
    routines: { openPhases: {}, progress: {} },
    mpw: { briefing: '' },
    board: { questions: [] },
    training: { workersPresent: '', topics: {}, dailyNotes: '', reportDate: '', history: [] },
    settings: { compactMode: false }
  };

  const normalizeGuideStatuses = obj => {
    const out = {};
    if (!obj || typeof obj !== 'object') return out;
    Object.entries(obj).forEach(([key,value])=>{
      if (Array.isArray(value)) out[key] = [...new Set(value.filter(Boolean))];
      else if (typeof value === 'string' && value) out[key] = [value];
    });
    return out;
  };

  const normalize = raw => {
    const next = deepClone(DEFAULT_STATE);
    if (!raw || typeof raw !== 'object') return next;
    next.schemaVersion = SCHEMA_VERSION;
    for (const key of ['app','guide','procedures','routines','mpw','board','training','settings']) {
      if (raw[key] && typeof raw[key] === 'object') Object.assign(next[key], raw[key]);
    }
    next.guide.lessonStatus = normalizeGuideStatuses(next.guide.lessonStatus);
    if (!['early','election'].includes(next.app.mode)) next.app.mode = 'early';
    if (!next.training.reportDate) next.training.reportDate = new Date().toISOString().slice(0,10);
    if (!Array.isArray(next.board.questions)) next.board.questions = [];
    if (!Array.isArray(next.training.history)) next.training.history = [];
    return next;
  };

  const Storage = {
    load() {
      try {
        const current = localStorage.getItem(STORAGE_KEY);
        if (current) return normalize(JSON.parse(current));
        for (const key of LEGACY_KEYS) {
          const legacy = localStorage.getItem(key);
          if (!legacy) continue;
          const old = JSON.parse(legacy);
          const migrated = normalize({
            app: { mode: old.mode || 'early', route: old.route || 'home' },
            guide: { progress: old.procedureProgress || {}, lessonStatus: old.lessonStatus || {}, open: old.openLesson || null },
            procedures: { category: old.procedureCategory || 'flags', target: old.procedureTarget || null },
            mpw: { briefing: old.todayBriefing || '' },
            board: { questions: old.boardQuestions || [] },
            training: {
              workersPresent: old.workersPresent || '',
              topics: old.training || {},
              dailyNotes: old.dailyNotes || '',
              reportDate: old.reportDate || '',
              history: old.history || []
            }
          });
          this.save(migrated);
          return migrated;
        }
      } catch (error) {
        console.warn('MPW state recovery:', error);
      }
      return normalize(null);
    },
    save(state) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); return true; }
      catch (error) { console.warn('MPW save failed:', error); return false; }
    },
    export(state) {
      return JSON.stringify({ exportedAt: new Date().toISOString(), app: 'Master Poll Worker Guide', state }, null, 2);
    },
    import(text) {
      const parsed = JSON.parse(text);
      const candidate = parsed && parsed.state ? parsed.state : parsed;
      if (!candidate || typeof candidate !== 'object') throw new Error('Backup does not contain app state.');
      return normalize(candidate);
    },
    reset() { localStorage.removeItem(STORAGE_KEY); return normalize(null); },
    key: STORAGE_KEY,
    schemaVersion: SCHEMA_VERSION
  };

  let state = Storage.load();
  const listeners = new Set();

  const Store = {
    getState: () => deepClone(state),
    select: selector => selector(state),
    dispatch(action) {
      if (!action || typeof action.type !== 'string') throw new Error('Invalid action');
      const [namespace] = action.type.split('/');
      if (!state[namespace] && namespace !== 'system') throw new Error(`Unknown state namespace: ${namespace}`);
      switch (action.type) {
        case 'app/route': state.app.route = action.route; state.app.params = action.params || {}; state.app.menuOpen = false; state.app.searchOpen = false; break;
        case 'app/mode': state.app.mode = action.mode; state.app.params = {}; break;
        case 'app/menu': state.app.menuOpen = !!action.open; break;
        case 'app/search': state.app.searchOpen = !!action.open; break;
        case 'guide/open': state.guide.open = action.id || null; break;
        case 'guide/check': state.guide.progress[action.key] = !!action.value; break;
        case 'guide/status': {
          const current = Array.isArray(state.guide.lessonStatus[action.key]) ? state.guide.lessonStatus[action.key] : [];
          const value = action.value;
          if (value === 'notReached') {
            state.guide.lessonStatus[action.key] = current.includes('notReached') ? [] : ['notReached'];
          } else {
            let next = current.filter(v => v !== 'notReached');
            next = next.includes(value) ? next.filter(v => v !== value) : [...next, value];
            state.guide.lessonStatus[action.key] = next;
          }
          break;
        }
        case 'procedures/category': state.procedures.category = action.id; state.procedures.target = null; break;
        case 'procedures/target': state.procedures.target = action.id || null; break;
        case 'procedures/check': state.procedures.progress[action.key] = !!action.value; break;
        case 'routines/phase': state.routines.openPhases[action.key] = !!action.value; break;
        case 'routines/check': state.routines.progress[action.key] = !!action.value; break;
        case 'mpw/briefing': state.mpw.briefing = action.value || ''; break;
        case 'board/add': state.board.questions.push({ id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), text: action.text, done: false }); break;
        case 'board/toggle': { const q = state.board.questions.find(x => x.id === action.id); if (q) q.done = !q.done; break; }
        case 'board/remove': state.board.questions = state.board.questions.filter(x => x.id !== action.id); break;
        case 'training/workers': state.training.workersPresent = action.value || ''; break;
        case 'training/topic': state.training.topics[action.id] = { ...(state.training.topics[action.id] || {}), ...(action.patch || {}) }; break;
        case 'training/notes': state.training.dailyNotes = action.value || ''; break;
        case 'training/finish': state.training.history.push(action.snapshot); break;
        case 'training/newDay': state.training.reportDate = action.date; state.training.topics = {}; state.training.dailyNotes = ''; break;
        case 'settings/compact': state.settings.compactMode = !!action.value; break;
        case 'system/replace': state = normalize(action.state); break;
        default: throw new Error(`Unhandled action: ${action.type}`);
      }
      Storage.save(state);
      listeners.forEach(fn => fn(Store.getState(), action));
    },
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
  };

  const Router = {
    go(route, params={}) { Store.dispatch({type:'app/route', route, params}); },
    setMode(mode) { if (['early','election'].includes(mode)) Store.dispatch({type:'app/mode', mode}); },
    openProcedure(id) { Store.dispatch({type:'procedures/target', id}); this.go('procedures', { id }); },
    openGuide(id) { Store.dispatch({type:'guide/open', id}); this.go('guide', { id }); }
  };

  const Registry = (() => {
    const modules = new Map();
    return {
      register(def) { if (!def || !def.id) throw new Error('Module id required'); modules.set(def.id, def); },
      getModule(id) { return modules.get(id); },
      list() { return [...modules.values()]; },
      listSearchProviders() { return [...modules.values()].filter(x => typeof x.searchDocuments === 'function'); }
    };
  })();

  const Search = {
    query(text, mode) {
      const q = String(text || '').trim().toLowerCase();
      if (!q) return [];
      const docs = Registry.listSearchProviders().flatMap(p => p.searchDocuments(mode) || []);
      const tokens = q.split(/\s+/).filter(Boolean);
      return docs.map(doc => {
        const title = String(doc.title || '').toLowerCase();
        const aliases = (doc.aliases || []).map(x => String(x).toLowerCase());
        const hay = [title, aliases.join(' '), doc.body || '', doc.category || ''].join(' ').toLowerCase();
        let score = 0;
        if (title === q) score += 1000;
        if (title.startsWith(q)) score += 650;
        if (aliases.some(a => a === q)) score += 800;
        if (aliases.some(a => a.startsWith(q))) score += 500;
        if (tokens.every(t => hay.includes(t))) score += 300;
        if (hay.includes(q)) score += 200;
        return { ...doc, score };
      }).filter(x => x.score > 0).sort((a,b) => b.score - a.score || a.title.localeCompare(b.title)).slice(0,40);
    }
  };

  const Lifecycle = {
    init() {
      window.addEventListener('pageshow', () => Storage.save(Store.select(s => s)));
      document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') Storage.save(Store.select(s => s)); });
    }
  };

  const PWA = {
    init() {
      if (!('serviceWorker' in navigator)) return;
      window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker-v1.js').catch(err => console.warn('Service worker:', err)));
    }
  };

  window.MPW = { Store, Storage, Router, Registry, Search, Lifecycle, PWA, DEFAULT_STATE, version: '1.0.1-clean' };
})();
