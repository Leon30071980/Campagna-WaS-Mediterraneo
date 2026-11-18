// Campagna W@S Mediterraneo v1.1
import { NHOST } from './config.js?v=1.1';
import { getAccessToken, refreshAccessToken } from './auth.js?v=1.1';

const STATE_QUERY = `query MyCampaignData {
  campaign_profiles { user_id side }
  campaign_snapshot_catalog(order_by: {created_at: desc}) {
    snapshot_id campaign_id turn_index label created_at restorable
  }
  campaign_restore_requests(where: {status: {_eq: "pending"}}, limit: 1) {
    id campaign_id snapshot_id requested_by axis_approved allies_approved status created_at
  }
  campaigns(where: {lifecycle: {_eq: "active"}}, limit: 1) {
    id name turn_index phase axis_concluded allies_concluded axis_ready allies_ready revision
  }
  campaign_side_states {
    campaign_id side state revision updated_at
  }
  campaign_turn_results(order_by: {turn_index: desc}) {
    campaign_id turn_index side own_score opponent_score damage_inflicted damage_suffered
  }
  campaign_battle_reports(order_by: {turn_index: desc}) {
    turn_index side report generated_at
  }
}`;

// Timeout esplicito; non ripetere mutazioni dopo errori di rete dall'esito incerto.
async function graphPost(token, body, mutation=false) {
  if(!token)throw new Error('Sessione non valida. Accedere nuovamente.');
  const controller=new AbortController(), timer=setTimeout(()=>controller.abort(),25000);
  try {
    const response=await fetch(NHOST.graphUrl,{method:'POST',signal:controller.signal,
      headers:{'content-type':'application/json',authorization:'Bearer '+token},body});
    if(response.status===401)return {expired:true};
    const raw=await response.text();
    let data;try{data=JSON.parse(raw);}catch{throw new Error('Risposta Nhost non valida (HTTP '+response.status+'). Verificare il progetto e aggiornare i dati.');}
    const err=data.errors?.[0];
    // Hasura restituisce anche invalid-jwt in una risposta HTTP 200, prima dell'esecuzione.
    if(!data.data&&err?.extensions?.code==='invalid-jwt')return {expired:true};
    if(!response.ok||err)throw new Error(err?.message||'Errore GraphQL ('+response.status+')');
    return {data:data.data};
  }catch(e){
    if(e.name==='AbortError'||e instanceof TypeError)throw new Error(mutation
      ?'Risposta Nhost non ricevuta: esito del salvataggio non confermato. Aggiornare i dati prima di riprovare.'
      :'Nhost non raggiungibile. Verificare connessione e stato del progetto, poi riprovare.');
    throw e;
  }finally{clearTimeout(timer);}
}
async function requestWithToken(token,query){return graphPost(token,JSON.stringify({query}));}
let snapshotStatusSupported=true;

export async function loadCampaign() {
  let token = await getAccessToken();
  if (!token) throw new Error('Accedere con un account di fazione.');
  const load=async()=>{
    const query=snapshotStatusSupported?STATE_QUERY:STATE_QUERY.replace('created_at restorable','created_at');
    let response=await requestWithToken(token,query);
    if(response.expired){token=await refreshAccessToken(token);response=await requestWithToken(token,query);}
    return response;
  };
  let response;
  try{response=await load();}catch(e){
    // Frontend resta accessibile se la migrazione dei soli metadati non è ancora attiva.
    if(snapshotStatusSupported&&/restorable/i.test(e.message)&&/field|campo|not found/i.test(e.message)){
      snapshotStatusSupported=false;response=await load();
    }else throw e;
  }
  if (response.expired) throw new Error('Sessione scaduta. Effettuare di nuovo l’accesso.');
  const data = response.data;
  if (data.campaign_profiles.length !== 1) throw new Error('Il profilo non è associato a una fazione.');
  if (data.campaigns.length !== 1) throw new Error('Campagna attiva non trovata.');
  if (data.campaign_side_states.length !== 1) throw new Error('Non risulta esattamente uno stato privato autorizzato.');
  const profile = data.campaign_profiles[0];
  const own = data.campaign_side_states[0];
  if (profile.side !== own.side || own.campaign_id !== data.campaigns[0].id) {
    throw new Error('Associazione fazione/campagna incoerente.');
  }
  return {
    side: profile.side,
    campaign: data.campaigns[0],
    state: typeof own.state === 'string' ? JSON.parse(own.state) : own.state,
    stateRevision: own.revision,
    updatedAt: own.updated_at,
    results: data.campaign_turn_results || [],
    saves: data.campaign_snapshot_catalog || [],
    snapshotStatusSupported,
    pendingRequest: data.campaign_restore_requests?.[0] || null,
    reports: (data.campaign_battle_reports || []).map(row=>({
      ...row, report: typeof row.report === 'string' ? JSON.parse(row.report) : row.report
    }))
  };
}

// Solo la funzione Hasura dedicata puo' scrivere cataloghi e porto. Non esistono
// mutation dirette sul campo state e la revisione evita sovrascritture concorrenti.
export async function saveLogistics(state, expectedRevision) {
  let token = await getAccessToken();
  if (!token) throw new Error('Sessione non valida. Accedere nuovamente.');
  const query = `mutation SalvaLogistica($navi: jsonb!, $aerei: jsonb!, $porto: jsonb!, $revision: bigint!) {
    campaign_save_logistics(args: {
      p_navi: $navi, p_aerei: $aerei, p_porto: $porto,
      p_expected_revision: $revision
    }) { revision updated_at state }
  }`;
  const body = {query, variables: {
    navi: state.navi, aerei: state.aerei, porto: state.porto, revision: expectedRevision
  }};
  async function exec(accessToken) {
    const response=await graphPost(accessToken,JSON.stringify(body),true);
    if(response.expired)return response;
    const saved=response.data?.campaign_save_logistics;
    if(!Array.isArray(saved)||saved.length!==1)throw new Error('Risposta di salvataggio incompleta.');
    return saved[0];
  }
  let result=await exec(token);
  if(result.expired)result=await exec(await refreshAccessToken(token));
  if (result.expired) throw new Error('Sessione scaduta.');
  return {state:typeof result.state==='string'?JSON.parse(result.state):result.state,
    revision:Number(result.revision),updatedAt:result.updated_at};
}

// Campagna v0.4: mutation controllate (non permettono accesso ai dati avversari).
async function campaignMutation(query, variables, name) {
  const body = JSON.stringify({query, variables});
  const request=async token=>{
    const response=await graphPost(token,body,true);
    if(response.expired)return response;
    const out=response.data?.[name];
    if(!Array.isArray(out)||out.length!==1)throw new Error('Risposta incompleta da '+name);
    return out[0];
  };
  let token=await getAccessToken();
  if(!token)throw new Error('Sessione scaduta.');
  let result=await request(token);
  if(result.expired)result=await request(await refreshAccessToken(token));
  if(result.expired)throw new Error('Sessione scaduta. Accedere nuovamente.');
  return result;
}
export async function saveBattle(battle,revision) {
  const query=`mutation($battle:jsonb,$revision:bigint!){
    campaign_save_battle(args:{p_battle:$battle,p_expected_revision:$revision}){
      revision state updated_at
    }
  }`;
  const r=await campaignMutation(query,{battle,revision},'campaign_save_battle');
  return {state:typeof r.state==='string'?JSON.parse(r.state):r.state,revision:Number(r.revision)};
}
export async function concludeBattle(revision) {
  const query=`mutation($revision:bigint!){
    campaign_conclude_battle(args:{p_expected_revision:$revision}){
      id turn_index phase axis_concluded allies_concluded axis_ready allies_ready revision
    }
  }`;
  return campaignMutation(query,{revision},'campaign_conclude_battle');
}
export async function markReady(revision) {
  const query=`mutation($revision:bigint!){
    campaign_mark_ready(args:{p_expected_revision:$revision}){
      id turn_index phase axis_concluded allies_concluded axis_ready allies_ready revision
    }
  }`;
  return campaignMutation(query,{revision},'campaign_mark_ready');
}

// v0.7: mutazioni protette. Il payload degli snapshot non entra mai nel browser.
export async function createCampaignSave(label) {
  return campaignMutation(`mutation($label:String!){campaign_create_save(args:{p_label:$label}){snapshot_id label turn_index}}`,{label},'campaign_create_save');
}
export async function renameCampaignSave(snapshotId,label) {
  return campaignMutation(`mutation($id:uuid!,$label:String!){campaign_rename_save(args:{p_snapshot_id:$id,p_label:$label}){snapshot_id label turn_index}}`,{id:snapshotId,label},'campaign_rename_save');
}
export async function deleteCampaignSave(snapshotId) {
  return campaignMutation(`mutation($id:uuid!){campaign_delete_save(args:{p_snapshot_id:$id}){snapshot_id label}}`,{id:snapshotId},'campaign_delete_save');
}
export async function requestCampaignLoad(snapshotId) {
  return campaignMutation(`mutation($id:uuid!){campaign_request_load(args:{p_snapshot_id:$id}){id status requested_by axis_approved allies_approved}}`,{id:snapshotId},'campaign_request_load');
}
export async function requestCampaignReset(turnIndex) {
  return campaignMutation(`mutation($turn:Int!){campaign_request_reset(args:{p_start_turn:$turn}){id status requested_by axis_approved allies_approved}}`,{turn:turnIndex},'campaign_request_reset');
}
export async function setScenarioScore(score) {
  return campaignMutation(`mutation($score:numeric!){campaign_set_scenario_score(args:{p_score:$score}){side revision}}`,{score},'campaign_set_scenario_score');
}
export async function resolveCampaignRequest(requestId,approve) {
  return campaignMutation(`mutation($id:uuid!,$approve:Boolean!){campaign_resolve_request(args:{p_request_id:$id,p_approve:$approve}){id status axis_approved allies_approved}}`,{id:requestId,approve},'campaign_resolve_request');
}

// v0.6: sincronizzazione della campagna. La sottoscrizione legge
// soltanto lo stato condiviso della campagna.
// Non legge le formazioni dell'avversario né modifica alcun dato.
const CAMPAIGN_WATCH_FIELDS = `
  campaigns(where: {lifecycle: {_eq: "active"}}, limit: 1) {
    id turn_index phase axis_concluded allies_concluded axis_ready allies_ready revision
  }
`;

function campaignWatchKey(data) {
  const campaign = data?.campaigns?.[0];
  if (!campaign) return null;
  return JSON.stringify([
    campaign.id, Number(campaign.turn_index), campaign.phase,
    !!campaign.axis_concluded, !!campaign.allies_concluded,
    !!campaign.axis_ready, !!campaign.allies_ready,
    String(campaign.revision)
  ]);
}

/**
 * Sottoscrizione Hasura (WebSocket) con controllo HTTP di riserva ogni 5 secondi
 * se il collegamento in tempo reale non e' disponibile.
 * Restituisce una funzione per interrompere tutto al logout.
 */
export function watchCampaign({ campaign, ownRevision, onChange, onStatus }) {
  let stopped = false;
  let socket = null;
  let live = false;
  let retryTimer = null;
  let polling = false;
  let retryDelay = 1500, handshakeTimer = null, lastPoll = 0;
  let previousOwn=String(ownRevision??'');
  const watchQuery = `query WatchCampaign { ${CAMPAIGN_WATCH_FIELDS} campaign_side_states { campaign_id side revision } }`;
  const watchSubscription = `subscription WatchCampaign { ${CAMPAIGN_WATCH_FIELDS} }`;
  let previous = campaignWatchKey({ campaigns: [campaign] });

  function accept(data) {
    if (stopped) return;
    const current = campaignWatchKey(data);
    let changed=false;
    if(current!==null&&current!==previous){previous=current;changed=true;}
    // Solo la revisione privata consentita dal filtro Hasura, senza formazioni.
    if(data?.campaign_side_states?.length===1){
      const own=data.campaign_side_states[0];
      if(String(own.revision)!==previousOwn){previousOwn=String(own.revision);changed=true;}
    }
    if(changed)onChange?.();
  }

  function connectionStatus(isLive) {
    if (stopped || live === isLive) return;
    live = isLive;
    onStatus?.(isLive);
  }

  async function poll(force=false) {
    if (stopped || polling || document.hidden || (!force&&live&&Date.now()-lastPoll<30000)) return;
    polling = true;lastPoll=Date.now();
    try {
      let token = await getAccessToken();
      if (!token || stopped) return;
      let result = await requestWithToken(token, watchQuery);
      if (result.expired) result = await requestWithToken(await refreshAccessToken(token), watchQuery);
      if (!result.expired) accept(result.data);
    } catch (e) {
      // Una temporanea assenza di rete non interferisce con i dati gia' visibili.
      // La verifica sara' ripetuta automaticamente al successivo intervallo.
      console.warn('Sincronizzazione automatica Nhost:', e.message);
    } finally { polling = false; }
  }

  function scheduleReconnect() {
    if (stopped || retryTimer !== null) return;
    retryTimer = setTimeout(() => {
      retryTimer = null;
      connect();
    }, retryDelay);
    retryDelay = Math.min(retryDelay * 2, 30000);
  }

  function connect() {
    if (stopped || socket || typeof WebSocket === 'undefined') return;
    let ws;
    try {
      ws = new WebSocket(NHOST.graphUrl.replace(/^http/, 'ws'), 'graphql-transport-ws');
    } catch {
      scheduleReconnect();
      return;
    }
    socket = ws;
    handshakeTimer=setTimeout(()=>{if(socket===ws&&!live)ws.close();},15000);
    const send = message => {
      if (!stopped && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(message));
    };
    ws.onopen = async () => {
      try {
        const token = await getAccessToken();
        if (stopped || socket !== ws || !token) { ws.close(); return; }
        send({ type: 'connection_init', payload: { headers: { Authorization: 'Bearer ' + token } } });
      } catch { ws.close(); }
    };
    ws.onmessage = event => {
      if (stopped || socket !== ws) return;
      let msg;
      try { msg = JSON.parse(event.data); } catch { return; }
      if (msg.type === 'connection_ack') {
        retryDelay = 1500;
        send({ id: 'campagna-condivisa', type: 'subscribe', payload: { query: watchSubscription } });
      } else if (msg.type === 'next') {
        if (msg.payload?.errors?.length) { ws.close(); return; }
        clearTimeout(handshakeTimer);handshakeTimer=null;
        connectionStatus(true);
        accept(msg.payload?.data);
      } else if (msg.type === 'ping') {
        send({ type: 'pong', payload: msg.payload ?? null });
      } else if (msg.type === 'error' || msg.type === 'complete') {
        ws.close();
      }
    };
    ws.onerror = () => { /* onclose gestisce la riconnessione */ };
    ws.onclose = () => {
      if (socket !== ws) return;
      socket = null;
      clearTimeout(handshakeTimer);handshakeTimer=null;
      connectionStatus(false);
      scheduleReconnect();
    };
  }

  const pollInterval = setInterval(poll, 5000);
  const visibilityChanged = () => {
    if (!document.hidden) poll(true);
  };
  document.addEventListener('visibilitychange', visibilityChanged);
  onStatus?.(false);
  connect();

  return () => {
    stopped = true;
    clearInterval(pollInterval);
    clearTimeout(handshakeTimer);
    if (retryTimer !== null) clearTimeout(retryTimer);
    document.removeEventListener('visibilitychange', visibilityChanged);
    if (socket) { const ws = socket; socket = null; ws.onclose = null; ws.close(); }
  };
}
