function runProfileWorkTests(){
  const key='kadr-html-profile-work-v1';delete memory[key];
  const project={id:'finished',title:'Shoot',status:'completed',participants:[{id:0},{id:2},{id:3}]};
  assert(ProfileWorkStore.review({...project,status:'confirmed'},2,5,'Text').error==='ineligible','unfinished shoot rejected');
  assert(ProfileWorkStore.review(project,4,5,'Text').error==='ineligible','outsider rejected');
  assert(ProfileWorkStore.review(project,0,5,'Text').error==='ineligible','self review rejected');
  assert(ProfileWorkStore.review({...project,participants:[{id:2}]},2,5,'Text').error==='ineligible','author must participate');
  for(const score of [0,6,2.5])assert(ProfileWorkStore.review(project,2,score,'Text').error==='invalid','invalid rating rejected');
  assert(ProfileWorkStore.review(project,2,5,' ').error==='invalid','blank comment rejected');
  let result=ProfileWorkStore.review(project,2,4,'Local feedback');assert(result.record.demo&&result.record.authorId===0,'explicit local author and demo flag');
  assert(ProfileWorkStore.review(project,2,5,'Again').error==='duplicate','duplicate blocked');
  assert(ProfileWorkStore.review(project,3,5,'Another member').record,'different participant allowed');
  assert(ProfileWorkStore.report(result.record.id,'spam'),'report draft stored');
  assert(ProfileWorkStore.snapshot().data.reports[0].status==='draft','no fake moderation submission');
  const metadata={concept:'Story',date:'2026-10-27',genre:'Portrait',rights:'Ask first',members:[{id:2,role:'Model',confirmation:'unconfirmed'}]};
  assert(ProfileWorkStore.metadata('old-project',metadata,'null'),'metadata saved for old project');
  assert(ProfileWorkStore.snapshot().data.projects['old-project'].concept==='Story','metadata reload');
  assert(!ProfileWorkStore.metadata('old-project',{...metadata,concept:'Stale'},'null'),'stale metadata rejected');
  assert(ProfileWorkStore.requestVerification('professional'),'local request saved');
  assert(ProfileWorkStore.snapshot().data.verification.status==='local-request','never verified or genuinely pending');
  assert(!ProfileWorkStore.requestVerification('verified'),'cannot self verify');
  const raw=memory[key];storageFails=true;assert(!ProfileWorkStore.requestVerification('identity'),'quota failure returned');assert(memory[key]===raw,'quota preserves existing records');storageFails=false;
  memory[key]='{broken';assert(ProfileWorkStore.snapshot().error,'bad JSON exposed');assert(!ProfileWorkStore.requestVerification('identity'),'corruption blocks write');assert(memory[key]==='{broken','corruption preserved');memory[key]=raw;
}
