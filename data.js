window.APP_DATA = {
  procedures: [
    {
      id:'opening', title:'Opening Overview', modes:['early','election'],
      summary:'Gather workers, verify equipment identity, and follow the secured binder sequence without working ahead.',
      badges:['Same for Both','Official Procedure'],
      warning:'Use the current machine binder. Do not reconstruct secured opening instructions from memory.',
      steps:['Gather workers at the master table or cage.','Distribute badges and explain assignments.','Explain that workers must stop if a seal, report, screen, or number differs.','Match each binder to the correct machine.','Set up one numbered ePollbook station at a time.','Confirm one blank activation card is loaded before test check-in.']
    },
    {
      id:'morning', title:'Intermediate Morning Opening', modes:['early'],
      summary:'Verify the carried-forward media-door seal, power on, print readiness report, and prepare the machine.',
      badges:['Early Voting','Master Worker Practice'],
      steps:['Compare the numbered string seal with the carried-forward value.','Initial the seal log after physical verification.','Cut the seal and place it in the green used-seal bag.','Open the media-access door with the barrel key.','Power on, close the door, remove the key, and return it to the red pouch.','Print the System Readiness Report.','Have two workers from different parties review and initial the report.','Place the report into the correct daily black pouch.','Confirm power, status light, locked wheels, curtains, rods, and accessible setup.']
    },
    {
      id:'shutdown', title:'Intermediate Nightly Shutdown', modes:['early'],
      summary:'Reconcile, exchange the canister, reseal, power down, and prepare for the next day.',
      badges:['Early Voting','Critical'],
      warning:'DO NOT SELECT CLOSE POLL during an ordinary intermediate early-voting night.',
      steps:['Verify and remove the right-side red tape seal.','Place the removed tape seal on the index card in the daily envelope.','Remove the outgoing canister.','Verify the red front canister seal.','Apply and verify the outgoing blue transport seal.','Give the sealed outgoing canister to the runner.','Record the incoming canister and blue seal information.','Remove the incoming blue seal and place it in the green used-seal bag.','Insert the replacement canister and lock it into place.','Apply the new red tape panel seal across both surfaces.','Carry forward known information only after physical verification.']
    },
    {
      id:'checkin', title:'Standard Voter Check-In', modes:['early','election'],
      summary:'Confirm the voter, inspect flags, verify signature, preload the activation card, and complete check-in once.',
      badges:['Same for Both','Official Procedure'],
      steps:['Search for the voter using the correct search method.','Confirm the correct voter record.','Inspect eligibility and all flags.','Obtain and verify the voter signature.','Add worker initials.','Confirm one blank activation card is loaded.','Complete check-in.','Manage authority slips and return to Process Next Voter.']
    },
    {
      id:'mailin', title:'Mail-In Ballot', modes:['early','election'],
      summary:'A mail-in voter cannot receive a regular machine ballot and must be processed provisionally when voting in person.',
      badges:['Same for Both','Current Morris Update'],
      warning:'Do not accept a completed mail-in ballot at the polling location.',
      steps:['Confirm the Mail-In Ballot flag.','Explain that the voter cannot receive a regular machine ballot.','Process the voter provisionally.','Use Box 13 on the provisional envelope for mail-in opt-out when requested.','Direct returned mail-in ballots to an authorized drop box or Board location.']
    },
    {
      id:'notfound', title:'Voter Not Found', modes:['early','election'],
      summary:'Stop, search again, use alternate methods, and contact the Board before selecting Voter Not Found.',
      badges:['Same for Both','Critical'],
      warning:'DO NOT EVER SELECT VOTER NOT FOUND WITHOUT EXPRESS BOARD OF ELECTIONS DIRECTION.',
      steps:['Confirm spelling.','Search again.','Use alternate search methods.','Use address or district lookup.','Contact the master worker or Board.','Do not begin a new check-in unless directed.']
    },
    {
      id:'provisional', title:'Provisional Ballots', modes:['early','election'],
      summary:'Complete the ePollbook process, secure the envelope, tally it, and reconcile the physical count.',
      badges:['Same for Both','Official Procedure'],
      steps:['Confirm that provisional voting is the correct remedy.','Complete the ePollbook provisional process.','Confirm a blank activation card is loaded before printing.','Complete the affirmation envelope and required notices.','Seal the completed activation card inside the envelope.','Place the sealed envelope in the orange provisional bag.','Add one tally mark to the reconciliation sheet.','At closing, physically count envelopes and compare with the tally sheet.','Obtain required signatures and seal through both grommet and zipper hole.']
    },
    {
      id:'reprint', title:'Reprint', modes:['early','election'],
      summary:'Recover an item from a completed check-in without checking the voter in again.',
      badges:['Same for Both','Current Morris Update'],
      warning:'Do not check the voter in again.',
      steps:['Confirm that check-in is already complete.','Identify the missing or damaged printed item.','Use Reprint for the activation card, authority slip, assistance form, or jammed print.','Confirm the correct printer is connected.','Return to the normal workflow after the replacement prints.']
    },
    {
      id:'spoil', title:'Spoil a Ballot', modes:['early','election'],
      summary:'Cancel the uncast ballot, eject the card, process the spoil, and decide whether to reissue.',
      badges:['Early Voting / Election Day Difference','Current Morris Update'],
      steps:['At the machine, have the voter select Cancel.','Send two workers from different parties to the machine.','Protect voter privacy during the administrative screen.','Use the voter-choice cancellation reason and eject the card.','During early voting, process the spoil at any appropriate site station.','On Election Day, return the voter to the assigned district table.','Ask whether the voter wants another ballot now.','For reissue, preload a blank activation card before printing.','For no reissue, do not create another check-in.','Cross out the barcode, fold to the barcode, write SPOILED, and place the card in the green bag.']
    }
  ],
  trainingTopics:[
    'Opening and worker orientation','Numbered station setup','Activation-card preload','Standard voter check-in','Mail-In Ballot','Already Voted','Early Voted','Voter Not Found','ID Required','Provisional ballots','Reprint','Spoil','Crowd flow','Who to call before improvising'
  ],
  currentLinks:[
    {title:'Morris County Elections',url:'https://www.morriscountynj.gov/Departments/Elections'},
    {title:'New Jersey Division of Elections',url:'https://www.nj.gov/state/elections/'},
    {title:'New Jersey Election Law — Title 19',url:'https://lis.njleg.state.nj.us/nxt/gateway.dll?f=templates&fn=default.htm&vid=Publish:10.1048/Enu'}
  ]
};
