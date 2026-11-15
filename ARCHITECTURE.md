# Architecture — Verdict

Application web statique (PWA), sans build côté joueur, sans dépendance. Hébergée par GitHub Pages (branche `main`, racine).

## Arborescence

| Chemin | Rôle |
|---|---|
| `index.html`, `manifest.webmanifest`, `icons/` | Page d'entrée et installation sur l'écran d'accueil |
| `sw.js` | Service worker : cache hors connexion. Changer `VERSION` à chaque publication |
| `css/style.css` | Styles (iPad Pro 11" prioritaire, repli iPhone) |
| `js/core.js` | Noyau sans interface : SHA-256, règles de déblocage (`reqOk`, `sujetsDispo`, `confrontation`), évaluation de l'accusation (`evaluer`) |
| `js/app.js` | Interface : accueil, coque de l'enquête, 7 onglets, modales, réglages, signalement |
| `js/art.js` | Illustrations vectorielles (portraits, scènes) |
| `saisons/index.js` | Catalogue des saisons et affaires, chargées à la demande |
| `saisons/s1/affaire1.js` | Affaire compilée (vérité remplacée par des empreintes) |
| `auteur/` | Outils de l'auteur : source de l'affaire, compilateur (`build.mjs`), vérificateur (`verifier.mjs`) |

## Flux

Source de l'affaire (`auteur/`) → `build.mjs` → `saisons/s1/affaire1.js` → chargé par `app.js` → état de partie dans `localStorage` (préfixe `verdict:v1:`).

## Modèle d'une affaire

`intro`, `suspects`, `temoins`, `scenes` (zones cliquables), `indices` (pièces, avec conditions `requires`), `gens` (par personne : `sujets`, `confrontations`, `avis`), `savoirs`, `lieux` et `plan`, `aides` (indices optionnels), `accusation` (mobiles, méthodes, emplacements de preuves, fins), `solution` (empreintes).

## Écrans

Dossier · Scènes · Interroger · Savoirs · Pièces · Carnet (notes, chronologie, suspects) · Accuser.

## État de partie

`found`/`order` (pièces trouvées), `asked` et `talk` (interrogatoires), `notes`, `grid`, `snotes` (carnet), `hints`, `replay`, `attempts`, `status`, `draft` (accusation en cours).

## Publier une version

1. Mettre à jour `APP_VERSION` (`js/app.js`) et `VERSION` (`sw.js`).
2. Lancer `node auteur/verifier.mjs`.
3. Verser sur `main`. Sur l'appareil : Réglages → Mettre à jour.
