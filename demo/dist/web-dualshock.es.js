var Pt = Object.defineProperty;
var Ot = (c, n, h) => n in c ? Pt(c, n, { enumerable: !0, configurable: !0, writable: !0, value: h }) : c[n] = h;
var T = (c, n, h) => Ot(c, typeof n != "symbol" ? n + "" : n, h);
var Q = {}, H = {}, pt;
function $t() {
  if (pt) return H;
  pt = 1, H.byteLength = s, H.toByteArray = R, H.fromByteArray = A;
  for (var c = [], n = [], h = typeof Uint8Array < "u" ? Uint8Array : Array, f = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", l = 0, I = f.length; l < I; ++l)
    c[l] = f[l], n[f.charCodeAt(l)] = l;
  n[45] = 62, n[95] = 63;
  function d(p) {
    var y = p.length;
    if (y % 4 > 0)
      throw new Error("Invalid string. Length must be a multiple of 4");
    var g = p.indexOf("=");
    g === -1 && (g = y);
    var w = g === y ? 0 : 4 - g % 4;
    return [g, w];
  }
  function s(p) {
    var y = d(p), g = y[0], w = y[1];
    return (g + w) * 3 / 4 - w;
  }
  function B(p, y, g) {
    return (y + g) * 3 / 4 - g;
  }
  function R(p) {
    var y, g = d(p), w = g[0], E = g[1], U = new h(B(p, w, E)), k = 0, v = E > 0 ? w - 4 : w, S;
    for (S = 0; S < v; S += 4)
      y = n[p.charCodeAt(S)] << 18 | n[p.charCodeAt(S + 1)] << 12 | n[p.charCodeAt(S + 2)] << 6 | n[p.charCodeAt(S + 3)], U[k++] = y >> 16 & 255, U[k++] = y >> 8 & 255, U[k++] = y & 255;
    return E === 2 && (y = n[p.charCodeAt(S)] << 2 | n[p.charCodeAt(S + 1)] >> 4, U[k++] = y & 255), E === 1 && (y = n[p.charCodeAt(S)] << 10 | n[p.charCodeAt(S + 1)] << 4 | n[p.charCodeAt(S + 2)] >> 2, U[k++] = y >> 8 & 255, U[k++] = y & 255), U;
  }
  function b(p) {
    return c[p >> 18 & 63] + c[p >> 12 & 63] + c[p >> 6 & 63] + c[p & 63];
  }
  function m(p, y, g) {
    for (var w, E = [], U = y; U < g; U += 3)
      w = (p[U] << 16 & 16711680) + (p[U + 1] << 8 & 65280) + (p[U + 2] & 255), E.push(b(w));
    return E.join("");
  }
  function A(p) {
    for (var y, g = p.length, w = g % 3, E = [], U = 16383, k = 0, v = g - w; k < v; k += U)
      E.push(m(p, k, k + U > v ? v : k + U));
    return w === 1 ? (y = p[g - 1], E.push(
      c[y >> 2] + c[y << 4 & 63] + "=="
    )) : w === 2 && (y = (p[g - 2] << 8) + p[g - 1], E.push(
      c[y >> 10] + c[y >> 4 & 63] + c[y << 2 & 63] + "="
    )), E.join("");
  }
  return H;
}
var j = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
var dt;
function Gt() {
  return dt || (dt = 1, j.read = function(c, n, h, f, l) {
    var I, d, s = l * 8 - f - 1, B = (1 << s) - 1, R = B >> 1, b = -7, m = h ? l - 1 : 0, A = h ? -1 : 1, p = c[n + m];
    for (m += A, I = p & (1 << -b) - 1, p >>= -b, b += s; b > 0; I = I * 256 + c[n + m], m += A, b -= 8)
      ;
    for (d = I & (1 << -b) - 1, I >>= -b, b += f; b > 0; d = d * 256 + c[n + m], m += A, b -= 8)
      ;
    if (I === 0)
      I = 1 - R;
    else {
      if (I === B)
        return d ? NaN : (p ? -1 : 1) * (1 / 0);
      d = d + Math.pow(2, f), I = I - R;
    }
    return (p ? -1 : 1) * d * Math.pow(2, I - f);
  }, j.write = function(c, n, h, f, l, I) {
    var d, s, B, R = I * 8 - l - 1, b = (1 << R) - 1, m = b >> 1, A = l === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, p = f ? 0 : I - 1, y = f ? 1 : -1, g = n < 0 || n === 0 && 1 / n < 0 ? 1 : 0;
    for (n = Math.abs(n), isNaN(n) || n === 1 / 0 ? (s = isNaN(n) ? 1 : 0, d = b) : (d = Math.floor(Math.log(n) / Math.LN2), n * (B = Math.pow(2, -d)) < 1 && (d--, B *= 2), d + m >= 1 ? n += A / B : n += A * Math.pow(2, 1 - m), n * B >= 2 && (d++, B /= 2), d + m >= b ? (s = 0, d = b) : d + m >= 1 ? (s = (n * B - 1) * Math.pow(2, l), d = d + m) : (s = n * Math.pow(2, m - 1) * Math.pow(2, l), d = 0)); l >= 8; c[h + p] = s & 255, p += y, s /= 256, l -= 8)
      ;
    for (d = d << l | s, R += l; R > 0; c[h + p] = d & 255, p += y, d /= 256, R -= 8)
      ;
    c[h + p - y] |= g * 128;
  }), j;
}
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
var gt;
function Yt() {
  return gt || (gt = 1, function(c) {
    const n = $t(), h = Gt(), f = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
    c.Buffer = s, c.SlowBuffer = U, c.INSPECT_MAX_BYTES = 50;
    const l = 2147483647;
    c.kMaxLength = l, s.TYPED_ARRAY_SUPPORT = I(), !s.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
      "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
    );
    function I() {
      try {
        const r = new Uint8Array(1), t = { foo: function() {
          return 42;
        } };
        return Object.setPrototypeOf(t, Uint8Array.prototype), Object.setPrototypeOf(r, t), r.foo() === 42;
      } catch {
        return !1;
      }
    }
    Object.defineProperty(s.prototype, "parent", {
      enumerable: !0,
      get: function() {
        if (s.isBuffer(this))
          return this.buffer;
      }
    }), Object.defineProperty(s.prototype, "offset", {
      enumerable: !0,
      get: function() {
        if (s.isBuffer(this))
          return this.byteOffset;
      }
    });
    function d(r) {
      if (r > l)
        throw new RangeError('The value "' + r + '" is invalid for option "size"');
      const t = new Uint8Array(r);
      return Object.setPrototypeOf(t, s.prototype), t;
    }
    function s(r, t, e) {
      if (typeof r == "number") {
        if (typeof t == "string")
          throw new TypeError(
            'The "string" argument must be of type string. Received type number'
          );
        return m(r);
      }
      return B(r, t, e);
    }
    s.poolSize = 8192;
    function B(r, t, e) {
      if (typeof r == "string")
        return A(r, t);
      if (ArrayBuffer.isView(r))
        return y(r);
      if (r == null)
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof r
        );
      if (N(r, ArrayBuffer) || r && N(r.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (N(r, SharedArrayBuffer) || r && N(r.buffer, SharedArrayBuffer)))
        return g(r, t, e);
      if (typeof r == "number")
        throw new TypeError(
          'The "value" argument must not be of type number. Received type number'
        );
      const i = r.valueOf && r.valueOf();
      if (i != null && i !== r)
        return s.from(i, t, e);
      const o = w(r);
      if (o) return o;
      if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof r[Symbol.toPrimitive] == "function")
        return s.from(r[Symbol.toPrimitive]("string"), t, e);
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof r
      );
    }
    s.from = function(r, t, e) {
      return B(r, t, e);
    }, Object.setPrototypeOf(s.prototype, Uint8Array.prototype), Object.setPrototypeOf(s, Uint8Array);
    function R(r) {
      if (typeof r != "number")
        throw new TypeError('"size" argument must be of type number');
      if (r < 0)
        throw new RangeError('The value "' + r + '" is invalid for option "size"');
    }
    function b(r, t, e) {
      return R(r), r <= 0 ? d(r) : t !== void 0 ? typeof e == "string" ? d(r).fill(t, e) : d(r).fill(t) : d(r);
    }
    s.alloc = function(r, t, e) {
      return b(r, t, e);
    };
    function m(r) {
      return R(r), d(r < 0 ? 0 : E(r) | 0);
    }
    s.allocUnsafe = function(r) {
      return m(r);
    }, s.allocUnsafeSlow = function(r) {
      return m(r);
    };
    function A(r, t) {
      if ((typeof t != "string" || t === "") && (t = "utf8"), !s.isEncoding(t))
        throw new TypeError("Unknown encoding: " + t);
      const e = k(r, t) | 0;
      let i = d(e);
      const o = i.write(r, t);
      return o !== e && (i = i.slice(0, o)), i;
    }
    function p(r) {
      const t = r.length < 0 ? 0 : E(r.length) | 0, e = d(t);
      for (let i = 0; i < t; i += 1)
        e[i] = r[i] & 255;
      return e;
    }
    function y(r) {
      if (N(r, Uint8Array)) {
        const t = new Uint8Array(r);
        return g(t.buffer, t.byteOffset, t.byteLength);
      }
      return p(r);
    }
    function g(r, t, e) {
      if (t < 0 || r.byteLength < t)
        throw new RangeError('"offset" is outside of buffer bounds');
      if (r.byteLength < t + (e || 0))
        throw new RangeError('"length" is outside of buffer bounds');
      let i;
      return t === void 0 && e === void 0 ? i = new Uint8Array(r) : e === void 0 ? i = new Uint8Array(r, t) : i = new Uint8Array(r, t, e), Object.setPrototypeOf(i, s.prototype), i;
    }
    function w(r) {
      if (s.isBuffer(r)) {
        const t = E(r.length) | 0, e = d(t);
        return e.length === 0 || r.copy(e, 0, 0, t), e;
      }
      if (r.length !== void 0)
        return typeof r.length != "number" || K(r.length) ? d(0) : p(r);
      if (r.type === "Buffer" && Array.isArray(r.data))
        return p(r.data);
    }
    function E(r) {
      if (r >= l)
        throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + l.toString(16) + " bytes");
      return r | 0;
    }
    function U(r) {
      return +r != r && (r = 0), s.alloc(+r);
    }
    s.isBuffer = function(t) {
      return t != null && t._isBuffer === !0 && t !== s.prototype;
    }, s.compare = function(t, e) {
      if (N(t, Uint8Array) && (t = s.from(t, t.offset, t.byteLength)), N(e, Uint8Array) && (e = s.from(e, e.offset, e.byteLength)), !s.isBuffer(t) || !s.isBuffer(e))
        throw new TypeError(
          'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
        );
      if (t === e) return 0;
      let i = t.length, o = e.length;
      for (let u = 0, a = Math.min(i, o); u < a; ++u)
        if (t[u] !== e[u]) {
          i = t[u], o = e[u];
          break;
        }
      return i < o ? -1 : o < i ? 1 : 0;
    }, s.isEncoding = function(t) {
      switch (String(t).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return !0;
        default:
          return !1;
      }
    }, s.concat = function(t, e) {
      if (!Array.isArray(t))
        throw new TypeError('"list" argument must be an Array of Buffers');
      if (t.length === 0)
        return s.alloc(0);
      let i;
      if (e === void 0)
        for (e = 0, i = 0; i < t.length; ++i)
          e += t[i].length;
      const o = s.allocUnsafe(e);
      let u = 0;
      for (i = 0; i < t.length; ++i) {
        let a = t[i];
        if (N(a, Uint8Array))
          u + a.length > o.length ? (s.isBuffer(a) || (a = s.from(a)), a.copy(o, u)) : Uint8Array.prototype.set.call(
            o,
            a,
            u
          );
        else if (s.isBuffer(a))
          a.copy(o, u);
        else
          throw new TypeError('"list" argument must be an Array of Buffers');
        u += a.length;
      }
      return o;
    };
    function k(r, t) {
      if (s.isBuffer(r))
        return r.length;
      if (ArrayBuffer.isView(r) || N(r, ArrayBuffer))
        return r.byteLength;
      if (typeof r != "string")
        throw new TypeError(
          'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof r
        );
      const e = r.length, i = arguments.length > 2 && arguments[2] === !0;
      if (!i && e === 0) return 0;
      let o = !1;
      for (; ; )
        switch (t) {
          case "ascii":
          case "latin1":
          case "binary":
            return e;
          case "utf8":
          case "utf-8":
            return Z(r).length;
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return e * 2;
          case "hex":
            return e >>> 1;
          case "base64":
            return lt(r).length;
          default:
            if (o)
              return i ? -1 : Z(r).length;
            t = ("" + t).toLowerCase(), o = !0;
        }
    }
    s.byteLength = k;
    function v(r, t, e) {
      let i = !1;
      if ((t === void 0 || t < 0) && (t = 0), t > this.length || ((e === void 0 || e > this.length) && (e = this.length), e <= 0) || (e >>>= 0, t >>>= 0, e <= t))
        return "";
      for (r || (r = "utf8"); ; )
        switch (r) {
          case "hex":
            return Mt(this, t, e);
          case "utf8":
          case "utf-8":
            return it(this, t, e);
          case "ascii":
            return Rt(this, t, e);
          case "latin1":
          case "binary":
            return St(this, t, e);
          case "base64":
            return Ft(this, t, e);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return Ct(this, t, e);
          default:
            if (i) throw new TypeError("Unknown encoding: " + r);
            r = (r + "").toLowerCase(), i = !0;
        }
    }
    s.prototype._isBuffer = !0;
    function S(r, t, e) {
      const i = r[t];
      r[t] = r[e], r[e] = i;
    }
    s.prototype.swap16 = function() {
      const t = this.length;
      if (t % 2 !== 0)
        throw new RangeError("Buffer size must be a multiple of 16-bits");
      for (let e = 0; e < t; e += 2)
        S(this, e, e + 1);
      return this;
    }, s.prototype.swap32 = function() {
      const t = this.length;
      if (t % 4 !== 0)
        throw new RangeError("Buffer size must be a multiple of 32-bits");
      for (let e = 0; e < t; e += 4)
        S(this, e, e + 3), S(this, e + 1, e + 2);
      return this;
    }, s.prototype.swap64 = function() {
      const t = this.length;
      if (t % 8 !== 0)
        throw new RangeError("Buffer size must be a multiple of 64-bits");
      for (let e = 0; e < t; e += 8)
        S(this, e, e + 7), S(this, e + 1, e + 6), S(this, e + 2, e + 5), S(this, e + 3, e + 4);
      return this;
    }, s.prototype.toString = function() {
      const t = this.length;
      return t === 0 ? "" : arguments.length === 0 ? it(this, 0, t) : v.apply(this, arguments);
    }, s.prototype.toLocaleString = s.prototype.toString, s.prototype.equals = function(t) {
      if (!s.isBuffer(t)) throw new TypeError("Argument must be a Buffer");
      return this === t ? !0 : s.compare(this, t) === 0;
    }, s.prototype.inspect = function() {
      let t = "";
      const e = c.INSPECT_MAX_BYTES;
      return t = this.toString("hex", 0, e).replace(/(.{2})/g, "$1 ").trim(), this.length > e && (t += " ... "), "<Buffer " + t + ">";
    }, f && (s.prototype[f] = s.prototype.inspect), s.prototype.compare = function(t, e, i, o, u) {
      if (N(t, Uint8Array) && (t = s.from(t, t.offset, t.byteLength)), !s.isBuffer(t))
        throw new TypeError(
          'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof t
        );
      if (e === void 0 && (e = 0), i === void 0 && (i = t ? t.length : 0), o === void 0 && (o = 0), u === void 0 && (u = this.length), e < 0 || i > t.length || o < 0 || u > this.length)
        throw new RangeError("out of range index");
      if (o >= u && e >= i)
        return 0;
      if (o >= u)
        return -1;
      if (e >= i)
        return 1;
      if (e >>>= 0, i >>>= 0, o >>>= 0, u >>>= 0, this === t) return 0;
      let a = u - o, x = i - e;
      const C = Math.min(a, x), M = this.slice(o, u), _ = t.slice(e, i);
      for (let F = 0; F < C; ++F)
        if (M[F] !== _[F]) {
          a = M[F], x = _[F];
          break;
        }
      return a < x ? -1 : x < a ? 1 : 0;
    };
    function V(r, t, e, i, o) {
      if (r.length === 0) return -1;
      if (typeof e == "string" ? (i = e, e = 0) : e > 2147483647 ? e = 2147483647 : e < -2147483648 && (e = -2147483648), e = +e, K(e) && (e = o ? 0 : r.length - 1), e < 0 && (e = r.length + e), e >= r.length) {
        if (o) return -1;
        e = r.length - 1;
      } else if (e < 0)
        if (o) e = 0;
        else return -1;
      if (typeof t == "string" && (t = s.from(t, i)), s.isBuffer(t))
        return t.length === 0 ? -1 : $(r, t, e, i, o);
      if (typeof t == "number")
        return t = t & 255, typeof Uint8Array.prototype.indexOf == "function" ? o ? Uint8Array.prototype.indexOf.call(r, t, e) : Uint8Array.prototype.lastIndexOf.call(r, t, e) : $(r, [t], e, i, o);
      throw new TypeError("val must be string, number or Buffer");
    }
    function $(r, t, e, i, o) {
      let u = 1, a = r.length, x = t.length;
      if (i !== void 0 && (i = String(i).toLowerCase(), i === "ucs2" || i === "ucs-2" || i === "utf16le" || i === "utf-16le")) {
        if (r.length < 2 || t.length < 2)
          return -1;
        u = 2, a /= 2, x /= 2, e /= 2;
      }
      function C(_, F) {
        return u === 1 ? _[F] : _.readUInt16BE(F * u);
      }
      let M;
      if (o) {
        let _ = -1;
        for (M = e; M < a; M++)
          if (C(r, M) === C(t, _ === -1 ? 0 : M - _)) {
            if (_ === -1 && (_ = M), M - _ + 1 === x) return _ * u;
          } else
            _ !== -1 && (M -= M - _), _ = -1;
      } else
        for (e + x > a && (e = a - x), M = e; M >= 0; M--) {
          let _ = !0;
          for (let F = 0; F < x; F++)
            if (C(r, M + F) !== C(t, F)) {
              _ = !1;
              break;
            }
          if (_) return M;
        }
      return -1;
    }
    s.prototype.includes = function(t, e, i) {
      return this.indexOf(t, e, i) !== -1;
    }, s.prototype.indexOf = function(t, e, i) {
      return V(this, t, e, i, !0);
    }, s.prototype.lastIndexOf = function(t, e, i) {
      return V(this, t, e, i, !1);
    };
    function Bt(r, t, e, i) {
      e = Number(e) || 0;
      const o = r.length - e;
      i ? (i = Number(i), i > o && (i = o)) : i = o;
      const u = t.length;
      i > u / 2 && (i = u / 2);
      let a;
      for (a = 0; a < i; ++a) {
        const x = parseInt(t.substr(a * 2, 2), 16);
        if (K(x)) return a;
        r[e + a] = x;
      }
      return a;
    }
    function It(r, t, e, i) {
      return W(Z(t, r.length - e), r, e, i);
    }
    function Et(r, t, e, i) {
      return W(Lt(t), r, e, i);
    }
    function bt(r, t, e, i) {
      return W(lt(t), r, e, i);
    }
    function Ut(r, t, e, i) {
      return W(Dt(t, r.length - e), r, e, i);
    }
    s.prototype.write = function(t, e, i, o) {
      if (e === void 0)
        o = "utf8", i = this.length, e = 0;
      else if (i === void 0 && typeof e == "string")
        o = e, i = this.length, e = 0;
      else if (isFinite(e))
        e = e >>> 0, isFinite(i) ? (i = i >>> 0, o === void 0 && (o = "utf8")) : (o = i, i = void 0);
      else
        throw new Error(
          "Buffer.write(string, encoding, offset[, length]) is no longer supported"
        );
      const u = this.length - e;
      if ((i === void 0 || i > u) && (i = u), t.length > 0 && (i < 0 || e < 0) || e > this.length)
        throw new RangeError("Attempt to write outside buffer bounds");
      o || (o = "utf8");
      let a = !1;
      for (; ; )
        switch (o) {
          case "hex":
            return Bt(this, t, e, i);
          case "utf8":
          case "utf-8":
            return It(this, t, e, i);
          case "ascii":
          case "latin1":
          case "binary":
            return Et(this, t, e, i);
          case "base64":
            return bt(this, t, e, i);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return Ut(this, t, e, i);
          default:
            if (a) throw new TypeError("Unknown encoding: " + o);
            o = ("" + o).toLowerCase(), a = !0;
        }
    }, s.prototype.toJSON = function() {
      return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
      };
    };
    function Ft(r, t, e) {
      return t === 0 && e === r.length ? n.fromByteArray(r) : n.fromByteArray(r.slice(t, e));
    }
    function it(r, t, e) {
      e = Math.min(r.length, e);
      const i = [];
      let o = t;
      for (; o < e; ) {
        const u = r[o];
        let a = null, x = u > 239 ? 4 : u > 223 ? 3 : u > 191 ? 2 : 1;
        if (o + x <= e) {
          let C, M, _, F;
          switch (x) {
            case 1:
              u < 128 && (a = u);
              break;
            case 2:
              C = r[o + 1], (C & 192) === 128 && (F = (u & 31) << 6 | C & 63, F > 127 && (a = F));
              break;
            case 3:
              C = r[o + 1], M = r[o + 2], (C & 192) === 128 && (M & 192) === 128 && (F = (u & 15) << 12 | (C & 63) << 6 | M & 63, F > 2047 && (F < 55296 || F > 57343) && (a = F));
              break;
            case 4:
              C = r[o + 1], M = r[o + 2], _ = r[o + 3], (C & 192) === 128 && (M & 192) === 128 && (_ & 192) === 128 && (F = (u & 15) << 18 | (C & 63) << 12 | (M & 63) << 6 | _ & 63, F > 65535 && F < 1114112 && (a = F));
          }
        }
        a === null ? (a = 65533, x = 1) : a > 65535 && (a -= 65536, i.push(a >>> 10 & 1023 | 55296), a = 56320 | a & 1023), i.push(a), o += x;
      }
      return At(i);
    }
    const nt = 4096;
    function At(r) {
      const t = r.length;
      if (t <= nt)
        return String.fromCharCode.apply(String, r);
      let e = "", i = 0;
      for (; i < t; )
        e += String.fromCharCode.apply(
          String,
          r.slice(i, i += nt)
        );
      return e;
    }
    function Rt(r, t, e) {
      let i = "";
      e = Math.min(r.length, e);
      for (let o = t; o < e; ++o)
        i += String.fromCharCode(r[o] & 127);
      return i;
    }
    function St(r, t, e) {
      let i = "";
      e = Math.min(r.length, e);
      for (let o = t; o < e; ++o)
        i += String.fromCharCode(r[o]);
      return i;
    }
    function Mt(r, t, e) {
      const i = r.length;
      (!t || t < 0) && (t = 0), (!e || e < 0 || e > i) && (e = i);
      let o = "";
      for (let u = t; u < e; ++u)
        o += vt[r[u]];
      return o;
    }
    function Ct(r, t, e) {
      const i = r.slice(t, e);
      let o = "";
      for (let u = 0; u < i.length - 1; u += 2)
        o += String.fromCharCode(i[u] + i[u + 1] * 256);
      return o;
    }
    s.prototype.slice = function(t, e) {
      const i = this.length;
      t = ~~t, e = e === void 0 ? i : ~~e, t < 0 ? (t += i, t < 0 && (t = 0)) : t > i && (t = i), e < 0 ? (e += i, e < 0 && (e = 0)) : e > i && (e = i), e < t && (e = t);
      const o = this.subarray(t, e);
      return Object.setPrototypeOf(o, s.prototype), o;
    };
    function L(r, t, e) {
      if (r % 1 !== 0 || r < 0) throw new RangeError("offset is not uint");
      if (r + t > e) throw new RangeError("Trying to access beyond buffer length");
    }
    s.prototype.readUintLE = s.prototype.readUIntLE = function(t, e, i) {
      t = t >>> 0, e = e >>> 0, i || L(t, e, this.length);
      let o = this[t], u = 1, a = 0;
      for (; ++a < e && (u *= 256); )
        o += this[t + a] * u;
      return o;
    }, s.prototype.readUintBE = s.prototype.readUIntBE = function(t, e, i) {
      t = t >>> 0, e = e >>> 0, i || L(t, e, this.length);
      let o = this[t + --e], u = 1;
      for (; e > 0 && (u *= 256); )
        o += this[t + --e] * u;
      return o;
    }, s.prototype.readUint8 = s.prototype.readUInt8 = function(t, e) {
      return t = t >>> 0, e || L(t, 1, this.length), this[t];
    }, s.prototype.readUint16LE = s.prototype.readUInt16LE = function(t, e) {
      return t = t >>> 0, e || L(t, 2, this.length), this[t] | this[t + 1] << 8;
    }, s.prototype.readUint16BE = s.prototype.readUInt16BE = function(t, e) {
      return t = t >>> 0, e || L(t, 2, this.length), this[t] << 8 | this[t + 1];
    }, s.prototype.readUint32LE = s.prototype.readUInt32LE = function(t, e) {
      return t = t >>> 0, e || L(t, 4, this.length), (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + this[t + 3] * 16777216;
    }, s.prototype.readUint32BE = s.prototype.readUInt32BE = function(t, e) {
      return t = t >>> 0, e || L(t, 4, this.length), this[t] * 16777216 + (this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]);
    }, s.prototype.readBigUInt64LE = P(function(t) {
      t = t >>> 0, X(t, "offset");
      const e = this[t], i = this[t + 7];
      (e === void 0 || i === void 0) && q(t, this.length - 8);
      const o = e + this[++t] * 2 ** 8 + this[++t] * 2 ** 16 + this[++t] * 2 ** 24, u = this[++t] + this[++t] * 2 ** 8 + this[++t] * 2 ** 16 + i * 2 ** 24;
      return BigInt(o) + (BigInt(u) << BigInt(32));
    }), s.prototype.readBigUInt64BE = P(function(t) {
      t = t >>> 0, X(t, "offset");
      const e = this[t], i = this[t + 7];
      (e === void 0 || i === void 0) && q(t, this.length - 8);
      const o = e * 2 ** 24 + this[++t] * 2 ** 16 + this[++t] * 2 ** 8 + this[++t], u = this[++t] * 2 ** 24 + this[++t] * 2 ** 16 + this[++t] * 2 ** 8 + i;
      return (BigInt(o) << BigInt(32)) + BigInt(u);
    }), s.prototype.readIntLE = function(t, e, i) {
      t = t >>> 0, e = e >>> 0, i || L(t, e, this.length);
      let o = this[t], u = 1, a = 0;
      for (; ++a < e && (u *= 256); )
        o += this[t + a] * u;
      return u *= 128, o >= u && (o -= Math.pow(2, 8 * e)), o;
    }, s.prototype.readIntBE = function(t, e, i) {
      t = t >>> 0, e = e >>> 0, i || L(t, e, this.length);
      let o = e, u = 1, a = this[t + --o];
      for (; o > 0 && (u *= 256); )
        a += this[t + --o] * u;
      return u *= 128, a >= u && (a -= Math.pow(2, 8 * e)), a;
    }, s.prototype.readInt8 = function(t, e) {
      return t = t >>> 0, e || L(t, 1, this.length), this[t] & 128 ? (255 - this[t] + 1) * -1 : this[t];
    }, s.prototype.readInt16LE = function(t, e) {
      t = t >>> 0, e || L(t, 2, this.length);
      const i = this[t] | this[t + 1] << 8;
      return i & 32768 ? i | 4294901760 : i;
    }, s.prototype.readInt16BE = function(t, e) {
      t = t >>> 0, e || L(t, 2, this.length);
      const i = this[t + 1] | this[t] << 8;
      return i & 32768 ? i | 4294901760 : i;
    }, s.prototype.readInt32LE = function(t, e) {
      return t = t >>> 0, e || L(t, 4, this.length), this[t] | this[t + 1] << 8 | this[t + 2] << 16 | this[t + 3] << 24;
    }, s.prototype.readInt32BE = function(t, e) {
      return t = t >>> 0, e || L(t, 4, this.length), this[t] << 24 | this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3];
    }, s.prototype.readBigInt64LE = P(function(t) {
      t = t >>> 0, X(t, "offset");
      const e = this[t], i = this[t + 7];
      (e === void 0 || i === void 0) && q(t, this.length - 8);
      const o = this[t + 4] + this[t + 5] * 2 ** 8 + this[t + 6] * 2 ** 16 + (i << 24);
      return (BigInt(o) << BigInt(32)) + BigInt(e + this[++t] * 2 ** 8 + this[++t] * 2 ** 16 + this[++t] * 2 ** 24);
    }), s.prototype.readBigInt64BE = P(function(t) {
      t = t >>> 0, X(t, "offset");
      const e = this[t], i = this[t + 7];
      (e === void 0 || i === void 0) && q(t, this.length - 8);
      const o = (e << 24) + // Overflow
      this[++t] * 2 ** 16 + this[++t] * 2 ** 8 + this[++t];
      return (BigInt(o) << BigInt(32)) + BigInt(this[++t] * 2 ** 24 + this[++t] * 2 ** 16 + this[++t] * 2 ** 8 + i);
    }), s.prototype.readFloatLE = function(t, e) {
      return t = t >>> 0, e || L(t, 4, this.length), h.read(this, t, !0, 23, 4);
    }, s.prototype.readFloatBE = function(t, e) {
      return t = t >>> 0, e || L(t, 4, this.length), h.read(this, t, !1, 23, 4);
    }, s.prototype.readDoubleLE = function(t, e) {
      return t = t >>> 0, e || L(t, 8, this.length), h.read(this, t, !0, 52, 8);
    }, s.prototype.readDoubleBE = function(t, e) {
      return t = t >>> 0, e || L(t, 8, this.length), h.read(this, t, !1, 52, 8);
    };
    function D(r, t, e, i, o, u) {
      if (!s.isBuffer(r)) throw new TypeError('"buffer" argument must be a Buffer instance');
      if (t > o || t < u) throw new RangeError('"value" argument is out of bounds');
      if (e + i > r.length) throw new RangeError("Index out of range");
    }
    s.prototype.writeUintLE = s.prototype.writeUIntLE = function(t, e, i, o) {
      if (t = +t, e = e >>> 0, i = i >>> 0, !o) {
        const x = Math.pow(2, 8 * i) - 1;
        D(this, t, e, i, x, 0);
      }
      let u = 1, a = 0;
      for (this[e] = t & 255; ++a < i && (u *= 256); )
        this[e + a] = t / u & 255;
      return e + i;
    }, s.prototype.writeUintBE = s.prototype.writeUIntBE = function(t, e, i, o) {
      if (t = +t, e = e >>> 0, i = i >>> 0, !o) {
        const x = Math.pow(2, 8 * i) - 1;
        D(this, t, e, i, x, 0);
      }
      let u = i - 1, a = 1;
      for (this[e + u] = t & 255; --u >= 0 && (a *= 256); )
        this[e + u] = t / a & 255;
      return e + i;
    }, s.prototype.writeUint8 = s.prototype.writeUInt8 = function(t, e, i) {
      return t = +t, e = e >>> 0, i || D(this, t, e, 1, 255, 0), this[e] = t & 255, e + 1;
    }, s.prototype.writeUint16LE = s.prototype.writeUInt16LE = function(t, e, i) {
      return t = +t, e = e >>> 0, i || D(this, t, e, 2, 65535, 0), this[e] = t & 255, this[e + 1] = t >>> 8, e + 2;
    }, s.prototype.writeUint16BE = s.prototype.writeUInt16BE = function(t, e, i) {
      return t = +t, e = e >>> 0, i || D(this, t, e, 2, 65535, 0), this[e] = t >>> 8, this[e + 1] = t & 255, e + 2;
    }, s.prototype.writeUint32LE = s.prototype.writeUInt32LE = function(t, e, i) {
      return t = +t, e = e >>> 0, i || D(this, t, e, 4, 4294967295, 0), this[e + 3] = t >>> 24, this[e + 2] = t >>> 16, this[e + 1] = t >>> 8, this[e] = t & 255, e + 4;
    }, s.prototype.writeUint32BE = s.prototype.writeUInt32BE = function(t, e, i) {
      return t = +t, e = e >>> 0, i || D(this, t, e, 4, 4294967295, 0), this[e] = t >>> 24, this[e + 1] = t >>> 16, this[e + 2] = t >>> 8, this[e + 3] = t & 255, e + 4;
    };
    function ot(r, t, e, i, o) {
      ft(t, i, o, r, e, 7);
      let u = Number(t & BigInt(4294967295));
      r[e++] = u, u = u >> 8, r[e++] = u, u = u >> 8, r[e++] = u, u = u >> 8, r[e++] = u;
      let a = Number(t >> BigInt(32) & BigInt(4294967295));
      return r[e++] = a, a = a >> 8, r[e++] = a, a = a >> 8, r[e++] = a, a = a >> 8, r[e++] = a, e;
    }
    function st(r, t, e, i, o) {
      ft(t, i, o, r, e, 7);
      let u = Number(t & BigInt(4294967295));
      r[e + 7] = u, u = u >> 8, r[e + 6] = u, u = u >> 8, r[e + 5] = u, u = u >> 8, r[e + 4] = u;
      let a = Number(t >> BigInt(32) & BigInt(4294967295));
      return r[e + 3] = a, a = a >> 8, r[e + 2] = a, a = a >> 8, r[e + 1] = a, a = a >> 8, r[e] = a, e + 8;
    }
    s.prototype.writeBigUInt64LE = P(function(t, e = 0) {
      return ot(this, t, e, BigInt(0), BigInt("0xffffffffffffffff"));
    }), s.prototype.writeBigUInt64BE = P(function(t, e = 0) {
      return st(this, t, e, BigInt(0), BigInt("0xffffffffffffffff"));
    }), s.prototype.writeIntLE = function(t, e, i, o) {
      if (t = +t, e = e >>> 0, !o) {
        const C = Math.pow(2, 8 * i - 1);
        D(this, t, e, i, C - 1, -C);
      }
      let u = 0, a = 1, x = 0;
      for (this[e] = t & 255; ++u < i && (a *= 256); )
        t < 0 && x === 0 && this[e + u - 1] !== 0 && (x = 1), this[e + u] = (t / a >> 0) - x & 255;
      return e + i;
    }, s.prototype.writeIntBE = function(t, e, i, o) {
      if (t = +t, e = e >>> 0, !o) {
        const C = Math.pow(2, 8 * i - 1);
        D(this, t, e, i, C - 1, -C);
      }
      let u = i - 1, a = 1, x = 0;
      for (this[e + u] = t & 255; --u >= 0 && (a *= 256); )
        t < 0 && x === 0 && this[e + u + 1] !== 0 && (x = 1), this[e + u] = (t / a >> 0) - x & 255;
      return e + i;
    }, s.prototype.writeInt8 = function(t, e, i) {
      return t = +t, e = e >>> 0, i || D(this, t, e, 1, 127, -128), t < 0 && (t = 255 + t + 1), this[e] = t & 255, e + 1;
    }, s.prototype.writeInt16LE = function(t, e, i) {
      return t = +t, e = e >>> 0, i || D(this, t, e, 2, 32767, -32768), this[e] = t & 255, this[e + 1] = t >>> 8, e + 2;
    }, s.prototype.writeInt16BE = function(t, e, i) {
      return t = +t, e = e >>> 0, i || D(this, t, e, 2, 32767, -32768), this[e] = t >>> 8, this[e + 1] = t & 255, e + 2;
    }, s.prototype.writeInt32LE = function(t, e, i) {
      return t = +t, e = e >>> 0, i || D(this, t, e, 4, 2147483647, -2147483648), this[e] = t & 255, this[e + 1] = t >>> 8, this[e + 2] = t >>> 16, this[e + 3] = t >>> 24, e + 4;
    }, s.prototype.writeInt32BE = function(t, e, i) {
      return t = +t, e = e >>> 0, i || D(this, t, e, 4, 2147483647, -2147483648), t < 0 && (t = 4294967295 + t + 1), this[e] = t >>> 24, this[e + 1] = t >>> 16, this[e + 2] = t >>> 8, this[e + 3] = t & 255, e + 4;
    }, s.prototype.writeBigInt64LE = P(function(t, e = 0) {
      return ot(this, t, e, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    }), s.prototype.writeBigInt64BE = P(function(t, e = 0) {
      return st(this, t, e, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    function ut(r, t, e, i, o, u) {
      if (e + i > r.length) throw new RangeError("Index out of range");
      if (e < 0) throw new RangeError("Index out of range");
    }
    function ht(r, t, e, i, o) {
      return t = +t, e = e >>> 0, o || ut(r, t, e, 4), h.write(r, t, e, i, 23, 4), e + 4;
    }
    s.prototype.writeFloatLE = function(t, e, i) {
      return ht(this, t, e, !0, i);
    }, s.prototype.writeFloatBE = function(t, e, i) {
      return ht(this, t, e, !1, i);
    };
    function at(r, t, e, i, o) {
      return t = +t, e = e >>> 0, o || ut(r, t, e, 8), h.write(r, t, e, i, 52, 8), e + 8;
    }
    s.prototype.writeDoubleLE = function(t, e, i) {
      return at(this, t, e, !0, i);
    }, s.prototype.writeDoubleBE = function(t, e, i) {
      return at(this, t, e, !1, i);
    }, s.prototype.copy = function(t, e, i, o) {
      if (!s.isBuffer(t)) throw new TypeError("argument should be a Buffer");
      if (i || (i = 0), !o && o !== 0 && (o = this.length), e >= t.length && (e = t.length), e || (e = 0), o > 0 && o < i && (o = i), o === i || t.length === 0 || this.length === 0) return 0;
      if (e < 0)
        throw new RangeError("targetStart out of bounds");
      if (i < 0 || i >= this.length) throw new RangeError("Index out of range");
      if (o < 0) throw new RangeError("sourceEnd out of bounds");
      o > this.length && (o = this.length), t.length - e < o - i && (o = t.length - e + i);
      const u = o - i;
      return this === t && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(e, i, o) : Uint8Array.prototype.set.call(
        t,
        this.subarray(i, o),
        e
      ), u;
    }, s.prototype.fill = function(t, e, i, o) {
      if (typeof t == "string") {
        if (typeof e == "string" ? (o = e, e = 0, i = this.length) : typeof i == "string" && (o = i, i = this.length), o !== void 0 && typeof o != "string")
          throw new TypeError("encoding must be a string");
        if (typeof o == "string" && !s.isEncoding(o))
          throw new TypeError("Unknown encoding: " + o);
        if (t.length === 1) {
          const a = t.charCodeAt(0);
          (o === "utf8" && a < 128 || o === "latin1") && (t = a);
        }
      } else typeof t == "number" ? t = t & 255 : typeof t == "boolean" && (t = Number(t));
      if (e < 0 || this.length < e || this.length < i)
        throw new RangeError("Out of range index");
      if (i <= e)
        return this;
      e = e >>> 0, i = i === void 0 ? this.length : i >>> 0, t || (t = 0);
      let u;
      if (typeof t == "number")
        for (u = e; u < i; ++u)
          this[u] = t;
      else {
        const a = s.isBuffer(t) ? t : s.from(t, o), x = a.length;
        if (x === 0)
          throw new TypeError('The value "' + t + '" is invalid for argument "value"');
        for (u = 0; u < i - e; ++u)
          this[u + e] = a[u % x];
      }
      return this;
    };
    const Y = {};
    function J(r, t, e) {
      Y[r] = class extends e {
        constructor() {
          super(), Object.defineProperty(this, "message", {
            value: t.apply(this, arguments),
            writable: !0,
            configurable: !0
          }), this.name = `${this.name} [${r}]`, this.stack, delete this.name;
        }
        get code() {
          return r;
        }
        set code(o) {
          Object.defineProperty(this, "code", {
            configurable: !0,
            enumerable: !0,
            value: o,
            writable: !0
          });
        }
        toString() {
          return `${this.name} [${r}]: ${this.message}`;
        }
      };
    }
    J(
      "ERR_BUFFER_OUT_OF_BOUNDS",
      function(r) {
        return r ? `${r} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
      },
      RangeError
    ), J(
      "ERR_INVALID_ARG_TYPE",
      function(r, t) {
        return `The "${r}" argument must be of type number. Received type ${typeof t}`;
      },
      TypeError
    ), J(
      "ERR_OUT_OF_RANGE",
      function(r, t, e) {
        let i = `The value of "${r}" is out of range.`, o = e;
        return Number.isInteger(e) && Math.abs(e) > 2 ** 32 ? o = ct(String(e)) : typeof e == "bigint" && (o = String(e), (e > BigInt(2) ** BigInt(32) || e < -(BigInt(2) ** BigInt(32))) && (o = ct(o)), o += "n"), i += ` It must be ${t}. Received ${o}`, i;
      },
      RangeError
    );
    function ct(r) {
      let t = "", e = r.length;
      const i = r[0] === "-" ? 1 : 0;
      for (; e >= i + 4; e -= 3)
        t = `_${r.slice(e - 3, e)}${t}`;
      return `${r.slice(0, e)}${t}`;
    }
    function _t(r, t, e) {
      X(t, "offset"), (r[t] === void 0 || r[t + e] === void 0) && q(t, r.length - (e + 1));
    }
    function ft(r, t, e, i, o, u) {
      if (r > e || r < t) {
        const a = typeof t == "bigint" ? "n" : "";
        let x;
        throw t === 0 || t === BigInt(0) ? x = `>= 0${a} and < 2${a} ** ${(u + 1) * 8}${a}` : x = `>= -(2${a} ** ${(u + 1) * 8 - 1}${a}) and < 2 ** ${(u + 1) * 8 - 1}${a}`, new Y.ERR_OUT_OF_RANGE("value", x, r);
      }
      _t(i, o, u);
    }
    function X(r, t) {
      if (typeof r != "number")
        throw new Y.ERR_INVALID_ARG_TYPE(t, "number", r);
    }
    function q(r, t, e) {
      throw Math.floor(r) !== r ? (X(r, e), new Y.ERR_OUT_OF_RANGE("offset", "an integer", r)) : t < 0 ? new Y.ERR_BUFFER_OUT_OF_BOUNDS() : new Y.ERR_OUT_OF_RANGE(
        "offset",
        `>= 0 and <= ${t}`,
        r
      );
    }
    const kt = /[^+/0-9A-Za-z-_]/g;
    function Tt(r) {
      if (r = r.split("=")[0], r = r.trim().replace(kt, ""), r.length < 2) return "";
      for (; r.length % 4 !== 0; )
        r = r + "=";
      return r;
    }
    function Z(r, t) {
      t = t || 1 / 0;
      let e;
      const i = r.length;
      let o = null;
      const u = [];
      for (let a = 0; a < i; ++a) {
        if (e = r.charCodeAt(a), e > 55295 && e < 57344) {
          if (!o) {
            if (e > 56319) {
              (t -= 3) > -1 && u.push(239, 191, 189);
              continue;
            } else if (a + 1 === i) {
              (t -= 3) > -1 && u.push(239, 191, 189);
              continue;
            }
            o = e;
            continue;
          }
          if (e < 56320) {
            (t -= 3) > -1 && u.push(239, 191, 189), o = e;
            continue;
          }
          e = (o - 55296 << 10 | e - 56320) + 65536;
        } else o && (t -= 3) > -1 && u.push(239, 191, 189);
        if (o = null, e < 128) {
          if ((t -= 1) < 0) break;
          u.push(e);
        } else if (e < 2048) {
          if ((t -= 2) < 0) break;
          u.push(
            e >> 6 | 192,
            e & 63 | 128
          );
        } else if (e < 65536) {
          if ((t -= 3) < 0) break;
          u.push(
            e >> 12 | 224,
            e >> 6 & 63 | 128,
            e & 63 | 128
          );
        } else if (e < 1114112) {
          if ((t -= 4) < 0) break;
          u.push(
            e >> 18 | 240,
            e >> 12 & 63 | 128,
            e >> 6 & 63 | 128,
            e & 63 | 128
          );
        } else
          throw new Error("Invalid code point");
      }
      return u;
    }
    function Lt(r) {
      const t = [];
      for (let e = 0; e < r.length; ++e)
        t.push(r.charCodeAt(e) & 255);
      return t;
    }
    function Dt(r, t) {
      let e, i, o;
      const u = [];
      for (let a = 0; a < r.length && !((t -= 2) < 0); ++a)
        e = r.charCodeAt(a), i = e >> 8, o = e % 256, u.push(o), u.push(i);
      return u;
    }
    function lt(r) {
      return n.toByteArray(Tt(r));
    }
    function W(r, t, e, i) {
      let o;
      for (o = 0; o < i && !(o + e >= t.length || o >= r.length); ++o)
        t[o + e] = r[o];
      return o;
    }
    function N(r, t) {
      return r instanceof t || r != null && r.constructor != null && r.constructor.name != null && r.constructor.name === t.name;
    }
    function K(r) {
      return r !== r;
    }
    const vt = function() {
      const r = "0123456789abcdef", t = new Array(256);
      for (let e = 0; e < 16; ++e) {
        const i = e * 16;
        for (let o = 0; o < 16; ++o)
          t[i + o] = r[e] + r[o];
      }
      return t;
    }();
    function P(r) {
      return typeof BigInt > "u" ? Nt : r;
    }
    function Nt() {
      throw new Error("BigInt not supported");
    }
  }(Q)), Q;
}
var tt = Yt(), Xt = function(d, s, B, R, b, m) {
  var d, s, B, R, b, m, A, p, y;
  switch (arguments.length == 2 && typeof arguments[1] == "object" ? (d = arguments[0], s = arguments[1].polynomial, B = arguments[1].initial, R = arguments[1].finalXor, b = arguments[1].inputReflected, m = arguments[1].resultReflected) : arguments.length == 6 && (d = arguments[0], s = arguments[1], B = arguments[2], R = arguments[3], b = arguments[4], m = arguments[5]), d) {
    case 8:
      p = 255;
      break;
    case 16:
      p = 65535;
      break;
    case 32:
      p = 4294967295;
      break;
    default:
      throw "Invalid CRC width";
  }
  y = 1 << d - 1, this.calcCrcTable = function() {
    A = new Array(256);
    for (var g = 0; g < 256; g++) {
      for (var w = g << d - 8 & p, E = 0; E < 8; E++)
        (w & y) != 0 ? (w <<= 1, w ^= s) : w <<= 1;
      A[g] = w & p;
    }
  }, this.calcCrcTableReversed = function() {
    A = new Array(256);
    for (var g = 0; g < 256; g++) {
      for (var w = new G().Reflect8(g), E = w << d - 8 & p, U = 0; U < 8; U++)
        (E & y) != 0 ? (E <<= 1, E ^= s) : E <<= 1;
      E = new G().ReflectGeneric(E, d), A[g] = E & p;
    }
  }, this.crcTable || this.calcCrcTable(), this.compute = function(g) {
    for (var w = B, E = 0; E < g.length; E++) {
      var U = g[E] & 255;
      b && (U = new G().Reflect8(U)), w = (w ^ U << d - 8) & p;
      var k = w >> d - 8 & 255;
      w = w << 8 & p, w = (w ^ A[k]) & p;
    }
    return m && (w = new G().ReflectGeneric(w, d)), (w ^ R) & p;
  }, this.getLookupTable = function() {
    return A;
  };
}, G = function() {
  if (G.prototype._singletonInstance)
    return G.prototype._singletonInstance;
  G.prototype._singletonInstance = this, this.Reflect8 = function(c) {
    for (var n = 0, h = 0; h < 8; h++)
      (c & 1 << h) != 0 && (n |= 1 << 7 - h & 255);
    return n;
  }, this.Reflect16 = function(c) {
    for (var n = 0, h = 0; h < 16; h++)
      (c & 1 << h) != 0 && (n |= 1 << 15 - h & 65535);
    return n;
  }, this.Reflect32 = function(c) {
    for (var n = 0, h = 0; h < 32; h++)
      (c & 1 << h) != 0 && (n |= 1 << 31 - h & 4294967295);
    return n;
  }, this.ReflectGeneric = function(c, n) {
    for (var h = 0, f = 0; f < n; f++)
      (c & 1 << f) != 0 && (h |= 1 << n - 1 - f);
    return h;
  };
};
function wt(c) {
  var n = new Xt(32, 79764919, 4294967295, 4294967295, !0, !0), h = n.compute(c);
  return new Uint8Array(new Int32Array([h]).buffer);
}
var O = /* @__PURE__ */ ((c) => (c.Disconnected = "none", c.USB = "usb", c.Bluetooth = "bt", c))(O || {}), rt = /* @__PURE__ */ ((c) => (c[c.Gamepad = 0] = "Gamepad", c[c.Guitar = 1] = "Guitar", c[c.Drums = 2] = "Drums", c[c.Wheel = 6] = "Wheel", c[c.Fightstick = 7] = "Fightstick", c[c.HOTAS = 8] = "HOTAS", c))(rt || {});
const qt = {
  interface: "none",
  battery: 0,
  charging: !1,
  controllerType: 0,
  headphones: !1,
  microphone: !1,
  extension: !1,
  audio: "",
  reports: [],
  axes: {
    leftStickX: 0,
    leftStickY: 0,
    rightStickX: 0,
    rightStickY: 0,
    l2: 0,
    r2: 0,
    accelX: 0,
    accelY: 0,
    accelZ: 0,
    gyroX: 0,
    gyroY: 0,
    gyroZ: 0
  },
  buttons: {
    triangle: !1,
    circle: !1,
    cross: !1,
    square: !1,
    dPadUp: !1,
    dPadRight: !1,
    dPadDown: !1,
    dPadLeft: !1,
    l1: !1,
    l2: !1,
    l3: !1,
    r1: !1,
    r2: !1,
    r3: !1,
    options: !1,
    share: !1,
    playStation: !1,
    touchPadClick: !1
  },
  touchpad: {
    touches: []
  },
  timestamp: -1
};
function et(c, n, h) {
  return h < 0 && (h += 1), h > 1 && (h -= 1), h < 1 / 6 ? c + (n - c) * 6 * h : h < 1 / 2 ? n : h < 2 / 3 ? c + (n - c) * (2 / 3 - h) * 6 : c;
}
function Ht(c, n, h) {
  const f = { r: 0, g: 0, b: 0 };
  if (n === 0)
    f.r = f.g = f.b = h * 255;
  else {
    var l = h < 0.5 ? h * (1 + n) : h + n - h * n, I = 2 * h - l;
    f.r = et(I, l, c + 1 / 3) * 255, f.g = et(I, l, c) * 255, f.b = et(I, l, c - 1 / 3) * 255;
  }
  return f;
}
class Vt {
  /** @ignore */
  constructor(n) {
    /** @ignore */
    T(this, "_r", 0);
    /** @ignore */
    T(this, "_g", 0);
    /** @ignore */
    T(this, "_b", 0);
    /** @ignore */
    T(this, "_blinkOn", 1);
    /** @ignore */
    T(this, "_blinkOff", 0);
    this.controller = n;
  }
  /**
   * Send Lightbar data to the controller.
   * @ignore
   */
  updateLightbar() {
    if (!this.controller.device)
      throw new Error(
        "Controller not initialized. You must call .init() first!"
      );
    return this.controller.sendLocalState();
  }
  /** Red Color Intensity (0-255) */
  get r() {
    return this._r;
  }
  set r(n) {
    this._r = Math.min(255, Math.max(0, n)), this.updateLightbar();
  }
  /** Green Color Intensity (0-255) */
  get g() {
    return this._g;
  }
  set g(n) {
    this._g = Math.min(255, Math.max(0, n)), this.updateLightbar();
  }
  /** Blue Color Intensity (0-255) */
  get b() {
    return this._b;
  }
  set b(n) {
    this._b = Math.min(255, Math.max(0, n)), this.updateLightbar();
  }
  /** Blink Speed On (0-255) */
  get blinkOn() {
    return this._blinkOn;
  }
  set blinkOn(n) {
    this._blinkOn = Math.min(255, Math.max(0, n)), this.updateLightbar();
  }
  /** Blink Speed Off (0-255) */
  get blinkOff() {
    return this._blinkOff;
  }
  set blinkOff(n) {
    this._blinkOff = Math.min(255, Math.max(0, n)), this.updateLightbar();
  }
  /**
   * Sets the lightbar color (RGB)
   * @param r - Red color intensity (0-255)
   * @param g - Green color intensity (0-255)
   * @param b - Blue color intensity (0-255)
   */
  async setColorRGB(n, h, f) {
    return this._r = Math.min(255, Math.max(0, n)), this._g = Math.min(255, Math.max(0, h)), this._b = Math.min(255, Math.max(0, f)), this.updateLightbar();
  }
  /**
   * Sets the lightbar color (HSL)
   * @param h - Hue
   * @param s - Saturation
   * @param l - Lightness
   */
  async setColorHSL(n, h, f) {
    const l = Ht(n, h, f);
    return this.setColorRGB(l.r, l.g, l.b);
  }
}
class Wt {
  /** @ignore */
  constructor(n) {
    /** @ignore */
    T(this, "_light", 0);
    /** @ignore */
    T(this, "_heavy", 0);
    this.controller = n;
  }
  /**
   * Sends rumble data to the controller.
   * @ignore
   */
  updateRumble() {
    if (!this.controller.device)
      throw new Error(
        "Controller not initialized. You must call .init() first!"
      );
    return this.controller.sendLocalState();
  }
  /** Light Rumble Intensity (0-255) */
  get light() {
    return this._light;
  }
  set light(n) {
    this._light = Math.max(0, Math.min(255, n)), this.updateRumble();
  }
  /** Heavy Rumble Intensity (0-255) */
  get heavy() {
    return this._heavy;
  }
  set heavy(n) {
    this._heavy = Math.max(0, Math.min(255, n)), this.updateRumble();
  }
  /**
   * Set the rumble intensity
   * @param light - Light rumble intensity (0-255)
   * @param heavy - Heavy rumble intensity (0-255)
   */
  async setRumbleIntensity(n, h) {
    return this._light = Math.min(255, Math.max(0, n)), this._heavy = Math.min(255, Math.max(0, h)), this.updateRumble();
  }
}
function yt(c, n = 16) {
  const h = new Uint8Array(c), f = [];
  for (let l = 0; l < h.length; l += n) {
    const I = h.subarray(l, l + n), d = Array.from(I).map((B) => "0x" + B.toString(16).padStart(2, "0")).join(" "), s = Array.from(I).map((B) => B >= 32 && B <= 126 ? String.fromCharCode(B) : ".").join("");
    f.push(
      `${l.toString(16).padStart(4, "0")}: ${d} - ${s}`
    );
  }
  return f.join(`
`);
}
function z(c, n = 0) {
  const h = (c - 128) / 128;
  return Math.abs(h) <= n ? 0 : Math.min(1, Math.max(-1, h));
}
function mt(c, n = 0) {
  return Math.min(1, Math.max(n, c / 255));
}
class xt {
  constructor(n, h) {
    /** Internal WebHID device */
    T(this, "device");
    /** Internal Gamepad instance */
    T(this, "gamepad");
    /** Raw contents of the last HID Report sent by the controller. */
    T(this, "lastReport");
    /** Raw contents of the last HID Report sent to the controller. */
    T(this, "lastSentReport");
    /** Current controller state */
    T(this, "state", qt);
    /** Allows lightbar control */
    T(this, "lightbar", new Vt(this));
    /** Allows rumble control */
    T(this, "rumble", new Wt(this));
    T(this, "miscData", "");
    T(this, "volume", [56, 56, 0, 79]);
    this.device = n, this.gamepad = h;
  }
  /* getNameOfControllerType(controllerType: Number): any {
    return DualShock4ControllerType[controllerType]
      ? DualShock4ControllerType[controllerType]
      : `Unknown Type: 0x${controllerType.toString(16).padStart(2, "0")}`;
  } */
  async init() {
    this.device.opened || (this.device.open(), this.device.oninputreport = (n) => this.processControllerReport(n));
  }
  /**
   * Parses a report sent from the controller and updates the state.
   *
   * This function is called internally by the library each time a report is received.
   *
   * @param report - HID Report sent by the controller.
   */
  processControllerReport(n) {
    const { data: h } = n;
    if (this.lastReport = h.buffer, this.miscData = `HID:
${yt(
      h.buffer.slice(0, 9)
    )}

Data:
${yt(h.buffer.slice(10))}`, this.state.interface === O.Disconnected) {
      if (h.byteLength === 63)
        this.state.interface = O.USB;
      else {
        this.state.interface = O.Bluetooth, this.device.receiveFeatureReport(2);
        return;
      }
      this.lightbar.setColorRGB(0, 0, 64).catch((f) => console.error(f));
    }
    this.state.timestamp = n.timeStamp, this.state.interface === O.USB && n.reportId === 1 ? this.updateState(h) : this.state.interface === O.Bluetooth && n.reportId === 17 && (this.updateState(new DataView(h.buffer, 2)), this.device.receiveFeatureReport(2));
  }
  /**
   * Updates the controller state using normalized data from the last report.
   *
   * This function is called internally by the library each time a report is received.
   *
   * @param data - Normalized data from the HID report.
   */
  updateState(n) {
    this.state.axes.leftStickX = z(n.getUint8(0)), this.state.axes.leftStickY = z(n.getUint8(1)), this.state.axes.rightStickX = z(n.getUint8(2)), this.state.axes.rightStickY = z(n.getUint8(3));
    const h = n.getUint8(4);
    this.state.buttons.triangle = !!(h & 128), this.state.buttons.circle = !!(h & 64), this.state.buttons.cross = !!(h & 32), this.state.buttons.square = !!(h & 16);
    const f = h & 15;
    this.state.buttons.dPadUp = f === 7 || f === 0 || f === 1, this.state.buttons.dPadRight = f === 1 || f === 2 || f === 3, this.state.buttons.dPadDown = f === 3 || f === 4 || f === 5, this.state.buttons.dPadLeft = f === 5 || f === 6 || f === 7;
    const l = n.getUint8(5);
    this.state.buttons.l1 = !!(l & 1), this.state.buttons.r1 = !!(l & 2), this.state.buttons.l2 = !!(l & 4), this.state.buttons.r2 = !!(l & 8), this.state.buttons.share = !!(l & 16), this.state.buttons.options = !!(l & 32), this.state.buttons.l3 = !!(l & 64), this.state.buttons.r3 = !!(l & 128);
    const I = n.getUint8(6);
    switch (this.state.buttons.playStation = !!(I & 1), this.state.buttons.touchPadClick = !!(I & 2), this.state.controllerType) {
      case rt.Gamepad:
        this.state.axes.l2 = mt(n.getUint8(7)), this.state.axes.r2 = mt(n.getUint8(8)), this.state.charging = !!(n.getUint8(29) & 16), this.state.charging ? this.state.battery = Math.min(
          Math.floor((n.getUint8(29) & 15) * 100 / 11)
        ) : this.state.battery = Math.min(
          100,
          Math.floor((n.getUint8(29) & 15) * 100 / 8)
        ), this.state.headphones = !!(n.getUint8(29) & 32), this.state.microphone = !!(n.getUint8(29) & 64), this.state.extension = !!(n.getUint8(29) & 128), this.state.headphones && this.state.microphone ? this.state.audio = "headset" : this.state.headphones && !this.state.microphone ? this.state.audio = "headphones" : !this.state.headphones && this.state.microphone ? this.state.audio = "microphone" : this.state.audio = "volume-high", this.state.axes.gyroX = n.getUint16(13), this.state.axes.gyroY = n.getUint16(15), this.state.axes.gyroZ = n.getUint16(17), this.state.axes.accelX = n.getInt16(19), this.state.axes.accelY = n.getInt16(21), this.state.axes.accelZ = n.getInt16(23), this.state.touchpad.touches = [], n.getUint8(34) & 128 || this.state.touchpad.touches.push({
          touchId: n.getUint8(34) & 127,
          x: (n.getUint8(36) & 15) << 8 | n.getUint8(35),
          y: n.getUint8(37) << 4 | (n.getUint8(36) & 240) >> 4
        }), n.getUint8(38) & 128 || this.state.touchpad.touches.push({
          touchId: n.getUint8(38) & 127,
          x: (n.getUint8(40) & 15) << 8 | n.getUint8(39),
          y: n.getUint8(41) << 4 | (n.getUint8(40) & 240) >> 4
        });
        break;
      case rt.HOTAS:
    }
  }
  /**
   * Sends the local rumble and lightbar state to the controller.
   *
   * This function is called automatically in most cases.
   *
   * **Currently broken over Bluetooth, doesn't do anything**
   */
  async sendLocalState() {
    if (!this.device)
      throw new Error(
        "Controller not initialized. You must call .init() first!"
      );
    if (this.state.interface === O.USB) {
      const n = new Uint8Array(16);
      return n[0] = 5, n[1] = 255, n[4] = this.rumble.light, n[5] = this.rumble.heavy, n[6] = this.lightbar.r, n[7] = this.lightbar.g, n[8] = this.lightbar.b, n[9] = this.lightbar.blinkOn, n[10] = this.lightbar.blinkOff, this.lastSentReport = n.buffer, this.device.sendReport(n[0], n.slice(1));
    } else {
      console.log("sending report via bluetooth");
      const n = [
        162,
        // Header
        17,
        // Report ID
        192,
        // Poll Rate
        160,
        243,
        4,
        0,
        this.rumble.light,
        // Light rumble motor
        this.rumble.heavy,
        // Heavy rumble motor
        this.lightbar.r,
        // Lightbar Red
        this.lightbar.g,
        // Lightbar Green
        this.lightbar.b,
        // Lightbar Blue
        this.lightbar.blinkOn,
        // Lightbar Blink On
        this.lightbar.blinkOff,
        // Lightbar Blink Off
        0,
        // Padding
        0,
        // Padding
        0,
        // Padding
        0,
        // Padding
        0,
        // Padding
        0,
        // Padding
        0,
        // Padding
        0,
        // Padding
        this.volume[0],
        //LEFT VOLUME
        this.volume[1],
        //RIGHT VOLUME
        this.volume[2],
        // MIC VOLUME
        this.volume[3],
        // SPEAKER VOLUME
        133,
        0,
        0,
        0,
        0,
        // Padding
        0,
        0,
        0,
        0,
        // Padding
        0,
        0,
        0,
        0,
        // Padding
        0,
        0,
        0,
        0,
        // Padding
        0,
        0,
        0,
        0,
        // Padding
        0,
        0,
        0,
        0,
        // Padding
        0,
        0,
        0,
        0,
        // Padding
        0,
        0,
        0,
        0,
        // Padding
        0,
        0,
        0,
        0,
        // Padding
        0,
        0,
        0,
        0,
        // Padding
        0,
        0,
        0,
        0,
        // Padding
        0,
        0,
        0,
        0
        // Padding
      ], h = wt(n);
      n[75] = h[0], n[76] = h[1], n[77] = h[2], n[78] = h[3], n.shift(), n.shift();
      const f = tt.Buffer.from(n);
      return this.lastSentReport = f.buffer, this.device.sendReport(17, f);
    }
  }
  /**
   * Set the volume levels for the controller.
   * leftVolume - The volume level for the left speaker (0-255).
   * rightVolume - The volume level for the right speaker (0-255).
   * micVolume - The volume level for the microphone (0-255).
   * speakerVolume - The volume level for the speaker (0-79).
   */
  async setVolume(n, h, f, l) {
    if (!this.device)
      throw new Error(
        "Controller not initialized. You must call .init() first!"
      );
    this.volume = [n, h, f, l], await this.sendLocalState();
  }
  /**
   * Sets the color for the light bar.
   * @param red
   * @param green
   * @param blue
   */
  async setLightBarColor(n, h, f) {
    if (!this.device)
      throw new Error(
        "Controller not initialized. You must call .init() first!"
      );
    this.lightbar.setColorRGB(n, h, f), await this.sendLocalState();
  }
  /**
   * Sets the rumble light and heavy intensity.
   * @param light 0 - 255
   * @param heavy 0 - 255
   */
  async setRumbleIntensity(n, h) {
    if (!this.device)
      throw new Error(
        "Controller not initialized. You must call .init() first!"
      );
    await this.rumble.setRumbleIntensity(n, h);
  }
  /**
   *
   * @param musicFile SRC Music file
   * Given a SRC music file, send over the controller
   */
  async sendMusic(n) {
    if (!this.device)
      throw new Error(
        "Controller not initialized. You must call .init() first!"
      );
    if (this.state.interface !== O.Bluetooth)
      throw new Error("sendMusic is only supported over Bluetooth");
    const h = [4, 8, 12, 16], f = 0, l = 1, I = 3, d = new FileReader();
    d.onload = async () => {
      const s = d.result, B = tt.Buffer.from(s);
      let R = 0, b = 0;
      const m = tt.Buffer.alloc(527);
      for (; b < B.length; ) {
        m.fill(0);
        let A = 0;
        m[0] = 162, m[1] = 24, m[2] = 72, m[3] = 162, A = 4, m[A++] = R & 255, m[A++] = R >>> 8 & 255, m[A++] = 2;
        const p = 523;
        let y = 0;
        do {
          if (B.readUint8(b) !== 156)
            throw new Error("Invalid SBC data");
          const w = B.readUint8(b + 1), E = h[w >>> 4 & 3], U = w >>> 2 & 3, k = w & 1 ? 8 : 4, v = B.readUint8(b + 2), S = U === f ? 1 : 2, V = U === I ? 1 : 0, $ = [f, l].includes(U) ? 4 + 4 * k * S / 8 + Math.ceil(E * S * v / 8) : 4 + 4 * k * S / 8 + Math.ceil((V * k + E * v) / 8);
          if (A + $ >= p)
            break;
          B.copy(m, A, b, b + $), b += $, A += $, y++;
        } while (A < p && b < B.length);
        const g = wt(m.subarray(0, 523));
        m[523] = g[0], m[524] = g[1], m[525] = g[2], m[526] = g[3], this.device.sendReport(24, m.subarray(2)).catch((w) => console.error(w)), await new Promise((w) => setTimeout(w, 15)), R = R + y & 65535;
      }
    }, d.readAsArrayBuffer(n);
  }
  getName() {
    return this.device.productName || "Unknown DualShock Device";
  }
}
class jt {
  constructor() {
    T(this, "events", {});
  }
  $on(n, h) {
    return this.events[n] || (this.events[n] = []), this.events[n].push(h), this;
  }
  $off(n, h) {
    const f = this.events[n];
    return f && (this.events[n] = f.filter(
      (l) => l !== h
    ), f.length === 0 && delete this.events[n]), this;
  }
  $once(n, h) {
    const f = (...l) => {
      this.$off(n, f), h.apply(this, l);
    };
    return this.$on(n, f);
  }
  $emit(n, ...h) {
    const f = this.events[n];
    f && f.forEach((l) => {
      l.apply(this, h);
    });
  }
}
class zt extends jt {
  constructor() {
    if (typeof navigator.hid > "u")
      throw alert("WebHID is not supported in this browser"), new Error("WebHID is not supported in this browser");
    if (typeof navigator.getGamepads > "u")
      throw alert("Gamepad API is not supported in this browser"), new Error("Gamepad API is not supported in this browser");
    super();
    T(this, "devices", []);
    window.addEventListener("gamepadconnected", (h) => {
      if (console.log("Gamepad connected:", h.gamepad), h.gamepad.id.includes("Wireless Controller") || h.gamepad.id.includes("DualShock 4") || h.gamepad.id.includes("DualSense")) {
        console.log("DualShock gamepad connected:", h.gamepad);
        const l = h.gamepad.id.match(/(0x)?([0-9a-fA-F]{4})/g), I = l ? l[0] : null, d = l ? l[1] : null;
        I && d ? (console.log(`Vendor ID: ${I}, Product ID: ${d}`), navigator.hid.requestDevice({
          filters: [
            {
              vendorId: parseInt(I, 16),
              productId: parseInt(d, 16)
            }
          ]
        }).then((s) => {
          if (s.length > 0) {
            const B = s[0];
            console.log("DualShock device found:", B);
            const R = new xt(B, h.gamepad);
            this.devices.push(R), this.$emit("deviceconnected", R);
          } else
            console.error("No DualShock device found");
        }).catch((s) => {
          console.error("Failed to request DualShock device:", s);
        })) : console.error(
          "Could not extract vendor and product IDs from gamepad ID"
        );
      }
    });
  }
  requestDevice() {
    return navigator.hid.requestDevice({
      filters: [
        // Official Sony Controllers
        { vendorId: 1356, productId: 2976 },
        { vendorId: 1356, productId: 1476 },
        { vendorId: 1356, productId: 2508 },
        { vendorId: 1356, productId: 1477 },
        // Razer Raiju
        { vendorId: 5426, productId: 4096 },
        { vendorId: 5426, productId: 4103 },
        { vendorId: 5426, productId: 4100 },
        { vendorId: 5426, productId: 4105 },
        // Nacon Revol
        { vendorId: 5227, productId: 3329 },
        { vendorId: 5227, productId: 3330 },
        { vendorId: 5227, productId: 3336 },
        // Other third party controllers
        { vendorId: 3853, productId: 238 },
        { vendorId: 30021, productId: 260 },
        { vendorId: 11925, productId: 30501 },
        { vendorId: 4544, productId: 16385 },
        { vendorId: 3090, productId: 22443 },
        { vendorId: 3090, productId: 3606 },
        { vendorId: 3853, productId: 132 }
      ]
    }).then((h) => {
      if (h.length > 0) {
        const f = h[0];
        console.log("DualShock device found:", f);
        const l = new xt(f);
        this.devices.push(l), this.$emit("deviceconnected", l);
      } else
        console.error("No DualShock device found");
    }).catch((h) => {
      console.error("Failed to request DualShock device:", h);
    }), this;
  }
  /**
   * Get the list of connected devices.
   * @returns {Array<DualShock4>} The list of connected devices.
   */
  getDevices() {
    return this.devices;
  }
  getDeviceAtIndex(h) {
    return h < 0 || h >= this.devices.length ? null : this.devices[h];
  }
}
window.DeviceManager = zt;
