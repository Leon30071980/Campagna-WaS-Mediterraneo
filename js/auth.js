
import { NHOST } from './config.js';
const STORE_KEY = 'campagna-mediterraneo-refresh-token';
let session = null;
let persistent = false;

async function post(path, payload, token = null) {
  const response = await fetch(NHOST.authUrl + path, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(token ? {'Authorization': 'Bearer ' + token} : {})
    },
    body: JSON.stringify(payload)
  });
  const text = await response.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch { data = {}; }
  if (!response.ok) {
    const msg = data?.message || 'Errore autenticazione (' + response.status + ')';
    throw new Error(msg);
  }
  return data;
}

function keep(next, remember) {
  if (!next?.accessToken || !next?.refreshToken) throw new Error('Risposta di accesso incompleta.');
  session = { ...next, expiresAt: Date.now() + ((next.accessTokenExpiresIn || 900) * 1000) };
  persistent = remember;
  if (remember) localStorage.setItem(STORE_KEY, session.refreshToken);
  else localStorage.removeItem(STORE_KEY);
  return session;
}

export async function signIn(email, password, remember) {
  const result = await post('/signin/email-password', { email, password });
  if (!result.session) throw new Error('Accesso non completato: autenticazione aggiuntiva richiesta.');
  return keep(result.session, remember);
}

export async function resumeSession() {
  const refreshToken = localStorage.getItem(STORE_KEY);
  if (!refreshToken) return null;
  try { return keep(await post('/token', { refreshToken }), true); }
  catch { localStorage.removeItem(STORE_KEY); return null; }
}

export async function getAccessToken() {
  if (!session) return null;
  if (Date.now() > session.expiresAt - 60000) {
    keep(await post('/token', { refreshToken: session.refreshToken }), persistent);
  }
  return session.accessToken;
}

export async function refreshAccessToken() {
  if (!session) throw new Error('Sessione scaduta.');
  keep(await post('/token', { refreshToken: session.refreshToken }), persistent);
  return session.accessToken;
}

export async function signOut() {
  const old = session;
  session = null;
  localStorage.removeItem(STORE_KEY);
  if (old?.refreshToken) {
    try { await post('/signout', { refreshToken: old.refreshToken, all: false }, old.accessToken); }
    catch { /* Sessione locale disconnessa anche senza connessione. */ }
  }
}
