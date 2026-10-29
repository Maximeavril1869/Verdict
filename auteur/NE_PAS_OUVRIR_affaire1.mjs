// ─────────────────────────────────────────────────────────────────────────────
//  ⚠  SPOILER : ce fichier contient la solution complète de l'affaire.
//     Il sert uniquement à l'auteur (vérification, compilation).
//     Le jeu, lui, ne contient que des empreintes (hachages) de la solution.
// ─────────────────────────────────────────────────────────────────────────────
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const A = require('../js/art.js');
const C = A.C;

/* ═══════════════════════════ DÉCORS ═══════════════════════════ */

function sceneArchives() {
  let s = A.room();
  s += A.pigeonholes(30, 70, 190, 300);
  s += A.hot('fenetre', A.slit(430, 74, 100, 52), [410, 58, 140, 90]);
  s += A.hot('scelle', A.door(770, 130, 120, 270, { seal: true }) +
    A.E(745, 452, 14, 9, C.clay, '') + A.E(775, 462, 11, 7, C.clay, '') + A.L(700, 470, 740, 452, C.sand, 4), [735, 100, 190, 380]);
  s += A.hot('visiteurs', A.tablet(655, 170, 78, 98, 4), [645, 160, 98, 118]);
  // bureau
  s += A.table(250, 330, 300, 82);
  s += A.hot('registre', A.R(268, 306, 62, 24, C.pap, '') + A.R(332, 306, 62, 24, '#efe2ad', '') + A.L(331, 306, 331, 330, C.ink, 2) +
    A.L(276, 313, 322, 313, C.ink, 1.5) + A.L(276, 319, 322, 319, C.ink, 1.5) + A.L(340, 313, 386, 313, C.ink, 1.5) + A.L(340, 319, 378, 319, C.ink, 1.5) +
    A.R(344, 321, 30, 5, C.sand, 'stroke="none"'), [258, 290, 146, 48]);
  s += A.hot('ostracon', A.Pth('M474 330 L486 310 L512 316 L508 332 Z', '#e9dcc0', 'class="o"') + A.L(482, 320, 504, 322, C.ink, 1.3), [462, 296, 64, 40]);
  s += A.hot('registre_lumiere', A.lamp(432, 326), [408, 280, 56, 56]);
  // plateau de repas
  s += A.table(80, 430, 140, 44);
  s += A.hot('plateau', A.bread(112, 428) + A.cup(150, 426) + A.jar(190, 410, 0.72, 'palette'), [84, 360, 144, 116]);
  s += A.hot('bouchon', A.E(262, 520, 22, 11, C.clay, '') + A.Pth('M252 518 q10 -6 20 0', 'none', 'stroke="' + C.ink + '" stroke-width="2"') + A.Pth('M258 524 q6 -4 12 0', 'none', 'stroke="' + C.ink + '" stroke-width="2"'), [232, 494, 62, 54]);
  // corps
  s += A.mat(310, 458, 330, 110, C.sand);
  s += A.hot('corps', A.body(372, 506), [300, 448, 350, 130]);
  s += A.hot('rapport_medecin', A.scroll(690, 520, 70, 22, C.pap), [676, 504, 98, 52]);
  return A.wrapScene(s);
}

function sceneBrasserie() {
  let s = A.room({ wall: '#bd9360' });
  s += A.hot('porte_arriere', A.door(58, 150, 112, 250) + A.R(38, 262, 152, 16, C.brick3, ''), [28, 120, 182, 300]);
  s += A.shelf(250, 90, 330, 3, 4, true);
  s += A.hot('petale_lotus', A.petal(320, 530, 1.2) + A.petal(344, 540, 0.9) + A.petal(300, 548, 0.8), [286, 506, 90, 62]);
  s += A.hot('jarres_libation', A.jar(660, 478, 1, 'pure') + A.jar(712, 488, 1, 'pure') + A.jar(764, 478, 1, 'pure'), [626, 418, 176, 128]);
  s += A.door(842, 150, 100, 250, { open: true });
  s += A.hot('crochet_sceau', A.hook(646, 170) + A.stamp(650, 196) + A.claypot(650, 290), [620, 150, 80, 184]);
  s += A.hot('crochet_mesure', A.hook(756, 170) + A.T(766, 232, 'mesure', 13), [728, 150, 90, 100]);
  s += A.hot('tablette_brasserie', A.stool(480, 440) + A.tablet(486, 396, 46, 44, 3), [470, 384, 80, 96]);
  return A.wrapScene(s);
}

function sceneScribes() {
  let s = A.room({ wall: '#c4985c' });
  // salle de classe (gauche)
  s += A.hot('ecole', A.tablet(60, 128, 92, 108, 5), [50, 118, 112, 128]);
  s += A.hot('promotion', A.scroll(220, 128, 82, 100, C.pap), [208, 118, 108, 122]);
  const xs = [70, 150, 230, 310];
  xs.forEach((x, i) => { s += A.mat(x - 26, 400, 66, 56, C.sand) + A.pupil(x + 6, 420, i % 2 ? C.linen : '#e8dcb6'); });
  xs.forEach((x, i) => { s += A.mat(x - 26, 490, 66, 56, C.sand) + A.pupil(x + 6, 510, i % 2 ? '#e8dcb6' : C.linen); });
  // cloison
  s += A.R(468, 70, 14, 340, C.brick3, '');
  // cellule de Mérou (droite)
  s += A.hot('caricature', A.Pth('M588 180 L606 150 L640 160 L634 196 Z', '#e9dcc0', 'class="o"') + A.E(612, 176, 8, 8, C.ink, 'stroke="none"') + A.L(604, 190, 628, 186, C.ink, 2), [572, 136, 90, 76]);
  s += A.table(540, 330, 150, 80);
  s += A.hot('lettre_pere', A.R(572, 312, 38, 22, '#f3e9c8', '') + A.L(578, 320, 604, 320, C.ink, 1.3) + A.L(578, 326, 598, 326, C.ink, 1.3), [560, 298, 62, 44]);
  s += A.mat(740, 440, 190, 100, C.pap);
  s += A.hot('copie_hymne', A.scroll(770, 546, 130, 24, '#f0e3b0') + A.R(750, 538, 170, 6, C.sand2, 'stroke="none"'), [748, 520, 178, 66]);
  return A.wrapScene(s);
}

function scenePorte() {
  let s = A.outdoor({ ground: C.sand2 });
  s += A.R(0, 250, 960, 84, '#cfae78', '');
  s += A.pylon(80, 120, 170, 214) + A.pylon(520, 120, 170, 214);
  s += A.R(250, 190, 270, 144, C.clay2, '') + A.R(262, 200, 120, 130, C.clay, '') + A.R(388, 200, 120, 130, C.clay, '');
  for (let i = 1; i < 5; i++) s += A.L(262 + i * 24, 204, 262 + i * 24, 326, C.ink, 1.3).replace('stroke-linecap', 'opacity=".4" stroke-linecap');
  s += A.R(246, 330, 280, 14, C.brick3, '');
  s += A.hot('registre_porte', A.R(104, 380, 10, 80, C.brick3, '') + A.tablet(70, 340, 80, 66, 4), [60, 330, 100, 140]);
  s += A.hot('clepsydre', A.Pth('M330 400 L378 400 L370 470 L338 470 Z', C.clay, 'class="o"') + A.R(342, 470, 24, 14, C.sand2, '') + A.L(344, 416, 364, 416, C.ink, 1.4) + A.L(344, 430, 364, 430, C.ink, 1.4) + A.L(344, 444, 364, 444, C.ink, 1.4), [316, 384, 78, 110]);
  s += A.hut(660, 330, 230, 140);
  s += A.hot('poste_senou', A.mat(700, 490, 120, 36, C.sand) + A.jar(850, 520, 0.8, 'none') + A.R(830, 540, 40, 6, C.sand3, 'stroke="none"'), [684, 470, 210, 90]);
  return A.wrapScene(s);
}

function sceneJardin() {
  let s = A.outdoor({ night: false, ground: '#d9c58f' });
  s += A.palm(120, 330, 190) + A.palm(220, 330, 150) + A.palm(860, 330, 180);
  s += A.pool(340, 380, 260, 150);
  s += A.hot('traces_amants', A.mat(282, 420, 54, 90, '#e8dcb6') + A.sandals(300, 440) + A.sandals(302, 470) + A.ribbon(352, 520), [270, 410, 120, 130]);
  s += A.hot('purification', A.building(60, 214, 150, 120, C.lapis) + A.tablet(86, 340, 70, 60, 3), [50, 190, 180, 220]);
  s += A.hot('couronnes', A.building(700, 210, 170, 124, C.turq) + A.garland(716, 262, 140), [690, 190, 200, 160]);
  return A.wrapScene(s);
}

/* ═══════════════════════════ PORTRAITS ═══════════════════════════ */
const P = {
  hori:    A.portrait({ coiffure: 'chauve', skin: C.skin3, robe: C.linen, bg: '#bcd7e6', collier: C.turq }),
  merou:   A.portrait({ coiffure: 'courte', skin: C.skin2, robe: '#ece2c4', bg: '#d8c28e', rides: true, sourire: false }),
  neferet: A.portrait({ coiffure: 'perruque', skin: C.skin3, robe: '#f5efe0', bg: '#e3c5c0', collier: C.gold, bandeau: C.turq, boucles: true, cone: true }),
  khay:    A.portrait({ coiffure: 'courte', skin: C.skin, robe: '#e9d9a8', bg: '#cfd9b0', collier: C.red }),
  abi:     A.portrait({ coiffure: 'casque', skin: C.skin2, robe: '#9a3b3b', bg: '#e1c07a', barbe: true, bandeau: C.lapis, cheveux: '#2a1c12' }),
  senou:   A.portrait({ coiffure: 'blanche', skin: C.skin2, robe: '#cdbf99', bg: '#c3c3b6', barbe: false, rides: true, sourire: false }),
  pentaour:A.portrait({ coiffure: 'perruque', skin: C.skin, robe: C.linen, bg: '#cdd6c4', collier: C.gold }),
  pa:      A.portrait({ coiffure: 'enfant', skin: C.skin3, robe: '#efe5c0', bg: '#f0d8a8' }),
  dedi:    A.portrait({ coiffure: 'chauve', skin: C.skin2, robe: '#d9cba2', bg: '#b9cfa6', rides: true }),
  ipy:     A.portrait({ coiffure: 'courte', skin: C.skin, robe: C.linen, bg: '#d9d0bb', rides: true, sourire: false })
};

/* ═══════════════════════════ CONTENU ═══════════════════════════ */
const affaire = {
  id: 's1a1',
  version: 1,
  titre: 'Le scellé de Ptah',
  lieu: 'Memphis',
  epoque: 'Vers 1254 av. J.-C. · An 26 de Ramsès II',
  saison: 'Saison 1 · L’Antiquité',

  intro: {
    titre: 'Memphis, jour 20 du deuxième mois de Peret',
    paragraphes: [
      `Memphis, an 26 du règne de Ramsès. Deuxième mois de la saison Peret, vingtième jour : jour de repos de la décade.`,
      `À l’aube, le gardien Senou a brisé le scellé de la salle des archives du temple de Ptah, sous les yeux de Pentaour, adjoint de l’intendant. Ipy, scribe en chef des archives, gisait sur sa natte. Mort.`,
      `Le scellé du chacal était intact. La seule fenêtre est une fente où ne passerait pas un enfant. Et pourtant, quelqu’un a tué Ipy.`,
      `L’intendant Ramosé est à Thèbes jusqu’au vingt-deuxième jour. Le vizir t’a envoyé établir la vérité avant son retour. Six personnes sont suspectes. Tu devras en accuser une, dire comment elle a agi, pourquoi, et le prouver. Si tu te trompes, un innocent paiera.`
    ]
  },

  portraits: P,

  suspects: [
    { id: 'hori', nom: 'Hori', titre: 'Prêtre-ouab de la troisième phyle', age: 31,
      bio: `Purificateur du temple, de service ce mois-ci. Calme, scrupuleux, un peu froid. Il connaissait Ipy depuis dix ans.` },
    { id: 'merou', nom: 'Mérou', titre: 'Scribe des archives', age: 34,
      bio: `Second d’Ipy depuis cinq ans. Brillant, rancunier. La promotion qu’il attendait est allée à un autre.` },
    { id: 'neferet', nom: 'Néferet', titre: 'Prêtresse-chanteuse de Ptah', age: 36,
      bio: `La voix la plus pure du chœur. Elle chante l’hymne du soir et verse la libation. Très appréciée, très entourée.` },
    { id: 'khay', nom: 'Khay', titre: 'Intendant des greniers', age: 47,
      bio: `Gros, jovial, toujours en sueur. Il se querellait depuis des mois avec Ipy à propos des mesures de grain.` },
    { id: 'abi', nom: 'Abi', titre: 'Négociant de Canaan', age: 41,
      bio: `Vend de l’encens et des résines au temple. Parle bien l’égyptien, avec un accent. Loge en ville, à la maison des étrangers.` },
    { id: 'senou', nom: 'Senou', titre: 'Gardien de nuit', age: 58,
      bio: `Ancien soldat de Ramsès. Fidèle, bourru. Il garde la porte du temple depuis vingt ans.` }
  ],
  temoins: [
    { id: 'pentaour', nom: 'Pentaour', titre: 'Adjoint de l’intendant', bio: `Il a assisté à l’ouverture de la salle des archives.` },
    { id: 'pa', nom: 'Pa', titre: 'Aide-brasseur', bio: `Douze ans. Garde la clé de la réserve à bière du temple.` },
    { id: 'dedi', nom: 'Dedi', titre: 'Jardinier de nuit', bio: `Arrose le jardin du lac à la fraîche, quand le temple dort.` }
  ],

  savoirs: [
    { id: 'heures', titre: 'Les heures', texte:
      `Le jour et la nuit comptent chacun douze heures. La 12e heure du jour s’achève au coucher du soleil. La nuit commence à la 1re heure de la nuit : on ferme alors la porte du temple, et le gardien n’y laisse plus passer personne.` },
    { id: 'decade', titre: 'La décade et le repos', texte:
      `Le mois compte trois décades de dix jours. Le dernier jour de chaque décade (10, 20, 30) est un jour de repos : les archives sont fermées, et les rapports adressés à l’intendant ne partent que le lendemain.` },
    { id: 'scelles', titre: 'Les scellés', texte:
      `On ferme une porte avec une corde nouée, cachetée d’argile et frappée d’un sceau. Un scellé intact prouve que la porte n’a pas été ouverte depuis sa pose. Il ne dit rien de ce qui se trouvait déjà à l’intérieur.` },
    { id: 'argile', titre: 'L’argile', texte:
      `À cette saison, l’argile du Nil durcit en deux heures environ : une argile encore molle a donc été travaillée depuis moins de deux heures. Quand on rescelle un bouchon avec le même sceau, la seconde empreinte vient souvent se poser, légèrement décalée, sur la première.` },
    { id: 'mandragore', titre: 'La mandragore', texte:
      `Son fruit se tresse dans les guirlandes de fête ; sa racine, broyée, soigne ou tue. À forte dose : pupilles dilatées, bouche brûlante et sèche, agitation, puis sommeil profond et mort. Le poison agit une à trois heures après avoir été avalé : l’empoisonneur n’est pas forcément là au moment de la mort.` },
    { id: 'brasserie', titre: 'La brasserie et sa réserve', texte:
      `Chaque jarre porte la marque de son destinataire et est scellée avec l’épi d’orge, sceau de la brasserie, qui reste dans la réserve. La réserve se ferme à clé, et l’aide-brasseur garde la clé. La mesure de libation, vase gradué sacré, n’est pas rangée à la réserve : on la prend à la salle du culte à chaque libation.` },
    { id: 'dotations', titre: 'Les dotations funéraires', texte:
      `Un défunt de rang peut recevoir une dotation : des champs dont le revenu paie son culte. Ce revenu revient à la personne chargée du culte, souvent la veuve. Gonfler une dotation dans les registres, c’est voler la maison du dieu : bastonnade, exil, remboursement.` },
    { id: 'tribunal', titre: 'Devant le vizir', texte:
      `Pour accuser, il faut désigner le coupable, dire pourquoi il a agi et comment, et apporter trois preuves : celle de l’occasion (qui a pu agir, seul), celle du moyen (comment la chose a été faite), celle du mobile (pourquoi). Un accusé que l’on ne parvient pas à convaincre le tribunal de condamner est relâché.` }
  ],

  lieux: [
    { id: 'archives', nom: 'Archives', g: 'Dans le temple' },
    { id: 'culte', nom: 'Salle du culte', g: 'Dans le temple' },
    { id: 'vie', nom: 'Maison de Vie', g: 'Dans le temple' },
    { id: 'greniers', nom: 'Greniers', g: 'Dans le temple' },
    { id: 'reserve', nom: 'Réserve à bière', g: 'Dans le temple' },
    { id: 'scribes', nom: 'Maison des scribes', g: 'Dans le temple' },
    { id: 'cuisines', nom: 'Cuisines et four', g: 'Dans le temple' },
    { id: 'cour', nom: 'Cour', g: 'Dans le temple' },
    { id: 'porte', nom: 'Porte du temple', g: 'Dans le temple' },
    { id: 'bassin', nom: 'Bassin du lac', g: 'Jardin du lac' },
    { id: 'purification', nom: 'Maison de purification', g: 'Jardin du lac' },
    { id: 'chanteuses', nom: 'Salle des chanteuses', g: 'Jardin du lac' },
    { id: 'ville', nom: 'En ville', g: 'Hors du temple' },
    { id: 'inconnu', nom: 'Je ne sais pas', g: '' }
  ],
  plan: planTemple(),
  scenes: [
    { id: 'archives', titre: 'Les archives', lieu: 'Salle des archives du temple de Ptah',
      description: `La salle où Ipy est mort. Rien n’a été déplacé depuis l’aube.`, svg: sceneArchives() },
    { id: 'brasserie', titre: 'La réserve à bière', lieu: 'Réserve de la brasserie du temple',
      description: `La réserve où dorment les jarres de bière. Le petit Pa en garde la clé.`, svg: sceneBrasserie() },
    { id: 'scribes', titre: 'Maison des scribes', lieu: 'Classe et cellules des scribes',
      description: `Là où Mérou enseigne et dort, un mur de séparation entre l’école et sa cellule.`, svg: sceneScribes() },
    { id: 'porte', titre: 'La porte du temple', lieu: 'Grande porte et poste de garde',
      description: `Senou y tient son registre. Rien n’entre ni ne sort sans passer par là.`, svg: scenePorte() },
    { id: 'jardin', titre: 'Le jardin du lac', lieu: 'Bassin, maison de purification, salle des chanteuses',
      description: `Le jardin intérieur : le lac sacré, la maison où les prêtres se purifient, la salle des chanteuses.`, svg: sceneJardin() }
  ],

  /* ── Indices ── (scene: id de scène ; sinon source: 'personne') */
  indices: [
    // Archives
    { id: 'corps', scene: 'archives', titre: 'Le corps d’Ipy',
      texte: `Ipy est étendu face contre terre sur sa natte. Aucune blessure, aucune marque au cou. Une flaque de vomi près de sa bouche. Ses lèvres sont sèches et fendillées, ses pupilles démesurément dilatées.` },
    { id: 'rapport_medecin', scene: 'archives', requires: ['corps'], titre: 'Le rapport du médecin Nebamon',
      texte: `Nebamon a noté : « Pupilles dilatées, bouche brûlante et sèche, peau rouge, agitation puis sommeil profond. Ce sont les signes de la mandragore prise en grande quantité. Le pain : rien d’anormal. Au fond de la jarre de bière : odeur âcre de mandragore. »` },
    { id: 'scelle', scene: 'archives', titre: 'Le scellé de la porte',
      texte: `Les morceaux du scellé gisent devant la porte : l’empreinte du chacal, nette, complète, sans grattage ni double pose. La corde était nouée et cachetée, jamais coupée. Senou l’a brisée à l’aube devant Pentaour.` },
    { id: 'fenetre', scene: 'archives', titre: 'La fenêtre à claustra',
      texte: `Une fente haute, large d’une main, fermée d’un treillis de pierre. Aucun enfant n’y passerait. La poussière du rebord est intacte.` },
    { id: 'plateau', scene: 'archives', titre: 'Le plateau de repas',
      texte: `Un pain à moitié mangé, une coupe d’argile cuite, une jarre de bière marquée du signe de la palette, celle du scribe en chef. La jarre est presque vide. Son bouchon, brisé à l’ouverture, gît à côté.` },
    { id: 'bouchon', scene: 'archives', requires: ['plateau'], titre: 'Le bouchon brisé',
      texte: `L’argile garde l’empreinte de l’épi d’orge, le sceau de la brasserie. Mais l’épi est imprimé deux fois, légèrement décalé, comme si le sceau avait été posé une seconde fois sur l’argile.` },
    { id: 'ostracon', scene: 'archives', titre: 'Un brouillon sur éclat de calcaire',
      texte: `Ipy y a griffonné en hâte : « Parcelle du Canal, trois aroures, attribuées à tort au culte de Ptahmose. Cadastre royal : terre de la maison de Ptah. Usufruit versé depuis six ans à la veuve… » Le reste de l’éclat est brisé.` },
    { id: 'registre', scene: 'archives', titre: 'Le registre des dotations',
      texte: `Ouvert sur le bureau. Une ligne a été grattée à la pierre ponce puis réécrite d’une encre encore fraîche, de la main d’Ipy : « Dotation du ka de Ptahmose, scribe : une aroure, parcelle de l’Étang. »` },
    { id: 'registre_lumiere', scene: 'archives', requires: ['registre'], titre: 'Sous le grattage',
      texte: `En approchant la lampe de biais, on devine le texte effacé : « …trois aroures, parcelle du Canal ; usufruit à l’épouse du défunt, chargée de son culte. » Cette ligne est ancienne : l’encre brunie date de plusieurs années.` },
    { id: 'visiteurs', scene: 'archives', titre: 'La tablette des visiteurs',
      texte: `Ipy y notait qui entrait. Jour 19 : Khay à la 6e heure (mesures de grain) ; Hori à la 8e heure (calendrier des offrandes) ; Mérou à la 9e heure, qui a lu un rouleau médical sur les maux d’entrailles. Personne d’autre.` },

    // Brasserie
    { id: 'tablette_brasserie', scene: 'brasserie', titre: 'La tablette du jeune brasseur',
      texte: `Pa y marque ses visites, d’une main d’enfant : « 9e h : le prêtre Hori, jarres de libation. 10e h : Khay, rations de bière. Fin de la 10e h : tout vérifié, bouchons secs, une seule marque ; fermé à clé. 11e h : la chanteuse Néferet, bière de libation. 1re h de la nuit : Senou, jarre du scribe en chef. »` },
    { id: 'crochet_sceau', scene: 'brasserie', titre: 'Le sceau de la brasserie',
      texte: `Le sceau à l’épi d’orge pend à un crochet près de la porte, à portée de main de quiconque se trouve dans la réserve. À côté, un pot d’argile fraîche pour réparer les bouchons.` },
    { id: 'crochet_mesure', scene: 'brasserie', titre: 'Le crochet vide',
      texte: `Un crochet marqué « mesure de libation ». Il est vide : sous lui, un cercle de poussière nette, là où le vase est resté posé un temps.` },
    { id: 'porte_arriere', scene: 'brasserie', titre: 'La porte de service',
      texte: `Barrée de l’intérieur par une poutre. La poussière tout autour est intacte. Personne n’est entré par là.` },
    { id: 'jarres_libation', scene: 'brasserie', titre: 'Les jarres de libation',
      texte: `Quatre jarres au signe pur des prêtres-ouab, alignées près de l’entrée. Leurs bouchons sont secs et fendillés : le prêtre les a purifiées à la 9e heure.` },
    { id: 'petale_lotus', scene: 'brasserie', titre: 'Un pétale de lotus bleu',
      texte: `Tombé sous l’étagère des jarres de service, là où dormait la jarre du scribe en chef.` },

    // Maison des scribes
    { id: 'ecole', scene: 'scribes', titre: 'La tablette de l’école',
      texte: `Présence des huit élèves. De la 11e heure du jour à la 1re heure de la nuit, Mérou a enseigné l’écriture : leçon notée « sans interruption », huit marques d’élèves en regard.` },
    { id: 'promotion', scene: 'scribes', titre: 'La liste des promotions',
      texte: `Le titre de scribe royal des archives est donné à un autre. En marge, de la main d’Ipy : « Mérou : talent, mais pas de sérieux. »` },
    { id: 'caricature', scene: 'scribes', titre: 'Un ostracon moqueur',
      texte: `Un ibis à tête d’âne, assis sur un tas de rouleaux. Légende : « Ipy, roi des papyrus. » Dessiné d’une main que l’on reconnaît : celle de Mérou.` },
    { id: 'lettre_pere', scene: 'scribes', titre: 'Une lettre de sa sœur',
      texte: `« Notre père ne dort plus, ses entrailles le brûlent. Cherche un remède dans les rouleaux du temple, si tu le peux. »` },
    { id: 'copie_hymne', scene: 'scribes', titre: 'Une copie interdite',
      texte: `Sous la natte de Mérou : l’Hymne à Ptah recopié sur papyrus neuf, avec une tablette de commande : « Pour Abi : dix copies, payées en cuivre. » Les hymnes du temple ne se copient pas sans permission.` },

    // Porte
    { id: 'registre_porte', scene: 'porte', titre: 'Le registre de la porte',
      texte: `Senou y note ce qu’il voit. Jour 19 : Khay entre à la 5e heure ; Abi sort à la 11e heure ; fermeture de la porte à la 1re heure de la nuit. À la 12e heure, la chanteuse Néferet n’est pas notée à la sortie.` },
    { id: 'clepsydre', scene: 'porte', titre: 'La clepsydre de la porte',
      texte: `Elle règle les heures de la garde. Senou la remplit au coucher du soleil et la lit à voix haute à chaque heure.` },
    { id: 'poste_senou', scene: 'porte', titre: 'Le poste de garde',
      texte: `Une natte encore tiède, un pot de bière de dattes aux trois quarts vide, une couverture roulée en oreiller. Quelqu’un a bu, puis s’est étendu.` },

    // Jardin
    { id: 'traces_amants', scene: 'jardin', titre: 'Deux paires de sandales',
      texte: `Près du bassin : les empreintes d’une paire de sandales d’homme et d’une paire de sandales de femme, une natte froissée, un ruban de lin bleu noué d’une amulette de Hathor.` },
    { id: 'purification', scene: 'jardin', titre: 'La maison de purification',
      texte: `Tablette des prêtres de service : « Hori et trois autres : bain au lac de la 10e à la 12e heure, rasage, rinçage de la bouche au natron. Puis rite du soir jusqu’à la nuit. » Aucun prêtre n’a quitté le groupe.` },
    { id: 'couronnes', scene: 'jardin', titre: 'Les guirlandes de libation',
      texte: `Suspendues dans la salle des chanteuses : lotus bleu, feuilles de saule et fruits jaunes de mandragore séchés. Toutes les chanteuses en tressent pour les libations.` },

    // Témoignages
    { id: 'pharmacie', source: 'pentaour', titre: 'Registre de la pharmacie',
      texte: `La mandragore a été sortie de la pharmacie de la Maison de Vie il y a deux jours par le prêtre Hori, pour le vieux Ankh, qui souffre du dos.` },
    { id: 'pa_seule', source: 'pa', titre: 'Pa a quitté la réserve',
      texte: `Pa avoue avoir quitté la réserve pour aller chercher la mesure de libation à la salle du culte, en tirant la porte derrière lui. Néferet, venue à la 11e heure, est restée seule avec les jarres quelques instants, et personne d\u2019autre n\u2019a pu entrer.` },
    { id: 'bouchon_mou', source: 'pa', titre: 'Un bouchon encore mou',
      texte: `À la 1re heure de la nuit, le bouchon de la jarre d’Ipy était encore mou sous le pouce de Senou. Pa n’a pas quitté Senou des yeux, et jure n’avoir pas touché à la jarre depuis sa vérification.` },
    { id: 'bouchon_durci', source: 'senou', titre: 'Un bouchon devenu dur',
      texte: `Quand Senou a pris la jarre à la 1re heure de la nuit, l\u2019argile du bouchon collait. Quand il l\u2019a remise à Ipy, une heure plus tard, elle avait durci.` },
    { id: 'senou_livraison', source: 'senou', titre: 'La livraison de Senou',
      texte: `Senou a porté la jarre et le pain à Ipy à la 2e heure de la nuit. Ipy lui a demandé de le sceller : il ne voulait voir personne avant l’aube. Senou a scellé du chacal.` },
    { id: 'senou_endormi', source: 'senou', titre: 'Senou s’est assoupi',
      texte: `Senou reconnaît avoir dormi un moment après la 3e heure, à son poste. Il maintient que la porte des archives n’a pas été ouverte : le scellé le prouve.` },
    { id: 'dedi_amants', source: 'dedi', titre: 'Les amants du bassin',
      texte: `Le jardinier a vu Hori et Néferet ensemble près du bassin, de la 4e à la 6e heure de la nuit. Il n’en a parlé à personne, surtout pas à Ipy.` },
    { id: 'hori_liaison', source: 'hori', titre: 'L’aveu de Hori',
      texte: `Hori avoue sa liaison avec Néferet : ils étaient ensemble au bassin de la 4e à la 6e heure. Selon lui, Ipy n’en savait rien.` },
    { id: 'neferet_liaison', source: 'neferet', titre: 'L’aveu de Néferet',
      texte: `Néferet confirme : Hori et elle étaient ensemble de la 4e à la 6e heure. Elle n’avait pas quitté le temple. Ipy ignorait tout.` },
    { id: 'neferet_veuve', source: 'neferet', titre: 'Néferet, veuve de Ptahmose',
      texte: `Néferet est la veuve du scribe Ptahmose. Depuis six ans, elle préside son culte funéraire et en perçoit le revenu.` },
    { id: 'khay_fraude', source: 'khay', titre: 'Les rations de Khay',
      texte: `Khay réclame depuis longtemps plus de bière pour ses ouvriers qu’ils n’en boivent. Ipy allait le découvrir en vérifiant ses mesures après le repos.` },
    { id: 'merou_aveu', source: 'merou', titre: 'Les secrets de Mérou',
      texte: `Mérou copie l’Hymne à Ptah pour Abi, contre du cuivre. Et il a lu le rouleau des remèdes pour soulager son père malade. Ipy ne l’a jamais su.` },
    { id: 'abi_aveu', source: 'abi', titre: 'Le commerce d’Abi',
      texte: `Abi achète à Mérou des copies de l’Hymne à Ptah pour les revendre à Canaan. Il vend du pavot aux médecins de la ville, mais jure ne jamais toucher à la mandragore.` }
  ],

  /* ── Interrogatoires ── */
  gens: {
    pentaour: {
      sujets: [
        { id: 'scelle', q: 'Racontez-moi l’ouverture de la salle.',
          a: `À l’aube, Senou a frappé ; pas de réponse. J’ai regardé le scellé du chacal : intact, l’empreinte nette, la corde non coupée. Nous l’avons brisé ensemble. Ipy gisait sur sa natte, déjà froid. Je le jure devant Maât : personne n’a ouvert cette porte pendant la nuit.` },
        { id: 'ennemis', q: 'Qui pouvait en vouloir à Ipy ?',
          a: `Khay s’est querellé avec lui hier devant les ouvriers, à propos des mesures de grain. Mérou a lancé qu’Ipy ne profiterait pas longtemps de son titre : des paroles de colère, mais on les a entendues. Quant au marchand Abi, certains murmurent qu’il vend des drogues. Moi, je ne sais rien de plus, Seigneur.` },
        { id: 'poison', q: 'Où trouve-t-on de la mandragore au temple ?', requires: ['rapport_medecin'], grants: ['pharmacie'],
          a: `À la pharmacie de la Maison de Vie. Le registre montre une sortie il y a deux jours : le prêtre Hori en a pris pour le vieux Ankh, qui souffre du dos. Ailleurs, je ne sais pas.` }
      ],
      confrontations: []
    },
    pa: {
      sujets: [
        { id: 'travail', q: 'Parle-moi de ton travail.',
          a: `Je garde la réserve du maître-brasseur, Seigneur. Les jarres sont scellées avec l’épi d’orge, la marque de la brasserie. La clé ne quitte jamais mon cou. Personne n’entre sans moi.` },
        { id: 'visites', q: 'Qui est venu à la réserve hier ?',
          a: `Le prêtre Hori à la 9e heure, pour purifier les jarres de libation. Khay à la 10e, pour parler des rations de bière de ses ouvriers. Abi est passé devant avec son encens, sans entrer. À la fin de la 10e heure, j’ai tout vérifié : bouchons secs, une seule marque chacun. Puis j’ai fermé. Ensuite la chanteuse Néferet, à la 11e heure, pour la bière de libation. Et Senou, à la 1re heure de la nuit, pour la jarre du scribe en chef.` },
        { id: 'seul', q: 'Quelqu’un est-il resté seul dans la réserve ?',
          a: `Jamais, Seigneur ! Je ne laisse personne seul avec les jarres. C’est la règle.` },
        { id: 'senou', q: 'Et Senou, hier soir ?', requires: ['pa.visites'], grants: ['bouchon_mou'],
          a: `Il est venu à la 1re heure de la nuit avec son panier de pain. Je ne l’ai pas quitté des yeux : il a pris la jarre du scribe en chef et il est reparti. Il a posé le pouce sur le bouchon et il a grogné que ça collait : l’argile était encore molle. Moi, je n’y avais pas touché depuis ma vérification.` }
      ],
      confrontations: [
        { pieces: ['crochet_mesure'], sujet: 'seul', grants: ['pa_seule'],
          a: `(Il baisse les yeux.) La mesure de libation n’est pas à la réserve, Seigneur : elle est à la salle du culte. J’ai dû courir la chercher. La chanteuse a dit qu’elle m’attendrait, qu’elle avait l’habitude. Je suis resté absent le temps de dix respirations, peut-être plus. Ne me punissez pas.` },
        { pieces: ['petale_lotus', 'bouchon', 'tablette_brasserie', 'crochet_sceau'],
          a: `Je n’ai rien vu d’anormal, Seigneur. Rien du tout.` }
      ]
    },
    dedi: {
      sujets: [
        { id: 'vu', q: 'Qu’avez-vous vu cette nuit ?', grants: ['dedi_amants'],
          a: `J’arrosais le jardin du lac. Entre la 4e et la 6e heure, deux silhouettes près du bassin : un prêtre au crâne rasé et une femme parfumée au lotus. Je les connais, Seigneur : le purificateur Hori et la chanteuse Néferet. Je n’ai rien dit. Ce ne sont pas mes affaires.` },
        { id: 'archives', q: 'Avez-vous vu quelqu’un près des archives ?',
          a: `Non, Seigneur. De mon coin, je vois la ruelle des scribes. Personne n’y est passé de toute la nuit.` },
        { id: 'parle', q: 'En avez-vous parlé à Ipy ?', requires: ['dedi.vu'],
          a: `À Ipy ? Jamais. Je ne lui ai jamais adressé la parole de ma vie.` }
      ],
      confrontations: []
    },
    senou: {
      sujets: [
        { id: 'nuit', q: 'Racontez-moi votre nuit.',
          a: `J’ai veillé à mon poste toute la nuit, sans fermer l’œil. Aucune ombre n’a passé.` },
        { id: 'livraison', q: 'La jarre et le repas d’Ipy ?', grants: ['senou_livraison'],
          a: `À la 1re heure de la nuit, j’ai fermé la porte du temple, puis je suis allé chercher la jarre du scribe en chef à la réserve à bière, et le pain au four. À la 2e heure, je les ai portés à Ipy. Il m’a dit : « Scelle-moi, je ne veux voir personne avant l’aube. » J’ai scellé du chacal, comme un bon soldat.` },
        { id: 'ennemis', q: 'Ipy avait-il des ennemis ?',
          a: `Des jaloux, Seigneur. Le scribe Mérou rageait de ne pas être promu. Et Khay jurait dans la cour hier.` },
        { id: 'bouchon', q: 'Et le bouchon de la jarre ?', requires: ['bouchon'], grants: ['bouchon_durci'],
          a: `Le bouchon ? Collant, oui. L’argile n’avait pas pris. J’ai cru que le gamin l’avait réparé. Au moment de la remettre à Ipy, elle avait durci.` },
        { id: 'neferet', q: 'Néferet est-elle sortie avant la fermeture ?', requires: ['registre_porte'],
          a: `Non. Elle a chanté l’hymne du soir et je ne l’ai pas vue passer la porte. J’étais bien éveillé à ce moment-là, je l’aurais notée.` }
      ],
      confrontations: [
        { pieces: ['poste_senou'], grants: ['senou_endormi'],
          a: `(Il grogne.) Bon. Une cruche de bière de dattes, la fatigue… Je me suis assoupi un moment, après la 3e heure. Mais la porte des archives est restée scellée, Seigneur ! Le scellé est la preuve.` }
      ]
    },
    hori: {
      sujets: [
        { id: 'qui', q: 'Qui êtes-vous ?',
          a: `Hori, prêtre-ouab de la troisième phyle. Je purifie les offrandes et le temple. Ce mois-ci, mon tour de service est venu.` },
        { id: 'nuit', q: 'Où étiez-vous cette nuit ?',
          a: `En prière dans la salle du culte, jusqu’à l’aube.` },
        { id: 'soir', q: 'Et en fin d’après-midi ?',
          a: `Au lac de purification, de la 10e à la 12e heure, avec trois autres prêtres : on se baigne, on se rase, on se rince la bouche au natron avant le rite du soir. Puis le rite, jusqu’à la nuit. Demandez-leur.` },
        { id: 'brasserie', q: 'Pourquoi êtes-vous allé à la réserve ?',
          a: `Pour purifier les jarres de libation, à la 9e heure : c’est mon office. Le petit Pa était là tout le temps.` },
        { id: 'mandragore', q: 'Vous avez retiré de la mandragore à la pharmacie ?', requires: ['pharmacie'],
          a: `Oui, avant-hier, pour le vieux Ankh qui a le dos brisé. Une dose de racine, comme prescrit. Interrogez Ankh, il dort à l’infirmerie.` },
        { id: 'ipy', q: 'Ipy était-il au courant de votre liaison ?', requires: ['hori_liaison'],
          a: `Non. Il ne parlait presque à personne en dehors de ses rouleaux. Je l’aurais senti.` }
      ],
      confrontations: [
        { pieces: ['dedi_amants', 'traces_amants'], grants: ['hori_liaison'],
          a: `(Un long silence.) Très bien. Néferet et moi… Nous nous retrouvons au bassin quand la nuit tombe. Cette nuit-là, de la 4e à la 6e heure. Ipy n’en a jamais rien su, je vous le jure. Je vous demande seulement de nous épargner le scandale.` },
        { pieces: ['purification'],
          a: `Vous voyez ? Mes frères vous le diront : je n’ai pas quitté le lac avant le rite.` }
      ]
    },
    merou: {
      sujets: [
        { id: 'qui', q: 'Qui êtes-vous ?',
          a: `Mérou, scribe, second d’Ipy aux archives depuis cinq ans. Du moins, je l’étais.` },
        { id: 'ipy', q: 'Votre différend avec Ipy ?',
          a: `Le titre de scribe royal des archives m’était promis. Ipy a écrit que je manquais de sérieux, et l’a donné à un autre. J’ai crié des choses, hier. On m’a entendu. Je ne les retire pas, mais je ne l’ai pas tué.` },
        { id: 'nuit', q: 'Où étiez-vous hier soir ?',
          a: `J’enseignais l’écriture à huit élèves, de la 11e heure à la 1re heure de la nuit. Puis j’ai mangé et dormi. Vous trouverez leur tablette.` },
        { id: 'visite', q: 'Vous êtes venu aux archives hier, n’est-ce pas ?', requires: ['visiteurs'],
          a: `Moi ? Non… Il y a longtemps. Je n’y mets plus les pieds.` },
        { id: 'autres', q: 'Que savez-vous des autres suspects ?', grants: ['neferet_veuve'],
          a: `Khay triche sur les mesures, tout le monde le sait. Abi rôde et vend des poisons en ville, croyez-moi. Néferet ? La veuve de Ptahmose vit des revenus du culte de son mari : la voix d’un ange et la bourse bien garnie.` }
      ],
      confrontations: [
        { pieces: ['visiteurs'], sujet: 'visite', grants: ['merou_aveu'],
          a: `(Il grimace.) C’est vrai. J’ai lu le rouleau des remèdes. Mon père brûle d’entrailles, je cherchais de quoi le soulager. Je n’ai pas osé le dire : on m’aurait pris pour un empoisonneur.` },
        { pieces: ['lettre_pere'],
          a: `Ma sœur m’écrit à chaque décade. Vous voyez ? Pas de crime là-dedans.` },
        { pieces: ['copie_hymne'], grants: ['merou_aveu'],
          a: `(Il pâlit.) Ce n’est pas le meurtre. Je copie l’Hymne à Ptah pour Abi : dix copies, payées en cuivre. Nous sommes pauvres, mon père est malade. Si on le sait, je perds ma charge. Mais Ipy ne l’a jamais su.` },
        { pieces: ['ecole'],
          a: `Huit élèves, Seigneur. Aucun ne m’a vu sortir de la salle, parce que je ne suis pas sorti.` },
        { pieces: ['caricature', 'promotion'],
          a: `Une rancune d’artiste, Seigneur. On ne tue pas pour un dessin.` }
      ]
    },
    neferet: {
      sujets: [
        { id: 'qui', q: 'Qui êtes-vous ?', grants: ['neferet_veuve'],
          a: `Néferet, chanteuse de Ptah. Veuve du scribe Ptahmose, dont je préside le culte funéraire : les offrandes, les prières, les champs de sa dotation. Cela fait six ans.` },
        { id: 'nuit', q: 'Où étiez-vous hier soir ?',
          a: `J’ai chanté l’hymne du soir au rite, puis j’ai quitté le temple avant la fermeture de la porte. Je suis rentrée chez moi, en ville, et j’ai dormi.` },
        { id: 'libation', q: 'Vous avez pris la bière de libation à la réserve ?',
          a: `Oui, à la 11e heure, avec le petit Pa. Il m’a servie sans tarder, j’ai pris mes deux jarres et je suis partie. Rien de plus.` },
        { id: 'ipy', q: 'Que pensiez-vous d’Ipy ?',
          a: `Un homme pâle et exact. Il comptait tout, même les soupirs. Je ne l’aimais ni ne le haïssais.` },
        { id: 'ipy_liaison', q: 'Ipy savait-il pour vous et Hori ?', requires: ['neferet_liaison'],
          a: `Non. Jamais. Personne ne savait, sauf, peut-être, le jardinier.` }
      ],
      confrontations: [
        { pieces: ['registre_porte'], sujet: 'nuit',
          a: `(Un temps.) Soit. Je n’ai pas franchi la porte. J’ai dormi dans la salle des chanteuses. J’avais honte d’un simple retard, c’est tout.` },
        { pieces: ['dedi_amants', 'traces_amants', 'hori_liaison'], grants: ['neferet_liaison'],
          a: `(Elle rougit.) Hori et moi… oui. Au bassin, de la 4e à la 6e heure, jusqu’à ce que le jardinier arrose les roses. C’est cela que je cachais. Nous étions ensemble, il vous le dira. Alors dites-moi : comment aurais-je tué un homme enfermé dans une salle scellée ?` },
        { pieces: ['tablette_brasserie'],
          a: `Le petit confirme que j’y étais. Je n’ai rien nié.` },
        { pieces: ['pa_seule', 'crochet_mesure'],
          a: `(Un souffle.) Le petit a quitté la réserve ? Je n’y avais pas pris garde. Je n’ai touché à rien, sinon à mes jarres de libation. Vous ne pouvez rien en tirer.` },
        { pieces: ['couronnes'],
          a: `Des guirlandes de libation ! Lotus, saule, fruits de mandragore séchés : c’est l’usage depuis les temps anciens. Toutes les chanteuses en tressent.` },
        { pieces: ['petale_lotus'],
          a: `Je tresse mes couronnes un peu partout, je laisse des pétales derrière moi. Il n’y a pas de crime dans un pétale.` },
        { pieces: ['registre_lumiere', 'ostracon', 'registre'],
          a: `(Elle pâlit.) Ptahmose tenait ces terres de son vivant ; ce sont des écritures de six ans, d’avant ma charge. Si un scribe mort a mal noté, je n’en réponds pas.` },
        { pieces: ['bouchon', 'bouchon_mou', 'crochet_sceau'],
          a: `Que voulez-vous que j’y comprenne ? Je suis chanteuse, pas brasseur.` }
      ]
    },
    khay: {
      sujets: [
        { id: 'qui', q: 'Qui êtes-vous ?',
          a: `Khay, intendant des greniers du temple. Quarante-sept ans de sacs, de mesures et de poussière d’orge.` },
        { id: 'dispute', q: 'Votre dispute avec Ipy ?',
          a: `Il voulait vérifier mes mesures de grain après le repos. Des chicanes de scribe ! Mes comptes sont justes, Seigneur.` },
        { id: 'nuit', q: 'Où étiez-vous hier soir ?',
          a: `À mon grenier, à compter les sacs, jusqu’à tard. Mes hommes vous le diront.` },
        { id: 'brasserie', q: 'Êtes-vous retourné à la réserve après la 10e heure ?',
          a: `Non. Le gamin a fermé, il avait la clé : il ne me l’aurait pas prêtée.` },
        { id: 'rations', q: 'Parlez-moi des rations de bière de vos ouvriers.', requires: ['tablette_brasserie'], grants: ['khay_fraude'],
          a: `(Il soupire.) Bon. Je réclame un peu plus de bière que mes ouvriers n’en boivent. Tout le monde le fait. Ipy allait le découvrir. Mais je ne l’ai pas tué, Seigneur : je n’aurais pas osé.` }
      ],
      confrontations: [
        { pieces: ['tablette_brasserie'],
          a: `Le gamin ? J’ai parlé des rations de bière pour mes ouvriers, rien de plus.` },
        { pieces: ['registre', 'registre_lumiere', 'ostracon'],
          a: `Ce n’est pas mon registre. Moi, je suis aux sacs, pas aux parcelles.` }
      ]
    },
    abi: {
      sujets: [
        { id: 'qui', q: 'Qui êtes-vous ?',
          a: `Abi de Canaan, marchand de résines et d’encens. Je livre le temple depuis sept ans.` },
        { id: 'nuit', q: 'Où étiez-vous hier soir ?',
          a: `À la maison des étrangers, en ville. J’ai quitté le temple à la 11e heure ; le gardien vous le confirmera. Ensuite, la taverne, en ville, avec mes compagnons, jusqu’au matin.` },
        { id: 'affaires', q: 'Avez-vous affaire avec les scribes ?',
          a: `Aucune, Seigneur. Je vends aux prêtres, pas aux scribes.` },
        { id: 'pavot', q: 'Vous vendez des drogues ?',
          a: `Du pavot aux médecins de la ville, avec les taxes. De la mandragore ? Jamais. Elle est capricieuse, elle meurt en voyage.` },
        { id: 'brasserie', q: 'Étiez-vous à la réserve ?',
          a: `Je suis passé avec mon encens devant la porte de la réserve, à la 10e heure. Je n’y suis pas entré. Le petit gardait sa porte.` }
      ],
      confrontations: [
        { pieces: ['copie_hymne', 'merou_aveu'], grants: ['abi_aveu'],
          a: `(Il se raidit.) Ah. Oui. Mérou me copie l’Hymne à Ptah ; dans mon pays, on paie cher pour ces chants. Ce n’est pas bien vu ici, je le sais. Mais cela n’a aucun rapport avec Ipy.` },
        { pieces: ['registre_porte'],
          a: `Voyez : sortie à la 11e heure. Je n’ai pas remis les pieds dans le temple.` }
      ]
    }
  },

  /* ── Indices progressifs (désactivés en cas de rejeu) ── */
  aides: [
    `Relis le savoir sur les scellés. La porte est restée scellée dès la 2e heure de la nuit : qu’est-ce que cela t’apprend sur l’endroit où le poison a pu entrer ?`,
    `La jarre a été retouchée après la vérification de la 10e heure. Regarde le bouchon, et ce que dit le savoir sur l’argile : à partir de quand a-t-elle pu l’être ?`,
    `Cherche qui est entré dans la réserve à bière après la vérification, et qui y est resté sans être surveillé. Qu’est-ce qui manquait pour la libation ?`
  ],

  /* ── Accusation ── */
  accusation: {
    mobiles: [
      { id: 'promotion', label: `La jalousie : une promotion refusée` },
      { id: 'grain', label: `Étouffer un détournement de grain et de bière` },
      { id: 'liaison', label: `Protéger une liaison interdite` },
      { id: 'dotation', label: `Protéger une rente obtenue par un faux dans les registres` },
      { id: 'sanction', label: `Se venger d’une sanction jugée injuste` },
      { id: 'copies', label: `Empêcher la révélation d’un trafic de textes sacrés` }
    ],
    methodes: [
      { id: 'coup', label: `Frappé à la tête avec un objet lourd` },
      { id: 'etranglement', label: `Étranglé avec une corde` },
      { id: 'jarre', label: `Empoisonné : la jarre de bière a été trafiquée à la réserve avant sa livraison` },
      { id: 'pain', label: `Empoisonné : le poison était dans le pain` },
      { id: 'transport', label: `Empoisonné : la jarre, saine à la réserve, a été trafiquée pendant le transport` },
      { id: 'fenetre', label: `Empoisonné : le poison a été versé dans la coupe par la fenêtre` }
    ],
    emplacements: [
      { id: 'occasion', label: `Occasion : qui a pu agir, seul ?` },
      { id: 'moyen', label: `Moyen : comment ?` },
      { id: 'mobile', label: `Mobile : pourquoi ?` }
    ],
    preuves: {
      occasion: ['pa_seule', 'tablette_brasserie', 'crochet_mesure'],
      moyen: ['bouchon', 'bouchon_mou', 'bouchon_durci', 'crochet_sceau', 'couronnes'],
      mobile: ['registre_lumiere', 'ostracon']
    },
    // Fins de défaite (aucune ne révèle le vrai coupable)
    fins: {
      hori: { titre: 'Hori est condamné', texte: `Le vizir te croit. Hori est dépouillé de sa pureté et de son titre, rasé une dernière fois, puis envoyé aux carrières de Tourah. Il y jure de son innocence jusqu’à sa mort, un pic à la main. Les prêtres de sa phyle ne prononcent plus jamais son nom.` },
      merou: { titre: 'Mérou est condamné', texte: `Le vizir te croit. Mérou reçoit cent coups de bâton ; ses pinceaux sont brisés devant ses élèves. Son père meurt au village sans l’avoir revu. On ne trouvera jamais de preuve contre lui, parce qu’il n’y en avait pas : mais plus personne ne s’en soucie.` },
      khay: { titre: 'Khay est condamné', texte: `Le vizir te croit. Khay, déjà pris la main dans les sacs, est condamné pour meurtre. On lui coupe le nez et on l’envoie aux mines de turquoise du Sinaï. Ses greniers sont saisis. Il ne reverra jamais l’orge de Memphis.` },
      abi: { titre: 'Abi est condamné', texte: `Le vizir te croit. L’étranger paie pour tous : ses biens sont saisis, ses marchandises brûlées, et la colonie des marchands de Canaan est chassée de Memphis dans la semaine. Abi meurt en prison, loin de sa maison, sans que personne ait su qu’il disait vrai.` },
      senou: { titre: 'Senou est condamné', texte: `Le vizir te croit. Le vieux soldat, dont l’assoupissement vient d’éclater au grand jour, est condamné pour meurtre. Exilé à l’oasis de Kharga après vingt ans de loyaux services, il n’y survit pas à l’hiver.` },
      insuffisant: { titre: 'Le vizir n’est pas convaincu', texte: `Le vizir t’écoute jusqu’au bout. Mais ton récit a des trous : la méthode, le mobile ou les preuves ne tiennent pas ensemble. Faute de démonstration solide, l’accusé est relâché et l’affaire reste sans verdict. Ipy sera enterré sans que justice lui soit rendue.` }
    }
  },

  /* ── Vérité (tout ce qui suit est chiffré/haché à la compilation) ── */
  verite: {
    coupable: 'neferet',
    mobile: 'dotation',
    methode: 'jarre',
    epilogue: {
      titre: 'Néferet est condamnée',
      texte:
`Tout s’éclaire. Devant le vizir, tu déroules la chaîne.

Une porte scellée dès la 2e heure de la nuit, et jamais rouverte : donc le poison n’est pas entré après. Un poison avalé : donc il était dans ce qu’Ipy a bu. Une jarre vérifiée saine à la 10e heure par Pa, puis reprise avec le sceau de l’épi d’orge, dont l’argile était encore molle à la 1re heure de la nuit. Dans la réserve, fermée à clé, un seul visiteur est resté seul avec les jarres : Néferet, quand Pa a couru chercher la mesure de libation.

Ipy avait comparé le registre au cadastre royal. Il avait compris que la dotation de Ptahmose avait été gonflée de deux aroures, parcelle du Canal, six ans plus tôt. Il avait gratté la ligne, réécrit la vérité et commencé son rapport pour l’intendant. Néferet touchait ce revenu depuis la mort de son mari. Faux dans les registres, vol à la maison du dieu : la bastonnade, l’exil, la ruine. Elle a tressé ses guirlandes de lotus et de mandragore, puis elle a rempli la jarre d’Ipy.

Son alibi, elle l’avait trouvé dans les bras de Hori : ils étaient bien ensemble de la 4e à la 6e heure, quand Ipy est mort. Mais un empoisonneur n’a pas besoin d’être là quand sa victime meurt.

Néferet est condamnée à la bastonnade et à l’exil, ses revenus restitués au temple. Hori n’avait rien su : il reprend son service, mais on ne l’entend plus jamais chanter l’hymne du soir. Mérou obtient enfin son titre ; Pa reçoit une jarre neuve et la leçon de ne plus jamais quitter sa réserve.

Notes d’époque. Les quatre phyles de prêtres, la décade de dix jours, les dotations funéraires et les sceaux d’argile sont attestés dans l’Égypte de Ramsès II. La mandragore apparaît dans des guirlandes funéraires, notamment celles de Toutânkhamon. Le jeu simplifie la clepsydre et le séchage de l’argile pour servir l’énigme.`
    },
    /* Modèle logique : sert à prouver que l'affaire n'a qu'une solution. */
    modele: {
      suspects: ['hori', 'merou', 'neferet', 'khay', 'abi', 'senou'],
      // Les heures sont des nombres : D9=9 … D12=12, N1=13, N2=14. Un créneau h couvre [h, h+1[.
      argile_dur_h: 2,
      verification_fin: 11,          // fin de la 10e heure : bouchons secs, une marque
      bouchon_mou_a: 13,             // 1re heure de la nuit : le bouchon est encore mou
      livraison: 14,                 // 2e heure de la nuit : la jarre arrive aux archives, bouchon durci
      reserve: {
        verrouillee_de: 11,
        porte_arriere_barree: true,
        sceau_brasserie_dans_reserve: true,
        ouvertures: [
          { creneau: 9,  qui: 'hori',    surveille: true },
          { creneau: 10, qui: 'khay',    surveille: true },
          { creneau: 11, qui: 'neferet', surveille: false },   // Pa part chercher la mesure
          { creneau: 13, qui: 'senou',   surveille: true }
        ]
      },
      portes_archives: { scellees_de: 14, fenetre_praticable: false },
      mobiles: {
        promotion: ['neferet_riv_promotion'],
        grain:     ['neferet_lien_grain'],
        liaison:   ['ipy_connaissait_liaison'],
        dotation:  ['ipy_corrige_dotation', 'neferet_beneficiaire_dotation'],
        sanction:  ['neferet_sanctionnee_par_ipy'],
        copies:    ['neferet_trafic_textes']
      },
      methodes: {
        coup:         ['plaie_visible'],
        etranglement: ['marque_au_cou'],
        jarre:        ['poison_dans_jarre', 'jarre_reprise_a_la_reserve'],
        pain:         ['poison_dans_pain'],
        transport:    ['jarre_saine_a_la_reserve_apres_verif'],
        fenetre:      ['fenetre_praticable']
      },
      // Faits vrais dans le monde de l'affaire
      faits_vrais: [
        'poison_dans_jarre', 'jarre_reprise_a_la_reserve', 'ipy_corrige_dotation', 'neferet_beneficiaire_dotation'
      ],
      faits_faux: [
        'plaie_visible', 'marque_au_cou', 'poison_dans_pain', 'fenetre_praticable',
        'jarre_saine_a_la_reserve_apres_verif', 'ipy_connaissait_liaison', 'neferet_riv_promotion',
        'neferet_lien_grain', 'neferet_sanctionnee_par_ipy', 'neferet_trafic_textes'
      ],
      // Chaque fait doit être établi par des indices que le joueur peut réellement obtenir.
      soutiens: {
        poison_dans_jarre:        ['rapport_medecin', 'plateau'],
        jarre_reprise_a_la_reserve: ['bouchon', 'bouchon_mou', 'tablette_brasserie', 'crochet_sceau'],
        porte_scellee:            ['scelle', 'senou_livraison'],
        fenetre_impraticable:     ['fenetre'],
        reserve_verrouillee:      ['tablette_brasserie', 'porte_arriere'],
        neferet_seule:            ['pa_seule', 'crochet_mesure'],
        senou_surveille:          ['bouchon_mou', 'bouchon_durci'],
        reprise_entre_11h_et_12h: ['bouchon_mou', 'bouchon_durci', 'tablette_brasserie'],
        ipy_corrige_dotation:     ['registre', 'registre_lumiere', 'ostracon'],
        neferet_beneficiaire_dotation: ['neferet_veuve', 'registre_lumiere'],
        ipy_ignorait_liaison:     ['hori_liaison', 'neferet_liaison', 'dedi_amants'],
        pain_sain:                ['rapport_medecin'],
        pas_de_blessure:          ['corps']
      }
    }
  }
};

function planTemple() {
  const box = (x, y, w, h, nom, sub, fill) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${fill}" stroke="#2b2118" stroke-width="2.5"/>` +
    `<text x="${x + w / 2}" y="${y + h / 2 + (sub ? -2 : 6)}" text-anchor="middle" font-size="17" font-weight="700" fill="#2b2118">${nom}</text>` +
    (sub ? `<text x="${x + w / 2}" y="${y + h / 2 + 18}" text-anchor="middle" font-size="12" font-style="italic" fill="#5a4630">${sub}</text>` : '');
  let s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 600" font-family="Georgia, serif" role="img" aria-label="Plan du temple de Ptah">';
  s += '<rect width="960" height="600" fill="#e8d9a0"/>';
  s += '<rect x="30" y="25" width="850" height="460" rx="14" fill="#f0e2bf" stroke="#2b2118" stroke-width="5"/>';
  s += '<rect x="215" y="165" width="645" height="305" fill="#dcc690"/>';
  s += '<text x="570" y="235" text-anchor="middle" font-size="20" font-weight="700" fill="#7a6430" letter-spacing="3">COUR</text>';
  s += box(50, 45, 150, 105, 'Archives', '', '#c79b62');
  s += box(215, 45, 150, 105, 'Salle du culte', '', '#d9bf8c');
  s += box(380, 45, 150, 105, 'Maison de Vie', 'pharmacie', '#d9bf8c');
  s += box(545, 45, 150, 105, 'Greniers', '', '#d9bf8c');
  s += box(710, 45, 150, 105, 'Réserve à bière', '', '#c79b62');
  s += box(50, 165, 150, 100, 'Maison des scribes', 'école et cellules', '#d9bf8c');
  s += box(710, 165, 150, 100, 'Cuisines et four', '', '#d9bf8c');
  s += '<rect x="50" y="280" width="350" height="190" rx="12" fill="#b9d4a8" stroke="#2f6b4a" stroke-width="3" stroke-dasharray="9 6"/>';
  s += '<text x="225" y="302" text-anchor="middle" font-size="14" font-weight="700" fill="#2f6b4a" letter-spacing="2">JARDIN DU LAC</text>';
  s += '<ellipse cx="125" cy="385" rx="68" ry="55" fill="#6ea6c9" stroke="#1f4e8c" stroke-width="3"/>';
  s += '<text x="125" y="391" text-anchor="middle" font-size="16" font-weight="700" fill="#10304f">Bassin du lac</text>';
  s += box(225, 312, 160, 70, 'Maison de purification', '', '#e2d3a6').replace(/font-size="17"/, 'font-size="15"');
  s += box(225, 392, 160, 66, 'Salle des chanteuses', '', '#e2d3a6').replace(/font-size="17"/, 'font-size="15"');
  s += box(520, 395, 170, 75, 'Porte du temple', 'poste de garde', '#c79b62');
  s += '<rect x="560" y="478" width="90" height="14" fill="#f0e2bf"/><path d="M605 510 v-30" stroke="#b5443a" stroke-width="4"/><path d="M595 492 l10 -14 l10 14 z" fill="#b5443a"/>';
  s += '<rect x="30" y="520" width="850" height="65" rx="12" fill="#d9c79a" stroke="#2b2118" stroke-width="2.5" stroke-dasharray="3 7"/>';
  s += '<text x="455" y="558" text-anchor="middle" font-size="18" font-weight="700" fill="#5a4630">EN VILLE · hors du temple</text>';
  s += '<text x="455" y="577" text-anchor="middle" font-size="12" font-style="italic" fill="#5a4630">maison des étrangers, taverne, logis</text>';
  return s + '</svg>';
}

export default affaire;
