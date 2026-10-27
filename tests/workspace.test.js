function runCreativeTests(){
  const key='kadr-html-creative-v1';delete memory[key];
  const team={id:'t1',name:'Team',members:[{id:2,name:'Member',role:'Model'}],items:[]};
  let result=CreativeStore.put('teams',team);assert(result.record.rev===1,'new team saved');
  assert(CreativeStore.list('teams')[0].members[0].role==='Model','role restored');
  assert(CreativeStore.put('teams',{...team,name:'Stale'},null).error==='conflict','duplicate creation blocked');
  result=CreativeStore.put('teams',{...team,name:'Changed'},1);assert(result.record.rev===2,'edit versioned');
  assert(CreativeStore.put('teams',{...team,name:'Old'},1).error==='conflict','stale edit blocked');
  const group={id:'g1',name:'Group',members:team.members,projectId:'shoot-1',items:[{id:'m1',text:'Hello',at:123,authorId:0}]};
  assert(CreativeStore.put('groups',group).record,'group created');
  assert(CreativeStore.list('groups')[0].items[0].text==='Hello','messages restored');
  const board={id:'b1',name:'Board',members:[],projectId:'shoot-1',items:[{id:'a',url:'https://example.com',comment:'First'},{id:'b',comment:'Second'}]};
  assert(CreativeStore.put('boards',board).record,'board created');
  let moved=CreativeStore.move(CreativeStore.list('boards')[0],'b',-1);assert(moved.items[0].id==='b'&&board.items[0].id==='a','reordering immutable');
  assert(CreativeStore.put('boards',moved,1).record,'order saved');assert(CreativeStore.list('boards')[0].items[1].comment==='First','comments retained');
  const raw=memory[key];storageFails=true;assert(CreativeStore.put('teams',{...team,name:'Lost'},2).error,'quota reports failure');assert(memory[key]===raw,'quota preserves everything');storageFails=false;
  assert(!CreativeStore.remove('teams','t1',1),'stale deletion rejected');assert(CreativeStore.remove('teams','t1',2),'delete');assert(CreativeStore.list('groups').length===1,'team deletion preserves group');
  memory[key]='{broken';assert(CreativeStore.snapshot().error,'corruption exposed');assert(CreativeStore.put('teams',team).error,'corruption blocks write');assert(memory[key]==='{broken','corruption preserved');
  memory[key]=JSON.stringify({version:1,teams:[{...team,rev:1,members:[null]}],groups:[],boards:[]});assert(CreativeStore.snapshot().error,'bad nested data rejected');memory[key]=raw;
}
