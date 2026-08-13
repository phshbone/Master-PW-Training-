// Reconciliation lookup layer: keep Guide, Procedures, and Master/Tech Reference autonomous.
const MASTER_TECH_REFERENCES = [
  {id:'tech-epson',title:'Epson Printer — Green Printer Icon',pages:'3',terms:'epson printer yellow icon green printer icon find printer accessory save boe touchpad device number',summary:'Reconnect the Epson printer to the matching Touchpad. Never select a different numbered printer.'},
  {id:'tech-expressvote',title:'ExpressVote Printer — Reconnect',pages:'4–5',terms:'expressvote printer activation card reconnect select printer find printer save rename printer',summary:'Reconnect the ExpressVote printer, verify the matching device number, save the connection, and escalate if it still fails.'},
  {id:'tech-printer-reset',title:'Printer Pairing / iPad Reset',pages:'6',terms:'printer pairing wrong device forget device hard reset ipad close epollbook app restart station',summary:'Additional printer-pairing recovery steps, including forgetting an Epson device, restarting the iPad/app, and restarting stations one at a time.'},
  {id:'tech-sideways',title:'Sideways Communication / Location Services',pages:'7–8',terms:'sideways communication central communication location services always epb privacy settings',summary:'Verify EPB location access is set to Always in both the app settings and Privacy / Location Services.'},
  {id:'tech-nighthawk',title:'Nighthawk Router Troubleshooting',pages:'9–10',terms:'nighthawk router wifi internet central communication restart router hard reset ipad window connection',summary:'Restart the Nighthawk, then reset the iPad if needed; includes additional connectivity tips.'}
];

function lookupHaystack(item){ return JSON.stringify(item).toLowerCase(); }
function lookupCard(layer,title,summary,attrs){
  return `<button class="card lookup-result-card" ${attrs}><span class="lookup-layer">${esc(layer)}</span><strong>${esc(title)}</strong><span>${esc(summary||'Open result')}</span></button>`;
}
function lookupTechDetail(item){
  if(!item) return '';
  return `<article class="card lookup-tech-detail"><button class="back-link" data-close-tech>‹ Back to results</button><span class="lookup-layer">Master/Tech Reference</span><h3>${esc(item.title)}</h3><p>${esc(item.summary)}</p><div class="source-panel"><strong>Morris County Board of Elections — Troubleshooting Manual</strong><div class="small">Reference pages ${esc(item.pages)}. The full PDF will remain a separate attributed Master/Tech reference document.</div></div></article>`;
}

renderLookup = function(){
  const q=(state.lookupQuery||'').trim().toLowerCase();
  const procedures=q?fieldData.items.filter(p=>p.modes.includes(state.mode)&&lookupHaystack(p).includes(q)):[];
  const guide=q?data.procedures.filter(p=>p.modes.includes(state.mode)&&lookupHaystack(p).includes(q)):[];
  const tech=q?MASTER_TECH_REFERENCES.filter(t=>(`${t.title} ${t.terms} ${t.summary}`).toLowerCase().includes(q)):[];
  const techTarget=MASTER_TECH_REFERENCES.find(t=>t.id===state.lookupTechTarget);
  title.textContent='Quick Lookup';
  const groups=[];
  if(procedures.length) groups.push(`<section class="lookup-group"><h3>Procedures</h3><p class="small">Live field answers: what just happened and what do I do now?</p>${procedures.map(p=>lookupCard('Procedure',p.title,p.meaning||p.summary,`data-lookup-procedure="${esc(p.id)}"`)).join('')}</section>`);
  if(guide.length) groups.push(`<section class="lookup-group"><h3>Guide</h3><p class="small">Training and checklist material.</p>${guide.map(p=>lookupCard('Guide',p.title,p.summary,`data-lookup-guide="${esc(p.id)}"`)).join('')}</section>`);
  if(tech.length) groups.push(`<section class="lookup-group"><h3>Master/Tech Reference</h3><p class="small">Technical reference material kept separate from poll-worker procedures.</p>${tech.map(t=>lookupCard('Master/Tech Reference',t.title,t.summary,`data-lookup-tech="${esc(t.id)}"`)).join('')}</section>`);
  return `${pageHeading('Quick Lookup','Search once, then jump directly to the correct layer.')}
    <input id="lookupInput" class="search-box" placeholder="Search affirm, moved, voter not found, printer, router…" value="${esc(state.lookupQuery||'')}">
    <div style="height:12px"></div>
    ${techTarget?lookupTechDetail(techTarget):!q?'<div class="card empty">Type the situation or equipment problem you are looking for.</div>':groups.length?groups.join(''):'<div class="card empty">No matching Guide, Procedure, or Master/Tech reference.</div>'}`;
};

function openProcedureFromLookup(id){
  const item=fieldData.items.find(x=>x.id===id);
  if(!item) return;
  state.route='procedures';
  state.procedureCategory=item.category;
  state.lookupTechTarget=null;
  saveState(); render();
  requestAnimationFrame(()=>{
    const target=document.getElementById(`field-${id}`);
    target?.scrollIntoView({block:'start',behavior:'auto'});
  });
}
function openGuideFromLookup(id){
  state.route='guide';
  state.lookupTechTarget=null;
  saveState(); render();
  requestAnimationFrame(()=>{
    const target=document.querySelector(`[data-procedure="${CSS.escape(id)}"]`);
    if(!target) return;
    if(target.classList.contains('procedure-card') && !target.classList.contains('teaching-procedure')) target.classList.add('expanded');
    target.scrollIntoView({block:'start',behavior:'auto'});
  });
}

const reconciliationBaseBindDynamic = bindDynamic;
bindDynamic = function(){
  reconciliationBaseBindDynamic();
  document.querySelectorAll('[data-lookup-procedure]').forEach(b=>b.onclick=()=>openProcedureFromLookup(b.dataset.lookupProcedure));
  document.querySelectorAll('[data-lookup-guide]').forEach(b=>b.onclick=()=>openGuideFromLookup(b.dataset.lookupGuide));
  document.querySelectorAll('[data-lookup-tech]').forEach(b=>b.onclick=()=>{state.lookupTechTarget=b.dataset.lookupTech;saveState();render();window.scrollTo(0,0);});
  document.querySelectorAll('[data-close-tech]').forEach(b=>b.onclick=()=>{state.lookupTechTarget=null;saveState();render();});
};

render();
