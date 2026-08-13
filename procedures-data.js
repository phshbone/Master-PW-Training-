window.APP_DATA.fieldCategories = [
  {id:'flags', title:'ePollbook Flags', icon:'⚑', description:'What a voter flag means and what to do next.'},
  {id:'forms', title:'Forms & Record Changes', icon:'▤', description:'Affirmation, correction, address and voter-record changes.'},
  {id:'provisional', title:'Provisional Ballots', icon:'◫', description:'When provisional voting is required and related handling.'},
  {id:'mailin', title:'Vote-by-Mail', icon:'✉', description:'Mail-in voter situations and in-person options.'},
  {id:'reprint', title:'Reprint', icon:'↻', description:'Recover missing or damaged printed items after check-in.'},
  {id:'spoil', title:'Spoil', icon:'⊘', description:'Replace an issued, uncast activation card.'},
  {id:'assistance', title:'Voter Assistance', icon:'◎', description:'Assistance requests, assistors, and printed certificates.'},
  {id:'primary', title:'Primary Election', icon:'◆', description:'Party affiliation and unaffiliated-voter procedures.'},
  {id:'opening', title:'Opening / Closing', icon:'◷', description:'Links to established opening, nightly shutdown, and closing material.'},
  {id:'equipment', title:'Equipment / Troubleshooting', icon:'⚙', description:'Setup, synchronization, printer, and station recovery notes.'}
];

window.APP_DATA.fieldProcedures = [
  {
    id:'normal-no-flag', category:'flags', title:'Normal / No Flag', aliases:['normal voter','no flag','eligible','regular check in'], modes:['early','election'],
    status:['Official Procedure'],
    meaning:'The voter record shows the voter is eligible for a regular ballot and no special tag requires a separate remedy.',
    steps:['Confirm the correct voter record before continuing.','Review the eligibility screen for any tags or warnings.','Get the voter’s signature and compare it with the signature on file.','Complete the poll-worker initials and confirm one blank activation card is pre-loaded before completing check-in.','Complete check-in and handle the activation card and authority slip normally.'],
    outcome:'Regular machine ballot.',
    source:{title:'Morris County Poll Worker Manual',authority:'Morris County Board of Elections',date:'May 7, 2024',section:'Checking-in a Voter, pp. 14–16'}
  },
  {
    id:'affirm-address', category:'flags', title:'Affirm Address', aliases:['affirm','affirmation','affirm address','residence','returned mail','undeliverable','correction of record','moved','change address','address change'], modes:['early','election'],
    status:['Official Procedure','Current Morris Training Guidance'],
    meaning:'Election mail was returned or the record otherwise requires the voter to confirm the address on file. This is not an ID situation.',
    decision:{question:'Does the voter still live at the address shown in the voter record?',yes:'Complete the Affirmation of Residence portion. The voter may vote on the machine after the form is completed.',no:'Do not have the voter affirm the old address. Determine the new election district and follow the changed-residence procedure.'},
    steps:['Explain that the voter must confirm whether the address in the poll book is still current.','Do not request identification or proof of address solely because of the Affirm Address tag.','If the address is still current, have the voter complete and sign the Affirmation of Residence portion of the Morris County combined form.','Have two poll workers sign the form as the current Morris training directs. Current training states the two signers should represent opposite parties; an unaffiliated worker may act as either.','Continue the regular check-in after the form is complete.','Return the completed form with the poll books/election materials.'],
    notDo:['Do not ask for ID or proof of address for the Affirm Address flag.','Do not let a voter who has moved affirm that the old address is still current.'],
    outcome:'If the voter affirms they still reside in the election district: regular machine ballot. If the voter has moved: outcome depends on the new residence.',
    form:'Morris County Correction of Record / Affirmation of Residence',
    escalation:'Call the Board when the voter’s residence cannot be resolved from the voter’s information or the correct district/remedy is unclear.',
    source:{title:'NJ District Board Member Training Manual',authority:'New Jersey Division of Elections',date:'2024',section:'Affirm Address and Changed Residence, pp. 19–20',supplement:'Morris County current poll-worker training transcript and county combined form'}
  },
  {
    id:'changed-residence', category:'forms', title:'Address Change / Changed Residence', aliases:['moved','new address','address change','changed residence','moved within district','moved county'], modes:['early','election'],
    status:['Official Procedure'],
    meaning:'The voter states that the address on the voter record is no longer current. The voting outcome depends on where and when the voter moved.',
    steps:['Determine the voter’s current residence.','If the voter moved within the same election district, complete the county record-change form and allow a regular machine vote.','If the voter moved to another election district within the county, direct the voter to the new polling place; the voter votes provisionally there.','If the voter moved outside the county after the registration deadline and could not register in the new county in time, follow the State manual’s former-county procedure and required form.','If the voter moved outside the county in time to register in the new county, the State manual says the voter may not vote in either the former or new county for that election.'],
    notDo:['Do not reduce every address change to “Moved = Provisional.”','Do not issue the voter a ballot for the old district when the voter must vote provisionally in the new district.'],
    outcome:'Varies by residence and timing; use the decision points above.',
    form:'Morris County Correction of Record / Affirmation of Residence when applicable.',
    source:{title:'NJ District Board Member Training Manual',authority:'New Jersey Division of Elections',date:'2024',section:'Voters Who Have Changed Their Residence, p. 20'}
  },
  {
    id:'correction-record', category:'forms', title:'Correction of Record', aliases:['correction','correction of record','name change','address change','deceased','death','out of county','out of state'], modes:['early','election'],
    status:['Current Morris Guidance'],
    meaning:'The top portion of the Morris County combined form records changes or reports affecting a voter record.',
    steps:['Complete the identifying fields at the top of the form as applicable.','Select the applicable reason shown on the current form: Name Change, Address Change, Moved – Out of County, Moved – Out of State, or Deceased.','Complete Former and New information when applicable.','Complete Person Reporting, Relationship, and Signature when applicable.','Return the completed form with the poll books/election materials.'],
    notDo:['Do not assume the Correction of Record section itself determines whether the voter receives a regular or provisional ballot; apply the separate voting rule for the situation.'],
    outcome:'Record correction/reporting; voting outcome depends on the underlying situation.',
    form:'Morris County Correction of Record / Affirmation of Residence',
    source:{title:'Correction of Record / Affirmation of Residence form',authority:'Morris County Board of Elections',section:'Current combined county form supplied in poll materials'}
  },
  {
    id:'signature-required', category:'flags', title:'Signature Required / No Signature on File', aliases:['signature required','no signature','missing signature','signature on file'], modes:['early','election'],
    status:['Official Procedure','Current Morris Training Guidance'],
    meaning:'The voter record has no stored signature available for comparison.',
    steps:['Do not process the voter for a regular machine ballot.','Select the provisional path in the ePollbook and complete the provisional process.','Ensure the voter completes and signs the provisional Affirmation Statement envelope.','Current Morris training states that the signature on the provisional affirmation becomes the signature on file for the voter.'],
    notDo:['Do not confuse No Signature on File with a current signature mismatch. A current mismatch is handled first with Sign Again and Board guidance if unresolved.'],
    outcome:'Provisional ballot.',
    source:{title:'NJ District Board Member Training Manual',authority:'New Jersey Division of Elections',date:'2024',section:'Signature Required, p. 19',supplement:'Morris County current poll-worker training transcript'}
  },
  {
    id:'id-required', category:'flags', title:'ID Required', aliases:['id required','active need id','need id','identification'], modes:['early','election'],
    status:['Official Procedure'],
    meaning:'This specific voter is required to provide an acceptable identifying document. Most voters are not asked for ID.',
    steps:['Ask for a current and valid identifying document only because the voter is marked ID Required.','Record the ID type in the ePollbook when acceptable ID is provided, then continue regular check-in.','If acceptable ID is not provided, select the Not Provided option and process the voter provisionally.'],
    notDo:['Do not ask every voter for identification.'],
    outcome:'Acceptable ID: regular machine ballot. No acceptable ID: provisional ballot.',
    source:{title:'NJ District Board Member Training Manual',authority:'New Jersey Division of Elections',date:'2024',section:'ID Required, p. 19'}
  },
  {
    id:'already-voted-field', category:'flags', title:'Already Voted', aliases:['already voted','voted already','duplicate check in'], modes:['early','election'],
    status:['Current Morris Guidance'],
    meaning:'The ePollbook shows that the voter was already checked in for this election. Current Morris training notes that an earlier wrong-record check-in is one possible cause.',
    steps:['Explain what the ePollbook shows.','If the voter disputes the record and wishes to vote, process a provisional ballot so the Board can investigate.','If you know a wrong-record check-in may have occurred, complete an Incident Report with the voter information.','When the Incident Report directly explains that provisional case, current Morris training directs workers to keep it with the provisional material in the orange bag.'],
    outcome:'Provisional ballot when the voter disputes the record and wishes to vote.',
    source:{title:'Current Morris Poll Worker Training',authority:'Morris County Board of Elections',section:'Already Voted test case; provisional investigation and Incident Report handling'}
  },
  {
    id:'early-voted-field', category:'flags', title:'Early Voted', aliases:['early voted','early voting','already early voted'], modes:['election'],
    status:['Official Procedure','Current Morris Training Guidance'],
    meaning:'The voter record indicates a check-in during the Early Voting period.',
    steps:['Explain that the record shows an Early Voting check-in.','If the voter disputes the record and wishes to vote, process a provisional ballot.','The Board investigates whether the provisional ballot is eligible to count.'],
    outcome:'Provisional ballot when the voter disputes the Early Voted record and wishes to vote.',
    source:{title:'Morris County Poll Worker Manual',authority:'Morris County Board of Elections',date:'May 7, 2024',section:'Early Voted, p. 21',supplement:'Current Morris poll-worker training transcript'}
  },
  {
    id:'mailin-field', category:'flags', title:'Mail-In Ballot', aliases:['mail in','mail-in','vote by mail','vbm','mib'], modes:['early','election'],
    status:['Official Procedure','Current Morris Update'], linkedProcedureId:'mailin',
    meaning:'The voter is recorded as a mail-in ballot voter and cannot receive a regular machine ballot at the polling location.',
    outcome:'Provisional ballot when voting in person.',
    source:{title:'NJ District Board Member Training Manual',authority:'New Jersey Division of Elections',date:'2024',section:'Mail-In Ballot Voter, p. 18',supplement:'Morris County Provisional Ballots Info Guide, Issue #5'}
  },
  {
    id:'voter-not-found-field', category:'flags', title:'Voter Not Found', aliases:['not found','voter not found','cannot find voter','search failed'], modes:['early','election'],
    status:['Critical','Current Morris Guidance'], linkedProcedureId:'notfound',
    meaning:'A search has not located the voter record. A failed first search is not proof that the voter is unregistered.',
    outcome:'Search/redirect/Board determination first; do not select Voter Not Found without Board direction.',
    source:{title:'Morris County Poll Worker Manual',authority:'Morris County Board of Elections',date:'May 7, 2024',section:'Searching for a Voter, p. 13'}
  },
  {
    id:'voter-assistance-field', category:'assistance', title:'Voter Assistance', aliases:['assistance','language assistance','visual','hearing','physical','assistor','certificate of assistance'], modes:['early','election'],
    status:['Official Procedure','Current Morris Training Guidance'],
    meaning:'A voter requests help to vote because of language, visual, hearing, physical, or another qualifying need.',
    steps:['From the voter record, use More Options → Request Assistance when assistance is requested before check-in; assistance can also be added retroactively from the Launch Pad.','Select the assistance type and have the voter sign to verify the request.','If the voter brought an assistor, enter the assistor information and obtain the assistor signature as prompted.','If the voter did not bring an assistor, current Morris guidance uses two poll workers of opposing parties; an unaffiliated worker may act as either party.','Two poll workers sign the printed Certificate of Assistance and place it in the Clear Envelope.','Provide only the assistance the voter needs; do not guide the voter toward a candidate or choice.'],
    outcome:'Voter continues the normal voting process with approved assistance.',
    form:'Certificate of Assistance generated by the ePollbook/Epson printer.',
    source:{title:'Morris County Poll Worker Manual',authority:'Morris County Board of Elections',date:'May 7, 2024',section:'Processing Voter Assistance, pp. 17–20',supplement:'NJ District Board Member Training Manual, pp. 21–24'}
  },
  {
    id:'provisional-field', category:'provisional', title:'Provisional Ballot', aliases:['provisional','provisional ballot','orange bag','affirmation envelope'], modes:['early','election'], status:['Official Procedure','Current Morris Update'], linkedProcedureId:'provisional',
    meaning:'Used when the voter cannot receive a regular ballot and eligibility requires Board review.',
    outcome:'Provisional ballot; Board determines eligibility after the election.',
    source:{title:'Morris County Provisional Ballots Info Guide, Issue #5',authority:'Morris County Board of Elections',section:'Current provisional workflow and Box 13 mail-in opt-out'}
  },
  {
    id:'reprint-field', category:'reprint', title:'Reprint', aliases:['reprint','missing activation card','authority slip jam','print again'], modes:['early','election'], status:['Current Morris Update'], linkedProcedureId:'reprint',
    meaning:'Use Reprint when check-in is complete but a previously printed item is missing, damaged, or needs to be printed again.',
    notDo:['Do not spoil or check the voter in again when there is no issued card to exchange.'],
    outcome:'Replacement printout; original voter check-in remains intact.',
    source:{title:'Poll Worker Info Guide — Reprinting vs. Spoiling a Ballot, Issue #3',authority:'Morris County Board of Elections'}
  },
  {
    id:'spoil-field', category:'spoil', title:'Spoil', aliases:['spoil','spoiled ballot','replace activation card','change selections'], modes:['early','election'], status:['Current Morris Update'], linkedProcedureId:'spoil',
    meaning:'Use Spoil when an activation card has already been issued and must be replaced before the vote is cast.',
    notDo:['Do not use Spoil merely because an item failed to print during check-in; that is a Reprint situation.'],
    outcome:'Original uncast card is spoiled; replacement may be issued when appropriate.',
    source:{title:'Poll Worker Info Guide — Reprinting vs. Spoiling a Ballot, Issue #3',authority:'Morris County Board of Elections'}
  },
  {
    id:'primary-field', category:'primary', title:'Primary Election — Party Rules', aliases:['primary','unaffiliated','declare party','party change','cross party'], modes:['early','election'],
    status:['Current Morris Guidance'],
    meaning:'Primary voters must receive the ballot for the party they are eligible to vote in. An unaffiliated voter may declare Democrat or Republican before voting.',
    steps:['If the voter is already affiliated with a party, process the voter for that party’s primary ballot.','Do not allow an affiliated voter to cross party lines at the polling place.','If the voter is UNA, use Declare Party and allow the voter to choose Democrat or Republican on the voter-facing screen.','Do not issue a provisional ballot merely because a voter wants to vote a different party than the voter is registered with; current Morris guidance warns that it will not count.'],
    source:{title:'Poll Worker Info Guide — Primary Election, Issue #2',authority:'Morris County Board of Elections',date:'2026 Primary Election guidance'}
  },
  {
    id:'opening-links', category:'opening', title:'Opening / Closing Procedures', aliases:['opening','closing','shutdown','morning opening','nightly'], modes:['early','election'], status:['Shared Existing Procedure'],
    meaning:'The app already contains the developed opening and nightly shutdown material. Use those established procedures rather than maintaining duplicate copies here.',
    related:['opening','morning','shutdown'],
    source:{title:'Existing Master Poll Worker Training App procedure set',authority:'Source-backed app content'}
  },
  {
    id:'station-setup', category:'equipment', title:'ePollbook Station Setup & Handoff', aliases:['wires','setup','station','printer','router','logout','sync','close election'], modes:['early','election'],
    status:['Current Morris Guidance'],
    meaning:'Set up numbered components together, keep wires controlled, and log out whenever another worker takes over the ePollbook.',
    steps:['Set up one numbered ePollbook station at a time to avoid cross-connections.','Match the ePollbook, Epson printer, and ExpressVote printer numbers.','Keep wires bundled and positioned so the voter does not need to move them.','Log out temporarily whenever you leave the ePollbook so the next worker signs in under their own name.','At final close, leave the iPad and router connected until the device reports synchronization complete; pack other materials while waiting.'],
    outcome:'Correctly attributed check-ins and a synchronized closed ePollbook.',
    source:{title:'Poll Worker Info Guide — Wires and Setting Up, Issue #4',authority:'Morris County Board of Elections',supplement:'Current Morris poll-worker training transcript'}
  }
];

window.APP_DATA.trainingTopics = Array.from(new Set([
  ...window.APP_DATA.trainingTopics,
  'Affirm Address / Correction of Record','Signature Required / No Signature','Voter Assistance','Primary Election party rules'
]));
