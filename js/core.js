/* Verdict — noyau logique (sans interface) : empreintes, scellage du texte final,
   règles de déblocage et évaluation de l'accusation. Utilisable dans Node et le navigateur. */
(function (root) {
  'use strict';

  /* ---------- SHA-256 (synchrone, sans dépendance) ---------- */
  var K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];
  function utf8(str) {
    var out = [], i, c;
    str = String(str);
    for (i = 0; i < str.length; i++) {
      c = str.charCodeAt(i);
      if (c >= 0xd800 && c < 0xdc00 && i + 1 < str.length) {
        c = 0x10000 + ((c - 0xd800) << 10) + (str.charCodeAt(++i) - 0xdc00);
      }
      if (c < 0x80) out.push(c);
      else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 63));
      else if (c < 0x10000) out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
      else out.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    }
    return out;
  }
  function fromUtf8(bytes) {
    var s = '', i = 0, c, c2, c3, c4;
    while (i < bytes.length) {
      c = bytes[i++];
      if (c < 0x80) s += String.fromCharCode(c);
      else if (c < 0xe0) { c2 = bytes[i++]; s += String.fromCharCode(((c & 31) << 6) | (c2 & 63)); }
      else if (c < 0xf0) { c2 = bytes[i++]; c3 = bytes[i++]; s += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)); }
      else {
        c2 = bytes[i++]; c3 = bytes[i++]; c4 = bytes[i++];
        var cp = ((c & 7) << 18) | ((c2 & 63) << 12) | ((c3 & 63) << 6) | (c4 & 63);
        cp -= 0x10000;
        s += String.fromCharCode(0xd800 + (cp >> 10), 0xdc00 + (cp & 1023));
      }
    }
    return s;
  }
  function rotr(x, n) { return (x >>> n) | (x << (32 - n)); }
  function sha256Bytes(bytes) {
    var h = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    var m = bytes.slice(), l = m.length * 8, i, j;
    m.push(0x80);
    while (m.length % 64 !== 56) m.push(0);
    var hi = Math.floor(l / 0x100000000), lo = l >>> 0;
    m.push((hi >>> 24) & 255, (hi >>> 16) & 255, (hi >>> 8) & 255, hi & 255, (lo >>> 24) & 255, (lo >>> 16) & 255, (lo >>> 8) & 255, lo & 255);
    var w = new Array(64);
    for (i = 0; i < m.length; i += 64) {
      for (j = 0; j < 16; j++) w[j] = (m[i + j * 4] << 24) | (m[i + j * 4 + 1] << 16) | (m[i + j * 4 + 2] << 8) | m[i + j * 4 + 3];
      for (j = 16; j < 64; j++) {
        var s0 = rotr(w[j - 15], 7) ^ rotr(w[j - 15], 18) ^ (w[j - 15] >>> 3);
        var s1 = rotr(w[j - 2], 17) ^ rotr(w[j - 2], 19) ^ (w[j - 2] >>> 10);
        w[j] = (w[j - 16] + s0 + w[j - 7] + s1) | 0;
      }
      var a = h[0], b = h[1], c = h[2], d = h[3], e = h[4], f = h[5], g = h[6], hh = h[7];
      for (j = 0; j < 64; j++) {
        var S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
        var ch = (e & f) ^ (~e & g);
        var t1 = (hh + S1 + ch + K[j] + w[j]) | 0;
        var S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
        var maj = (a & b) ^ (a & c) ^ (b & c);
        var t2 = (S0 + maj) | 0;
        hh = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
      }
      h[0] = (h[0] + a) | 0; h[1] = (h[1] + b) | 0; h[2] = (h[2] + c) | 0; h[3] = (h[3] + d) | 0;
      h[4] = (h[4] + e) | 0; h[5] = (h[5] + f) | 0; h[6] = (h[6] + g) | 0; h[7] = (h[7] + hh) | 0;
    }
    var out = [];
    for (i = 0; i < 8; i++) out.push((h[i] >>> 24) & 255, (h[i] >>> 16) & 255, (h[i] >>> 8) & 255, h[i] & 255);
    return out;
  }
  function hex(bytes) {
    var s = '', i;
    for (i = 0; i < bytes.length; i++) s += (bytes[i] < 16 ? '0' : '') + bytes[i].toString(16);
    return s;
  }
  function sha256(str) { return hex(sha256Bytes(utf8(str))); }

  /* ---------- base64 ---------- */
  var B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  function toB64(bytes) {
    var s = '', i, n;
    for (i = 0; i < bytes.length; i += 3) {
      n = (bytes[i] << 16) | ((bytes[i + 1] || 0) << 8) | (bytes[i + 2] || 0);
      s += B64[(n >> 18) & 63] + B64[(n >> 12) & 63] + (i + 1 < bytes.length ? B64[(n >> 6) & 63] : '=') + (i + 2 < bytes.length ? B64[n & 63] : '=');
    }
    return s;
  }
  function fromB64(str) {
    var out = [], i, n, c, bits = 0, acc = 0;
    for (i = 0; i < str.length; i++) {
      c = B64.indexOf(str[i]);
      if (c < 0) continue;
      acc = (acc << 6) | c; bits += 6;
      if (bits >= 8) { bits -= 8; out.push((acc >> bits) & 255); acc &= (1 << bits) - 1; }
    }
    return out;
  }

  /* ---------- scellage du texte final (obfuscation par flux dérivé de la clé) ---------- */
  function stream(key, len) {
    var out = [], i = 0;
    while (out.length < len) { out = out.concat(sha256Bytes(utf8(key + '|' + i))); i++; }
    return out.slice(0, len);
  }
  function seal(plain, key) {
    var b = utf8(plain), tag = sha256Bytes(b).slice(0, 4), ks = stream(key, b.length), x = [], i;
    for (i = 0; i < b.length; i++) x.push(b[i] ^ ks[i]);
    return toB64(tag.concat(x));
  }
  function unseal(b64, key) {
    var raw = fromB64(b64), tag = raw.slice(0, 4), x = raw.slice(4), ks = stream(key, x.length), b = [], i;
    for (i = 0; i < x.length; i++) b.push(x[i] ^ ks[i]);
    var chk = sha256Bytes(b).slice(0, 4);
    for (i = 0; i < 4; i++) if (chk[i] !== tag[i]) return null;
    return fromUtf8(b);
  }

  /* ---------- empreintes de la solution ---------- */
  function hCulprit(salt, c) { return sha256(salt + '|c|' + c); }
  function hAll(salt, c, m, me) { return sha256(salt + '|a|' + c + '|' + m + '|' + me); }
  function hProof(salt, slot, id) { return sha256(salt + '|p|' + slot + '|' + id); }

  /* ---------- règles de connaissance ---------- */
  // known : ensemble (objet {id:true}) d'indices trouvés et de sujets déjà abordés ("personne.sujet")
  function reqOk(req, known) {
    if (!req || !req.length) return true;
    for (var i = 0; i < req.length; i++) if (!known[req[i]]) return false;
    return true;
  }
  function sujetsDispo(data, personId, known) {
    var g = data.gens[personId];
    return g.sujets.filter(function (s) { return reqOk(s.requires, known); });
  }
  // Retourne la confrontation applicable (ou null). Le sujet visé, s'il existe, doit déjà avoir été abordé.
  function confrontation(data, personId, pieceId, known) {
    var g = data.gens[personId], i, c;
    for (i = 0; i < g.confrontations.length; i++) {
      c = g.confrontations[i];
      if (c.pieces.indexOf(pieceId) >= 0) return c;
    }
    return null;
  }

  /* ---------- évaluation de l'accusation ---------- */
  function evaluer(data, rep, found) {
    var sol = data.solution, salt = sol.salt;
    if (hCulprit(salt, rep.coupable) !== sol.hc) {
      return { issue: 'ruine', fin: data.accusation.fins[rep.coupable] || data.accusation.fins.insuffisant };
    }
    var ok = hAll(salt, rep.coupable, rep.mobile, rep.methode) === sol.hall;
    var slots = Object.keys(sol.preuves), i, p, used = {};
    for (i = 0; i < slots.length; i++) {
      p = rep.preuves && rep.preuves[slots[i]];
      if (!p || !found[p] || used[p] || sol.preuves[slots[i]].indexOf(hProof(salt, slots[i], p)) < 0) ok = false;
      if (p) used[p] = true;
    }
    if (!ok) return { issue: 'insuffisant', fin: data.accusation.fins.insuffisant };
    var txt = unseal(sol.epilogue, rep.coupable + '|' + rep.mobile + '|' + rep.methode);
    var fin = txt ? JSON.parse(txt) : { titre: 'Affaire résolue', texte: '' };
    return { issue: 'victoire', fin: fin };
  }

  var API = {
    sha256: sha256, seal: seal, unseal: unseal, hCulprit: hCulprit, hAll: hAll, hProof: hProof,
    reqOk: reqOk, sujetsDispo: sujetsDispo, confrontation: confrontation, evaluer: evaluer
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.VCore = API;
})(typeof window !== 'undefined' ? window : this);
