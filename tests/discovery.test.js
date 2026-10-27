function runDiscoveryTests(){
  const key='kadr-html-safety-v1';delete memory[key];
  assert(!SafetyStore.blocked(2),'default not blocked');
  assert(!SafetyStore.block(0,true)&&!SafetyStore.block(-1,true),'cannot block self or invalid ID');
  assert(SafetyStore.block(2,true)&&SafetyStore.blocked('2'),'block persisted');
  assert(SafetyStore.block(2,true)&&SafetyStore.snapshot().data.blocked.length===1,'block idempotent');
  const casting={id:'author-test',authorId:2,date:'2030-01-01',role:'Model'};
  assert(filterCastings([casting],{scope:'all'}).length===0,'blocked known author hidden');
  assert(filterCastings([{...casting,authorId:null}],{scope:'all'}).length===1,'unknown author never inferred by name');
  assert(SafetyStore.report('message','2:time:0','abuse','A local draft','Original message'),'message draft');
  assert(SafetyStore.report('casting','a','spam','A local draft'),'casting draft');
  assert(!SafetyStore.report('unknown','a','spam','Text'),'bad target type rejected');
  assert(!SafetyStore.report('profile','2','spam','  '),'empty details rejected');
  assert(SafetyStore.snapshot().data.reports.every(r=>r.status==='draft'),'never claims moderation delivery');
  assert(SafetyStore.block(2,false)&&!SafetyStore.blocked(2),'unblock');
  const raw=memory[key];storageFails=true;assert(!SafetyStore.block(3,true)&&memory[key]===raw,'quota preserves blocks');storageFails=false;
  memory[key]='{broken';assert(SafetyStore.snapshot().error&&!SafetyStore.block(3,true),'corruption blocks write');assert(memory[key]==='{broken','bad JSON retained');memory[key]=raw;
  const stats=localStatistics([{status:'completed',sentAt:1},{status:'draft',sentAt:0}],[{responses:[{personId:0},{personId:3}]},{demo:true,responses:[{personId:0}]}],[1,1,2]);
  assert(stats.completed===1&&stats.sent===1&&stats.responses===1&&stats.saved===2,'honest derived counts');
  const items=[{city:'A',type:'studio',price:100,name:'Light',equipment:'Flash'},{city:'B',type:'outdoor',price:0,name:'Park',equipment:'Natural'}];
  assert(filterLocations(items,{query:'flash',city:'A',type:'studio',budget:'100'}).length===1,'combined location filters');
  assert(filterLocations(items,{budget:'0'})[0].name==='Park','zero budget filter');
  assert(filterLocations(items,{query:'Missing'}).length===0,'empty search result');
}
