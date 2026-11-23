import QRCode from 'qrcode';
import {instantiateClient, ImageEncoder, PageColorType, printTaskNames} from '@mmote/niimbluelib';
import './style.css';

const $ = id => document.getElementById(id);
const defaults = {sn: 'SN-000001', manufactured:'01 2027', width:560, height:320, copies:1, density:3};
const saved = (()=> { try {return JSON.parse(localStorage.getItem('qr-label-studio-config')||'{}')} catch {return {}}})();
const data = {...defaults, ...saved};
let client = null;
let busy = false;
const validDimension = (value,min,max)=>Number.isInteger(Number(value)) && Number(value)>=min && Number(value)<=max;

$('app').innerHTML = `
  <div class="shell">
    <header><div class="brand-icon">▦</div><div><span class="eyebrow">WEB LABEL STUDIO</span><h1>QR Studio<span class="accent">.</span></h1></div><span class="status-chip" id="state">● Rozłączono</span></header>
    <div class="content"><aside>
      <div class="section-id">01 / DANE ETYKIETY</div>
      <label>Serial Number (SN)<input id="sn" type="text" maxlength="160" autocomplete="off" placeholder="Np. SN-000001"/></label>
      <p class="hint">QR zawiera dokładnie wpisany SN. Bez bateryjki — sam QR i duże napisy na całej etykiecie.</p>
      <label>Manufactured<input id="manufactured" type="text" maxlength="130" placeholder="Np. QR Studio" /></label>
      <div class="section-id second">02 / USTAWIENIA WYDRUKU</div>
      <div class="twocol"><label>Szerokość (px)<input id="width" type="number" min="192" max="576" step="8" /></label><label>Wysokość (px)<input id="height" type="number" min="96" max="1000" step="8" /></label></div>
      <p class="hint">Ustaw rozmiar zgodny z fizyczną rolką. B3S_P ma nominalnie 576 punktów szerokości.</p>
      <div class="twocol"><label>Liczba kopii<input id="copies" type="number" min="1" max="50" /></label><label>Gęstość (1–5)<input id="density" type="number" min="1" max="5" /></label></div>
      <label>Tryb wydruku<select id="task"><option value="">Automatyczny (zalecany)</option></select></label>
      <div class="section-id second">03 / DRUKARKA</div>
      <div class="buttons"><button class="primary" id="connect">⌁ Połącz Bluetooth</button><button id="disconnect" class="secondary" disabled>Rozłącz</button></div>
      <button id="print" class="primary full" disabled>▣ Drukuj etykietę</button>
      <p class="hint">Użyj Chrome lub Edge na Windows z włączonym Bluetooth. Drukarka musi być włączona i rozłączona z aplikacją na telefonie.</p>
    </aside><main>
      <div class="preview-head"><div><span class="section-id">PODGLĄD NA ŻYWO</span><h2>Twoja etykieta</h2></div><span class="mini" id="dimensions"></span></div>
      <div class="preview-area"><canvas id="label" width="576" height="240"></canvas></div>
      <div class="preview-actions"><button class="secondary" id="download">↓ Pobierz PNG</button><span class="mini">QR = SN • Większy QR • Większe napisy</span></div>
      <div class="terminal-head"><span class="section-id">TERMINAL / LOG ZDARZEŃ</span><button id="clearlog" class="subtle">Wyczyść</button></div>
      <pre id="terminal">[START] Panel gotowy. Wpisz dane etykiety.\n</pre>
      <div class="bottom">Sam QR i duże napisy • Bez Google Sheets • Bez konta</div>
    </main></div>
  </div>`;

for (const key of ['sn','manufactured','width','height','copies','density']) $(key).value = data[key];
for (const name of printTaskNames) { const opt=document.createElement('option');opt.value=name;opt.textContent=name;$('task').append(opt); }

function log(message) { const line = `[${new Date().toLocaleTimeString('pl-PL')}] ${message}`; $('terminal').textContent+=line+'\n';$('terminal').scrollTop=$('terminal').scrollHeight;console.log(line); }
function state(text, good=false) { $('state').textContent='● '+text;$('state').classList.toggle('good',good); }
function persist() { const obj={};for (const key of Object.keys(defaults)) obj[key]=$(key).value;localStorage.setItem('qr-label-studio-config',JSON.stringify(obj)); }
function check() {if (!$('sn').value.trim()) throw new Error('Wpisz numer SN.'); if (!validDimension($('width').value,192,576) || Number($('width').value)%8) throw new Error('Szerokość musi wynosić 192–576 px i być wielokrotnością 8.'); if (!validDimension($('height').value,96,1000)) throw new Error('Wysokość musi wynosić 96–1000 px.'); if (!validDimension($('copies').value,1,50))throw new Error('Liczba kopii: od 1 do 50.'); if (!validDimension($('density').value,1,5))throw new Error('Gęstość: od 1 do 5.'); }
function fitText(ctx,text,x,y,maxWidth,initial,min=12){let size=initial; do{ctx.font=`700 ${size}px Arial, sans-serif`;if(ctx.measureText(text).width<=maxWidth || size<=min)break;size-=1;}while(size>min);ctx.fillText(text,x,y,maxWidth);}
let painting=0;
async function draw(){
  const tick=++painting;
  const w=Number($('width').value),h=Number($('height').value);
  if(!validDimension(w,192,576)||!validDimension(h,96,1000))return;
  const canvas=$('label'),ctx=canvas.getContext('2d',{willReadFrequently:true});
  canvas.width=w; canvas.height=h;
  ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);ctx.fillStyle='#000';
  const pad=Math.max(8,Math.round(Math.min(w,h)*.035));
  const qrSize=Math.floor(Math.min(h-pad*2,w*.44));
  const qrX=pad;
  const qrY=Math.round((h-qrSize)/2);
  const sn=$('sn').value.trim();
  try {
    const temp=document.createElement('canvas');
    await QRCode.toCanvas(temp,sn||' ',{errorCorrectionLevel:'M',margin:2,width:qrSize,color:{dark:'#000000',light:'#ffffff'}});
    if(tick!==painting)return;
    ctx.imageSmoothingEnabled=false;
    ctx.drawImage(temp,qrX,qrY,qrSize,qrSize);
    ctx.imageSmoothingEnabled=true;
  } catch(e){log('Błąd QR: '+e.message);}
  const rightX=qrX+qrSize+Math.max(14,Math.round(w*.035));
  const rightW=Math.max(20,w-rightX-pad);
  ctx.textAlign='left';ctx.textBaseline='top';ctx.fillStyle='#000';

  const snLabelFont=Math.max(22,Math.round(h*.12));
  const snValueFont=Math.max(30,Math.round(h*.145));
  // Górna krawędź SN wyrównana do widocznego początku modułów QR (po jego marginesie).
  const snTopY=qrY+Math.round(qrSize*.08);
  fitText(ctx,'SN:',rightX,snTopY,rightW,snLabelFont,16);
  fitText(ctx,sn||'—',rightX,snTopY+snLabelFont+5,rightW,snValueFont,16);

  const manufLabelFont=Math.max(22,Math.round(h*.10));
  const manufValueFont=Math.max(28,Math.round(h*.13));
  const labelY=Math.round(h*.70);
  fitText(ctx,'Manufactured:',rightX,labelY,rightW,manufLabelFont,16);
  fitText(ctx,$('manufactured').value||'—',rightX,labelY+manufLabelFont+6,rightW,manufValueFont,16);

  $('dimensions').textContent=`${w} × ${h} px`;
}
for(const k of ['sn','manufactured','width','height','copies','density']) $(k).addEventListener('input',()=>{persist();draw();});
$('download').onclick=async()=>{try{check();await draw();const a=document.createElement('a');a.href=$('label').toDataURL('image/png');a.download=`etykieta_${$('sn').value.trim().replace(/[^a-zA-Z0-9_-]/g,'_')}.png`;a.click();log('Zapisano obraz etykiety.');}catch(e){alert(e.message);}};
$('clearlog').onclick=()=>{$('terminal').textContent='';};

function buttons(connected){$('connect').disabled=connected;$('disconnect').disabled=!connected;$('print').disabled=!connected;}
$('connect').onclick=async()=>{if(busy)return;if(!navigator.bluetooth){log('Brak Web Bluetooth. Otwórz stronę w Chrome / Edge przez HTTPS lub localhost.');alert('Twoja przeglądarka nie obsługuje Web Bluetooth. Użyj Chrome lub Edge.');return;}busy=true;state('Łączenie…');try{client=instantiateClient('bluetooth');client.on('connect',()=>{state('Połączono',true);buttons(true);log('Drukarka połączona.');const task=client.getPrintTaskType?.();if(task){$('task').value=task;log('Automatycznie wykryty tryb: '+task);}});client.on('disconnect',()=>{state('Rozłączono');buttons(false);log('Drukarka rozłączona.');});client.on('printprogress',e=>{log(`Postęp: ${e.pagePrintProgress??'?'}% (strona ${e.page??'?'})`);});await client.connect();state('Połączono',true);buttons(true);}catch(e){log('Błąd połączenia: '+e.message);state('Rozłączono');buttons(false);client=null;}finally{busy=false;}};
$('disconnect').onclick=async()=>{try{await client?.disconnect();}catch(e){log('Rozłączanie: '+e.message);}finally{client=null;buttons(false);state('Rozłączono');}};
$('print').onclick=async()=>{if(busy||!client)return;let task=null;busy=true;$('print').disabled=true;try{check();await draw();const copies=Number($('copies').value);const name=$('task').value||client.getPrintTaskType?.()||'B1';log(`Druk: SN=${$('sn').value.trim()}, tryb=${name}, kopie=${copies}`);const encoded=ImageEncoder.encodeCanvas($('label'), PageColorType.SingleColor, 'top');task=client.protocol.newPrintTask(name,{totalPages:copies,statusPollIntervalMs:150,statusTimeoutMs:15000,pageColor:PageColorType.SingleColor,density:Number($('density').value)});await task.printInit();await task.printPage(encoded,copies);await task.waitForPageFinished();await task.waitForFinished();log('Zadanie drukowania zakończone.');}catch(e){log('BŁĄD DRUKU: '+(e?.message||String(e)));alert('Drukowanie nie powiodło się. Szczegóły w terminalu.');}finally{try{await task?.printEnd();}catch(e){log('Zamknięcie zadania: '+e.message);}busy=false;$('print').disabled=!client;}};
draw();
