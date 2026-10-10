
/* level thresholds, mission and medal definitions: every name and description is in i18n.js */
const LEVELS=[0,150,400,800,1400,2200,3200,4500,6000];
const MISS={early:'clock',avoid:'bagoff',extra:'trend',twice:'repeat',c52:'grid',ns:'cal'};
const pad=n=>String(n).padStart(2,'0');
const ymd=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const pd=s=>{const p=String(s).split('-').map(Number);return new Date(p[0],p[1]-1,p[2],12)};
const addDays=(s,n)=>{const d=pd(s);d.setDate(d.getDate()+n);return ymd(d)};
const diffDays=(a,b)=>Math.round((pd(b)-pd(a))/864e5);
const isYmd=s=>/^\d{4}-\d{2}-\d{2}$/.test(s||'')&&ymd(pd(s))===s;
function pKey(s,r){if(r==='m')return s.slice(0,8)+'01';return addDays(s,-((pd(s).getDay()+6)%7))}
function pNext(k,r){if(r==='m'){const d=pd(k);d.setMonth(d.getMonth()+1);return ymd(d)}return addDays(k,7)}
function pPrev(k,r){return r==='m'?pKey(addDays(k,-1),'m'):addDays(k,-7)}
function pEnd(k,r){return addDays(pNext(k,r),-1)}
function blank(){return{v:1,demo:false,set:{r:'w',imp:2000,auto:null},goals:[],ev:[],ch:{c52:null,ns:null,subs:[]},n26:{},rules:{},caps:{},capSince:{},holder:'',won:{},pin:null}}
function normalize(d){const b=blank();if(!d||typeof d!=='object')return b;
  b.demo=!!d.demo;if(d.set){b.set.r=d.set.r==='m'?'m':'w';b.set.imp=d.set.imp>0?d.set.imp:2000;b.set.auto=d.set.auto||null}
  b.goals=Array.isArray(d.goals)?d.goals:[];b.ev=Array.isArray(d.ev)?d.ev.filter(e=>e&&isYmd(e.d)):[];
  if(d.ch){b.ch.c52=d.ch.c52||null;b.ch.ns=d.ch.ns&&Array.isArray(d.ch.ns.days)?d.ch.ns:null;b.ch.subs=Array.isArray(d.ch.subs)?d.ch.subs:[]}
  if(d.n26&&typeof d.n26==='object')b.n26=d.n26;
  if(d.rules&&typeof d.rules==='object')b.rules=d.rules;if(d.caps&&typeof d.caps==='object')b.caps=d.caps;if(d.capSince&&typeof d.capSince==='object')b.capSince=d.capSince;if(typeof d.holder==='string')b.holder=d.holder;if(d.won&&typeof d.won==='object')b.won=d.won;if(typeof d.pin==='string')b.pin=d.pin;
  return b}
function goalSaved(st,id){let s=0;for(const e of st.ev)if(e.g===id){if(e.k==='dep')s+=e.a;else if(e.k==='wd')s-=e.a}return s}
function totalSaved(st){let s=0;for(const e of st.ev){if(e.k==='dep')s+=e.a;else if(e.k==='wd')s-=e.a}return s}
function nsDays(st){const n=st.ch.ns;if(!n)return[];const end=addDays(n.start,29);return n.days.filter(d=>d>=n.start&&d<=end)}
function missionIds(k){let h=7;for(let i=0;i<k.length;i++)h=(Math.imul(h,31)+k.charCodeAt(i))>>>0;const ids=Object.keys(MISS),out=[];
  for(let i=0;i<3;i++){h=(Math.imul(h,1103515245)+12345)>>>0;out.push(ids.splice((h>>>16)%ids.length,1)[0])}return out}
function periods(st,today){
  const r=st.set.r,cur=pKey(today,r),A={},get=k=>A[k]||(A[k]={sum:0,n:0,q:0,ns:0,wd:0,early:false,avoid:false,c52:false});let first=cur;
  for(const e of st.ev){
    if(e.k==='wd'){if(e.use)continue;const k=pKey(e.d,r);if(k>cur)continue;const a=get(k);a.sum-=e.a;a.wd+=e.a;if(k<first)first=k;continue}
    if(e.k!=='dep'||e.s==='open')continue;const k=pKey(e.d,r);if(k>cur)continue;const a=get(k);a.sum+=e.a;a.n++;if(e.q>0)a.q=e.q;
    if(diffDays(k,e.d)<(r==='m'?5:2))a.early=true;if(e.s==='avoid')a.avoid=true;if(e.s==='c52')a.c52=true;if(k<first)first=k}
  for(const d of nsDays(st)){const k=pKey(d,r);if(k>=first&&k<=cur)get(k).ns++}
  const list=[];let streak=0,jolly=0,hits=0,best=0,n=0;
  for(let k=first;k<=cur&&n<3000;k=pNext(k,r),n++){
    const a=A[k]||{sum:0,n:0,q:0,ns:0,wd:0},s=a.sum,t=k===cur?st.set.imp:(a.q||st.set.imp),hit=s>0&&s>=t;let status;
    if(hit){streak++;hits++;if(hits%4===0&&jolly<2)jolly++;status='hit'}
    else if(k===cur)status='open';
    else if(jolly>0&&streak>0){jolly--;status='jolly'}
    else{streak=0;status='miss'}
    if(streak>best)best=streak;
    const m=missionIds(k).map(id=>({id,done:id==='early'?!!a.early:id==='avoid'?!!a.avoid:id==='extra'?s>0&&s>=Math.ceil(t*1.2):id==='twice'?a.n>=2:id==='c52'?!!a.c52:a.ns>=(r==='m'?10:3)}));
    list.push({k,s,t,status,streak,wd:a.wd,m,md:m.filter(x=>x.done).length})}
  return{list,streak,jolly,best,cur:list[list.length-1]}}
function score(st,today,T){
  const P=periods(st,today),parts={};let xp=0;const add=(k,n)=>{if(n){xp+=n;parts[k]=(parts[k]||0)+n}};
  for(const e of st.ev){if(e.k==='dep'){if(e.s==='open')continue;add('dep',20);if(e.s==='avoid')add('conv',10);if(e.s==='c52')add('c52',15)}else if(e.k==='avoid')add('avoid',5)}
  for(const p of P.list){if(p.status==='hit')add('period',100+10*Math.min(p.streak,10));add('miss',30*p.md+(p.md===3?60:0))}
  for(const g of st.goals){const f=g.t>0?goalSaved(st,g.id)/g.t:0;if(f>=.25)add('ms',50);if(f>=.5)add('ms',75);if(f>=.75)add('ms',100);if(f>=1)add('ms',250)}
  const nd=nsDays(st).length;add('ns',10*nd+(nd>=25?200:0));
  add('subs',40*st.ch.subs.filter(x=>x.cut).length);
  const capsOk=T?capResults(st,T,today).filter(x=>x.closed&&x.ok&&x.counts).length:0;add('caps',80*capsOk);
  let lv=0;for(let i=0;i<LEVELS.length;i++)if(xp>=LEVELS[i])lv=i;
  return{xp,lv,name:tr('levels')[lv],base:LEVELS[lv],nextAt:LEVELS[lv+1]||null,nextName:tr('levels')[lv+1]||null,parts,P,capsOk}}
function c52Set(st){const s=new Set();for(const e of st.ev)if(e.k==='dep'&&e.s==='c52'&&e.ref)s.add(+e.ref.slice(4));return s}
function medals(st,sc){
  const m=st.set.r==='m',L=sc.P.list;let nDep=0,nConv=0,nAuto=0,over=0,tris=0,back=0,hold=0,bal=0,peak=0;
  for(const e of st.ev)if(e.k==='dep'&&e.s!=='open'){nDep++;if(e.s==='avoid')nConv++;if(e.s==='auto')nAuto++}
  st.ev.filter(e=>e.k==='dep'||e.k==='wd').sort((a,b)=>a.d<b.d?-1:a.d>b.d?1:(a.ts||0)-(b.ts||0)).forEach(e=>{bal+=e.k==='dep'?e.a:-e.a;if(bal>peak)peak=bal});
  L.forEach((p,i)=>{if(i<L.length-1&&p.s>0&&!p.wd)hold++;if(p.s>0&&p.s>=p.t*1.5)over++;if(p.md===3)tris++;if(p.status==='hit'&&i>0&&L[i-1].status==='miss')back++});
  const D=[
    ['streak','flame',sc.P.best,m?[2,6,12]:[4,12,26]],
    ['hold','lock',hold,m?[2,6,12]:[4,12,26]],
    ['peak','coins',Math.floor(peak/100),[100,1000,5000],1],
    ['deps','wallet',nDep,[1,10,50]],
    ['goals','flag',st.goals.filter(g=>g.done).length,[1,2,4]],
    ['conv','bagoff',nConv,[1,5,20]],
    ['auto','auto',nAuto,[1,4,12]],
    ['over','trend',over,[1,5,10]],
    ['tris','star',tris,[1,5,15]],
    ['back','restart',back,[1,2,3]],
    ['cells','grid',c52Set(st).size,[13,26,52]],
    ['ns','cal',nsDays(st).length,[10,25,30]],
    ['cuts','cut',st.ch.subs.filter(x=>x.cut).length,[1,3,5]],
    ['caps','tag',sc.capsOk||0,[1,3,6]]];
  const N=tr('medal'),DS=tr('medalDo');
  return D.map(x=>{let tier=0;for(const th of x[3])if(x[2]>=th)tier++;return{id:x[0],ic:x[1],n:N[x[0]],d:DS[x[0]](m),val:x[2],th:x[3],tier,next:x[3][tier]||null,money:!!x[4]}})}
function goalPlan(st,g,today){
  const saved=goalSaved(st,g.id),left=Math.max(0,g.t-saved);let per=null,nPer=null,late=false;
  if(g.by&&left>0){const days=diffDays(today,g.by);late=days<0;nPer=days<=0?1:Math.max(1,Math.ceil(st.set.r==='m'?days/30.44:days/7));per=Math.ceil(left/nPer/100)*100}
  return{saved,left,per,nPer,late,frac:g.t>0?Math.max(0,Math.min(1,saved/g.t)):0}}
function suggested(st,today){return st.goals.reduce((s,g)=>s+(goalPlan(st,g,today).per||0),0)}
function goalEta(st,g,today){
  const r=st.set.r,created=pKey(g.c&&isYmd(g.c)?g.c:today,r),keys=new Set();let k=pKey(today,r),n=0;
  while(n<8&&k>=created){keys.add(k);n++;k=pPrev(k,r)}
  let s=0;for(const e of st.ev)if(e.g===g.id&&keys.has(pKey(e.d,r)))s+=e.k==='dep'?e.a:e.k==='wd'?-e.a:0;
  const pace=s/Math.max(1,n),left=Math.max(0,g.t-goalSaved(st,g.id));
  if(left===0)return{pace,done:true,eta:null};if(pace<=0)return{pace:0,eta:null};
  const m=Math.ceil(left/pace);if(m>1200)return{pace,eta:null};
  let eta;if(r==='m'){const d=pd(today);d.setDate(1);d.setMonth(d.getMonth()+m);eta=ymd(d)}else eta=addDays(today,7*m);
  return{pace,eta}}
function autoDue(st,today){
  const a=st.set.auto;if(!a||!a.on||!isYmd(a.since))return[];
  const done=new Set();for(const e of st.ev)if(e.ref&&e.ref.indexOf('auto:')===0)done.add(e.ref.slice(5));
  const out=[];let d=today;
  for(let i=0;i<200&&d>=a.since&&out.length<6;i++,d=addDays(d,-1)){
    const D=pd(d),m=st.set.r==='m'?D.getDate()===a.day:((D.getDay()+6)%7+1)===a.day;
    if(m&&!done.has(d))out.push(d)}
  return out.reverse()}
function parseN26(pages){
  const num=s=>Math.round(parseFloat(s.replace(/[€\s]/g,'').replace(/\./g,'').replace(',','.'))*100);
  const iso=s=>s.slice(6)+'-'+s.slice(3,5)+'-'+s.slice(0,2);
  const reD=/^\d{2}\.\d{2}\.\d{4}$/,reA=/^[+-]?[\d.]+,\d{2}\s*€$/;
  const out={ym:null,main:{rows:[],ov:{}},spaces:[]};let space=null;
  const getSpace=n=>{let s=out.spaces.find(x=>x.name===n);if(!s){s={name:n,rows:[],ov:{}};out.spaces.push(s)}return s};
  for(const pg of pages){
    if(!out.holder){const h=pg.items.filter(i=>i.y>62&&i.y<=75&&i.x<200&&String(i.s).trim())[0];if(h)out.holder=String(h.s).trim()}
    const its=pg.items.map(i=>({s:String(i.s).trim(),x:i.x,y:i.y})).filter(i=>i.s&&i.y>75).sort((a,b)=>b.y-a.y||a.x-b.x);
    if(!its.length)continue;
    const title=its[0].s,m=title.match(/N\.\s*(\d{2})\/(\d{4})/);if(m&&!out.ym)out.ym=m[2]+'-'+m[1];
    let kind=null;
    if(/^Estratto conto N\./.test(title))kind='main';else if(/^Movimenti dello Spazio/.test(title))kind='space';
    else if(/^Panoramica di spaces/i.test(title))kind='spaceov';else if(/^Panoramica N\./.test(title))kind='mainov';else continue;
    if(kind==='space'||kind==='spaceov'){const sp=its.find(i=>/^Spazio:/.test(i.s));if(!sp)continue;space=getSpace(sp.s.replace(/^Spazio:\s*/,''));
      const op=its.find(i=>/^Data di apertura:/.test(i.s)),cl=its.find(i=>/^Data di chiusura:/.test(i.s));
      if(op)space.opened=iso(op.s.slice(-10));if(cl)space.closed=iso(cl.s.slice(-10))}
    const hdr=its.find(i=>i.s==='Descrizione');if(!hdr)continue;
    const body=its.filter(i=>i.y<hdr.y-5),left=body.filter(i=>i.x<300),right=body.filter(i=>i.x>=300);
    const tgt=kind==='main'||kind==='mainov'?out.main:space;
    const anchors=[];
    for(const a of right){if(!reA.test(a.s))continue;const d=right.find(o=>reD.test(o.s)&&Math.abs(o.y-a.y)<=2);
      if(d)anchors.push({y:a.y,date:iso(d.s),amt:num(a.s)});
      else{const l=left.find(o=>Math.abs(o.y-a.y)<=3);if(l)tgt.ov[l.s]=num(a.s)}}
    if(kind!=='main'&&kind!=='space')continue;
    anchors.sort((a,b)=>b.y-a.y);
    anchors.forEach((a,i)=>{const lo=i+1<anchors.length?anchors[i+1].y+5:-1e9;
      const mine=left.filter(o=>o.y<=a.y+5&&o.y>lo),sub=[];let name='';
      mine.forEach((o,j)=>{if(j===0&&o.y>=a.y-1)name=o.s;else if(!/^Valuta \d/.test(o.s))sub.push(o.s)});
      tgt.rows.push({date:a.date,amt:a.amt,name,sub})})}
  const chk=t=>{const o=t.rows.reduce((s,r)=>s+(r.amt<0?r.amt:0),0),i=t.rows.reduce((s,r)=>s+(r.amt>0?r.amt:0),0);
    t.out=o;t.inc=i;t.ok=t.ov['Operazioni in uscita']===o&&t.ov['Operazioni in entrata']===i;t.prev=t.ov['Saldo precedente']||0;t.end=t.ov['Il tuo nuovo saldo']};
  chk(out.main);out.spaces.forEach(chk);return out}
function n26Key(n){return String(n).replace(/[^A-Za-z0-9]/g,'_')||'spazio'}
function n26Plan(st,P,sp,goalId){
  const key=n26Key(sp.name),known=((st.n26||{})[key]||{}).months||[],have=new Set(),add=[];let dup=0;
  for(const e of st.ev)if(e.ref)have.add(e.ref);
  if(known.length&&P.ym<known.slice().sort()[0])return{add,dup,older:true,key};
  const push=o=>{if(have.has(o.ref))dup++;else add.push(o)};
  if(sp.prev>0&&!known.length)push({k:'dep',s:'open',d:P.ym+'-01',a:sp.prev,g:goalId,n:'Saldo iniziale dello Spazio '+sp.name,ref:'n26open:'+key});
  const ru={},cnt={};
  for(const r of sp.rows){const desc=r.sub.join(' ');
    if(r.amt>0&&/^Arrotonda/i.test(desc)){const w=pKey(r.date,'w'),o=ru[w]||(ru[w]={a:0,n:0,d:r.date});o.a+=r.amt;o.n++;if(r.date>o.d)o.d=r.date;continue}
    const base='n26:'+key+':'+r.date+':'+r.amt;cnt[base]=(cnt[base]||0)+1;const ref=base+':'+cnt[base],pc=desc.match(/(\d+)\s*%/);let n;
    if(/Dividi le\s+spese/i.test(desc))n='Dividi le spese'+(pc?' ('+pc[1]+'%)':'');
    else if(/^(Da|A) Conto corrente principale/i.test(r.name))n=desc||(r.amt<0?'Verso il conto principale':'');
    else n=(r.name+(r.sub.length?': '+r.sub[r.sub.length-1]:'')).trim();
    if(r.amt>0)push({k:'dep',s:'n26',d:r.date,a:r.amt,g:goalId,n:n.slice(0,60),ref});
    else if(r.amt<0)push({k:'wd',d:r.date,a:-r.amt,g:goalId,n:n.slice(0,60),ref,use:false})}
  Object.keys(ru).sort().forEach(w=>push({k:'dep',s:'n26',d:ru[w].d,a:ru[w].a,g:goalId,n:'Arrotondamenti ('+ru[w].n+')',ref:'n26ru:'+key+':'+P.ym+':'+w}));
  return{add,dup,older:false,key}}

/* ---------- spending: categories, merchants, levers, caps ---------- */
const BET=/BWIN|SISAL|SNAI|LOTTOMATICA|BET365|EUROBET|GOLDBET|POKERSTARS|WILLIAM ?HILL|BETFAIR|PLANETWIN|STARCASIN|BETFLAG|ADMIRAL/i;
const SUBW=/\b(SUBS?|SUBSCRIPTION|ABBONAMENTO|PLUS|PREMIUM|PRIME|PASS|MEMBERSHIP|ISCRIZIONE)\b|NETFLIX|SPOTIFY|DISNEY|DAZN|\bNOW\b|ICLOUD|GOOGLE ONE|YOUTUBE|AUDIBLE|PLAYSTATION|XBOX|CHATGPT|OPENAI|CLAUDE|ADOBE|MICROSOFT|DROPBOX|PARAMOUNT|APPLE\.COM/i;
const KW=[[/ESSELUNGA|CONAD|COOP|CARREFOUR|\bCRF\b|LIDL|EUROSPIN|\bPAM\b|IPER|PANIFICIO|ALIMENT|MARKET|TODIS|TIGRE|PENNY|SUPERM/i,'Cibo & Spesa'],[/\bBAR\b|RISTOR|PIZZ|TRATTOR|OSTERIA|MCD|BURGER|KFC|DELIVEROO|GLOVO|JUST ?EAT|CAFF|GELAT|SUSHI|KEBAB/i,'Bar & Ristoranti'],[/TRENITALIA|ITALO|ATAC|\bUBER\b|BOLT|TAXI|FREENOW|RYANAIR|EASYJET|WIZZ|FLIXBUS|TRENORD/i,'Trasporti'],[/\bENI\b|\bQ8\b|ESSO|TAMOIL|AUTOSTRAD|TELEPASS|PARCHEGG|PARKING|CARBURANT|BENZIN/i,'Auto'],[/AMAZON|ZALANDO|DECATHLON|IKEA|ZARA|H&M|VINTED|SHEIN|TEMU|EBAY|MEDIAWORLD|UNIEURO|LEROY/i,'Shopping'],[/FARMAC|PHARMA|MEDIC|DENTIST|OSPEDAL/i,'Salute'],[/ENEL|\bACEA\b|\bTIM\b|VODAFONE|WINDTRE|ILIAD|FASTWEB|\bGAS\b|LUCE/i,'Casa & Utenze']];
const ESS=['Cibo & Spesa','Casa & Utenze','Rate e prestiti','Salute','Cure sanitarie & Farmacia','Bonifici','Auto','Trasporti','Commissioni','Canone del conto','Prelievi contanti','Spese aziendali','Finanze'];
function mName(n){return String(n||'').replace(/^(PAYPAL|SUMUP|SCALAPAY|UNVRS|SATISPAY|KLARNA|ZETTLE|SQ|PP)\s*\*+\s*/i,'').replace(/\s+/g,' ').trim()}
function mKey(n){const w=mName(n).toUpperCase().split(/[\s./*-]+/).filter(Boolean),out=[];
  w.forEach((x,i)=>{if(/^(SRL|SPA|SNC|SAS|LTD|GMBH|INC|SRLS|COM|EU|IT)$/.test(x))return;if(/\d/.test(x)&&i>0)return;out.push(x.replace(/[^A-Z]/g,''))});
  return out.join('')||mName(n).toUpperCase().replace(/[^A-Z0-9]/g,'')||'?'}
function sameName(a,b){const t=s=>String(s||'').toLowerCase().replace(/[^a-zà-ú ]/g,' ').split(/\s+/).filter(Boolean).sort().join(' ');const x=t(a);return !!x&&x===t(b)}
const SYN=['Commissioni','Rate e prestiti','Bonifici','Prelievi contanti','Canone del conto'];
function learnMap(T){const m={};for(const id in T)for(const r of T[id].rows)if(r.c&&r.k==='out'&&SYN.indexOf(r.c)<0){const k=mKey(r.n);if(k.length>=3)m[k]=r.c}return m}
function mShow(n){const w=mName(n).split(' ').filter((x,i)=>!(i>0&&/\d/.test(x))&&!/^(SRL|SPA|SNC|SAS|SRLS)$/i.test(x));return (w.join(' ').replace(/[*.…\s]+$/,'').replace(/\*/g,' ').replace(/\s+/g,' ').trim()||mName(n)).slice(0,32)}
function catOf(r,rules,learn){const k=mKey(r.n);if(rules&&rules[k])return rules[k];if(BET.test(r.n))return 'Giochi e scommesse';if(r.c)return r.c;if(learn&&learn[k])return learn[k];for(const p of KW)if(p[0].test(r.n))return p[1];return 'Altro'}
function n26Tx(P){
  const sp=P.spaces.map(s=>s.name),rows=[];
  for(const r of P.main.rows){const s0=r.sub[0]||'',desc=r.sub.filter(x=>!/^IBAN:/.test(x)).join(' '),m=r.name.match(/^(A|Da) (.+)$/);let k,c='';
    if(m&&sp.indexOf(m[2])>=0)k='space';
    else if(/^Mastercard/.test(s0)){c=(s0.split('•')[1]||'').trim();k=r.amt<0||c?'out':'in'}
    else if(r.amt>0)k=sameName(r.name,P.holder)||/^N26 Rate/i.test(r.name)||/Inviato da Revolut|Giroconto|dalla tua carta/i.test(desc)?'giro':'in';
    else if(/Commissione/i.test(desc)){k='out';c='Commissioni'}
    else if(/^N26 Rate/i.test(r.name)){k='out';c='Rate e prestiti'}
    else if(r.name==='N26'&&/Iscrizione|Abbonamento|Canone/i.test(desc)){k='out';c='Canone del conto'}
    else if(sameName(r.name,P.holder))k='giro';
    else{k='out';if(/Bonifici in uscita/i.test(s0))c='Bonifici'}
    const nm=r.name==='N26'&&desc?'N26 '+r.sub[r.sub.length-1]:(r.name||s0||'Movimento');
    rows.push({d:r.date,a:r.amt,n:String(nm).slice(0,48),c,k})}
  return rows}
function csvRows(t){
  t=String(t).replace(/^﻿/,'');const first=t.split(/\r?\n/)[0]||'',sep=(first.split(';').length>first.split(',').length)?';':',',out=[];let row=[],f='',q=false;
  for(let i=0;i<t.length;i++){const ch=t[i];
    if(q){if(ch==='"'){if(t[i+1]==='"'){f+='"';i++}else q=false}else f+=ch}
    else if(ch==='"')q=true;else if(ch===sep){row.push(f);f=''}
    else if(ch==='\n'||ch==='\r'){if(ch==='\r'&&t[i+1]==='\n')i++;row.push(f);f='';if(row.some(x=>x!==''))out.push(row);row=[]}
    else f+=ch}
  row.push(f);if(row.some(x=>x!==''))out.push(row);return out}
function revTx(text,holder){
  const R=csvRows(text);if(R.length<2)return{error:'vuoto'};
  const H=R[0].map(h=>h.trim().toLowerCase()),col=names=>{for(const n of names){const i=H.indexOf(n);if(i>=0)return i}return -1};
  const c={type:col(['type','tipo']),prod:col(['product','prodotto']),st:col(['started date','data di inizio','data inizio']),co:col(['completed date','data di completamento','data completamento']),
    desc:col(['description','descrizione']),amt:col(['amount','importo']),fee:col(['fee','commissione','costo','tariffa']),cur:col(['currency','valuta']),state:col(['state','stato'])};
  if(c.desc<0||c.amt<0||(c.st<0&&c.co<0))return{error:'intestazioni'};
  const num=s=>{s=String(s||'').trim().replace(/\s/g,'');if(s.indexOf(',')>=0&&s.indexOf('.')<0)s=s.replace(',','.');else s=s.replace(/,/g,'');const n=parseFloat(s);return isFinite(n)?Math.round(n*100):0};
  const months={},skip={cur:0,state:0,savings:0};let n=0;
  for(let i=1;i<R.length;i++){const r=R[i],g=j=>j>=0?(r[j]||'').trim():'';
    let d=(g(c.co)||g(c.st)).slice(0,10);const dm=d.match(/^(\d{2})[\/.](\d{2})[\/.](\d{4})$/);if(dm)d=dm[3]+'-'+dm[2]+'-'+dm[1];if(!isYmd(d)){skip.state++;continue}
    if(c.state>=0&&g(c.state)&&!/^COMPLET/i.test(g(c.state))){skip.state++;continue}
    if(c.cur>=0&&g(c.cur)&&g(c.cur).toUpperCase()!=='EUR'){skip.cur++;continue}
    if(/saving|vault|pocket|deposit|risparm|salvadan/i.test(g(c.prod))){skip.savings++;continue}
    const T=g(c.type).toUpperCase().replace(/\s+/g,'_'),desc=g(c.desc),a=num(g(c.amt)),fee=Math.abs(num(g(c.fee))),who=desc.replace(/^(To|From|A|Da|Payment from|Pagamento da)\s+/i,'');let k,cat='';
    if(/EXCHANGE|CAMBIO/.test(T))continue;
    if(/REFUND|RIMBORSO/.test(T))k='out';
    else if(/CARD|CARTA/.test(T))k='out';
    else if(/ATM|PRELIEVO/.test(T)){k='out';cat='Prelievi contanti'}
    else if(/FEE|COMMISSION/.test(T)){k='out';cat='Commissioni'}
    else if(/TOPUP|TOP_UP|RICARICA/.test(T))k=a>0&&!/^(Payment from|Pagamento da)/i.test(desc)||sameName(who,holder)?'giro':'in';
    else if(/TRANSFER|BONIFICO|TRASFERIMENTO/.test(T)){if(sameName(who,holder))k='giro';else if(/pocket|vault|saving|salvadan|risparm/i.test(desc))k='space';else if(a<0){k='out';cat='Bonifici'}else k='in'}
    else k=a<0?'out':'in';
    const ym=d.slice(0,7),list=months[ym]||(months[ym]=[]);
    if(a!==0){list.push({d,a,n:desc.slice(0,48)||'Movimento',c:cat,k});n++}
    if(fee>0){list.push({d,a:-fee,n:'Commissione Revolut',c:'Commissioni',k:'out'});n++}}
  return{months,n,skip}}
function spendMonth(T,st,ym){
  const rules=st.rules||{},learn=learnMap(T),cats={},mer={},subs={};let out=0,inc=0,giro=0,space=0,n=0,any=false;
  for(const id in T){const t=T[id];if(t.ym!==ym)continue;any=true;
    for(const r of t.rows){const a=r.a;
      if(r.k==='out'){const c=catOf(r,rules,learn),k=mKey(r.n),o=cats[c]||(cats[c]={c,a:0,n:0}),m=mer[k]||(mer[k]={k,name:mShow(r.n),a:0,n:0,c});
        out-=a;n++;o.a-=a;o.n++;m.a-=a;m.n++;
        if(a<0&&c!=='Giochi e scommesse'&&SUBW.test(r.n)){const sk=k+':'+a;if(!subs[sk])subs[sk]={k,name:mShow(r.n),a:-a}}}
      else if(r.k==='in')inc+=a;else if(r.k==='giro')giro+=a;else if(r.k==='space')space-=a}}
  const keys=Object.keys(mer).sort((a,b)=>a.length-b.length);
  for(const k of keys){if(!mer[k]||k.length<5)continue;for(const j of keys){if(j===k||!mer[j]||j.length<=k.length)continue;if(j.indexOf(k)===0){mer[k].a+=mer[j].a;mer[k].n+=mer[j].n;delete mer[j]}}}
  const byA=(a,b)=>b.a-a.a;
  return{ym,any,out,inc,giro,space,n,cats:Object.keys(cats).map(k=>cats[k]).sort(byA),mer:Object.keys(mer).map(k=>mer[k]).sort(byA),subs:Object.keys(subs).map(k=>subs[k]).sort(byA)}}
function txMonths(T){const s={};for(const id in T)s[T[id].ym]=1;return Object.keys(s).sort()}
function capResults(st,T,today){
  const caps=st.caps||{},cs=Object.keys(caps).filter(c=>caps[c]>0),out=[];if(!cs.length)return out;const cur=today.slice(0,7);
  for(const ym of txMonths(T)){const m=spendMonth(T,st,ym);for(const c of cs){const x=m.cats.find(y=>y.c===c),spent=x?x.a:0;out.push({ym,c,cap:caps[c],spent,ok:spent<=caps[c],closed:ym<cur,counts:ym>=((st.capSince||{})[c]||'0000-00')})}}
  return out}
