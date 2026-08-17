(() => {
  'use strict';
  const { Store, Router, Registry, Search, Storage, Lifecycle, PWA } = window.MPW;
  const M = window.MPWModules;
  const main = document.getElementById('mainContent');
  const title = document.getElementById('sectionTitle');
  const sideMenu = document.getElementById('sideMenu');
  const searchDialog = document.getElementById('searchDialog');
  const backToTop = document.getElementById('backToTop');

  const routeMap = {};
  Registry.list().forEach(mod => (mod.routes||[]).forEach(r => routeMap[r] = mod));

  function renderSearch() {
    const s=Store.getState();
    if (!s.app.searchOpen) { if(searchDialog.open) searchDialog.close(); return; }
    if (!searchDialog.open) searchDialog.showModal();
    const input=searchDialog.querySelector('#globalSearch');
    const results=searchDialog.querySelector('#searchResults');
    if (!input || !results) return;
    const run=()=>{
      const found=Search.query(input.value,s.app.mode);
      results.innerHTML=!input.value.trim()?'<div class="empty">Search procedures, aliases, forms, equipment, guide topics, and references.</div>':found.length?found.map(r=>`<button class="search-result" data-search-route="${M.esc(r.route)}" data-search-id="${M.esc(r.id)}"><span>${M.esc(r.type)}</span><strong>${M.esc(r.title)}</strong><small>${M.esc(r.category||'')}</small></button>`).join(''):'<div class="empty">No matching result.</div>';
    };
    input.oninput=run; run(); setTimeout(()=>input.focus(),0);
  }

  function render(options={}) {
    const preserve=!!options.preserveScroll;
    const previousTop=preserve?main.scrollTop:0;
    const s=Store.getState();
    document.documentElement.dataset.mode=s.app.mode;
    document.body.classList.toggle('compact',!!s.settings.compactMode);
    document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===s.app.mode));
    document.querySelectorAll('.bottom-nav [data-route]').forEach(b=>b.classList.toggle('active',b.dataset.route===s.app.route));
    const mod=routeMap[s.app.route] || routeMap.home;
    title.textContent = window.MPW_CONTENT.app.title;
    main.innerHTML = mod.render(s.app.route);
    if(preserve) main.scrollTop=previousTop; else main.scrollTop=0;
    if (s.app.menuOpen && !sideMenu.open) sideMenu.showModal();
    if (!s.app.menuOpen && sideMenu.open) sideMenu.close();
    renderSearch();
    updateBackToTop();
  }

  function updateBackToTop(){
    if(!backToTop) return;
    backToTop.classList.toggle('visible',main.scrollTop>320);
  }

  document.addEventListener('click', e => {
    const el=e.target.closest('button,a,label'); if (!el) return;
    if (el.matches('#backToTop')) { main.scrollTo({top:0,behavior:'smooth'}); return; }
    if (el.matches('#menuButton')) { Store.dispatch({type:'app/menu',open:true}); return; }
    if (el.matches('#closeMenu')) { Store.dispatch({type:'app/menu',open:false}); return; }
    if (el.matches('[data-open-search]')) { Store.dispatch({type:'app/menu',open:false}); Store.dispatch({type:'app/search',open:true}); return; }
    if (el.matches('#closeSearch')) { Store.dispatch({type:'app/search',open:false}); return; }
    if (el.dataset.mode) { Router.setMode(el.dataset.mode); return; }
    if (el.dataset.go) { Router.go(el.dataset.go); return; }
    if (el.dataset.route && !el.closest('.search-result')) { Router.go(el.dataset.route); return; }
    if (el.dataset.openProcedure) { Router.go('procedures',{id:el.dataset.openProcedure}); return; }
    if (el.dataset.procedureJump) {
      const target=el.dataset.procedureJump==='topics'?'procedure-topics':`procedure-category-${el.dataset.procedureJump}`;
      main.querySelector(`#${target}`)?.scrollIntoView({behavior:'smooth',block:'start'});
      return;
    }
    if (el.dataset.category) { Store.dispatch({type:'procedures/category',id:el.dataset.category}); return; }
    if (el.hasAttribute('data-clear-procedure')) { Store.dispatch({type:'app/route',route:'procedures',params:{}}); return; }
    if (el.hasAttribute('data-clear-routine')) { Store.dispatch({type:'app/route',route:'routines',params:{}}); return; }
    if (el.hasAttribute('data-clear-reference')) { Store.dispatch({type:'app/route',route:'references',params:{}}); return; }
    if (el.hasAttribute('data-clear-mpw')) { Store.dispatch({type:'app/route',route:'mpw',params:{}}); return; }
    if (el.dataset.guideOpen) {
      const s=Store.getState(), id=el.dataset.guideOpen, opening=s.guide.open!==id;
      Store.dispatch({type:'guide/open',id:opening?id:null});
      if(opening) requestAnimationFrame(()=>main.querySelector(`#guide-topic-${CSS.escape(id)}`)?.scrollIntoView({behavior:'smooth',block:'start'}));
      return;
    }
    if (el.dataset.guideStatus) { Store.dispatch({type:'guide/status',key:el.dataset.guideStatus,value:el.dataset.value}); return; }
    if (el.dataset.trainingStatus) { Store.dispatch({type:'training/topic',id:el.dataset.trainingStatus,patch:{status:el.dataset.value}}); return; }
    if (el.dataset.phase) { const s=Store.getState(); Store.dispatch({type:'routines/phase',key:el.dataset.phase,value:!s.routines.openPhases[el.dataset.phase]}); return; }
    if (el.dataset.expandRoutine || el.dataset.collapseRoutine) {
      const id=el.dataset.expandRoutine||el.dataset.collapseRoutine,open=!!el.dataset.expandRoutine;
      const routine=window.MPW_CONTENT.routines.find(r=>r.id===id); if (routine) routine.phases.forEach(p=>Store.dispatch({type:'routines/phase',key:`${id}:${p.id}`,value:open})); return;
    }
    if (el.dataset.boardToggle) { Store.dispatch({type:'board/toggle',id:el.dataset.boardToggle}); return; }
    if (el.dataset.boardRemove) { if (confirm('Remove this Board question?')) Store.dispatch({type:'board/remove',id:el.dataset.boardRemove}); return; }
    if (el.matches('#finishDay')) {
      const s=Store.getState();
      if (s.training.history.some(h=>h.date===s.training.reportDate)) { alert('This date is already saved in history.'); return; }
      const vals=Object.values(s.training.topics), complete=vals.filter(v=>v.status==='covered'||v.status==='live').length;
      Store.dispatch({type:'training/finish',snapshot:{date:s.training.reportDate,summary:`${complete}/${window.MPW_CONTENT.trainingTopics.length} topics covered/live`,notes:s.training.dailyNotes}}); return;
    }
    if (el.matches('#startTomorrow')) {
      const s=Store.getState();
      const d=new Date(`${s.training.reportDate}T12:00:00`); d.setDate(d.getDate()+1);
      Store.dispatch({type:'training/newDay',date:d.toISOString().slice(0,10)}); return;
    }
    if (el.matches('#exportBackup')) {
      const blob=new Blob([Storage.export(Store.getState())],{type:'application/json'}),a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`mpw-backup-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(a.href); return;
    }
    if (el.matches('#resetData')) { if (confirm('Reset all local progress, notes, questions, and settings?')) Store.dispatch({type:'system/replace',state:Storage.reset()}); return; }
    const sr=el.closest('.search-result'); if (sr) { Store.dispatch({type:'app/search',open:false}); Router.go(sr.dataset.searchRoute,{id:sr.dataset.searchId}); if(sr.dataset.searchRoute==='guide') Store.dispatch({type:'guide/open',id:sr.dataset.searchId}); return; }
  });

  document.addEventListener('change', e => {
    const el=e.target;
    if (el.dataset.procCheck) Store.dispatch({type:'procedures/check',key:el.dataset.procCheck,value:el.checked});
    else if (el.dataset.routineCheck) Store.dispatch({type:'routines/check',key:el.dataset.routineCheck,value:el.checked});
    else if (el.matches('#compactToggle')) Store.dispatch({type:'settings/compact',value:el.checked});
    else if (el.matches('#importBackup')) {
      const file=el.files?.[0]; if (!file) return;
      file.text().then(text=>{ try { Store.dispatch({type:'system/replace',state:Storage.import(text)}); alert('Backup restored.'); } catch(err){ alert(`Backup rejected: ${err.message}`); } });
    }
  });

  document.addEventListener('input', e => {
    const el=e.target;
    if (el.matches('#briefingInput')) Store.dispatch({type:'mpw/briefing',value:el.value});
    else if (el.matches('#workersPresent')) Store.dispatch({type:'training/workers',value:el.value});
    else if (el.matches('#dailyNotes')) Store.dispatch({type:'training/notes',value:el.value});
    else if (el.dataset.trainingNote) Store.dispatch({type:'training/topic',id:el.dataset.trainingNote,patch:{note:el.value}});
  });

  document.addEventListener('submit', e => {
    if (!e.target.matches('#boardForm')) return; e.preventDefault();
    const input=document.getElementById('boardInput'),text=input.value.trim(); if(text) Store.dispatch({type:'board/add',text});
  });

  main.addEventListener('scroll',updateBackToTop,{passive:true});
  sideMenu.addEventListener('close',()=>{ if(Store.select(s=>s.app.menuOpen)) Store.dispatch({type:'app/menu',open:false}); });
  searchDialog.addEventListener('close',()=>{ if(Store.select(s=>s.app.searchOpen)) Store.dispatch({type:'app/search',open:false}); });
  Store.subscribe((_, action)=>{
    const textOnly = action.type==='mpw/briefing' || action.type==='training/workers' || action.type==='training/notes' || (action.type==='training/topic' && action.patch && Object.keys(action.patch).length===1 && Object.prototype.hasOwnProperty.call(action.patch,'note'));
    if (!textOnly) {
      const preserve = !['app/route','app/mode','guide/open','system/replace','training/newDay'].includes(action.type);
      render({preserveScroll:preserve});
    }
  });
  Lifecycle.init(); PWA.init(); render();

  window.MPWApp = { render, routeMap };
})();
