// v1.70 — ogni scheda ha una presenza autonoma; non modifica lo stato di gioco.
export const PRESENCE_INTERVAL_MS=3000;
export const PRESENCE_BACKOFF_MAX_MS=15000;
export const PRESENCE_EXPIRY_MS=45000;
export function presenceStatus(row,ownSide){
 const enemy=ownSide==='axis'?'allies':ownSide==='allies'?'axis':null;
 if(!enemy||row?.side!==enemy||typeof row.online!=='boolean')return {state:'unknown',lastSeen:null};
 return {state:row.online?'online':'offline',lastSeen:typeof row.last_seen==='string'?row.last_seen:null};
}
export function createPresenceMonitor({ping,display,onTransition=()=>{}}){
 let active=null;
 function showUnknown(){display({state:'unknown',lastSeen:null});}
 function schedule(ctx){if(active===ctx){clearTimeout(ctx.timer);ctx.timer=setTimeout(()=>tick(ctx),ctx.delay);}}
 async function tick(ctx){
  if(active!==ctx||ctx.busy)return;
  ctx.busy=true;
  try{
   const row=await ping(ctx.id,false);
   if(active===ctx){
    const status=presenceStatus(row,ctx.side);
    ctx.delay=PRESENCE_INTERVAL_MS;
    display(status);
    const change=presenceTransition(ctx.confirmed,status.state);
    if(status.state!=='unknown')ctx.confirmed=status.state;
    if(change)try{onTransition(change);}catch{}
    clearTimeout(ctx.stale);ctx.stale=setTimeout(()=>{if(active===ctx)showUnknown();},PRESENCE_EXPIRY_MS);
   }
  }catch{if(active===ctx){ctx.delay=Math.min(ctx.delay*2,PRESENCE_BACKOFF_MAX_MS);showUnknown();}}
  finally{ctx.busy=false;schedule(ctx);}
 }
 function stop({notify=false}={}){
  const ctx=active;active=null;
  if(!ctx)return Promise.resolve();
  clearTimeout(ctx.timer);clearTimeout(ctx.stale);
  document.removeEventListener('visibilitychange',ctx.resume);
  window.removeEventListener('online',ctx.resume);window.removeEventListener('offline',ctx.offline);
  if(!notify)return Promise.resolve();
  let timer;return Promise.race([Promise.resolve().then(()=>ping(ctx.id,true)).catch(()=>{}),new Promise(resolve=>{timer=setTimeout(resolve,3500);})]).finally(()=>clearTimeout(timer));
 }
 function start(side){
  stop();showUnknown();
  if(!['axis','allies'].includes(side)||!globalThis.crypto?.randomUUID)return;
  const ctx={id:crypto.randomUUID(),side,timer:null,stale:null,busy:false,confirmed:null,delay:PRESENCE_INTERVAL_MS};
  ctx.resume=()=>{if(active===ctx&&document.visibilityState!=='hidden'&&!ctx.busy){clearTimeout(ctx.timer);tick(ctx);}};
  ctx.offline=()=>{if(active===ctx)showUnknown();};
  active=ctx;document.addEventListener('visibilitychange',ctx.resume);window.addEventListener('online',ctx.resume);window.addEventListener('offline',ctx.offline);
  tick(ctx);
 }
 return {start,stop};
}

// Solo cambi confermati, mai alla prima rilevazione o al passaggio per sconosciuto.
export function presenceTransition(previous,next){
 return ['online','offline'].includes(previous)&&['online','offline'].includes(next)&&previous!==next?next:null;
}
// Segnali originali sintetizzati con Web Audio, senza file esterni.
export function createPresenceSound(){
 const key='campagna-presence-sound';
 let enabled=true,context=null;
 try{enabled=localStorage.getItem(key)!=='off';}catch{}
 function unlock(){
  if(!enabled)return;
  try{
   const Ctor=globalThis.AudioContext||globalThis.webkitAudioContext;
   if(!Ctor)return;
   if(!context||context.state==='closed')context=new Ctor();
   if(context.state!=='running')context.resume().catch(()=>{});
  }catch{}
 }
 function play(state){
  if(!enabled||context?.state!=='running'||!['online','offline'].includes(state))return false;
  try{
   const frequencies=state==='online'?[523.25,659.25,783.99]:[659.25,493.88,392];
   const start=context.currentTime+.015;
   frequencies.forEach((freq,i)=>{
    const oscillator=context.createOscillator(),gain=context.createGain(),t=start+i*.105;
    oscillator.type='sine';oscillator.frequency.setValueAtTime(freq,t);
    gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(.11,t+.018);gain.gain.exponentialRampToValueAtTime(.0001,t+.135);
    oscillator.connect(gain);gain.connect(context.destination);
    oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};
    oscillator.start(t);oscillator.stop(t+.145);
   });
   return true;
  }catch{return false;}
 }
 return {enabled:()=>enabled,unlock,play,setEnabled:value=>{enabled=!!value;try{localStorage.setItem(key,enabled?'on':'off');}catch{}}};
}
