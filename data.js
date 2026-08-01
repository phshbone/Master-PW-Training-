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
      id:'checkin', title:'Standard Voter Check-In', modes:['early','election'], type:'teaching',
      summary:'Confirm the voter, inspect flags, verify signature, preload the activation card, and complete check-in once.',
      badges:['Same for Both','Teaching Guide Prototype'],
      lessons:[
        {
          id:'search', title:'Search for the voter',
          lead:'Use the correct search method for the current mode and keep searching before escalating.',
          official:['Use the voter information provided to locate the correct record.','Review the result list carefully before selecting a voter.'],
          why:'A rushed search can lead to the wrong record, a missed existing record, or an unnecessary escalation.',
          tips:['Early voting uses the countywide voter list, so search broadly and carefully.','Use alternate search methods when spelling, spacing, or a compound surname may affect the result.'],
          mistakes:['Selecting the first similar name without verifying the record.','Treating a failed first search as proof that the voter is not registered.'],
          actions:[]
        },
        {
          id:'confirm', title:'Confirm the correct voter record',
          lead:'Verify that the record on screen belongs to the person standing in front of you.',
          official:['Ask the voter to state information used to confirm the record, such as address or date of birth.','Compare the stated information with the voter record before continuing.'],
          why:'People with identical or similar names may live at the same address or appear next to one another in search results.',
          tips:['Date of birth is especially useful when distinguishing a parent and adult child or possible senior/junior records.','Use the information in the record rather than relying on appearance alone.','When something feels inconsistent, pause and verify before moving forward.'],
          mistakes:['Reading the answer from the screen and asking the voter only to agree.','Assuming a person is the correct voter because the name and address look familiar.'],
          actions:[]
        },
        {
          id:'flags', title:'Review eligibility and every flag',
          lead:'Do not move past the voter screen until eligibility and all visible flags have been reviewed.',
          official:['Read and follow each applicable ePollbook instruction.','Escalate when the flag or remedy is unclear.'],
          why:'Flags may change whether the voter receives a regular ballot, provisional ballot, identification request, or Board assistance.',
          tips:['Say the flag name aloud during training so the worker learns to notice it.','Teach workers to stop rather than click through an unfamiliar message.'],
          mistakes:['Focusing on the voter’s name and missing a flag.','Treating different flags as though they all have the same remedy.'],
          actions:[]
        },
        {
          id:'signature', title:'Obtain and verify the signature',
          lead:'Follow the signature prompts and distinguish a current mismatch from a No Signature on File flag.',
          official:['Have the voter sign where directed.','Use Sign Again when the current signature needs another attempt.','Contact the Board when the discrepancy remains unresolved.'],
          why:'No Signature on File and a mismatch during the current check-in are different situations and may require different procedures.',
          tips:['Slow the process down before asking for a second signature so the voter understands why another attempt is needed.'],
          mistakes:['Treating every signature issue as provisional.','Ignoring the distinction between a missing stored signature and a current mismatch.'],
          actions:[]
        },
        {
          id:'preload', title:'Confirm the activation card is preloaded',
          lead:'Before completing check-in, physically confirm that one blank activation card is loaded in the ExpressVote printer.',
          official:['Confirm one blank activation card is loaded before every check-in.','When check-in is complete but the card was not preloaded, use Reprint.','Do not check the voter in again.'],
          why:'A missed preload interrupts the voter flow and creates a recovery situation that workers may accidentally handle as a second check-in.',
          tips:['Place a small handwritten PRELOAD CARD reminder on or directly in front of the Epson printer.','The authority slip is often the last item removed from the Epson printer, making that location an effective final visual reminder.','Keep blank cards in one consistent location and build the preload check into the transition between voters.'],
          mistakes:['Completing check-in without physically checking the card slot.','Checking the voter in a second time instead of using Reprint.'],
          actions:['Blank activation card physically confirmed before completing check-in.']
        },
        {
          id:'complete', title:'Complete check-in and manage printed materials',
          lead:'Complete the transaction once, keep the printed materials organized, and return the station to Process Next Voter.',
          official:['Complete check-in only after the voter record, flags, signature, initials, and preload are confirmed.','Manage the authority slip and activation card according to the current instructions.','Return the ePollbook to Process Next Voter.'],
          why:'A consistent closing rhythm prevents materials from being mixed between voters and leaves the station ready for the next person.',
          tips:['Use the same placement pattern for the authority slip and activation card at every station.','Teach the worker to perform a final screen-and-printer reset before greeting the next voter.'],
          mistakes:['Beginning the next search while materials from the prior voter remain on the work surface.','Repeating check-in because an expected printout is missing.'],
          actions:['Worker initials completed.','Activation card and authority slip handled correctly.','Station returned to Process Next Voter.']
        }
      ]
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
  dosDonts:{
    dos:[
      {text:'Follow the current screen and secured binder instructions in order.',detail:'Stop when a screen, seal, report, number, or physical setup differs from expectations.',tags:['Official Procedure','Same for Both']},
      {text:'Confirm the correct voter record before continuing.',detail:'Use voter-stated information such as address or date of birth to distinguish similar records.',tags:['Official Procedure','Check-In']},
      {text:'Review every voter flag and follow the specific remedy.',detail:'Different flags can lead to different outcomes; do not treat them as interchangeable.',tags:['Official Procedure','Check-In']},
      {text:'Confirm one blank activation card is loaded before completing check-in.',detail:'A missing preload is recovered through Reprint after check-in is complete.',tags:['Current Morris Update','Check-In']},
      {text:'Stop and ask the master worker or Board before improvising.',detail:'Escalation is safer than creating a duplicate record or using the wrong ballot process.',tags:['Official Procedure','Same for Both']}
    ],
    donts:[
      {text:'Do not ask every voter for identification.',detail:'Request identification only when the voter record shows Voter ID Required.',tags:['Official Do Not','Check-In']},
      {text:'Do not select Voter Not Found without express Board direction.',detail:'Continue searching and escalate before beginning any new-record process.',tags:['Critical','Same for Both']},
      {text:'Do not check a voter in a second time to recover a missing printout.',detail:'Use Reprint when the original check-in is already complete.',tags:['Current Morris Update','Reprint']},
      {text:'Do not confuse Reprint with Spoil.',detail:'Reprint recovers a missing printed item; Spoil cancels an uncast ballot card.',tags:['Current Morris Update','Same for Both']},
      {text:'Do not select Close Poll during an intermediate early-voting night.',detail:'Use the secured nightly shutdown path in the current binder.',tags:['Critical','Early Voting']}
    ]
  },
  trainingTopics:[
    'Opening and worker orientation','Numbered station setup','Activation-card preload','Standard voter check-in','Mail-In Ballot','Already Voted','Early Voted','Voter Not Found','ID Required','Provisional ballots','Reprint','Spoil','Crowd flow','Who to call before improvising'
  ],
  currentLinks:[
    {title:'Morris County Elections',url:'https://www.morriscountynj.gov/Departments/Elections'},
    {title:'New Jersey Division of Elections',url:'https://www.nj.gov/state/elections/'},
    {title:'New Jersey Election Law — Title 19',url:'https://lis.njleg.state.nj.us/nxt/gateway.dll?f=templates&fn=default.htm&vid=Publish:10.1048/Enu'}
  ]
};
