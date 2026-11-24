// v1.69 — ogni scheda ha una presenza autonoma; non modifica lo stato di gioco.
export const PRESENCE_INTERVAL_MS=15000;
export const PRESENCE_EXPIRY_MS=45000;
export function presenceStatus(row,ownSide){
 const enemy=ownSide==='axis'?'allies':ownSide==='allies'?'axis':null;
 if(!enemy||row?.side!==enemy||typeof row.online!=='boolean')return {state:'unknown',lastSeen:null};
 return {state:row.online?'online':'offline',lastSeen:typeof row.last_seen==='string'?row.last_seen:null};
}
export function createPresenceMonitor({ping,display}){
 let active=null;
 function showUnknown(){display({state:'unknown',lastSeen:null});}
 function schedule(ctx){if(active===ctx){clearTimeout(ctx.timer);ctx.timer=setTimeout(()=>tick(ctx),PRESENCE_INTERVAL_MS);}}
 async function tick(ctx){
  if(active!==ctx||ctx.busy)return;
  ctx.busy=true;
  try{
   const row=await ping(ctx.id,false);
   if(active===ctx){display(presenceStatus(row,ctx.side));clearTimeout(ctx.stale);ctx.stale=setTimeout(()=>{if(active===ctx)showUnknown();},PRESENCE_EXPIRY_MS);}
  }catch{if(active===ctx)showUnknown();}
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
  const ctx={id:crypto.randomUUID(),side,timer:null,stale:null,busy:false};
  ctx.resume=()=>{if(active===ctx&&document.visibilityState!=='hidden'&&!ctx.busy){clearTimeout(ctx.timer);tick(ctx);}};
  ctx.offline=()=>{if(active===ctx)showUnknown();};
  active=ctx;document.addEventListener('visibilitychange',ctx.resume);window.addEventListener('online',ctx.resume);window.addEventListener('offline',ctx.offline);
  tick(ctx);
 }
 return {start,stop};
}
