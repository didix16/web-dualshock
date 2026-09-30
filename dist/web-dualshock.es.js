var te = Object.defineProperty;
var ee = (c, i, s) => i in c ? te(c, i, { enumerable: !0, configurable: !0, writable: !0, value: s }) : c[i] = s;
var w = (c, i, s) => ee(c, typeof i != "symbol" ? i + "" : i, s);
var Ct = {}, Bt = {}, Tt;
function ie() {
  if (Tt) return Bt;
  Tt = 1, Bt.byteLength = o, Bt.toByteArray = x, Bt.fromByteArray = k;
  for (var c = [], i = [], s = typeof Uint8Array < "u" ? Uint8Array : Array, h = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", f = 0, p = h.length; f < p; ++f)
    c[f] = h[f], i[h.charCodeAt(f)] = f;
  i[45] = 62, i[95] = 63;
  function d(g) {
    var U = g.length;
    if (U % 4 > 0)
      throw new Error("Invalid string. Length must be a multiple of 4");
    var E = g.indexOf("=");
    E === -1 && (E = U);
    var B = E === U ? 0 : 4 - E % 4;
    return [E, B];
  }
  function o(g) {
    var U = d(g), E = U[0], B = U[1];
    return (E + B) * 3 / 4 - B;
  }
  function y(g, U, E) {
    return (U + E) * 3 / 4 - E;
  }
  function x(g) {
    var U, E = d(g), B = E[0], R = E[1], _ = new s(y(g, B, R)), T = 0, O = R > 0 ? B - 4 : B, P;
    for (P = 0; P < O; P += 4)
      U = i[g.charCodeAt(P)] << 18 | i[g.charCodeAt(P + 1)] << 12 | i[g.charCodeAt(P + 2)] << 6 | i[g.charCodeAt(P + 3)], _[T++] = U >> 16 & 255, _[T++] = U >> 8 & 255, _[T++] = U & 255;
    return R === 2 && (U = i[g.charCodeAt(P)] << 2 | i[g.charCodeAt(P + 1)] >> 4, _[T++] = U & 255), R === 1 && (U = i[g.charCodeAt(P)] << 10 | i[g.charCodeAt(P + 1)] << 4 | i[g.charCodeAt(P + 2)] >> 2, _[T++] = U >> 8 & 255, _[T++] = U & 255), _;
  }
  function I(g) {
    return c[g >> 18 & 63] + c[g >> 12 & 63] + c[g >> 6 & 63] + c[g & 63];
  }
  function b(g, U, E) {
    for (var B, R = [], _ = U; _ < E; _ += 3)
      B = (g[_] << 16 & 16711680) + (g[_ + 1] << 8 & 65280) + (g[_ + 2] & 255), R.push(I(B));
    return R.join("");
  }
  function k(g) {
    for (var U, E = g.length, B = E % 3, R = [], _ = 16383, T = 0, O = E - B; T < O; T += _)
      R.push(b(g, T, T + _ > O ? O : T + _));
    return B === 1 ? (U = g[E - 1], R.push(
      c[U >> 2] + c[U << 4 & 63] + "=="
    )) : B === 2 && (U = (g[E - 2] << 8) + g[E - 1], R.push(
      c[U >> 10] + c[U >> 4 & 63] + c[U << 2 & 63] + "="
    )), R.join("");
  }
  return Bt;
}
var At = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
var Dt;
function re() {
  return Dt || (Dt = 1, At.read = function(c, i, s, h, f) {
    var p, d, o = f * 8 - h - 1, y = (1 << o) - 1, x = y >> 1, I = -7, b = s ? f - 1 : 0, k = s ? -1 : 1, g = c[i + b];
    for (b += k, p = g & (1 << -I) - 1, g >>= -I, I += o; I > 0; p = p * 256 + c[i + b], b += k, I -= 8)
      ;
    for (d = p & (1 << -I) - 1, p >>= -I, I += h; I > 0; d = d * 256 + c[i + b], b += k, I -= 8)
      ;
    if (p === 0)
      p = 1 - x;
    else {
      if (p === y)
        return d ? NaN : (g ? -1 : 1) * (1 / 0);
      d = d + Math.pow(2, h), p = p - x;
    }
    return (g ? -1 : 1) * d * Math.pow(2, p - h);
  }, At.write = function(c, i, s, h, f, p) {
    var d, o, y, x = p * 8 - f - 1, I = (1 << x) - 1, b = I >> 1, k = f === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, g = h ? 0 : p - 1, U = h ? 1 : -1, E = i < 0 || i === 0 && 1 / i < 0 ? 1 : 0;
    for (i = Math.abs(i), isNaN(i) || i === 1 / 0 ? (o = isNaN(i) ? 1 : 0, d = I) : (d = Math.floor(Math.log(i) / Math.LN2), i * (y = Math.pow(2, -d)) < 1 && (d--, y *= 2), d + b >= 1 ? i += k / y : i += k * Math.pow(2, 1 - b), i * y >= 2 && (d++, y /= 2), d + b >= I ? (o = 0, d = I) : d + b >= 1 ? (o = (i * y - 1) * Math.pow(2, f), d = d + b) : (o = i * Math.pow(2, b - 1) * Math.pow(2, f), d = 0)); f >= 8; c[s + g] = o & 255, g += U, o /= 256, f -= 8)
      ;
    for (d = d << f | o, x += f; x > 0; c[s + g] = d & 255, g += U, d /= 256, x -= 8)
      ;
    c[s + g - U] |= E * 128;
  }), At;
}
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
var Yt;
function ne() {
  return Yt || (Yt = 1, function(c) {
    const i = ie(), s = re(), h = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
    c.Buffer = o, c.SlowBuffer = _, c.INSPECT_MAX_BYTES = 50;
    const f = 2147483647;
    c.kMaxLength = f, o.TYPED_ARRAY_SUPPORT = p(), !o.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
      "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
    );
    function p() {
      try {
        const r = new Uint8Array(1), t = { foo: function() {
          return 42;
        } };
        return Object.setPrototypeOf(t, Uint8Array.prototype), Object.setPrototypeOf(r, t), r.foo() === 42;
      } catch {
        return !1;
      }
    }
    Object.defineProperty(o.prototype, "parent", {
      enumerable: !0,
      get: function() {
        if (o.isBuffer(this))
          return this.buffer;
      }
    }), Object.defineProperty(o.prototype, "offset", {
      enumerable: !0,
      get: function() {
        if (o.isBuffer(this))
          return this.byteOffset;
      }
    });
    function d(r) {
      if (r > f)
        throw new RangeError('The value "' + r + '" is invalid for option "size"');
      const t = new Uint8Array(r);
      return Object.setPrototypeOf(t, o.prototype), t;
    }
    function o(r, t, e) {
      if (typeof r == "number") {
        if (typeof t == "string")
          throw new TypeError(
            'The "string" argument must be of type string. Received type number'
          );
        return b(r);
      }
      return y(r, t, e);
    }
    o.poolSize = 8192;
    function y(r, t, e) {
      if (typeof r == "string")
        return k(r, t);
      if (ArrayBuffer.isView(r))
        return U(r);
      if (r == null)
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof r
        );
      if (W(r, ArrayBuffer) || r && W(r.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (W(r, SharedArrayBuffer) || r && W(r.buffer, SharedArrayBuffer)))
        return E(r, t, e);
      if (typeof r == "number")
        throw new TypeError(
          'The "value" argument must not be of type number. Received type number'
        );
      const n = r.valueOf && r.valueOf();
      if (n != null && n !== r)
        return o.from(n, t, e);
      const a = B(r);
      if (a) return a;
      if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof r[Symbol.toPrimitive] == "function")
        return o.from(r[Symbol.toPrimitive]("string"), t, e);
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof r
      );
    }
    o.from = function(r, t, e) {
      return y(r, t, e);
    }, Object.setPrototypeOf(o.prototype, Uint8Array.prototype), Object.setPrototypeOf(o, Uint8Array);
    function x(r) {
      if (typeof r != "number")
        throw new TypeError('"size" argument must be of type number');
      if (r < 0)
        throw new RangeError('The value "' + r + '" is invalid for option "size"');
    }
    function I(r, t, e) {
      return x(r), r <= 0 ? d(r) : t !== void 0 ? typeof e == "string" ? d(r).fill(t, e) : d(r).fill(t) : d(r);
    }
    o.alloc = function(r, t, e) {
      return I(r, t, e);
    };
    function b(r) {
      return x(r), d(r < 0 ? 0 : R(r) | 0);
    }
    o.allocUnsafe = function(r) {
      return b(r);
    }, o.allocUnsafeSlow = function(r) {
      return b(r);
    };
    function k(r, t) {
      if ((typeof t != "string" || t === "") && (t = "utf8"), !o.isEncoding(t))
        throw new TypeError("Unknown encoding: " + t);
      const e = T(r, t) | 0;
      let n = d(e);
      const a = n.write(r, t);
      return a !== e && (n = n.slice(0, a)), n;
    }
    function g(r) {
      const t = r.length < 0 ? 0 : R(r.length) | 0, e = d(t);
      for (let n = 0; n < t; n += 1)
        e[n] = r[n] & 255;
      return e;
    }
    function U(r) {
      if (W(r, Uint8Array)) {
        const t = new Uint8Array(r);
        return E(t.buffer, t.byteOffset, t.byteLength);
      }
      return g(r);
    }
    function E(r, t, e) {
      if (t < 0 || r.byteLength < t)
        throw new RangeError('"offset" is outside of buffer bounds');
      if (r.byteLength < t + (e || 0))
        throw new RangeError('"length" is outside of buffer bounds');
      let n;
      return t === void 0 && e === void 0 ? n = new Uint8Array(r) : e === void 0 ? n = new Uint8Array(r, t) : n = new Uint8Array(r, t, e), Object.setPrototypeOf(n, o.prototype), n;
    }
    function B(r) {
      if (o.isBuffer(r)) {
        const t = R(r.length) | 0, e = d(t);
        return e.length === 0 || r.copy(e, 0, 0, t), e;
      }
      if (r.length !== void 0)
        return typeof r.length != "number" || Pt(r.length) ? d(0) : g(r);
      if (r.type === "Buffer" && Array.isArray(r.data))
        return g(r.data);
    }
    function R(r) {
      if (r >= f)
        throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + f.toString(16) + " bytes");
      return r | 0;
    }
    function _(r) {
      return +r != r && (r = 0), o.alloc(+r);
    }
    o.isBuffer = function(t) {
      return t != null && t._isBuffer === !0 && t !== o.prototype;
    }, o.compare = function(t, e) {
      if (W(t, Uint8Array) && (t = o.from(t, t.offset, t.byteLength)), W(e, Uint8Array) && (e = o.from(e, e.offset, e.byteLength)), !o.isBuffer(t) || !o.isBuffer(e))
        throw new TypeError(
          'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
        );
      if (t === e) return 0;
      let n = t.length, a = e.length;
      for (let u = 0, l = Math.min(n, a); u < l; ++u)
        if (t[u] !== e[u]) {
          n = t[u], a = e[u];
          break;
        }
      return n < a ? -1 : a < n ? 1 : 0;
    }, o.isEncoding = function(t) {
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
    }, o.concat = function(t, e) {
      if (!Array.isArray(t))
        throw new TypeError('"list" argument must be an Array of Buffers');
      if (t.length === 0)
        return o.alloc(0);
      let n;
      if (e === void 0)
        for (e = 0, n = 0; n < t.length; ++n)
          e += t[n].length;
      const a = o.allocUnsafe(e);
      let u = 0;
      for (n = 0; n < t.length; ++n) {
        let l = t[n];
        if (W(l, Uint8Array))
          u + l.length > a.length ? (o.isBuffer(l) || (l = o.from(l)), l.copy(a, u)) : Uint8Array.prototype.set.call(
            a,
            l,
            u
          );
        else if (o.isBuffer(l))
          l.copy(a, u);
        else
          throw new TypeError('"list" argument must be an Array of Buffers');
        u += l.length;
      }
      return a;
    };
    function T(r, t) {
      if (o.isBuffer(r))
        return r.length;
      if (ArrayBuffer.isView(r) || W(r, ArrayBuffer))
        return r.byteLength;
      if (typeof r != "string")
        throw new TypeError(
          'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof r
        );
      const e = r.length, n = arguments.length > 2 && arguments[2] === !0;
      if (!n && e === 0) return 0;
      let a = !1;
      for (; ; )
        switch (t) {
          case "ascii":
          case "latin1":
          case "binary":
            return e;
          case "utf8":
          case "utf-8":
            return Ft(r).length;
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return e * 2;
          case "hex":
            return e >>> 1;
          case "base64":
            return Mt(r).length;
          default:
            if (a)
              return n ? -1 : Ft(r).length;
            t = ("" + t).toLowerCase(), a = !0;
        }
    }
    o.byteLength = T;
    function O(r, t, e) {
      let n = !1;
      if ((t === void 0 || t < 0) && (t = 0), t > this.length || ((e === void 0 || e > this.length) && (e = this.length), e <= 0) || (e >>>= 0, t >>>= 0, e <= t))
        return "";
      for (r || (r = "utf8"); ; )
        switch (r) {
          case "hex":
            return S(this, t, e);
          case "utf8":
          case "utf-8":
            return ot(this, t, e);
          case "ascii":
            return rt(this, t, e);
          case "latin1":
          case "binary":
            return xt(this, t, e);
          case "base64":
            return it(this, t, e);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return bt(this, t, e);
          default:
            if (n) throw new TypeError("Unknown encoding: " + r);
            r = (r + "").toLowerCase(), n = !0;
        }
    }
    o.prototype._isBuffer = !0;
    function P(r, t, e) {
      const n = r[t];
      r[t] = r[e], r[e] = n;
    }
    o.prototype.swap16 = function() {
      const t = this.length;
      if (t % 2 !== 0)
        throw new RangeError("Buffer size must be a multiple of 16-bits");
      for (let e = 0; e < t; e += 2)
        P(this, e, e + 1);
      return this;
    }, o.prototype.swap32 = function() {
      const t = this.length;
      if (t % 4 !== 0)
        throw new RangeError("Buffer size must be a multiple of 32-bits");
      for (let e = 0; e < t; e += 4)
        P(this, e, e + 3), P(this, e + 1, e + 2);
      return this;
    }, o.prototype.swap64 = function() {
      const t = this.length;
      if (t % 8 !== 0)
        throw new RangeError("Buffer size must be a multiple of 64-bits");
      for (let e = 0; e < t; e += 8)
        P(this, e, e + 7), P(this, e + 1, e + 6), P(this, e + 2, e + 5), P(this, e + 3, e + 4);
      return this;
    }, o.prototype.toString = function() {
      const t = this.length;
      return t === 0 ? "" : arguments.length === 0 ? ot(this, 0, t) : O.apply(this, arguments);
    }, o.prototype.toLocaleString = o.prototype.toString, o.prototype.equals = function(t) {
      if (!o.isBuffer(t)) throw new TypeError("Argument must be a Buffer");
      return this === t ? !0 : o.compare(this, t) === 0;
    }, o.prototype.inspect = function() {
      let t = "";
      const e = c.INSPECT_MAX_BYTES;
      return t = this.toString("hex", 0, e).replace(/(.{2})/g, "$1 ").trim(), this.length > e && (t += " ... "), "<Buffer " + t + ">";
    }, h && (o.prototype[h] = o.prototype.inspect), o.prototype.compare = function(t, e, n, a, u) {
      if (W(t, Uint8Array) && (t = o.from(t, t.offset, t.byteLength)), !o.isBuffer(t))
        throw new TypeError(
          'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof t
        );
      if (e === void 0 && (e = 0), n === void 0 && (n = t ? t.length : 0), a === void 0 && (a = 0), u === void 0 && (u = this.length), e < 0 || n > t.length || a < 0 || u > this.length)
        throw new RangeError("out of range index");
      if (a >= u && e >= n)
        return 0;
      if (a >= u)
        return -1;
      if (e >= n)
        return 1;
      if (e >>>= 0, n >>>= 0, a >>>= 0, u >>>= 0, this === t) return 0;
      let l = u - a, A = n - e;
      const L = Math.min(l, A), C = this.slice(a, u), M = t.slice(e, n);
      for (let F = 0; F < L; ++F)
        if (C[F] !== M[F]) {
          l = C[F], A = M[F];
          break;
        }
      return l < A ? -1 : A < l ? 1 : 0;
    };
    function st(r, t, e, n, a) {
      if (r.length === 0) return -1;
      if (typeof e == "string" ? (n = e, e = 0) : e > 2147483647 ? e = 2147483647 : e < -2147483648 && (e = -2147483648), e = +e, Pt(e) && (e = a ? 0 : r.length - 1), e < 0 && (e = r.length + e), e >= r.length) {
        if (a) return -1;
        e = r.length - 1;
      } else if (e < 0)
        if (a) e = 0;
        else return -1;
      if (typeof t == "string" && (t = o.from(t, n)), o.isBuffer(t))
        return t.length === 0 ? -1 : J(r, t, e, n, a);
      if (typeof t == "number")
        return t = t & 255, typeof Uint8Array.prototype.indexOf == "function" ? a ? Uint8Array.prototype.indexOf.call(r, t, e) : Uint8Array.prototype.lastIndexOf.call(r, t, e) : J(r, [t], e, n, a);
      throw new TypeError("val must be string, number or Buffer");
    }
    function J(r, t, e, n, a) {
      let u = 1, l = r.length, A = t.length;
      if (n !== void 0 && (n = String(n).toLowerCase(), n === "ucs2" || n === "ucs-2" || n === "utf16le" || n === "utf-16le")) {
        if (r.length < 2 || t.length < 2)
          return -1;
        u = 2, l /= 2, A /= 2, e /= 2;
      }
      function L(M, F) {
        return u === 1 ? M[F] : M.readUInt16BE(F * u);
      }
      let C;
      if (a) {
        let M = -1;
        for (C = e; C < l; C++)
          if (L(r, C) === L(t, M === -1 ? 0 : C - M)) {
            if (M === -1 && (M = C), C - M + 1 === A) return M * u;
          } else
            M !== -1 && (C -= C - M), M = -1;
      } else
        for (e + A > l && (e = l - A), C = e; C >= 0; C--) {
          let M = !0;
          for (let F = 0; F < A; F++)
            if (L(r, C + F) !== L(t, F)) {
              M = !1;
              break;
            }
          if (M) return C;
        }
      return -1;
    }
    o.prototype.includes = function(t, e, n) {
      return this.indexOf(t, e, n) !== -1;
    }, o.prototype.indexOf = function(t, e, n) {
      return st(this, t, e, n, !0);
    }, o.prototype.lastIndexOf = function(t, e, n) {
      return st(this, t, e, n, !1);
    };
    function gt(r, t, e, n) {
      e = Number(e) || 0;
      const a = r.length - e;
      n ? (n = Number(n), n > a && (n = a)) : n = a;
      const u = t.length;
      n > u / 2 && (n = u / 2);
      let l;
      for (l = 0; l < n; ++l) {
        const A = parseInt(t.substr(l * 2, 2), 16);
        if (Pt(A)) return l;
        r[e + l] = A;
      }
      return l;
    }
    function tt(r, t, e, n) {
      return It(Ft(t, r.length - e), r, e, n);
    }
    function yt(r, t, e, n) {
      return It(jt(t), r, e, n);
    }
    function et(r, t, e, n) {
      return It(Mt(t), r, e, n);
    }
    function mt(r, t, e, n) {
      return It(Jt(t, r.length - e), r, e, n);
    }
    o.prototype.write = function(t, e, n, a) {
      if (e === void 0)
        a = "utf8", n = this.length, e = 0;
      else if (n === void 0 && typeof e == "string")
        a = e, n = this.length, e = 0;
      else if (isFinite(e))
        e = e >>> 0, isFinite(n) ? (n = n >>> 0, a === void 0 && (a = "utf8")) : (a = n, n = void 0);
      else
        throw new Error(
          "Buffer.write(string, encoding, offset[, length]) is no longer supported"
        );
      const u = this.length - e;
      if ((n === void 0 || n > u) && (n = u), t.length > 0 && (n < 0 || e < 0) || e > this.length)
        throw new RangeError("Attempt to write outside buffer bounds");
      a || (a = "utf8");
      let l = !1;
      for (; ; )
        switch (a) {
          case "hex":
            return gt(this, t, e, n);
          case "utf8":
          case "utf-8":
            return tt(this, t, e, n);
          case "ascii":
          case "latin1":
          case "binary":
            return yt(this, t, e, n);
          case "base64":
            return et(this, t, e, n);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return mt(this, t, e, n);
          default:
            if (l) throw new TypeError("Unknown encoding: " + a);
            a = ("" + a).toLowerCase(), l = !0;
        }
    }, o.prototype.toJSON = function() {
      return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
      };
    };
    function it(r, t, e) {
      return t === 0 && e === r.length ? i.fromByteArray(r) : i.fromByteArray(r.slice(t, e));
    }
    function ot(r, t, e) {
      e = Math.min(r.length, e);
      const n = [];
      let a = t;
      for (; a < e; ) {
        const u = r[a];
        let l = null, A = u > 239 ? 4 : u > 223 ? 3 : u > 191 ? 2 : 1;
        if (a + A <= e) {
          let L, C, M, F;
          switch (A) {
            case 1:
              u < 128 && (l = u);
              break;
            case 2:
              L = r[a + 1], (L & 192) === 128 && (F = (u & 31) << 6 | L & 63, F > 127 && (l = F));
              break;
            case 3:
              L = r[a + 1], C = r[a + 2], (L & 192) === 128 && (C & 192) === 128 && (F = (u & 15) << 12 | (L & 63) << 6 | C & 63, F > 2047 && (F < 55296 || F > 57343) && (l = F));
              break;
            case 4:
              L = r[a + 1], C = r[a + 2], M = r[a + 3], (L & 192) === 128 && (C & 192) === 128 && (M & 192) === 128 && (F = (u & 15) << 18 | (L & 63) << 12 | (C & 63) << 6 | M & 63, F > 65535 && F < 1114112 && (l = F));
          }
        }
        l === null ? (l = 65533, A = 1) : l > 65535 && (l -= 65536, n.push(l >>> 10 & 1023 | 55296), l = 56320 | l & 1023), n.push(l), a += A;
      }
      return wt(n);
    }
    const at = 4096;
    function wt(r) {
      const t = r.length;
      if (t <= at)
        return String.fromCharCode.apply(String, r);
      let e = "", n = 0;
      for (; n < t; )
        e += String.fromCharCode.apply(
          String,
          r.slice(n, n += at)
        );
      return e;
    }
    function rt(r, t, e) {
      let n = "";
      e = Math.min(r.length, e);
      for (let a = t; a < e; ++a)
        n += String.fromCharCode(r[a] & 127);
      return n;
    }
    function xt(r, t, e) {
      let n = "";
      e = Math.min(r.length, e);
      for (let a = t; a < e; ++a)
        n += String.fromCharCode(r[a]);
      return n;
    }
    function S(r, t, e) {
      const n = r.length;
      (!t || t < 0) && (t = 0), (!e || e < 0 || e > n) && (e = n);
      let a = "";
      for (let u = t; u < e; ++u)
        a += Kt[r[u]];
      return a;
    }
    function bt(r, t, e) {
      const n = r.slice(t, e);
      let a = "";
      for (let u = 0; u < n.length - 1; u += 2)
        a += String.fromCharCode(n[u] + n[u + 1] * 256);
      return a;
    }
    o.prototype.slice = function(t, e) {
      const n = this.length;
      t = ~~t, e = e === void 0 ? n : ~~e, t < 0 ? (t += n, t < 0 && (t = 0)) : t > n && (t = n), e < 0 ? (e += n, e < 0 && (e = 0)) : e > n && (e = n), e < t && (e = t);
      const a = this.subarray(t, e);
      return Object.setPrototypeOf(a, o.prototype), a;
    };
    function v(r, t, e) {
      if (r % 1 !== 0 || r < 0) throw new RangeError("offset is not uint");
      if (r + t > e) throw new RangeError("Trying to access beyond buffer length");
    }
    o.prototype.readUintLE = o.prototype.readUIntLE = function(t, e, n) {
      t = t >>> 0, e = e >>> 0, n || v(t, e, this.length);
      let a = this[t], u = 1, l = 0;
      for (; ++l < e && (u *= 256); )
        a += this[t + l] * u;
      return a;
    }, o.prototype.readUintBE = o.prototype.readUIntBE = function(t, e, n) {
      t = t >>> 0, e = e >>> 0, n || v(t, e, this.length);
      let a = this[t + --e], u = 1;
      for (; e > 0 && (u *= 256); )
        a += this[t + --e] * u;
      return a;
    }, o.prototype.readUint8 = o.prototype.readUInt8 = function(t, e) {
      return t = t >>> 0, e || v(t, 1, this.length), this[t];
    }, o.prototype.readUint16LE = o.prototype.readUInt16LE = function(t, e) {
      return t = t >>> 0, e || v(t, 2, this.length), this[t] | this[t + 1] << 8;
    }, o.prototype.readUint16BE = o.prototype.readUInt16BE = function(t, e) {
      return t = t >>> 0, e || v(t, 2, this.length), this[t] << 8 | this[t + 1];
    }, o.prototype.readUint32LE = o.prototype.readUInt32LE = function(t, e) {
      return t = t >>> 0, e || v(t, 4, this.length), (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + this[t + 3] * 16777216;
    }, o.prototype.readUint32BE = o.prototype.readUInt32BE = function(t, e) {
      return t = t >>> 0, e || v(t, 4, this.length), this[t] * 16777216 + (this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]);
    }, o.prototype.readBigUInt64LE = K(function(t) {
      t = t >>> 0, N(t, "offset");
      const e = this[t], n = this[t + 7];
      (e === void 0 || n === void 0) && V(t, this.length - 8);
      const a = e + this[++t] * 2 ** 8 + this[++t] * 2 ** 16 + this[++t] * 2 ** 24, u = this[++t] + this[++t] * 2 ** 8 + this[++t] * 2 ** 16 + n * 2 ** 24;
      return BigInt(a) + (BigInt(u) << BigInt(32));
    }), o.prototype.readBigUInt64BE = K(function(t) {
      t = t >>> 0, N(t, "offset");
      const e = this[t], n = this[t + 7];
      (e === void 0 || n === void 0) && V(t, this.length - 8);
      const a = e * 2 ** 24 + this[++t] * 2 ** 16 + this[++t] * 2 ** 8 + this[++t], u = this[++t] * 2 ** 24 + this[++t] * 2 ** 16 + this[++t] * 2 ** 8 + n;
      return (BigInt(a) << BigInt(32)) + BigInt(u);
    }), o.prototype.readIntLE = function(t, e, n) {
      t = t >>> 0, e = e >>> 0, n || v(t, e, this.length);
      let a = this[t], u = 1, l = 0;
      for (; ++l < e && (u *= 256); )
        a += this[t + l] * u;
      return u *= 128, a >= u && (a -= Math.pow(2, 8 * e)), a;
    }, o.prototype.readIntBE = function(t, e, n) {
      t = t >>> 0, e = e >>> 0, n || v(t, e, this.length);
      let a = e, u = 1, l = this[t + --a];
      for (; a > 0 && (u *= 256); )
        l += this[t + --a] * u;
      return u *= 128, l >= u && (l -= Math.pow(2, 8 * e)), l;
    }, o.prototype.readInt8 = function(t, e) {
      return t = t >>> 0, e || v(t, 1, this.length), this[t] & 128 ? (255 - this[t] + 1) * -1 : this[t];
    }, o.prototype.readInt16LE = function(t, e) {
      t = t >>> 0, e || v(t, 2, this.length);
      const n = this[t] | this[t + 1] << 8;
      return n & 32768 ? n | 4294901760 : n;
    }, o.prototype.readInt16BE = function(t, e) {
      t = t >>> 0, e || v(t, 2, this.length);
      const n = this[t + 1] | this[t] << 8;
      return n & 32768 ? n | 4294901760 : n;
    }, o.prototype.readInt32LE = function(t, e) {
      return t = t >>> 0, e || v(t, 4, this.length), this[t] | this[t + 1] << 8 | this[t + 2] << 16 | this[t + 3] << 24;
    }, o.prototype.readInt32BE = function(t, e) {
      return t = t >>> 0, e || v(t, 4, this.length), this[t] << 24 | this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3];
    }, o.prototype.readBigInt64LE = K(function(t) {
      t = t >>> 0, N(t, "offset");
      const e = this[t], n = this[t + 7];
      (e === void 0 || n === void 0) && V(t, this.length - 8);
      const a = this[t + 4] + this[t + 5] * 2 ** 8 + this[t + 6] * 2 ** 16 + (n << 24);
      return (BigInt(a) << BigInt(32)) + BigInt(e + this[++t] * 2 ** 8 + this[++t] * 2 ** 16 + this[++t] * 2 ** 24);
    }), o.prototype.readBigInt64BE = K(function(t) {
      t = t >>> 0, N(t, "offset");
      const e = this[t], n = this[t + 7];
      (e === void 0 || n === void 0) && V(t, this.length - 8);
      const a = (e << 24) + // Overflow
      this[++t] * 2 ** 16 + this[++t] * 2 ** 8 + this[++t];
      return (BigInt(a) << BigInt(32)) + BigInt(this[++t] * 2 ** 24 + this[++t] * 2 ** 16 + this[++t] * 2 ** 8 + n);
    }), o.prototype.readFloatLE = function(t, e) {
      return t = t >>> 0, e || v(t, 4, this.length), s.read(this, t, !0, 23, 4);
    }, o.prototype.readFloatBE = function(t, e) {
      return t = t >>> 0, e || v(t, 4, this.length), s.read(this, t, !1, 23, 4);
    }, o.prototype.readDoubleLE = function(t, e) {
      return t = t >>> 0, e || v(t, 8, this.length), s.read(this, t, !0, 52, 8);
    }, o.prototype.readDoubleBE = function(t, e) {
      return t = t >>> 0, e || v(t, 8, this.length), s.read(this, t, !1, 52, 8);
    };
    function D(r, t, e, n, a, u) {
      if (!o.isBuffer(r)) throw new TypeError('"buffer" argument must be a Buffer instance');
      if (t > a || t < u) throw new RangeError('"value" argument is out of bounds');
      if (e + n > r.length) throw new RangeError("Index out of range");
    }
    o.prototype.writeUintLE = o.prototype.writeUIntLE = function(t, e, n, a) {
      if (t = +t, e = e >>> 0, n = n >>> 0, !a) {
        const A = Math.pow(2, 8 * n) - 1;
        D(this, t, e, n, A, 0);
      }
      let u = 1, l = 0;
      for (this[e] = t & 255; ++l < n && (u *= 256); )
        this[e + l] = t / u & 255;
      return e + n;
    }, o.prototype.writeUintBE = o.prototype.writeUIntBE = function(t, e, n, a) {
      if (t = +t, e = e >>> 0, n = n >>> 0, !a) {
        const A = Math.pow(2, 8 * n) - 1;
        D(this, t, e, n, A, 0);
      }
      let u = n - 1, l = 1;
      for (this[e + u] = t & 255; --u >= 0 && (l *= 256); )
        this[e + u] = t / l & 255;
      return e + n;
    }, o.prototype.writeUint8 = o.prototype.writeUInt8 = function(t, e, n) {
      return t = +t, e = e >>> 0, n || D(this, t, e, 1, 255, 0), this[e] = t & 255, e + 1;
    }, o.prototype.writeUint16LE = o.prototype.writeUInt16LE = function(t, e, n) {
      return t = +t, e = e >>> 0, n || D(this, t, e, 2, 65535, 0), this[e] = t & 255, this[e + 1] = t >>> 8, e + 2;
    }, o.prototype.writeUint16BE = o.prototype.writeUInt16BE = function(t, e, n) {
      return t = +t, e = e >>> 0, n || D(this, t, e, 2, 65535, 0), this[e] = t >>> 8, this[e + 1] = t & 255, e + 2;
    }, o.prototype.writeUint32LE = o.prototype.writeUInt32LE = function(t, e, n) {
      return t = +t, e = e >>> 0, n || D(this, t, e, 4, 4294967295, 0), this[e + 3] = t >>> 24, this[e + 2] = t >>> 16, this[e + 1] = t >>> 8, this[e] = t & 255, e + 4;
    }, o.prototype.writeUint32BE = o.prototype.writeUInt32BE = function(t, e, n) {
      return t = +t, e = e >>> 0, n || D(this, t, e, 4, 4294967295, 0), this[e] = t >>> 24, this[e + 1] = t >>> 16, this[e + 2] = t >>> 8, this[e + 3] = t & 255, e + 4;
    };
    function ct(r, t, e, n, a) {
      q(t, n, a, r, e, 7);
      let u = Number(t & BigInt(4294967295));
      r[e++] = u, u = u >> 8, r[e++] = u, u = u >> 8, r[e++] = u, u = u >> 8, r[e++] = u;
      let l = Number(t >> BigInt(32) & BigInt(4294967295));
      return r[e++] = l, l = l >> 8, r[e++] = l, l = l >> 8, r[e++] = l, l = l >> 8, r[e++] = l, e;
    }
    function ht(r, t, e, n, a) {
      q(t, n, a, r, e, 7);
      let u = Number(t & BigInt(4294967295));
      r[e + 7] = u, u = u >> 8, r[e + 6] = u, u = u >> 8, r[e + 5] = u, u = u >> 8, r[e + 4] = u;
      let l = Number(t >> BigInt(32) & BigInt(4294967295));
      return r[e + 3] = l, l = l >> 8, r[e + 2] = l, l = l >> 8, r[e + 1] = l, l = l >> 8, r[e] = l, e + 8;
    }
    o.prototype.writeBigUInt64LE = K(function(t, e = 0) {
      return ct(this, t, e, BigInt(0), BigInt("0xffffffffffffffff"));
    }), o.prototype.writeBigUInt64BE = K(function(t, e = 0) {
      return ht(this, t, e, BigInt(0), BigInt("0xffffffffffffffff"));
    }), o.prototype.writeIntLE = function(t, e, n, a) {
      if (t = +t, e = e >>> 0, !a) {
        const L = Math.pow(2, 8 * n - 1);
        D(this, t, e, n, L - 1, -L);
      }
      let u = 0, l = 1, A = 0;
      for (this[e] = t & 255; ++u < n && (l *= 256); )
        t < 0 && A === 0 && this[e + u - 1] !== 0 && (A = 1), this[e + u] = (t / l >> 0) - A & 255;
      return e + n;
    }, o.prototype.writeIntBE = function(t, e, n, a) {
      if (t = +t, e = e >>> 0, !a) {
        const L = Math.pow(2, 8 * n - 1);
        D(this, t, e, n, L - 1, -L);
      }
      let u = n - 1, l = 1, A = 0;
      for (this[e + u] = t & 255; --u >= 0 && (l *= 256); )
        t < 0 && A === 0 && this[e + u + 1] !== 0 && (A = 1), this[e + u] = (t / l >> 0) - A & 255;
      return e + n;
    }, o.prototype.writeInt8 = function(t, e, n) {
      return t = +t, e = e >>> 0, n || D(this, t, e, 1, 127, -128), t < 0 && (t = 255 + t + 1), this[e] = t & 255, e + 1;
    }, o.prototype.writeInt16LE = function(t, e, n) {
      return t = +t, e = e >>> 0, n || D(this, t, e, 2, 32767, -32768), this[e] = t & 255, this[e + 1] = t >>> 8, e + 2;
    }, o.prototype.writeInt16BE = function(t, e, n) {
      return t = +t, e = e >>> 0, n || D(this, t, e, 2, 32767, -32768), this[e] = t >>> 8, this[e + 1] = t & 255, e + 2;
    }, o.prototype.writeInt32LE = function(t, e, n) {
      return t = +t, e = e >>> 0, n || D(this, t, e, 4, 2147483647, -2147483648), this[e] = t & 255, this[e + 1] = t >>> 8, this[e + 2] = t >>> 16, this[e + 3] = t >>> 24, e + 4;
    }, o.prototype.writeInt32BE = function(t, e, n) {
      return t = +t, e = e >>> 0, n || D(this, t, e, 4, 2147483647, -2147483648), t < 0 && (t = 4294967295 + t + 1), this[e] = t >>> 24, this[e + 1] = t >>> 16, this[e + 2] = t >>> 8, this[e + 3] = t & 255, e + 4;
    }, o.prototype.writeBigInt64LE = K(function(t, e = 0) {
      return ct(this, t, e, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    }), o.prototype.writeBigInt64BE = K(function(t, e = 0) {
      return ht(this, t, e, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    function ut(r, t, e, n, a, u) {
      if (e + n > r.length) throw new RangeError("Index out of range");
      if (e < 0) throw new RangeError("Index out of range");
    }
    function lt(r, t, e, n, a) {
      return t = +t, e = e >>> 0, a || ut(r, t, e, 4), s.write(r, t, e, n, 23, 4), e + 4;
    }
    o.prototype.writeFloatLE = function(t, e, n) {
      return lt(this, t, e, !0, n);
    }, o.prototype.writeFloatBE = function(t, e, n) {
      return lt(this, t, e, !1, n);
    };
    function ft(r, t, e, n, a) {
      return t = +t, e = e >>> 0, a || ut(r, t, e, 8), s.write(r, t, e, n, 52, 8), e + 8;
    }
    o.prototype.writeDoubleLE = function(t, e, n) {
      return ft(this, t, e, !0, n);
    }, o.prototype.writeDoubleBE = function(t, e, n) {
      return ft(this, t, e, !1, n);
    }, o.prototype.copy = function(t, e, n, a) {
      if (!o.isBuffer(t)) throw new TypeError("argument should be a Buffer");
      if (n || (n = 0), !a && a !== 0 && (a = this.length), e >= t.length && (e = t.length), e || (e = 0), a > 0 && a < n && (a = n), a === n || t.length === 0 || this.length === 0) return 0;
      if (e < 0)
        throw new RangeError("targetStart out of bounds");
      if (n < 0 || n >= this.length) throw new RangeError("Index out of range");
      if (a < 0) throw new RangeError("sourceEnd out of bounds");
      a > this.length && (a = this.length), t.length - e < a - n && (a = t.length - e + n);
      const u = a - n;
      return this === t && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(e, n, a) : Uint8Array.prototype.set.call(
        t,
        this.subarray(n, a),
        e
      ), u;
    }, o.prototype.fill = function(t, e, n, a) {
      if (typeof t == "string") {
        if (typeof e == "string" ? (a = e, e = 0, n = this.length) : typeof n == "string" && (a = n, n = this.length), a !== void 0 && typeof a != "string")
          throw new TypeError("encoding must be a string");
        if (typeof a == "string" && !o.isEncoding(a))
          throw new TypeError("Unknown encoding: " + a);
        if (t.length === 1) {
          const l = t.charCodeAt(0);
          (a === "utf8" && l < 128 || a === "latin1") && (t = l);
        }
      } else typeof t == "number" ? t = t & 255 : typeof t == "boolean" && (t = Number(t));
      if (e < 0 || this.length < e || this.length < n)
        throw new RangeError("Out of range index");
      if (n <= e)
        return this;
      e = e >>> 0, n = n === void 0 ? this.length : n >>> 0, t || (t = 0);
      let u;
      if (typeof t == "number")
        for (u = e; u < n; ++u)
          this[u] = t;
      else {
        const l = o.isBuffer(t) ? t : o.from(t, a), A = l.length;
        if (A === 0)
          throw new TypeError('The value "' + t + '" is invalid for argument "value"');
        for (u = 0; u < n - e; ++u)
          this[u + e] = l[u % A];
      }
      return this;
    };
    const Y = {};
    function G(r, t, e) {
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
        set code(a) {
          Object.defineProperty(this, "code", {
            configurable: !0,
            enumerable: !0,
            value: a,
            writable: !0
          });
        }
        toString() {
          return `${this.name} [${r}]: ${this.message}`;
        }
      };
    }
    G(
      "ERR_BUFFER_OUT_OF_BOUNDS",
      function(r) {
        return r ? `${r} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
      },
      RangeError
    ), G(
      "ERR_INVALID_ARG_TYPE",
      function(r, t) {
        return `The "${r}" argument must be of type number. Received type ${typeof t}`;
      },
      TypeError
    ), G(
      "ERR_OUT_OF_RANGE",
      function(r, t, e) {
        let n = `The value of "${r}" is out of range.`, a = e;
        return Number.isInteger(e) && Math.abs(e) > 2 ** 32 ? a = X(String(e)) : typeof e == "bigint" && (a = String(e), (e > BigInt(2) ** BigInt(32) || e < -(BigInt(2) ** BigInt(32))) && (a = X(a)), a += "n"), n += ` It must be ${t}. Received ${a}`, n;
      },
      RangeError
    );
    function X(r) {
      let t = "", e = r.length;
      const n = r[0] === "-" ? 1 : 0;
      for (; e >= n + 4; e -= 3)
        t = `_${r.slice(e - 3, e)}${t}`;
      return `${r.slice(0, e)}${t}`;
    }
    function z(r, t, e) {
      N(t, "offset"), (r[t] === void 0 || r[t + e] === void 0) && V(t, r.length - (e + 1));
    }
    function q(r, t, e, n, a, u) {
      if (r > e || r < t) {
        const l = typeof t == "bigint" ? "n" : "";
        let A;
        throw t === 0 || t === BigInt(0) ? A = `>= 0${l} and < 2${l} ** ${(u + 1) * 8}${l}` : A = `>= -(2${l} ** ${(u + 1) * 8 - 1}${l}) and < 2 ** ${(u + 1) * 8 - 1}${l}`, new Y.ERR_OUT_OF_RANGE("value", A, r);
      }
      z(n, a, u);
    }
    function N(r, t) {
      if (typeof r != "number")
        throw new Y.ERR_INVALID_ARG_TYPE(t, "number", r);
    }
    function V(r, t, e) {
      throw Math.floor(r) !== r ? (N(r, e), new Y.ERR_OUT_OF_RANGE("offset", "an integer", r)) : t < 0 ? new Y.ERR_BUFFER_OUT_OF_BOUNDS() : new Y.ERR_OUT_OF_RANGE(
        "offset",
        `>= 0 and <= ${t}`,
        r
      );
    }
    const Ut = /[^+/0-9A-Za-z-_]/g;
    function Et(r) {
      if (r = r.split("=")[0], r = r.trim().replace(Ut, ""), r.length < 2) return "";
      for (; r.length % 4 !== 0; )
        r = r + "=";
      return r;
    }
    function Ft(r, t) {
      t = t || 1 / 0;
      let e;
      const n = r.length;
      let a = null;
      const u = [];
      for (let l = 0; l < n; ++l) {
        if (e = r.charCodeAt(l), e > 55295 && e < 57344) {
          if (!a) {
            if (e > 56319) {
              (t -= 3) > -1 && u.push(239, 191, 189);
              continue;
            } else if (l + 1 === n) {
              (t -= 3) > -1 && u.push(239, 191, 189);
              continue;
            }
            a = e;
            continue;
          }
          if (e < 56320) {
            (t -= 3) > -1 && u.push(239, 191, 189), a = e;
            continue;
          }
          e = (a - 55296 << 10 | e - 56320) + 65536;
        } else a && (t -= 3) > -1 && u.push(239, 191, 189);
        if (a = null, e < 128) {
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
    function jt(r) {
      const t = [];
      for (let e = 0; e < r.length; ++e)
        t.push(r.charCodeAt(e) & 255);
      return t;
    }
    function Jt(r, t) {
      let e, n, a;
      const u = [];
      for (let l = 0; l < r.length && !((t -= 2) < 0); ++l)
        e = r.charCodeAt(l), n = e >> 8, a = e % 256, u.push(a), u.push(n);
      return u;
    }
    function Mt(r) {
      return i.toByteArray(Et(r));
    }
    function It(r, t, e, n) {
      let a;
      for (a = 0; a < n && !(a + e >= t.length || a >= r.length); ++a)
        t[a + e] = r[a];
      return a;
    }
    function W(r, t) {
      return r instanceof t || r != null && r.constructor != null && r.constructor.name != null && r.constructor.name === t.name;
    }
    function Pt(r) {
      return r !== r;
    }
    const Kt = function() {
      const r = "0123456789abcdef", t = new Array(256);
      for (let e = 0; e < 16; ++e) {
        const n = e * 16;
        for (let a = 0; a < 16; ++a)
          t[n + a] = r[e] + r[a];
      }
      return t;
    }();
    function K(r) {
      return typeof BigInt > "u" ? Qt : r;
    }
    function Qt() {
      throw new Error("BigInt not supported");
    }
  }(Ct)), Ct;
}
var se = ne();
async function qt(c) {
  if (c instanceof Blob) return new Uint8Array(await c.arrayBuffer());
  if (c instanceof Uint8Array) return new Uint8Array(c);
  if (c instanceof ArrayBuffer) return new Uint8Array(c.slice(0));
  throw new TypeError("Expected an SBC Blob, ArrayBuffer or Uint8Array");
}
function Nt(c, i) {
  const s = c >>> 7 ^ i;
  return (c << 1 ^ (s ? 29 : 0)) & 255;
}
function oe(c, i, s) {
  let h = 15;
  for (const f of [i + 1, i + 2])
    for (let p = 7; p >= 0; p--) h = Nt(h, c[f] >>> p & 1);
  for (let f = 0; f < s; f++)
    h = Nt(h, c[i + 4 + (f >>> 3)] >>> 7 - (f & 7) & 1);
  return h;
}
function Wt(c, i) {
  const s = (U) => {
    throw new Error(`Invalid SBC at byte ${i}: ${U}`);
  };
  if (!Number.isInteger(i) || i < 0 || i + 4 > c.length)
    return s("truncated header");
  if (c[i] !== 156) return s("expected SBC syncword 0x9c");
  const h = c[i + 1], f = [16e3, 32e3, 44100, 48e3][h >>> 6], p = [4, 8, 12, 16][h >>> 4 & 3], d = h >>> 2 & 3, o = h & 1 ? 8 : 4, y = d === 0 ? 1 : 2, x = c[i + 2];
  if (x < 2 || x > Math.min(250, (d < 2 ? 16 : 32) * o))
    return s("invalid bitpool");
  const I = d === 3 ? o : 0, b = 4 * o * y, k = p * x * (d < 2 ? y : 1), g = 4 + b / 8 + Math.ceil((I + k) / 8);
  return i + g > c.length ? s("truncated frame") : oe(c, i, b + I) !== c[i + 3] ? s("CRC mismatch") : { length: g, sampleRate: f, channels: y, samples: p * o, blocks: p, subbands: o, mode: d, bitpool: x };
}
function ae(c, i = 1 / 0) {
  if (!c.length) throw new Error("SBC data is empty");
  let s = 0, h = 0, f = 0, p = 0;
  for (let d = 0; d < c.length; ) {
    const o = Wt(c, d);
    if (o.length > i) throw new Error("SBC frame exceeds the HID packet capacity");
    if (p && (o.sampleRate !== s || o.channels !== h))
      throw new Error("SBC frequency and channel count must remain constant");
    s = o.sampleRate, h = o.channels, f += o.samples, p++, d += o.length;
  }
  return { sampleRate: s, channels: h, samples: f, frames: p };
}
var ce = function(d, o, y, x, I, b) {
  var d, o, y, x, I, b, k, g, U;
  switch (arguments.length == 2 && typeof arguments[1] == "object" ? (d = arguments[0], o = arguments[1].polynomial, y = arguments[1].initial, x = arguments[1].finalXor, I = arguments[1].inputReflected, b = arguments[1].resultReflected) : arguments.length == 6 && (d = arguments[0], o = arguments[1], y = arguments[2], x = arguments[3], I = arguments[4], b = arguments[5]), d) {
    case 8:
      g = 255;
      break;
    case 16:
      g = 65535;
      break;
    case 32:
      g = 4294967295;
      break;
    default:
      throw "Invalid CRC width";
  }
  U = 1 << d - 1, this.calcCrcTable = function() {
    k = new Array(256);
    for (var E = 0; E < 256; E++) {
      for (var B = E << d - 8 & g, R = 0; R < 8; R++)
        (B & U) != 0 ? (B <<= 1, B ^= o) : B <<= 1;
      k[E] = B & g;
    }
  }, this.calcCrcTableReversed = function() {
    k = new Array(256);
    for (var E = 0; E < 256; E++) {
      for (var B = new nt().Reflect8(E), R = B << d - 8 & g, _ = 0; _ < 8; _++)
        (R & U) != 0 ? (R <<= 1, R ^= o) : R <<= 1;
      R = new nt().ReflectGeneric(R, d), k[E] = R & g;
    }
  }, this.crcTable || this.calcCrcTable(), this.compute = function(E) {
    for (var B = y, R = 0; R < E.length; R++) {
      var _ = E[R] & 255;
      I && (_ = new nt().Reflect8(_)), B = (B ^ _ << d - 8) & g;
      var T = B >> d - 8 & 255;
      B = B << 8 & g, B = (B ^ k[T]) & g;
    }
    return b && (B = new nt().ReflectGeneric(B, d)), (B ^ x) & g;
  }, this.getLookupTable = function() {
    return k;
  };
}, nt = function() {
  if (nt.prototype._singletonInstance)
    return nt.prototype._singletonInstance;
  nt.prototype._singletonInstance = this, this.Reflect8 = function(c) {
    for (var i = 0, s = 0; s < 8; s++)
      (c & 1 << s) != 0 && (i |= 1 << 7 - s & 255);
    return i;
  }, this.Reflect16 = function(c) {
    for (var i = 0, s = 0; s < 16; s++)
      (c & 1 << s) != 0 && (i |= 1 << 15 - s & 65535);
    return i;
  }, this.Reflect32 = function(c) {
    for (var i = 0, s = 0; s < 32; s++)
      (c & 1 << s) != 0 && (i |= 1 << 31 - s & 4294967295);
    return i;
  }, this.ReflectGeneric = function(c, i) {
    for (var s = 0, h = 0; h < i; h++)
      (c & 1 << h) != 0 && (s |= 1 << i - 1 - h);
    return s;
  };
};
function Zt(c) {
  var i = new ce(32, 79764919, 4294967295, 4294967295, !0, !0), s = i.compute(c);
  return new Uint8Array(new Int32Array([s]).buffer);
}
const Rt = 523, $t = 7;
async function he(c) {
  let i;
  for (; (i = c - performance.now()) > 0; )
    await new Promise((s) => setTimeout(s, i));
}
async function ue(c, i) {
  ae(i, Rt - $t);
  let s = 0, h = 0, f = performance.now();
  for (; s < i.length; ) {
    const p = new Uint8Array(527);
    p.set([162, 24, 72, 162, h & 255, h >>> 8, 2]);
    let d = $t, o = 0, y = 0;
    for (; s < i.length; ) {
      const x = Wt(i, s);
      if (d + x.length > Rt) break;
      p.set(i.subarray(s, s + x.length), d), d += x.length, s += x.length, o++, y += x.samples * 1e3 / x.sampleRate;
    }
    p.set(Zt(p.subarray(0, Rt)), Rt), performance.now() - f > y && (f = performance.now()), await c.sendReport(24, p.subarray(2)), h = h + o & 65535, f += y, await he(f);
  }
}
var Q = /* @__PURE__ */ ((c) => (c.Disconnected = "none", c.USB = "usb", c.Bluetooth = "bt", c))(Q || {}), vt = /* @__PURE__ */ ((c) => (c[c.Gamepad = 0] = "Gamepad", c[c.Guitar = 1] = "Guitar", c[c.Drums = 2] = "Drums", c[c.Wheel = 6] = "Wheel", c[c.Fightstick = 7] = "Fightstick", c[c.HOTAS = 8] = "HOTAS", c))(vt || {});
const le = {
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
function kt(c, i, s) {
  return s < 0 && (s += 1), s > 1 && (s -= 1), s < 1 / 6 ? c + (i - c) * 6 * s : s < 1 / 2 ? i : s < 2 / 3 ? c + (i - c) * (2 / 3 - s) * 6 : c;
}
function fe(c, i, s) {
  const h = { r: 0, g: 0, b: 0 };
  if (i === 0)
    h.r = h.g = h.b = s * 255;
  else {
    var f = s < 0.5 ? s * (1 + i) : s + i - s * i, p = 2 * s - f;
    h.r = kt(p, f, c + 1 / 3) * 255, h.g = kt(p, f, c) * 255, h.b = kt(p, f, c - 1 / 3) * 255;
  }
  return h;
}
class zt {
  /** @ignore */
  constructor(i) {
    /** @ignore */
    w(this, "_r", 0);
    /** @ignore */
    w(this, "_g", 0);
    /** @ignore */
    w(this, "_b", 0);
    /** @ignore */
    w(this, "_blinkOn", 1);
    /** @ignore */
    w(this, "_blinkOff", 0);
    this.controller = i;
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
  set r(i) {
    this._r = Math.min(255, Math.max(0, i)), this.updateLightbar();
  }
  /** Green Color Intensity (0-255) */
  get g() {
    return this._g;
  }
  set g(i) {
    this._g = Math.min(255, Math.max(0, i)), this.updateLightbar();
  }
  /** Blue Color Intensity (0-255) */
  get b() {
    return this._b;
  }
  set b(i) {
    this._b = Math.min(255, Math.max(0, i)), this.updateLightbar();
  }
  /** Blink Speed On (0-255) */
  get blinkOn() {
    return this._blinkOn;
  }
  set blinkOn(i) {
    this._blinkOn = Math.min(255, Math.max(0, i)), this.updateLightbar();
  }
  /** Blink Speed Off (0-255) */
  get blinkOff() {
    return this._blinkOff;
  }
  set blinkOff(i) {
    this._blinkOff = Math.min(255, Math.max(0, i)), this.updateLightbar();
  }
  /**
   * Sets the lightbar color (RGB)
   * @param r - Red color intensity (0-255)
   * @param g - Green color intensity (0-255)
   * @param b - Blue color intensity (0-255)
   */
  async setColorRGB(i, s, h) {
    return this._r = Math.min(255, Math.max(0, i)), this._g = Math.min(255, Math.max(0, s)), this._b = Math.min(255, Math.max(0, h)), this.updateLightbar();
  }
  /**
   * Sets the lightbar color (HSL)
   * @param h - Hue
   * @param s - Saturation
   * @param l - Lightness
   */
  async setColorHSL(i, s, h) {
    const f = fe(i, s, h);
    return this.setColorRGB(f.r, f.g, f.b);
  }
}
class Vt {
  /** @ignore */
  constructor(i) {
    /** @ignore */
    w(this, "_light", 0);
    /** @ignore */
    w(this, "_heavy", 0);
    this.controller = i;
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
  set light(i) {
    this._light = Math.max(0, Math.min(255, i)), this.updateRumble();
  }
  /** Heavy Rumble Intensity (0-255) */
  get heavy() {
    return this._heavy;
  }
  set heavy(i) {
    this._heavy = Math.max(0, Math.min(255, i)), this.updateRumble();
  }
  /**
   * Set the rumble intensity
   * @param light - Light rumble intensity (0-255)
   * @param heavy - Heavy rumble intensity (0-255)
   */
  async setRumbleIntensity(i, s) {
    return this._light = Math.min(255, Math.max(0, i)), this._heavy = Math.min(255, Math.max(0, s)), this.updateRumble();
  }
}
function Ot(c, i = 16) {
  const s = new Uint8Array(c), h = [];
  for (let f = 0; f < s.length; f += i) {
    const p = s.subarray(f, f + i), d = Array.from(p).map((y) => "0x" + y.toString(16).padStart(2, "0")).join(" "), o = Array.from(p).map((y) => y >= 32 && y <= 126 ? String.fromCharCode(y) : ".").join("");
    h.push(
      `${f.toString(16).padStart(4, "0")}: ${d} - ${o}`
    );
  }
  return h.join(`
`);
}
function _t(c, i = 0) {
  const s = (c - 128) / 128;
  return Math.abs(s) <= i ? 0 : Math.min(1, Math.max(-1, s));
}
function Gt(c, i = 0) {
  return Math.min(1, Math.max(i, c / 255));
}
class Xt {
  constructor(i, s) {
    /** Internal WebHID device */
    w(this, "device");
    /** Internal Gamepad instance */
    w(this, "gamepad");
    /** Raw contents of the last HID Report sent by the controller. */
    w(this, "lastReport");
    /** Raw contents of the last HID Report sent to the controller. */
    w(this, "lastSentReport");
    /** Current controller state */
    w(this, "state", le);
    /** Allows lightbar control */
    w(this, "lightbar", new zt(this));
    /** Allows rumble control */
    w(this, "rumble", new Vt(this));
    w(this, "miscData", "");
    w(this, "volume", [56, 56, 0, 79]);
    w(this, "musicPlaying", !1);
    this.device = i, this.gamepad = s;
  }
  /* getNameOfControllerType(controllerType: Number): any {
    return DualShock4ControllerType[controllerType]
      ? DualShock4ControllerType[controllerType]
      : `Unknown Type: 0x${controllerType.toString(16).padStart(2, "0")}`;
  } */
  async init() {
    this.device.opened || (await this.device.open(), this.device.oninputreport = (i) => this.processControllerReport(i));
  }
  /**
   * Parses a report sent from the controller and updates the state.
   *
   * This function is called internally by the library each time a report is received.
   *
   * @param report - HID Report sent by the controller.
   */
  processControllerReport(i) {
    const { data: s } = i;
    if (this.lastReport = s.buffer, this.miscData = `HID:
${Ot(
      s.buffer.slice(0, 9)
    )}

Data:
${Ot(s.buffer.slice(10))}`, this.state.interface === Q.Disconnected) {
      if (s.byteLength === 63)
        this.state.interface = Q.USB;
      else {
        this.state.interface = Q.Bluetooth, this.device.receiveFeatureReport(2);
        return;
      }
      this.lightbar.setColorRGB(0, 0, 64).catch((h) => console.error(h));
    }
    this.state.timestamp = i.timeStamp, this.state.interface === Q.USB && i.reportId === 1 ? this.updateState(s) : this.state.interface === Q.Bluetooth && i.reportId === 17 && (this.updateState(new DataView(s.buffer, 2)), this.device.receiveFeatureReport(2));
  }
  /**
   * Updates the controller state using normalized data from the last report.
   *
   * This function is called internally by the library each time a report is received.
   *
   * @param data - Normalized data from the HID report.
   */
  updateState(i) {
    this.state.axes.leftStickX = _t(i.getUint8(0)), this.state.axes.leftStickY = _t(i.getUint8(1)), this.state.axes.rightStickX = _t(i.getUint8(2)), this.state.axes.rightStickY = _t(i.getUint8(3));
    const s = i.getUint8(4);
    this.state.buttons.triangle = !!(s & 128), this.state.buttons.circle = !!(s & 64), this.state.buttons.cross = !!(s & 32), this.state.buttons.square = !!(s & 16);
    const h = s & 15;
    this.state.buttons.dPadUp = h === 7 || h === 0 || h === 1, this.state.buttons.dPadRight = h === 1 || h === 2 || h === 3, this.state.buttons.dPadDown = h === 3 || h === 4 || h === 5, this.state.buttons.dPadLeft = h === 5 || h === 6 || h === 7;
    const f = i.getUint8(5);
    this.state.buttons.l1 = !!(f & 1), this.state.buttons.r1 = !!(f & 2), this.state.buttons.l2 = !!(f & 4), this.state.buttons.r2 = !!(f & 8), this.state.buttons.share = !!(f & 16), this.state.buttons.options = !!(f & 32), this.state.buttons.l3 = !!(f & 64), this.state.buttons.r3 = !!(f & 128);
    const p = i.getUint8(6);
    switch (this.state.buttons.playStation = !!(p & 1), this.state.buttons.touchPadClick = !!(p & 2), this.state.controllerType) {
      case vt.Gamepad:
        this.state.axes.l2 = Gt(i.getUint8(7)), this.state.axes.r2 = Gt(i.getUint8(8)), this.state.charging = !!(i.getUint8(29) & 16), this.state.charging ? this.state.battery = Math.min(
          Math.floor((i.getUint8(29) & 15) * 100 / 11)
        ) : this.state.battery = Math.min(
          100,
          Math.floor((i.getUint8(29) & 15) * 100 / 8)
        ), this.state.headphones = !!(i.getUint8(29) & 32), this.state.microphone = !!(i.getUint8(29) & 64), this.state.extension = !!(i.getUint8(29) & 128), this.state.headphones && this.state.microphone ? this.state.audio = "headset" : this.state.headphones && !this.state.microphone ? this.state.audio = "headphones" : !this.state.headphones && this.state.microphone ? this.state.audio = "microphone" : this.state.audio = "volume-high", this.state.axes.gyroX = i.getUint16(13), this.state.axes.gyroY = i.getUint16(15), this.state.axes.gyroZ = i.getUint16(17), this.state.axes.accelX = i.getInt16(19), this.state.axes.accelY = i.getInt16(21), this.state.axes.accelZ = i.getInt16(23), this.state.touchpad.touches = [], i.getUint8(34) & 128 || this.state.touchpad.touches.push({
          touchId: i.getUint8(34) & 127,
          x: (i.getUint8(36) & 15) << 8 | i.getUint8(35),
          y: i.getUint8(37) << 4 | (i.getUint8(36) & 240) >> 4
        }), i.getUint8(38) & 128 || this.state.touchpad.touches.push({
          touchId: i.getUint8(38) & 127,
          x: (i.getUint8(40) & 15) << 8 | i.getUint8(39),
          y: i.getUint8(41) << 4 | (i.getUint8(40) & 240) >> 4
        });
        break;
      case vt.HOTAS:
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
    if (this.state.interface === Q.USB) {
      const i = new Uint8Array(16);
      return i[0] = 5, i[1] = 255, i[4] = this.rumble.light, i[5] = this.rumble.heavy, i[6] = this.lightbar.r, i[7] = this.lightbar.g, i[8] = this.lightbar.b, i[9] = this.lightbar.blinkOn, i[10] = this.lightbar.blinkOff, this.lastSentReport = i.buffer, this.device.sendReport(i[0], i.slice(1));
    } else {
      console.log("sending report via bluetooth");
      const i = [
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
      ], s = Zt(i);
      i[75] = s[0], i[76] = s[1], i[77] = s[2], i[78] = s[3], i.shift(), i.shift();
      const h = se.Buffer.from(i);
      return this.lastSentReport = h.buffer, this.device.sendReport(17, h);
    }
  }
  /**
   * Set the volume levels for the controller.
   * leftVolume - The volume level for the left speaker (0-255).
   * rightVolume - The volume level for the right speaker (0-255).
   * micVolume - The volume level for the microphone (0-255).
   * speakerVolume - The volume level for the speaker (0-79).
   */
  async setVolume(i, s, h, f) {
    if (!this.device)
      throw new Error(
        "Controller not initialized. You must call .init() first!"
      );
    this.volume = [i, s, h, f], await this.sendLocalState();
  }
  /**
   * Sets the color for the light bar.
   * @param red
   * @param green
   * @param blue
   */
  async setLightBarColor(i, s, h) {
    if (!this.device)
      throw new Error(
        "Controller not initialized. You must call .init() first!"
      );
    this.lightbar.setColorRGB(i, s, h), await this.sendLocalState();
  }
  /**
   * Sets the rumble light and heavy intensity.
   * @param light 0 - 255
   * @param heavy 0 - 255
   */
  async setRumbleIntensity(i, s) {
    if (!this.device)
      throw new Error(
        "Controller not initialized. You must call .init() first!"
      );
    await this.rumble.setRumbleIntensity(i, s);
  }
  /**
   * Send raw SBC frames over Bluetooth. Convert other audio with audioToSbc().
   * Resolves after the last packet's nominal duration; rejects on invalid SBC,
   * concurrent playback, a closed device, or a failed HID write.
   */
  async sendMusic(i) {
    var s;
    if (!((s = this.device) != null && s.opened))
      throw new Error("Controller not initialized. You must call .init() first!");
    if (this.state.interface !== Q.Bluetooth)
      throw new Error("sendMusic is only supported over Bluetooth");
    if (this.musicPlaying) throw new Error("Music is already playing on this controller");
    this.musicPlaying = !0;
    try {
      await ue(this.device, await qt(i));
    } finally {
      this.musicPlaying = !1;
    }
  }
  getName() {
    return this.device.productName || "Unknown DualShock Device";
  }
}
var Z = /* @__PURE__ */ ((c) => (c.Disconnected = "none", c.USB = "usb", c.Bluetooth = "bt", c))(Z || {});
const de = {
  interface: "none",
  battery: 0,
  batteryFull: !1,
  charging: !1,
  controllerType: 0,
  headphones: !1,
  microphone: !1,
  audio: "",
  reports: [],
  axes: {
    leftStickX: 0,
    leftStickY: 0,
    rightStickX: 0,
    rightStickY: 0,
    l2: 0,
    r2: 0,
    l2State: 0,
    r2State: 0,
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
    create: !1,
    playStation: !1,
    touchPadClick: !1,
    mute: !1,
    leftFunction: !1,
    rightFunction: !1,
    leftPaddle: !1,
    rightPaddle: !1
  },
  touchpad: {
    touches: []
  },
  timestamp: -1
}, pe = () => {
  let c;
  const i = [];
  for (let s = 0; s < 256; ++s) {
    c = s;
    for (let h = 0; h < 8; ++h) c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
    i[s] = c >>> 0;
  }
  return i;
}, ge = (c, i) => {
  window.crcTable === void 0 && (window.crcTable = pe());
  let s = -1 >>> 0;
  for (const h of c)
    s = s >>> 8 ^ (window.crcTable[(s ^ h) & 255] ?? 0);
  for (let h = 0; h < i.byteLength; ++h)
    s = s >>> 8 ^ (window.crcTable[(s ^ i.getUint8(h)) & 255] ?? 0);
  return (s ^ -1) >>> 0;
}, ye = (c, i) => {
  const s = ge(
    [162, c],
    new DataView(i.buffer, 0, i.byteLength - 4)
  );
  i[i.byteLength - 4] = s >>> 0 & 255, i[i.byteLength - 3] = s >>> 8 & 255, i[i.byteLength - 2] = s >>> 16 & 255, i[i.byteLength - 1] = s >>> 24 & 255;
}, $ = (c) => 2 * c / 255 - 1, dt = (c) => c / 255, m = (c) => c ? 1 : 0, pt = class pt {
  constructor(i, s) {
    /** Internal WebHID device */
    w(this, "device");
    /** Internal Gamepad instance */
    w(this, "gamepad");
    /** Allows lightbar control */
    w(this, "lightbar", new zt(this));
    /** Allows rumble control */
    w(this, "rumble", new Vt(this));
    /** Raw contents of the last HID Report sent by the controller. */
    w(this, "lastReport");
    /** Raw contents of the last HID Report sent to the controller. */
    w(this, "lastSentReport");
    /** Current controller state */
    w(this, "state", de);
    w(this, "selectedReport");
    w(this, "lastTriggeredReport");
    w(this, "outputSeq_");
    w(this, "playerLeds_");
    w(this, "muteLed_");
    w(this, "motorLeft_");
    w(this, "motorRight_");
    w(this, "l2EffectMode_");
    w(this, "l2EffectParam1_");
    w(this, "l2EffectParam2_");
    w(this, "l2EffectParam3_");
    w(this, "l2EffectParam4_");
    w(this, "l2EffectParam5_");
    w(this, "l2EffectParam6_");
    w(this, "l2EffectParam7_");
    w(this, "r2EffectMode_");
    w(this, "r2EffectParam1_");
    w(this, "r2EffectParam2_");
    w(this, "r2EffectParam3_");
    w(this, "r2EffectParam4_");
    w(this, "r2EffectParam5_");
    w(this, "r2EffectParam6_");
    w(this, "r2EffectParam7_");
    w(this, "lightbarRed_");
    w(this, "lightbarGreen_");
    w(this, "lightbarBlue_");
    if (!navigator.hid || !navigator.hid.requestDevice)
      throw new Error("WebHID not supported by browser or not available.");
    this.device = i, this.gamepad = s, this.outputSeq_ = 1, this.playerLeds_ = 0, this.muteLed_ = 0, this.motorLeft_ = 0, this.motorRight_ = 0, this.l2EffectMode_ = 38, this.l2EffectParam1_ = 144, this.l2EffectParam2_ = 160, this.l2EffectParam3_ = 255, this.l2EffectParam4_ = 0, this.l2EffectParam5_ = 0, this.l2EffectParam6_ = 0, this.l2EffectParam7_ = 0, this.r2EffectMode_ = 38, this.r2EffectParam1_ = 144, this.r2EffectParam2_ = 160, this.r2EffectParam3_ = 255, this.r2EffectParam4_ = 0, this.r2EffectParam5_ = 0, this.r2EffectParam6_ = 0, this.r2EffectParam7_ = 0, this.lightbarRed_ = 255, this.lightbarGreen_ = 255, this.lightbarBlue_ = 255, this.state.interface = Z.Disconnected;
    for (const h of this.device.collections) {
      if (h.usagePage !== pt.USAGE_PAGE_GENERIC_DESKTOP || h.usage !== pt.USAGE_ID_GD_GAMEPAD)
        continue;
      let f = h.inputReports.reduce((p, d) => Math.max(
        p,
        d.items.reduce((o, y) => o + y.reportSize * y.reportCount, 0)
      ), 0);
      f == 504 ? this.state.interface = Z.USB : f == 616 && (this.state.interface = Z.Bluetooth);
    }
  }
  async readFeatureReport05() {
    this.state.interface == Z.Bluetooth && await this.device.receiveFeatureReport(5);
  }
  async init() {
    this.device.opened || (this.device.open(), this.device.oninputreport = (i) => {
      this.onInputReport(i);
    });
  }
  onInputReport(i) {
    let s = i.reportId, h = i.data;
    if (this.state.interface === Z.USB)
      if (s == 1) this.handleUsbInputReport01(h);
      else return;
    else if (this.state.interface === Z.Bluetooth)
      if (s == 1) this.handleBluetoothInputReport01(h);
      else if (s == 49) this.handleBluetoothInputReport31(h);
      else return;
    else
      return;
  }
  handleUsbInputReport01(i) {
    if (i.byteLength != 63) return;
    let s = i.getUint8(0), h = i.getUint8(1), f = i.getUint8(2), p = i.getUint8(3), d = i.getUint8(4), o = i.getUint8(5);
    i.getUint8(6);
    let y = i.getUint8(7), x = i.getUint8(8), I = i.getUint8(9);
    i.getUint8(10), i.getUint8(11), i.getUint8(12), i.getUint8(13), i.getUint8(14);
    let b = i.getUint8(15), k = i.getUint8(16), g = i.getUint8(17), U = i.getUint8(18), E = i.getUint8(19), B = i.getUint8(20), R = i.getUint8(21), _ = i.getUint8(22), T = i.getUint8(23), O = i.getUint8(24), P = i.getUint8(25), st = i.getUint8(26);
    i.getUint8(27), i.getUint8(28), i.getUint8(29), i.getUint8(30);
    let J = i.getUint8(32), gt = i.getUint8(33), tt = i.getUint8(34), yt = i.getUint8(35), et = i.getUint8(36), mt = i.getUint8(37), it = i.getUint8(38), ot = i.getUint8(39), at = i.getUint8(41), wt = i.getUint8(42);
    this.state.axes.l2State = wt & 15, this.state.axes.r2State = at & 15;
    let rt = i.getUint8(52), xt = i.getUint8(53);
    this.state.axes.leftStickX = $(s), this.state.axes.leftStickY = $(h), this.state.axes.rightStickX = $(f), this.state.axes.rightStickY = $(p), this.state.axes.l2 = dt(d), this.state.axes.r2 = dt(o);
    let S = y & 15;
    this.state.buttons.dPadUp = m(
      S === 0 || S === 1 || S === 7
    ), this.state.buttons.dPadDown = m(
      S === 3 || S === 4 || S === 5
    ), this.state.buttons.dPadLeft = m(
      S === 5 || S === 6 || S === 7
    ), this.state.buttons.dPadRight = m(
      S === 1 || S === 2 || S === 3
    ), this.state.buttons.square = m(y & 16), this.state.buttons.cross = m(y & 32), this.state.buttons.circle = m(y & 64), this.state.buttons.triangle = m(y & 128), this.state.buttons.l1 = m(x & 1), this.state.buttons.r1 = m(x & 2), this.state.buttons.l2 = m(x & 4), this.state.buttons.r2 = m(x & 8), this.state.buttons.create = m(x & 16), this.state.buttons.options = m(x & 32), this.state.buttons.l3 = m(x & 64), this.state.buttons.r3 = m(x & 128), this.state.buttons.playStation = m(I & 1), this.state.buttons.touchPadClick = m(I & 2), this.state.buttons.mute = m(I & 4);
    let bt = !(J & 128), v = J & 127, D = (tt & 15) << 8 | gt, ct = yt << 4 | (tt & 240) >> 4;
    this.state.touchpad.touches = [], this.state.touchpad.touches.push({
      touchActive: bt,
      touchId: v,
      x: D,
      y: ct
    });
    let ht = !(et & 128), ut = et & 127, lt = (it & 15) << 8 | mt, ft = ot << 4 | (it & 240) >> 4;
    this.state.touchpad.touches.push({
      touchActive: ht,
      touchId: ut,
      x: lt,
      y: ft
    });
    let Y = k << 8 | b;
    Y > 32767 && (Y -= 65536);
    let G = U << 8 | g;
    G > 32767 && (G -= 65536);
    let X = B << 8 | E;
    X > 32767 && (X -= 65536);
    let z = _ << 8 | R;
    z > 32767 && (z -= 65536);
    let q = O << 8 | T;
    q > 32767 && (q -= 65536);
    let N = st << 8 | P;
    N > 32767 && (N -= 65536), this.state.axes.gyroX = Y, this.state.axes.gyroY = G, this.state.axes.gyroZ = X, this.state.axes.accelX = z, this.state.axes.accelY = q, this.state.axes.accelZ = N;
    let V = (rt & 15) * 100 / 8, Ut = !!(rt & 32), Et = !!(xt & 8);
    this.state.battery = V, this.state.batteryFull = Ut, this.state.charging = Et;
  }
  handleBluetoothInputReport01(i) {
    if (i.byteLength !== 9) return;
    let s = i.getUint8(0), h = i.getUint8(1), f = i.getUint8(2), p = i.getUint8(3), d = i.getUint8(4), o = i.getUint8(5), y = i.getUint8(6), x = i.getUint8(7), I = i.getUint8(8);
    this.state.axes.leftStickX = $(s), this.state.axes.leftStickY = $(h), this.state.axes.rightStickX = $(f), this.state.axes.rightStickY = $(p), this.state.axes.l2 = dt(x), this.state.axes.r2 = dt(I);
    let b = d & 15;
    this.state.buttons.dPadUp = m(
      b === 0 || b === 1 || b === 7
    ), this.state.buttons.dPadDown = m(
      b === 3 || b === 4 || b === 5
    ), this.state.buttons.dPadLeft = m(
      b === 5 || b === 6 || b === 7
    ), this.state.buttons.dPadRight = m(
      b === 1 || b === 2 || b === 3
    ), this.state.buttons.square = m(d & 16), this.state.buttons.cross = m(d & 32), this.state.buttons.circle = m(d & 64), this.state.buttons.triangle = m(d & 128), this.state.buttons.l1 = m(o & 1), this.state.buttons.r1 = m(o & 2), this.state.buttons.l2 = m(o & 4), this.state.buttons.r2 = m(o & 8), this.state.buttons.create = m(o & 16), this.state.buttons.options = m(o & 32), this.state.buttons.l3 = m(o & 64), this.state.buttons.r3 = m(o & 128), this.state.buttons.playStation = m(y & 1), this.state.buttons.touchPadClick = m(y & 2), this.state.buttons.mute = !1, this.state.touchpad.touches = [], this.state.axes.gyroX = 0, this.state.axes.gyroY = 0, this.state.axes.gyroZ = 0, this.state.axes.accelX = 0, this.state.axes.accelY = 0, this.state.axes.accelZ = 0, this.state.battery = 0, this.state.batteryFull = !1, this.state.charging = !1;
  }
  handleBluetoothInputReport31(i) {
    if (i.byteLength !== 77) return;
    let s = i.getUint8(1), h = i.getUint8(2), f = i.getUint8(3), p = i.getUint8(4), d = i.getUint8(5), o = i.getUint8(6), y = i.getUint8(8), x = i.getUint8(9), I = i.getUint8(10);
    i.getUint8(12), i.getUint8(13), i.getUint8(14), i.getUint8(15);
    let b = i.getUint8(16), k = i.getUint8(17), g = i.getUint8(18), U = i.getUint8(19), E = i.getUint8(20), B = i.getUint8(21), R = i.getUint8(22), _ = i.getUint8(23), T = i.getUint8(24), O = i.getUint8(25), P = i.getUint8(26), st = i.getUint8(27), J = i.getUint8(33), gt = i.getUint8(34), tt = i.getUint8(35), yt = i.getUint8(36), et = i.getUint8(37), mt = i.getUint8(38), it = i.getUint8(39), ot = i.getUint8(40), at = i.getUint8(42), wt = i.getUint8(43);
    this.state.axes.l2State = wt & 15, this.state.axes.r2State = at & 15;
    let rt = i.getUint8(53), xt = i.getUint8(54);
    this.state.axes.leftStickX = $(s), this.state.axes.leftStickY = $(h), this.state.axes.rightStickX = $(f), this.state.axes.rightStickY = $(p), this.state.axes.l2 = dt(d), this.state.axes.r2 = dt(o);
    let S = y & 15;
    this.state.buttons.dPadUp = m(
      S === 0 || S === 1 || S === 7
    ), this.state.buttons.dPadDown = m(
      S === 3 || S === 4 || S === 5
    ), this.state.buttons.dPadLeft = m(
      S === 5 || S === 6 || S === 7
    ), this.state.buttons.dPadRight = m(
      S === 1 || S === 2 || S === 3
    ), this.state.buttons.square = m(y & 16), this.state.buttons.cross = m(y & 32), this.state.buttons.circle = m(y & 64), this.state.buttons.triangle = m(y & 128), this.state.buttons.l1 = m(x & 1), this.state.buttons.r1 = m(x & 2), this.state.buttons.l2 = m(x & 4), this.state.buttons.r2 = m(x & 8), this.state.buttons.create = m(x & 16), this.state.buttons.options = m(x & 32), this.state.buttons.l3 = m(x & 64), this.state.buttons.r3 = m(x & 128), this.state.buttons.playStation = m(I & 1), this.state.buttons.touchPadClick = m(I & 2), this.state.buttons.mute = m(I & 4), this.state.touchpad.touches = [];
    let bt = !(J & 128), v = J & 127, D = (tt & 15) << 8 | gt, ct = yt << 4 | (tt & 240) >> 4;
    this.state.touchpad.touches.push({
      touchId: v,
      x: D,
      y: ct,
      touchActive: bt
    });
    let ht = !(et & 128), ut = et & 127, lt = (it & 15) << 8 | mt, ft = ot << 4 | (it & 240) >> 4;
    this.state.touchpad.touches.push({
      touchId: ut,
      x: lt,
      y: ft,
      touchActive: ht
    });
    let Y = k << 8 | b;
    Y > 32767 && (Y -= 65536);
    let G = U << 8 | g;
    G > 32767 && (G -= 65536);
    let X = B << 8 | E;
    X > 32767 && (X -= 65536);
    let z = _ << 8 | R;
    z > 32767 && (z -= 65536);
    let q = O << 8 | T;
    q > 32767 && (q -= 65536);
    let N = st << 8 | P;
    N > 32767 && (N -= 65536), this.state.axes.gyroX = Y, this.state.axes.gyroY = G, this.state.axes.gyroZ = X, this.state.axes.accelX = z, this.state.axes.accelY = q, this.state.axes.accelZ = N;
    let V = (rt & 15) * 100 / 8, Ut = !!(rt & 32), Et = !!(xt & 8);
    this.state.battery = V, this.state.batteryFull = Ut, this.state.charging = Et;
  }
  async sendLocalState() {
    navigator.getGamepads();
    let i, s, h, f, p;
    this.state.interface == Z.Bluetooth ? (i = 49, s = new Uint8Array(77), s[0] = this.outputSeq_ << 4, ++this.outputSeq_ === 16 && (this.outputSeq_ = 0), s[1] = 16, h = new DataView(s.buffer, 2, 47), f = new DataView(s.buffer, 12, 8), p = new DataView(s.buffer, 23, 8)) : this.state.interface == Z.USB && (i = 2, s = new Uint8Array(47), h = new DataView(s.buffer, 0, 47), f = new DataView(h.buffer, 10, 8), p = new DataView(h.buffer, 21, 8)), h.setUint8(0, 255), h.setUint8(1, 247), h.setUint8(2, this.rumble.light), h.setUint8(3, this.rumble.heavy), h.setUint8(8, this.muteLed_), h.setUint8(9, this.muteLed_ ? 0 : 16), f.setUint8(0, this.r2EffectMode_), f.setUint8(1, this.r2EffectParam1_), f.setUint8(2, this.r2EffectParam2_), f.setUint8(3, this.r2EffectParam3_), f.setUint8(4, this.r2EffectParam4_), f.setUint8(5, this.r2EffectParam5_), f.setUint8(6, this.r2EffectParam6_), f.setUint8(7, this.r2EffectParam7_), p.setUint8(0, this.l2EffectMode_), p.setUint8(1, this.l2EffectParam1_), p.setUint8(2, this.l2EffectParam2_), p.setUint8(3, this.l2EffectParam3_), p.setUint8(4, this.l2EffectParam4_), p.setUint8(5, this.l2EffectParam5_), p.setUint8(6, this.l2EffectParam6_), p.setUint8(7, this.l2EffectParam7_), h.setUint8(39, 2), h.setUint8(41, 2), h.setUint8(43, this.playerLeds_), h.setUint8(44, this.lightbar.r), h.setUint8(45, this.lightbar.g), h.setUint8(46, this.lightbar.b), this.state.interface == Z.Bluetooth && ye(i, s);
    try {
      await this.device.sendReport(i, s);
    } catch {
      return console.log("Failed to write DualSense output report"), !1;
    }
    return !0;
  }
  getName() {
    return this.device.productName || "Unknown DualShock Device";
  }
};
w(pt, "USAGE_PAGE_GENERIC_DESKTOP", 1), w(pt, "USAGE_ID_GD_GAMEPAD", 5);
let St = pt;
class me {
  constructor() {
    w(this, "events", {});
  }
  $on(i, s) {
    return this.events[i] || (this.events[i] = []), this.events[i].push(s), this;
  }
  $off(i, s) {
    const h = this.events[i];
    return h && (this.events[i] = h.filter(
      (f) => f !== s
    ), h.length === 0 && delete this.events[i]), this;
  }
  $once(i, s) {
    const h = (...f) => {
      this.$off(i, h), s.apply(this, f);
    };
    return this.$on(i, h);
  }
  $emit(i, ...s) {
    const h = this.events[i];
    h && h.forEach((f) => {
      f.apply(this, s);
    });
  }
}
class we extends me {
  constructor() {
    if (typeof navigator.hid > "u")
      throw alert("WebHID is not supported in this browser"), new Error("WebHID is not supported in this browser");
    if (typeof navigator.getGamepads > "u")
      throw alert("Gamepad API is not supported in this browser"), new Error("Gamepad API is not supported in this browser");
    super();
    w(this, "devices", []);
    window.addEventListener("gamepadconnected", (s) => {
      if (console.log("Gamepad connected:", s.gamepad), s.gamepad.id.includes("Wireless Controller") || s.gamepad.id.includes("DualShock 4") || s.gamepad.id.includes("DualSense")) {
        console.log("DualShock gamepad connected:", s.gamepad);
        const f = s.gamepad.id.match(/(0x)?([0-9a-fA-F]{4})/g), p = f ? f[0] : null, d = f ? f[1] : null;
        p && d ? (console.log(`Vendor ID: ${p}, Product ID: ${d}`), navigator.hid.requestDevice({
          filters: [
            {
              vendorId: parseInt(p, 16),
              productId: parseInt(d, 16)
            }
          ]
        }).then((o) => {
          if (o.length > 0) {
            const y = o[0];
            console.log("DualShock device found:", y);
            let x = null;
            y.productId === 3302 ? x = new St(y, s.gamepad) : x = new Xt(y, s.gamepad), this.devices.push(x), this.$emit("deviceconnected", x);
          } else
            console.error("No DualShock device found");
        }).catch((o) => {
          console.error("Failed to request DualShock device:", o);
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
        { vendorId: 1356, productId: 3302 },
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
    }).then((s) => {
      if (s.length > 0) {
        const h = s[0];
        console.log("DualShock/DualSense device found:", h);
        let f = null;
        h.productId === 3302 ? f = new St(h) : f = new Xt(h), this.devices.push(f), this.$emit("deviceconnected", f);
      } else
        console.error("No DualShock/DualSense device found");
    }).catch((s) => {
      console.error("Failed to request DualShock/DualSense device:", s);
    }), this;
  }
  /**
   * Get the list of connected devices.
   * @returns {Array<DualShock4>} The list of connected devices.
   */
  getDevices() {
    return this.devices;
  }
  getDeviceAtIndex(s) {
    return s < 0 || s >= this.devices.length ? null : this.devices[s];
  }
}
async function xe(c) {
  if (typeof OfflineAudioContext > "u") throw new Error("Conversion requires Web Audio");
  let i;
  if (c instanceof Blob) {
    if (!c.size) throw new Error("Audio file is empty");
    try {
      i = await new OfflineAudioContext(2, 1, 32e3).decodeAudioData(await c.arrayBuffer());
    } catch (s) {
      throw new Error("Cannot decode audio: invalid file or format unsupported by this browser", { cause: s });
    }
  } else if (typeof AudioBuffer < "u" && c instanceof AudioBuffer)
    i = c;
  else
    throw new TypeError("Expected an audio Blob or AudioBuffer");
  if (!i.length) throw new Error("Audio has no samples");
  if (i.sampleRate !== 32e3 || i.numberOfChannels !== 2) {
    const s = new OfflineAudioContext(2, Math.ceil(i.length * 32e3 / i.sampleRate), 32e3), h = s.createBufferSource();
    h.buffer = i;
    const f = s.createGain();
    f.channelCount = 2, f.channelCountMode = "explicit", f.channelInterpretation = "speakers", h.connect(f).connect(s.destination), h.start(), i = await s.startRendering();
  }
  return [new Float32Array(i.getChannelData(0)), new Float32Array(i.getChannelData(1))];
}
const be = new URL("audio/sbc.wasm", import.meta.url).href, Ue = "" + new URL("assets/sbc.worker-B7epEAMJ.js", import.meta.url).href;
let Lt = {}, H, Ee = 0;
const j = /* @__PURE__ */ new Map();
function Fe(c) {
  if (j.size) throw new Error("Cannot configure SBC while a conversion is running");
  Be(), Lt = { ...c };
}
function Be() {
  H == null || H.terminate(), H = void 0;
  for (const c of j.values()) c.reject(new Error("SBC codec was disposed"));
  j.clear();
}
function Ie() {
  if (H) return H;
  if (typeof Worker > "u") throw new Error("SBC conversion requires Web Workers");
  const c = new Worker(new URL(Lt.workerURL ?? Ue, document.baseURI), { type: "module" });
  c.onmessage = ({ data: s }) => {
    const h = j.get(s.id);
    h && (j.delete(s.id), "error" in s ? h.reject(new Error(s.error)) : h.resolve(s));
  };
  const i = () => {
    for (const s of j.values()) s.reject(new Error("SBC worker failed to load or execute"));
    j.clear(), c.terminate(), H === c && (H = void 0);
  };
  return c.onerror = i, c.onmessageerror = i, H = c, c;
}
function Ht(c, i) {
  return new Promise((s, h) => {
    const f = Ie(), p = Ee++;
    j.set(p, { resolve: s, reject: h });
    try {
      f.postMessage({
        ...c,
        id: p,
        wasmURL: new URL(Lt.wasmURL ?? be, document.baseURI).href
      }, i);
    } catch (d) {
      j.delete(p), h(d);
    }
  });
}
async function Ae(c) {
  const i = await Ht({ operation: "encode", channels: c }, c.map((s) => s.buffer));
  if (!("operation" in i) || i.operation !== "encode") throw new Error("Unexpected SBC worker response");
  return i.data;
}
async function Re(c) {
  const i = await Ht({ operation: "decode", data: c }, [c.buffer]);
  if (!("operation" in i) || i.operation !== "decode") throw new Error("Unexpected SBC worker response");
  return i.pcm;
}
async function Pe(c) {
  return Ae(await xe(c));
}
async function Ce(c) {
  if (typeof AudioBuffer > "u") throw new Error("Decoding to AudioBuffer requires Web Audio");
  const i = await Re(await qt(c)), s = new AudioBuffer({
    sampleRate: i.sampleRate,
    numberOfChannels: i.channels.length,
    length: i.channels[0].length
  });
  return i.channels.forEach((h, f) => s.copyToChannel(h, f)), s;
}
window.DeviceManager = we;
export {
  Pe as audioToSbc,
  Fe as configureSbcCodec,
  Be as disposeSbcCodec,
  Ce as sbcToAudioBuffer
};
