
/* ---------- language and formatting ---------- */
/* Language: the choice saved in Settings, else the first device language that is Italian or English, else English.
   Stored data never depends on it: categories and generated notes keep their original (Italian) wording as keys
   and are translated only when shown (catName, mDisp, gen, dmn). */
const LSL='gruzzolo.lang';
let nf2,nf0,nfi,dfS,dfL,dfM,dfMY,dfMs,dfW;
const dfMYit=new Intl.DateTimeFormat('it-IT',{month:'long',year:'numeric'}),IT_M=Array.from({length:12},(_,i)=>new Intl.DateTimeFormat('it-IT',{month:'long'}).format(new Date(2024,i,1,12)));
function langPref(){try{const v=localStorage.getItem(LSL);return v==='en'||v==='it'?v:''}catch(e){return ''}}
function langAuto(){const l=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language];
  for(const x of l){const m=/^(it|en)(?![a-z])/i.exec(String(x||''));if(m)return m[1].toLowerCase()}return 'en'}
function applyLang(){
  setLang(langPref()||langAuto());const l=LANG==='it'?'it-IT':'en-GB';document.documentElement.lang=LANG;
  nf2=new Intl.NumberFormat(l,{style:'currency',currency:'EUR',useGrouping:true});
  nf0=new Intl.NumberFormat(l,{style:'currency',currency:'EUR',maximumFractionDigits:0,useGrouping:true});
  nfi=new Intl.NumberFormat(l,{useGrouping:true});
  dfS=new Intl.DateTimeFormat(l,{day:'numeric',month:'short'});
  dfL=new Intl.DateTimeFormat(l,{day:'numeric',month:'short',year:'numeric'});
  dfM=new Intl.DateTimeFormat(l,{month:'long'});
  dfMY=new Intl.DateTimeFormat(l,{month:'long',year:'numeric'});
  dfMs=new Intl.DateTimeFormat(l,{month:'short',year:'numeric'});
  dfW=new Intl.DateTimeFormat(l,{weekday:'long',day:'numeric',month:'short'})}
function langSave(v){try{if(v==='en'||v==='it')localStorage.setItem(LSL,v);else localStorage.removeItem(LSL)}catch(e){}applyLang()}
const eur=c=>(c%100===0?nf0:nf2).format(c/100);
const TODAY=()=>ymd(new Date());
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
/* typed amounts: Italian reads 1.500,50; English reads 1,500.50 and also accepts a decimal comma (12,99) */
function money(v){let s=String(v==null?'':v).replace(/\s|€/g,'');
  if(LANG==='it')s=s.replace(/\.(?=\d{3}(\D|$))/g,'').replace(',','.');
  else s=s.indexOf('.')<0&&!/^\d{1,3}(,\d{3})+$/.test(s)?s.replace(',','.'):s.replace(/,/g,'');
  const n=parseFloat(s);if(!isFinite(n)||n<=0||n>1e7)return 0;return Math.round(n*100)}
const inp=c=>c?(LANG==='it'?String(c/100).replace('.',','):String(c/100)):'';
const U=()=>tr(S.set.r==='m'?'unitM':'unitW');
function pLabel(k,r){if(r==='m')return cap(dfMY.format(pd(k)));return pd(k).getDate()+'–'+dfS.format(pd(pEnd(k,r)))}
const mLabel=ym=>cap(dfMY.format(pd(ym+'-01')));
const mLow=ym=>LANG==='it'?mLabel(ym).toLowerCase():mLabel(ym);
const mChip=ym=>LANG==='it'?cap(dfM.format(pd(ym+'-01')))+' '+ym.slice(2,4):dfMs.format(pd(ym+'-01'));
/* display names: a category or a generated merchant name is stored in Italian and looked up here; anything unknown is shown as stored */
const look=(k,s)=>{const m=tr(k);return Object.prototype.hasOwnProperty.call(m,s)?m[s]:s};
const catName=c=>look('cats',c);
const catKey=c=>{if(LANG!=='it'){const m=tr('cats'),l=c.toLowerCase();for(const k in m)if(m[k].toLowerCase()===l)return k}return c};
const dmn=s=>S.demo?look('demo',s):s;
const mDisp=n=>look('names',dmn(n));
/* notes written by the app itself (statement import, cap remainder, example data) */
function gen(n){
  if(LANG==='it'||!n)return n;let m;
  if(S.demo&&dmn(n)!==n)return dmn(n);
  if((m=/^Saldo iniziale dello Spazio (.+)$/.exec(n)))return tr('noteOpen',m[1]);
  if((m=/^Dividi le spese( \(\d+%\))?$/.exec(n)))return tr('noteSplit')+(m[1]||'');
  if(n==='Verso il conto principale')return tr('noteToMain');
  if((m=/^Arrotondamenti \((\d+)\)$/.exec(n)))return tr('noteRound',m[1]);
  if((m=/^Resto del tetto (.+), (\S+) (\d{4})$/.exec(n))&&IT_M.indexOf(m[2])>=0)return tr('noteCapRest',catName(m[1]),mLow(m[3]+'-'+pad(IT_M.indexOf(m[2])+1)));
  return n}
const ACC={n26:'N26',revolut:'Revolut'};
const NATIVE=!!window.GruzzoloNative;

const IC={
  home:'<path d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4v-5h-6v5H5a1 1 0 0 1-1-1z"/>',
  bars:'<path d="M5 20V11M12 20V4M19 20v-6"/>',
  target:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.5"/>',
  medal:'<circle cx="12" cy="14.5" r="5.5"/><path d="M8.5 9.8 6 3h4l2 4 2-4h4l-2.5 6.8"/>',
  chat:'<path d="M7.5 4h9A2.5 2.5 0 0 1 19 6.5v6a2.5 2.5 0 0 1-2.5 2.5H12l-4.5 4v-4A2.5 2.5 0 0 1 5 12.5v-6A2.5 2.5 0 0 1 7.5 4z"/>',
  tune:'<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  close:'<path d="M6 6l12 12M18 6 6 18"/>',
  flame:'<path d="M12 3c1 3.5 5.5 5.5 5.5 10.5a5.5 5.5 0 0 1-11 0c0-2 1-3.3 2-4.3.2 1.8 1 2.8 2 2.8.2-3-.8-5 1.5-9z"/>',
  shield:'<path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z"/>',
  check:'<path d="M5 12.5 10 17l9-10"/>',
  warn:'<path d="M12 4 3 19h18z"/><path d="M12 10v4M12 16.6v.2"/>',
  clock:'<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
  trend:'<path d="M4 16l5-5 4 4 7-8"/><path d="M15 7h5v5"/>',
  repeat:'<path d="M5 10a6 6 0 0 1 6-5h5l-2.5-2.5M16 5l-2.5 2.5M19 14a6 6 0 0 1-6 5H8l2.5 2.5M8 19l2.5-2.5"/>',
  grid:'<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
  cal:'<rect x="4" y="5.5" width="16" height="14.5" rx="3"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>',
  coins:'<ellipse cx="12" cy="7" rx="7" ry="3"/><path d="M5 7v5c0 1.7 3.1 3 7 3s7-1.3 7-3V7M5 12v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5"/>',
  wallet:'<rect x="3.5" y="6" width="17" height="13" rx="3"/><path d="M3.5 10.5h17M15.5 15h1.5"/>',
  bagoff:'<path d="M6 8h12l-1 11.5H7zM9 8a3 3 0 0 1 6 0M4 4l16 17"/>',
  auto:'<path d="M19 12a7 7 0 0 1-12.5 4.3M5 12a7 7 0 0 1 12.5-4.3"/><path d="M17.5 3.5v4.2h-4.2M6.5 20.5v-4.2h4.2"/>',
  star:'<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.8z"/>',
  restart:'<path d="M5 12a7 7 0 1 0 2.2-5.1"/><path d="M5 4v4h4"/>',
  cut:'<circle cx="6.5" cy="7" r="2.5"/><circle cx="6.5" cy="17" r="2.5"/><path d="M8.6 8.4 20 17M8.6 15.6 20 7"/>',
  lock:'<rect x="5" y="10.5" width="14" height="9.5" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
  upload:'<path d="M12 15V4M7.5 8.5 12 4l4.5 4.5M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3"/>',
  inn:'<path d="M17 7 7 17M7 9v8h8"/>',
  out:'<path d="M7 17 17 7M9 7h8v8"/>',
  list:'<path d="M5 7h14M5 12h14M5 17h9"/>',
  spark:'<path d="M12 4l1.8 4.7 4.7 1.8-4.7 1.8L12 17l-1.8-4.7-4.7-1.8 4.7-1.8z"/><path d="M18.5 16v3M17 17.5h3"/>',
  send:'<path d="M5 12 19 5l-5 14-3-6z"/>',
  bolt:'<path d="M13 3 5 13.5h6L10 21l8-10.5h-6z"/>',
  flag:'<path d="M6 21V4M6 5h11l-2.5 4L17 13H6"/>',
  tag:'<path d="M4 12V5a1 1 0 0 1 1-1h7l8 8-8 8z"/><circle cx="8.5" cy="8.5" r="1.3"/>',
  hour:'<path d="M7 4h10M7 20h10M8 4c0 4 8 4 8 8s-8 4-8 8M16 4c0 4-8 4-8 8s8 4 8 8"/>',
  stop:'<rect x="7" y="7" width="10" height="10" rx="2.5"/>',
  back:'<path d="M15 6l-6 6 6 6"/>',
  chev:'<path d="M9 6l6 6-6 6"/>'
};
const ic=(n,s)=>`<svg class="ic" width="${s||22}" height="${s||22}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]||IC.star}</svg>`;
const SCALLOP=(()=>{let d='';for(let i=0;i<180;i++){const a=i/180*2*Math.PI,r=45+3.5*Math.cos(10*a);d+=(i?'L':'M')+(50+r*Math.cos(a)).toFixed(1)+' '+(50+r*Math.sin(a)).toFixed(1)}return d+'Z'})();
const medal=(cls,icon,size)=>`<span class="medal ${cls}" style="--sz:${size||64}px"><svg class="sc" viewBox="0 0 100 100" aria-hidden="true"><path d="${SCALLOP}"/></svg>${ic(icon,Math.round((size||64)*.46))}</span>`;
const mval=(m,v)=>m.money?eur(v*100):nfi.format(v);
function mascot(mood,size){
  const eyes=mood==='calm'?'<path d="M41 68q5.5 4.5 11 0M68 68q5.5 4.5 11 0" fill="none" stroke="var(--m-ink)" stroke-width="3" stroke-linecap="round"/>'
    :'<circle cx="47" cy="68" r="4.4" fill="var(--m-ink)"/><circle cx="73" cy="68" r="4.4" fill="var(--m-ink)"/>'+(mood==='worry'?'<path d="M40 59l10 3.5M80 59l-10 3.5" fill="none" stroke="var(--m-ink)" stroke-width="3" stroke-linecap="round"/>':'');
  const mouth=mood==='party'?'<path d="M50 79q10 13 20 0z" fill="var(--m-ink)"/>':mood==='worry'?'<path d="M52 85q8-6 16 0" fill="none" stroke="var(--m-ink)" stroke-width="3" stroke-linecap="round"/>'
    :mood==='calm'?'<path d="M54 81q6 4 12 0" fill="none" stroke="var(--m-ink)" stroke-width="3" stroke-linecap="round"/>':'<path d="M51 80q9 8 18 0" fill="none" stroke="var(--m-ink)" stroke-width="3" stroke-linecap="round"/>';
  return `<svg class="masc" width="${size}" height="${size}" viewBox="0 0 120 120" aria-hidden="true"><ellipse cx="60" cy="109" rx="28" ry="4.5" fill="var(--m-ink)" opacity=".18"/><g class="bob"><path d="M43 21c5-6 11-3 17 1 6-4 12-7 17-1-2 6-6 10-9 13H52c-3-3-7-7-9-13z" fill="var(--m2)"/><path d="M60 31c-21 6-39 30-39 50 0 18 17 26 39 26s39-8 39-26c0-20-18-44-39-50z" fill="var(--m1)"/><rect x="47" y="30" width="26" height="8" rx="4" fill="var(--m3)"/><circle cx="37" cy="78" r="5" fill="var(--m3)" opacity=".32"/><circle cx="83" cy="78" r="5" fill="var(--m3)" opacity=".32"/>${eyes}${mouth}</g></svg>`}
const tf=(id,name,label,attrs,help)=>`<div class="tf"><label for="${id}">${label}</label><input id="${id}" name="${name}" autocomplete="off" ${attrs||''}>${help?`<span class="help" id="${id}-help">${help}</span>`:''}</div>`;
const sel=(id,name,label,opts)=>`<div class="tf"><label for="${id}">${label}</label><select id="${id}" name="${name}">${opts}</select></div>`;
const segm=(pre,r)=>`<div class="segm" role="radiogroup" aria-label="${tr('howOften')}"><label><input class="sr" type="radio" name="r" value="w" id="${pre}-rw" ${r==='w'?'checked':''}><span>${tr('everyWeek')}</span></label><label><input class="sr" type="radio" name="r" value="m" id="${pre}-rm" ${r==='m'?'checked':''}><span>${tr('everyMonth')}</span></label></div>`;
const sw=(id,name,title,text,on)=>`<label class="switch"><span><span class="t-s">${title}</span><br><span class="b-s v">${text}</span></span><input class="sr" type="checkbox" name="${name}" id="${id}" ${on?'checked':''}><span class="track"></span></label>`;

/* ---------- state and storage ---------- */
let S=blank(),TX={},lastJson='',ref=null,writing=false,dirty=false,tm=null,SAMPLE=null,txSeen=false;
const store={mode:'boot',ready:false,err:null};
const ui={tab:'oggi',ym:null,seg:'med'};
const chat={turns:[],busy:false,live:'',note:'',ctl:null,tools:false,draft:''};
const LS='gruzzolo.v1',LST='gruzzolo.tx.v1',LSC='gruzzolo.chat.v1';
const TABS=[['oggi','home'],['spese','bars'],['obiettivi','target'],['premi','medal'],['coach','chat']];
const TITLES={oggi:1,spese:1,obiettivi:1,premi:1,coach:1,registro:1};
if(NATIVE){TABS.pop();delete TITLES.coach}
function cache(){try{localStorage.setItem(LS,lastJson)}catch(e){}}
function txCache(){try{localStorage.setItem(LST,JSON.stringify(TX))}catch(e){}}
function loadCache(){try{const j=localStorage.getItem(LS);if(j){S=normalize(JSON.parse(j));lastJson=JSON.stringify(S)}}catch(e){}
  try{const t=JSON.parse(localStorage.getItem(LST)||'null');if(t&&typeof t==='object')TX=t}catch(e){}
  try{const c=JSON.parse(localStorage.getItem(LSC)||'null');if(Array.isArray(c))chat.turns=c}catch(e){}}
function hasData(st){return st.goals.length>0||st.ev.length>0||st.demo}
const curT=()=>S.demo?demoTx():TX;
function commit(){lastJson=JSON.stringify(S);cache();render();if(store.mode==='db'){dirty=true;clearTimeout(tm);tm=setTimeout(flush,350)}}
async function flush(retry){
  if(writing||!dirty||!ref)return;writing=true;dirty=false;const body=JSON.parse(lastJson);
  try{await ref.set(body);store.err=null}
  catch(e){const code=e&&e.code;
    if((code==='unavailable'||!code)&&!retry){writing=false;dirty=true;setTimeout(()=>flush(true),900+Math.random()*900);return}
    store.err=code||'unavailable';if(code==='invalid_argument'||code==='revoked'||code==='not_granted'||code==='capability_disabled')store.mode='local'}
  writing=false;if(dirty&&store.mode==='db')flush()}
function onSnap(snap){
  const meta=snap.metadata||{};if(meta.hasPendingWrites||writing||dirty)return;
  if(snap.exists){const d=snap.data();if(d&&d.v){const j=JSON.stringify(normalize(JSON.parse(JSON.stringify(d))));if(j!==lastJson){S=JSON.parse(j);lastJson=j;cache();render()}}store.ready=true}
  else{if(meta.fromCache)return;store.ready=true;if(hasData(S)){dirty=true;flush()}}}
function onTxSnap(snap){
  const meta=snap.metadata||{};if(meta.fromCache&&snap.empty)return;
  const next={};snap.docs.forEach(d=>{const x=d.data();if(x&&Array.isArray(x.rows))next[d.id]=JSON.parse(JSON.stringify(x))});
  if(!txSeen&&!meta.fromCache){txSeen=true;for(const id in TX)if(!next[id]){next[id]=TX[id];txWrite(id,TX[id])}}
  TX=next;txCache();render()}
function txWrite(id,body){if(store.mode==='db'&&ref)ref.collection('tx').doc(id).set(body).catch(e=>{store.err=(e&&e.code)||'unavailable'})}
function txSave(id,body){TX[id]=body;txCache();txWrite(id,body)}
function txDel(id){delete TX[id];txCache();if(store.mode==='db'&&ref)ref.collection('tx').doc(id).delete().catch(()=>{})}
function useLocal(){store.mode='local';store.ready=true}
async function boot(){
  const h=(location.hash||'').slice(1);if(TITLES[h])ui.tab=h;
  else{try{const t=localStorage.getItem('gruzzolo.tab');if(t&&TITLES[t])ui.tab=t}catch(e){}}
  applyLang();loadCache();render();
  let db=null,user=null,id=null;
  try{if(window.claude&&window.claude.use){
    window.claude.use('sample').then(f=>{SAMPLE=f||null;if(SAMPLE&&SAMPLE.limits)SAMPLE.limits().then(l=>{chat.tools=!!(l&&l.tools)}).catch(()=>{});if(ui.tab==='coach')render()}).catch(()=>{});
    const r=await Promise.all([window.claude.use('db'),window.claude.use('user')]);db=r[0];user=r[1]}}catch(e){}
  try{id=user?await user.id():null}catch(e){}
  if(db&&id){try{ref=db.doc('data/users/'+id+'/gruzzolo');store.mode='db';ref.onSnapshot(onSnap,()=>{useLocal();store.err='unavailable'});
    ref.collection('tx').onSnapshot(onTxSnap,()=>{});setTimeout(()=>{store.ready=true},8000)}catch(e){useLocal()}}
  else useLocal()}

/* mode: undefined = toast with points, 'quiet' = no toast, 'silent' = no reward feedback at all */
function mutate(fn,mode){
  const t=TODAY(),T=curT(),b=score(S,t,T),bm=medals(S,b);fn(S);
  for(const g of S.goals)if(!g.done&&g.t>0&&goalSaved(S,g.id)>=g.t)g.done=t;
  const a=score(S,t,T),am=medals(S,a),up=am.filter((m,i)=>bm[i]&&m.tier>bm[i].tier),lvl=a.lv>b.lv?a:null;
  if(up.length){S.won=S.won||{};for(const m of up){const from=bm[am.indexOf(m)].tier,w=S.won[m.id]||(S.won[m.id]=[null,null,null]);for(let k=from;k<m.tier;k++)w[k]=t}if(S.pin&&!am.some(m=>m.id===S.pin&&m.next))S.pin=null}
  commit();if(mode==='silent')return;
  if(up.length||lvl)setTimeout(()=>celebrate(up,lvl,a.xp-b.xp),320);
  else if(!mode&&a.xp>b.xp)toast(tr('plusPts',a.xp-b.xp))}
let toastT=null;
function toast(msg){const t=$('toast');t.textContent=msg;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>{t.hidden=true},3400)}
const cdlg=$('cele');
/* ---------- shell ---------- */
function renderTabs(){$('tabs').innerHTML=TABS.map(t=>`<button class="tab" data-act="tab" data-id="${t[0]}" ${ui.tab===t[0]?'aria-current="page"':''}>${ic(t[1],24)}${tr('tabs')[t[0]]}</button>`).join('')}
function render(){
  const v=$('view'),empty=!hasData(S);
  document.querySelector('.tabs').hidden=empty;
  document.querySelector('.tabs').setAttribute('aria-label',tr('navSections'));
  $('ttl').textContent=empty?'Gruzzolo':tr('tabs')[TITLES[ui.tab]?ui.tab:'oggi'];
  $('tbtn').innerHTML=empty?'':(ui.tab==='registro'?`<button class="roundbtn st" data-act="tab" data-id="oggi" aria-label="${tr('backToday')}">${ic('close')}</button>`
    :(ui.tab==='spese'?`<button class="roundbtn st" data-act="importPick" aria-label="${tr('importStmt')}">${ic('upload')}</button>`:'')+`<button class="roundbtn st" data-act="settings" aria-label="${tr('settings')}">${ic('tune')}</button>`);
  if(empty){v.innerHTML=viewStart();return}
  const sc=score(S,TODAY(),curT()),M=medals(S,sc);
  v.innerHTML=(S.demo?demoBanner():'')+({oggi:viewOggi,spese:viewSpese,obiettivi:viewGoals,premi:viewPremi,coach:viewCoach,registro:viewRegistro}[ui.tab]||viewOggi)(sc,M)+storeNote();
  renderTabs()}
function demoBanner(){return `<section class="card soft-s"><div class="row"><p class="b-s" style="flex:1 1 200px">${tr('demoNote')}</p><button class="btn sm dark st" data-act="wipeDemo">${tr('demoClear')}</button></div></section>`}
function storeNote(){
  if(NATIVE)return '';
  if(store.mode==='local')return `<p class="b-xs v" style="text-align:center">${tr('localOnly',store.err?tr('localErr'):'')}</p>`;
  if(store.err)return `<p class="b-xs v" style="text-align:center">${tr('saveFailed')}</p>`;return ''}

function viewStart(){
  const nm=medals(blank(),score(blank(),TODAY())).length;
  return `<section class="hero"><div class="hero-top">${mascot('happy',104)}<div><h2 class="t-l">${tr('startHead')}</h2></div></div>
    <p class="b-s v">${tr('startIntro')}</p></section>
  <section class="card"><div class="list">
    <div class="li"><span class="lead g">${ic('bolt')}</span><div class="li-t"><div class="t-s">${tr('start1')}</div><div class="b-s v">${tr('start1d')}</div></div></div>
    <div class="li"><span class="lead s">${ic('bars')}</span><div class="li-t"><div class="t-s">${tr('start2')}</div><div class="b-s v">${tr('start2d')}</div></div></div>
    <div class="li"><span class="lead y">${ic('medal')}</span><div class="li-t"><div class="t-s">${tr('start3',nm)}</div><div class="b-s v">${tr('start3d')}</div></div></div>
    ${NATIVE?`<div class="li"><span class="lead c">${ic('lock')}</span><div class="li-t"><div class="t-s">${tr('start4')}</div><div class="b-s v">${tr('start4d')}</div></div></div>`:`<div class="li"><span class="lead c">${ic('chat')}</span><div class="li-t"><div class="t-s">${tr('start5')}</div><div class="b-s v">${tr('start5d')}</div></div></div>`}
  </div></section>
  <form class="card" id="ob" novalidate>
    <h2 class="t-m">${tr('firstGoal')}</h2>
    ${tf('ob-name','name',tr('goalName'),'maxlength="40" placeholder="'+tr('phGoal')+'"')}
    <div class="two">${tf('ob-t','t',tr('goalAmt'),'inputmode="decimal" placeholder="1500"')}${tf('ob-by','by',tr('goalBy'),`type="date" min="${addDays(TODAY(),1)}"`)}</div>
    <div class="tf"><label>${tr('howOften')}</label>${segm('ob','w')}<span class="help">${tr('rhythmHelp')}</span></div>
    ${tf('ob-imp','imp',tr('commitLabel'),'inputmode="decimal" placeholder="20"',tr('commitHelp'))}
    <p class="errtxt" id="ob-err" role="alert" hidden></p>
    <div class="btns"><button class="btn pri st grow" type="submit">${tr('start')}</button><button class="btn st grow" type="button" data-act="demo">${tr('seeDemo')}</button></div>
  </form>${NATIVE?`<section class="card soft-c"><h2 class="t-m">${tr('haveBackup')}</h2><p class="b-s v">${tr('haveBackupD')}</p><div class="btns"><input class="sr" type="file" id="bakfile" accept="application/json,.json"><label class="btn sm st" for="bakfile">${ic('upload',18)}${tr('restoreFile')}</label></div></section>`:''}`}

const MSXP={25:50,50:75,75:100,100:250};
function targets(sc,M){
  const P=sc.P,cur=P.cur,u=U(),t=TODAY(),out=[];
  if(cur.status!=='hit')out.push({ic:'bolt',h:u.aim,s:tr('toGoPts',eur(Math.max(0,cur.t-cur.s)),100+10*Math.min(P.streak+1,10)),f:cur.t?cur.s/cur.t:0,pin:1});
  if(sc.nextAt)out.push({ic:'medal',h:tr('levelNext',sc.nextName),s:tr('ptsToGo',sc.nextAt-sc.xp),f:(sc.xp-sc.base)/(sc.nextAt-sc.base)});
  for(const m of M)if(m.next)out.push({ic:m.ic,m,h:tr('medalTier',m.n,m.tier+1),s:tr('toGo',mleft(m)),f:m.val/m.next+(S.pin===m.id?1:0)});
  for(const g of S.goals){const p=goalPlan(S,g,t);if(p.left<=0)continue;const nx=[25,50,75,100].find(x=>p.frac*100<x);if(!nx)continue;
    out.push({ic:'flag',h:tr('goalStep',dmn(g.name),nx),s:tr('toGoPts',eur(Math.ceil(g.t*nx/100-p.saved)),MSXP[nx]),f:p.frac*100/nx})}
  return out.sort((a,b)=>(b.pin||0)-(a.pin||0)||b.f-a.f).slice(0,3)}

function viewOggi(sc,M){
  const u=U(),r=S.set.r,P=sc.P,cur=P.cur,t=TODAY(),left=Math.max(0,cur.t-cur.s),dl=diffDays(t,pEnd(cur.k,r)),hit=cur.status==='hit';
  const prog=sc.nextAt?Math.min(1,(sc.xp-sc.base)/(sc.nextAt-sc.base)):1,soon=!hit&&dl<=(r==='m'?5:2),frac=cur.t?Math.max(0,Math.min(1,cur.s/cur.t)):0;
  const when=tr('when',dl),sn=`${P.streak} ${P.streak===1?u.one:u.many}`;
  let mood,head,sub;
  if(hit){mood=P.streak>=4?'party':'happy';head=u.hit;sub=tr('hitSub',cap(sn))}
  else if(soon){mood='worry';head=P.streak>0?tr('streakRisk'):tr('almostOut');sub=tr('leftWhen',eur(left),when)+(P.streak>0?(P.jolly>0?tr('jokerSaves'):tr('jokerNone')):'')}
  else if(cur.s<=0){mood='calm';head=u.start;sub=tr('commitWhen',eur(cur.t),when)}
  else{mood='happy';head=tr('onTrack');sub=tr('leftWhen',eur(left),when)}
  const due=autoDue(S,t),open=S.ev.filter(e=>e.k==='avoid'&&e.st==='open'),sug=suggested(S,t),tg=targets(sc,M),C=2*Math.PI*44;
  let h=`<section class="hero">
    <div class="hero-top">${mascot(mood,96)}<div><h2 class="t-l">${head}</h2><p class="b-s v" style="margin-top:4px">${sub}</p></div></div>
    <div><div class="b-xs v">${tr('setAside')}</div><div class="big num">${eur(totalSaved(S))}</div></div>
    <div class="chips"><span class="chip">${ic('flame',16)}${tr('inRow',sn)}</span><span class="chip">${ic('shield',16)}${tr('nJokers',P.jolly)}</span><span class="chip">${ic('medal',16)}${tr('nMedals',M.reduce((s,m)=>s+m.tier,0))}</span></div>
    <div style="display:flex;flex-direction:column;gap:6px"><div class="row"><span class="t-s">${esc(sc.name)} · ${tr('levelN',sc.lv+1)}</span><span class="b-xs num">${tr('nPts',nfi.format(sc.xp))}</span></div>
      <div class="prog" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(prog*100)}" aria-label="${tr('levelProg')}"><i style="width:${(prog*100).toFixed(1)}%"></i></div>
      <div class="b-xs v">${sc.nextAt?tr('ptsTo',sc.nextAt-sc.xp,esc(sc.nextName)):tr('levelMax')}</div></div>
  </section>
  <section class="card">
    <div style="display:flex;gap:16px;align-items:center">
      <div class="ring ${hit?'done':soon?'risk':''}" role="img" aria-label="${tr('commitPct',Math.round(frac*100))}"><svg viewBox="0 0 104 104"><circle class="tr" cx="52" cy="52" r="44" fill="none" stroke-width="12"/><circle class="pg" cx="52" cy="52" r="44" fill="none" stroke-width="12" stroke-linecap="round" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C*(1-frac)).toFixed(1)}"/></svg><span class="t-m num">${hit?ic('check',34):Math.round(frac*100)+'%'}</span></div>
      <div style="min-width:0"><div class="b-xs v">${u.this} · ${esc(pLabel(cur.k,r))}</div><div class="t-l num">${eur(cur.s)}</div><div class="b-s v">${tr('ofNet',eur(cur.t))}${cur.wd>0?tr('withdrawn',eur(cur.wd)):''}</div></div>
    </div>
    <div class="btns"><button class="btn pri st grow" data-act="dep">${ic('plus',18)}${tr('logDeposit')}</button><button class="btn st grow" data-act="avoid">${ic('bagoff',18)}${tr('skippedOne')}</button></div>
  </section>`;
  if(due.length||open.length){
    h+=`<section class="card"><div><h2 class="t-m">${tr('toConfirm')}</h2><p class="b-s v">${tr('toConfirmD')}</p></div><div class="list">`+
    due.map(d=>`<div class="li col"><div class="li-t"><div class="t-s">${tr('autoOn',esc(dfW.format(pd(d))))}</div><div class="b-s v num">${eur(S.set.auto.amt)}</div></div><div class="btns"><button class="btn sm pri st" data-act="autoOk" data-id="${d}">${tr('autoYes')}</button><button class="btn sm ghost st" data-act="autoNo" data-id="${d}">${tr('autoNo')}</button></div></div>`).join('')+
    open.map(e=>`<div class="li col"><div class="li-t"><div class="t-s">${esc(gen(e.n)||tr('skipped'))}</div><div class="b-s v">${tr('openSince',`<span class="num">${eur(e.a)}</span>`,esc(dfS.format(pd(e.d))))}</div></div><div class="btns"><button class="btn sm pri st" data-act="conv" data-id="${e.id}">${tr('transferLog')}</button><button class="btn sm ghost st" data-act="drop" data-id="${e.id}">${tr('neverMind')}</button></div></div>`).join('')+`</div></section>`}
  h+=`<section class="card"><div class="hd"><h2 class="t-m">${u.miss}</h2><span class="chip ${cur.md===3?'g':''} num">${tr('nOf',cur.md,3)}</span></div><div class="list">${cur.m.map(x=>`<div class="li ${x.done?'done':''}"><span class="lead ${x.done?'done':'y'}">${ic(x.done?'check':MISS[x.id])}</span><div class="li-t"><div class="t-s">${tr('miss')[x.id]}</div><div class="b-s v">${tr('missDo')[x.id](r)}</div></div><div class="li-e t-s num">${x.done?tr('missDone'):'+30'}</div></div>`).join('')}</div><p class="b-xs v">${tr('missFoot',u.one)}</p></section>`;
  if(tg.length)h+=`<section class="card soft-g"><h2 class="t-m">${tr('nearRewards')}</h2><div class="list">${tg.map(x=>`<div class="li">${x.m?medalG(x.m.tier+1,x.m.ic,48,MGRP[x.m.id],true):`<span class="lead done">${ic(x.ic)}</span>`}<div class="li-t"><div class="t-s">${esc(x.h)}</div><div class="b-s num">${esc(x.s)}</div><div class="prog thin" style="margin-top:6px"><i style="width:${(Math.max(0,Math.min(1,x.f))*100).toFixed(1)}%"></i></div></div></div>`).join('')}</div><div class="btns"><button class="btn sm ghost st" data-act="tab" data-id="premi">${tr('goMedals')}</button></div></section>`;
  h+=`<section class="card"><div><h2 class="t-m">${tr('trend')}</h2><p class="b-s v">${tr('trendD',u.one)}</p></div>${chart(P)}<p class="readout b-s" id="rd">${readout(cur)}</p><p class="b-xs v">${tr('legend',P.best+' '+(P.best===1?u.one:u.many))}</p></section>`;
  if(sug>S.set.imp)h+=`<section class="card flat"><p class="b-s">${tr('sugText',`<b class="num">${eur(sug)}</b>`,u.per,`<b class="num">${eur(S.set.imp)}</b>`)}</p><div class="btns"><button class="btn sm dark st" data-act="raise" data-id="${sug}">${tr('raiseTo',eur(sug))}</button></div></section>`;
  if(!S.set.auto||!S.set.auto.on)h+=`<section class="card flat"><h2 class="t-m">${tr('autoHead')}</h2><p class="b-s v">${tr('autoText')}</p><div class="btns"><button class="btn sm dark st" data-act="settings">${tr('haveAuto')}</button><button class="btn sm st" data-act="importPick">${tr('importStmt')}</button></div></section>`;
  return h}

function readout(p){if(!p)return '';return tr('readout',`<b>${esc(pLabel(p.k,S.set.r))}</b>`,`<span class="num">${eur(p.s)}</span>`,`<span class="num">${eur(p.t)}</span>`,p.wd?tr('readoutWd',`<span class="num">${eur(p.wd)}</span>`):'',tr('outcome')[p.status])}
function niceMax(v){if(v<=0)return 10;const p=Math.pow(10,Math.floor(Math.log10(v))),m=v/p;return(m<=1?1:m<=2?2:m<=5?5:10)*p}
function chart(P){
  const L=P.list.slice(-12),r=S.set.r,W=336,H=136,x0=34,top=8,ph=84,slot=(W-x0-4)/12,bw=13;
  const mx=niceMax(Math.max.apply(null,L.map(p=>Math.max(p.s,p.t)))/100),y=v=>top+ph-(v/100/mx)*ph;
  let g='';[0,mx/2,mx].forEach(v=>{const yy=top+ph-(v/mx)*ph;g+=`<line class="grid" x1="${x0}" x2="${W-2}" y1="${yy}" y2="${yy}"/><text x="${x0-6}" y="${yy+3}" text-anchor="end">${v}</text>`});
  const off=P.list.length-L.length;
  L.forEach((p,i)=>{const x=x0+i*slot+(slot-bw)/2,yb=top+ph,yt=y(Math.max(0,p.s)),hh=yb-yt,rr=Math.min(5,hh);
    if(hh>0)g+=`<path class="barfill" d="M${x} ${yb}V${yt+rr}Q${x} ${yt} ${x+rr} ${yt}H${x+bw-rr}Q${x+bw} ${yt} ${x+bw} ${yt+rr}V${yb}Z"/>`;
    g+=`<line class="tgt" x1="${x-3}" x2="${x+bw+3}" y1="${y(p.t)}" y2="${y(p.t)}"/>`;
    g+=`<text x="${x+bw/2}" y="${top+ph+13}" text-anchor="middle">${{hit:'✓',jolly:'J',miss:'–',open:'•'}[p.status]}</text>`;
    const d=pd(p.k),lab=r==='m'?dfM.format(d).slice(0,3):d.getDate();
    g+=`<text x="${x+bw/2}" y="${top+ph+26}" text-anchor="middle">${lab}</text>`;
    if(r==='w'&&(i===0||d.getDate()<=7))g+=`<text x="${x+bw/2}" y="${top+ph+38}" text-anchor="middle">${dfM.format(d).slice(0,3)}</text>`;
    g+=`<rect class="hit" data-bar="${off+i}" tabindex="0" role="img" aria-label="${tr('barAria',esc(pLabel(p.k,r)),p.s/100,p.t/100)}" x="${x0+i*slot}" y="${top}" width="${slot}" height="${ph}"/>`});
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="group" aria-label="${tr('chartAria')}">${g}</svg>`}

/* ---------- Spese ---------- */
function curYm(T){const ms=txMonths(T);return ms.indexOf(ui.ym)>=0?ui.ym:ms[ms.length-1]}
function levers(m,pm){
  const L=[],caps=S.caps||{},subSum=m.subs.reduce((s,x)=>s+x.a,0),fee=m.cats.find(c=>c.c==='Commissioni');
  if(m.subs.length)L.push({ic:'repeat',cls:'s',h:tr('levSubs',eur(subSum)),s:tr('levSubsD',m.subs.map(x=>mDisp(x.name)).join(', '),eur(subSum*12)),act:'subsAdd',label:tr('levSubsDo')});
  const top=m.cats.find(c=>ESS.indexOf(c.c)<0&&c.c!=='Altro'&&c.a>0);
  if(top)L.push({ic:'tag',cls:'y',h:`${catName(top.c)}: ${eur(top.a)}`,s:tr('levTopD',Math.round(top.a/Math.max(1,m.out)*100)),act:'capFor',id:top.c,label:caps[top.c]?tr('capEdit'):tr('capSet')});
  if(fee&&fee.a>0)L.push({ic:'warn',cls:'c',h:tr('levFee',eur(fee.a)),s:tr('levFeeD')});
  const hab=m.mer.filter(x=>x.n>=4&&(!top||x.c!==top.c)).sort((a,b)=>b.a-a.a)[0];
  if(hab)L.push({ic:'clock',cls:'g',h:tr('levHab',mDisp(hab.name),hab.n),s:tr('levHabD',eur(hab.a),eur(Math.round(hab.a/hab.n)))});
  if(pm){const up=m.cats.map(c=>{const p=pm.cats.find(x=>x.c===c.c);return{c:c.c,d:c.a-(p?p.a:0),p:p?p.a:0}}).filter(x=>x.d>=2000&&x.p>0&&x.d/x.p>.2&&(!top||x.c!==top.c)).sort((a,b)=>b.d-a.d)[0];
    if(up)L.push({ic:'trend',cls:'c',h:tr('levUp',catName(up.c)),s:tr('levUpD',eur(up.d),mLow(pm.ym)),act:'capFor',id:up.c,label:tr('capSet')})}
  return L}
function viewSpese(){
  const T=curT(),months=txMonths(T);
  if(!months.length)return `<section class="card" style="align-items:flex-start">${mascot('calm',88)}<h2 class="t-m">${tr('noStmt')}</h2><p class="b-s v">${tr('noStmtD')}</p><div class="btns"><button class="btn pri st" data-act="importPick">${ic('upload',18)}${tr('importStmt')}</button></div></section>`;
  const ym=curYm(T),m=spendMonth(T,S,ym),pi=months.indexOf(ym),pm=pi>0?spendMonth(T,S,months[pi-1]):null,pmN=pm?dfM.format(pd(pm.ym+'-01')):'',caps=S.caps||{},today=TODAY(),closed=ym<today.slice(0,7);
  const accs=Object.keys(T).filter(id=>T[id].ym===ym).map(id=>ACC[T[id].acc]||T[id].acc),mx=Math.max.apply(null,m.cats.map(c=>c.a).concat([1]));
  let h=`<div class="chips" role="group" aria-label="${tr('month')}">${months.slice(-6).map(x=>`<button class="chip st ${x===ym?'on':''}" data-act="ym" data-id="${x}" aria-pressed="${x===ym}">${esc(mChip(x))}</button>`).join('')}</div>
  <section class="card"><div><div class="b-xs v">${tr('outIn',esc(mLow(ym)))}</div><div class="big num">${eur(m.out)}</div><div class="b-s v">${tr('txOn',m.n,esc(accs.join(tr('and'))))}${pm?` · ${m.out>=pm.out?'+':'−'}${eur(Math.abs(m.out-pm.out))} ${tr('vsMonth',esc(pmN))}`:''}</div></div>
    <div class="two" style="gap:10px"><div class="card flat" style="padding:12px 14px;gap:2px;border-radius:18px"><span class="b-xs v">${tr('incOthers')}</span><span class="t-m num">${eur(m.inc)}</span></div><div class="card flat" style="padding:12px 14px;gap:2px;border-radius:18px"><span class="b-xs v">${tr('fromOwn')}</span><span class="t-m num">${eur(m.giro)}</span></div><div class="card flat" style="padding:12px 14px;gap:2px;border-radius:18px"><span class="b-xs v">${tr('toSpaces')}</span><span class="t-m num">${eur(m.space)}</span></div></div></section>`;
  const L=levers(m,pm);
  if(L.length)h+=`<section class="card"><div><h2 class="t-m">${tr('levers')}</h2><p class="b-s v">${tr('leversD',esc(mLow(ym)))}</p></div><div class="list">${L.map(x=>`<div class="li" style="align-items:flex-start"><span class="lead ${x.cls}">${ic(x.ic)}</span><div class="li-t"><div class="t-s">${esc(x.h)}</div><div class="b-s v">${esc(x.s)}</div>${x.act?`<div class="btns" style="margin-top:8px"><button class="btn sm st" data-act="${x.act}" data-id="${esc(x.id||ym)}">${x.label}</button></div>`:''}</div></div>`).join('')}</div></section>`;
  const cs=Object.keys(caps).filter(c=>caps[c]>0);
  if(cs.length)h+=`<section class="card"><div><h2 class="t-m">${tr('caps')}</h2><p class="b-s v">${tr('capsD')}</p></div><div class="list">${cs.map(c=>{const x=m.cats.find(y=>y.c===c),sp=x?x.a:0,ok=sp<=caps[c],rest=caps[c]-sp,ref='cap:'+c+':'+ym,used=S.ev.some(e=>e.ref===ref),counts=ym>=((S.capSince||{})[c]||'0000-00');
    return `<div class="li col"><div class="hd"><div class="li-t"><div class="t-s">${esc(catName(c))}</div><div class="b-s v num">${tr('nOf',eur(sp),eur(caps[c]))}</div></div><span class="chip ${ok?'g':'c'}">${ic(ok?'check':'warn',15)}${ok?(closed?tr('capKept'):tr('capUnder')):tr('capOver')}</span></div>
      <div class="prog ${ok?'':'over'}"><i style="width:${Math.min(100,sp/caps[c]*100).toFixed(1)}%"></i></div>
      ${!counts?`<p class="b-xs v">${tr('capBefore')}</p>`:''}${closed&&ok&&counts&&rest>=100?`<div class="btns">${used?`<span class="b-xs v">${tr('capRestUsed')}</span>`:`<button class="btn sm pri st" data-act="capRest" data-id="${esc(c+'|'+ym)}">${tr('capRestDo',eur(rest))}</button>`}</div>`:''}</div>`}).join('')}</div></section>`;
  h+=`<section class="card"><div class="hd"><div><h2 class="t-m">${tr('categories')}</h2><p class="b-s v">${tr('categoriesD')}</p></div></div><div>${m.cats.map(c=>{const p=pm&&pm.cats.find(x=>x.c===c.c),d=p?c.a-p.a:null,cp=caps[c.c];
    return `<button class="cat st" data-act="cat" data-id="${esc(c.c)}"><span class="row" style="flex-wrap:nowrap"><span class="t-s" style="min-width:0;overflow-wrap:anywhere">${esc(catName(c.c))}</span><span class="t-s num" style="flex-shrink:0">${eur(c.a)}</span></span>
      <span class="prog thin ${cp&&c.a>cp?'over':''}"><i style="width:${(Math.max(0,c.a)/mx*100).toFixed(1)}%"></i></span>
      <span class="b-xs v">${tr('nTx',c.n)} · ${tr('pctOut',Math.round(Math.max(0,c.a)/Math.max(1,m.out)*100))}${d!==null&&Math.abs(d)>=100?` · ${d>0?'+':'−'}${eur(Math.abs(d))} ${tr('vsMonth',esc(pmN))}`:''}${cp?` · ${tr('capOf',eur(cp))}`:''}</span></button>`}).join('')}</div></section>`;
  h+=`<section class="card"><h2 class="t-m">${tr('topMerchants')}</h2><div class="list">${m.mer.slice(0,8).map(x=>`<div class="li"><div class="li-t"><div class="t-s">${esc(mDisp(x.name))}</div><div class="b-s v">${esc(catName(catOf({n:x.name,c:x.c},S.rules,null)))} · ${tr('nTimes',x.n)}</div></div><div class="li-e t-s num">${eur(x.a)}</div></div>`).join('')}</div></section>
  ${NATIVE?'':`<section class="card soft-c"><div class="hero-top">${mascot('happy',64)}<div><h2 class="t-m">${tr('coachCard')}</h2><p class="b-s v">${tr('coachCardD')}</p></div></div><div class="btns"><button class="btn sm dark st" data-act="coachAsk" data-id="${ym}">${tr('coachCardDo',esc(mLow(ym)))}</button></div></section>`}`;
  return h}

function viewGoals(){
  const t=TODAY(),u=U(),free=goalSaved(S,null);
  let h=S.goals.map(g=>{const p=goalPlan(S,g,t),e=goalEta(S,g,t),done=p.left===0&&g.t>0;
    const ms=[25,50,75,100].map(m=>`${m}% ${p.frac*100>=m?'✓':'○'}`).join('   ');
    return `<section class="card"><div class="hd"><div><h2 class="t-m">${esc(dmn(g.name))}</h2><div class="t-l num">${eur(p.saved)} <span class="b-s v">${tr('ofAmt',eur(g.t))}</span></div></div>${done?`<span class="chip g">${ic('check',15)}${tr('goalDone')}</span>`:p.late?`<span class="chip c">${ic('warn',15)}${tr('goalLate')}</span>`:''}</div>
      <div class="prog"><i style="width:${(p.frac*100).toFixed(1)}%"></i><s style="left:25%"></s><s style="left:50%"></s><s style="left:75%"></s></div>
      <p class="b-xs v num">${ms}</p>
      ${done?`<p class="b-s">${tr('goalDoneD')}</p>`:`<p class="b-s">${g.by?(p.late?tr('goalPast',esc(dfL.format(pd(g.by))),`<b class="num">${eur(p.left)}</b>`):tr('goalNeed',`<b class="num">${eur(p.per)}</b>`,u.per,esc(dfL.format(pd(g.by))))):tr('goalOpen',`<b class="num">${eur(p.left)}</b>`)}<br><span class="v">${e.eta?tr('goalEta',`<span class="num">${eur(Math.round(e.pace/100)*100)}</span>`,u.per,esc(dfL.format(pd(e.eta)))):tr('goalNoEta')}</span></p>`}
      <div class="btns"><button class="btn sm pri st" data-act="dep" data-id="${g.id}">${tr('deposit')}</button><button class="btn sm st" data-act="wd" data-id="${g.id}" ${p.saved<=0?'disabled':''}>${tr('withdraw')}</button><button class="btn sm ghost st" data-act="goal" data-id="${g.id}">${tr('edit')}</button></div></section>`}).join('');
  if(free!==0)h+=`<section class="card flat"><h2 class="t-m">${tr('reserve')}</h2><div class="t-l num">${eur(free)}</div><p class="b-s v">${tr('reserveD')}</p></section>`;
  if(!S.goals.length)h+=`<section class="card"><h2 class="t-m">${tr('noGoals')}</h2><p class="b-s v">${tr('noGoalsD')}</p></section>`;
  return h+`<div class="btns"><button class="btn dark st grow" data-act="goal">${ic('plus',18)}${tr('goalNew')}</button></div>`}

const MGRP={streak:'c',hold:'c',back:'c',tris:'c',peak:'s',deps:'s',goals:'s',over:'s',auto:'s',conv:'e',caps:'e',cuts:'e',cells:'f',ns:'f'};
const GRPS=['c','s','e','f'];
const munit=(m,n)=>tr('munit',S.set.r==='m',n)[m.id]||'';
const mleft=m=>m.next?mval(m,m.next-m.val)+' '+munit(m,m.next-m.val):'';
const STAR='l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z',SACK_T='M43 21c5-6 11-3 17 1 6-4 12-7 17-1-2 6-6 10-9 13H52c-3-3-7-7-9-13z',SACK_B='M60 31c-21 6-39 30-39 50 0 18 17 26 39 26s39-8 39-26c0-20-18-44-39-50z';
/* sticker medal: the mascot on a coloured disc, a badge with the medal's own symbol, three stars for the tier.
   The tier is readable from stars, disc colour and headgear (none, star, crown), never from colour alone. */
function medalG(tier,icon,size,grp,ghost,cls){
  const t=Math.max(1,Math.min(3,tier)),on=ghost?0:t,k=['','bz','ag','au'][t];
  const stars=[56,80,104].map((x,i)=>`<path d="M${x} 150${STAR}" fill="${i<on?`var(--star-${k})`:'var(--star-off)'}"/>`).join('');
  const badge=`<circle cx="124" cy="112" r="22" fill="${ghost?'var(--card2)':'var(--stk)'}"/><circle cx="124" cy="112" r="18" fill="${ghost?'var(--star-off)':`var(--rib-${grp||'c'})`}"/><svg x="110" y="98" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${ghost?'var(--ink2)':'var(--stk)'}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${IC[icon]||IC.star}</svg>`;
  const open=`<svg class="mg ${cls||''}" width="${size}" height="${Math.round(size*1.0625)}" viewBox="0 0 160 170" aria-hidden="true">`;
  if(ghost)return open+`<circle cx="80" cy="78" r="65" fill="none" stroke="var(--ink2)" stroke-opacity=".45" stroke-width="2.5" stroke-dasharray="7 7"/><circle cx="80" cy="78" r="56" fill="var(--card2)" opacity=".7"/><g transform="translate(32 26) scale(.8)" fill="var(--ink2)"><path d="${SACK_T}" opacity=".3"/><path d="${SACK_B}" opacity=".22"/></g>${badge}${stars}</svg>`;
  return open+`<circle cx="80" cy="81" r="67" fill="var(--m-ink)" opacity=".1"/><circle cx="80" cy="78" r="66" fill="var(--stk)"/><circle cx="80" cy="78" r="56" fill="var(--stk-${k})"/>`+
    (t>=2?'<g fill="var(--stk)" opacity=".75"><circle cx="38" cy="50" r="3"/><circle cx="124" cy="46" r="4"/><circle cx="33" cy="100" r="2.5"/></g>':'')+
    `<g transform="translate(32 ${t===3?30:27}) scale(.8)"><path d="${SACK_T}" fill="var(--m2)"/><path d="${SACK_B}" fill="var(--m1)"/><rect x="47" y="30" width="26" height="8" rx="4" fill="var(--m3)"/><circle cx="37" cy="78" r="5" fill="var(--m3)" opacity=".32"/><circle cx="83" cy="78" r="5" fill="var(--m3)" opacity=".32"/><circle cx="47" cy="68" r="4.4" fill="var(--m-ink)"/><circle cx="73" cy="68" r="4.4" fill="var(--m-ink)"/>${t===3?'<path d="M50 79q10 13 20 0z" fill="var(--m-ink)"/>':'<path d="M51 80q9 8 18 0" fill="none" stroke="var(--m-ink)" stroke-width="3" stroke-linecap="round"/>'}</g>`+
    (t===3?'<path d="M62 37l6 12 12-14 12 14 6-12 2 22H60z" fill="var(--star-au)" stroke="var(--stk)" stroke-width="2.5" stroke-linejoin="round"/>':t===2?`<path d="M80 22${STAR}" fill="var(--star-ag)" stroke="var(--stk)" stroke-width="2" stroke-linejoin="round" transform="translate(-16 -6) scale(1.2)"/>`:'')+
    badge+stars+'</svg>'}
const mshow=(m,size,cls)=>medalG(m.tier||1,m.ic,size,MGRP[m.id],m.tier===0,cls);
function spot(M){const open=M.filter(m=>m.next);return open.find(m=>m.id===S.pin)||open.slice().sort((a,b)=>b.val/b.next-a.val/a.next)[0]||null}
function wonDate(m,t){const w=(S.won||{})[m.id];return w&&w[t-1]?w[t-1]:null}
function levelPath(sc){return `<div class="lpath" role="img" aria-label="${tr('levelOf',sc.lv+1,LEVELS.length)}">${LEVELS.map((l,i)=>`<span class="ln ${i<sc.lv?'d':i===sc.lv?'c':''}">${i<sc.lv?ic('check',14):i+1}</span>`).join('<i></i>')}</div>`}
function viewPremi(sc,M){
  const got=M.reduce((s,m)=>s+m.tier,0),u=U(),P=sc.P,sp=spot(M),t=TODAY(),from=addDays(t,-14);
  const fresh=[];M.forEach(m=>{for(let k=1;k<=m.tier;k++){const d=wonDate(m,k);if(d&&d>=from)fresh.push({m,k,d})}});fresh.sort((a,b)=>a.d<b.d?1:-1);
  let h=`<section class="hero"><div class="hero-top"><div><div class="b-xs v">${tr('levelOf',sc.lv+1,LEVELS.length)}</div><h2 class="t-l">${esc(sc.name)}</h2></div>${mascot(got>=6?'party':'happy',76)}</div>
    ${levelPath(sc)}
    <div class="row b-s"><span class="num">${tr('nPts',`<b>${nfi.format(sc.xp)}</b>`)}</span><span class="v">${sc.nextAt?tr('nTo',sc.nextAt-sc.xp,esc(sc.nextName)):tr('levelTop')}</span></div></section>
  <div class="segm" role="group" aria-label="${tr('rewardsAria')}"><button class="st" data-act="seg" data-id="med" aria-pressed="${ui.seg!=='sfi'}"><span>${tr('medals')} · ${tr('nOf',got,M.length*3)}</span></button><button class="st" data-act="seg" data-id="sfi" aria-pressed="${ui.seg==='sfi'}"><span>${tr('challenges')}</span></button></div>`;
  if(ui.seg==='sfi')return h+viewSfide();
  if(sp){const f=Math.max(0,Math.min(1,sp.val/sp.next));
    h+=`<section class="card spot"><div class="row"><span class="b-xs v">${tr('spotHead')}</span><button class="btn sm ghost st" style="min-height:30px;padding:0 4px" data-act="pinPick">${tr('change')}</button></div>
      <button class="spot-b st" data-act="medal" data-id="${sp.id}">${medalG(sp.tier+1,sp.ic,96,MGRP[sp.id],true)}<span class="li-t"><span class="t-m">${tr('medalTier',esc(sp.n),sp.tier+1)}</span><span class="b-s">${tr('toGoDot',`<b class="num">${mleft(sp)}</b>`)}</span><span class="b-xs v">${esc(tr('tips')[sp.id]||sp.d)}</span></span></button>
      <div class="prog"><i style="width:${(f*100).toFixed(1)}%"></i></div><div class="row b-xs v num"><span>${tr('nOf',mval(sp,sp.val),mval(sp,sp.next))}</span><span>${Math.round(f*100)}%</span></div></section>`}
  if(fresh.length)h+=`<section class="card soft-y"><h2 class="t-m">${tr('justWon')}</h2><div class="shelf">${fresh.slice(0,6).map(x=>`<button class="shelf-i st" data-act="medal" data-id="${x.m.id}">${medalG(x.k,x.m.ic,64,MGRP[x.m.id])}<span class="b-xs"><b>${esc(x.m.n)}</b><br>${tr('tier')[x.k]} · ${esc(dfS.format(pd(x.d)))}</span></button>`).join('')}</div></section>`;
  for(const g of GRPS){const ms=M.filter(m=>MGRP[m.id]===g),have=ms.reduce((s,m)=>s+m.tier,0);
    h+=`<div class="hd grp"><h2 class="t-m">${tr('groups')[g]}</h2><span class="chip num">${tr('nOf',have,ms.length*3)}</span></div><div class="medals">${ms.map(m=>`<button class="mtile st" data-act="medal" data-id="${m.id}" aria-label="${esc(m.n)}, ${tr('tier')[m.tier]}">${mshow(m,84)}<span class="t-s">${esc(m.n)}</span><span class="b-xs ${m.tier?'':'v'}">${m.tier?tr('tier')[m.tier]:tr('toEarn')}</span>${m.next?`<span class="prog thin"><i style="width:${Math.min(100,m.val/m.next*100).toFixed(1)}%"></i></span><span class="b-xs v num">${tr('nOf',mval(m,m.val),mval(m,m.next))}</span>`:`<span class="b-xs v num">${mval(m,m.val)} · ${tr('medalFull')}</span>`}</button>`).join('')}</div>`}
  const bestP=P.list.reduce((b,p)=>p.s>b.s?p:b,{s:0,k:null}),pk=M.find(m=>m.id==='peak');
  h+=`<section class="card"><h2 class="t-m">${tr('records')}</h2><div class="list">
      <div class="li" style="min-height:46px"><span class="lead g">${ic('flame')}</span><div class="li-t b-s">${tr('bestStreak')}</div><div class="li-e t-s num">${P.best} ${P.best===1?u.one:u.many}</div></div>
      <div class="li" style="min-height:46px"><span class="lead s">${ic('coins')}</span><div class="li-t b-s">${tr('bestBalance')}</div><div class="li-e t-s num">${eur((pk?pk.val:0)*100)}</div></div>
      <div class="li" style="min-height:46px"><span class="lead y">${ic('trend')}</span><div class="li-t b-s">${S.set.r==='m'?tr('bestMonth'):tr('bestWeek')}${bestP.k?`<br><span class="b-xs v">${esc(pLabel(bestP.k,S.set.r))}</span>`:''}</div><div class="li-e t-s num">${eur(bestP.s)}</div></div></div>
    <div><div class="b-xs v" style="margin-bottom:6px">${tr('lastPeriods',Math.min(12,P.list.length))}</div><div class="dots" role="img" aria-label="${tr('lastAria')}">${P.list.slice(-12).map(p=>`<span class="dot ${p.status}">${{hit:'✓',jolly:'J',miss:'–',open:'•'}[p.status]}</span>`).join('')}</div></div></section>
  <section class="card flat"><div><h2 class="t-m">${tr('ptsFrom')}</h2><p class="b-s v">${tr('ptsFromD')}</p></div><div class="list">${Object.keys(tr('parts')).filter(k=>sc.parts[k]).map(k=>`<div class="li" style="min-height:42px"><div class="li-t b-s">${tr('parts')[k]}</div><div class="li-e t-s num">${nfi.format(sc.parts[k])}</div></div>`).join('')||`<p class="b-s v">${tr('ptsNone')}</p>`}</div></section>`;
  return h}
function sheetMedal(id){
  const sc=score(S,TODAY(),curT()),m=medals(S,sc).find(x=>x.id===id);if(!m)return;const sp=spot(medals(S,sc)),pinned=sp&&sp.id===id;
  openSheet(esc(m.n),`<div class="mhero">${mshow(m,132,'big')}<span class="chip ${m.tier?'y':''}">${m.tier?tr('tier')[m.tier]:tr('toEarn')}</span><p class="b-s v" style="text-align:center;max-width:30em">${esc(m.d)}</p></div>
    <div class="list">${[1,2,3].map(k=>{const d=wonDate(m,k),has=m.tier>=k;return `<div class="li">${medalG(k,m.ic,54,MGRP[m.id],!has)}<div class="li-t"><div class="t-s">${tr('tier')[k]}</div><div class="b-s v num">${mval(m,m.th[k-1])} ${esc(munit(m,m.th[k-1]))}</div></div><div class="li-e b-xs ${has?'':'v'}">${has?(d?tr('wonOn',esc(dfL.format(pd(d)))):tr('wonAlready')):(m.tier===k-1?tr('toGoBr',esc(mleft(m))):tr('afterTier',tr('tier')[k-1].toLowerCase()))}</div></div>`}).join('')}</div>
    <div class="card"><div class="t-s">${tr('howTo')}</div><p class="b-s v">${esc(tr('tips')[m.id]||'')}</p></div>`,
  '',()=>{},m.next?(pinned&&S.pin===id?'<span class="chip g">'+ic('check',15)+tr('pinned')+'</span>':`<button type="button" class="btn dark st" data-act="pin" data-id="${id}">${tr('pinDo')}</button>`):'')}
function sheetPin(){
  const sc=score(S,TODAY(),curT()),M=medals(S,sc).filter(m=>m.next);
  openSheet(tr('pinPick'),`<p class="b-s v">${tr('pinPickD')}</p><div class="list">${M.map(m=>`<button type="button" class="li st" data-act="pin" data-id="${m.id}">${medalG(m.tier+1,m.ic,50,MGRP[m.id],true)}<span class="li-t"><span class="t-s">${tr('medalTier',esc(m.n),m.tier+1)}</span><span class="b-s v num">${tr('toGo',esc(mleft(m)))}</span></span>${S.pin===m.id?ic('check'):ic('chev')}</button>`).join('')}</div>`,'',()=>{})}
function confetti(){
  const cv=$('confetti');if(!cv||(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches))return;
  const r=cv.getBoundingClientRect(),W=cv.width=r.width,H=cv.height=r.height,x=cv.getContext('2d'),cs=getComputedStyle(document.documentElement),cols=['--green','--sun','--coral','--sky','--star-au'].map(v=>cs.getPropertyValue(v).trim()||'#888');
  const ps=Array.from({length:90},(_,i)=>({x:W/2+(Math.random()-.5)*60,y:H*.38,vx:(Math.random()-.5)*9,vy:-4-Math.random()*8,s:5+Math.random()*6,c:cols[i%cols.length],a:Math.random()*6,va:(Math.random()-.5)*.4}));let t0=null;
  const step=ts=>{if(!t0)t0=ts;const el=ts-t0;x.clearRect(0,0,W,H);for(const p of ps){p.vy+=.28;p.x+=p.vx;p.y+=p.vy;p.a+=p.va;x.save();x.translate(p.x,p.y);x.rotate(p.a);x.globalAlpha=Math.max(0,1-el/1900);x.fillStyle=p.c;x.fillRect(-p.s/2,-p.s/3,p.s,p.s*.66);x.restore()}
    if(el<1900&&cdlg.open)requestAnimationFrame(step);else x.clearRect(0,0,W,H)};requestAnimationFrame(step)}
function celebrate(up,lvl,dx){
  const many=up.length>1,title=up.length?(many?tr('medalsNew',up.length):tr('medalTier',esc(up[0].n),up[0].tier)):tr('levelNew');
  cdlg.innerHTML=`<canvas id="confetti"></canvas><div class="cele"><div class="set">${up.map(m=>medalG(m.tier,m.ic,many?72:132,MGRP[m.id],false,'pop')).join('')||mascot('party',120)}</div>
    <h2 class="t-l">${title}</h2>
    ${up.map(m=>`<p class="b-s">${many?`<b>${tr('medalTier',esc(m.n),m.tier)}</b><br>`:''}<span class="v">${tr('celeAt',esc(m.d),mval(m,m.val),m.next?tr('celeNext',m.tier+1,mval(m,m.next)):'')}</span></p>`).join('')}
    ${lvl?`<p class="b-s"><b>${up.length?tr('levelNew')+': ':''}${esc(lvl.name)}</b><br><span class="v">${tr('ptsTotal',nfi.format(lvl.xp))}</span></p>`:''}
    ${dx>0?`<span class="chip g">${tr('plusPts',dx)}</span>`:''}
    <button class="btn pri st" data-act="celeClose" autofocus>${tr('continue')}</button></div>`;
  try{if(cdlg.open)cdlg.close();cdlg.showModal()}catch(e){cdlg.setAttribute('open','')}
  confetti();try{if(navigator.vibrate)navigator.vibrate([30,60,30])}catch(e){}}
function viewSfide(){
  const t=TODAY(),c=S.ch.c52,n=S.ch.ns;let h='';
  if(!c)h+=`<section class="card"><div class="hd"><h2 class="t-m">${tr('c52')}</h2><span class="lead s">${ic('grid')}</span></div><p class="b-s v">${tr('c52D',S.set.r==='m',`<span class="num">${eur(137800)}</span>`)}</p><div class="btns"><button class="btn sm pri st" data-act="c52start">${tr('start')}</button></div></section>`;
  else{const st=c52Set(S);let sum=0;st.forEach(v=>sum+=v);
    h+=`<section class="card"><div class="hd"><div><h2 class="t-m">${tr('c52')}</h2><p class="b-s v">${tr('c52Stat',`<b class="num">${st.size}</b>`,`<span class="num">${eur(sum*100)}</span>`,`<span class="num">${eur(137800)}</span>`)}</p></div>${st.size===52?`<span class="chip g">${ic('check',15)}${tr('c52Full')}</span>`:''}</div>
    <div class="prog"><i style="width:${(sum/1378*100).toFixed(1)}%"></i></div>
    <div class="cells">${Array.from({length:52},(_,i)=>i+1).map(v=>st.has(v)?`<span class="cell on" aria-label="${tr('c52On',v)}">${v}</span>`:`<button class="cell st" data-act="c52" data-id="${v}" aria-label="${tr('c52Off',v)}">${v}</button>`).join('')}</div>
    <p class="b-xs v">${tr('c52Foot')}</p></section>`}
  if(!n)h+=`<section class="card"><div class="hd"><h2 class="t-m">${tr('ns')}</h2><span class="lead g">${ic('cal')}</span></div><p class="b-s v">${tr('nsD')}</p><div class="btns"><button class="btn sm pri st" data-act="nsStart">${tr('nsStart')}</button></div></section>`;
  else{const days=new Set(nsDays(S)),end=addDays(n.start,29),over=t>end,y=addDays(t,-1);
    h+=`<section class="card"><div class="hd"><div><h2 class="t-m">${tr('ns')}</h2><p class="b-s v">${tr('nsStat',`<b class="num">${days.size}</b>`,esc(dfS.format(pd(end))))}</p></div>${days.size>=25?`<span class="chip g">${ic('check',15)}${tr('nsPassed')}</span>`:''}</div>
    <div class="prog"><i style="width:${Math.min(100,days.size/25*100).toFixed(1)}%"></i></div>
    <div class="cells">${Array.from({length:30},(_,i)=>addDays(n.start,i)).map(d=>{const dn=pd(d).getDate(),can=(d===t||d===y);
      if(days.has(d))return can?`<button class="cell on st" data-act="ns" data-id="${d}" aria-label="${tr('nsOnTap',dn)}">${dn}</button>`:`<span class="cell on" aria-label="${tr('nsOn',dn)}">${dn}</span>`;
      if(can)return `<button class="cell now st" data-act="ns" data-id="${d}" aria-label="${tr('nsMark',dn)}">${dn}</button>`;
      return `<span class="cell ${d<t?'miss':'fut'}" aria-label="${dn}${d<t?tr('nsOff'):''}">${dn}</span>`}).join('')}</div>
    <p class="b-xs v">${over?tr('nsOver'):tr('nsFoot')}</p>
    <div class="btns"><button class="btn sm ${over?'pri':'ghost'} st" data-act="nsStart" data-arm="${over?'':'1'}">${over?tr('nsAgain'):tr('nsAgainToday')}</button></div></section>`}
  const subs=S.ch.subs,keep=subs.filter(x=>!x.cut).reduce((s,x)=>s+x.a,0),cut=subs.filter(x=>x.cut).reduce((s,x)=>s+x.a,0);
  h+=`<section class="card"><div class="hd"><h2 class="t-m">${tr('subs')}</h2><span class="lead c">${ic('cut')}</span></div><p class="b-s v">${tr('subsD')}</p>
    ${subs.length?`<div class="list">${subs.map(x=>`<div class="li"><div class="li-t"><div class="t-s">${esc(dmn(x.n))}</div><div class="b-s v">${tr('subCost',`<span class="num">${eur(x.a)}</span>`,`<span class="num">${eur(x.a*12)}</span>`)}</div></div><div class="li-e"><button class="chip st ${x.cut?'g':''}" data-act="subCut" data-id="${x.id}" aria-pressed="${x.cut}">${x.cut?ic('check',15):''}${tr('subCut')}</button><button class="btn sm danger st" style="min-height:30px;padding-block:2px" data-act="subDel" data-id="${x.id}">${tr('remove')}</button></div></div>`).join('')}</div>
    <div class="card soft-y" style="padding:12px 16px;border-radius:18px"><p class="b-s">${tr('subSum',`<b class="num">${eur(cut)}</b>`,`<b class="num">${eur(cut*12)}</b>`,`<span class="num">${eur(keep)}</span>`)}${cut>0?tr('subHint'):''}</p></div>`:''}
    <form id="subf" class="two" novalidate>${tf('sub-n','n',tr('subName'),'maxlength="30" placeholder="Streaming"')}${tf('sub-a','a',tr('subAmt'),'inputmode="decimal" placeholder="'+inp(1299)+'"')}<div class="btns"><button class="btn sm st" type="submit">${tr('subAdd')}</button></div></form></section>`;
  return h}

function viewRegistro(){
  const gn=id=>{const g=S.goals.find(x=>x.id===id);return g?dmn(g.name):tr('reserve')};
  const ev=S.ev.filter(e=>e.k!=='skip').slice().sort((a,b)=>a.d<b.d?1:a.d>b.d?-1:(b.ts||0)-(a.ts||0));
  let h=`<section class="card"><div><h2 class="t-m">${tr('logHead')}</h2><p class="b-s v">${tr('logD')}</p></div>`;
  if(!ev.length)h+=`<p class="b-s v">${tr('logNone')}</p>`;
  else{let m='';for(const e of ev){const mk=e.d.slice(0,7);if(mk!==m){h+=(m?'</div>':'')+`<p class="b-xs v" style="padding-top:6px">${esc(mLabel(mk))}</p><div class="list">`;m=mk}
    let title,amt,tag='',icn,cls;
    if(e.k==='dep'){title=(e.s==='open'?tr('logOpen'):tr('logDep'))+' · '+gn(e.g);amt='+'+eur(e.a);icn='inn';cls='g';tag=e.s==='c52'?tr('tagC52',(e.ref||'').slice(4)):tr('tagDep')[e.s]||''}
    else if(e.k==='wd'){title=tr('logWd')+' · '+gn(e.g);amt='−'+eur(e.a);icn='out';cls='c';tag=e.use?tr('tagUse'):tr('tagEarly')}
    else{title=tr('skipped');amt=eur(e.a);icn='bagoff';cls='y';tag=tr('tagAvoid')[e.st]||''}
    h+=`<div class="li"><span class="lead ${cls}">${ic(icn)}</span><div class="li-t"><div class="t-s">${esc(title)}</div><div class="b-s v">${esc(dfS.format(pd(e.d)))}${e.n?' · '+esc(gen(e.n)):''}${tag?' · '+esc(tag):''}</div></div><div class="li-e"><span class="t-s num">${amt}</span><button class="btn sm danger st" style="min-height:30px;padding:2px 6px" data-act="del" data-id="${e.id}">${tr('delete')}</button></div></div>`}
    h+='</div>'}
  return h+'</section>'}

/* ---------- Coach ---------- */
function viewCoach(){
  const T=curT(),has=txMonths(T).length>0;
  if(!SAMPLE)return `<section class="card" style="align-items:flex-start">${mascot('calm',88)}<h2 class="t-m">${tr('coachOff')}</h2><p class="b-s v">${tr('coachOffD')}</p></section>`;
  let h=`<section class="card soft-g"><div class="hero-top">${mascot('happy',64)}<div><h2 class="t-m">${tr('coachHead')}</h2><p class="b-s v">${tr('coachD')}${has?'':tr('coachNoTx')}.</p></div></div></section>`;
  h+=`<div class="chat" id="chat">${chat.turns.map(m=>`<div class="msg ${m.role==='user'?'u':'a'}">${esc(m.content)}</div>`).join('')}${chat.busy?`<div class="msg a wait" id="live">${esc(chat.live||tr('coachWait'))}</div>`:''}</div>`;
  if(chat.note)h+=`<p class="errtxt">${esc(chat.note)}</p>`;
  if(!chat.busy)h+=`<div class="chips">${tr('questions').map(q=>`<button class="chip st" data-act="q" data-id="${esc(q)}" style="white-space:normal;text-align:left">${ic('spark',15)}${esc(q)}</button>`).join('')}</div>`;
  h+=`<form class="ask" id="askf"><textarea id="ask-q" name="q" rows="1" maxlength="600" placeholder="${tr('coachPh')}" aria-label="${tr('coachAria')}">${esc(chat.draft)}</textarea>${chat.busy?`<button class="roundbtn stop st" type="button" data-act="chatStop" aria-label="${tr('stop')}">${ic('stop')}</button>`:`<button class="roundbtn st" type="submit" aria-label="${tr('send')}">${ic('send')}</button>`}</form>`;
  if(chat.turns.length&&!chat.busy)h+=`<div class="btns" style="justify-content:center"><button class="btn sm ghost st" data-act="chatNew">${tr('chatNew')}</button></div>`;
  return h}
/* the data for the model is built with Italian field names; rk renames them when the language is English */
const rk=o=>Array.isArray(o)?o.map(rk):o&&typeof o==='object'?Object.fromEntries(Object.keys(o).map(k=>[look('coachKeys',k),rk(o[k])])):o;
function coachData(){
  const T=curT(),t=TODAY(),sc=score(S,t,T),months=txMonths(T).slice(-3),e=c=>Math.round(c)/100,caps=S.caps||{};
  return rk({oggi:t,avvertenza:tr('coachNote'),
    risparmio:{saldo_salvadanaio:e(totalSaved(S)),ritmo:S.set.r==='m'?tr('monthly'):tr('weekly'),impegno_per_periodo:e(S.set.imp),periodi_centrati_di_fila:sc.P.streak,jolly:sc.P.jolly,livello:sc.name,punti:sc.xp,
      ultimi_periodi:sc.P.list.slice(-8).map(p=>({inizio:p.k,netto:e(p.s),prelievi_anticipati:e(p.wd),impegno:e(p.t),esito:p.status})),
      obiettivi:S.goals.map(g=>({nome:dmn(g.name),messi_da_parte:e(goalSaved(S,g.id)),traguardo:e(g.t),scadenza:g.by||null}))},
    tetti:Object.keys(caps).filter(c=>caps[c]>0).map(c=>({categoria:catName(c),euro_al_mese:e(caps[c])})),
    mesi:months.map(ym=>{const m=spendMonth(T,S,ym);return{mese:ym,conti:Object.keys(T).filter(id=>T[id].ym===ym).map(id=>T[id].acc),uscite:e(m.out),operazioni:m.n,entrate_da_terzi:e(m.inc),dai_propri_altri_conti_netto:e(m.giro),verso_spazi_risparmio_netto:e(m.space),
      categorie:m.cats.map(c=>({nome:catName(c.c),euro:e(c.a),operazioni:c.n})),esercenti_principali:m.mer.slice(0,14).map(x=>({nome:x.c==='Bonifici'?tr('privTransfer'):mDisp(x.name),euro:e(x.a),volte:x.n,categoria:catName(catOf({n:x.name,c:x.c},S.rules,null))})),
      abbonamenti_rilevati:m.subs.map(x=>({nome:mDisp(x.name),euro_al_mese:e(x.a)}))}})})}
function coachRules(){return tr('coachRules')+JSON.stringify(coachData())}
function coachTool(){return{name:tr('toolName'),description:tr('toolD'),
  inputSchema:{type:'object',properties:rk({mese:{type:'string',description:'YYYY-MM'},categoria:{type:'string'},esercente:{type:'string'}})},
  execute(i){const T=curT(),learn=learnMap(T),ym=String(i.mese||i.month||''),cat=String(i.categoria||i.category||'').toLowerCase(),mer=String(i.esercente||i.merchant||'').toLowerCase(),out=[];
    for(const id in T){const t=T[id];if(ym&&t.ym!==ym)continue;for(const r of t.rows){if(r.k!=='out')continue;const c=catOf(r,S.rules,learn);if(cat&&c.toLowerCase().indexOf(cat)<0&&catName(c).toLowerCase().indexOf(cat)<0)continue;if(mer&&r.n.toLowerCase().indexOf(mer)<0&&mDisp(mShow(r.n)).toLowerCase().indexOf(mer)<0)continue;
      out.push({data:r.d,euro:-r.a/100,nome:c==='Bonifici'?tr('privTransfer'):mDisp(mShow(r.n)),categoria:catName(c),conto:t.acc})}}
    out.sort((a,b)=>b.euro-a.euro);return rk({righe:out.slice(0,60),totale_righe:out.length})}}}
const OFF=['not_granted','sampling_disabled','not_declared','capability_disabled','capability_removed'];
function saveChat(){try{localStorage.setItem(LSC,JSON.stringify(chat.turns.slice(-24)))}catch(e){}}
async function ask(q){
  q=String(q||'').trim();if(!q||!SAMPLE||chat.busy)return;
  chat.turns.push({role:'user',content:q});chat.busy=true;chat.live='';chat.note='';chat.draft='';render();scrollChat();
  const ctl=chat.ctl=new AbortController();let turns=chat.turns.slice(-12);while(turns.length&&turns[0].role!=='user')turns.shift();
  const opts={cache:false,signal:ctl.signal,onText:u=>{chat.live=u.text;const el=$('live');if(el){el.textContent=u.text;el.classList.remove('wait');scrollChat()}}};
  if(chat.tools&&txMonths(curT()).length)opts.tools=[coachTool()];
  try{const r=await SAMPLE([{role:'user',content:coachRules()}].concat(turns),opts);chat.turns.push({role:'assistant',content:r.text+(r.truncated?'\n\n'+tr('coachCut'):'')})}
  catch(e){const code=e&&e.code;if(e&&e.text&&code!=='refused')chat.turns.push({role:'assistant',content:e.text});
    if(OFF.indexOf(code)>=0){SAMPLE=null;chat.turns.pop()}else if(code!=='cancelled')chat.note=tr('coachErr')[code]||tr('coachErr').upstream_error}
  chat.busy=false;chat.live='';chat.ctl=null;saveChat();if(ui.tab==='coach'){render();scrollChat()}}
function scrollChat(){if(ui.tab==='coach')window.scrollTo(0,document.documentElement.scrollHeight)}

/* ---------- sheets ---------- */
const dlg=$('sheet');let sheetSubmit=null;
function openSheet(title,body,label,onSubmit,extra){
  dlg.innerHTML=`<form class="sheet" id="sheetForm" novalidate><div class="hd"><h2 class="t-l">${title}</h2><button type="button" class="roundbtn st" data-act="close" aria-label="${tr('close')}" style="background:var(--bg)">${ic('close')}</button></div>${body}<p class="errtxt" id="sheetErr" role="alert" hidden></p>${label?`<div class="sh-foot">${extra||''}<button type="submit" class="btn pri st">${label}</button></div>`:(extra?`<div class="sh-foot">${extra}</div>`:'')}</form>`;
  sheetSubmit=onSubmit;if(!dlg.open){try{dlg.showModal()}catch(e){dlg.setAttribute('open','')}}dlg.scrollTop=0}
function closeSheet(){try{dlg.close()}catch(e){dlg.removeAttribute('open')}}
dlg.addEventListener('click',e=>{if(e.target===dlg)closeSheet()});
function goalOptions(s){return S.goals.map(g=>`<option value="${g.id}" ${g.id===s?'selected':''}>${esc(dmn(g.name))}</option>`).join('')+`<option value="" ${!s?'selected':''}>${tr('reserveOpt')}</option>`}
function sheetDep(pre){
  pre=pre||{};const t=TODAY(),cur=periods(S,t).cur,left=Math.max(0,cur.t-cur.s);
  const gs=pre.g!==undefined?pre.g:(S.goals.find(g=>goalPlan(S,g,t).left>0)||{}).id||'';
  const q=pre.lock?'':`<div class="quick">${[5,10,20,50].map(v=>`<button type="button" class="chip st num" data-chip="${v}">${tr('euroN',v)}</button>`).join('')}${left>0?`<button type="button" class="chip g st num" data-chip="${inp(left)}">${tr('depFill',eur(left))}</button>`:''}</div>`;
  openSheet(pre.title||tr('logDeposit'),`<p class="b-s v">${tr('depD')}</p>
    ${tf('f-a','a',tr('depAmt'),`inputmode="decimal" value="${inp(pre.a)}" ${pre.lock?'readonly':''}`)}${q}
    ${sel('f-g','g',tr('goal'),goalOptions(gs))}
    <div class="two">${tf('f-d','d',tr('depDate'),`type="date" max="${t}" value="${pre.d||t}"`)}${tf('f-n','n',tr('noteOpt'),`maxlength="60" value="${esc(gen(pre.n||''))}"`)}</div>`,
  tr('log'),f=>{const a=money(f.a);if(!a)return tr('errAmt');if(!isYmd(f.d)||f.d>TODAY())return tr('errFuture');
    mutate(s=>{s.ev.push({id:uid(),k:'dep',d:f.d,ts:Date.now(),a,g:f.g||null,n:pre.n&&(f.n||'').trim()===gen(pre.n)?pre.n:(f.n||'').trim(),q:s.set.imp,s:pre.s||'man',ref:pre.ref||null});
      if(pre.avoidId){const av=s.ev.find(x=>x.id===pre.avoidId);if(av)av.st='done'}})})}
function sheetAvoid(){
  openSheet(tr('skippedOne'),`<p class="b-s v">${tr('avoidD')}</p>
    ${tf('f-n','n',tr('avoidWhat'),'maxlength="60" placeholder="'+tr('avoidPh')+'"')}${tf('f-a','a',tr('avoidAmt'),'inputmode="decimal"')}`,
  tr('avoidDo'),f=>{const a=money(f.a);if(!(f.n||'').trim())return tr('errAvoid');if(!a)return tr('errAmt');
    mutate(s=>{s.ev.push({id:uid(),k:'avoid',d:TODAY(),ts:Date.now(),a,n:f.n.trim(),st:'open'})})})}
function sheetWd(id){
  const g=S.goals.find(x=>x.id===id);if(!g)return;const saved=goalSaved(S,id);
  openSheet(tr('wdFrom',esc(dmn(g.name))),`<p class="b-s v">${tr('wdD',`<b class="num">${eur(saved)}</b>`)}</p>
    ${tf('f-a','a',tr('wdAmt'),'inputmode="decimal"')}${tf('f-n','n',tr('noteOpt'),'maxlength="60"')}
    ${sw('f-use','use',tr('wdUse'),tr('wdUseD'),!!g.done)}`,
  tr('wdDo'),f=>{const a=money(f.a);if(!a)return tr('errAmt');if(a>saved)return tr('errWdMax',eur(saved));
    mutate(s=>{s.ev.push({id:uid(),k:'wd',d:TODAY(),ts:Date.now(),a,g:id,n:(f.n||'').trim(),use:!!f.use})},'silent');toast(tr('wdDone'))})}
function sheetGoal(id){
  const g=id?S.goals.find(x=>x.id===id):null;
  openSheet(g?tr('goalEdit'):tr('goalNew'),`${tf('f-name','name',tr('goalName'),`maxlength="40" value="${esc(g?dmn(g.name):'')}"`)}
    <div class="two">${tf('f-t','t',tr('goalAmt'),`inputmode="decimal" value="${g?inp(g.t):''}"`)}${tf('f-by','by',tr('goalBy'),`type="date" value="${g&&g.by?g.by:''}"`)}</div>`,
  g?tr('save'):tr('goalCreate'),f=>{const t=money(f.t),name=(f.name||'').trim();if(!name)return tr('errGoalName');if(!t)return tr('errGoalAmt');if(f.by&&!isYmd(f.by))return tr('errDate');
    mutate(s=>{if(g){const x=s.goals.find(y=>y.id===id);x.name=name;x.t=t;x.by=f.by||null}else s.goals.push({id:uid(),name,t,by:f.by||null,c:TODAY()})},'quiet');if(g)toast(tr('goalSaved'))},
  g?`<button type="button" class="btn danger st" data-act="goalDel" data-id="${id}" data-arm="1">${tr('delete')}</button>`:'')}
function dayOptions(r,s){return r==='m'?Array.from({length:28},(_,i)=>`<option value="${i+1}" ${s===i+1?'selected':''}>${tr('dayN',i+1)}</option>`).join(''):tr('wd').map((w,i)=>`<option value="${i+1}" ${s===i+1?'selected':''}>${w}</option>`).join('')}
function sheetSettings(){
  const a=S.set.auto||{},r=S.set.r;
  const where=NATIVE?tr('dataPhone'):store.mode==='db'?(store.err?tr('dataErr'):tr('dataAccount')):tr('dataBrowser');
  openSheet(tr('settings'),`<div class="tf"><label>${tr('howOften')}</label>${segm('f',r)}<span class="help">${tr('rhythmChange')}</span></div>
    ${tf('f-imp','imp',tr('commitLabel'),`inputmode="decimal" value="${inp(S.set.imp)}"`)}
    <hr class="divider">
    ${sw('f-autoOn','autoOn',tr('haveAuto'),tr('haveAutoD'),!!a.on)}
    <div class="two">${tf('f-autoAmt','autoAmt',tr('autoAmt'),`inputmode="decimal" value="${inp(a.amt||S.set.imp)}"`)}${sel('f-autoDay','autoDay',tr('autoDay'),dayOptions(r,a.day||1))}</div>
    ${sel('f-autoG','autoG',tr('autoGoal'),goalOptions(a.g||(S.goals[0]||{}).id||''))}
    <hr class="divider">
    ${sel('f-lang','lang',tr('lang'),[['',tr('langAuto')],['en','English'],['it','Italiano']].map(o=>`<option value="${o[0]}" ${o[0]===langPref()?'selected':''}>${o[1]}</option>`).join(''))}
    <hr class="divider">
    <div class="btns"><button type="button" class="btn sm st" data-act="registro">${ic('list',18)}${tr('logOpenBtn')}</button><button type="button" class="btn sm st" data-act="importPick">${ic('upload',18)}${tr('imported')}</button></div>
    <p class="b-s v"><b>${tr('yourData')}</b> ${where}</p>
    ${NATIVE?`<div class="btns"><button type="button" class="btn sm st" data-act="backup">${ic('upload',18)}${tr('backupDo')}</button><input class="sr" type="file" id="bakfile" accept="application/json,.json"><label class="btn sm st" for="bakfile">${tr('restoreFile')}</label></div>`:''}
    <div class="btns"><button type="button" class="btn sm danger st" data-act="wipe" data-arm="1">${tr('wipe')}</button></div>`,
  tr('save'),f=>{const imp=money(f.imp);if(!imp)return tr('errCommit');let auto=null;
    if(f.autoOn){const aa=money(f.autoAmt);if(!aa)return tr('errAuto');const day=+f.autoDay||1,p=S.set.auto;
      auto={on:true,amt:aa,day,g:f.autoG||null,since:(p&&p.on&&p.day===day&&S.set.r===f.r)?p.since:TODAY()}}
    if((f.lang||'')!==langPref())langSave(f.lang);
    mutate(s=>{s.set.r=f.r==='m'?'m':'w';s.set.imp=imp;s.set.auto=auto},'silent');toast(tr('settingsSaved'))})}
function catList(){const s={};['Cibo & Spesa','Bar & Ristoranti','Trasporti','Auto','Shopping','Casa & Utenze','Salute','Tempo libero & Intrattenimento','Multimedia & Elettronica','Viaggi','Giochi e scommesse','Altro'].forEach(c=>s[c]=1);
  const T=curT(),learn=learnMap(T);for(const id in T)for(const r of T[id].rows)if(r.k==='out')s[catOf(r,S.rules,learn)]=1;return Object.keys(s).sort((a,b)=>catName(a).localeCompare(catName(b),LANG))}
function sheetCat(c){
  const T=curT(),ym=curYm(T),learn=learnMap(T),rows=[],cp=(S.caps||{})[c];
  for(const id in T)if(T[id].ym===ym)for(const r of T[id].rows)if(r.k==='out'&&catOf(r,S.rules,learn)===c)rows.push({r,acc:T[id].acc});
  rows.sort((a,b)=>a.r.d<b.r.d?1:-1);const tot=rows.reduce((s,x)=>s-x.r.a,0);
  openSheet(esc(catName(c)),`<p class="b-s v">${tr('catSum',esc(mLabel(ym)),`<b class="num">${eur(tot)}</b>`,tr('nTx',rows.length))}</p>
    <div class="card">${tf('f-cap','cap',tr('capLabel'),`inputmode="decimal" value="${inp(cp)}" placeholder="${tr('capNone')}"`,tr('capHelp'))}</div>
    <div class="list">${rows.map(x=>`<div class="li"><div class="li-t"><div class="t-s">${esc(mDisp(mShow(x.r.n)))}</div><div class="b-s v">${esc(dfS.format(pd(x.r.d)))} · ${esc(ACC[x.acc]||x.acc)}</div></div><div class="li-e"><span class="t-s num">${x.r.a>0?'+':''}${eur(Math.abs(x.r.a))}</span>${S.demo?'':`<button type="button" class="btn sm ghost st" style="min-height:30px;padding:2px 6px" data-act="recat" data-id="${esc(x.r.n)}">${tr('move')}</button>`}</div></div>`).join('')}</div>`,
  tr('capSave'),f=>{const v=money(f.cap);mutate(s=>{s.caps=s.caps||{};s.capSince=s.capSince||{};if(v){if(s.caps[c]!==v)s.capSince[c]=TODAY().slice(0,7);s.caps[c]=v}else{delete s.caps[c];delete s.capSince[c]}},'quiet');toast(v?tr('capSaved',eur(v)):tr('capRemoved'))})}
function sheetRecat(name){
  const k=mKey(name),T=curT(),cur=catOf({n:name,c:''},S.rules,learnMap(T));
  openSheet(tr('moveX',esc(mDisp(mShow(name)))),`<p class="b-s v">${tr('moveD')}</p>
    ${sel('f-cat','cat',tr('category'),catList().map(c=>`<option value="${esc(c)}" ${c===cur?'selected':''}>${esc(catName(c))}</option>`).join(''))}${tf('f-new','nw',tr('categoryNew'),'maxlength="30"')}`,
  tr('move'),f=>{const c=catKey((f.nw||'').trim())||f.cat;if(!c)return tr('errCat');mutate(s=>{s.rules=s.rules||{};s.rules[k]=c},'silent');toast(tr('movedTo',catName(c)))})}

/* ---------- import ---------- */
const PDFJS=NATIVE?'pdfjs/':'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/',PDFN=NATIVE?['pdf.js','pdf.worker.js']:['pdf.min.js','pdf.worker.min.js'];
let pdfReady=null,imp=null;
function loadScript(src){return new Promise((res,rej)=>{const s=document.createElement('script');s.src=src;s.onload=()=>res();s.onerror=()=>rej(new Error('script'));document.head.appendChild(s)})}
function loadPdf(){return pdfReady||(pdfReady=loadScript(PDFJS+PDFN[0]).then(()=>loadScript(PDFJS+PDFN[1])).then(()=>{if(!window.pdfjsLib)throw new Error('lib')}).catch(e=>{pdfReady=null;throw e}))}
async function readPdf(file){
  await loadPdf();const doc=await window.pdfjsLib.getDocument({data:new Uint8Array(await file.arrayBuffer()),isEvalSupported:false,useSystemFonts:true,disableFontFace:true}).promise,pages=[];
  for(let i=1;i<=doc.numPages;i++){const pg=await doc.getPage(i),tc=await pg.getTextContent();pages.push({items:tc.items.filter(t=>t.str&&t.str.trim()).map(t=>({s:t.str,x:t.transform[4],y:t.transform[5]}))})}
  return pages}
function sheetPick(){
  const ids=Object.keys(TX).sort((a,b)=>TX[a].ym<TX[b].ym?1:TX[a].ym>TX[b].ym?-1:a<b?-1:1);
  openSheet(tr('importStmt'),`<p class="b-s v">${NATIVE?tr('pickPhone'):tr('pickBrowser')}</p>
    <div class="card"><div class="hd"><div><h3 class="t-m">N26</h3><p class="b-s v">${tr('pickN26')}</p></div></div>
      <div class="btns"><input class="sr" type="file" id="n26file" accept="application/pdf,.pdf"><label class="btn sm dark st" for="n26file">${ic('upload',18)}${tr('pickPdf')}</label></div></div>
    <div class="card"><div class="hd"><div><h3 class="t-m">Revolut</h3><p class="b-s v">${tr('pickRev')}</p></div></div>
      <div class="btns"><input class="sr" type="file" id="revfile" accept=".csv,text/csv"><label class="btn sm dark st" for="revfile">${ic('upload',18)}${tr('pickCsv')}</label></div></div>
    ${ids.length?`<div><h3 class="t-s">${tr('imported')}</h3><div class="list">${ids.map(id=>`<div class="li" style="min-height:44px"><div class="li-t"><div class="b-s">${esc(ACC[TX[id].acc]||TX[id].acc)} · ${esc(mLabel(TX[id].ym))}</div><div class="b-xs v">${tr('nTxP',TX[id].rows.length)}</div></div><button type="button" class="btn sm danger st" data-act="txDel" data-id="${esc(id)}">${tr('remove')}</button></div>`).join('')}</div></div>`:''}`,'',()=>{})}
async function importFile(file,kind){
  if(!file)return;if(S.demo){toast(tr('impDemo'));return}
  toast(tr('impReading'));
  if(kind==='rev'){let text;try{text=await file.text()}catch(e){toast(tr('errFile'));return}imp={rev:text};sheetRev();return}
  let P;try{P=parseN26(await readPdf(file))}catch(e){toast(tr('errFileN26'));return}
  if(!P.ym||(!P.main.rows.length&&!P.spaces.length)){toast(tr('errNotN26'));return}
  imp={P,rows:n26Tx(P)};sheetImport()}
function sheetRev(){
  const R=revTx(imp.rev,S.holder);
  if(R.error){openSheet(tr('revHead'),`<p class="b-s">${tr('revBad',R.error==='vuoto'?tr('revEmpty'):'')}</p>`,'',()=>{});return}
  const ms=Object.keys(R.months).sort(),sk=R.skip,notes=[];
  if(sk.cur)notes.push(tr('revSkCur',sk.cur));if(sk.savings)notes.push(tr('revSkSav',sk.savings));if(sk.state)notes.push(tr('revSkState',sk.state));
  openSheet(tr('revHead'),`<div class="card"><p class="b-s">${tr('revRead',`<b class="num">${R.n}</b>`,ms.length)}${notes.length?tr('revSkipped',notes.join(', ')):''}</p>
      <div class="list">${ms.map(ym=>{const out=R.months[ym].filter(r=>r.k==='out').reduce((s,r)=>s-r.a,0);return `<div class="li" style="min-height:40px"><div class="li-t b-s">${esc(mLabel(ym))}</div><div class="li-e b-s num">${tr('revRow',R.months[ym].length,eur(out))}</div></div>`}).join('')}</div></div>
    ${tf('f-holder','holder',tr('holder'),`maxlength="60" value="${esc(S.holder||'')}"`,tr('holderD'))}
    <p class="b-xs v">${tr('revCats')}</p>`,
  ms.length?tr('import'):'',f=>{const holder=(f.holder||'').trim(),R2=revTx(imp.rev,holder||S.holder);let n=0;
    Object.keys(R2.months).forEach(ym=>{txSave('revolut_'+ym,{acc:'revolut',ym,rows:R2.months[ym],at:TODAY()});n+=R2.months[ym].length});
    ui.ym=Object.keys(R2.months).sort().pop();ui.tab='spese';if(holder&&holder!==S.holder)mutate(s=>{s.holder=holder},'silent');else render();
    toast(tr('revDone',n))})}
function sheetImport(){
  const P=imp.P,label=mLabel(P.ym),act=P.spaces.filter(sp=>sp.rows.length),m=spendMonth({x:{acc:'n26',ym:P.ym,rows:imp.rows}},S,P.ym);let can=0;
  const spaces=act.map((sp,i)=>{const pl=n26Plan(S,P,sp,null),mem=((S.n26||{})[pl.key]||{}).goal,same=S.goals.find(g=>g.name.toLowerCase()===sp.name.toLowerCase());
    const def=S.goals.some(g=>g.id===mem)?mem:same?same.id:(S.goals[0]||{}).id||'';
    const nIn=sp.rows.filter(r=>r.amt>0).length,nOut=sp.rows.filter(r=>r.amt<0).length;let tail;
    if(pl.older)tail=`<p class="errtxt">${tr('impOlder',esc(mLow(P.ym)))}</p>`;
    else if(!pl.add.length)tail=`<p class="b-s v">${tr('impNothing')}</p>`;
    else{can++;tail=`<p class="b-s v">${tr('impNew',`<b class="num">${pl.add.length}</b>`)}</p>${sel('f-sp'+i,'sp'+i,tr('impInto'),goalOptions(def)+'<option value="__skip">'+tr('impSkip')+'</option>')}`}
    return `<div class="card"><div class="hd"><h3 class="t-m">${tr('spaceN',esc(sp.name))}</h3><span class="chip ${sp.ok?'g':'c'}">${ic(sp.ok?'check':'warn',15)}${sp.ok?tr('totalsOk'):tr('totalsCheck')}</span></div>
      <p class="b-s">${tr('spaceSum',`<b class="num">${eur(sp.inc)}</b>`,nIn,`<b class="num">${eur(-sp.out)}</b>`,nOut,`<b class="num">${eur(sp.end||0)}</b>`)}</p>${tail}</div>`}).join('');
  openSheet(tr('stmtOf',label),`<div class="card"><div class="hd"><h3 class="t-m">${tr('mainAcc')}</h3><span class="chip ${P.main.ok?'g':'c'}">${ic(P.main.ok?'check':'warn',15)}${P.main.ok?tr('totalsOk'):tr('totalsCheck')}</span></div>
      <p class="b-s">${tr('mainSum',`<b class="num">${P.main.rows.length}</b>`,`<b class="num">${eur(m.out)}</b>`,m.cats.length)} ${TX['n26_'+P.ym]?tr('impReplace'):tr('impGoes')}</p></div>${spaces}
    ${can?`<p class="b-xs v">${tr('impWd')}</p>`:''}`,
  tr('import'),f=>{const jobs=[];let n=0;
    act.forEach((sp,i)=>{const v=f['sp'+i];if(v===undefined||v==='__skip')return;const pl=n26Plan(S,P,sp,v||null);if(pl.older||!pl.add.length)return;jobs.push({sp,pl,goal:v||null});n+=pl.add.length});
    txSave('n26_'+P.ym,{acc:'n26',ym:P.ym,rows:imp.rows,at:TODAY()});ui.ym=P.ym;if(!n)ui.tab='spese';
    mutate(s=>{let i=0;s.n26=s.n26||{};if(P.holder)s.holder=P.holder;for(const j of jobs){for(const e of j.pl.add){i++;s.ev.push(Object.assign({id:uid()+i,ts:Date.now()+i,q:s.set.imp},e))}
      const old=(s.n26[j.pl.key]||{}).months||[];s.n26[j.pl.key]={name:j.sp.name,goal:j.goal,months:Array.from(new Set(old.concat(P.ym))).sort()}}},'quiet');
    toast(tr('impDone',mLow(P.ym),P.main.rows.length,n?tr('impDoneSp',n):''))})}

function sheetRestore(text){
  let b=null;try{b=JSON.parse(text)}catch(e){}
  if(!b||b.app!=='gruzzolo'||!b.state){toast(tr('bakBad'));return}
  const st=normalize(b.state),tx=b.tx&&typeof b.tx==='object'?b.tx:{},n=Object.keys(tx).length;
  openSheet(tr('bakHead'),`<p class="b-s">${tr('bakSum',`<b>${esc(b.at&&isYmd(b.at)?dfL.format(pd(b.at)):tr('bakNoDate'))}</b>`,st.goals.length,st.ev.length,n)}</p><p class="errtxt">${tr('bakWarn')}</p>`,
  tr('bakDo'),()=>{Object.keys(TX).forEach(txDel);for(const id in tx)if(tx[id]&&Array.isArray(tx[id].rows))txSave(id,tx[id]);S=st;ui.tab='oggi';commit();toast(tr('bakDone'))})}
window.onNativeSaved=ok=>toast(ok?tr('bakSaved'):tr('bakCancelled'));
window.gzBack=()=>{if(cdlg.open){ACT.celeClose();return true}if(dlg.open){closeSheet();return true}if(ui.tab!=='oggi'&&hasData(S)){ACT.tab('oggi');return true}return false};

/* ---------- actions ---------- */
function armed(btn,label){if(btn.dataset.arm==='1'){btn.dataset.arm='2';btn.textContent=label;return false}return true}
const ACT={
  tab(id){ui.tab=id;try{localStorage.setItem('gruzzolo.tab',id)}catch(e){}closeSheet();render();if(id==='coach')scrollChat();else window.scrollTo(0,0)},
  close(){closeSheet()},
  celeClose(){try{cdlg.close()}catch(e){cdlg.removeAttribute('open')}},
  settings(){sheetSettings()},
  registro(){ACT.tab('registro')},
  seg(id){ui.seg=id;render()},
  medal(id){sheetMedal(id)},
  pinPick(){sheetPin()},
  pin(id){mutate(s=>{s.pin=id},'silent');closeSheet();ui.tab='premi';ui.seg='med';render();window.scrollTo(0,0);toast(tr('pinDone'))},
  ym(id){ui.ym=id;render()},
  dep(id){sheetDep(id?{g:id}:{})},
  avoid(){sheetAvoid()},
  wd(id){sheetWd(id)},
  goal(id){sheetGoal(id)},
  goalDel(id,b){if(!armed(b,tr('confirmDelete')))return;mutate(s=>{s.goals=s.goals.filter(g=>g.id!==id);s.ev.forEach(e=>{if(e.g===id)e.g=null});if(s.set.auto&&s.set.auto.g===id)s.set.auto.g=null},'silent');closeSheet();toast(tr('goalDeleted'))},
  conv(id){const e=S.ev.find(x=>x.id===id);if(e)sheetDep({a:e.a,n:e.n,s:'avoid',ref:'av:'+id,avoidId:id,title:tr('transferLog')})},
  drop(id){mutate(s=>{const e=s.ev.find(x=>x.id===id);if(e)e.st='drop'},'silent')},
  autoOk(d){const a=S.set.auto;if(!a)return;mutate(s=>{s.ev.push({id:uid(),k:'dep',d,ts:Date.now(),a:a.amt,g:s.goals.some(g=>g.id===a.g)?a.g:null,n:'',q:s.set.imp,s:'auto',ref:'auto:'+d})})},
  autoNo(d){mutate(s=>{s.ev.push({id:uid(),k:'skip',d,ts:Date.now(),a:0,ref:'auto:'+d})},'silent')},
  raise(v){mutate(s=>{s.set.imp=+v},'silent');toast(tr('commitSaved'))},
  del(id,b){if(b.dataset.arm!=='2'){b.dataset.arm='2';b.textContent=tr('confirm');return}
    mutate(s=>{const e=s.ev.find(x=>x.id===id);if(!e)return;if(e.ref&&e.ref.indexOf('av:')===0){const av=s.ev.find(x=>x.id===e.ref.slice(3));if(av)av.st='open'}s.ev=s.ev.filter(x=>x.id!==id)},'silent');toast(tr('entryDeleted'))},
  c52start(){mutate(s=>{s.ch.c52={start:TODAY()}},'silent')},
  c52(v){sheetDep({a:+v*100,lock:true,s:'c52',ref:'c52:'+v,title:tr('c52Sheet',v)})},
  nsStart(_,b){if(!armed(b,tr('nsConfirm')))return;mutate(s=>{s.ch.ns={start:TODAY(),days:[]}},'silent')},
  ns(d){const t=TODAY();if(d!==t&&d!==addDays(t,-1))return;mutate(s=>{const n=s.ch.ns;if(!n)return;const i=n.days.indexOf(d);if(i>=0)n.days.splice(i,1);else n.days.push(d)})},
  subCut(id){mutate(s=>{const x=s.ch.subs.find(y=>y.id===id);if(x)x.cut=!x.cut})},
  subDel(id){mutate(s=>{s.ch.subs=s.ch.subs.filter(y=>y.id!==id)},'silent')},
  subsAdd(ym){const m=spendMonth(curT(),S,ym);let n=0;mutate(s=>{for(const x of m.subs)if(!s.ch.subs.some(y=>y.n.toLowerCase()===x.name.toLowerCase())){s.ch.subs.push({id:uid()+n,n:x.name,a:x.a,cut:false});n++}},'silent');
    ui.tab='premi';ui.seg='sfi';render();window.scrollTo(0,document.documentElement.scrollHeight);toast(n?tr('subsAdded',n):tr('subsAlready'))},
  cat(c){sheetCat(c)},
  capFor(c){sheetCat(c);setTimeout(()=>{const i=$('f-cap');if(i)i.focus()},60)},
  capRest(id){const p=id.split('|'),c=p[0],ym=p[1],m=spendMonth(curT(),S,ym),x=m.cats.find(y=>y.c===c),rest=((S.caps||{})[c]||0)-(x?x.a:0);if(rest<100)return;
    mutate(s=>{s.ev.push({id:uid(),k:'avoid',d:TODAY(),ts:Date.now(),a:rest,n:('Resto del tetto '+c+', '+dfMYit.format(pd(ym+'-01')).toLowerCase()).slice(0,60),st:'open',ref:'cap:'+c+':'+ym})});ui.tab='oggi';render();window.scrollTo(0,0)},
  recat(name){sheetRecat(name)},
  importPick(){sheetPick()},
  txDel(id,b){if(b.dataset.arm!=='2'){b.dataset.arm='2';b.textContent=tr('confirm');return}txDel(id);sheetPick();render()},
  coachAsk(ym){ui.tab='coach';render();ask(tr('coachAsk',mLow(ym)))},
  q(t){ask(t)},
  chatStop(){if(chat.ctl)chat.ctl.abort()},
  chatNew(){chat.turns=[];chat.note='';saveChat();render()},
  wipe(_,b){if(!armed(b,tr('wipeConfirm')))return;Object.keys(TX).forEach(txDel);S=blank();chat.turns=[];saveChat();ui.tab='oggi';commit();closeSheet()},
  wipeDemo(){S=blank();ui.tab='oggi';commit()},
  backup(){const name='gruzzolo-'+TODAY()+'.json',text=JSON.stringify({app:'gruzzolo',v:1,at:TODAY(),state:S,tx:TX});try{window.GruzzoloNative.saveFile(name,text)}catch(e){toast(tr('bakFailed'))}},
  demo(){S=demoData();ui.tab='oggi';commit()}
};
const FREE=['tab','close','celeClose','seg','ym','chatStop','medal','pinPick'];
document.addEventListener('click',e=>{
  const chip=e.target.closest('[data-chip]');if(chip){const i=$('f-a');if(i){i.value=chip.dataset.chip;i.focus()}return}
  const bar=e.target.closest('[data-bar]');if(bar){showBar(bar);return}
  const b=e.target.closest('[data-act]');if(!b||b.disabled)return;const a=b.dataset.act,f=ACT[a];if(!f)return;
  if(!store.ready&&FREE.indexOf(a)<0){toast(tr('loading'));return}
  f(b.dataset.id,b)});
function showBar(el){const p=periods(S,TODAY()).list[+el.dataset.bar],rd=$('rd');if(p&&rd)rd.innerHTML=readout(p)}
document.addEventListener('pointerover',e=>{const b=e.target.closest&&e.target.closest('[data-bar]');if(b)showBar(b)});
document.addEventListener('focusin',e=>{const b=e.target.closest&&e.target.closest('[data-bar]');if(b)showBar(b)});
document.addEventListener('change',e=>{
  if(e.target.id==='bakfile'){const f=e.target.files&&e.target.files[0];e.target.value='';if(f)f.text().then(sheetRestore).catch(()=>toast(tr('errFile')));return}
  if(e.target.id==='n26file'||e.target.id==='revfile'){const f=e.target.files&&e.target.files[0],k=e.target.id==='revfile'?'rev':'n26';e.target.value='';if(!store.ready){toast(tr('loading'));return}importFile(f,k);return}
  if(e.target.name==='r'&&e.target.closest('#sheetForm')){const s=$('f-autoDay');if(s)s.innerHTML=dayOptions(e.target.value,1)}});
document.addEventListener('input',e=>{
  if(e.target.id==='ask-q'){chat.draft=e.target.value;return}
  const f=e.target.closest&&e.target.closest('#ob');if(!f)return;
  if(e.target.id==='ob-imp'){e.target.dataset.touched='1';return}
  const t=money(f.elements.t.value),by=f.elements.by.value,r=f.elements.r.value,hint=$('ob-imp-help'),im=$('ob-imp');
  if(t&&isYmd(by)&&by>TODAY()){const days=diffDays(TODAY(),by),n=Math.max(1,Math.ceil(r==='m'?days/30.44:days/7)),per=Math.ceil(t/n/100)*100;
    hint.textContent=tr('obHint',eur(per),r==='m');if(!im.dataset.touched)im.value=inp(per)}
  else hint.textContent=tr('commitHelp')});
document.addEventListener('keydown',e=>{if(e.target.id==='ask-q'&&e.key==='Enter'&&!e.shiftKey){e.preventDefault();const v=e.target.value;if(v.trim())ask(v)}});
document.addEventListener('submit',e=>{
  e.preventDefault();const f=Object.fromEntries(new FormData(e.target));
  if(e.target.id==='askf'){ask(f.q);return}
  if(e.target.id==='sheetForm'){const err=sheetSubmit?sheetSubmit(f):null,el=$('sheetErr');if(err){if(el){el.textContent=err;el.hidden=false}}else closeSheet();return}
  if(e.target.id==='ob'){const el=$('ob-err'),fail=m=>{el.textContent=m;el.hidden=false};
    if(!store.ready)return fail(tr('loading'));
    const name=(f.name||'').trim(),t=money(f.t),im=money(f.imp);
    if(!name)return fail(tr('errGoalName'));if(!t)return fail(tr('errGoalAmt'));
    if(f.by&&(!isYmd(f.by)||f.by<=TODAY()))return fail(tr('errByFuture'));
    if(!im)return fail(tr('errCommitOb'));
    S=blank();S.set.r=f.r==='m'?'m':'w';S.set.imp=im;S.goals.push({id:uid(),name,t,by:f.by||null,c:TODAY()});ui.tab='oggi';commit();window.scrollTo(0,0);return}
  if(e.target.id==='subf'){if(!store.ready)return;const n=(f.n||'').trim(),a=money(f.a);if(!n||!a){toast(tr('errSub'));return}
    mutate(s=>{s.ch.subs.push({id:uid(),n,a,cut:false})},'silent')}});

/* ---------- example data ---------- */
function demoData(){
  const s=blank(),t=TODAY(),w0=pKey(t,'w');s.demo=true;s.set.imp=2500;s.caps={'Bar & Ristoranti':12000};s.capSince={'Bar & Ristoranti':'2000-01'};
  const g1=uid(),g2=uid()+'b';
  s.goals.push({id:g1,name:'Fondo imprevisti',t:150000,by:addDays(t,7*34),c:addDays(w0,-63)},{id:g2,name:'Bici nuova',t:60000,by:addDays(t,7*22),c:addDays(w0,-63)});
  let n=0;const ev=o=>{s.ev.push(Object.assign({id:'d'+(n++),ts:n,q:2500,s:'man',ref:null,n:''},o))};
  for(let w=9;w>=1;w--){if(w===5)continue;const mon=addDays(w0,-7*w);
    ev({k:'dep',d:addDays(mon,1),a:2500,g:g1});
    if(w%3===0){const av='da'+w;s.ev.push({id:av,k:'avoid',d:addDays(mon,3),ts:n,a:1400,n:'Cena a domicilio',st:'done'});ev({k:'dep',d:addDays(mon,4),a:1400,g:g2,s:'avoid',ref:'av:'+av,n:'Cena a domicilio'})}}
  if(t>w0)ev({k:'dep',d:w0,a:1500,g:g1});
  s.ev.push({id:'dopen',k:'avoid',d:t,ts:n+1,a:1200,n:'Pranzo fuori',st:'open'});
  s.ch.subs.push({id:'s1',n:'Streaming video',a:1399,cut:true},{id:'s2',n:'Palestra che non uso',a:3900,cut:false});
  return s}
let demoT=null;
function demoTx(){
  if(demoT)return demoT;const t=TODAY(),m1=pKey(addDays(pKey(t,'m'),-1),'m').slice(0,7),m0=pKey(addDays(m1+'-01',-1),'m').slice(0,7);demoT={};
  const base=[['Supermercato Aurora',-6240,'Cibo & Spesa',3],['Supermercato Aurora',-4810,'Cibo & Spesa',11],['Forno del Corso',-1150,'Cibo & Spesa',16],['Mercato rionale',-2350,'Cibo & Spesa',22],
    ['Bar Centrale',-130,'Bar & Ristoranti',2],['Bar Centrale',-260,'Bar & Ristoranti',6],['Bar Centrale',-130,'Bar & Ristoranti',9],['Bar Centrale',-380,'Bar & Ristoranti',15],['Bar Centrale',-130,'Bar & Ristoranti',20],
    ['Pizzeria Da Lino',-2800,'Bar & Ristoranti',12],['Consegne a domicilio',-2150,'Bar & Ristoranti',18],['Consegne a domicilio',-1890,'Bar & Ristoranti',25],
    ['Video in streaming Premium',-1399,'Multimedia & Elettronica',5],['Musica Plus',-1099,'Multimedia & Elettronica',5],['Distributore',-5500,'Auto',8],['Abbonamento trasporti',-3500,'Trasporti',1],
    ['Emporio online',-3990,'Shopping',14],['Abbigliamento',-6400,'Shopping',23],['Farmacia',-1420,'Salute',19],['Commissione ricarica',-300,'Commissioni',4]];
  [[m0,1],[m1,1.25]].forEach(([ym,k])=>{const rows=base.map(b=>({d:ym+'-'+pad(b[3]),a:b[2]==='Bar & Ristoranti'?Math.round(b[1]*k):b[1],n:b[0],c:b[2],k:'out'}));
    rows.push({d:ym+'-27',a:165000,n:'Stipendio',c:'',k:'in'},{d:ym+'-02',a:-10000,n:'Al salvadanaio',c:'',k:'space'});demoT['demo_'+ym]={acc:'n26',ym,rows}});
  return demoT}

boot();
