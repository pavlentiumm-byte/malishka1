function runAvailabilityTests() {
  delete memory[availabilityKey];memory['kadr-html-availability']=JSON.stringify(['2026-11-01','bad']);
  let snapshot=availabilitySnapshot();
  assert(snapshot.days['2026-11-01']==='free'&&snapshot.visibility==='private','legacy dates preserved, private default');
  assert(!validAvailabilityDate('2027-02-30')&&validAvailabilityDate('2028-02-29'),'strict dates');
  assert(saveAvailability(snapshot,{...snapshot.days,'2026-11-02':'busy','2026-11-03':'tentative'},'free'),'save availability');
  snapshot=availabilitySnapshot();
  assert(snapshot.days['2026-11-03']==='tentative','reload persisted status');
  let projected=availabilityProjection(snapshot,['2026-11-01'],false);
  assert(Object.keys(projected).length===0,'free-only projection excludes confirmed, busy and tentative');
  projected=availabilityProjection({...snapshot,visibility:'statuses'},['2026-11-01']);
  assert(projected['2026-11-01']==='confirmed'&&projected['2026-11-02']==='busy','confirmed priority and statuses');
  assert(Object.keys(availabilityProjection({...snapshot,visibility:'private'},['2026-11-01'])).length===0,'private hides everything');
  assert(availabilityProjection(snapshot,[],true)['2026-11-01']==='free','cancellation restores manual free status');
  assert(saveAvailability(snapshot,snapshot.days,'statuses'),'visibility change');
  assert(!saveAvailability(snapshot,{},'private'),'stale form rejected');
  snapshot=availabilitySnapshot();const original=memory[availabilityKey];storageFails=true;
  assert(!saveAvailability(snapshot,{},'private')&&memory[availabilityKey]===original,'quota preserves days');storageFails=false;
  memory[availabilityKey]='{broken';snapshot=availabilitySnapshot();assert(snapshot.error&&!saveAvailability(snapshot,{},'private'),'corrupt storage blocks writes');
  assert(memory[availabilityKey]==='{broken','corrupt data preserved');memory[availabilityKey]=original;
  assert(JSON.parse(memory['kadr-html-availability'])[0]==='2026-11-01','legacy key untouched');
}
