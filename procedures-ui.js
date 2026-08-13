// Procedures expansion UI layered on top of the existing app.
state.procedureCategory ||= null;
state.procedureView ||= null;

function sourceMarkup(source){
  if(!source) return '';
  const rows=[['Authority',source.authority],['Source',source.title],['Section',source.section],['Date',source.date],['Supplement',source.supplement]].filter(([,v])=>v);
  return `<details class="source-details"><summary>Source</summary>${rows.map(([k,v])=>`<div class="source-row"><strong>${k}</strong><span>${esc(v)}</span></div>`).join('')}</details>`;
}
function fieldText(label,text,className=''){
  return text?`<section class="field-block ${className}"><h4>${esc(label)}</h4><p>${esc(text)}</p></section>`:'';
}
function fieldList(label,items,className=''){
  return items?.length?`<section class="field-block ${className}"><h4>${esc(label)}</h4><ol>${items.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></section>`:'';
}
function fieldProcedureMarkup(p){
  const linked=p.linkedProcedureId?data.procedures.find(x=>x.id===p.linkedProcedureId):null;
  const related=(p.related||[]).map(id=>data.procedures.find(x=>x.id===id)).filter(Boolean);
  return `<article class="card field-procedure">
    <button class="back-link" data-procedure-back>‹ Back</button>
    <div class="field-heading"><h3>${esc(p.title)}</h3>${badges(p.status)}</div>
    ${fieldText('What It Means',p.meaning)}
    ${p.decision?`<section class="decision-box"><h4>${esc(p.decision.question)}</h4><div class="decision-grid"><div><strong>YES</strong><p>${esc(p.decision.yes)}</p></div><div><strong>NO</strong><p>${esc(p.decision.no)}</p></div></div></section>`:''}
    ${fieldList('What To Do',p.steps)}
    ${fieldList('What NOT To Do',p.notDo,'danger-block')}
    ${fieldText('Voting Outcome',p.outcome,'outcome-block')}
    ${fieldText('Required Form',p.form)}
    ${fieldText('When To Call the Board',p.escalation)}
    ${linked?`<section class="field-block linked-block"><h4>Existing App Procedure</h4><p>This topic already has developed material in the app.</p><button class="secondary full" data-open-guide="${linked.id}">Open ${esc(linked.title)} in Guide</button></section>`:''}
    ${related.length?`<section class="field-block linked-block"><h4>Related Existing Procedures</h4>${related.map(x=>`<button class="secondary full related-button" data-open-guide="${x.id}">${esc(x.title)}</button>`).join('')}</section>`:''}
    ${sourceMarkup(p.source)}
  </article>`;
}

renderGuide = function(){
  title.textContent='Teaching Guide';
  const procedures=filteredProcedures();
  return `${pageHeading('Core Teaching Guide',`${procedures.length} procedures shown for ${modeLabel()}.`)}${procedures.map((p,i)=>procedureMarkup(p,p.id==='checkin'||i===0)).join('')}`;
};

renderProcedures = function(){
  title.textContent='Procedures';
  const all=(data.fieldProcedures||[]).filter(p=>p.modes.includes(state.mode));
  if(state.procedureView){
    const p=all.find(x=>x.id===state.procedureView);
    if(p) return `${pageHeading('Field Procedure','This just happened — what do I do?')}${fieldProcedureMarkup(p)}`;
    state.procedureView=null;
  }
  if(state.procedureCategory){
    const cat=data.fieldCategories.find(x=>x.id===state.procedureCategory);
    const list=all.filter(x=>x.category===state.procedureCategory);
    return `${pageHeading(cat?.title||'Procedures',cat?.description||'')}<button class="back-link standalone" data-category-back>‹ All Procedures</button>${list.length?list.map(p=>`<button class="card procedure-list-card" data-open-field="${p.id}"><strong>${esc(p.title)}</strong><span>${esc(p.meaning||'Open procedure')}</span>${badges(p.status)}</button>`).join(''):'<div class="card empty">No procedures in this category for the selected election mode.</div>'}`;
  }
  return `${pageHeading('Procedures','Browse by situation. Use Lookup when you know the word or phrase you are searching for.')}<div class="procedure-category-grid">${data.fieldCategories.map(c=>{const count=all.filter(p=>p.category===c.id).length;return `<button class="card category-card" data-open-category="${c.id}"><span class="category-icon">${c.icon}</span><strong>${esc(c.title)}</strong><small>${esc(c.description)}</small><em>${count} ${count===1?'procedure':'procedures'}</em></button>`;}).join('')}</div>`;
};

function searchBlob(p){ return `${p.title} ${(p.aliases||[]).join(' ')} ${p.meaning||''} ${p.summary||''} ${JSON.stringify(p.steps||[])} ${JSON.stringify(p.lessons||[])}`.toLowerCase(); }
renderLookup = function(){
  const q=(state.lookupQuery||'').trim().toLowerCase();
  const field=(data.fieldProcedures||[]).filter(p=>p.modes.includes(state.mode)&&q&&searchBlob(p).includes(q));
  const guide=data.procedures.filter(p=>p.modes.includes(state.mode)&&q&&searchBlob(p).includes(q));
  title.textContent='Quick Lookup';
  return `${pageHeading('Quick Lookup','Search the shared operational knowledge base.')}<input id="lookupInput" class="search-box" placeholder="Search affirm, address, no signature, reprint…" value="${esc(state.lookupQuery||'')}"><div style="height:12px"></div>${q?`<div class="lookup-section"><h3>Procedures</h3>${field.length?field.map(p=>`<button class="card lookup-result" data-open-field="${p.id}"><strong>${esc(p.title)}</strong><span>${esc(p.meaning||'Open procedure')}</span></button>`).join(''):'<p class="small">No matching field procedure.</p>'}</div><div class="lookup-section"><h3>Guide</h3>${guide.length?guide.map(p=>`<button class="card lookup-result" data-open-guide="${p.id}"><strong>${esc(p.title)}</strong><span>${esc(p.summary||'Open guide topic')}</span></button>`).join(''):'<p class="small">No matching guide topic.</p>'}</div>`:'<div class="card empty">Type a practical term such as “affirm,” “moved,” “no signature,” “mail-in,” “reprint,” or “spoil.”</div>'}`;
};

const originalBindDynamic=bindDynamic;
bindDynamic = function(){
  originalBindDynamic();
  document.querySelectorAll('[data-open-category]').forEach(b=>b.onclick=()=>{state.procedureCategory=b.dataset.openCategory;state.procedureView=null;saveState();render();window.scrollTo(0,0);});
  document.querySelectorAll('[data-open-field]').forEach(b=>b.onclick=()=>{state.route='procedures';state.procedureView=b.dataset.openField;if(!state.procedureCategory){state.procedureCategory=(data.fieldProcedures.find(x=>x.id===state.procedureView)||{}).category||null;}saveState();render();window.scrollTo(0,0);});
  document.querySelectorAll('[data-procedure-back]').forEach(b=>b.onclick=()=>{state.procedureView=null;saveState();render();});
  document.querySelectorAll('[data-category-back]').forEach(b=>b.onclick=()=>{state.procedureCategory=null;state.procedureView=null;saveState();render();});
  document.querySelectorAll('[data-open-guide]').forEach(b=>b.onclick=()=>{state.route='guide';state.procedureCategory=null;state.procedureView=null;saveState();render();requestAnimationFrame(()=>document.querySelector(`[data-procedure="${CSS.escape(b.dataset.openGuide)}"]`)?.scrollIntoView({behavior:'smooth',block:'start'}));});
};

render = function(){
  document.querySelectorAll('.mode-button').forEach(b=>b.classList.toggle('active',b.dataset.mode===state.mode));
  document.querySelectorAll('.nav-button').forEach(b=>b.classList.toggle('active',b.dataset.route===state.route));
  const routes={home:renderHome,guide:renderGuide,procedures:renderProcedures,lookup:renderLookup,dosdonts:renderDosDonts,training:renderTraining,report:renderReport,board:renderBoard,current:renderCurrent,settings:renderSettings};
  main.innerHTML=(routes[state.route]||renderHome)();
  bindDynamic();
};

// Update home copy without changing the established visual system.
renderHome = function(){
  title.textContent='Master Poll Worker Guide';
  return `${pageHeading('Today’s Control Center',`${modeLabel()} mode • ${state.reportDate}`)}<div class="card"><h3>Training + field reference</h3><p>Use Guide when teaching a worker. Use Procedures when a situation appears in front of you and you need the operational answer.</p><div class="warning-box">Stop and verify any unexpected seal, screen, report, printer, or voter flag before continuing.</div></div><div class="grid two"><button class="card quick-card" data-go="guide"><strong>Teaching Guide</strong><span>How to teach the established procedures.</span></button><button class="card quick-card" data-go="procedures"><strong>Procedures</strong><span>What just happened, what to do, and what happens to the voter.</span></button><button class="card quick-card" data-go="training"><strong>Training Tracker</strong><span>Mark covered, demonstrated, review, or not reached.</span></button><button class="card quick-card" data-go="report"><strong>End-of-Day Report</strong><span>Review today and carry unfinished work forward.</span></button></div>`;
};

render();
