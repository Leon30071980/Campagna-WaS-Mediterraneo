// Campagna W@S Mediterraneo v1.2 — rinnovo serializzato, nessun segreto nel client.
import { NHOST } from './config.js?v=1.2';
const STORE_KEY = 'campagna-mediterraneo-refresh-token';
let session = null, persistent = false, epoch = 0, renewing = null;
const readStored = () => { try { return localStorage.getItem(STORE_KEY); } catch { return null; } };
function store(token) {
  try { if (token) localStorage.setItem(STORE_KEY, token); else localStorage.removeItem(STORE_KEY); } catch { /* browser senza storage */ }
}
async function post(path, payload, token = null) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), path === '/signout' ? 5000 : 20000);
  try {
    const response = await fetch(NHOST.authUrl + path, {
      method: 'POST', signal: controller.signal,
      headers: {'content-type':'application/json', ...(token ? {Authorization:'Bearer ' + token} : {})},
      body: JSON.stringify(payload)
    });
    const raw = await response.text();
    let data; try { data = raw ? JSON.parse(raw) : {}; } catch { data = {}; }
    if (!response.ok) {
      const error = new Error(data?.message || 'Errore autenticazione (' + response.status + ')');
      error.status = response.status; throw error;
    }
    return data;
  } catch (error) {
    if (error.name === 'AbortError' || error instanceof TypeError) {
      const e = new Error('Nhost non raggiungibile. Verificare connessione e stato del progetto Nhost, poi riprovare.');
      e.transient = true; throw e;
    }
    throw error;
  } finally { clearTimeout(timer); }
}
function keep(next, remember) {
  if (!next?.accessToken || !next?.refreshToken) throw new Error('Risposta di accesso incompleta.');
  session = {...next, expiresAt:Date.now() + ((next.accessTokenExpiresIn || 900)*1000)};
  persistent = !!remember;
  store(persistent ? session.refreshToken : null);
  return session;
}
export async function signIn(email, password, remember) {
  const current = ++epoch; session = null; renewing = null; store(null);
  const result = await post('/signin/email-password', {email,password});
  if (current !== epoch) throw new Error('Accesso annullato.');
  if (!result.session) throw new Error('Accesso non completato: autenticazione aggiuntiva richiesta.');
  return keep(result.session, remember);
}
export async function resumeSession() {
  const refreshToken = readStored();
  if (!refreshToken) return null;
  const current = ++epoch;
  try {
    const next = await post('/token', {refreshToken});
    if (current !== epoch) return null;
    return keep(next, true);
  } catch (error) {
    if (current !== epoch) return null;
    // Mantiene il token su errori di rete e indisponibilità temporanea del servizio.
    if (error.status === 400 || error.status === 401 || error.status === 403) {store(null);return null;}
    throw error;
  }
}
export async function getAccessToken() {
  if (!session) return null;
  if (renewing) return renewing.promise;
  if (Date.now() > session.expiresAt - 60000) return refreshAccessToken(session.accessToken);
  return session.accessToken;
}
export async function refreshAccessToken(rejectedToken = null) {
  if (!session) throw new Error('Sessione scaduta.');
  if (renewing) return renewing.promise;
  // Una richiesta HTTP tardiva puo' aver ricevuto 401 per il token gia' sostituito.
  if (rejectedToken && rejectedToken !== session.accessToken) return session.accessToken;
  const current = epoch, old = session, remember = persistent;
  const request = {};
  request.promise = (async () => {
    const next = await post('/token', {refreshToken:old.refreshToken});
    if (current !== epoch || session !== old) {
      // Non far rivivere una sessione dopo il logout. Revoca anche il token appena ruotato.
      if (next?.refreshToken) post('/signout',{refreshToken:next.refreshToken,all:false},next.accessToken).catch(()=>{});
      throw new Error('Sessione terminata.');
    }
    return keep(next,remember).accessToken;
  })().finally(()=>{if(renewing===request)renewing=null;});
  renewing = request;
  return request.promise;
}
export async function signOut() {
  const old = session;
  ++epoch; session=null; renewing=null; persistent=false; store(null);
  if (old?.refreshToken) {
    try {await post('/signout',{refreshToken:old.refreshToken,all:false},old.accessToken);} catch { /* logout locale gia' eseguito */ }
  }
}
