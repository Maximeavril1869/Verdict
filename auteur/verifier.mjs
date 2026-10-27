// Vérifie qu'une affaire est SOLVABLE et n'a qu'UNE solution.
//   node auteur/verifier.mjs
import { createRequire } from 'node:module';
import src from './NE_PAS_OUVRIR_affaire1.mjs';
import { compile, toScript } from './build.mjs';

const require = createRequire(import.meta.url);
const core = require('../js/core.js');

let erreurs = 0, avertissements = 0;
const ok = (m) => console.log('  ✓ ' + m);
const ko = (m) => { erreurs++; console.log('  ✗ ' + m); };
const warn = (m) => { avertissements++; console.log('  ! ' + m); };
const titre = (t) => console.log('\n' + t);

const a = src;
const M = a.verite.modele;
const indexClues = Object.fromEntries(a.indices.map((c) => [c.id, c]));

/* ───────── 1. Intégrité ───────── */
titre('1. Intégrité des données');
{
  const ids = a.indices.map((c) => c.id);
  if (new Set(ids).size !== ids.length) ko('identifiants d’indices en double'); else ok(ids.length + ' indices, identifiants uniques');

  // zones cliquables <-> indices de scène
  for (const sc of a.scenes) {
    const hot = [...sc.svg.matchAll(/data-hot="([^"]+)"/g)].map((m) => m[1]);
    const declared = a.indices.filter((c) => c.scene === sc.id).map((c) => c.id);
    const manque = declared.filter((i) => !hot.includes(i)), orphelins = hot.filter((i) => !declared.includes(i));
    if (manque.length || orphelins.length) ko(`scène ${sc.id} : sans zone ${manque.join(',')} | zones sans indice ${orphelins.join(',')}`);
    else ok(`scène ${sc.id} : ${hot.length} zones ↔ ${declared.length} indices`);
  }
  // références
  const personnes = [...a.suspects, ...a.temoins].map((p) => p.id);
  const topics = new Set();
  for (const p of personnes) {
    if (!a.gens[p]) ko('pas de dialogue pour ' + p);
    else for (const s of a.gens[p].sujets) topics.add(p + '.' + s.id);
  }
  const refOk = (r) => indexClues[r] || topics.has(r);
  for (const p of personnes) {
    for (const s of a.gens[p].sujets) {
      for (const r of s.requires || []) if (!refOk(r)) ko(`${p}.${s.id} requiert « ${r} » inconnu`);
      for (const g of s.grants || []) if (!indexClues[g]) ko(`${p}.${s.id} accorde « ${g} » inconnu`);
    }
    for (const c of a.gens[p].confrontations) {
      for (const r of c.pieces) if (!indexClues[r]) ko(`${p} : confrontation avec pièce inconnue « ${r} »`);
      for (const g of c.grants || []) if (!indexClues[g]) ko(`${p} : confrontation accorde « ${g} » inconnu`);
      if (c.sujet && !topics.has(p + '.' + c.sujet)) ko(`${p} : confrontation liée au sujet inconnu « ${c.sujet} »`);
    }
  }
  for (const c of a.indices) {
    for (const r of c.requires || []) if (!refOk(r)) ko(`indice ${c.id} requiert « ${r} » inconnu`);
    if (!c.scene && !c.source) ko(`indice ${c.id} sans scène ni source`);
    if (c.source && !personnes.includes(c.source)) ko(`indice ${c.id} : source inconnue ${c.source}`);
  }
  // indices de témoignage : doivent être accordés par leur source
  for (const c of a.indices.filter((x) => x.source)) {
    const grantedByOwner = a.gens[c.source].sujets.some((s) => (s.grants || []).includes(c.id)) ||
      a.gens[c.source].confrontations.some((x) => (x.grants || []).includes(c.id));
    const grantedElsewhere = personnes.some((p) => a.gens[p].sujets.some((s) => (s.grants || []).includes(c.id)) ||
      a.gens[p].confrontations.some((x) => (x.grants || []).includes(c.id)));
    if (!grantedByOwner && !grantedElsewhere) ko(`indice de témoignage ${c.id} jamais accordé`);
  }
  // accusation
  const acc = a.accusation, v = a.verite;
  if (!acc.mobiles.some((x) => x.id === v.mobile)) ko('mobile vrai absent de la liste'); else ok('mobile vrai présent dans la liste');
  if (!acc.methodes.some((x) => x.id === v.methode)) ko('méthode vraie absente de la liste'); else ok('méthode vraie présente dans la liste');
  for (const s of a.suspects) if (s.id !== v.coupable && !acc.fins[s.id]) ko('pas de fin pour ' + s.id);
  if (!acc.fins.insuffisant) ko('pas de fin « insuffisant »');
  const nomCoupable = a.suspects.find((s) => s.id === v.coupable).nom;
  for (const [k, f] of Object.entries(acc.fins)) {
    if ((f.titre + f.texte).includes(nomCoupable)) ko(`la fin « ${k} » nomme le vrai coupable`);
  }
  ok('aucune fin de défaite ne nomme le vrai coupable');
  for (const [k, m] of Object.entries(M.mobiles)) if (!acc.mobiles.some((x) => x.id === k)) ko('mobile du modèle absent de la liste : ' + k);
  for (const [k, m] of Object.entries(M.methodes)) if (!acc.methodes.some((x) => x.id === k)) ko('méthode du modèle absente de la liste : ' + k);
  for (const x of acc.mobiles) if (!M.mobiles[x.id]) ko('mobile sans modèle : ' + x.id);
  for (const x of acc.methodes) if (!M.methodes[x.id]) ko('méthode sans modèle : ' + x.id);
}

/* ───────── 2. Accessibilité : tout est-il atteignable ? ───────── */
titre('2. Accessibilité (un joueur parfait peut-il tout trouver ?)');
const known = {};
{
  const personnes = [...a.suspects, ...a.temoins].map((p) => p.id);
  const reqOk = (r) => core.reqOk(r, known);
  let change = true, tours = 0;
  while (change && tours < 50) {
    change = false; tours++;
    for (const c of a.indices.filter((x) => x.scene)) if (!known[c.id] && reqOk(c.requires)) { known[c.id] = true; change = true; }
    for (const p of personnes) {
      for (const s of a.gens[p].sujets) {
        const key = p + '.' + s.id;
        if (!known[key] && reqOk(s.requires)) {
          known[key] = true; change = true;
          for (const g of s.grants || []) if (!known[g]) known[g] = true;
        }
      }
      a.gens[p].confrontations.forEach((c, i) => {
        const key = 'conf.' + p + '.' + i;
        if (!known[key] && c.pieces.some((x) => known[x])) {
          known[key] = true; change = true;
          for (const g of c.grants || []) if (!known[g]) known[g] = true;
        }
      });
    }
  }
  const inacc = a.indices.filter((c) => !known[c.id]).map((c) => c.id);
  if (inacc.length) ko('indices inaccessibles : ' + inacc.join(', ')); else ok('les ' + a.indices.length + ' indices sont tous atteignables');
  const sujetsInacc = [];
  for (const p of personnes) for (const s of a.gens[p].sujets) if (!known[p + '.' + s.id]) sujetsInacc.push(p + '.' + s.id);
  if (sujetsInacc.length) ko('sujets inaccessibles : ' + sujetsInacc.join(', ')); else ok('tous les sujets de conversation sont déblocables');
  const confInacc = [];
  for (const p of personnes) a.gens[p].confrontations.forEach((c, i) => { if (!known['conf.' + p + '.' + i]) confInacc.push(p + '#' + i); });
  if (confInacc.length) warn('confrontations jamais déclenchables : ' + confInacc.join(', ')); else ok('toutes les confrontations sont déclenchables');
}

/* ───────── 3. Unicité de la solution (modèle logique) ───────── */
titre('3. Une seule solution ?');
{
  const R = M.reserve, fin = M.bouchon_mou_a, dur = M.argile_dur_h;
  const candidats = [];
  console.log('  Fenêtre de retouche du bouchon : vérifié sain à ' + R.verrouillee_de + 'h ; mou à ' + fin + 'h ⇒ posé après ' + (fin - dur) + 'h ; dur à ' + M.livraison + 'h ⇒ posé avant ' + (M.livraison - dur) + 'h');
  for (const s of M.suspects) {
    const ouv = R.ouvertures.filter((o) => o.qui === s);
    let raison = 'n’est jamais entré dans la réserve après sa fermeture';
    let possible = false;
    for (const o of ouv) {
      const apresVerif = o.creneau >= R.verrouillee_de;
      const argileMolle = (o.creneau + 1) > (fin - dur);      // il existe un instant du créneau qui rend l'argile molle à 13h
      const avantLivraison = o.creneau < (M.livraison - dur);   // dur à la livraison : posé au plus tard 2 h avant
      if (!apresVerif) raison = `visite au créneau ${o.creneau}h, avant la vérification de ${R.verrouillee_de}h (argile dure depuis)`;
      else if (!o.surveille && argileMolle && avantLivraison) { possible = true; raison = `seul dans la réserve au créneau ${o.creneau}h`; }
      else if (o.surveille) raison = `entré au créneau ${o.creneau}h mais surveillé par Pa`;
      else raison = `entré hors de la fenêtre d’argile`;
    }
    if (possible) candidats.push(s);
    console.log('   ' + (possible ? '●' : '○') + ' ' + s.padEnd(8) + raison);
  }
  if (!R.porte_arriere_barree || !R.sceau_brasserie_dans_reserve) ko('hypothèses de la réserve incomplètes');
  if (M.portes_archives.fenetre_praticable) ko('la fenêtre est supposée praticable');
  if (candidats.length === 1 && candidats[0] === a.verite.coupable) ok('un seul coupable possible : ' + candidats[0]);
  else ko('coupables possibles : ' + candidats.join(', '));

  const vrais = new Set(M.faits_vrais), faux = new Set(M.faits_faux);
  for (const f of [...vrais]) if (faux.has(f)) ko('fait à la fois vrai et faux : ' + f);
  const compat = (table) => Object.entries(table).filter(([, needs]) => needs.every((n) => vrais.has(n))).map(([k]) => k);
  const mobiles = compat(M.mobiles), methodes = compat(M.methodes);
  if (mobiles.length === 1 && mobiles[0] === a.verite.mobile) ok('un seul mobile compatible : ' + mobiles[0]); else ko('mobiles compatibles : ' + mobiles.join(', '));
  if (methodes.length === 1 && methodes[0] === a.verite.methode) ok('une seule méthode compatible : ' + methodes[0]); else ko('méthodes compatibles : ' + methodes.join(', '));
  for (const t of [M.mobiles, M.methodes]) for (const needs of Object.values(t)) for (const n of needs) if (!vrais.has(n) && !faux.has(n)) ko('fait non classé : ' + n);
}

/* ───────── 4. Les faits décisifs sont-ils établis par des indices ? ───────── */
titre('4. Chaque fait décisif repose sur des indices obtenables');
{
  for (const [fait, ids] of Object.entries(M.soutiens)) {
    const manquants = ids.filter((i) => !indexClues[i]), inacc = ids.filter((i) => indexClues[i] && !known[i]);
    if (manquants.length) ko(`${fait} : indices inconnus ${manquants.join(',')}`);
    else if (inacc.length) ko(`${fait} : indices inaccessibles ${inacc.join(',')}`);
    else if (ids.length < 2) warn(`${fait} : un seul indice le soutient (${ids[0]})`);
    else ok(`${fait} ← ${ids.join(' · ')}`);
  }
}

/* ───────── 5. Preuves de l'accusation ───────── */
titre('5. Preuves acceptées');
{
  for (const [slot, ids] of Object.entries(a.accusation.preuves)) {
    const bad = ids.filter((i) => !indexClues[i] || !known[i]);
    if (bad.length) ko(`emplacement ${slot} : indices invalides ${bad.join(',')}`);
    else if (ids.length < 2) warn(`emplacement ${slot} : un seul indice accepté`);
    else ok(`${slot} : ${ids.join(', ')}`);
  }
  for (const e of a.accusation.emplacements) if (!a.accusation.preuves[e.id]) ko('emplacement sans preuves : ' + e.id);
}

/* ───────── 6. Compilation et essais d'accusation ───────── */
titre('6. Compilation + essais d’accusation sur le fichier compilé');
const out = compile(a);
{
  const script = toScript(out);
  const forbidden = ['"verite"', '"coupable"', 'Néferet est condamnée', 'Tout s’éclaire', '"modele"', 'faits_vrais'];
  const fuites = forbidden.filter((f) => script.includes(f));
  if (fuites.length) ko('fuite dans le fichier compilé : ' + fuites.join(', ')); else ok('rien de la vérité n’apparaît en clair dans le fichier compilé');

  const tout = Object.fromEntries(a.indices.map((c) => [c.id, true]));
  const pr = (o, m, p) => ({ occasion: o, moyen: m, mobile: p });
  const bon = { coupable: a.verite.coupable, mobile: a.verite.mobile, methode: a.verite.methode, preuves: pr('pa_seule', 'bouchon', 'registre_lumiere') };
  let r = core.evaluer(out, bon, tout);
  if (r.issue === 'victoire' && r.fin.texte.includes('Néferet')) ok('accusation exacte → victoire, texte final déchiffré'); else ko('accusation exacte refusée : ' + r.issue);

  let faux = 0;
  for (const s of a.suspects) {
    if (s.id === a.verite.coupable) continue;
    r = core.evaluer(out, { ...bon, coupable: s.id }, tout);
    if (r.issue !== 'ruine') ko('accuser ' + s.id + ' ne ruine pas : ' + r.issue); else faux++;
  }
  ok(faux + ' accusations d’innocents → ruine');

  // aucun triplet erroné ne doit gagner
  let gagnants = 0, total = 0;
  for (const s of a.suspects) for (const m of a.accusation.mobiles) for (const me of a.accusation.methodes) {
    total++;
    const rr = core.evaluer(out, { coupable: s.id, mobile: m.id, methode: me.id, preuves: bon.preuves }, tout);
    if (rr.issue === 'victoire') gagnants++;
  }
  if (gagnants === 1) ok(`${total} combinaisons coupable/mobile/méthode testées : une seule gagne`); else ko(gagnants + ' combinaisons gagnent sur ' + total);

  // preuves : toutes les combinaisons parmi tous les indices
  let bonnes = 0, essais = 0;
  const ids = a.indices.map((c) => c.id);
  for (const o of ids) for (const m of ids) for (const p of ids) {
    essais++;
    if (core.evaluer(out, { ...bon, preuves: pr(o, m, p) }, tout).issue === 'victoire') bonnes++;
  }
  const attendu = a.accusation.preuves.occasion.length * a.accusation.preuves.moyen.length * a.accusation.preuves.mobile.length;
  const doublons = [...a.accusation.preuves.occasion, ...a.accusation.preuves.moyen, ...a.accusation.preuves.mobile];
  if (new Set(doublons).size !== doublons.length) warn('un même indice est accepté dans plusieurs emplacements');
  if (bonnes === attendu) ok(`${essais} combinaisons de preuves testées : ${bonnes} valides (attendu ${attendu})`); else ko(`preuves valides : ${bonnes}, attendu ${attendu}`);

  r = core.evaluer(out, { ...bon, preuves: pr('pa_seule', 'bouchon', 'registre_lumiere') }, { ...tout, pa_seule: false });
  if (r.issue === 'insuffisant') ok('une preuve non découverte est refusée'); else ko('preuve non découverte acceptée');
  r = core.evaluer(out, { ...bon, mobile: 'liaison' }, tout);
  if (r.issue === 'insuffisant') ok('bon coupable + mauvais mobile → preuves insuffisantes'); else ko('mauvais mobile : ' + r.issue);
  r = core.evaluer(out, { ...bon, methode: 'transport' }, tout);
  if (r.issue === 'insuffisant') ok('bon coupable + mauvaise méthode → preuves insuffisantes'); else ko('mauvaise méthode : ' + r.issue);
}

console.log('\n' + (erreurs ? `✗ ${erreurs} erreur(s)` : '✓ aucune erreur') + (avertissements ? `, ${avertissements} avertissement(s)` : ''));
process.exit(erreurs ? 1 : 0);
