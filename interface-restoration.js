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

  function restoreInterface(){
    const s=Store.getState();
    document.body.classList.add('interface-restored');
    if(title) title.textContent=currentTitle(s);
    procedureDashboard();
    markLastUsed();
  }

  document.addEventListener('click',e=>{
    const b=e.target.closest('.classic-procedure-card');
    if(b?.dataset.openProcedure) sessionStorage.setItem('mpwClassicProcedureLast',b.dataset.openProcedure);
  },true);

  const observer=new MutationObserver(()=>requestAnimationFrame(restoreInterface));
  if(main) observer.observe(main,{childList:true,subtree:false});
  Store.subscribe(()=>requestAnimationFrame(restoreInterface));
  requestAnimationFrame(restoreInterface);
})();
