window.APP_DATA = {
  procedures: [
    {
      id:'early-equipment', title:'Early Voting Equipment and Room Readiness', modes:['early'],
      summary:'Start the router, organize the blue travel cases, stock the room, and prepare the accessible entrance before the team opens equipment.',
      badges:['Early Voting','Master Poll Worker Practice'],
      sources:[
        {type:'morris',title:'Morris County master poll worker training and trainer experience',detail:'Trainer-described blue travel cases, room supplies, router timing, accessible-entrance sign, and call-bell response'}
      ],
      warning:'Plug in the site router first and keep it powered throughout the day. At closing, do not unplug it until every ePollbook has finished synchronizing.',
      stepIds:['start-router-first','open-blue-cases','stock-room-supplies','place-accessible-sign','respond-accessibility-bell'],
      steps:['Open the secured cage and plug in the site router first so it has time to start and establish its connection.','Open the two blue travel cases, remove the numbered machine binders, and organize the remaining equipment where workers can find it.','Stock the check-in and work areas with the needed supplies, including registration forms, I Voted stickers, styluses, pens, extra incident reports, correction or affirmation forms, and required room signs.','Place the accessible-entrance sign and call bell in the assigned outside location.','If the accessible-entrance bell sounds, send a worker outside promptly to ask what assistance is needed, then follow the current voter-assistance procedure.']
    },
    {
      id:'opening', title:'Early Voting Team Briefing', modes:['early'],
      summary:'Gather the team, match the numbered binders, explain the morning flow, and assign flexible master poll worker coverage.',
      badges:['Early Voting','Master Poll Worker Practice'],
      sources:[
        {type:'morris',title:'Current secured Early Voting binder and Morris County master poll worker training',detail:'Trainer-described team briefing and floor practice; follow the binder issued for the current election'}
      ],
      warning:'Use the current machine binder. Do not reconstruct secured opening instructions from memory.',
      stepIds:['gather-workers','badges-assignments','match-binders','explain-binder-layout','assign-master-coverage','explain-mode-difference'],
      steps:['Gather poll workers at the master poll worker table or cage.','Take attendance, distribute badges, review assignments, and explain the morning sequence before anyone begins.','Take each numbered binder to its corresponding voting machine and confirm the numbers match.','Briefly show the team where to find the opening instructions, seal log, password card, red pouch, and the black pouch for the designated day.','Use flexible master poll worker coverage: one reads and controls the pace of the binder instructions while watching part of the room; another circulates with the used-seal bag and reconciliation sheet. Adjust and assist one another as needed.','Explain that the instructions in the secured binder—not your own memory—are the source for the exact voting-machine operating sequence. Each site’s master poll worker may decide whether to read the instructions aloud or have workers follow them directly.']
    },
    {
      id:'election-opening', title:'Election Day Site and Team Setup', modes:['election'],
      summary:'Find the district team, locate the equipment, arrange the room, and divide the opening work.',
      badges:['Election Day','Master Poll Worker Practice'],
      sources:[
        {type:'morris',title:'Morris County master poll worker training and trainer experience',detail:'Room arrangement, district separation, division of work, and one-station-at-a-time sequencing'}
      ],
      stepIds:['find-district-team','locate-equipment','position-machines','review-machine-routing','divide-opening-work','lay-out-stations'],
      steps:['Report to the assigned polling location, find the other poll workers, and confirm everyone is working the same district.','Locate the district’s voting machines, ePollbooks, printers, binders, signs, and supplies.','Position the voting machines near working outlets and leave visible separation between districts when several districts share one room.','When checking in voters, send them to your district’s machines whenever possible. If multiple districts share the same room, a voter may use any machine in that room. Machines in another room may not be used, even when the districts are in the same building.','Agree as a district how to divide the opening work. A two-and-two split between voting-machine setup and ePollbook setup is recommended when staffing allows, but the team may adjust.','Lay out each check-in station and route its cords safely, but do not plug in all stations at once.']
    },
    {
      id:'expressvote-opening', title:'Voting Machine Opening', modes:['election'],
      summary:'Verify seals and identifiers, power on, open the poll, secure the Zero Reports, and prepare the booth.',
      badges:['Election Day','Official Morris Procedure'],
      sources:[
        {type:'official',title:'Morris County Voting Machine Manual',detail:'Voting Machine Opening Procedures, manual pages 3–7; last revised April 18, 2023'}
      ],
      warning:'If any seal is missing, broken, or does not match the Key Envelope, call the Voting Machine Warehouse immediately. Place every removed seal in the green Spoiled Ballot/Used Seal Bag.',
      stepIds:['position-lock-machine','open-machine-covers','match-key-envelope','remove-back-materials','verify-top-seal','lift-screen-cover','connect-machine-power','open-top-access','power-on-machine','secure-top-access','adjust-screen','enter-election-code','poll-device-status','verify-public-counter-zero','open-poll-zero-reports','continue-card-screen','raise-curtain-rods','remove-curtain','install-curtain','hang-authority-string'],
      steps:['Use the chrome handles to position the machine and lock the swivel casters.','Move the light stick vertically; cut and bag the white cover seal; remove, fold, and store the machine covers on the back shelf.','Retrieve the Key Envelope from the Red Bag and confirm its machine number matches the machine.','Use the barrel key to open the back compartment and remove the district materials, then close and lock it. When a district has two machines, the Activation Card container may be in one machine while the extension reel and ePollbook power strips are in the other.','Verify the red Top Access Compartment seal matches the Key Envelope, then cut it and place it in the green bag.','Lift the screen cover.','Plug the machine into a working outlet, secure the cord against trip hazards, and verify both green power indicators. No more than four machines may be daisy-chained to one outlet.','Use the barrel key to unlock and open the Top Access Compartment; do not remove the key yet.','Press the red power button and verify the middle status light above the screen illuminates.','Close and lock the Top Access Compartment, return the key to the Key Envelope, and set the needle and thread aside.','Use two hands at the bottom of the screen to adjust its angle.','Enter the case-sensitive Election Code from the Key Envelope, select Accept, and return the envelope to the Red Bag.','Confirm the Poll and Device Status screen appears.','Verify the Public Counter is zero.','Select Open Poll. Two Zero Reports print automatically. Verify every number is zero; have two workers from different parties sign both reports and place both in the Red Bag. Keep the reports from touching the screen while printing.','Select Continue and confirm the card-insertion screen appears.','Unlatch the white clamps, raise the curtain rods to maximum height, and relatch the clamps.','Release only the left Velcro strap on the curtain tube, remove the cap and curtain, and replace the cap.','Insert the metal curtain tubes into the curtain rods; use two workers if needed.','Hang the needle and thread from the Key Envelope on a curtain rod for the Voting Authority Slips.']
    },
    {
      id:'epollbook-opening', title:'ePollbook Station Opening', modes:['election'],
      summary:'Build, connect, test, and log in to one correctly numbered check-in station at a time.',
      badges:['Election Day','Official Morris Procedure'],
      sources:[
        {type:'official',title:'Morris County Election Day Poll Worker Manual',detail:'Assembly, ePollbook setup, wire management, login, and printer tests; manual pages 3–10',url:'https://www.morriscountynj.gov/files/sharedassets/public/v/1/departments/elections/poll-worker-manual.pdf'},
        {type:'morris',title:'Morris County master poll worker training and trainer experience',detail:'iPad-first power sequence, Find–Test–Save workflow, one-station-at-a-time setup, and possible second Bluetooth test'},
        {type:'pending',title:'Printed ExpressVote test-card disposal',detail:'Trainer practice described recycling or discarding it; the published 2024 manual directs workers to mark it TEST and place it in the green bag. Follow the current election instruction until reconciled.'}
      ],
      warning:'The ePollbook, Epson printer, and ExpressVote printer numbers must match. Never select or connect to a differently numbered device; call the Board when identifiers differ.',
      stepIds:['one-station-at-time','unpack-follow-schematic','connect-extension-power-strip','confirm-matching-numbers','power-touchpad-first','open-user-interface','power-epson','select-epson-menu','find-epson','test-epson','save-epson','power-expressvote','select-expressvote-menu','find-expressvote','test-expressvote','retry-expressvote-test','save-expressvote','repeat-station-two','verify-green-links','login-opening-report'],
      steps:['Complete Station 1 before beginning Station 2.','Remove all equipment from the suitcase and lay it out on the table following the ePollbook manual’s station schematic and photographs.','Route the cords safely, plug the extension reel into a working wall outlet, plug the power strip into the reel, and turn on the power strip.','Before connecting anything, confirm the iPad/ePollbook, Epson printer, and ExpressVote printer numbers all match the station number.','Connect the iPad/ePollbook charger to the proper USB power port first. The iPad should turn on automatically.','Follow the iPad prompts to reach the ePollbook user interface and verify the displayed location and district. Call the Board immediately if either is incorrect.','Connect the Epson printer to power and turn it on.','Open the gear menu in the upper-left corner, find the Epson printer entry, and select Select Printer. Remember the left-to-right sequence: Find, Test, Save.','Select Find and choose only the Epson printer whose number matches the iPad and physical printer.','Select Test and confirm the Epson test sheet prints successfully; the test sheet may be discarded.','Select Save to keep the Epson connection and close the printer window.','Connect the ExpressVote printer to its server and power, then press its power button.','Open the gear menu, find the ExpressVote printer entry, and select Select Printer. Use the same Find, Test, Save sequence.','Select Find and choose only the ExpressVote printer whose number matches the iPad and physical printer.','Select Test. Without an Activation Card, confirm the test tone; with an Activation Card, confirm that the printed test completes.','If the first ExpressVote test does not respond, wait until the gray Test button becomes available and test again. A second attempt may be needed for the Bluetooth connection.','After a successful test, select Save. Handle any printed test card according to the current election instruction.','Confirm Station 1 is complete, then repeat the entire iPad, Epson, and ExpressVote process for Station 2.','Confirm both printer indicators are green on each ePollbook and the Sideways connection shows the two ePollbooks linked and synchronized in green.','Select START, enter the worker’s full name, unlock the device with the password from the Clear Envelope, place the Poll Opening Report in the Clear Envelope, and confirm the Launchpad is ready for check-in.']
    },
    {
      id:'open-polls', title:'Open the Polls', modes:['election'],
      summary:'Complete the final room check, open at 6:00 a.m., and finish administrative paperwork when voter flow permits.',
      badges:['Election Day','Final Opening Check'],
      sources:[
        {type:'official',title:'Morris County Voting Machine Manual',detail:'Voting machine ready state and signed Zero Reports, manual pages 5–7; last revised April 18, 2023'},
        {type:'official',title:'Morris County Election Day Poll Worker Manual',detail:'ePollbook Launchpad and Poll Opening Report ready state, manual pages 8–10',url:'https://www.morriscountynj.gov/files/sharedassets/public/v/1/departments/elections/poll-worker-manual.pdf'},
        {type:'morris',title:'Morris County master poll worker training and trainer experience',detail:'Final room check and post-opening oath/payroll timing'}
      ],
      stepIds:['verify-machine-ready','verify-stations-ready','post-signs-tidy','organize-materials','announce-open','post-opening-paperwork'],
      steps:['Confirm every voting machine shows the card-insertion screen and both signed Zero Reports for each machine are secured in the Red Bag.','Confirm every ePollbook station is on the Launchpad and each Poll Opening Report is in the Clear Envelope.','Post all required signs and confirm entrances, pathways, booths, cords, and work areas are accessible, neat, and safe.','Return keys, envelopes, binders, and remaining materials to their assigned bags or locations.','At 6:00 a.m., have the judge announce that the polls are open and begin processing voters.','After the polls open, complete the Oath of Office and payroll sheet when voter flow permits.']
    },
    {
      id:'morning', title:'Early Voting Morning Opening', modes:['early'],
      summary:'Follow the current binder, verify seals and totals, review the completed logs, test each ePollbook station, and prepare the team for voters.',
      badges:['Early Voting','Master Poll Worker Practice'],
      sources:[
        {type:'morris',title:'Morris County master poll worker training and current secured Early Voting binder',detail:'Trainer-described site workflow, timing, housekeeping, and rotation practice; verify every machine step, seal field, and report requirement against the issued binder'}
      ],
      warning:'Read the exact voting-machine opening instructions from the current numbered binder. Stop and escalate when a seal, number, screen, total, or required item differs; do not reconstruct the secured procedure from memory.',
      stepIds:['verify-carried-seal','identify-daily-materials','read-current-binder','review-initial-report','initial-seal-log','review-binders-at-master-table','prepare-epollbook-layout','test-one-station-at-time','return-by-nine-fifty','protect-electronics'],
      steps:['Confirm that each numbered binder is at the matching voting machine.','Identify the designated day’s materials and set out only what is needed: the opening instructions, seal log, password card, barrel key, pen, scissors, and daily manila envelope with its supplied materials. Leave other days’ pouches undisturbed.','Have the designated master poll worker read the current binder instructions aloud and control the pace while workers complete the exact machine-opening steps.','Have the circulating master poll worker collect every removed seal and use the reconciliation form to verify totals—Day 1 uses the required zero check; later mornings compare with the prior day’s carried-forward totals.','Complete the required seal-log and reconciliation-form entries as the physical checks are performed, then confirm the machines reached the binder’s required ready state.','Bring the binders to the master poll worker table and review the seal logs for missing or incomplete entries. Enter the issued evening or next-day seal numbers in the appropriate future fields so workers need only verify them later; do not initial or mark those numbers verified in advance.','At the preset ePollbook stations, explain the equipment layout, cord routing, and powered-on power strip without powering every printer at once.','Test the printers through the gear menu, completing and confirming one ePollbook station before moving to the next.','Do not log in unnecessarily early. Follow the current site schedule and on-screen instructions, and have workers back at their starting positions by approximately 9:50 a.m. to prepare for voters.','Keep liquids off the ePollbook tables. When staffing and voter flow allow, rotate workers between the ePollbooks and voting machines about hourly—especially before lunch—so everyone practices both assignments.']
    },
    {
      id:'shutdown', title:'Intermediate Nightly Shutdown', modes:['early'],
      summary:'Stage the numbered materials, record closing totals, power down without closing the poll, exchange and seal canisters, synchronize ePollbooks, and secure the room.',
      badges:['Early Voting','Critical'],
      sources:[
        {type:'morris',title:'Morris County master poll worker training and current secured Early Voting binder',detail:'Trainer-described ordinary multi-machine shutdown, runner exchange, seal logging, ePollbook synchronization, and room-security workflow'},
        {type:'pending',title:'Exact screens and authentication prompts',detail:'Follow the current secured binder and on-screen prompts; the precise password-prompt sequence still requires binder or Board confirmation'}
      ],
      warning:'DO NOT SELECT CLOSE POLL during an ordinary intermediate Early Voting night. Do not close any machine early unless the County runner or Board explicitly authorizes the staggered closing.',
      stepIds:['stage-closing-envelopes','begin-authorized-closing','prepare-pairs-and-tools','record-closing-counters','open-admin-menu','print-readiness-report','power-down-machine','seal-media-door','verify-remove-tape-seal','remove-outgoing-canister','seal-and-handoff-outgoing','record-incoming-canister','bag-incoming-seal','insert-replacement-canister','apply-panel-seal','repack-daily-binder','secure-binders','logout-epollbooks','power-down-epollbooks','secure-room-router-last'],
      steps:['About 30 minutes before closing, place each machine-numbered manila envelope with its matching binder and stage the binder discreetly behind the corresponding machine. Do not begin closing early.','For an ordinary closing, wait until closing is authorized and process all machines. Close fewer machines early only when the County runner or Board gives explicit direction.','Pair the workers, move each binder and numbered envelope to its machine work area, and set out the daily tools and materials, including the barrel key, pen, scissors, seal log, password card, and designated-day envelope.','Have the second master poll worker read each machine’s closing public-counter total and record it on the supervisory reconciliation form.','At the voting machine, select the Public Counter in the lower-left corner, use Mode, and follow the on-screen authentication prompts to reach the main menu. Do not guess at the password-prompt sequence.','From the menu on the left, open Reports, select System Readiness Report, and print it. No poll-worker signatures are required; place the report in that day’s black pouch.','Use Shut Down or Power Down in the upper-right corner, follow the confirmation and authentication prompts, wait for the machine to power down fully, and close the plastic cover.','At the back of the machine, install the media-stick access-door string seal and verify its number against the seal log as directed by the binder.','Remove the side-access-door tape seal, place the used seal on the index card in the daily envelope, and verify its number before opening the door with the barrel key.','Press the lower green release forward as shown in the binder and remove the outgoing ballot canister.','Install and verify the blue transport string seal through the outgoing canister’s top flap, verify the red tape seal on its front, and give the secured outgoing canister to the runner.','On the replacement canister, verify, record, and initial the red front tape-seal number.','Verify and record the incoming blue transport-seal number, initial the entry, cut the blue seal, and place it in the designated used-seal location.','Insert the replacement canister, confirm it is seated correctly, close and lock the side door, and return the barrel key to the red pouch.','Verify the new side-access tape-seal number against the seal log, then apply the seal so it firmly crosses both the access door and the machine’s side panel.','Return the daily manila envelope to the corresponding black pouch, return all materials to the binder, and move the pen and scissors to the next day’s pouch when another Early Voting day remains. Do not mark a future seal verified in advance.','Return the completed seal log to the binder, bring each binder to the secured cage, and confirm the machine area is clear.','At each ePollbook, sign in if necessary, open the upper-right menu, select Log Out, and choose Log Out for the Day—not Close Polls. Wait for synchronization with the other ePollbooks to finish.','After synchronization completes, close the ePollbook app using the current iPad method, power down the iPad, move it to the cage, and turn off the power strips after all stations are finished.','Bring in the accessible-entrance sign and call bell, pack the blue-case supplies, and unplug and secure the router last—only after every ePollbook has completed synchronization.']
    },
    {
      id:'checkin', title:'Standard Voter Check-In', modes:['early','election'], type:'teaching',
      summary:'Confirm the voter, inspect flags, verify signature, preload the activation card, and complete check-in once.',
      badges:['Same for Both','Teaching Guide Prototype'],
      sources:[
        {type:'official',title:'Morris County Election Day Poll Worker Manual',detail:'ePollbook checking-in, assistance, flags, District Lookup, and reprint; manual pages 13–29',url:'https://www.morriscountynj.gov/files/sharedassets/public/v/1/departments/elections/poll-worker-manual.pdf'},
        {type:'morris',title:'Morris County master poll worker training and trainer experience',detail:'Teaching tips, common mistakes, and floor-practice details'}
      ],
      lessons:[
        {
          id:'search', title:'Search for the voter',
          lead:'Start with 3 and 3: the first three letters of the voter’s last name and first name. During Early Voting, 4 and 4 may help narrow the countywide results.',
          official:['Start an Election Day name search with the first three letters of the voter’s last name and the first three letters of the first name.','Use the voter information provided to locate the correct record.','Review the result list carefully before selecting a voter.'],
          why:'A rushed search can lead to the wrong record, a missed existing record, or an unnecessary escalation.',
          tips:['Early Voting uses the countywide voter list. Use 3 and 3, or use 4 and 4 to narrow a long result list.','Use alternate search methods when spelling, spacing, or a compound surname may affect the result.'],
          mistakes:['Selecting the first similar name without verifying the record.','Treating a failed first search as proof that the voter is not registered.'],
          actions:[]
        },
        {
          id:'confirm', title:'Confirm the correct voter record',
          lead:'Verify that the record on screen belongs to the person standing in front of you. Ask the voter to state an address or date of birth; date of birth is especially useful for Junior/Senior records.',
          official:['Ask the voter to state information used to confirm the record, such as address or date of birth.','Compare the stated information with the voter record before continuing.'],
          why:'People with identical or similar names may live at the same address or appear next to one another in search results.',
          tips:['Date of birth is especially useful when a parent and adult child, or a Junior and Senior, share a name or address.','Use the information in the record rather than relying on appearance alone.','When something feels inconsistent, pause and verify before moving forward.'],
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
          lead:'Compare the signature’s overall characteristics—not forensic exactness—and distinguish a current mismatch from a No Signature on File flag.',
          official:['Have the voter sign where directed.','Use Sign Again when the current signature needs another attempt.','Contact the Board when the discrepancy remains unresolved.'],
          why:'No Signature on File and a mismatch during the current check-in are different situations and may require different procedures.',
          tips:['Look for general similarities such as first letters, loops, overall shapes, and the way repeated letters are formed.','A missing middle initial alone is not decisive when the first and last names show similar characteristics.','If the voter gives a quick “retail receipt” signature, remind the voter that this is an official election record and offer Sign Again.','When uncertain, ask another poll worker to compare it. Give reasonable benefit of the doubt to the voter, but contact the Board if the discrepancy remains unresolved under the current instructions.'],
          mistakes:['Expecting an exact or forensic match.','Rejecting a signature solely because a middle initial is missing.','Treating every signature issue as provisional.','Ignoring the distinction between a missing stored signature and a current mismatch.'],
          actions:[]
        },
        {
          id:'preload', title:'Confirm the activation card is preloaded',
          lead:'Before completing check-in, physically confirm that one blank activation card is loaded in the ExpressVote printer.',
          official:['Confirm one blank activation card is loaded before every check-in.','When check-in is complete but the card was not preloaded, use Reprint.','Do not check the voter in again.'],
          why:'A missed preload interrupts the voter flow and creates a recovery situation that workers may accidentally handle as a second check-in.',
          tips:['After the initial Print is selected, wait while the lighter-blue Print button is disabled and the center wheel spins. When printing finishes, the button becomes an active-blue Reprint button. If the card was not preloaded, load one and select Reprint before selecting Continue.','If the worker has already selected Continue, use the Re-Print option from the Launchpad menu instead.','Place a small handwritten PRELOAD CARD reminder on or directly in front of the Epson printer.','The authority slip is often the last item removed from the Epson printer, making that location an effective final visual reminder.','Keep blank cards in one consistent location and build the preload check into the transition between voters.'],
          mistakes:['Rushing through Continue and missing the immediate Reprint option.','Completing check-in without physically checking the card slot.','Checking the voter in a second time instead of using Reprint.'],
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
      sources:[
        {type:'official',title:'New Jersey District Board Member Training Manual',detail:'Mail-In Ballot Voter and provisional-ballot sections, manual pages 18 and 27–28',url:'https://www.nj.gov/state/elections/assets/pdf/guidelines/2024/2024-1025-board-worker-training-manual.pdf'},
        {type:'official',title:'Morris County Election Day Poll Worker Manual',detail:'Mail-in ballot processing, manual page 21',url:'https://www.morriscountynj.gov/files/sharedassets/public/v/1/departments/elections/poll-worker-manual.pdf'}
      ],
      warning:'Do not accept a completed mail-in ballot at the polling location.',
      stepIds:['confirm-mail-in-flag','explain-no-regular-ballot','offer-mail-in-choice','direct-returned-mail-in','process-provisionally','box-13-opt-out'],
      steps:['Confirm the Mail-In Ballot flag.','Explain that the voter cannot receive a regular machine ballot.','Explain the voter’s choices: vote provisionally now, or leave to locate and return the mail-in ballot through an authorized drop box or Board location.','If the voter chooses to use the mail-in ballot, direct the voter to an authorized drop box or Board location; do not accept the ballot at the polling location.','If the voter chooses to vote in person, begin the provisional check-in process.','Use Box 13 on the provisional envelope for mail-in opt-out when requested.']
    },
    {
      id:'notfound', title:'Voter Not Found', modes:['early','election'],
      summary:'Stop, search again, use alternate methods, and contact the Board before selecting Voter Not Found.',
      badges:['Same for Both','Critical'],
      sources:[
        {type:'official',title:'Morris County Election Day Poll Worker Manual',detail:'Searching for a voter, manual page 13',url:'https://www.morriscountynj.gov/files/sharedassets/public/v/1/departments/elections/poll-worker-manual.pdf'},
        {type:'morris',title:'Morris County master poll worker training',detail:'Board-escalation emphasis before using Voter Not Found'}
      ],
      warning:'DO NOT EVER SELECT VOTER NOT FOUND WITHOUT EXPRESS BOARD OF ELECTIONS DIRECTION.',
      stepIds:['confirm-spelling','search-again','alternate-search','address-district-lookup','contact-master-board','wait-for-direction'],
      steps:['Confirm spelling.','Search again.','Use alternate search methods.','Use address or district lookup.','Contact the master poll worker or Board.','Do not begin a new check-in unless directed.']
    },
    {
      id:'provisional', title:'Provisional Ballots', modes:['early','election'],
      summary:'Complete the ePollbook process, secure the envelope, tally it, and reconcile the physical count.',
      badges:['Same for Both','Official Procedure'],
      sources:[
        {type:'official',title:'New Jersey District Board Member Training Manual',detail:'Voting by provisional ballot, manual pages 27–28 and closing inventory on page 32',url:'https://www.nj.gov/state/elections/assets/pdf/guidelines/2024/2024-1025-board-worker-training-manual.pdf'},
        {type:'official',title:'New Jersey Early Voting Provisional Ballot Guide',detail:'Early Voting provisional processing and bag controls',url:'https://www.nj.gov/state/elections/assets/pdf/guidelines/2026/2026-0512-nj-guideline-early-voting-provisional-ballot.pdf'},
        {type:'morris',title:'Morris County Election Day Poll Worker Manual and master poll worker training',detail:'County equipment, envelope, tally, two-hour reporting, and bag workflow',url:'https://www.morriscountynj.gov/files/sharedassets/public/v/1/departments/elections/poll-worker-manual.pdf'}
      ],
      stepIds:['confirm-remedy','epollbook-provisional','preload-card','complete-envelope-notices','explain-provisional-machine-process','seal-card-in-envelope','place-in-orange-bag','add-tally','complete-two-hour-check','reconcile-envelope-count','sign-and-seal-bag'],
      steps:['Confirm that provisional voting is the correct remedy.','Complete the ePollbook provisional process.','Confirm a blank activation card is loaded before printing.','Complete the affirmation envelope and required notices.','Before the voter enters the booth, explain the machine process: take the intact provisional envelope and Activation Card into the booth; insert the card; vote normally; select Print and review the printed selections; then select Cast Ballot. The printed provisional ballot card will eject instead of being deposited into the machine canister. Do not detach the perforated Affirmation Statement from the envelope.','Protect the voter’s privacy: before leaving the voting machine or designated private area, have the voter fold the ejected printed ballot card, place it inside the intact provisional envelope, and seal it. If the adhesive requires a firm surface, the voter may bring the folded, concealed ballot card and envelope to a table to finish sealing it. Return the sealed envelope to a poll worker.','Place the sealed envelope in the orange provisional bag.','Add one tally mark to the reconciliation sheet.','At each two-hour check, use the running tally to complete and post the required report sheet. Use this opportunity to recount the provisional envelopes and confirm the physical count matches the tally.','At closing, physically count envelopes and compare with the tally sheet.','Obtain required signatures and seal through both grommet and zipper hole.']
    },
    {
      id:'reprint', title:'Reprint', modes:['early','election'],
      summary:'Recover an item from a completed check-in without checking the voter in again.',
      badges:['Same for Both','Current Morris Update'],
      sources:[
        {type:'official',title:'Morris County Election Day Poll Worker Manual',detail:'Re-Printing a Ballot or Authority Slip, manual pages 25–26',url:'https://www.morriscountynj.gov/files/sharedassets/public/v/1/departments/elections/poll-worker-manual.pdf'},
        {type:'morris',title:'Morris County master poll worker training and trainer experience',detail:'Immediate on-screen Reprint shortcut before Continue'},
        {type:'pending',title:'Printer-defective activation-card classification',detail:'Reprint versus spoil disposition and incident-report handling still require confirmation'}
      ],
      warning:'Do not check the voter in again.',
      stepIds:['confirm-checkin-complete','identify-missing-item','use-reprint','open-menu-reprint','search-reprint-voter','confirm-printer','resume-workflow'],
      steps:['Confirm that check-in is already complete.','Identify the missing or damaged printed item.','If the completion screen is still open, wait for the spinning wheel to stop and for the lighter-blue Print button to become an active-blue Reprint button. Load a blank Activation Card if needed and select Reprint before selecting Continue.','If the worker has already advanced, select Process Next Voter to return to the Launchpad, open the hamburger menu in the upper-right corner, and select Re-Print.','Search using 3 and 3, select the correct voter so the record is highlighted, and select the green Re-Print button.','For an Activation Card, confirm the correct ExpressVote printer contains a blank card and select ExpressVote. For an Authority Slip, select Voting Authority Slip.','When the replacement finishes printing, select Continue and then Home to return to the Launchpad.']
    },
    {
      id:'spoil', title:'Spoil a Ballot', modes:['early','election'],
      summary:'Cancel the uncast ballot, eject the card, process the spoil, and decide whether to reissue.',
      badges:['Early Voting / Election Day Difference','Current Morris Update'],
      sources:[
        {type:'official',title:'Morris County Election Day Poll Worker Manual',detail:'Spoiling a Ballot Procedures, manual pages 47–53',url:'https://www.morriscountynj.gov/files/sharedassets/public/v/1/departments/elections/poll-worker-manual.pdf'},
        {type:'morris',title:'Morris County master poll worker training and trainer experience',detail:'Early Voting versus Election Day routing and floor practice'}
      ],
      stepIds:['voter-selects-cancel','two-workers-respond','protect-privacy','cancel-and-eject','early-site-station','election-district-table','ask-about-reissue','preload-for-reissue','no-second-checkin','explain-return-option','mark-and-bag-spoiled-card'],
      steps:['At the machine, have the voter select Cancel.','Send two workers from different parties to the machine.','Protect voter privacy during the administrative screen.','Use the voter-choice cancellation reason and eject the card.','During early voting, process the spoil at any appropriate site station.','On Election Day, return the voter to the assigned district table.','Ask whether the voter wants another ballot now.','For reissue, preload a blank activation card before printing.','For no reissue, do not create another check-in.','If the voter declines an immediate replacement, explain that the voter remains active and may return during the remaining Early Voting period or to the voter’s assigned polling location and district on Election Day.','Cross out the barcode, fold to the barcode, write SPOILED, and place the card in the green bag.']
    }
  ],
  dosDonts:{
    dos:[
      {text:'Follow the current screen and secured binder instructions in order.',detail:'Stop when a screen, seal, report, number, or physical setup differs from expectations.',tags:['Official Procedure','Same for Both']},
      {text:'Confirm the correct voter record before continuing.',detail:'Use voter-stated information such as address or date of birth to distinguish similar records.',tags:['Official Procedure','Check-In']},
      {text:'Review every voter flag and follow the specific remedy.',detail:'Different flags can lead to different outcomes; do not treat them as interchangeable.',tags:['Official Procedure','Check-In']},
      {text:'Confirm one blank activation card is loaded before completing check-in.',detail:'A missing preload is recovered through Reprint after check-in is complete.',tags:['Current Morris Update','Check-In']},
      {text:'Stop and ask the master poll worker or Board before improvising.',detail:'Escalation is safer than creating a duplicate record or using the wrong ballot process.',tags:['Official Procedure','Same for Both']}
    ],
    donts:[
      {text:'Do not ask every voter for identification.',detail:'Request identification only when the voter record shows Voter ID Required.',tags:['Official Do Not','Check-In']},
      {text:'Do not select Voter Not Found without express Board direction.',detail:'Continue searching and escalate before beginning any new-record process.',tags:['Critical','Same for Both']},
      {text:'Do not check a voter in a second time to recover a missing printout.',detail:'Use Reprint when the original check-in is already complete.',tags:['Current Morris Update','Reprint']},
      {text:'Do not confuse Reprint with Spoil.',detail:'Reprint recovers a missing printed item; Spoil cancels an uncast ballot card.',tags:['Current Morris Update','Same for Both']},
      {text:'Do not select Close Poll during an intermediate early-voting night.',detail:'Use the secured nightly shutdown path in the current binder.',tags:['Critical','Early Voting']}
    ]
  },
  currentLinks:[
    {title:'Morris County Elections',url:'https://www.morriscountynj.gov/Departments/Elections'},
    {title:'New Jersey Division of Elections',url:'https://www.nj.gov/state/elections/'},
    {title:'New Jersey Election Law — Title 19',url:'https://lis.njleg.state.nj.us/nxt/gateway.dll?f=templates&fn=default.htm&vid=Publish:10.1048/Enu'}
  ]
};
