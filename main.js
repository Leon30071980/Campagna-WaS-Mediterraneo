import { signIn, signOut, resumeSession } from './auth.js';
import { loadCampaign } from './api.js';
import { SEASONS } from './config.js';

const el = (id) => document.getElementById(id);
const labels = {
  porto: 'Porto', battaglia: 'Battaglia', storico: 'Storico',
  naviglio: 'Naviglio', aerei: 'Aerei', regole: 'Regole'
};
let model = null;
let tab = 'porto';
let filter = '';

function node(tag, cls = '', content = null) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (content !== null) e.textContent = String(content);
  return e;
}
function toast(message, isError = false) {
  const t = el('toast');
  t.textContent = message;
  t.classList.toggle('error', isError);
  t.classList.add('visible');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove('visible'), 4500);
}
function showLogin() {
  el('app-page').hidden = true;
  el('login-page').hidden = false;
  model = null;
  el('password').value = '';
}
function showApp() {
  el('app-page').hidden = false;
  el('login-page').hidden = true;
  document.body.dataset.side = model.side;
  const sideName = model.side === 'axis' ? 'REGIA MARINA · AXIS' : 'ROYAL NAVY · ALLIES';
  el('side-label').textContent = model.side.toUpperCase();
  el('port-title').textContent = sideName;
  el('campaign-name').textContent = model.campaign.name;
  el('season-value').textContent = SEASONS[model.campaign.turn_index] || '—';
  el('phase-value').textContent = ({battle:'Battaglia', results:'Risultati', finished:'Conclusa'})[model.campaign.phase] || model.campaign.phase;
  el('ships-value').textContent = Array.isArray(model.state.navi) ? model.state.navi.length : '—';
  el('planes-value').textContent = Array.isArray(model.state.aerei) ? model.state.aerei.length : '—';
  renderTab();
}
function card(heading) {
  const c = node('section','content-card');
  if (heading) c.append(node('h2','section-title',heading));
  return c;
}
function note(msg) { return node('div', 'info-line', msg); }
function item(label, value) {
  const row = node('div','detail-row');
  row.append(node('span','dim',label), node('strong','',value));
  return row;
}
function showPort(panel) {
  const c = card('Situazione del porto');
  const porto = model.state.porto || {};
  let shipsAssigned = 0;
  Object.values(porto).forEach(v => { if (Array.isArray(v)) shipsAssigned += v.filter(Boolean).length; });
  c.append(item('Squadre configurate', Object.keys(porto).length));
  c.append(item('Unità assegnate agli slot', shipsAssigned));
  c.append(item('Stato del catalogo', 'Importato da Nhost'));
  c.append(item('Revisione dei dati', model.stateRevision));
  c.append(note('La configurazione e modifica del porto saranno abilitate quando installeremo le funzioni server di salvataggio.'));
  panel.append(c);
  const status = card('Sincronizzazione del turno');
  const b = model.campaign;
  status.append(item('Conclusione Axis', b.axis_concluded ? 'Confermata' : 'Non conclusa'));
  status.append(item('Conclusione Allies', b.allies_concluded ? 'Confermata' : 'Non conclusa'));
  status.append(item('Pronto Axis', b.axis_ready ? 'Sì' : 'No'));
  status.append(item('Pronto Allies', b.allies_ready ? 'Sì' : 'No'));
  status.append(note('Questo pannello contiene soltanto lo stato condiviso, mai i dati riservati della fazione opposta.'));
  panel.append(status);
}
function showUnits(panel, kind) {
  const entries = (kind === 'naviglio' ? model.state.navi : model.state.aerei) || [];
  const c = card(kind === 'naviglio' ? 'Catalogo Naviglio' : 'Catalogo Aerei');
  const bar = node('div','toolbar');
  const count = node('span','muted',`${entries.length} voci · Solo lettura`);
  const search = node('input','search-input');
  search.type = 'search';
  search.placeholder = 'Cerca per nome o tipo…';
  search.setAttribute('aria-label','Cerca unità');
  search.value = filter;
  bar.append(count, search);
  const wrap = node('div','table-wrap');
  c.append(bar, wrap);
  function populate() {
    const matches = entries.filter(v => (String(v.nome || '') + ' ' + String(v.tipo || '')).toLocaleLowerCase('it').includes(filter.toLocaleLowerCase('it')));
    const table = node('table','units-table');
    const head = node('thead');
    const tr = node('tr');
    const fields = kind === 'naviglio' ? ['Nome','Tipo','Punti','Entrata','Ritiro'] : ['Nome','Tipo','Punti','Entrata','Base'];
    fields.forEach(h => tr.append(node('th','',h)));
    head.append(tr); table.append(head);
    const tbody = node('tbody');
    for (const v of matches) {
      const r = node('tr');
      const values = [v.nome, v.tipo, v.pt, v.anno, kind === 'naviglio' ? v.ritirato : v.base];
      values.forEach((x,i) => r.append(node('td',i === 2?'num':'', x ?? '—')));
      tbody.append(r);
    }
    table.append(tbody);
    wrap.replaceChildren(table);
    count.textContent = `${matches.length} / ${entries.length} voci · Solo lettura`;
  }
  search.addEventListener('input', () => { filter = search.value; populate(); });
  populate();
  c.append(note('Le funzioni Aggiungi / Modifica / Archivia saranno introdotte nella fase di salvataggio protetto. Gli elementi esistenti non sono modificabili in questa versione.'));
  panel.append(c);
}
function showBattle(panel) {
  const c = card('Battaglia');
  c.append(note('La gestione delle formazioni rimane temporaneamente bloccata: manca ancora il motore server che salva i danni e sincronizza le due conclusioni.'));
  const battle = model.state.battaglia;
  c.append(item('Formazione in corso', battle ? 'Presente nello stato privato' : 'Nessuna formazione generata'));
  c.append(item('Regola confermata', 'Due conclusioni → risultati → due “Pronto” → turno successivo'));
  panel.append(c);
}
function showHistory(panel) {
  const c = card('Storico');
  const history = Array.isArray(model.state.storico) ? model.state.storico : [];
  c.append(item('Battaglie presenti nello stato privato', history.length));
  c.append(item('Risultati condivisi e calcolati', model.results.length));
  if (model.results.length) {
    const box = node('div','results-list');
    for (const r of model.results) {
      const div = node('div','result-item');
      div.append(node('strong','',SEASONS[r.turn_index] || 'Turno ' + r.turn_index));
      div.append(node('span','',`Punti propri: ${Number(r.own_score).toFixed(1)}`));
      div.append(node('span','',`Punti nemici: ${Number(r.opponent_score).toFixed(1)}`));
      box.append(div);
    }
    c.append(box);
  } else c.append(note('Nessuna battaglia conclusa e calcolata.'));
  panel.append(c);
}
function showRules(panel) {
  const c = card('Regole di campagna');
  for (const line of [
    'Ogni fazione può leggere soltanto il proprio porto, le proprie unità e il proprio storico dettagliato.',
    'Gli esiti delle unità sono inseriti autonomamente da ciascuna fazione.',
    'I dati per calcolare i punteggi avversari vengono elaborati solo dopo che entrambi hanno premuto «Concludi battaglia».',
    'Il turno successivo si apre soltanto dopo che entrambi hanno premuto «Pronto per il prossimo turno».',
    'Le navi affondate sono perse definitivamente; quelle danneggiate seguono la riparazione. Gli aerei distrutti non vengono radiati permanentemente.',
    'I cataloghi saranno modificabili dal rispettivo proprietario fuori dalle battaglie attive.'
  ]) c.append(note(line));
  panel.append(c);
}
function renderTab() {
  const panel = el('panel'); panel.replaceChildren();
  document.querySelectorAll('[data-tab]').forEach(x => {
    x.classList.toggle('active', x.dataset.tab === tab);
    x.setAttribute('aria-current',x.dataset.tab === tab?'page':'false');
  });
  if (!model) return;
  if (tab === 'porto') showPort(panel);
  else if (tab === 'naviglio' || tab === 'aerei') showUnits(panel,tab);
  else if (tab === 'battaglia') showBattle(panel);
  else if (tab === 'storico') showHistory(panel);
  else showRules(panel);
}
async function reload() {
  model = await loadCampaign();
  if (!['axis','allies'].includes(model.side)) throw new Error('Fazione non valida.');
  showApp();
}

el('login-form').addEventListener('submit', async event => {
  event.preventDefault();
  const submit = el('login-submit');
  submit.disabled = true; submit.textContent = 'Accesso in corso…';
  el('login-error').hidden = true;
  try {
    await signIn(el('email').value.trim(),el('password').value,el('remember').checked);
    await reload();
    toast('Accesso riuscito: dati riservati caricati.');
  } catch (err) {
    el('login-error').textContent = err.message;
    el('login-error').hidden = false;
    await signOut();
  } finally {submit.disabled = false; submit.textContent = 'Accedi al Quadro Comando';}
});
el('show-password').addEventListener('click', () => {
  const input = el('password');
  const visible = input.type !== 'password';
  input.type = visible?'password':'text';
  el('show-password').textContent = visible?'Mostra':'Nascondi';
  el('show-password').setAttribute('aria-pressed',String(!visible));
});
el('logout-btn').addEventListener('click', async () => { await signOut(); showLogin(); toast('Disconnessione eseguita.'); });
el('refresh-btn').addEventListener('click', async () => {
  const b=el('refresh-btn'); b.disabled=true;
  try { await reload(); toast('Dati aggiornati da Nhost.'); }
  catch (e) { toast(e.message,true); }
  finally { b.disabled=false; }
});
el('tabs').addEventListener('click', event => {
  const t = event.target.closest('[data-tab]');
  if (!t || !labels[t.dataset.tab]) return;
  if (tab !== t.dataset.tab) filter='';
  tab=t.dataset.tab; renderTab();
});
(async () => {
  try {
    const session = await resumeSession();
    if (session) await reload();
    else showLogin();
  } catch { await signOut(); showLogin(); toast('La sessione precedente non è più valida.',true); }
})();
