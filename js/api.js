
import { NHOST } from './config.js';
import { getAccessToken, refreshAccessToken } from './auth.js';

const STATE_QUERY = `query MyCampaignData {
  campaign_profiles { user_id side }
  campaigns(where: {lifecycle: {_eq: "active"}}, limit: 1) {
    id name turn_index phase axis_concluded allies_concluded axis_ready allies_ready revision
  }
  campaign_side_states {
    campaign_id side state revision updated_at
  }
  campaign_turn_results(order_by: {turn_index: desc}) {
    campaign_id turn_index side own_score opponent_score damage_inflicted damage_suffered
  }
}`;

async function requestWithToken(token, query) {
  const response = await fetch(NHOST.graphUrl, {
    method: 'POST',
    headers: { 'content-type':'application/json', 'authorization':'Bearer ' + token },
    body: JSON.stringify({query})
  });
  if (response.status === 401) return { expired: true };
  const body = await response.json();
  if (!response.ok || body.errors?.length) {
    const msg = body.errors?.[0]?.message || 'Errore GraphQL (' + response.status + ')';
    throw new Error(msg);
  }
  return { data: body.data };
}

export async function loadCampaign() {
  let token = await getAccessToken();
  if (!token) throw new Error('Accedere con un account di fazione.');
  let response = await requestWithToken(token, STATE_QUERY);
  if (response.expired) response = await requestWithToken(await refreshAccessToken(), STATE_QUERY);
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
    results: data.campaign_turn_results || []
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
    const r = await fetch(NHOST.graphUrl, {
      method:'POST',
      headers:{'content-type':'application/json',authorization:'Bearer '+accessToken},
      body:JSON.stringify(body)
    });
    if (r.status===401) return {expired:true};
    const json = await r.json();
    if (!r.ok || json.errors?.length) {
      throw new Error(json.errors?.[0]?.message || 'Salvataggio non riuscito ('+r.status+').');
    }
    const saved=json.data?.campaign_save_logistics;
    if (!Array.isArray(saved) || saved.length!==1) throw new Error('Risposta di salvataggio incompleta.');
    return saved[0];
  }
  let result=await exec(token);
  if (result.expired) result=await exec(await refreshAccessToken());
  if (result.expired) throw new Error('Sessione scaduta.');
  return {state:typeof result.state==='string'?JSON.parse(result.state):result.state,
    revision:Number(result.revision),updatedAt:result.updated_at};
}
