// Compile l'affaire : retire la vérité en clair, ne garde que des empreintes et le texte final scellé.
//   node auteur/build.mjs
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
import src from './NE_PAS_OUVRIR_affaire1.mjs';

const require = createRequire(import.meta.url);
const core = require('../js/core.js');
const here = path.dirname(fileURLToPath(import.meta.url));

export function compile(a = src) {
  const salt = 'ptah-' + a.id + '-v' + a.version;
  const v = a.verite;
  const preuves = {};
  for (const slot of Object.keys(a.accusation.preuves)) {
    preuves[slot] = a.accusation.preuves[slot].map((id) => core.hProof(salt, slot, id)).sort();
  }
  const key = v.coupable + '|' + v.mobile + '|' + v.methode;
  const out = {
    id: a.id, version: a.version, titre: a.titre, lieu: a.lieu, epoque: a.epoque, saison: a.saison,
    intro: a.intro, portraits: a.portraits, suspects: a.suspects, temoins: a.temoins, savoirs: a.savoirs,
    lieux: a.lieux, plan: a.plan, scenes: a.scenes, indices: a.indices, gens: a.gens, aides: a.aides,
    accusation: {
      mobiles: a.accusation.mobiles, methodes: a.accusation.methodes, emplacements: a.accusation.emplacements,
      fins: a.accusation.fins
    },
    solution: {
      salt,
      hc: core.hCulprit(salt, v.coupable),
      hall: core.hAll(salt, v.coupable, v.mobile, v.methode),
      preuves,
      epilogue: core.seal(JSON.stringify(v.epilogue), key)
    }
  };
  return out;
}

export function toScript(out) {
  return '/* Fichier généré par auteur/build.mjs — ne pas modifier à la main. */\n' +
    'window.VERDICT_CASES = window.VERDICT_CASES || {};\n' +
    'window.VERDICT_CASES[' + JSON.stringify(out.id) + '] = ' + JSON.stringify(out) + ';\n';
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  const out = compile();
  const dest = path.join(here, '..', 'saisons', 's1', 'affaire1.js');
  fs.writeFileSync(dest, toScript(out));
  console.log('écrit :', path.relative(process.cwd(), dest), '(' + Math.round(fs.statSync(dest).size / 1024) + ' Ko)');
}
