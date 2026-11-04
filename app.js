
const BR=[["Head Office","First Place, Plot 54362, CBD, Gaborone","+267 370 6100"],["Airport Junction","Plot 70665, Shop 01A, Airport Junction Shopping Centre, Block 10, Gaborone","+267 399 2000"],["Broadhurst Industrial","Plot 5681, Orchid Centre, Kubu Road, Gaborone","+267 370 2517"],["First Place","Plot 54362, CBD, Gaborone","+267 370 6100"],["Francistown","Plot 32753/4, Blue Jacket Street, Francistown","+267 241 3831"],["Gaborone Industrial","Plot 1278, Luthuli Road, Gaborone","+267 364 2900"],["Gaborone Main","Plot 2843, Ground Floor, Khama Crescent, Gaborone","+267 364 2800"],["Ghanzi","Plot 8624, Unit 10, Taung Mall, Ghanzi","+267 659 6670"],["Jwaneng","Plot 5477, Choppies Mall, Jwaneng","+267 588 0470"],["Kanye","Plot 6641, Mmasekou Ward, Kanye","+267 544 0452"],["Kasane","Plot 2296, Unit 10A, Waterfront Mall, Kasane","+267 625 2414"],["Kgale View","Shop N3, Game City Shopping Mall, Gaborone","+267 368 0700"],["Letlhakane","Plot 5180, Teemane Retail Park, Letlhakane","+267 297 8930"],["Lobatse","Plot 14076, Shop TA-27, Lobatse Junction Mall, Mokgotsi Road, Peleng, Lobatse","+267 533 0827"],["Mahalapye","Plot 13351, Unit 25, Watershed Mall, Mahalapye","+267 471 1300"],["Mall","Plot 1108, Capitol Building, Main Mall, Gaborone","+267 395 9422"],["Maun","Plot 36415, Shop 31, Mall of Maun, Maun","+267 686 0919"],["Mogoditshane","Plot 4071, Units 5 & 6, Molepolole Road, Mogoditshane","+267 398 2300"],["Molepolole","Shop 20, The Village Gate Mall, Molepolole","+267 590 8800"],["Orapa Premium Suite","Sable Street, Orapa","+267 398 7443"],["Orapa Sales & Service Centre","Sable Street, Orapa","+267 398 7445/6/7"],["Palapye","Shop 24, Lotsane Junction Mall, Palapye","+267 492 2340"],["Pilane (Mochudi)","Plot 439, Unit 1, Pilane Crossing Mall, Pilane","+267 577 4300"],["Rail Park","Plot 4716, Shop G55, Rail Park Shopping Mall, Gaborone","+267 371 7300"],["Riverwalk","Plot 25117, Tlokweng Road, Riverwalk Plaza, Gaborone","+267 368 6600"],["Selebi-Phikwe","Plot 6567, Tshekedi Road, Main Mall, Selebi-Phikwe","See FNB directory"],["Serowe","Plot 2461, Unit 1, Boiteko Junction Shopping Centre, Newton Ward, Serowe","See FNB directory"]];
const SV=[["Cash & Deposits",["Cash deposit","Cash withdrawal","Cheque services"]],["Account Services",["Open account","Close account","Statement request"]],["Cards",["Card replacement","PIN reset","Card activation"]],["KYC / FICA",["ID update","Proof of address","FICA refresh"]],["Forex",["Buy forex","Sell forex","Travel card"]],["Loans & Credit",["New loan enquiry","Loan review","Overdraft"]],["Business Banking",["Business account","Merchant services","Business loan"]],["Customer Care",["Complaint","General enquiry"]]];
const SL=[];for(let m=480;m<1020;m+=30)SL.push(m);
const hm=m=>String(m/60|0).padStart(2,"0")+":"+String(m%60).padStart(2,"0");
const now=()=>{const d=new Date();return d.getHours()*60+d.getMinutes()};
let S=JSON.parse(localStorage.getItem("fnbq")||"null")||{t:[],seq:{},cl:0,cfg:{ratio:.7,C:5,warn:60,grace:15}};
let view=PAGE.start,br=+(localStorage.getItem("fnbbr")||0),ctr=1,bk={sv:0,it:"",slot:null,done:null},ki={},lastCl=S.cl,svcMin=8;
const FB=(window.FNBQ_DB||"").replace(/\/$/,""),synced={};
if(FB)S={t:[],seq:{},cl:0,cfg:{ratio:.7,C:5,warn:60,grace:15}};
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const fb=(m,p,b)=>fetch(FB+p+".json",{method:m,body:b==null?undefined:JSON.stringify(b)}).catch(()=>{});
const save=()=>{
 if(!FB){localStorage.setItem("fnbq",JSON.stringify(S));render();return}
 const ids=new Set();
 S.t.forEach(t=>{ids.add(t.id);const j=JSON.stringify(t);if(synced[t.id]!=j){synced[t.id]=j;fb("PUT","/t/"+t.id,t)}});
 Object.keys(synced).forEach(id=>{if(!ids.has(id)){delete synced[id];fb("DELETE","/t/"+id)}});
 Object.keys(S.seq).forEach(k=>fb("PUT","/seq/"+k,S.seq[k]));fb("PUT","/cl",S.cl);fb("PUT","/cfg",S.cfg);render()};
function resetAll(){S.t=[];S.seq={};if(FB)fb("DELETE","/seq");save()}
addEventListener("storage",e=>{if(!FB&&e.key=="fnbq"){S=JSON.parse(e.newValue);render()}});
function at(path,d){const p=path.split("/").filter(Boolean),mk=t=>synced[t.id]=JSON.stringify(t);
 if(!p.length){const x=d||{};S.t=Object.values(x.t||{});S.t.forEach(mk);S.seq=x.seq||{};S.cl=x.cl||0;if(x.cfg)S.cfg=x.cfg}
 else if(p[0]=="t"){if(p.length==1){S.t=Object.values(d||{});S.t.forEach(mk)}
  else{const i=S.t.findIndex(x=>x.id==p[1]);
   if(p.length==2){if(d==null){if(i>=0)S.t.splice(i,1);delete synced[p[1]]}else{if(i>=0)S.t[i]=d;else S.t.push(d);mk(d)}}
   else if(i>=0){S.t[i][p[2]]=d;mk(S.t[i])}}}
 else if(p[0]=="seq"){if(p.length==1)S.seq=d||{};else S.seq[p[1]]=d}
 else if(p[0]=="cl")S.cl=d||0;else if(p[0]=="cfg"&&d)S.cfg=d}
if(FB){const es=new EventSource(FB+"/.json");
 es.addEventListener("put",e=>{const m=JSON.parse(e.data);at(m.path,m.data);render()});
 es.addEventListener("patch",e=>{const m=JSON.parse(e.data);Object.keys(m.data||{}).forEach(k=>at(m.path.replace(/\/$/,"")+"/"+k,m.data[k]));render()})}
const cap=()=>Math.floor(S.cfg.C*S.cfg.ratio);
const live=t=>!["cancelled","noshow","done","transferred"].includes(t.st);
const booked=(sv,slot)=>S.t.filter(t=>t.ty=="A"&&t.br==br&&t.sv==sv&&t.slot==slot&&t.st!="cancelled"&&t.st!="noshow").length;
const wait=()=>S.t.filter(t=>t.br==br&&t.st=="waiting");
const sorted=()=>wait().sort((a,b)=>(b.pr?1:0)-(a.pr?1:0)||(a.ty=="A"?a.slot:a.arr)-(b.ty=="A"?b.slot:b.arr)||a.arr-b.arr);
const eta=n=>Math.ceil((n+1)*svcMin/3);
const nextNo=()=>{S.seq[br]=(S.seq[br]||0)+1;return S.seq[br]};
const ref=()=>"FNB-"+Math.random().toString(36).slice(2,7).toUpperCase();
const beep=()=>{try{const c=new AudioContext(),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=880;g.gain.setValueAtTime(.2,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+.8);o.start();o.stop(c.currentTime+.8)}catch(e){}};
const $=(h)=>h;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

let LANG=localStorage.getItem("fnbl")||"en";
const TN={"FNB Botswana – Book a Branch Visit":"FNB Botswana – Beke nako kwa lekaleng","Book a slot, check in or view the queue. No banking details needed.":"Beke nako, ikwadise fa o goroga kgotsa o bone mola. Ga go tlhokege dintlha tsa banka.","You work here":"O bereka fano","Book a visit":"Beke nako","Check in / Walk-in":"Go ikwadisa / Go sa beke","Queue screen":"Sekirini sa mola","Book a slot":"Beke nako","Service":"Tirelo","Reason for visit":"Lebaka la leeto","Select…":"Tlhopha…","Other":"Tse dingwe","Describe (max 120 chars)":"Tlhalosa (ditlhaka tse 120 fa e le gantsi)","Time slot (today)":"Nako (gompieno)","Full":"E tletse","First name":"Leina la ntlha","Phone number":"Nomore ya mogala","Notify me via":"Mpolelele ka","Only your first name and phone number are collected, for notifications.":"Re kgobokanya fela leina la gago le nomore ya mogala, go go romela dikitsiso.","Confirm booking":"Tlhomamisa go beka nako","Booking confirmed":"Go beka nako go tlhomamisitswe","New booking":"Beke nako e nngwe","No account, ID or balance information is collected or sent.":"Ga go kgobokangwe kgotsa go romelwe dintlha tsa akhaonto, ID kgotsa tsa madi a setseng.","Check in":"Ikwadise","Booking reference":"Nomore ya go beka","Scan QR code":"Skena QR code","Demo: ignore check-in window":"Demo: tlolaganya nako ya go ikwadisa","Walk-in ticket":"Thekethe ya go sa beke","Take ticket":"Tsaya thekethe","Waiting now:":"Ba emetse jaanong:","· Estimated wait:":"· Nako e e akanyeditsweng ya go ema:","Your ticket:":"Thekethe ya gago:","Checked in. Your ticket:":"O ikwadisitswe. Thekethe ya gago:","Booking not found. You can take a walk-in ticket instead.":"Go beka ga go a bonwa. O ka tsaya thekethe ya go sa beke.","Shows ticket and counter only. A chime plays on each call (click anywhere once to enable audio).":"E bontsha fela thekethe le kaontara. Modumo o letswa fa go bidiwa mongwe le mongwe (tobetsa gongwe fela gangwe go bula modumo).","Select a reason for your visit.":"Tlhopha lebaka la leeto la gago.","Select a time slot.":"Tlhopha nako.","Enter your first name.":"Kwala leina la gago la ntlha.","Enter a valid phone number.":"Kwala nomore ya mogala e e nepagetseng.","Maximum of 2 active bookings per phone number.":"Go letleletswe go beka gabedi fela ka nomore e le nngwe ya mogala.","That slot has just filled up.":"Nako eo e sa tswa go tlala."};
const TP=[[/^(\d+) left$/,m=>m[1]+" e setse"],[/^Today at (.+)$/,m=>"Gompieno ka "+m[1]],[/^(\d+) min$/,m=>m[1]+(m[1]=="1"?" motsotso":" metsotso")],[/^Counter (\d+)$/,m=>"Kaontara "+m[1]],[/^(.+) · Now serving$/,m=>m[1]+" · Jaanong re direla"],[/^High wait expected \(over (\d+) min\)\. You may still take a ticket\.$/,m=>"Go emela go go telele go solofetswe (go feta metsotso e "+m[1]+"). O santse o ka tsaya thekethe."],[/^Check-in opens 30 min before and closes (\d+) min after your slot \((.+)\)\. Please take a walk-in ticket\.$/,m=>"Go ikwadisa go bulega metsotso e 30 pele ga nako ya gago ("+m[2]+") mme go tswalwa metsotso e "+m[1]+" morago ga yone. Tsaya thekethe ya go sa beke."]];
function tr(root){const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){
 if(n.__o===undefined)n.__o=n.nodeValue;
 if(LANG!="tn"){n.nodeValue=n.__o;continue}
 const s=n.__o.trim();let v=TN[s];
 if(v===undefined)for(const[re,f]of TP){const m=s.match(re);if(m){v=f(m);break}}
 if(v!==undefined)n.nodeValue=n.__o.replace(s,v)}
 (root.querySelectorAll?root.querySelectorAll("[placeholder]"):[]).forEach(e=>{if(e.__p===undefined)e.__p=e.placeholder;e.placeholder=LANG=="tn"&&TN[e.__p]||e.__p})}
function msgFor(t){const w=hm(t.slot),n=BR[t.br][0],s=SV[t.sv][0];
 return LANG=="tn"?`Dumela ${t.name}, go beka nako ga gago kwa FNB Botswana (${t.ref}) go tlhomamisitswe: ${n}, ${s}, ${w}. Ikwadise ka nomore eno kwa lekaleng.`:`Hi ${t.name}, your FNB Botswana booking ${t.ref} is confirmed: ${n}, ${s}, ${w}. Check in with this reference at the branch kiosk.`}
const e164=p=>{const d=p.replace(/[^\d+]/g,"");if(d[0]=="+")return d;if(d.startsWith("267"))return"+"+d;if(d.length==8)return"+267"+d;return"+"+d};
function notify(t){const u=window.FNBQ_SMS;if(!u)return;fetch(u,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to:e164(t.ph),channel:t.ch,body:msgFor(t)})}).catch(()=>{})}
async function scan(){
 if(window.__scan){stopScan();return}
 if(!window.jsQR||!navigator.mediaDevices){alert("QR scanner is not available on this device.");return}
 try{const st=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}});
  const v=document.getElementById("cam");v.srcObject=st;v.style.display="block";await v.play();window.__scan=true;
  const c=document.createElement("canvas"),x=c.getContext("2d",{willReadFrequently:true});
  const loop=()=>{if(!window.__scan)return;
   if(v.videoWidth){c.width=v.videoWidth;c.height=v.videoHeight;x.drawImage(v,0,0);const d=x.getImageData(0,0,c.width,c.height),r=jsQR(d.data,c.width,c.height);
    if(r&&r.data){document.getElementById("rf").value=r.data;stopScan();checkin();return}}
   requestAnimationFrame(loop)};loop()}
 catch(e){alert("Camera not available. Please allow camera access.")}}
function stopScan(){window.__scan=false;const v=document.getElementById("cam");if(v&&v.srcObject){v.srcObject.getTracks().forEach(t=>t.stop());v.srcObject=null;v.style.display="none"}}
function post(){
 const sb=document.querySelector(".brsel");
 if(sb&&PAGE.start!="staff"&&!document.getElementById("lang")){const b=document.createElement("button");b.id="lang";b.className="b";b.onclick=()=>{LANG=LANG=="tn"?"en":"tn";localStorage.setItem("fnbl",LANG);document.documentElement.lang=LANG=="tn"?"tn":"en";render()};sb.prepend(b)}
 const lb=document.getElementById("lang");if(lb)lb.textContent=LANG=="tn"?"English":"Setswana";
 const q=document.getElementById("qr");if(q&&window.QRCode&&bk.done)new QRCode(q,{text:bk.done.ref,width:170,height:170});
 tr(document.body)}
function render(){
 if(window.__scan)return;
 const g=PAGE.gate?PAGE.gate():"",nv=g?[]:(typeof PAGE.views=="function"?PAGE.views():PAGE.views);
 if(nv.length&&!nv.some(v=>v[0]==view))view=nv[0][0];
 const nav=document.getElementById("nav");nav.style.display=nv.length>1?"":"none";
 nav.innerHTML=nv.length>1?nv.map(([k,l])=>`<button class="${view==k?"on":""}" onclick="view='${k}';render()">${l}</button>`).join(""):"";
 document.getElementById("app").innerHTML=g||{book:vBook,kiosk:vKiosk,staff:vStaff,disp:vDisp,mgr:vMgr}[view]();
 if(S.cl!=lastCl){lastCl=S.cl;if(view=="disp")beep()}
 const sy=document.getElementById("sync");if(sy)sy.textContent=FB?"Live sync: ON":"Local mode (this browser only)";post()
}
function vBook(){
 if(bk.done){const t=bk.done;return `<div class="card"><h2>Booking confirmed</h2><div class="big">${t.ref}</div><div id="qr" style="margin:12px 0"></div><p>${esc(BR[t.br][0])} · ${SV[t.sv][0]} · ${esc(t.it)}<br>Today at ${hm(t.slot)}</p>
 <div class="msg">[${t.ch}${window.FNBQ_SMS?" sent":" simulated"}] ${esc(msgFor(t))}</div>
 <p class="mu">No account, ID or balance information is collected or sent.</p><button class="b p" onclick="bk={sv:0,it:'',slot:null,done:null};render()">New booking</button></div>`}
 const ints=SV[bk.sv][1],c=cap();
 return `<div class="card"><h2>Book a slot</h2><p class="mu">${esc(BR[br][1])} · ${BR[br][2]}</p>
 <label>Service</label><select onchange="bk.sv=+this.value;bk.it='';bk.slot=null;render()">${SV.map((s,i)=>`<option value="${i}" ${i==bk.sv?"selected":""}>${s[0]}</option>`).join("")}</select>
 <label>Reason for visit</label><select onchange="bk.it=this.value;render()"><option value="">Select…</option>${ints.map(i=>`<option ${bk.it==i?"selected":""}>${i}</option>`).join("")}<option ${bk.it=="Other"?"selected":""}>Other</option></select>
 ${bk.it=="Other"?`<input id="oth" maxlength="120" placeholder="Describe (max 120 chars)" style="margin-top:6px">`:""}
 <label>Time slot (today)</label><div class="g">${SL.map(s=>{const n=booked(bk.sv,s),full=n>=c;return `<button class="b ${bk.slot==s?"p":""}" ${full?"disabled":""} onclick="bk.slot=${s};render()">${hm(s)}<br><span class="mu">${full?"Full":c-n+" left"}</span></button>`}).join("")}</div>
 <label>First name</label><input id="nm"><label>Phone number</label><input id="ph" inputmode="tel" placeholder="+267 …">
 <label>Notify me via</label><select id="ch"><option>SMS</option><option>WhatsApp</option><option>SMS + WhatsApp</option></select>
 <p class="mu">Only your first name and phone number are collected, for notifications.</p>
 <button class="b p" onclick="doBook()">Confirm booking</button><div id="err" class="warn" style="display:none"></div></div>`}
function doBook(){
 const nm=document.getElementById("nm").value.trim(),ph=document.getElementById("ph").value.trim(),e=document.getElementById("err");
 let it=bk.it=="Other"?"Other: "+(document.getElementById("oth").value||"").slice(0,120):bk.it;
 const err=!bk.it?"Select a reason for your visit.":bk.slot==null?"Select a time slot.":!nm?"Enter your first name.":!/^\+?[\d\s]{7,15}$/.test(ph)?"Enter a valid phone number.":S.t.filter(t=>t.ph==ph&&t.ty=="A"&&["booked","waiting"].includes(t.st)).length>=2?"Maximum of 2 active bookings per phone number.":booked(bk.sv,bk.slot)>=cap()?"That slot has just filled up.":"";
 if(err){e.textContent=err;e.style.display="block";tr(e);return}
 const t={id:uid(),ty:"A",ref:ref(),br,sv:bk.sv,it,slot:bk.slot,name:nm,ph,ch:document.getElementById("ch").value,st:"booked",arr:now(),pr:"",no:null};
 S.t.push(t);bk.done=t;notify(t);save()}
function vKiosk(){
 const q=wait().length,w=eta(q),hi=w>S.cfg.warn;
 return `<div class="cols"><div class="card"><h2>Check in</h2><label>Booking reference</label><input id="rf" placeholder="FNB-XXXXX" style="text-transform:uppercase"><video id="cam" playsinline muted style="display:none;width:100%;max-width:320px;margin-top:8px;border-radius:8px"></video><button class="b" onclick="scan()" style="margin-top:8px">Scan QR code</button>
 <label><input type="checkbox" id="dm" checked style="width:auto"> Demo: ignore check-in window</label>
 <br><button class="b p" onclick="checkin()">Check in</button>${ki.msg?`<div class="msg">${ki.msg}</div>`:""}</div>
 <div class="card"><h2>Walk-in ticket</h2><label>Service</label><select id="ws">${SV.map((s,i)=>`<option value="${i}">${s[0]}</option>`).join("")}</select>
 <label>Greeter priority flag (reason required)</label><select id="pr"><option value="">None</option><option>Elderly</option><option>Disabled</option><option>Pregnant</option><option>Premium / private</option><option>Business banking</option><option>Staff-directed</option></select>
 <p>Waiting now: <b>${q}</b> · Estimated wait: <b>${w} min</b></p>${hi?`<div class="warn">High wait expected (over ${S.cfg.warn} min). You may still take a ticket.</div>`:""}
 <button class="b p" onclick="walkin()">Take ticket</button>${ki.tk?`<div class="msg">Your ticket: <b style="font-size:28px">${ki.tk}</b></div>`:""}</div></div>`}
function checkin(){
 const r=document.getElementById("rf").value.trim().toUpperCase(),dm=document.getElementById("dm").checked;
 const t=S.t.find(x=>x.ty=="A"&&x.ref==r&&x.br==br&&x.st=="booked");ki={};
 if(!t)ki.msg="Booking not found. You can take a walk-in ticket instead.";
 else if(!dm&&(now()<t.slot-30||now()>t.slot+S.cfg.grace))ki.msg=`Check-in opens 30 min before and closes ${S.cfg.grace} min after your slot (${hm(t.slot)}). Please take a walk-in ticket.`;
 else{t.st="waiting";t.arr=now();t.no="A"+String(nextNo()).padStart(3,"0");ki.msg=`Checked in. Your ticket: <b style="font-size:28px">${t.no}</b>`}
 save()}
function walkin(){
 const t={id:uid(),ty:"W",br,sv:+document.getElementById("ws").value,it:"Walk-in",slot:null,name:"",st:"waiting",arr:now(),pr:document.getElementById("pr").value,no:"W"+String(nextNo()).padStart(3,"0")};
 S.t.push(t);ki={tk:t.no};save()}
function cur(){return S.t.find(t=>t.br==br&&t.ctr==ctr&&["called","serving"].includes(t.st))}
function vStaff(){
 const c=cur(),q=sorted(),up=S.t.filter(t=>t.br==br&&t.ty=="A"&&t.st=="booked").sort((a,b)=>a.slot-b.slot);
 return `<div class="card"><h2>Counter <select style="width:auto;display:inline" onchange="ctr=+this.value;render()">${[1,2,3,4].map(n=>`<option ${n==ctr?"selected":""}>${n}</option>`).join("")}</select></h2>
 ${c?`<p>Now: <b style="font-size:26px">${c.no}</b> · ${SV[c.sv][0]} · ${esc(c.it)} ${c.name?"· "+esc(c.name):""} <span class="tag">${c.st}</span></p>
 <button class="b" onclick="act('called')">Recall</button> <button class="b p" onclick="act('serving')" ${c.st=="serving"?"disabled":""}>Start</button> <button class="b p" onclick="act('done')">Complete</button> <button class="b" onclick="act('noshow')">No-show</button>
 <p><select id="tr" style="width:auto;display:inline">${SV.map((s,i)=>`<option value="${i}">${s[0]}</option>`).join("")}</select> <button class="b" onclick="transfer()">Transfer</button></p>`
 :`<p class="mu">No customer at this counter.</p>`}
 <button class="b p" ${c||!q.length?"disabled":""} onclick="callNext()">Call next</button></div>
 <div class="cols" style="align-items:start"><div class="card"><h2>Queue (${q.length})</h2><table><tr><th>Ticket</th><th>Service</th><th>Intent</th><th>Type</th><th>Priority</th><th>Wait</th></tr>${q.map(t=>`<tr><td><b>${t.no}</b></td><td>${SV[t.sv][0]}</td><td>${esc(t.it)}</td><td>${t.ty=="A"?`<span class="tag a">Appt ${hm(t.slot)}</span>`:`<span class="tag">Walk-in</span>`}</td><td>${t.pr?`<span class="tag pr">${t.pr}</span>`:""}</td><td>${Math.max(0,now()-t.arr)} min</td></tr>`).join("")||"<tr><td colspan=6 class=mu>Empty</td></tr>"}</table></div>
 <div class="card"><h2>Incoming bookings (${up.length})</h2><table><tr><th>Reference</th><th>Slot</th><th>Customer</th><th>Service / intent</th><th></th></tr>${up.map(t=>`<tr><td><b>${t.ref}</b></td><td>${hm(t.slot)}</td><td>${esc(t.name)}</td><td>${SV[t.sv][0]}<br><span class="mu">${esc(t.it)}</span></td><td><button class="b" onclick="staffIn('${t.id}')">Check in</button></td></tr>`).join("")||"<tr><td colspan=5 class=mu>No bookings yet</td></tr>"}</table></div></div>`}
function staffIn(id){const t=S.t.find(x=>x.id==id);if(!t||t.st!="booked")return;t.st="waiting";t.arr=now();t.no="A"+String(nextNo()).padStart(3,"0");save()}
function callNext(){const t=sorted()[0];if(!t)return;t.st="called";t.ctr=ctr;t.ct=Date.now();S.cl++;save()}
function act(s){const c=cur();if(!c)return;if(s=="called"){S.cl++;c.ct=Date.now()}else c.st=s;save()}
function transfer(){const c=cur(),sv=+document.getElementById("tr").value;if(!c)return;c.st="transferred";S.t.push({...c,id:uid(),sv,st:"waiting",arr:now(),ctr:null,no:(c.ty=="A"?"A":"W")+String(nextNo()).padStart(3,"0"),it:c.it+" (transferred)"});save()}
function vDisp(){
 const c=S.t.filter(t=>t.br==br&&["called","serving"].includes(t.st)).sort((a,b)=>b.ct-a.ct);
 return `<div class="disp"><div class="mu">${esc(BR[br][0])} · Now serving</div>${c.map(t=>`<div class="row"><span>${t.no}</span><span>Counter ${t.ctr}</span></div>`).join("")||`<div class="row"><span>–</span><span></span></div>`}</div><p class="mu">Shows ticket and counter only. A chime plays on each call (click anywhere once to enable audio).</p>`}
function vMgr(){
 const T=S.t.filter(t=>t.br==br),w=T.filter(t=>t.st=="waiting"),aw=w.filter(t=>t.ty=="A").length,ns=T.filter(t=>t.st=="noshow").length,ap=T.filter(t=>t.ty=="A").length;
 const lw=w.length?Math.max(...w.map(t=>now()-t.arr)):0,done=T.filter(t=>t.st=="done").length;
 const by={};T.filter(t=>t.ty=="A"&&["booked","waiting"].includes(t.st)).forEach(t=>{(by[t.slot]=by[t.slot]||{})[SV[t.sv][0]]=((by[t.slot]||{})[SV[t.sv][0]]||0)+1});
 return `<div class="cols"><div class="card"><div class="mu">Waiting</div><div class="k">${w.length}</div></div><div class="card"><div class="mu">Longest wait (min)</div><div class="k">${lw}</div></div><div class="card"><div class="mu">Appt / Walk-in waiting</div><div class="k">${aw} / ${w.length-aw}</div></div><div class="card"><div class="mu">No-show rate</div><div class="k">${ap?Math.round(ns/ap*100):0}%</div></div><div class="card"><div class="mu">Served today</div><div class="k">${done}</div></div></div>
 <div class="card"><h2>Today's declared intents by slot</h2>${Object.keys(by).sort().map(s=>`<p><b>${hm(+s)}</b> — ${Object.entries(by[s]).map(([k,v])=>v+"× "+k).join(", ")}</p>`).join("")||`<p class="mu">No upcoming appointments.</p>`}</div>
 <div class="card"><h2>Rules &amp; demo tools</h2>
 <div class="cols"><div><label>Capacity per slot (C)</label><input type="number" min="1" value="${S.cfg.C}" onchange="S.cfg.C=+this.value;save()"></div><div><label>Appointment share (%)</label><input type="number" min="10" max="100" value="${S.cfg.ratio*100}" onchange="S.cfg.ratio=this.value/100;save()"></div><div><label>High-wait warning (min)</label><input type="number" value="${S.cfg.warn}" onchange="S.cfg.warn=+this.value;save()"></div></div>
 <p class="mu">Appointment cap per slot = floor(C × share) = ${cap()}; walk-ins are never refused.</p>
 <button class="b" onclick="seed()">Seed demo appointments</button> <button class="b w" onclick="noshows()">Expire grace period (auto no-show)</button> <button class="b w" onclick="if(confirm('Reset all data?'))resetAll()">Reset data</button></div>
 <div class="card"><h2>Head-office view – all branches</h2><table><tr><th>Branch</th><th>Waiting</th><th>Booked today</th><th>Served</th></tr>${BR.map((b,i)=>{const X=S.t.filter(t=>t.br==i);return `<tr><td>${esc(b[0])}</td><td>${X.filter(t=>t.st=="waiting").length}</td><td>${X.filter(t=>t.ty=="A").length}</td><td>${X.filter(t=>t.st=="done").length}</td></tr>`}).join("")}</table></div>`}
function seed(){const n=["Neo","Tshepo","Kelebogile","Thato","Mpho"];for(let i=0;i<5;i++)S.t.push({id:uid(),ty:"A",ref:ref(),br,sv:[3,4,4,3,0][i],it:SV[[3,4,4,3,0][i]][1][0],slot:SL[Math.min(SL.length-1,Math.max(0,SL.findIndex(s=>s>=now())))],name:n[i],ph:"+267 7100000"+i,ch:"SMS",st:"booked",arr:now(),pr:"",no:null});save()}
function noshows(){S.t.forEach(t=>{if(t.br==br&&t.ty=="A"&&t.st=="booked")t.st="noshow"});save()}
const sel=document.getElementById("br");sel.innerHTML=BR.map((b,i)=>`<option value="${i}">${esc(b[0])}</option>`).join("");
sel.value=br;sel.onchange=()=>{br=+sel.value;localStorage.setItem("fnbbr",br);bk={sv:0,it:"",slot:null,done:null};ki={};render()};
setInterval(()=>{if((view=="staff"||view=="mgr"||view=="kiosk")&&!(PAGE.gate&&PAGE.gate()))render()},30000);
render();
