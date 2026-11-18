// Campagna W@S Mediterraneo v1.1 — regole comuni per porto e motore.
export const CAMPAIGN_YEARS = Object.freeze([1940,1940,1941,1941,1941,1942,1942,1942,1943,1943]);
export function shipBase(name) {
  return String(name || '').replace(/\s*\((I|II|III)\)$/,'');
}
export function shipStatus(name, losses, turnIndex) {
  let repairing = false;
  const base = shipBase(name);
  for (const [key, loss] of Object.entries(losses || {})) {
    if (shipBase(key) !== base) continue;
    if (loss?.stato === 'affondata') return 'affondata';
    if (loss?.stato === 'danneggiata' && turnIndex <= Number(loss.turno) + 1) repairing = true;
  }
  return repairing ? 'riparazione' : 'attiva';
}
export function isAvailable(unit, state, turnIndex) {
  const year = CAMPAIGN_YEARS[Number(turnIndex)];
  if (!unit || year === undefined || !Number.isFinite(Number(unit.anno)) || Number(unit.anno) > year) return false;
  if (unit.ritirato && year >= Number(unit.ritirato)) return false;
  const ship = unit.kind ? unit.kind === 'nave' : Object.hasOwn(unit, 'cls');
  return !ship || shipStatus(unit.nome, state?.perdite, turnIndex) === 'attiva';
}
// Esclude ESCLUSIVAMENTE la casella in modifica, non tutte le omonime.
export function assignedHullBases(state, excludeSquad = null, excludeIndex = -1) {
  const names = new Set((state?.navi || []).map(u => u.nome));
  const used = new Set();
  for (const [id, entries] of Object.entries(state?.porto || {})) {
    for (const [index, name] of (entries || []).entries()) {
      if (id === excludeSquad && index === excludeIndex) continue;
      if (names.has(name)) used.add(shipBase(name));
    }
  }
  return used;
}
export function duplicateHull(state) {
  const names = new Set((state?.navi || []).map(u => u.nome));
  const used = new Set();
  for (const entries of Object.values(state?.porto || {})) for (const name of entries || []) {
    if (!names.has(name)) continue;
    const base = shipBase(name);
    if (used.has(base)) return base;
    used.add(base);
  }
  return null;
}
