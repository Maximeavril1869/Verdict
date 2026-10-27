# Verdict

Jeu d'enquête solo, à travers les âges. Une affaire, un carnet vierge, une seule accusation.

Application web installable (PWA), pensée pour iPad Pro 11" (paysage et portrait) et utilisable sur iPhone.

## Principe

- Les affaires sont écrites à la main et regroupées en **saisons** par époque. La saison 1 (Antiquité) contient pour l'instant une affaire : *Le scellé de Ptah*, à Memphis.
- Tu fouilles les lieux, tu interroges, tu confrontes les témoins à tes preuves. Le **carnet** est vide : c'est toi qui le remplis.
- L'accusation est exigeante : coupable, mobile, méthode et trois preuves. Accuser un innocent détruit sa vie.
- Trois indices optionnels. Rejeu possible sans indice.
- Le bouton « Signaler une incohérence » prépare un rapport à me transmettre.

## Installer sur iPad / iPhone

1. Ouvre l'adresse du jeu dans Safari.
2. Touche Partager, puis « Sur l'écran d'accueil ».
3. Lance Verdict depuis l'icône : il fonctionne ensuite hors connexion. En cas de souci de version : Menu ⋯ → Réglages → Mettre à jour.

## Héberger

Fichiers statiques, aucun build. Sur GitHub : Settings → Pages → Branch `main`, dossier `/ (root)`.

En local : `python3 -m http.server` puis ouvrir `http://localhost:8000`.

## Structure

- `index.html`, `css/`, `js/` : l'application et le moteur
- `saisons/` : catalogue et affaires compilées
- `auteur/` : outils de l'auteur. **Ne pas ouvrir si tu veux jouer.**
