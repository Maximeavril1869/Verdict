/* Verdict — interface du jeu (iPad Pro 11 en priorité, iPhone en repli). */
(function () {
  'use strict';

  var Core = window.VCore, SEASONS = window.VERDICT_SEASONS, $app = document.getElementById('app');
  var APP_VERSION = '1.0.2';
  var LS = 'verdict:v1:';

  /* ───────────── utilitaires ───────────── */
  function h(tag, attrs) {
    var el = document.createElement(tag), k, v, kids = Array.prototype.slice.call(arguments, 2);
    if (attrs) for (k in attrs) {
      v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    (function add(list) {
      list.forEach(function (c) {
        if (c == null || c === false) return;
        if (Array.isArray(c)) add(c);
        else el.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(c) : c);
      });
    })(kids);
    return el;
  }
  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); return el; }
  function lsGet(k, d) { try { var v = localStorage.getItem(LS + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(LS + k, JSON.stringify(v)); } catch (e) { /* stockage plein ou interdit */ } }
  function isWide() { return window.matchMedia('(min-width: 1000px) and (min-height: 521px)').matches; }
  function count(o) { return Object.keys(o).length; }
  function byId(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
  function debounce(fn, ms) { var t; return function () { var a = arguments; clearTimeout(t); t = setTimeout(function () { fn.apply(null, a); }, ms); }; }

  var toastEl = null, toastT = 0;
  function toast(msg) {
    if (toastEl) toastEl.remove();
    toastEl = h('div', { class: 'toast', text: msg });
    document.body.appendChild(toastEl);
    clearTimeout(toastT);
    toastT = setTimeout(function () { if (toastEl) { toastEl.remove(); toastEl = null; } }, 2600);
  }
  var MODAL = null;
  function closeModal() { if (MODAL) { MODAL.remove(); MODAL = null; } }
  function openModal(build) {
    closeModal();
    var back = h('div', { class: 'modal', onclick: function (e) { if (e.target === back) closeModal(); } });
    var sheet = h('div', { class: 'sheet', role: 'dialog' });
    build(sheet);
    back.appendChild(sheet);
    document.body.appendChild(back);
    MODAL = back;
  }
  function confirmBox(titre, texte, okLabel, onOk, danger) {
    openModal(function (s) {
      s.appendChild(h('h3', { text: titre }));
      s.appendChild(h('p', { text: texte }));
      s.appendChild(h('div', { class: 'btns' },
        h('button', { class: 'btn ghost', text: 'Annuler', onclick: closeModal }),
        h('button', { class: 'btn ' + (danger ? 'red' : 'gold'), text: okLabel, onclick: function () { closeModal(); onOk(); } })));
    });
  }

  /* ───────────── état ───────────── */
  var META = lsGet('meta', { settings: { zones: true, size: 17 }, cases: {}, reports: [] });
  META.settings = META.settings || { zones: true, size: 17 };
  var CASE = null, S = null;
  var UI = { view: 'home', scene: null, person: null, ntab: 'notes', drawer: false, full: false, accTab: null };

  function saveMeta() { lsSet('meta', META); }
  var saveStateNow = function () { if (S) lsSet('case:' + S.id, S); };
  var saveState = debounce(function () { saveStateNow(); }, 300);
  function newState(id) {
    return { v: 1, id: id, found: {}, order: [], asked: {}, talk: {}, notes: '', grid: {}, snotes: {}, hints: 0, replay: false, attempts: 0, status: 'enquete', fin: null, draft: {}, seen: {}, started: Date.now() };
  }
  function known() { var k = {}, i; for (i in S.found) k[i] = true; for (i in S.asked) k[i] = true; return k; }
  function applySettings() {
    document.documentElement.style.fontSize = (META.settings.size || 17) + 'px';
    $app.classList.toggle('zones-on', !!META.settings.zones);
  }
  function caseMeta(id) { return META.cases[id] || (META.cases[id] = { status: 'none', attempts: 0 }); }

  function giveClue(id, silent) {
    if (S.found[id]) return false;
    S.found[id] = Date.now(); S.order.push(id);
    var c = byId(CASE.indices, id);
    if (!silent && c) toast('Nouvel indice : ' + c.titre);
    saveState();
    return true;
  }

  /* ───────────── chargement d'une affaire ───────────── */
  function loadCase(entry, cb) {
    if (window.VERDICT_CASES && window.VERDICT_CASES[entry.id]) return cb(window.VERDICT_CASES[entry.id]);
    var s = document.createElement('script');
    s.src = entry.src;
    s.onload = function () { cb(window.VERDICT_CASES[entry.id]); };
    s.onerror = function () { toast('Impossible de charger l’affaire. Es-tu connecté ?'); };
    document.head.appendChild(s);
  }
  function openCase(entry, fresh) {
    loadCase(entry, function (data) {
      CASE = data;
      var saved = lsGet('case:' + data.id, null);
      S = (!fresh && saved && saved.v === 1) ? saved : newState(data.id);
      var cm = caseMeta(data.id);
      if (fresh) { S.attempts = cm.attempts || 0; }
      cm.status = S.status === 'victoire' ? 'victoire' : (cm.status === 'victoire' ? 'victoire' : (S.status === 'enquete' ? (count(S.found) ? 'run' : 'none') : S.status));
      saveMeta(); saveStateNow();
      UI.view = S.status === 'enquete' ? 'dossier' : 'accuser'; UI.scene = CASE.scenes[0].id; UI.person = null; UI.drawer = false; UI.full = false;
      renderShell();
    });
  }
  function goHome() { closeModal(); CASE = null; S = null; UI.view = 'home'; renderHome(); }

  /* ───────────── accueil ───────────── */
  function statusChip(id) {
    var m = META.cases[id], st = m ? m.status : 'none';
    var saved = lsGet('case:' + id, null);
    if (saved && saved.status === 'enquete' && count(saved.found)) return h('span', { class: 'chip run', text: 'En cours' });
    if (st === 'victoire') return h('span', { class: 'chip ok', text: 'Résolue' });
    if (saved && saved.status && saved.status !== 'enquete') return h('span', { class: 'chip bad', text: 'Échec' });
    return h('span', { class: 'chip', text: 'Nouvelle' });
  }
  function renderHome() {
    document.title = 'Verdict';
    $app.className = META.settings.zones ? 'zones-on' : '';
    clear($app);
    var wrap = h('div', { class: 'wrap' },
      h('div', { class: 'brand' },
        h('div', { class: 'glyph', text: '☥' }),
        h('h1', { text: 'VERDICT' }),
        h('p', { text: 'Enquêtes à travers les âges. Une seule accusation.' })));
    SEASONS.forEach(function (se) {
      var sec = h('section', { class: 'season' }, h('h2', null, se.titre, h('small', { text: se.sous })));
      if (se.bientot) {
        sec.appendChild(h('div', { class: 'case-card soon' }, h('div', null, h('h3', { text: 'À venir' }), h('div', { class: 'meta', text: 'Cette saison reste à écrire.' }))));
      } else {
        se.affaires.forEach(function (af) {
          var saved = lsGet('case:' + af.id, null), fini = saved && saved.status !== 'enquete';
          var btns = [];
          if (!saved) btns.push(h('button', { class: 'btn gold', text: 'Commencer', onclick: function () { openCase(af, true); } }));
          else if (!fini) btns.push(h('button', { class: 'btn gold', text: 'Reprendre', onclick: function () { openCase(af, false); } }));
          else {
            btns.push(h('button', { class: 'btn', text: 'Revoir', onclick: function () { openCase(af, false); } }));
            btns.push(h('button', { class: 'btn gold', text: 'Rejouer', onclick: function () { confirmBox('Rejouer cette affaire ?', 'Ta progression sera effacée. Les indices seront désactivés pour ce nouvel essai.', 'Rejouer', function () { loadCase(af, function (d) { CASE = d; S = newState(d.id); S.replay = true; var m = caseMeta(d.id); S.attempts = m.attempts || 0; openCaseWithState(af); }); }); } }));
          }
          sec.appendChild(h('div', { class: 'case-card' },
            h('div', null, h('h3', { text: af.titre }), h('div', { class: 'meta', text: af.lieu + ' · ' + af.epoque }), h('div', { style: 'margin-top:6px' }, statusChip(af.id))),
            h('div', { style: 'display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end' }, btns)));
          sec.appendChild(h('div', { class: 'case-card soon', style: 'margin-top:10px' }, h('div', null, h('h3', { text: 'Prochaine affaire' }), h('div', { class: 'meta', text: 'À écrire.' }))));
        });
      }
      wrap.appendChild(sec);
    });
    wrap.appendChild(h('div', { class: 'foot' },
      h('button', { class: 'btn', text: 'Réglages', onclick: showSettings }),
      h('button', { class: 'btn', text: 'Signaler une incohérence', onclick: showReport })));
    $app.appendChild(h('div', { class: 'home' }, wrap));
  }
  function openCaseWithState(entry) {
    lsSet('case:' + CASE.id, S);
    caseMeta(CASE.id).status = 'none'; saveMeta();
    UI.view = 'dossier'; UI.scene = CASE.scenes[0].id; UI.person = null; UI.drawer = false; UI.full = false;
    renderShell();
  }

  /* ───────────── coque de l'enquête ───────────── */
  var NAV = [
    { id: 'dossier', ic: '📜', t: 'Dossier' }, { id: 'scenes', ic: '🔍', t: 'Scènes' }, { id: 'interroger', ic: '💬', t: 'Interroger' },
    { id: 'savoirs', ic: '📖', t: 'Savoirs' }, { id: 'pieces', ic: '🗂️', t: 'Pièces' }, { id: 'carnet', ic: '📝', t: 'Carnet' }, { id: 'accuser', ic: '⚖️', t: 'Accuser' }
  ];
  var elTop, elNav, elMain, elDrawer;
  function renderShell() {
    document.title = 'Verdict · ' + CASE.titre;
    clear($app);
    $app.className = (META.settings.zones ? 'zones-on ' : '') + 'case' + (UI.drawer && isWide() ? ' drawer-open' : '') + (UI.drawer && isWide() && UI.full ? ' drawer-full' : '');
    elTop = h('header', { id: 'top' }); elNav = h('nav', { id: 'nav' }); elMain = h('main', { id: 'main' }); elDrawer = h('aside', { id: 'drawer' });
    $app.append(elTop, elNav, elMain, elDrawer);
    renderTop(); renderNav(); renderMain(); renderDrawer();
  }
  function renderTop() {
    clear(elTop);
    var enquete = S.status === 'enquete';
    elTop.append(
      h('button', { class: 'btn', text: '‹', 'aria-label': 'Accueil', onclick: goHome }),
      h('div', { class: 'title' }, h('b', { text: CASE.titre }), h('small', { text: CASE.lieu + ' · ' + CASE.epoque })),
      enquete && !S.replay ? h('button', { class: 'btn gold', onclick: showHints, html: '💡 Indice <small>' + S.hints + '/' + CASE.aides.length + '</small>' }) : (S.replay && enquete ? h('span', { class: 'chip run', text: 'Rejeu sans indice' }) : null),
      h('button', { class: 'btn', text: '🗺️', 'aria-label': 'Plan du temple', onclick: showPlan }),
      h('button', { class: 'btn', text: '⋯', 'aria-label': 'Menu', onclick: showMenu }));
  }
  function renderNav() {
    clear(elNav);
    NAV.forEach(function (n) {
      var on = UI.view === n.id || (n.id === 'carnet' && UI.drawer && isWide());
      var badge = n.id === 'pieces' && count(S.found) ? h('span', { class: 'badge', text: count(S.found) }) : null;
      elNav.appendChild(h('button', { class: on ? 'on' : '', onclick: function () { navTo(n.id); } }, h('span', { class: 'ic', text: n.ic }), n.t, badge));
    });
  }
  function navTo(id) {
    closeModal();
    if (id === 'carnet' && isWide()) { UI.drawer = !UI.drawer; UI.full = false; renderShell(); return; }
    UI.view = id; if (id !== 'carnet') { /* garde le tiroir */ }
    renderNav(); renderMain();
  }
  function renderMain() {
    clear(elMain);
    var v = UI.view, page;
    if (v === 'dossier') page = viewDossier();
    else if (v === 'scenes') page = viewScenes();
    else if (v === 'interroger') page = viewTalk();
    else if (v === 'savoirs') page = viewSavoirs();
    else if (v === 'pieces') page = viewPieces();
    else if (v === 'carnet') page = h('div', { class: 'carnet' }, notebook());
    else if (v === 'accuser') page = S.status === 'enquete' ? viewAccuse() : viewFin();
    elMain.appendChild(page);
  }
  function renderDrawer() {
    clear(elDrawer);
    if (!(UI.drawer && isWide())) return;
    elDrawer.append(
      h('div', { class: 'carnet-tabs', style: 'justify-content:space-between;background:var(--ink);color:#f6e8b8' },
        h('b', { text: '📝 Carnet' }),
        h('span', null,
          h('button', { class: 'btn small ghost', style: 'color:#f6e8b8;box-shadow:inset 0 0 0 2px #7a6430', text: UI.full ? '⤡ Réduire' : '⤢ Agrandir', onclick: function () { UI.full = !UI.full; renderShell(); } }), ' ',
          h('button', { class: 'btn small ghost', style: 'color:#f6e8b8;box-shadow:inset 0 0 0 2px #7a6430', text: '✕', 'aria-label': 'Fermer', onclick: function () { UI.drawer = false; UI.full = false; renderShell(); } }))),
      h('div', { class: 'carnet', style: 'flex:1;min-height:0' }, notebook()));
  }
  window.addEventListener('resize', debounce(function () { if (CASE) renderShell(); }, 200));

  /* ───────────── pièces & indices ───────────── */
  function clueSource(c) {
    if (c.scene) { var sc = byId(CASE.scenes, c.scene); return sc ? sc.titre : ''; }
    var p = byId(CASE.suspects, c.source) || byId(CASE.temoins, c.source);
    return p ? 'Témoignage · ' + p.nom : '';
  }
  function showClue(id) {
    var c = byId(CASE.indices, id);
    giveClue(id);
    renderNav();
    openModal(function (s) {
      s.append(h('h3', { text: c.titre }), h('div', { class: 'src', text: clueSource(c) }), h('p', { text: c.texte }),
        h('div', { class: 'btns' },
          h('button', { class: 'btn ghost', text: 'Copier dans le carnet', onclick: function () {
            S.notes += (S.notes && !/\n$/.test(S.notes) ? '\n' : '') + '• ' + c.titre + ' : ' + c.texte + '\n'; saveState(); toast('Ajouté à tes notes'); } }),
          h('button', { class: 'btn gold', text: 'Fermer', onclick: function () { closeModal(); if (UI.view === 'scenes') renderMain(); else if (UI.view === 'pieces') renderMain(); } })));
    });
  }

  /* ───────────── dossier ───────────── */
  function personCard(p, big) {
    return h('button', { class: 'pcard', onclick: function () { UI.person = p.id; navTo('interroger'); } },
      h('span', { html: CASE.portraits[p.id] }),
      h('span', null, h('b', { text: p.nom }), h('small', { text: p.titre + (p.age ? ' · ' + p.age + ' ans' : '') }), h('span', { text: p.bio })));
  }
  function viewDossier() {
    var d = CASE.intro, page = h('div', { class: 'page dossier' });
    page.append(h('h2', { text: d.titre }), h('div', { class: 'era', text: CASE.saison + ' · ' + CASE.epoque }));
    d.paragraphes.forEach(function (p, i) { page.appendChild(h('p', { class: i === 0 ? 'lead' : '', text: p })); });
    page.append(h('h3', { text: 'La victime' }),
      h('div', { class: 'victim' }, h('span', { html: CASE.portraits.ipy, style: 'display:block' }),
        h('div', null, h('b', { text: 'Ipy, scribe en chef des archives' }), h('div', { text: 'Cinquante-deux ans. Exact, pâle, secret. Il comptait tout, même les soupirs.' }))));
    page.append(h('h3', { text: 'Les six suspects' }), h('div', { class: 'people-grid' }, CASE.suspects.map(function (p) { return personCard(p); })));
    page.append(h('h3', { text: 'Les témoins' }), h('div', { class: 'people-grid' }, CASE.temoins.map(function (p) { return personCard(p); })));
    page.append(h('p', { class: 'sub', text: 'Touche une personne pour l’interroger. Les « Savoirs » t’expliquent les usages du temple : lis-les avant de conclure.' }));
    return page;
  }

  /* ───────────── scènes ───────────── */
  function visibleClues(sceneId) {
    var k = known();
    return CASE.indices.filter(function (c) { return c.scene === sceneId && Core.reqOk(c.requires, k); });
  }
  function viewScenes() {
    var wrap = h('div', { class: 'scenes' }), sc = byId(CASE.scenes, UI.scene) || CASE.scenes[0];
    var tabs = h('div', { class: 'scene-tabs' });
    CASE.scenes.forEach(function (s) {
      var vis = visibleClues(s.id), n = vis.filter(function (c) { return S.found[c.id]; }).length;
      tabs.appendChild(h('button', { class: s.id === sc.id ? 'on' : '', onclick: function () { UI.scene = s.id; renderMain(); } }, s.titre, h('small', { text: n + '/' + vis.length })));
    });
    var stage = h('div', { class: 'stage', html: sc.svg });
    var vis = visibleClues(sc.id), visIds = {};
    vis.forEach(function (c) { visIds[c.id] = true; });
    Array.prototype.forEach.call(stage.querySelectorAll('.hot'), function (g) {
      var id = g.getAttribute('data-hot');
      if (!visIds[id]) { g.style.display = 'none'; return; }
      if (S.found[id]) g.classList.add('found');
      var go = function () { showClue(id); };
      g.addEventListener('click', go);
      g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    });
    var cap = h('div', { class: 'stage-cap' }, h('span', null, h('b', { text: sc.lieu + '. ' }), sc.description),
      h('button', { class: 'btn small ghost', text: META.settings.zones ? 'Masquer les zones' : 'Montrer les zones', onclick: function () { META.settings.zones = !META.settings.zones; saveMeta(); applySettings(); renderMain(); } }));
    wrap.append(tabs, stage, cap);
    return wrap;
  }

  /* ───────────── interrogatoires ───────────── */
  var GENERIC = ['Je ne vois pas le rapport, Seigneur.', 'Cela ne me dit rien.', 'Pourquoi me montrer cela ? Je n’y suis pour rien.', 'Je ne saurais rien en dire.'];
  function person(id) { return byId(CASE.suspects, id) || byId(CASE.temoins, id); }
  function viewTalk() {
    var wide = isWide();
    if (!UI.person && wide) UI.person = CASE.suspects[0].id;
    var el = h('div', { class: 'talk' + (UI.person ? ' has-person' : '') });
    var list = h('div', { class: 'plist' }, h('h4', { text: 'Suspects' }));
    function row(p) {
      var seen = S.talk[p.id] && S.talk[p.id].length;
      return h('button', { class: 'prow' + (UI.person === p.id ? ' on' : ''), onclick: function () { UI.person = p.id; renderMain(); } },
        h('span', { html: CASE.portraits[p.id] }), h('span', null, h('b', { text: p.nom }), h('small', { text: p.titre })),
        newTopics(p.id) ? h('span', { class: 'dot', title: 'Nouvelles questions' }) : null);
    }
    CASE.suspects.forEach(function (p) { list.appendChild(row(p)); });
    list.appendChild(h('h4', { text: 'Témoins' }));
    CASE.temoins.forEach(function (p) { list.appendChild(row(p)); });
    el.appendChild(list);
    if (UI.person) el.appendChild(convPane(person(UI.person)));
    return el;
  }
  function newTopics(pid) { return Core.sujetsDispo(CASE, pid, known()).some(function (s) { return !S.asked[pid + '.' + s.id]; }); }
  function convPane(p) {
    var g = CASE.gens[p.id], tr = S.talk[p.id] = S.talk[p.id] || [], k = known();
    var pane = h('div', { class: 'conv' });
    pane.appendChild(h('div', { class: 'conv-head' },
      h('button', { class: 'btn small ghost back', text: '‹ Liste', onclick: function () { UI.person = null; renderMain(); } }),
      h('span', { html: CASE.portraits[p.id], style: 'display:block' }),
      h('div', null, h('b', { text: p.nom }), h('small', { text: p.titre }))));
    var box = h('div', { class: 'transcript' });
    if (!tr.length) box.appendChild(h('div', { class: 'empty', text: 'Choisis une question ci-dessous. Tu peux aussi présenter une pièce que tu as trouvée.' }));
    tr.forEach(function (e) {
      var ans, q;
      if (e.k === 'q') { var t = byId(g.sujets, e.id); q = h('div', { class: 'bub me', text: t.q }); ans = t.a; }
      else {
        var piece = byId(CASE.indices, e.piece);
        q = h('div', { class: 'bub me piece', text: '📌 Tu présentes : ' + (piece ? piece.titre : e.piece) });
        ans = e.idx >= 0 ? g.confrontations[e.idx].a : GENERIC[(e.piece.length + p.id.length) % GENERIC.length];
      }
      box.append(q, h('div', { class: 'row-them' }, h('span', { html: CASE.portraits[p.id] }), h('div', { class: 'bub them', text: ans })));
    });
    pane.appendChild(box);
    var acts = h('div', { class: 'actions' });
    var open = Core.sujetsDispo(CASE, p.id, k).filter(function (s) { return !S.asked[p.id + '.' + s.id]; });
    acts.appendChild(h('h4', { text: 'Questions' }));
    if (!open.length) acts.appendChild(h('div', { class: 'empty', style: 'padding:6px', text: 'Plus de questions pour l’instant. Présente une pièce, ou va chercher d’autres indices.' }));
    open.forEach(function (s) {
      acts.appendChild(h('button', { class: 'qbtn', text: s.q, onclick: function () { ask(p.id, s); } }));
    });
    acts.appendChild(h('button', { class: 'btn gold', style: 'margin-top:4px', text: '📌 Présenter une pièce', disabled: count(S.found) ? null : true, onclick: function () { pickPiece(p); } }));
    pane.appendChild(acts);
    requestAnimationFrame(function () { box.scrollTop = box.scrollHeight; });
    return pane;
  }
  function ask(pid, s) {
    S.asked[pid + '.' + s.id] = true; (S.talk[pid] = S.talk[pid] || []).push({ k: 'q', id: s.id });
    var before = count(S.found);
    (s.grants || []).forEach(function (id) { giveClue(id, true); });
    var gained = (s.grants || []).filter(function () { return true; }).length;
    saveState(); renderNav(); renderMain();
    var g = (s.grants || []).map(function (id) { return byId(CASE.indices, id); }).filter(Boolean);
    if (g.length && count(S.found) > before) toast('Nouvel indice : ' + g[0].titre);
  }
  function pickPiece(p) {
    openModal(function (sh) {
      sh.append(h('h3', { text: 'Présenter une pièce à ' + p.nom }), h('div', { class: 'src', text: 'Choisis ce que tu lui montres.' }));
      var grid = h('div', { class: 'pick' });
      S.order.forEach(function (id) {
        var c = byId(CASE.indices, id);
        grid.appendChild(h('button', { class: 'piece', onclick: function () { closeModal(); present(p, id); } }, h('b', { text: c.titre }), h('small', { text: clueSource(c) })));
      });
      sh.append(grid, h('div', { class: 'btns' }, h('button', { class: 'btn ghost', text: 'Annuler', onclick: closeModal })));
    });
  }
  function present(p, pieceId) {
    var tr = S.talk[p.id] = S.talk[p.id] || [], g = CASE.gens[p.id];
    for (var i = 0; i < tr.length; i++) if (tr[i].k === 'c' && tr[i].piece === pieceId) { toast('Tu lui as déjà présenté cette pièce.'); return; }
    var conf = Core.confrontation(CASE, p.id, pieceId, known()), idx = conf ? g.confrontations.indexOf(conf) : -1, before = count(S.found);
    tr.push({ k: 'c', piece: pieceId, idx: idx });
    if (conf) (conf.grants || []).forEach(function (id) { giveClue(id, true); });
    saveState(); renderNav(); renderMain();
    if (conf && conf.grants && conf.grants.length && count(S.found) > before) toast('Nouvel indice : ' + byId(CASE.indices, conf.grants[0]).titre);
  }

  /* ───────────── savoirs ───────────── */
  function viewSavoirs() {
    var page = h('div', { class: 'page' }, h('h2', { text: 'Savoirs' }), h('div', { class: 'sub', text: 'Les usages du temple et de l’époque. Ce sont des faits : tu peux t’appuyer dessus.' }));
    CASE.savoirs.forEach(function (sv, i) {
      var body = h('div', { class: i === 0 ? '' : 'hidden', text: sv.texte });
      var btn = h('button', { onclick: function () { body.classList.toggle('hidden'); sign.textContent = body.classList.contains('hidden') ? '＋' : '－'; } }, sv.titre);
      var sign = h('span', { text: i === 0 ? '－' : '＋' }); btn.appendChild(sign);
      page.appendChild(h('div', { class: 'acc' }, btn, body));
    });
    return page;
  }

  /* ───────────── pièces ───────────── */
  function viewPieces() {
    var page = h('div', { class: 'page' }, h('h2', { text: 'Pièces et témoignages' }),
      h('div', { class: 'sub', text: 'Tout ce que tu as trouvé, dans l’ordre de découverte. À toi de faire les liens, dans ton carnet.' }));
    if (!S.order.length) { page.appendChild(h('div', { class: 'empty', text: 'Rien pour l’instant. Va fouiller les scènes, ou interroge quelqu’un.' })); return page; }
    var grid = h('div', { class: 'pieces' });
    S.order.forEach(function (id) {
      var c = byId(CASE.indices, id);
      grid.appendChild(h('button', { class: 'piece', onclick: function () { showClue(id); } }, h('b', { text: c.titre }), h('small', { text: clueSource(c) }), h('span', { text: c.texte })));
    });
    page.appendChild(grid);
    return page;
  }

  /* ───────────── carnet ───────────── */
  var HEURES = [['J9', '9e heure du jour'], ['J10', '10e heure du jour'], ['J11', '11e heure du jour'], ['J12', '12e heure du jour'], null, ['N1', '1re heure de la nuit'], ['N2', '2e heure de la nuit'], ['N3', '3e heure de la nuit'], ['N4', '4e heure de la nuit'], ['N5', '5e heure de la nuit'], ['N6', '6e heure de la nuit']];
  function notebook() {
    var wrap = h('div', { style: 'display:flex;flex-direction:column;height:100%;min-height:0' });
    var tabs = h('div', { class: 'carnet-tabs' });
    [['notes', 'Notes'], ['chrono', 'Chronologie'], ['suspects', 'Suspects']].forEach(function (t) {
      tabs.appendChild(h('button', { class: UI.ntab === t[0] ? 'on' : '', text: t[1], onclick: function () { UI.ntab = t[0]; if (UI.view === 'carnet') renderMain(); else renderDrawer(); } }));
    });
    tabs.appendChild(h('span', { class: 'sp' }));
    var body = h('div', { class: 'carnet-body' });
    if (UI.ntab === 'notes') {
      var ta = h('textarea', { class: 'paper', placeholder: 'Ton carnet, à toi de le remplir : hypothèses, contradictions, questions…' });
      ta.value = S.notes;
      ta.addEventListener('input', function () { S.notes = ta.value; saveState(); });
      body.style.padding = '10px'; body.appendChild(ta);
    } else if (UI.ntab === 'chrono') {
      var cols = [{ id: 'ipy', nom: 'Ipy' }].concat(CASE.suspects);
      var tb = h('table', { class: 'grid' });
      var hr = h('tr', null, h('th', { class: 'rowh', text: 'Heure' }));
      cols.forEach(function (c) { hr.appendChild(h('th', { text: c.nom })); });
      tb.appendChild(h('thead', null, hr));
      var tbody = h('tbody');
      HEURES.forEach(function (hh, r) {
        if (!hh) { tbody.appendChild(h('tr', null, h('td', { class: 'sep', colspan: cols.length + 1, text: 'COUCHER DU SOLEIL · LA NUIT COMMENCE' }))); return; }
        var tr = h('tr', null, h('td', { class: 'rowh', title: hh[1], text: hh[0] }));
        cols.forEach(function (c, ci) {
          var key = r + ':' + ci, inp = h('select', { 'aria-label': c.nom + ' ' + hh[1] }, h('option', { value: '', text: '—' }));
          var grp = null, grpName = null;
          (CASE.lieux || []).forEach(function (l) {
            var o = h('option', { value: l.id, text: l.nom }); if (S.grid[key] === l.id) o.selected = true;
            if (l.g && l.g !== grpName) { grpName = l.g; grp = h('optgroup', { label: l.g }); inp.appendChild(grp); }
            if (!l.g) grp = null;
            (grp || inp).appendChild(o);
          });
          if (S.grid[key]) inp.classList.add('set');
          inp.addEventListener('change', function () { if (inp.value) S.grid[key] = inp.value; else delete S.grid[key]; inp.classList.toggle('set', !!inp.value); saveState(); });
          tr.appendChild(h('td', null, inp));
        });
        tbody.appendChild(tr);
      });
      tb.appendChild(tbody);
      body.appendChild(h('button', { class: 'btn small gold', style: 'margin:0 0 8px', text: '🗺️ Voir le plan du temple', onclick: showPlan }));
      body.appendChild(h('div', { style: 'font-size:.85rem;color:var(--ink2);margin:0 2px 8px', text: 'Où était chacun, à quelle heure ? Choisis un lieu dans chaque case que tu penses connaître.' }));
      body.appendChild(tb);
    } else {
      CASE.suspects.forEach(function (p) {
        var ta = h('textarea', { placeholder: 'Alibi, mobile, mensonges, doutes…' });
        ta.value = S.snotes[p.id] || '';
        ta.addEventListener('input', function () { S.snotes[p.id] = ta.value; saveState(); });
        body.appendChild(h('div', { class: 'snote' }, h('span', { html: CASE.portraits[p.id] }), h('div', null, h('b', { text: p.nom + ' · ' + p.titre }), ta)));
      });
    }
    wrap.append(tabs, body);
    return wrap;
  }

  /* ───────────── accusation ───────────── */
  function viewAccuse() {
    var d = S.draft = S.draft || {}; d.preuves = d.preuves || {};
    var A = CASE.accusation, page = h('div', { class: 'page accuse' });
    page.append(h('h2', { text: 'Porter l’accusation' }),
      h('div', { class: 'warn', html: '<b>Devant le vizir, il n’y a pas de retour en arrière.</b> Si tu accuses un innocent, sa vie est brisée. Si ton récit ne tient pas, le coupable repart libre.' }));
    page.appendChild(h('div', { class: 'acc-sec', text: '1 · Le coupable' }));
    var sg = h('div', { class: 'sus-grid' });
    CASE.suspects.forEach(function (p) {
      sg.appendChild(h('button', { class: 'sus' + (d.coupable === p.id ? ' on' : ''), onclick: function () { d.coupable = p.id; saveState(); renderMain(); } },
        h('span', { html: CASE.portraits[p.id] }), h('b', { text: p.nom }), h('small', { text: p.titre })));
    });
    page.appendChild(sg);
    page.appendChild(h('div', { class: 'acc-sec', text: '2 · Pourquoi : le mobile' }));
    A.mobiles.forEach(function (m) { page.appendChild(h('button', { class: 'opt' + (d.mobile === m.id ? ' on' : ''), text: m.label, onclick: function () { d.mobile = m.id; saveState(); renderMain(); } })); });
    page.appendChild(h('div', { class: 'acc-sec', text: '3 · Comment : la méthode' }));
    A.methodes.forEach(function (m) { page.appendChild(h('button', { class: 'opt' + (d.methode === m.id ? ' on' : ''), text: m.label, onclick: function () { d.methode = m.id; saveState(); renderMain(); } })); });
    page.appendChild(h('div', { class: 'acc-sec', text: '4 · Les trois preuves' }));
    if (!S.order.length) page.appendChild(h('div', { class: 'empty', text: 'Tu n’as encore aucune pièce à présenter.' }));
    A.emplacements.forEach(function (e) {
      var sel = h('select', { 'aria-label': e.label }, h('option', { value: '', text: '— choisir une pièce —' }));
      S.order.map(function (id) { return byId(CASE.indices, id); }).sort(function (a, b) { return a.titre.localeCompare(b.titre, 'fr'); }).forEach(function (c) {
        var o = h('option', { value: c.id, text: c.titre }); if (d.preuves[e.id] === c.id) o.selected = true; sel.appendChild(o);
      });
      sel.addEventListener('change', function () { d.preuves[e.id] = sel.value || null; saveState(); renderMain(); });
      page.appendChild(h('div', { class: 'proof' }, h('label', { text: e.label }), sel));
    });
    var vals = d.preuves, dup = A.emplacements.some(function (e, i) { return vals[e.id] && A.emplacements.some(function (f, j) { return i !== j && vals[f.id] === vals[e.id]; }); });
    var complete = d.coupable && d.mobile && d.methode && A.emplacements.every(function (e) { return vals[e.id]; }) && !dup;
    if (dup) page.appendChild(h('div', { class: 'empty', text: 'Une même pièce ne peut pas servir deux fois.' }));
    page.appendChild(h('div', { style: 'margin-top:18px;text-align:center' },
      h('button', { class: 'btn red', disabled: complete ? null : true, text: '⚖️ Accuser devant le vizir', onclick: function () {
        confirmBox('Accuser ' + person(d.coupable).nom + ' ?', 'C’est définitif. Le vizir rendra son verdict sur-le-champ.', 'Oui, j’accuse', judge, true);
      } })));
    return page;
  }
  function judge() {
    var d = S.draft, r = Core.evaluer(CASE, { coupable: d.coupable, mobile: d.mobile, methode: d.methode, preuves: d.preuves }, S.found);
    S.status = r.issue; S.fin = r.fin; S.attempts = (S.attempts || 0) + 1;
    var cm = caseMeta(CASE.id); cm.attempts = S.attempts; cm.status = r.issue === 'victoire' ? 'victoire' : (cm.status === 'victoire' ? 'victoire' : r.issue);
    saveMeta(); saveStateNow();
    UI.view = 'accuser'; renderTop(); renderNav(); renderMain(); window.scrollTo(0, 0);
  }
  function viewFin() {
    var f = S.fin || { titre: '', texte: '' }, win = S.status === 'victoire';
    var page = h('div', { class: 'page' }), el = h('div', { class: 'fin' });
    el.append(h('div', { class: 'banner ' + S.status }, h('small', { text: win ? 'Affaire résolue' : (S.status === 'ruine' ? 'Une vie brisée' : 'Affaire classée') }), h('h2', { text: f.titre })));
    var txt = h('div', { class: 'txt' });
    String(f.texte).split(/\n\n+/).forEach(function (p) { txt.appendChild(h('p', { text: p })); });
    el.appendChild(txt);
    el.appendChild(h('div', { class: 'stats' },
      h('span', { class: 'chip', text: 'Tentative n° ' + S.attempts }),
      h('span', { class: 'chip', text: S.replay ? 'Rejeu sans indice' : S.hints + ' indice' + (S.hints > 1 ? 's' : '') + ' utilisé' + (S.hints > 1 ? 's' : '') }),
      h('span', { class: 'chip', text: count(S.found) + ' pièces trouvées' })));
    var btns = h('div', { class: 'btns' });
    if (!win) btns.appendChild(h('button', { class: 'btn gold', text: '↻ Rejouer sans indice', onclick: function () { restart(true); } }));
    btns.appendChild(h('button', { class: 'btn', text: 'Accueil', onclick: goHome }));
    btns.appendChild(h('button', { class: 'btn ghost', text: 'Signaler une incohérence', onclick: showReport }));
    el.appendChild(btns);
    page.appendChild(el);
    return page;
  }
  function restart(replay) {
    var cm = caseMeta(CASE.id), att = S.attempts;
    S = newState(CASE.id); S.attempts = att; S.replay = !!replay;
    cm.status = 'none'; saveMeta(); saveStateNow();
    UI.view = 'dossier'; UI.scene = CASE.scenes[0].id; UI.person = null; UI.drawer = false; UI.full = false;
    renderShell();
  }

  /* ───────────── menus & fenêtres ───────────── */
  function showMenu() {
    openModal(function (s) {
      s.appendChild(h('h3', { text: 'Menu' }));
      var b = function (t, f, cls) { return h('button', { class: 'btn ' + (cls || 'ghost'), style: 'width:100%;margin-top:8px', text: t, onclick: function () { closeModal(); f(); } }); };
      s.append(b('Signaler une incohérence', showReport), b('Réglages', showSettings),
        b('Recommencer l’enquête', function () { confirmBox('Tout recommencer ?', 'Ta progression, tes notes et tes indices seront effacés.', 'Recommencer', function () { restart(S.replay); }, true); }),
        b('Retour à l’accueil', goHome),
        h('div', { class: 'btns' }, h('button', { class: 'btn gold', text: 'Fermer', onclick: closeModal })));
    });
  }
  function showPlan() {
    openModal(function (s) {
      s.classList.add('plan');
      s.append(h('h3', { text: 'Plan du temple de Ptah' }), h('div', { class: 'planbox', html: CASE.plan }),
        h('div', { class: 'btns' }, h('button', { class: 'btn gold', text: 'Fermer', onclick: closeModal })));
    });
  }
  function showHints() {
    openModal(function (s) {
      s.append(h('h3', { text: 'Indices' }), h('div', { class: 'src', text: 'Chaque indice utilisé sera compté à la fin.' }));
      if (!S.hints) s.appendChild(h('p', { text: 'Tu n’as pas encore demandé d’indice.' }));
      for (var i = 0; i < S.hints; i++) s.appendChild(h('div', { class: 'rep', text: (i + 1) + '. ' + CASE.aides[i] }));
      var b = h('div', { class: 'btns' });
      if (S.hints < CASE.aides.length) b.appendChild(h('button', { class: 'btn gold', text: 'Révéler l’indice ' + (S.hints + 1), onclick: function () { S.hints++; saveStateNow(); renderTop(); showHints(); } }));
      b.appendChild(h('button', { class: 'btn ghost', text: 'Fermer', onclick: closeModal }));
      s.appendChild(b);
    });
  }
  function reportText(msg) {
    var lines = ['VERDICT — signalement d’incohérence', 'Version de l’appli : ' + APP_VERSION];
    if (CASE && S) {
      lines.push('Affaire : ' + CASE.titre + ' (v' + CASE.version + ')');
      lines.push('Écran : ' + UI.view + (UI.view === 'scenes' ? ' / ' + UI.scene : '') + (UI.view === 'interroger' && UI.person ? ' / ' + UI.person : ''));
      lines.push('Pièces trouvées : ' + (S.order.join(', ') || 'aucune'));
      lines.push('Sujets abordés : ' + (Object.keys(S.asked).join(', ') || 'aucun'));
    }
    lines.push('', 'Message : ' + (msg || ''));
    return lines.join('\n');
  }
  function showReport() {
    openModal(function (s) {
      var ta = h('textarea', { placeholder: 'Qu’est-ce qui te paraît incohérent, injuste ou impossible à déduire ?' });
      s.append(h('h3', { text: 'Signaler une incohérence' }), h('div', { class: 'src', text: 'Dis-moi ce qui cloche. Le rapport inclut où tu en es.' }), ta);
      var list = h('div');
      (META.reports || []).slice(-3).reverse().forEach(function (r) { list.appendChild(h('div', { class: 'rep', text: r.text })); });
      var copy = function (txt) {
        var done = function () { toast('Rapport copié. Colle-le dans la conversation.'); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, function () { fallback(txt); done(); });
        else { fallback(txt); done(); }
      };
      function fallback(txt) { var t = h('textarea', { style: 'position:fixed;opacity:0' }); t.value = txt; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch (e) { /* rien */ } t.remove(); }
      s.append(h('div', { class: 'btns' },
        h('button', { class: 'btn ghost', text: 'Fermer', onclick: closeModal }),
        h('button', { class: 'btn gold', text: 'Copier le rapport', onclick: function () {
          var txt = reportText(ta.value.trim()); META.reports = (META.reports || []).concat([{ t: Date.now(), text: txt }]).slice(-30); saveMeta(); copy(txt); closeModal(); } })));
      if (list.childNodes.length) s.append(h('div', { class: 'acc-sec', text: 'Derniers rapports' }), list);
    });
  }
  function showSettings() {
    openModal(function (s) {
      var sw = function (label, key) {
        var el = h('button', { class: 'sw' + (META.settings[key] ? ' on' : ''), 'aria-label': label, onclick: function () { META.settings[key] = !META.settings[key]; saveMeta(); applySettings(); el.classList.toggle('on', !!META.settings[key]); if (CASE) renderMain(); } });
        return h('div', { class: 'setrow' }, h('span', { text: label }), el);
      };
      s.append(h('h3', { text: 'Réglages' }), sw('Montrer les zones cliquables', 'zones'),
        h('div', { class: 'setrow' }, h('span', { text: 'Taille du texte' }), h('span', null,
          [15, 17, 19, 21].map(function (n, i) { return h('button', { class: 'btn small ' + (META.settings.size === n ? 'gold' : 'ghost'), style: 'margin-left:6px', text: ['A−', 'A', 'A+', 'A++'][i], onclick: function () { META.settings.size = n; saveMeta(); applySettings(); closeModal(); showSettings(); } }); }))),
        h('div', { class: 'setrow' }, h('span', { text: 'Version ' + APP_VERSION }),
          h('button', { class: 'btn small ghost', text: 'Mettre à jour', onclick: forceUpdate })),
        h('div', { class: 'setrow' }, h('span', { text: 'Effacer toutes mes données' }),
          h('button', { class: 'btn small red', text: 'Effacer', onclick: function () { closeModal(); confirmBox('Tout effacer ?', 'Toutes tes enquêtes, notes et réglages seront supprimés de cet appareil.', 'Tout effacer', wipe, true); } })),
        h('div', { class: 'btns' }, h('button', { class: 'btn gold', text: 'Fermer', onclick: closeModal })));
    });
  }
  function wipe() {
    try { Object.keys(localStorage).forEach(function (k) { if (k.indexOf(LS) === 0) localStorage.removeItem(k); }); } catch (e) { /* rien */ }
    META = { settings: { zones: true, size: 17 }, cases: {}, reports: [] }; applySettings(); goHome();
  }
  function forceUpdate() {
    var p = [];
    if (window.caches) p.push(caches.keys().then(function (ks) { return Promise.all(ks.map(function (k) { return caches.delete(k); })); }));
    if (navigator.serviceWorker) p.push(navigator.serviceWorker.getRegistrations().then(function (rs) { return Promise.all(rs.map(function (r) { return r.unregister(); })); }));
    Promise.all(p).then(function () { location.reload(); }, function () { location.reload(); });
  }

  /* ───────────── démarrage ───────────── */
  applySettings();
  renderHome();
  if ('serviceWorker' in navigator && /^https?:/.test(location.protocol)) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () { /* hors-ligne indisponible */ }); });
  }
  window.__verdict = { get S() { return S; }, get CASE() { return CASE; }, UI: UI, openCase: openCase, SEASONS: SEASONS };
})();
