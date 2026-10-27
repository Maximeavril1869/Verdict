/* Verdict — petite boîte à outils de dessin SVG (style fresque égyptienne, aplats).
   Utilisable dans le navigateur (window.VArt) et dans Node (require). */
(function (root) {
  'use strict';

  var C = {
    sand: '#f0e2bf', sand2: '#d9bf8c', sand3: '#b89560',
    brick: '#c79b62', brick2: '#a67c47', brick3: '#8a6236',
    lapis: '#1f4e8c', turq: '#2f9e94', gold: '#d4a017', red: '#b5443a',
    ink: '#2b2118', linen: '#f7f1e1', pap: '#e8d9a0', clay: '#b5683c',
    clay2: '#8f4f2b', green: '#5b8a4a', night: '#14213d', water: '#4fa6b8',
    skin: '#b97a4b', skin2: '#9c6238', skin3: '#d19a6a'
  };

  function R(x, y, w, h, fill, extra) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + fill + '" ' + (extra || 'class="o"') + '/>';
  }
  function E(cx, cy, rx, ry, fill, extra) {
    return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + fill + '" ' + (extra || 'class="o"') + '/>';
  }
  function Pth(d, fill, extra) {
    return '<path d="' + d + '" fill="' + fill + '" ' + (extra || 'class="o"') + '/>';
  }
  function L(x1, y1, x2, y2, stroke, w) {
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (stroke || C.ink) + '" stroke-width="' + (w || 2) + '" stroke-linecap="round"/>';
  }
  function T(x, y, txt, size, fill, anchor) {
    return '<text x="' + x + '" y="' + y + '" font-size="' + (size || 14) + '" fill="' + (fill || C.ink) +
      '" text-anchor="' + (anchor || 'middle') + '" font-family="Georgia,serif" font-style="italic">' + txt + '</text>';
  }
  function G(inner, attrs) { return '<g ' + (attrs || '') + '>' + inner + '</g>'; }

  /* zone cliquable : hit = [x, y, w, h] */
  function hot(id, inner, hit) {
    return '<g class="hot" data-hot="' + id + '" tabindex="0" role="button" aria-label="' + id + '">' +
      inner +
      '<rect class="hit" x="' + hit[0] + '" y="' + hit[1] + '" width="' + hit[2] + '" height="' + hit[3] + '" rx="10"/>' +
      '</g>';
  }

  function defs() {
    return '<defs>' +
      '<radialGradient id="vig" cx="50%" cy="48%" r="70%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#1a0f05" stop-opacity=".45"/></radialGradient>' +
      '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4c77d"/><stop offset="1" stop-color="#f7e3b4"/></linearGradient>' +
      '<linearGradient id="night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14213d"/><stop offset="1" stop-color="#3a3b5e"/></linearGradient>' +
      '</defs>';
  }
  function vignette() { return '<rect x="0" y="0" width="960" height="600" fill="url(#vig)" pointer-events="none"/>'; }

  /* --- décors --- */
  function room(o) {
    o = o || {};
    var wall = o.wall || C.brick, s = '';
    s += R(0, 0, 960, 600, C.sand3, 'stroke="none"');
    s += R(0, 0, 960, 412, wall, 'stroke="none"');
    for (var y = 74; y < 410; y += 38) s += L(0, y, 960, y, C.brick2, 1.5).replace('stroke-linecap', 'opacity=".45" stroke-linecap');
    s += R(0, 0, 960, 36, C.lapis, 'stroke="none"');
    for (var x = 0; x < 960; x += 32) s += R(x + 5, 8, 22, 20, (x / 32) % 2 ? C.gold : C.turq, 'stroke="none"');
    s += R(0, 36, 960, 5, C.ink, 'stroke="none" opacity=".5"');
    s += Pth('M0 412 L960 412 L960 600 L0 600 Z', C.sand2, 'stroke="none"');
    for (var i = 1; i < 8; i++) s += L(0, 412 + i * 26, 960, 412 + i * 26, C.sand3, 1.5).replace('stroke-linecap', 'opacity=".55" stroke-linecap');
    s += R(0, 404, 960, 12, C.brick2, 'stroke="none"');
    return s;
  }
  function outdoor(o) {
    o = o || {};
    var s = '';
    s += R(0, 0, 960, 600, o.night ? 'url(#night)' : 'url(#sky)', 'stroke="none"');
    if (o.night) {
      for (var i = 0; i < 26; i++) s += '<circle cx="' + ((i * 197) % 940 + 10) + '" cy="' + ((i * 83) % 200 + 12) + '" r="1.6" fill="#f5e9b8" opacity=".8"/>';
      s += '<circle cx="840" cy="70" r="26" fill="#f4ecc8" opacity=".95"/>';
    } else {
      s += '<circle cx="820" cy="78" r="38" fill="#f08a3c" opacity=".85"/>';
    }
    s += Pth('M0 330 L960 330 L960 600 L0 600 Z', o.ground || C.sand2, 'stroke="none"');
    s += R(0, 326, 960, 8, C.sand3, 'stroke="none"');
    return s;
  }

  /* --- éléments --- */
  function column(x, y, h, w) {
    w = w || 46;
    var s = '';
    s += R(x, y + 14, w, h - 14, C.sand, '');
    for (var i = 1; i < 4; i++) s += L(x + (w / 4) * i, y + 16, x + (w / 4) * i, y + h - 4, C.sand3, 2);
    s += R(x - 8, y, w + 16, 16, C.sand2, '');
    s += R(x - 6, y + h - 8, w + 12, 12, C.sand2, '');
    return s;
  }
  function door(x, y, w, h, o) {
    o = o || {};
    var s = '';
    s += R(x - 14, y - 16, w + 28, h + 16, C.brick3, '');
    s += R(x, y, w, h, o.open ? C.ink : C.clay2, '');
    if (!o.open) {
      for (var i = 1; i < 5; i++) s += L(x + (w / 5) * i, y + 6, x + (w / 5) * i, y + h - 6, C.ink, 1.5).replace('stroke-linecap', 'opacity=".5" stroke-linecap');
      s += R(x + w / 2 - 3, y + h * 0.5, 6, 34, C.gold, '');
    }
    if (o.seal) {
      s += Pth('M' + (x + w / 2 - 22) + ' ' + (y + h * 0.5 + 8) + ' q22 -16 44 0', 'none', 'stroke="' + C.sand + '" stroke-width="5" stroke-linecap="round"');
      s += E(x + w / 2, y + h * 0.5 + 22, 16, 13, C.clay, 'class="o"');
      s += Pth('M' + (x + w / 2 - 6) + ' ' + (y + h * 0.5 + 28) + ' l3 -12 l4 4 l4 -4 l3 12 z', C.ink, 'stroke="none"');
    }
    return s;
  }
  function slit(x, y, w, h) {
    var s = R(x - 8, y - 8, w + 16, h + 16, C.brick3, '');
    s += R(x, y, w, h, '#0e0a06', '');
    for (var i = 1; i < 4; i++) s += L(x + (w / 4) * i, y, x + (w / 4) * i, y + h, C.sand3, 3);
    s += L(x, y + h / 2, x + w, y + h / 2, C.sand3, 3);
    return s;
  }
  function table(x, y, w, h) {
    var s = '';
    s += R(x + 8, y + 16, 10, h - 16, C.brick3, '');
    s += R(x + w - 18, y + 16, 10, h - 16, C.brick3, '');
    s += R(x, y, w, 18, C.brick2, '');
    return s;
  }
  function jar(x, y, k, mark, fill) {
    k = k || 1;
    var f = fill || C.clay, s = '';
    s += G(
      Pth('M-16 -34 Q-30 -10 -22 26 Q-14 40 0 40 Q14 40 22 26 Q30 -10 16 -34 Z', f, 'class="o"') +
      R(-13, -46, 26, 14, C.clay2, '') +
      R(-15, -50, 30, 8, C.sand2, '') +
      (mark === 'palette' ? R(-9, -6, 18, 6, C.ink, 'stroke="none"') + R(-6, 2, 4, 4, C.red, 'stroke="none"') + R(2, 2, 4, 4, C.ink, 'stroke="none"') : '') +
      (mark === 'ear' ? Pth('M0 -8 L0 20 M0 0 l-8 -6 M0 0 l8 -6 M0 8 l-8 -6 M0 8 l8 -6 M0 16 l-8 -6 M0 16 l8 -6', 'none', 'stroke="' + C.ink + '" stroke-width="2" stroke-linecap="round"') : '') +
      (mark === 'pure' ? E(0, 4, 6, 6, 'none', 'stroke="' + C.lapis + '" stroke-width="3"') : ''),
      'transform="translate(' + x + ' ' + y + ') scale(' + k + ')"');
    return s;
  }
  function jarSealed(x, y, k, mark, fill) {
    return jar(x, y, k, mark, fill);
  }
  function lamp(x, y) {
    return E(x, y, 16, 7, C.sand2, '') + Pth('M' + (x - 8) + ' ' + (y - 4) + ' q8 -22 16 0', C.gold, 'class="o"') +
      Pth('M' + x + ' ' + (y - 12) + ' q-6 -14 0 -24 q6 10 0 24', '#f26b21', 'stroke="none"');
  }
  function scroll(x, y, w, h, col) {
    return R(x, y, w, h, col || C.pap, '') + R(x - 4, y - 2, 8, h + 4, C.sand3, '') + R(x + w - 4, y - 2, 8, h + 4, C.sand3, '') +
      L(x + 12, y + h * 0.3, x + w - 12, y + h * 0.3, C.ink, 1.5) + L(x + 12, y + h * 0.55, x + w - 12, y + h * 0.55, C.ink, 1.5) +
      L(x + 12, y + h * 0.8, x + w - 28, y + h * 0.8, C.ink, 1.5);
  }
  function tablet(x, y, w, h, lines) {
    var s = R(x, y, w, h, C.sand, '') + R(x + 4, y + 4, w - 8, h - 8, '#c8b27a', 'stroke="none"');
    var n = lines || 4;
    for (var i = 0; i < n; i++) s += L(x + 12, y + 16 + i * ((h - 28) / n), x + w - 12 - (i % 2) * 18, y + 16 + i * ((h - 28) / n), C.ink, 1.6);
    return s;
  }
  function bread(x, y) { return E(x, y, 18, 8, '#d9a35a', '') + Pth('M' + (x - 8) + ' ' + y + ' q8 -4 16 0', 'none', 'stroke="' + C.brick3 + '" stroke-width="2"'); }
  function cup(x, y) { return Pth('M' + (x - 11) + ' ' + (y - 12) + ' L' + (x + 11) + ' ' + (y - 12) + ' L' + (x + 8) + ' ' + (y + 6) + ' L' + (x - 8) + ' ' + (y + 6) + ' Z', C.turq, 'class="o"'); }
  function mat(x, y, w, h, col) {
    var s = R(x, y, w, h, col || C.sand, '');
    for (var i = 1; i < 8; i++) s += L(x + (w / 8) * i, y + 2, x + (w / 8) * i, y + h - 2, C.sand3, 1.4);
    return s;
  }
  function body(x, y) { // personne allongée vue de dessus
    var s = '';
    s += Pth('M' + x + ' ' + y + ' q60 -34 150 -10 q50 14 80 6 l0 38 q-40 6 -86 -4 q-80 24 -144 -8 z', C.linen, 'class="o"');
    s += E(x - 8, y + 8, 22, 20, C.skin, '');
    s += Pth('M' + (x - 26) + ' ' + (y + 4) + ' q18 -22 36 -2 l0 8 q-18 -14 -36 0 z', C.ink, 'stroke="none"');
    s += Pth('M' + (x + 236) + ' ' + (y - 4) + ' l22 -2 l2 12 l-24 4 z', C.skin2, '');
    s += E(x - 4, y + 12, 3, 2, C.ink, 'stroke="none"'); // œil
    s += Pth('M' + (x - 12) + ' ' + (y + 22) + ' q-10 18 8 24 q18 2 22 -10 q-14 6 -30 -14', '#c9b24a', 'class="o" opacity=".9"'); // vomi
    return s;
  }
  function shelf(x, y, w, rows, cols, withJars) {
    var s = '', i, j;
    s += R(x, y, w, rows * 80 + 14, C.brick3, '');
    for (i = 0; i < rows; i++) {
      s += R(x + 6, y + 6 + i * 80, w - 12, 68, '#3a2a18', 'stroke="none"');
      s += R(x + 6, y + 70 + i * 80, w - 12, 8, C.brick2, '');
      if (withJars) for (j = 0; j < cols; j++) s += jar(x + 40 + j * ((w - 70) / Math.max(1, cols - 1 || 1)), y + 44 + i * 80, 0.8, j === 2 && i === 1 ? 'palette' : (i % 2 ? 'ear' : 'none'));
    }
    return s;
  }
  function pigeonholes(x, y, w, h) {
    var s = R(x, y, w, h, C.brick3, ''), i, j, cw = w / 4, ch = h / 4;
    for (i = 0; i < 4; i++) for (j = 0; j < 4; j++) {
      s += R(x + 5 + j * cw, y + 5 + i * ch, cw - 10, ch - 10, '#33240f', 'stroke="none"');
      s += R(x + 12 + j * cw, y + 14 + i * ch, cw - 24, 14, (i + j) % 2 ? C.pap : C.sand, 'stroke="' + C.ink + '" stroke-width="1.2"');
    }
    return s;
  }
  function hook(x, y) { return Pth('M' + x + ' ' + y + ' l0 14 q0 10 10 8', 'none', 'stroke="' + C.ink + '" stroke-width="4" stroke-linecap="round"'); }
  function stamp(x, y) { return R(x - 8, y, 16, 20, C.gold, '') + R(x - 4, y - 14, 8, 14, C.brick3, '') + Pth('M' + (x - 5) + ' ' + (y + 16) + ' l5 -10 l5 10 z', C.ink, 'stroke="none"'); }
  function claypot(x, y) { return Pth('M' + (x - 22) + ' ' + y + ' L' + (x + 22) + ' ' + y + ' L' + (x + 16) + ' ' + (y + 26) + ' L' + (x - 16) + ' ' + (y + 26) + ' Z', C.clay, 'class="o"') + E(x, y, 22, 6, '#7a4a2a', ''); }
  function sandals(x, y) { return Pth('M' + x + ' ' + y + ' q14 -8 26 0 l-4 18 q-10 6 -20 0 z', C.sand, 'class="o"') + Pth('M' + (x + 36) + ' ' + (y + 2) + ' q14 -8 26 0 l-4 18 q-10 6 -20 0 z', C.sand, 'class="o"'); }
  function ribbon(x, y) { return Pth('M' + x + ' ' + y + ' q20 -16 40 0 q-10 14 -40 0', C.lapis, 'class="o"') + E(x + 44, y + 4, 8, 8, C.gold, ''); }
  function petal(x, y, r) { return Pth('M' + x + ' ' + y + ' q' + (8 * (r || 1)) + ' -16 ' + (16 * (r || 1)) + ' 0 q-' + (8 * (r || 1)) + ' 10 -' + (16 * (r || 1)) + ' 0', '#7fb6e8', 'class="o"'); }
  function palm(x, y, h) {
    var s = Pth('M' + (x - 6) + ' ' + y + ' Q' + (x + 4) + ' ' + (y - h / 2) + ' ' + (x - 2) + ' ' + (y - h) + ' L' + (x + 8) + ' ' + (y - h) + ' Q' + (x + 12) + ' ' + (y - h / 2) + ' ' + (x + 8) + ' ' + y + ' Z', C.brick2, 'class="o"');
    for (var i = 0; i < 6; i++) {
      var a = -150 + i * 56, dx = Math.cos(a * Math.PI / 180) * 70, dy = Math.sin(a * Math.PI / 180) * 38;
      s += Pth('M' + (x + 3) + ' ' + (y - h) + ' q' + (dx / 2) + ' ' + (dy - 20) + ' ' + dx + ' ' + dy, 'none', 'stroke="' + C.green + '" stroke-width="7" stroke-linecap="round"');
    }
    return s;
  }
  function pool(x, y, w, h) {
    var s = E(x + w / 2, y + h / 2, w / 2 + 8, h / 2 + 8, C.sand3, 'class="o"') + E(x + w / 2, y + h / 2, w / 2, h / 2, C.water, 'class="o"');
    s += Pth('M' + (x + w * 0.22) + ' ' + (y + h * 0.5) + ' q12 -8 24 0', 'none', 'stroke="#fff" stroke-width="2" opacity=".7" stroke-linecap="round"');
    s += Pth('M' + (x + w * 0.58) + ' ' + (y + h * 0.65) + ' q12 -8 24 0', 'none', 'stroke="#fff" stroke-width="2" opacity=".7" stroke-linecap="round"');
    return s;
  }
  function garland(x, y, w) {
    var s = Pth('M' + x + ' ' + y + ' q' + (w / 2) + ' 40 ' + w + ' 0', 'none', 'stroke="' + C.green + '" stroke-width="6" stroke-linecap="round"'), i;
    for (i = 0; i < 6; i++) {
      var t = (i + 0.5) / 6, px = x + w * t, py = y + 40 * 2 * t * (1 - t) * 1.0;
      s += (i % 2) ? E(px, py + 8, 8, 8, '#e0b030', 'class="o"') : petal(px - 8, py + 8, 1);
    }
    return s;
  }
  function pupil(x, y, col) {
    return E(x, y - 14, 7, 7, C.skin3, '') + R(x - 8, y - 8, 16, 18, col || C.linen, '') + R(x - 10, y + 10, 20, 4, C.sand3, 'stroke="none"');
  }
  function stool(x, y) { return R(x, y, 56, 14, C.brick2, '') + R(x + 6, y + 14, 8, 24, C.brick3, '') + R(x + 42, y + 14, 8, 24, C.brick3, ''); }
  function hut(x, y, w, h) {
    return Pth('M' + x + ' ' + (y + h) + ' L' + x + ' ' + (y + 26) + ' L' + (x + w / 2) + ' ' + y + ' L' + (x + w) + ' ' + (y + 26) + ' L' + (x + w) + ' ' + (y + h) + ' Z', C.brick, 'class="o"') +
      R(x + w / 2 - 22, y + h - 56, 44, 56, '#1a1008', '');
  }
  function pylon(x, y, w, h) {
    return Pth('M' + x + ' ' + (y + h) + ' L' + (x + 10) + ' ' + y + ' L' + (x + w - 10) + ' ' + y + ' L' + (x + w) + ' ' + (y + h) + ' Z', C.sand2, 'class="o"') +
      R(x + 6, y + 14, w - 12, 8, C.lapis, 'stroke="none"') + R(x + w / 2 - 3, y + 40, 6, h - 60, C.sand3, 'stroke="none"');
  }
  function building(x, y, w, h, roof) {
    return R(x, y, w, h, C.sand, '') + R(x - 8, y - 14, w + 16, 16, roof || C.lapis, '') +
      R(x + w / 2 - 18, y + h - 54, 36, 54, '#1a1008', '') + R(x + 14, y + 20, 22, 22, '#1a1008', 'class="o"') + R(x + w - 36, y + 20, 22, 22, '#1a1008', 'class="o"');
  }

  /* --- portraits (buste) --- */
  function portrait(p) {
    p = p || {};
    var skin = p.skin || C.skin, s = '';
    var bg = p.bg || C.sand2;
    s += '<rect width="120" height="120" rx="14" fill="' + bg + '"/>';
    // cou + épaules
    s += Pth('M36 120 L36 98 Q36 88 48 86 L72 86 Q84 88 84 98 L84 120 Z', p.robe || C.linen, 'stroke="' + C.ink + '" stroke-width="2.5"');
    s += R(52, 76, 16, 14, skin, 'stroke="' + C.ink + '" stroke-width="2.5"');
    if (p.collier) s += Pth('M40 92 Q60 108 80 92 L76 88 Q60 100 44 88 Z', p.collier, 'stroke="' + C.ink + '" stroke-width="2"');
    // tête
    s += E(60, 52, 22, 26, skin, 'stroke="' + C.ink + '" stroke-width="2.5"');
    // coiffure
    if (p.coiffure === 'perruque') {
      s += Pth('M34 56 Q30 22 60 20 Q90 22 86 56 L86 90 L76 90 L76 56 Q76 38 60 36 Q44 38 44 56 L44 90 L34 90 Z', p.cheveux || C.ink, 'stroke="' + C.ink + '" stroke-width="2.5"');
    } else if (p.coiffure === 'courte') {
      s += Pth('M36 50 Q36 24 60 24 Q84 24 84 50 Q80 36 60 36 Q40 36 36 50 Z', p.cheveux || C.ink, 'stroke="' + C.ink + '" stroke-width="2.5"');
    } else if (p.coiffure === 'chauve') {
      s += Pth('M40 40 Q60 28 80 40', 'none', 'stroke="' + C.ink + '" stroke-width="1.5" opacity=".35"');
    } else if (p.coiffure === 'casque') {
      s += Pth('M36 54 Q34 24 60 22 Q86 24 84 54 L84 44 Q80 34 60 34 Q40 34 36 44 Z', p.cheveux || '#3a3a3a', 'stroke="' + C.ink + '" stroke-width="2.5"');
      s += R(36, 40, 48, 8, p.bandeau || C.red, 'stroke="' + C.ink + '" stroke-width="2"');
    } else if (p.coiffure === 'enfant') {
      s += Pth('M40 36 Q60 26 80 36 Q74 32 60 32 Q46 32 40 36 Z', p.cheveux || C.ink, 'stroke="' + C.ink + '" stroke-width="2.5"');
      s += Pth('M82 44 Q92 52 88 70', 'none', 'stroke="' + C.ink + '" stroke-width="5" stroke-linecap="round"');
    } else if (p.coiffure === 'blanche') {
      s += Pth('M36 52 Q34 24 60 22 Q86 24 84 52 Q80 36 60 36 Q40 36 36 52 Z', '#e6e0d0', 'stroke="' + C.ink + '" stroke-width="2.5"');
    }
    if (p.bandeau && p.coiffure === 'perruque') s += R(36, 36, 48, 7, p.bandeau, 'stroke="' + C.ink + '" stroke-width="2"');
    if (p.cone) s += Pth('M50 24 L60 6 L70 24 Z', '#f3ead0', 'stroke="' + C.ink + '" stroke-width="2"');
    // visage
    s += Pth('M46 50 q6 -4 12 0', 'none', 'stroke="' + C.ink + '" stroke-width="2.5" stroke-linecap="round"');
    s += Pth('M62 50 q6 -4 12 0', 'none', 'stroke="' + C.ink + '" stroke-width="2.5" stroke-linecap="round"');
    s += E(52, 55, 2.6, 2.2, C.ink, 'stroke="none"') + E(68, 55, 2.6, 2.2, C.ink, 'stroke="none"');
    s += Pth('M52 52 L40 50', 'none', 'stroke="' + C.ink + '" stroke-width="1.6"'); // khôl
    s += Pth('M68 52 L80 50', 'none', 'stroke="' + C.ink + '" stroke-width="1.6"');
    s += Pth('M58 60 L56 68 L62 68', 'none', 'stroke="' + C.ink + '" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"');
    s += Pth('M52 74 q8 ' + (p.sourire === false ? '-2' : '4') + ' 16 0', 'none', 'stroke="' + C.ink + '" stroke-width="2.2" stroke-linecap="round"');
    if (p.barbe) s += Pth('M46 72 Q60 96 74 72 Q60 84 46 72 Z', C.ink, 'stroke="none" opacity=".85"');
    if (p.rides) s += Pth('M46 44 q14 -6 28 0', 'none', 'stroke="' + C.ink + '" stroke-width="1.4" opacity=".5"');
    if (p.boucles) s += E(36, 62, 5, 6, 'none', 'stroke="' + C.gold + '" stroke-width="3"') + E(84, 62, 5, 6, 'none', 'stroke="' + C.gold + '" stroke-width="3"');
    return '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" class="art portrait">' + s + '</svg>';
  }

  /* --- icône d'accueil (ankh doré) --- */
  function wrapScene(inner) {
    return '<svg viewBox="0 0 960 600" xmlns="http://www.w3.org/2000/svg" class="art scene" preserveAspectRatio="xMidYMid meet">' + defs() + inner + vignette() + '</svg>';
  }

  var API = {
    C: C, R: R, E: E, Pth: Pth, L: L, T: T, G: G, hot: hot, defs: defs, vignette: vignette, wrapScene: wrapScene,
    room: room, outdoor: outdoor, column: column, door: door, slit: slit, table: table, jar: jar, jarSealed: jarSealed,
    lamp: lamp, scroll: scroll, tablet: tablet, bread: bread, cup: cup, mat: mat, body: body, shelf: shelf, pigeonholes: pigeonholes,
    hook: hook, stamp: stamp, claypot: claypot, sandals: sandals, ribbon: ribbon, petal: petal, palm: palm, pool: pool, garland: garland,
    pupil: pupil, stool: stool, hut: hut, pylon: pylon, building: building, portrait: portrait
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.VArt = API;
})(typeof window !== 'undefined' ? window : this);
