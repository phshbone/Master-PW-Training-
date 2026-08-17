(() => {
  'use strict';
  const { Store, Router, Registry, Search, Storage } = window.MPW;
  const C = window.MPW_CONTENT;
  const esc = s => String(s ?? '').replace(/[&<>'\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const modeLabel = mode => mode === 'early' ? 'Early Voting' : 'Election Day';
  const currentMode = () => Store.select(s => s.app.mode);
  const visible = item => !item.modes || item.modes.includes(currentMode());
  const sourceFooter = src => {
    const list = Array.isArray(src) ? src : src ? [src] : [];
    if (!list.length) return '';
    return `<footer class="source-footer">${list.map(x=>`<span>${esc(x.title)}${x.year?` · ${esc(x.year)}`:''}</span>`).join('<span class="dot">•</span>')}</footer>`;
  };
  const warning = (text, critical=false) => text ? `<div class="warning ${critical?'critical':''}">${critical?'<strong>★ CRITICAL</strong> ':''}${esc(text)}</div>` : '';
  const heading = (title, sub='') => `<div class="page-heading"><h2>${esc(title)}</h2>${sub?`<p>${esc(sub)}</p>`:''}</div>`;
  const outcome = items => items?.length ? `<section class="field-section"><h4>Voting Outcome</h4><div class="outcome-box"><ul>${items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></section>` : '';
  const cardList = (title, items) => `<section class="field-section"><h4>${esc(title)}</h4><ul>${items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section>`;

  const Home = {
    id:'home', routes:['home'],
    render(){
      const s=Store.getState(), mode=s.app.mode;
      const guideTotal=C.guideTopics.filter(x=>x.modes.includes(mode)).reduce((n,x)=>n+x.lessons.length,0);
      const guideDone=Object.values(s.guide.progress).filter(Boolean).length;
      const trained=Object.values(s.training.topics).filter(x=>x?.status==='covered'||x?.status==='live').length;
      return `${heading('Today’s Control Center',`${modeLabel(mode)} · ${s.training.reportDate}`)}
        <section class="card hero-card"><div><p class="section-label">Field-use rule</p><h3>Procedure first. Guess never.</h3><p>Use <strong>Guide</strong> to teach the normal job. Use <strong>Procedures</strong> when something happens. Use the menu for Search and Master Poll Worker references.</p></div>${warning(C.escalation,true)}</section>
        <section class="status-grid-home">
          <div class="stat card"><strong>${guideDone}/${guideTotal}</strong><span>Guide checks</span></div>
          <div class="stat card"><strong>${trained}/${C.trainingTopics.length}</strong><span>Training topics</span></div>
        </section>
        <div class="quick-grid">
          <button class="quick card" data-go="guide"><strong>Guide</strong><span>Teach normal workflow</span></button>
          <button class="quick card" data-go="procedures"><strong>Procedures</strong><span>Handle field situations</span></button>
          <button class="quick card" data-go="routines"><strong>Opening / Closing</strong><span>Run the room in order</span></button>
          <button class="quick card" data-go="training"><strong>Training</strong><span>Track today’s coverage</span></button>
        </div>`;
    }
  };

  const Guide = {
    id:'guide', routes:['guide'],
    render(){
      const s=Store.getState();
      const topics=C.guideTopics.filter(visible);
      return `${heading('Trainer Checklist',`${modeLabel(s.app.mode)} · teach, demonstrate, verify`)}${topics.map(t=>{
        const open=s.guide.open===t.id;
        return `<article class="card guide-topic"><button class="card-toggle" data-guide-open="${esc(t.id)}" aria-expanded="${open}"><span><strong>${esc(t.title)}</strong><small>${esc(t.summary)}</small></span><span>⌄</span></button><div class="collapse ${open?'open':''}">${t.lessons.map((l,i)=>{
          const [id,title,steps]=l,key=`${t.id}:${id}`,checked=!!s.guide.progress[key],status=s.guide.lessonStatus[key]||'';
          return `<section class="lesson"><div class="lesson-head"><span class="step-num">${i+1}</span><h4>${esc(title)}</h4></div><ol>${steps.map(x=>`<li>${esc(x)}</li>`).join('')}</ol><label class="check-row"><input type="checkbox" data-guide-check="${esc(key)}" ${checked?'checked':''}> <span>Covered / verified</span></label><div class="status-buttons">${[['explained','Explained'],['live','Live'],['review','Review'],['notReached','Not reached']].map(([v,lbl])=>`<button data-guide-status="${esc(key)}" data-value="${v}" class="${status===v?'active':''}">${lbl}</button>`).join('')}</div></section>`;
        }).join('')}</div></article>`;
      }).join('')}`;
    },
    searchDocuments(mode){return C.guideTopics.filter(x=>x.modes.includes(mode)).map(x=>({type:'guide',id:x.id,title:x.title,body:[x.summary,...x.lessons.flatMap(l=>[l[1],...l[2]])].join(' '),route:'guide'}));}
  };

  const Procedures = {
    id:'procedures', routes:['procedures'],
    render(){
      const s=Store.getState();
      const cats=C.procedureCategories;
      const cat=s.procedures.category || cats[0][0];
      let items=C.procedures.filter(x=>x.category===cat && visible(x));
      if(s.app.params?.id) items=C.procedures.filter(x=>x.id===s.app.params.id && visible(x));
      return `${heading('Field Procedures','This just happened — what do I do?')}
        ${s.app.params?.id?'<button class="text-button" data-clear-procedure>← Back to procedure categories</button>':`<div class="category-grid">${cats.map(([id,title])=>`<button class="category ${cat===id?'active':''}" data-category="${id}">${esc(title)}</button>`).join('')}</div>`}
        ${items.length?items.map(p=>this.card(p,s)).join(''):'<div class="card empty">No procedure in this category for the selected mode.</div>'}`;
    },
    card(p,s){
      const decision=p.decision?`<section class="field-section"><h4>Decision Point</h4><p><strong>${esc(p.decision.question)}</strong></p><div class="decision-grid"><div><strong>YES / PATH 1</strong><ul>${p.decision.yes.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div><div><strong>NO / PATH 2</strong><ul>${p.decision.no.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></div></section>`:'';
      return `<article class="card procedure-card" id="procedure-${esc(p.id)}"><div class="procedure-title"><h3>${esc(p.title)}</h3>${p.aliases?.length?`<span class="badge">${esc(p.category)}</span>`:''}</div><p class="summary">${esc(p.summary)}</p>${warning(p.critical,true)}${warning(p.warning,false)}${decision}<section class="field-section"><h4>What To Do</h4><ol>${p.steps.map((x,i)=>{const key=`${p.id}:${i}`,checked=!!s.procedures.progress[key];return `<li><label class="proc-step"><input type="checkbox" data-proc-check="${esc(key)}" ${checked?'checked':''}><span>${esc(x)}</span></label></li>`}).join('')}</ol></section>${p.notDo?cardList('What NOT To Do',p.notDo):''}${outcome(p.outcome)}${sourceFooter(p.source)}${p.aliases?.length?`<div class="alias-line">Aliases: ${p.aliases.map(esc).join(' · ')}</div>`:''}</article>`;
    },
    searchDocuments(mode){return C.procedures.filter(x=>x.modes.includes(mode)).map(x=>({type:'procedure',id:x.id,title:x.title,aliases:x.aliases||[],category:x.category,body:[x.summary,...(x.steps||[]),...(x.outcome||[])].join(' '),route:'procedures'}));}
  };

  const Routines = {
    id:'routines', routes:['routines'],
    render(){
      const s=Store.getState();
      const routines=C.routines.filter(visible);
      return `${heading('Opening / Closing',`${modeLabel(s.app.mode)} routines`)}${routines.map(r=>`<article class="card routine"><div class="routine-head"><h3>${esc(r.title)}</h3><p>${esc(r.summary)}</p>${warning(r.critical,true)}</div><div class="phase-toolbar"><button data-expand-routine="${r.id}">Expand all</button><button data-collapse-routine="${r.id}">Collapse all</button></div>${r.phases.map(ph=>{const key=`${r.id}:${ph.id}`,open=!!s.routines.openPhases[key];return `<section class="phase"><button class="phase-toggle" data-phase="${key}" aria-expanded="${open}"><strong>${esc(ph.title)}</strong><span>⌄</span></button><div class="collapse ${open?'open':''}">${warning(ph.warning,false)}<ol>${ph.steps.map((step,i)=>{const ck=`${key}:${i}`,checked=!!s.routines.progress[ck];return `<li><label class="proc-step"><input type="checkbox" data-routine-check="${ck}" ${checked?'checked':''}><span>${esc(step)}</span></label></li>`}).join('')}</ol></div></section>`}).join('')}${sourceFooter(r.source)}</article>`).join('')}`;
    },
    searchDocuments(mode){return C.routines.filter(x=>x.modes.includes(mode)).map(x=>({type:'routine',id:x.id,title:x.title,body:[x.summary,...x.phases.flatMap(p=>[p.title,...p.steps])].join(' '),route:'routines'}));}
  };

  const MPW = {
    id:'mpw', routes:['mpw'],
    render(){const s=Store.getState();return `${heading('Master Poll Worker Reference','Site leadership, first-round checks, escalation, and today’s notes')}<section class="card"><h3>Today’s Briefing</h3><textarea id="briefingInput" placeholder="Operational reminders to read at each site…">${esc(s.mpw.briefing)}</textarea></section>${C.mpwSections.filter(visible).map(x=>`<article class="card"><h3>${esc(x.title)}</h3>${warning(x.critical,true)}<ul>${x.items.map(i=>`<li>${esc(i)}</li>`).join('')}</ul></article>`).join('')}`;},
    searchDocuments(mode){return C.mpwSections.filter(x=>!x.modes||x.modes.includes(mode)).map(x=>({type:'mpw',id:x.id,title:x.title,body:x.items.join(' '),route:'mpw'}));}
  };

  const Training = {
    id:'training', routes:['training','report'],
    render(route){return route==='report'?this.report():this.tracker();},
    tracker(){const s=Store.getState();return `${heading('Training Tracker',`${s.training.reportDate} · ${modeLabel(s.app.mode)}`)}<section class="card"><label><strong>Workers present</strong><input id="workersPresent" value="${esc(s.training.workersPresent)}" placeholder="Names or count"></label></section>${C.trainingTopics.map((t,i)=>{const id=String(i),v=s.training.topics[id]||{};return `<article class="card training-card"><h3>${esc(t)}</h3><div class="status-buttons four">${[['covered','Covered'],['live','Demonstrated live'],['review','Needs review'],['notReached','Not reached']].map(([k,l])=>`<button data-training-status="${id}" data-value="${k}" class="${v.status===k?'active':''}">${l}</button>`).join('')}</div><textarea data-training-note="${id}" placeholder="Optional note">${esc(v.note||'')}</textarea></article>`}).join('')}`;},
    report(){const s=Store.getState(),vals=Object.values(s.training.topics),count=k=>vals.filter(v=>v.status===k).length;return `${heading('Daily Report',s.training.reportDate)}<section class="card report-stats">${[['Planned',C.trainingTopics.length],['Covered',count('covered')],['Live',count('live')],['Review',count('review')],['Not reached',count('notReached')]].map(([a,b])=>`<div><span>${a}</span><strong>${b}</strong></div>`).join('')}</section><section class="card"><h3>General daily notes</h3><textarea id="dailyNotes" placeholder="Board questions, repeated trouble areas, follow-up…">${esc(s.training.dailyNotes)}</textarea></section><div class="controls"><button class="primary" id="finishDay">Finish Day</button><button id="startTomorrow">Start Tomorrow</button></div><section class="card"><h3>Saved history</h3>${s.training.history.length?s.training.history.slice().reverse().map(h=>`<div class="history-row"><strong>${esc(h.date)}</strong><span>${esc(h.summary)}</span></div>`).join(''):'<p class="muted">No saved days yet.</p>'}</section>`;}
  };

  const Board = {id:'board',routes:['board'],render(){const s=Store.getState();return `${heading('Questions for the Board','Unresolved procedure questions — separate from Today’s Briefing')}<section class="card"><form id="boardForm" class="inline-form"><input id="boardInput" placeholder="Add a question to verify…"><button>Add</button></form></section><section class="card"><h3>Current verification list</h3><ul>${C.staticBoardQuestions.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section><section class="card"><h3>My questions</h3>${s.board.questions.length?s.board.questions.map(q=>`<div class="question-row"><label><input type="checkbox" data-board-toggle="${q.id}" ${q.done?'checked':''}><span class="${q.done?'done':''}">${esc(q.text)}</span></label><button data-board-remove="${q.id}" aria-label="Remove">×</button></div>`).join(''):'<p class="muted">No added questions.</p>'}</section>`;}};

  const References = {id:'references',routes:['references'],render(){return `${heading('Reference Library','Standing rules, unusual situations, and official links')}${C.referenceSections.filter(visible).map(x=>`<article class="card"><h3>${esc(x.title)}</h3><ul>${x.body.map(i=>`<li>${esc(i)}</li>`).join('')}</ul></article>`).join('')}<section class="card"><h3>Official links</h3>${C.currentLinks.map(([t,u])=>`<a class="reference-link" href="${esc(u)}" target="_blank" rel="noopener">${esc(t)} ↗</a>`).join('')}</section>`;},searchDocuments(mode){return C.referenceSections.filter(x=>!x.modes||x.modes.includes(mode)).map(x=>({type:'reference',id:x.id,title:x.title,body:x.body.join(' '),route:'references'}));}};

  const EndNight = {id:'endnight',routes:['endnight'],render(){const groups=[['Maroon Bag',C.endOfNight.maroon],['Clear Envelope',C.endOfNight.clear],['Manila Envelope',C.endOfNight.manila],['Back of Voting Machine Suitcase',C.endOfNight.suitcase]];return `${heading('Election Day End-of-Night Checklist','Use the current 2025 Morris destination list')}${groups.map(([t,items])=>`<article class="card"><h3>${esc(t)}</h3><ul class="checklist-plain">${items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></article>`).join('')}${warning('County Clerk blue bag has its own checklist. Do not guess its contents.',false)}`;},searchDocuments(mode){return mode==='election'?[{type:'reference',id:'endnight',title:'Election Day End-of-Night Checklist',aliases:['maroon bag','clear envelope','manila envelope','suitcase'],body:Object.values(C.endOfNight).flat().join(' '),route:'endnight'}]:[];}};

  const Settings = {id:'settings',routes:['settings'],render(){const s=Store.getState();return `${heading('Settings & Backup','Local data only')}<section class="card"><div class="setting-row"><span><strong>Compact mode</strong><small>Tighter cards and spacing</small></span><input type="checkbox" id="compactToggle" ${s.settings.compactMode?'checked':''}></div></section><section class="card"><h3>Backup</h3><p>Export or restore your local training progress, notes, questions, and settings.</p><div class="controls"><button id="exportBackup">Export JSON</button><label class="file-button">Import JSON<input type="file" id="importBackup" accept="application/json"></label><button class="danger" id="resetData">Reset local data</button></div></section><section class="card"><h3>Version</h3><p>App ${esc(window.MPW.version)} · Content ${esc(C.app.contentVersion)} · Schema ${Storage.schemaVersion}</p></section>`;}};

  const SearchModule = {id:'search',routes:[],searchDocuments(){return [];}};

  [Home,Guide,Procedures,Routines,MPW,Training,Board,References,EndNight,Settings,SearchModule].forEach(Registry.register);

  window.MPWModules = { Home, Guide, Procedures, Routines, MPW, Training, Board, References, EndNight, Settings, esc, heading, modeLabel };
})();
