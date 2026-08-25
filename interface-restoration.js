(() => {
  'use strict';
  const { Store } = window.MPW || {};
  if (!Store) return;
  const C = window.MPW_CONTENT;
  const main = document.getElementById('mainContent');
  const title = document.getElementById('sectionTitle');

  const routeTitles = {
    home:'Master Poll Worker Guide',
    guide:'Guide',
    procedures:'Procedures',
    routines:'Opening / Closing',
    training:'Training',
    report:'Daily Report',
    mpw:'Master Poll Worker',
    references:'Reference Library',
    board:'Questions for Board',
    endnight:'End-of-Night Checklist',
    settings:'Settings & Backup'
  };

  const findProcedure = id => C?.procedures?.find(p=>p.id===id);
  const currentTitle = s => {
    if (s.app.route==='procedures' && s.app.params?.id) return findProcedure(s.app.params.id)?.title || 'Procedures';
    return routeTitles[s.app.route] || C?.app?.title || 'Master Poll Worker Guide';
  };

  const card = ({title,desc,attrs='',wide=false}) => `<button class="classic-procedure-card${wide?' wide':''}" ${attrs}><strong>${title}</strong><span>${desc}</span></button>`;

  function procedureDashboard(){
    const s=Store.getState();
    if (s.app.route!=='procedures' || s.app.params?.id || !main) return;
    if (main.querySelector('.classic-procedure-grid')) return;
    const heading=main.querySelector('.page-heading');
    if (heading){
      const h=heading.querySelector('h2');
      const p=heading.querySelector('p');
      if(h) h.textContent='Field Procedures';
      if(p) p.textContent='This just happened—what do I do? Choose the situation that matches what you see.';
    }
    const anchor=main.querySelector('#procedure-topics');
    if(!anchor) return;
    const grid=document.createElement('div');
    grid.className='classic-procedure-grid';
    grid.setAttribute('aria-label','Procedure topics');
    grid.innerHTML=[
      card({title:'ePollbook Flags',desc:'Flags and tagged voter records that interrupt normal check-in.',attrs:'data-procedure-jump="flags"'}),
      card({title:'Forms & Record Changes',desc:'Affirmation, correction, name and address changes.',attrs:'data-procedure-jump="records"'}),
      card({title:'Provisional Ballots',desc:'When provisional voting is the required outcome.',attrs:'data-open-procedure="provisional"'}),
      card({title:'Vote-by-Mail',desc:'Mail-In flags and in-person options.',attrs:'data-open-procedure="mail-in"'}),
      card({title:'Reprint',desc:'Recover a missing print without checking in twice.',attrs:'data-open-procedure="reprint"'}),
      card({title:'Spoil',desc:'Cancel and replace an uncast ballot.',attrs:'data-open-procedure="spoil"'}),
      card({title:'Voter Assistance',desc:'Accessibility and assistance procedures.',attrs:'data-open-procedure="assistance"'}),
      card({title:'Primary Election',desc:'Party affiliation and primary-only situations.',attrs:'data-open-procedure="primary-party"'}),
      card({title:'Unusual Situations',desc:'Wrong record, fleeing voter, and other exceptions.',attrs:'data-procedure-jump="unusual"'}),
      card({title:'Opening / Closing',desc:'Move directly to the opening and closing routines.',attrs:'data-go="routines"'}),
      card({title:'Equipment / Troubleshooting',desc:'Machine, printer, ePollbook, and escalation paths.',attrs:'data-open-procedure="equipment-escalation"',wide:true})
    ].join('');
    anchor.before(grid);
  }

  function markLastUsed(){
    const key=sessionStorage.getItem('mpwClassicProcedureLast');
    main?.querySelectorAll('.classic-procedure-card').forEach(b=>b.classList.toggle('last-used',!!key && b.dataset.openProcedure===key));
  }

  function homeDashboard(){
    const s=Store.getState();
    if (s.app.route!=='home' || !main || main.querySelector('.classic-home')) return;
    const mode=s.app.mode;
    const modeName=mode==='early'?'Early Voting':'Election Day';
    const guideTotal=C.guideTopics.filter(x=>x.modes.includes(mode)).reduce((n,x)=>n+x.lessons.length,0);
    const guideDone=Object.values(s.guide.lessonStatus).filter(v=>Array.isArray(v)&&(v.includes('explained')||v.includes('live'))).length;
    const topics=Object.values(s.training.topics || {});
    const trainingDone=topics.filter(v=>v?.status==='covered'||v?.status==='live').length;
    const review=topics.filter(v=>v?.status==='review').length;
    const notReached=topics.filter(v=>v?.status==='notReached').length;
    const trainingTotal=C.trainingTopics.length;
    const guidePct=guideTotal?Math.round((guideDone/guideTotal)*100):0;
    const trainingPct=trainingTotal?Math.round((trainingDone/trainingTotal)*100):0;
    const open=sessionStorage.getItem('mpwHomeGlanceOpen')==='1';
    main.innerHTML=`<section class="classic-home">
      <div class="classic-home-heading">
        <h2>Master Poll Worker Guide</h2>
        <p>${modeName} · ${s.training.reportDate}</p>
      </div>
      <section class="home-glance card ${open?'open':''}">
        <button class="home-glance-toggle" type="button" data-home-glance aria-expanded="${open}">
          <span class="home-glance-copy"><span class="home-kicker">TODAY AT A GLANCE</span><strong>Training and<br>field reference</strong></span>
          <span class="home-glance-meta"><span class="mode-pill">${modeName}</span><b>${guideDone}/${guideTotal} · ${trainingDone}/${trainingTotal}</b><span class="chev">⌄</span></span>
        </button>
        <div class="home-glance-body" ${open?'':'hidden'}>
          <div class="progress-row"><div><span>Trainer Checklist</span><strong>${guideDone}/${guideTotal}</strong></div><div class="progress-track"><i style="width:${guidePct}%"></i></div></div>
          <div class="progress-row"><div><span>Training Tracker</span><strong>${trainingDone}/${trainingTotal}</strong></div><div class="progress-track"><i style="width:${trainingPct}%"></i></div></div>
          <p class="home-status-line">${review} need review · ${notReached} not reached</p>
        </div>
      </section>
      <div class="home-tile-grid">
        <button class="home-tile" data-go="guide"><strong>Trainer Checklist</strong><span>Teach and track the job.</span></button>
        <button class="home-tile" data-go="procedures"><strong>Procedures</strong><span>Handle flags and field issues.</span></button>
        <button class="home-tile" data-open-search><strong>Quick Lookup</strong><span>Jump directly to an answer.</span></button>
        <button class="home-tile" data-go="training"><strong>Training Tracker</strong><span>Record training progress.</span></button>
        <button class="home-tile" data-go="references"><strong>Important Dates &amp;<br>Rules</strong><span>Deadlines and standing rules.</span></button>
        <button class="home-tile" data-go="report"><strong>Daily Report</strong><span>Review progress and notes.</span></button>
      </div>
      <section class="home-field-rule card"><h3>Field-use rule</h3><p>Use <strong>Guide</strong> to teach the normal job. Use <strong>Procedures</strong> when something happens during the job. Use <strong>Lookup</strong> when speed matters.</p></section>
    </section>`;
  }

  function restoreInterface(){
    const s=Store.getState();
    document.body.classList.add('interface-restored');
    if(title) title.textContent=currentTitle(s);
    homeDashboard();
    procedureDashboard();
    markLastUsed();
  }

  document.addEventListener('click',e=>{
    const b=e.target.closest('.classic-procedure-card');
    if(b?.dataset.openProcedure) sessionStorage.setItem('mpwClassicProcedureLast',b.dataset.openProcedure);
    const glance=e.target.closest('[data-home-glance]');
    if(glance){
      const wrapper=glance.closest('.home-glance');
      const body=wrapper?.querySelector('.home-glance-body');
      const next=!wrapper?.classList.contains('open');
      wrapper?.classList.toggle('open',next);
      glance.setAttribute('aria-expanded',String(next));
      if(body) body.hidden=!next;
      sessionStorage.setItem('mpwHomeGlanceOpen',next?'1':'0');
    }
  },true);

  const observer=new MutationObserver(()=>requestAnimationFrame(restoreInterface));
  if(main) observer.observe(main,{childList:true,subtree:false});
  Store.subscribe(()=>requestAnimationFrame(restoreInterface));
  requestAnimationFrame(restoreInterface);
})();
