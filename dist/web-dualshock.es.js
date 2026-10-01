var ie = Object.defineProperty;
var ne = (a, r, s) => r in a ? ie(a, r, { enumerable: !0, configurable: !0, writable: !0, value: s }) : a[r] = s;
var w = (a, r, s) => ne(a, typeof r != "symbol" ? r + "" : r, s);
var Mt = {}, Bt = {}, Tt;
function se() {
  if (Tt) return Bt;
  Tt = 1, Bt.byteLength = o, Bt.toByteArray = y, Bt.fromByteArray = I;
  for (var a = [], r = [], s = typeof Uint8Array < "u" ? Uint8Array : Array, u = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", l = 0, g = u.length; l < g; ++l)
    a[l] = u[l], r[u.charCodeAt(l)] = l;
  r[45] = 62, r[95] = 63;
  function d(m) {
    var U = m.length;
    if (U % 4 > 0)
      throw new Error("Invalid string. Length must be a multiple of 4");
    var B = m.indexOf("=");
    B === -1 && (B = U);
    var S = B === U ? 0 : 4 - B % 4;
    return [B, S];
  }
  function o(m) {
    var U = d(m), B = U[0], S = U[1];
    return (B + S) * 3 / 4 - S;
  }
  function p(m, U, B) {
    return (U + B) * 3 / 4 - B;
  }
  function y(m) {
    var U, B = d(m), S = B[0], R = B[1], _ = new s(p(m, S, R)), D = 0, $ = R > 0 ? S - 4 : S, P;
    for (P = 0; P < $; P += 4)
      U = r[m.charCodeAt(P)] << 18 | r[m.charCodeAt(P + 1)] << 12 | r[m.charCodeAt(P + 2)] << 6 | r[m.charCodeAt(P + 3)], _[D++] = U >> 16 & 255, _[D++] = U >> 8 & 255, _[D++] = U & 255;
    return R === 2 && (U = r[m.charCodeAt(P)] << 2 | r[m.charCodeAt(P + 1)] >> 4, _[D++] = U & 255), R === 1 && (U = r[m.charCodeAt(P)] << 10 | r[m.charCodeAt(P + 1)] << 4 | r[m.charCodeAt(P + 2)] >> 2, _[D++] = U >> 8 & 255, _[D++] = U & 255), _;
  }
  function E(m) {
    return a[m >> 18 & 63] + a[m >> 12 & 63] + a[m >> 6 & 63] + a[m & 63];
  }
  function b(m, U, B) {
    for (var S, R = [], _ = U; _ < B; _ += 3)
      S = (m[_] << 16 & 16711680) + (m[_ + 1] << 8 & 65280) + (m[_ + 2] & 255), R.push(E(S));
    return R.join("");
  }
  function I(m) {
    for (var U, B = m.length, S = B % 3, R = [], _ = 16383, D = 0, $ = B - S; D < $; D += _)
      R.push(b(m, D, D + _ > $ ? $ : D + _));
    return S === 1 ? (U = m[B - 1], R.push(
      a[U >> 2] + a[U << 4 & 63] + "=="
    )) : S === 2 && (U = (m[B - 2] << 8) + m[B - 1], R.push(
      a[U >> 10] + a[U >> 4 & 63] + a[U << 2 & 63] + "="
    )), R.join("");
  }
  return Bt;
}
var St = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
var Nt;
function oe() {
  return Nt || (Nt = 1, St.read = function(a, r, s, u, l) {
    var g, d, o = l * 8 - u - 1, p = (1 << o) - 1, y = p >> 1, E = -7, b = s ? l - 1 : 0, I = s ? -1 : 1, m = a[r + b];
    for (b += I, g = m & (1 << -E) - 1, m >>= -E, E += o; E > 0; g = g * 256 + a[r + b], b += I, E -= 8)
      ;
    for (d = g & (1 << -E) - 1, g >>= -E, E += u; E > 0; d = d * 256 + a[r + b], b += I, E -= 8)
      ;
    if (g === 0)
      g = 1 - y;
    else {
      if (g === p)
        return d ? NaN : (m ? -1 : 1) * (1 / 0);
      d = d + Math.pow(2, u), g = g - y;
    }
    return (m ? -1 : 1) * d * Math.pow(2, g - u);
  }, St.write = function(a, r, s, u, l, g) {
    var d, o, p, y = g * 8 - l - 1, E = (1 << y) - 1, b = E >> 1, I = l === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, m = u ? 0 : g - 1, U = u ? 1 : -1, B = r < 0 || r === 0 && 1 / r < 0 ? 1 : 0;
    for (r = Math.abs(r), isNaN(r) || r === 1 / 0 ? (o = isNaN(r) ? 1 : 0, d = E) : (d = Math.floor(Math.log(r) / Math.LN2), r * (p = Math.pow(2, -d)) < 1 && (d--, p *= 2), d + b >= 1 ? r += I / p : r += I * Math.pow(2, 1 - b), r * p >= 2 && (d++, p /= 2), d + b >= E ? (o = 0, d = E) : d + b >= 1 ? (o = (r * p - 1) * Math.pow(2, l), d = d + b) : (o = r * Math.pow(2, b - 1) * Math.pow(2, l), d = 0)); l >= 8; a[s + m] = o & 255, m += U, o /= 256, l -= 8)
      ;
    for (d = d << l | o, y += l; y > 0; a[s + m] = d & 255, m += U, d /= 256, y -= 8)
      ;
    a[s + m - U] |= B * 128;
  }), St;
}
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
var Yt;
function ae() {
  return Yt || (Yt = 1, function(a) {
    const r = se(), s = oe(), u = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
    a.Buffer = o, a.SlowBuffer = _, a.INSPECT_MAX_BYTES = 50;
    const l = 2147483647;
    a.kMaxLength = l, o.TYPED_ARRAY_SUPPORT = g(), !o.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
      "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
    );
    function g() {
      try {
        const i = new Uint8Array(1), t = { foo: function() {
          return 42;
        } };
        return Object.setPrototypeOf(t, Uint8Array.prototype), Object.setPrototypeOf(i, t), i.foo() === 42;
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
    function d(i) {
      if (i > l)
        throw new RangeError('The value "' + i + '" is invalid for option "size"');
      const t = new Uint8Array(i);
      return Object.setPrototypeOf(t, o.prototype), t;
    }
    function o(i, t, e) {
      if (typeof i == "number") {
        if (typeof t == "string")
          throw new TypeError(
            'The "string" argument must be of type string. Received type number'
          );
        return b(i);
      }
      return p(i, t, e);
    }
    o.poolSize = 8192;
    function p(i, t, e) {
      if (typeof i == "string")
        return I(i, t);
      if (ArrayBuffer.isView(i))
        return U(i);
      if (i == null)
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof i
        );
      if (q(i, ArrayBuffer) || i && q(i.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (q(i, SharedArrayBuffer) || i && q(i.buffer, SharedArrayBuffer)))
        return B(i, t, e);
      if (typeof i == "number")
        throw new TypeError(
          'The "value" argument must not be of type number. Received type number'
        );
      const n = i.valueOf && i.valueOf();
      if (n != null && n !== i)
        return o.from(n, t, e);
      const c = S(i);
      if (c) return c;
      if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof i[Symbol.toPrimitive] == "function")
        return o.from(i[Symbol.toPrimitive]("string"), t, e);
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof i
      );
    }
    o.from = function(i, t, e) {
      return p(i, t, e);
    }, Object.setPrototypeOf(o.prototype, Uint8Array.prototype), Object.setPrototypeOf(o, Uint8Array);
    function y(i) {
      if (typeof i != "number")
        throw new TypeError('"size" argument must be of type number');
      if (i < 0)
        throw new RangeError('The value "' + i + '" is invalid for option "size"');
    }
    function E(i, t, e) {
      return y(i), i <= 0 ? d(i) : t !== void 0 ? typeof e == "string" ? d(i).fill(t, e) : d(i).fill(t) : d(i);
    }
    o.alloc = function(i, t, e) {
      return E(i, t, e);
    };
    function b(i) {
      return y(i), d(i < 0 ? 0 : R(i) | 0);
    }
    o.allocUnsafe = function(i) {
      return b(i);
    }, o.allocUnsafeSlow = function(i) {
      return b(i);
    };
    function I(i, t) {
      if ((typeof t != "string" || t === "") && (t = "utf8"), !o.isEncoding(t))
        throw new TypeError("Unknown encoding: " + t);
      const e = D(i, t) | 0;
      let n = d(e);
      const c = n.write(i, t);
      return c !== e && (n = n.slice(0, c)), n;
    }
    function m(i) {
      const t = i.length < 0 ? 0 : R(i.length) | 0, e = d(t);
      for (let n = 0; n < t; n += 1)
        e[n] = i[n] & 255;
      return e;
    }
    function U(i) {
      if (q(i, Uint8Array)) {
        const t = new Uint8Array(i);
        return B(t.buffer, t.byteOffset, t.byteLength);
      }
      return m(i);
    }
    function B(i, t, e) {
      if (t < 0 || i.byteLength < t)
        throw new RangeError('"offset" is outside of buffer bounds');
      if (i.byteLength < t + (e || 0))
        throw new RangeError('"length" is outside of buffer bounds');
      let n;
      return t === void 0 && e === void 0 ? n = new Uint8Array(i) : e === void 0 ? n = new Uint8Array(i, t) : n = new Uint8Array(i, t, e), Object.setPrototypeOf(n, o.prototype), n;
    }
    function S(i) {
      if (o.isBuffer(i)) {
        const t = R(i.length) | 0, e = d(t);
        return e.length === 0 || i.copy(e, 0, 0, t), e;
      }
      if (i.length !== void 0)
        return typeof i.length != "number" || Pt(i.length) ? d(0) : m(i);
      if (i.type === "Buffer" && Array.isArray(i.data))
        return m(i.data);
    }
    function R(i) {
      if (i >= l)
        throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + l.toString(16) + " bytes");
      return i | 0;
    }
    function _(i) {
      return +i != i && (i = 0), o.alloc(+i);
    }
    o.isBuffer = function(t) {
      return t != null && t._isBuffer === !0 && t !== o.prototype;
    }, o.compare = function(t, e) {
      if (q(t, Uint8Array) && (t = o.from(t, t.offset, t.byteLength)), q(e, Uint8Array) && (e = o.from(e, e.offset, e.byteLength)), !o.isBuffer(t) || !o.isBuffer(e))
        throw new TypeError(
          'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
        );
      if (t === e) return 0;
      let n = t.length, c = e.length;
      for (let h = 0, f = Math.min(n, c); h < f; ++h)
        if (t[h] !== e[h]) {
          n = t[h], c = e[h];
          break;
        }
      return n < c ? -1 : c < n ? 1 : 0;
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
      const c = o.allocUnsafe(e);
      let h = 0;
      for (n = 0; n < t.length; ++n) {
        let f = t[n];
        if (q(f, Uint8Array))
          h + f.length > c.length ? (o.isBuffer(f) || (f = o.from(f)), f.copy(c, h)) : Uint8Array.prototype.set.call(
            c,
            f,
            h
          );
        else if (o.isBuffer(f))
          f.copy(c, h);
        else
          throw new TypeError('"list" argument must be an Array of Buffers');
        h += f.length;
      }
      return c;
    };
    function D(i, t) {
      if (o.isBuffer(i))
        return i.length;
      if (ArrayBuffer.isView(i) || q(i, ArrayBuffer))
        return i.byteLength;
      if (typeof i != "string")
        throw new TypeError(
          'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof i
        );
      const e = i.length, n = arguments.length > 2 && arguments[2] === !0;
      if (!n && e === 0) return 0;
      let c = !1;
      for (; ; )
        switch (t) {
          case "ascii":
          case "latin1":
          case "binary":
            return e;
          case "utf8":
          case "utf-8":
            return Ft(i).length;
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return e * 2;
          case "hex":
            return e >>> 1;
          case "base64":
            return Dt(i).length;
          default:
            if (c)
              return n ? -1 : Ft(i).length;
            t = ("" + t).toLowerCase(), c = !0;
        }
    }
    o.byteLength = D;
    function $(i, t, e) {
      let n = !1;
      if ((t === void 0 || t < 0) && (t = 0), t > this.length || ((e === void 0 || e > this.length) && (e = this.length), e <= 0) || (e >>>= 0, t >>>= 0, e <= t))
        return "";
      for (i || (i = "utf8"); ; )
        switch (i) {
          case "hex":
            return k(this, t, e);
          case "utf8":
          case "utf-8":
            return ot(this, t, e);
          case "ascii":
            return it(this, t, e);
          case "latin1":
          case "binary":
            return xt(this, t, e);
          case "base64":
            return rt(this, t, e);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return bt(this, t, e);
          default:
            if (n) throw new TypeError("Unknown encoding: " + i);
            i = (i + "").toLowerCase(), n = !0;
        }
    }
    o.prototype._isBuffer = !0;
    function P(i, t, e) {
      const n = i[t];
      i[t] = i[e], i[e] = n;
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
      return t === 0 ? "" : arguments.length === 0 ? ot(this, 0, t) : $.apply(this, arguments);
    }, o.prototype.toLocaleString = o.prototype.toString, o.prototype.equals = function(t) {
      if (!o.isBuffer(t)) throw new TypeError("Argument must be a Buffer");
      return this === t ? !0 : o.compare(this, t) === 0;
    }, o.prototype.inspect = function() {
      let t = "";
      const e = a.INSPECT_MAX_BYTES;
      return t = this.toString("hex", 0, e).replace(/(.{2})/g, "$1 ").trim(), this.length > e && (t += " ... "), "<Buffer " + t + ">";
    }, u && (o.prototype[u] = o.prototype.inspect), o.prototype.compare = function(t, e, n, c, h) {
      if (q(t, Uint8Array) && (t = o.from(t, t.offset, t.byteLength)), !o.isBuffer(t))
        throw new TypeError(
          'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof t
        );
      if (e === void 0 && (e = 0), n === void 0 && (n = t ? t.length : 0), c === void 0 && (c = 0), h === void 0 && (h = this.length), e < 0 || n > t.length || c < 0 || h > this.length)
        throw new RangeError("out of range index");
      if (c >= h && e >= n)
        return 0;
      if (c >= h)
        return -1;
      if (e >= n)
        return 1;
      if (e >>>= 0, n >>>= 0, c >>>= 0, h >>>= 0, this === t) return 0;
      let f = h - c, A = n - e;
      const v = Math.min(f, A), M = this.slice(c, h), L = t.slice(e, n);
      for (let F = 0; F < v; ++F)
        if (M[F] !== L[F]) {
          f = M[F], A = L[F];
          break;
        }
      return f < A ? -1 : A < f ? 1 : 0;
    };
    function st(i, t, e, n, c) {
      if (i.length === 0) return -1;
      if (typeof e == "string" ? (n = e, e = 0) : e > 2147483647 ? e = 2147483647 : e < -2147483648 && (e = -2147483648), e = +e, Pt(e) && (e = c ? 0 : i.length - 1), e < 0 && (e = i.length + e), e >= i.length) {
        if (c) return -1;
        e = i.length - 1;
      } else if (e < 0)
        if (c) e = 0;
        else return -1;
      if (typeof t == "string" && (t = o.from(t, n)), o.isBuffer(t))
        return t.length === 0 ? -1 : J(i, t, e, n, c);
      if (typeof t == "number")
        return t = t & 255, typeof Uint8Array.prototype.indexOf == "function" ? c ? Uint8Array.prototype.indexOf.call(i, t, e) : Uint8Array.prototype.lastIndexOf.call(i, t, e) : J(i, [t], e, n, c);
      throw new TypeError("val must be string, number or Buffer");
    }
    function J(i, t, e, n, c) {
      let h = 1, f = i.length, A = t.length;
      if (n !== void 0 && (n = String(n).toLowerCase(), n === "ucs2" || n === "ucs-2" || n === "utf16le" || n === "utf-16le")) {
        if (i.length < 2 || t.length < 2)
          return -1;
        h = 2, f /= 2, A /= 2, e /= 2;
      }
      function v(L, F) {
        return h === 1 ? L[F] : L.readUInt16BE(F * h);
      }
      let M;
      if (c) {
        let L = -1;
        for (M = e; M < f; M++)
          if (v(i, M) === v(t, L === -1 ? 0 : M - L)) {
            if (L === -1 && (L = M), M - L + 1 === A) return L * h;
          } else
            L !== -1 && (M -= M - L), L = -1;
      } else
        for (e + A > f && (e = f - A), M = e; M >= 0; M--) {
          let L = !0;
          for (let F = 0; F < A; F++)
            if (v(i, M + F) !== v(t, F)) {
              L = !1;
              break;
            }
          if (L) return M;
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
    function gt(i, t, e, n) {
      e = Number(e) || 0;
      const c = i.length - e;
      n ? (n = Number(n), n > c && (n = c)) : n = c;
      const h = t.length;
      n > h / 2 && (n = h / 2);
      let f;
      for (f = 0; f < n; ++f) {
        const A = parseInt(t.substr(f * 2, 2), 16);
        if (Pt(A)) return f;
        i[e + f] = A;
      }
      return f;
    }
    function tt(i, t, e, n) {
      return It(Ft(t, i.length - e), i, e, n);
    }
    function mt(i, t, e, n) {
      return It(Qt(t), i, e, n);
    }
    function et(i, t, e, n) {
      return It(Dt(t), i, e, n);
    }
    function yt(i, t, e, n) {
      return It(te(t, i.length - e), i, e, n);
    }
    o.prototype.write = function(t, e, n, c) {
      if (e === void 0)
        c = "utf8", n = this.length, e = 0;
      else if (n === void 0 && typeof e == "string")
        c = e, n = this.length, e = 0;
      else if (isFinite(e))
        e = e >>> 0, isFinite(n) ? (n = n >>> 0, c === void 0 && (c = "utf8")) : (c = n, n = void 0);
      else
        throw new Error(
          "Buffer.write(string, encoding, offset[, length]) is no longer supported"
        );
      const h = this.length - e;
      if ((n === void 0 || n > h) && (n = h), t.length > 0 && (n < 0 || e < 0) || e > this.length)
        throw new RangeError("Attempt to write outside buffer bounds");
      c || (c = "utf8");
      let f = !1;
      for (; ; )
        switch (c) {
          case "hex":
            return gt(this, t, e, n);
          case "utf8":
          case "utf-8":
            return tt(this, t, e, n);
          case "ascii":
          case "latin1":
          case "binary":
            return mt(this, t, e, n);
          case "base64":
            return et(this, t, e, n);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return yt(this, t, e, n);
          default:
            if (f) throw new TypeError("Unknown encoding: " + c);
            c = ("" + c).toLowerCase(), f = !0;
        }
    }, o.prototype.toJSON = function() {
      return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
      };
    };
    function rt(i, t, e) {
      return t === 0 && e === i.length ? r.fromByteArray(i) : r.fromByteArray(i.slice(t, e));
    }
    function ot(i, t, e) {
      e = Math.min(i.length, e);
      const n = [];
      let c = t;
      for (; c < e; ) {
        const h = i[c];
        let f = null, A = h > 239 ? 4 : h > 223 ? 3 : h > 191 ? 2 : 1;
        if (c + A <= e) {
          let v, M, L, F;
          switch (A) {
            case 1:
              h < 128 && (f = h);
              break;
            case 2:
              v = i[c + 1], (v & 192) === 128 && (F = (h & 31) << 6 | v & 63, F > 127 && (f = F));
              break;
            case 3:
              v = i[c + 1], M = i[c + 2], (v & 192) === 128 && (M & 192) === 128 && (F = (h & 15) << 12 | (v & 63) << 6 | M & 63, F > 2047 && (F < 55296 || F > 57343) && (f = F));
              break;
            case 4:
              v = i[c + 1], M = i[c + 2], L = i[c + 3], (v & 192) === 128 && (M & 192) === 128 && (L & 192) === 128 && (F = (h & 15) << 18 | (v & 63) << 12 | (M & 63) << 6 | L & 63, F > 65535 && F < 1114112 && (f = F));
          }
        }
        f === null ? (f = 65533, A = 1) : f > 65535 && (f -= 65536, n.push(f >>> 10 & 1023 | 55296), f = 56320 | f & 1023), n.push(f), c += A;
      }
      return wt(n);
    }
    const at = 4096;
    function wt(i) {
      const t = i.length;
      if (t <= at)
        return String.fromCharCode.apply(String, i);
      let e = "", n = 0;
      for (; n < t; )
        e += String.fromCharCode.apply(
          String,
          i.slice(n, n += at)
        );
      return e;
    }
    function it(i, t, e) {
      let n = "";
      e = Math.min(i.length, e);
      for (let c = t; c < e; ++c)
        n += String.fromCharCode(i[c] & 127);
      return n;
    }
    function xt(i, t, e) {
      let n = "";
      e = Math.min(i.length, e);
      for (let c = t; c < e; ++c)
        n += String.fromCharCode(i[c]);
      return n;
    }
    function k(i, t, e) {
      const n = i.length;
      (!t || t < 0) && (t = 0), (!e || e < 0 || e > n) && (e = n);
      let c = "";
      for (let h = t; h < e; ++h)
        c += ee[i[h]];
      return c;
    }
    function bt(i, t, e) {
      const n = i.slice(t, e);
      let c = "";
      for (let h = 0; h < n.length - 1; h += 2)
        c += String.fromCharCode(n[h] + n[h + 1] * 256);
      return c;
    }
    o.prototype.slice = function(t, e) {
      const n = this.length;
      t = ~~t, e = e === void 0 ? n : ~~e, t < 0 ? (t += n, t < 0 && (t = 0)) : t > n && (t = n), e < 0 ? (e += n, e < 0 && (e = 0)) : e > n && (e = n), e < t && (e = t);
      const c = this.subarray(t, e);
      return Object.setPrototypeOf(c, o.prototype), c;
    };
    function C(i, t, e) {
      if (i % 1 !== 0 || i < 0) throw new RangeError("offset is not uint");
      if (i + t > e) throw new RangeError("Trying to access beyond buffer length");
    }
    o.prototype.readUintLE = o.prototype.readUIntLE = function(t, e, n) {
      t = t >>> 0, e = e >>> 0, n || C(t, e, this.length);
      let c = this[t], h = 1, f = 0;
      for (; ++f < e && (h *= 256); )
        c += this[t + f] * h;
      return c;
    }, o.prototype.readUintBE = o.prototype.readUIntBE = function(t, e, n) {
      t = t >>> 0, e = e >>> 0, n || C(t, e, this.length);
      let c = this[t + --e], h = 1;
      for (; e > 0 && (h *= 256); )
        c += this[t + --e] * h;
      return c;
    }, o.prototype.readUint8 = o.prototype.readUInt8 = function(t, e) {
      return t = t >>> 0, e || C(t, 1, this.length), this[t];
    }, o.prototype.readUint16LE = o.prototype.readUInt16LE = function(t, e) {
      return t = t >>> 0, e || C(t, 2, this.length), this[t] | this[t + 1] << 8;
    }, o.prototype.readUint16BE = o.prototype.readUInt16BE = function(t, e) {
      return t = t >>> 0, e || C(t, 2, this.length), this[t] << 8 | this[t + 1];
    }, o.prototype.readUint32LE = o.prototype.readUInt32LE = function(t, e) {
      return t = t >>> 0, e || C(t, 4, this.length), (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + this[t + 3] * 16777216;
    }, o.prototype.readUint32BE = o.prototype.readUInt32BE = function(t, e) {
      return t = t >>> 0, e || C(t, 4, this.length), this[t] * 16777216 + (this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]);
    }, o.prototype.readBigUInt64LE = K(function(t) {
      t = t >>> 0, Y(t, "offset");
      const e = this[t], n = this[t + 7];
      (e === void 0 || n === void 0) && V(t, this.length - 8);
      const c = e + this[++t] * 2 ** 8 + this[++t] * 2 ** 16 + this[++t] * 2 ** 24, h = this[++t] + this[++t] * 2 ** 8 + this[++t] * 2 ** 16 + n * 2 ** 24;
      return BigInt(c) + (BigInt(h) << BigInt(32));
    }), o.prototype.readBigUInt64BE = K(function(t) {
      t = t >>> 0, Y(t, "offset");
      const e = this[t], n = this[t + 7];
      (e === void 0 || n === void 0) && V(t, this.length - 8);
      const c = e * 2 ** 24 + this[++t] * 2 ** 16 + this[++t] * 2 ** 8 + this[++t], h = this[++t] * 2 ** 24 + this[++t] * 2 ** 16 + this[++t] * 2 ** 8 + n;
      return (BigInt(c) << BigInt(32)) + BigInt(h);
    }), o.prototype.readIntLE = function(t, e, n) {
      t = t >>> 0, e = e >>> 0, n || C(t, e, this.length);
      let c = this[t], h = 1, f = 0;
      for (; ++f < e && (h *= 256); )
        c += this[t + f] * h;
      return h *= 128, c >= h && (c -= Math.pow(2, 8 * e)), c;
    }, o.prototype.readIntBE = function(t, e, n) {
      t = t >>> 0, e = e >>> 0, n || C(t, e, this.length);
      let c = e, h = 1, f = this[t + --c];
      for (; c > 0 && (h *= 256); )
        f += this[t + --c] * h;
      return h *= 128, f >= h && (f -= Math.pow(2, 8 * e)), f;
    }, o.prototype.readInt8 = function(t, e) {
      return t = t >>> 0, e || C(t, 1, this.length), this[t] & 128 ? (255 - this[t] + 1) * -1 : this[t];
    }, o.prototype.readInt16LE = function(t, e) {
      t = t >>> 0, e || C(t, 2, this.length);
      const n = this[t] | this[t + 1] << 8;
      return n & 32768 ? n | 4294901760 : n;
    }, o.prototype.readInt16BE = function(t, e) {
      t = t >>> 0, e || C(t, 2, this.length);
      const n = this[t + 1] | this[t] << 8;
      return n & 32768 ? n | 4294901760 : n;
    }, o.prototype.readInt32LE = function(t, e) {
      return t = t >>> 0, e || C(t, 4, this.length), this[t] | this[t + 1] << 8 | this[t + 2] << 16 | this[t + 3] << 24;
    }, o.prototype.readInt32BE = function(t, e) {
      return t = t >>> 0, e || C(t, 4, this.length), this[t] << 24 | this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3];
    }, o.prototype.readBigInt64LE = K(function(t) {
      t = t >>> 0, Y(t, "offset");
      const e = this[t], n = this[t + 7];
      (e === void 0 || n === void 0) && V(t, this.length - 8);
      const c = this[t + 4] + this[t + 5] * 2 ** 8 + this[t + 6] * 2 ** 16 + (n << 24);
      return (BigInt(c) << BigInt(32)) + BigInt(e + this[++t] * 2 ** 8 + this[++t] * 2 ** 16 + this[++t] * 2 ** 24);
    }), o.prototype.readBigInt64BE = K(function(t) {
      t = t >>> 0, Y(t, "offset");
      const e = this[t], n = this[t + 7];
      (e === void 0 || n === void 0) && V(t, this.length - 8);
      const c = (e << 24) + // Overflow
      this[++t] * 2 ** 16 + this[++t] * 2 ** 8 + this[++t];
      return (BigInt(c) << BigInt(32)) + BigInt(this[++t] * 2 ** 24 + this[++t] * 2 ** 16 + this[++t] * 2 ** 8 + n);
    }), o.prototype.readFloatLE = function(t, e) {
      return t = t >>> 0, e || C(t, 4, this.length), s.read(this, t, !0, 23, 4);
    }, o.prototype.readFloatBE = function(t, e) {
      return t = t >>> 0, e || C(t, 4, this.length), s.read(this, t, !1, 23, 4);
    }, o.prototype.readDoubleLE = function(t, e) {
      return t = t >>> 0, e || C(t, 8, this.length), s.read(this, t, !0, 52, 8);
    }, o.prototype.readDoubleBE = function(t, e) {
      return t = t >>> 0, e || C(t, 8, this.length), s.read(this, t, !1, 52, 8);
    };
    function T(i, t, e, n, c, h) {
      if (!o.isBuffer(i)) throw new TypeError('"buffer" argument must be a Buffer instance');
      if (t > c || t < h) throw new RangeError('"value" argument is out of bounds');
      if (e + n > i.length) throw new RangeError("Index out of range");
    }
    o.prototype.writeUintLE = o.prototype.writeUIntLE = function(t, e, n, c) {
      if (t = +t, e = e >>> 0, n = n >>> 0, !c) {
        const A = Math.pow(2, 8 * n) - 1;
        T(this, t, e, n, A, 0);
      }
      let h = 1, f = 0;
      for (this[e] = t & 255; ++f < n && (h *= 256); )
        this[e + f] = t / h & 255;
      return e + n;
    }, o.prototype.writeUintBE = o.prototype.writeUIntBE = function(t, e, n, c) {
      if (t = +t, e = e >>> 0, n = n >>> 0, !c) {
        const A = Math.pow(2, 8 * n) - 1;
        T(this, t, e, n, A, 0);
      }
      let h = n - 1, f = 1;
      for (this[e + h] = t & 255; --h >= 0 && (f *= 256); )
        this[e + h] = t / f & 255;
      return e + n;
    }, o.prototype.writeUint8 = o.prototype.writeUInt8 = function(t, e, n) {
      return t = +t, e = e >>> 0, n || T(this, t, e, 1, 255, 0), this[e] = t & 255, e + 1;
    }, o.prototype.writeUint16LE = o.prototype.writeUInt16LE = function(t, e, n) {
      return t = +t, e = e >>> 0, n || T(this, t, e, 2, 65535, 0), this[e] = t & 255, this[e + 1] = t >>> 8, e + 2;
    }, o.prototype.writeUint16BE = o.prototype.writeUInt16BE = function(t, e, n) {
      return t = +t, e = e >>> 0, n || T(this, t, e, 2, 65535, 0), this[e] = t >>> 8, this[e + 1] = t & 255, e + 2;
    }, o.prototype.writeUint32LE = o.prototype.writeUInt32LE = function(t, e, n) {
      return t = +t, e = e >>> 0, n || T(this, t, e, 4, 4294967295, 0), this[e + 3] = t >>> 24, this[e + 2] = t >>> 16, this[e + 1] = t >>> 8, this[e] = t & 255, e + 4;
    }, o.prototype.writeUint32BE = o.prototype.writeUInt32BE = function(t, e, n) {
      return t = +t, e = e >>> 0, n || T(this, t, e, 4, 4294967295, 0), this[e] = t >>> 24, this[e + 1] = t >>> 16, this[e + 2] = t >>> 8, this[e + 3] = t & 255, e + 4;
    };
    function ct(i, t, e, n, c) {
      W(t, n, c, i, e, 7);
      let h = Number(t & BigInt(4294967295));
      i[e++] = h, h = h >> 8, i[e++] = h, h = h >> 8, i[e++] = h, h = h >> 8, i[e++] = h;
      let f = Number(t >> BigInt(32) & BigInt(4294967295));
      return i[e++] = f, f = f >> 8, i[e++] = f, f = f >> 8, i[e++] = f, f = f >> 8, i[e++] = f, e;
    }
    function ut(i, t, e, n, c) {
      W(t, n, c, i, e, 7);
      let h = Number(t & BigInt(4294967295));
      i[e + 7] = h, h = h >> 8, i[e + 6] = h, h = h >> 8, i[e + 5] = h, h = h >> 8, i[e + 4] = h;
      let f = Number(t >> BigInt(32) & BigInt(4294967295));
      return i[e + 3] = f, f = f >> 8, i[e + 2] = f, f = f >> 8, i[e + 1] = f, f = f >> 8, i[e] = f, e + 8;
    }
    o.prototype.writeBigUInt64LE = K(function(t, e = 0) {
      return ct(this, t, e, BigInt(0), BigInt("0xffffffffffffffff"));
    }), o.prototype.writeBigUInt64BE = K(function(t, e = 0) {
      return ut(this, t, e, BigInt(0), BigInt("0xffffffffffffffff"));
    }), o.prototype.writeIntLE = function(t, e, n, c) {
      if (t = +t, e = e >>> 0, !c) {
        const v = Math.pow(2, 8 * n - 1);
        T(this, t, e, n, v - 1, -v);
      }
      let h = 0, f = 1, A = 0;
      for (this[e] = t & 255; ++h < n && (f *= 256); )
        t < 0 && A === 0 && this[e + h - 1] !== 0 && (A = 1), this[e + h] = (t / f >> 0) - A & 255;
      return e + n;
    }, o.prototype.writeIntBE = function(t, e, n, c) {
      if (t = +t, e = e >>> 0, !c) {
        const v = Math.pow(2, 8 * n - 1);
        T(this, t, e, n, v - 1, -v);
      }
      let h = n - 1, f = 1, A = 0;
      for (this[e + h] = t & 255; --h >= 0 && (f *= 256); )
        t < 0 && A === 0 && this[e + h + 1] !== 0 && (A = 1), this[e + h] = (t / f >> 0) - A & 255;
      return e + n;
    }, o.prototype.writeInt8 = function(t, e, n) {
      return t = +t, e = e >>> 0, n || T(this, t, e, 1, 127, -128), t < 0 && (t = 255 + t + 1), this[e] = t & 255, e + 1;
    }, o.prototype.writeInt16LE = function(t, e, n) {
      return t = +t, e = e >>> 0, n || T(this, t, e, 2, 32767, -32768), this[e] = t & 255, this[e + 1] = t >>> 8, e + 2;
    }, o.prototype.writeInt16BE = function(t, e, n) {
      return t = +t, e = e >>> 0, n || T(this, t, e, 2, 32767, -32768), this[e] = t >>> 8, this[e + 1] = t & 255, e + 2;
    }, o.prototype.writeInt32LE = function(t, e, n) {
      return t = +t, e = e >>> 0, n || T(this, t, e, 4, 2147483647, -2147483648), this[e] = t & 255, this[e + 1] = t >>> 8, this[e + 2] = t >>> 16, this[e + 3] = t >>> 24, e + 4;
    }, o.prototype.writeInt32BE = function(t, e, n) {
      return t = +t, e = e >>> 0, n || T(this, t, e, 4, 2147483647, -2147483648), t < 0 && (t = 4294967295 + t + 1), this[e] = t >>> 24, this[e + 1] = t >>> 16, this[e + 2] = t >>> 8, this[e + 3] = t & 255, e + 4;
    }, o.prototype.writeBigInt64LE = K(function(t, e = 0) {
      return ct(this, t, e, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    }), o.prototype.writeBigInt64BE = K(function(t, e = 0) {
      return ut(this, t, e, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    function ht(i, t, e, n, c, h) {
      if (e + n > i.length) throw new RangeError("Index out of range");
      if (e < 0) throw new RangeError("Index out of range");
    }
    function lt(i, t, e, n, c) {
      return t = +t, e = e >>> 0, c || ht(i, t, e, 4), s.write(i, t, e, n, 23, 4), e + 4;
    }
    o.prototype.writeFloatLE = function(t, e, n) {
      return lt(this, t, e, !0, n);
    }, o.prototype.writeFloatBE = function(t, e, n) {
      return lt(this, t, e, !1, n);
    };
    function ft(i, t, e, n, c) {
      return t = +t, e = e >>> 0, c || ht(i, t, e, 8), s.write(i, t, e, n, 52, 8), e + 8;
    }
    o.prototype.writeDoubleLE = function(t, e, n) {
      return ft(this, t, e, !0, n);
    }, o.prototype.writeDoubleBE = function(t, e, n) {
      return ft(this, t, e, !1, n);
    }, o.prototype.copy = function(t, e, n, c) {
      if (!o.isBuffer(t)) throw new TypeError("argument should be a Buffer");
      if (n || (n = 0), !c && c !== 0 && (c = this.length), e >= t.length && (e = t.length), e || (e = 0), c > 0 && c < n && (c = n), c === n || t.length === 0 || this.length === 0) return 0;
      if (e < 0)
        throw new RangeError("targetStart out of bounds");
      if (n < 0 || n >= this.length) throw new RangeError("Index out of range");
      if (c < 0) throw new RangeError("sourceEnd out of bounds");
      c > this.length && (c = this.length), t.length - e < c - n && (c = t.length - e + n);
      const h = c - n;
      return this === t && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(e, n, c) : Uint8Array.prototype.set.call(
        t,
        this.subarray(n, c),
        e
      ), h;
    }, o.prototype.fill = function(t, e, n, c) {
      if (typeof t == "string") {
        if (typeof e == "string" ? (c = e, e = 0, n = this.length) : typeof n == "string" && (c = n, n = this.length), c !== void 0 && typeof c != "string")
          throw new TypeError("encoding must be a string");
        if (typeof c == "string" && !o.isEncoding(c))
          throw new TypeError("Unknown encoding: " + c);
        if (t.length === 1) {
          const f = t.charCodeAt(0);
          (c === "utf8" && f < 128 || c === "latin1") && (t = f);
        }
      } else typeof t == "number" ? t = t & 255 : typeof t == "boolean" && (t = Number(t));
      if (e < 0 || this.length < e || this.length < n)
        throw new RangeError("Out of range index");
      if (n <= e)
        return this;
      e = e >>> 0, n = n === void 0 ? this.length : n >>> 0, t || (t = 0);
      let h;
      if (typeof t == "number")
        for (h = e; h < n; ++h)
          this[h] = t;
      else {
        const f = o.isBuffer(t) ? t : o.from(t, c), A = f.length;
        if (A === 0)
          throw new TypeError('The value "' + t + '" is invalid for argument "value"');
        for (h = 0; h < n - e; ++h)
          this[h + e] = f[h % A];
      }
      return this;
    };
    const N = {};
    function G(i, t, e) {
      N[i] = class extends e {
        constructor() {
          super(), Object.defineProperty(this, "message", {
            value: t.apply(this, arguments),
            writable: !0,
            configurable: !0
          }), this.name = `${this.name} [${i}]`, this.stack, delete this.name;
        }
        get code() {
          return i;
        }
        set code(c) {
          Object.defineProperty(this, "code", {
            configurable: !0,
            enumerable: !0,
            value: c,
            writable: !0
          });
        }
        toString() {
          return `${this.name} [${i}]: ${this.message}`;
        }
      };
    }
    G(
      "ERR_BUFFER_OUT_OF_BOUNDS",
      function(i) {
        return i ? `${i} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
      },
      RangeError
    ), G(
      "ERR_INVALID_ARG_TYPE",
      function(i, t) {
        return `The "${i}" argument must be of type number. Received type ${typeof t}`;
      },
      TypeError
    ), G(
      "ERR_OUT_OF_RANGE",
      function(i, t, e) {
        let n = `The value of "${i}" is out of range.`, c = e;
        return Number.isInteger(e) && Math.abs(e) > 2 ** 32 ? c = X(String(e)) : typeof e == "bigint" && (c = String(e), (e > BigInt(2) ** BigInt(32) || e < -(BigInt(2) ** BigInt(32))) && (c = X(c)), c += "n"), n += ` It must be ${t}. Received ${c}`, n;
      },
      RangeError
    );
    function X(i) {
      let t = "", e = i.length;
      const n = i[0] === "-" ? 1 : 0;
      for (; e >= n + 4; e -= 3)
        t = `_${i.slice(e - 3, e)}${t}`;
      return `${i.slice(0, e)}${t}`;
    }
    function z(i, t, e) {
      Y(t, "offset"), (i[t] === void 0 || i[t + e] === void 0) && V(t, i.length - (e + 1));
    }
    function W(i, t, e, n, c, h) {
      if (i > e || i < t) {
        const f = typeof t == "bigint" ? "n" : "";
        let A;
        throw t === 0 || t === BigInt(0) ? A = `>= 0${f} and < 2${f} ** ${(h + 1) * 8}${f}` : A = `>= -(2${f} ** ${(h + 1) * 8 - 1}${f}) and < 2 ** ${(h + 1) * 8 - 1}${f}`, new N.ERR_OUT_OF_RANGE("value", A, i);
      }
      z(n, c, h);
    }
    function Y(i, t) {
      if (typeof i != "number")
        throw new N.ERR_INVALID_ARG_TYPE(t, "number", i);
    }
    function V(i, t, e) {
      throw Math.floor(i) !== i ? (Y(i, e), new N.ERR_OUT_OF_RANGE("offset", "an integer", i)) : t < 0 ? new N.ERR_BUFFER_OUT_OF_BOUNDS() : new N.ERR_OUT_OF_RANGE(
        "offset",
        `>= 0 and <= ${t}`,
        i
      );
    }
    const Et = /[^+/0-9A-Za-z-_]/g;
    function Ut(i) {
      if (i = i.split("=")[0], i = i.trim().replace(Et, ""), i.length < 2) return "";
      for (; i.length % 4 !== 0; )
        i = i + "=";
      return i;
    }
    function Ft(i, t) {
      t = t || 1 / 0;
      let e;
      const n = i.length;
      let c = null;
      const h = [];
      for (let f = 0; f < n; ++f) {
        if (e = i.charCodeAt(f), e > 55295 && e < 57344) {
          if (!c) {
            if (e > 56319) {
              (t -= 3) > -1 && h.push(239, 191, 189);
              continue;
            } else if (f + 1 === n) {
              (t -= 3) > -1 && h.push(239, 191, 189);
              continue;
            }
            c = e;
            continue;
          }
          if (e < 56320) {
            (t -= 3) > -1 && h.push(239, 191, 189), c = e;
            continue;
          }
          e = (c - 55296 << 10 | e - 56320) + 65536;
        } else c && (t -= 3) > -1 && h.push(239, 191, 189);
        if (c = null, e < 128) {
          if ((t -= 1) < 0) break;
          h.push(e);
        } else if (e < 2048) {
          if ((t -= 2) < 0) break;
          h.push(
            e >> 6 | 192,
            e & 63 | 128
          );
        } else if (e < 65536) {
          if ((t -= 3) < 0) break;
          h.push(
            e >> 12 | 224,
            e >> 6 & 63 | 128,
            e & 63 | 128
          );
        } else if (e < 1114112) {
          if ((t -= 4) < 0) break;
          h.push(
            e >> 18 | 240,
            e >> 12 & 63 | 128,
            e >> 6 & 63 | 128,
            e & 63 | 128
          );
        } else
          throw new Error("Invalid code point");
      }
      return h;
    }
    function Qt(i) {
      const t = [];
      for (let e = 0; e < i.length; ++e)
        t.push(i.charCodeAt(e) & 255);
      return t;
    }
    function te(i, t) {
      let e, n, c;
      const h = [];
      for (let f = 0; f < i.length && !((t -= 2) < 0); ++f)
        e = i.charCodeAt(f), n = e >> 8, c = e % 256, h.push(c), h.push(n);
      return h;
    }
    function Dt(i) {
      return r.toByteArray(Ut(i));
    }
    function It(i, t, e, n) {
      let c;
      for (c = 0; c < n && !(c + e >= t.length || c >= i.length); ++c)
        t[c + e] = i[c];
      return c;
    }
    function q(i, t) {
      return i instanceof t || i != null && i.constructor != null && i.constructor.name != null && i.constructor.name === t.name;
    }
    function Pt(i) {
      return i !== i;
    }
    const ee = function() {
      const i = "0123456789abcdef", t = new Array(256);
      for (let e = 0; e < 16; ++e) {
        const n = e * 16;
        for (let c = 0; c < 16; ++c)
          t[n + c] = i[e] + i[c];
      }
      return t;
    }();
    function K(i) {
      return typeof BigInt > "u" ? re : i;
    }
    function re() {
      throw new Error("BigInt not supported");
    }
  }(Mt)), Mt;
}
var ce = ae();
async function zt(a) {
  if (a instanceof Blob) return new Uint8Array(await a.arrayBuffer());
  if (a instanceof Uint8Array) return new Uint8Array(a);
  if (a instanceof ArrayBuffer) return new Uint8Array(a.slice(0));
  throw new TypeError("Expected an SBC Blob, ArrayBuffer or Uint8Array");
}
function Ot(a, r) {
  const s = a >>> 7 ^ r;
  return (a << 1 ^ (s ? 29 : 0)) & 255;
}
function ue(a, r, s) {
  let u = 15;
  for (const l of [r + 1, r + 2])
    for (let g = 7; g >= 0; g--) u = Ot(u, a[l] >>> g & 1);
  for (let l = 0; l < s; l++)
    u = Ot(u, a[r + 4 + (l >>> 3)] >>> 7 - (l & 7) & 1);
  return u;
}
function Vt(a, r) {
  const s = (U) => {
    throw new Error(`Invalid SBC at byte ${r}: ${U}`);
  };
  if (!Number.isInteger(r) || r < 0 || r + 4 > a.length)
    return s("truncated header");
  if (a[r] !== 156) return s("expected SBC syncword 0x9c");
  const u = a[r + 1], l = [16e3, 32e3, 44100, 48e3][u >>> 6], g = [4, 8, 12, 16][u >>> 4 & 3], d = u >>> 2 & 3, o = u & 1 ? 8 : 4, p = d === 0 ? 1 : 2, y = a[r + 2];
  if (y < 2 || y > Math.min(250, (d < 2 ? 16 : 32) * o))
    return s("invalid bitpool");
  const E = d === 3 ? o : 0, b = 4 * o * p, I = g * y * (d < 2 ? p : 1), m = 4 + b / 8 + Math.ceil((E + I) / 8);
  return r + m > a.length ? s("truncated frame") : ue(a, r, b + E) !== a[r + 3] ? s("CRC mismatch") : { length: m, sampleRate: l, channels: p, samples: g * o, blocks: g, subbands: o, mode: d, bitpool: y };
}
function he(a, r = 1 / 0) {
  if (!a.length) throw new Error("SBC data is empty");
  let s = 0, u = 0, l = 0, g = 0;
  for (let d = 0; d < a.length; ) {
    const o = Vt(a, d);
    if (o.length > r) throw new Error("SBC frame exceeds the HID packet capacity");
    if (g && (o.sampleRate !== s || o.channels !== u))
      throw new Error("SBC frequency and channel count must remain constant");
    s = o.sampleRate, u = o.channels, l += o.samples, g++, d += o.length;
  }
  return { sampleRate: s, channels: u, samples: l, frames: g };
}
const le = "" + new URL("assets/playback.worker-3KOsE6w8.js", import.meta.url).href;
var fe = function(d, o, p, y, E, b) {
  var d, o, p, y, E, b, I, m, U;
  switch (arguments.length == 2 && typeof arguments[1] == "object" ? (d = arguments[0], o = arguments[1].polynomial, p = arguments[1].initial, y = arguments[1].finalXor, E = arguments[1].inputReflected, b = arguments[1].resultReflected) : arguments.length == 6 && (d = arguments[0], o = arguments[1], p = arguments[2], y = arguments[3], E = arguments[4], b = arguments[5]), d) {
    case 8:
      m = 255;
      break;
    case 16:
      m = 65535;
      break;
    case 32:
      m = 4294967295;
      break;
    default:
      throw "Invalid CRC width";
  }
  U = 1 << d - 1, this.calcCrcTable = function() {
    I = new Array(256);
    for (var B = 0; B < 256; B++) {
      for (var S = B << d - 8 & m, R = 0; R < 8; R++)
        (S & U) != 0 ? (S <<= 1, S ^= o) : S <<= 1;
      I[B] = S & m;
    }
  }, this.calcCrcTableReversed = function() {
    I = new Array(256);
    for (var B = 0; B < 256; B++) {
      for (var S = new nt().Reflect8(B), R = S << d - 8 & m, _ = 0; _ < 8; _++)
        (R & U) != 0 ? (R <<= 1, R ^= o) : R <<= 1;
      R = new nt().ReflectGeneric(R, d), I[B] = R & m;
    }
  }, this.crcTable || this.calcCrcTable(), this.compute = function(B) {
    for (var S = p, R = 0; R < B.length; R++) {
      var _ = B[R] & 255;
      E && (_ = new nt().Reflect8(_)), S = (S ^ _ << d - 8) & m;
      var D = S >> d - 8 & 255;
      S = S << 8 & m, S = (S ^ I[D]) & m;
    }
    return b && (S = new nt().ReflectGeneric(S, d)), (S ^ y) & m;
  }, this.getLookupTable = function() {
    return I;
  };
}, nt = function() {
  if (nt.prototype._singletonInstance)
    return nt.prototype._singletonInstance;
  nt.prototype._singletonInstance = this, this.Reflect8 = function(a) {
    for (var r = 0, s = 0; s < 8; s++)
      (a & 1 << s) != 0 && (r |= 1 << 7 - s & 255);
    return r;
  }, this.Reflect16 = function(a) {
    for (var r = 0, s = 0; s < 16; s++)
      (a & 1 << s) != 0 && (r |= 1 << 15 - s & 65535);
    return r;
  }, this.Reflect32 = function(a) {
    for (var r = 0, s = 0; s < 32; s++)
      (a & 1 << s) != 0 && (r |= 1 << 31 - s & 4294967295);
    return r;
  }, this.ReflectGeneric = function(a, r) {
    for (var s = 0, u = 0; u < r; u++)
      (a & 1 << u) != 0 && (s |= 1 << r - 1 - u);
    return s;
  };
};
function jt(a) {
  var r = new fe(32, 79764919, 4294967295, 4294967295, !0, !0), s = r.compute(a);
  return new Uint8Array(new Int32Array([s]).buffer);
}
const de = {
  now: () => performance.now(),
  setTimeout: (a, r) => setTimeout(a, r),
  clearTimeout: (a) => clearTimeout(a)
};
function pe(a, r = de) {
  let s, u = !1;
  const l = () => {
    s && r.now() >= s.deadline && s.finish("inputreport");
  }, g = typeof a.addEventListener == "function" && typeof a.removeEventListener == "function";
  return g && a.addEventListener("inputreport", l), {
    now: () => r.now(),
    sleep(d) {
      return u ? Promise.reject(new Error("Playback clock disposed")) : s ? Promise.reject(new Error("Playback clock already waiting")) : new Promise((o, p) => {
        const y = r.now() + d;
        let E = !1;
        const b = () => {
          E = !0, r.clearTimeout(m), s = void 0;
        }, I = (U) => {
          E || (b(), o(U));
        }, m = r.setTimeout(() => I("timer"), d);
        s = {
          deadline: y,
          finish: I,
          cancel() {
            E || (b(), p(new Error("Playback clock disposed")));
          }
        };
      });
    },
    dispose() {
      u || (u = !0, g && a.removeEventListener("inputreport", l), s == null || s.cancel());
    }
  };
}
const At = 523, $t = 7;
async function Gt(a, r, s) {
  let u;
  for (; (u = a - r.now()) > 0; )
    await r.sleep(u) === "inputreport" ? s.inputReportWakeups++ : (s.timerWakeups++, s.maxTimerDelayMs = Math.max(s.maxTimerDelayMs, r.now() - a));
}
function ge(a) {
  he(a, At - $t);
  const r = [];
  let s = 0, u = 0;
  for (; s < a.length; ) {
    const l = new Uint8Array(527);
    l.set([162, 24, 72, 160, u & 255, u >>> 8, 2]);
    let g = $t, d = 0, o = 0;
    for (; s < a.length; ) {
      const p = Vt(a, s);
      if (g + p.length > At) break;
      l.set(a.subarray(s, s + p.length), g), g += p.length, s += p.length, d++, o += p.samples * 1e3 / p.sampleRate;
    }
    l.set(jt(l.subarray(0, At)), At), r.push({ report: l.subarray(2), duration: o }), u = u + d & 65535;
  }
  return r;
}
async function Xt(a, r, s = {}, u) {
  const l = s.bufferAheadMs ?? 64;
  if (!Number.isFinite(l) || l < 0 || l > 64)
    throw new RangeError("bufferAheadMs must be between 0 and 64 ms");
  const g = ge(r), d = u ? void 0 : pe(a);
  u ?? (u = d);
  try {
    const o = u.now(), p = {
      transport: "main-thread",
      bufferAheadMs: l,
      packetsSent: 0,
      audioDurationMs: 0,
      elapsedMs: 0,
      maxSchedulingDelayMs: 0,
      maxTimerDelayMs: 0,
      maxWriteDurationMs: 0,
      maxReportGapMs: 0,
      inputReportWakeups: 0,
      timerWakeups: 0,
      estimatedStarvations: 0,
      maxEstimatedStarvationMs: 0
    };
    let y = o, E = o, b = 0;
    for (const { report: I, duration: m } of g) {
      const U = p.packetsSent === 0 ? o : Math.max(
        y - l,
        E + Math.min(4, b)
      );
      u.now() < U && await Gt(U, u, p);
      const B = u.now();
      p.maxSchedulingDelayMs = Math.max(p.maxSchedulingDelayMs, B - U), p.packetsSent > 0 && (p.maxReportGapMs = Math.max(p.maxReportGapMs, B - E)), await a.sendReport(24, I);
      const S = u.now();
      p.maxWriteDurationMs = Math.max(p.maxWriteDurationMs, S - B), p.packetsSent === 0 ? y = S : S > y && (p.estimatedStarvations++, p.maxEstimatedStarvationMs = Math.max(p.maxEstimatedStarvationMs, S - y), y = S), y += m, p.audioDurationMs += m, p.packetsSent++, E = B, b = m;
    }
    return await Gt(y, u, p), p.elapsedMs = u.now() - o, p;
  } finally {
    d == null || d.dispose();
  }
}
function me(a) {
  return {
    vendorId: a.vendorId,
    productId: a.productId,
    productName: a.productName,
    collections: JSON.stringify(a.collections)
  };
}
function ye(a, r) {
  return a.filter((s) => s.vendorId === r.vendorId && s.productId === r.productId && s.productName === r.productName && JSON.stringify(s.collections) === r.collections);
}
class _t extends Error {
}
async function we(a, r, s) {
  const u = me(a);
  try {
    const l = ye(await navigator.hid.getDevices(), u);
    if (l.length !== 1 || l[0] !== a)
      throw new Error("Cannot identify a unique controller for worker playback");
  } catch (l) {
    throw new _t(l instanceof Error ? l.message : String(l));
  }
  return new Promise((l, g) => {
    let d;
    try {
      d = new Worker(new URL(s.workerURL ?? le, document.baseURI), { type: "module" });
    } catch (I) {
      g(new _t(I instanceof Error ? I.message : String(I)));
      return;
    }
    let o = !1, p = !1;
    const y = () => {
      clearTimeout(b), d.terminate();
    }, E = (I) => {
      p || (p = !0, y(), g(o ? new Error(I) : new _t(I)));
    }, b = setTimeout(() => E("Playback worker setup timed out"), 5e3);
    d.onerror = (I) => {
      I.preventDefault(), E("Playback worker failed to load or execute");
    }, d.onmessageerror = () => E("Playback worker message could not be decoded"), d.onmessage = ({ data: I }) => {
      if (!p)
        if (I.type === "ready" && !o) {
          clearTimeout(b), o = !0;
          try {
            d.postMessage({ type: "play", data: r, bufferAheadMs: s.bufferAheadMs }, [r.buffer]);
          } catch (m) {
            E(m instanceof Error ? m.message : String(m));
          }
        } else I.type === "complete" && o ? (p = !0, y(), l(I.stats)) : (I.type === "error" || I.type === "unavailable") && E(I.reason);
    };
    try {
      d.postMessage({ type: "prepare", identity: u });
    } catch (I) {
      E(I instanceof Error ? I.message : String(I));
    }
  });
}
async function xe(a, r, s = {}) {
  var d;
  const u = s.transport ?? "auto";
  if (!["auto", "worker", "main-thread"].includes(u)) throw new Error("Invalid audio transport");
  if (u === "main-thread") return Xt(a, r, s);
  let l;
  if (typeof Worker > "u" || typeof document > "u" || typeof navigator > "u" || typeof ((d = navigator.hid) == null ? void 0 : d.getDevices) != "function")
    l = "Worker playback requires WebHID getDevices and dedicated workers";
  else
    try {
      return await we(a, r, s);
    } catch (o) {
      if (!(o instanceof _t)) throw o;
      l = o.message;
    }
  if (u === "worker") throw new Error(l);
  return { ...await Xt(a, r, s), workerFallbackReason: l };
}
var Q = /* @__PURE__ */ ((a) => (a.Disconnected = "none", a.USB = "usb", a.Bluetooth = "bt", a))(Q || {}), vt = /* @__PURE__ */ ((a) => (a[a.Gamepad = 0] = "Gamepad", a[a.Guitar = 1] = "Guitar", a[a.Drums = 2] = "Drums", a[a.Wheel = 6] = "Wheel", a[a.Fightstick = 7] = "Fightstick", a[a.HOTAS = 8] = "HOTAS", a))(vt || {});
const be = {
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
function Ct(a, r, s) {
  return s < 0 && (s += 1), s > 1 && (s -= 1), s < 1 / 6 ? a + (r - a) * 6 * s : s < 1 / 2 ? r : s < 2 / 3 ? a + (r - a) * (2 / 3 - s) * 6 : a;
}
function Ee(a, r, s) {
  const u = { r: 0, g: 0, b: 0 };
  if (r === 0)
    u.r = u.g = u.b = s * 255;
  else {
    var l = s < 0.5 ? s * (1 + r) : s + r - s * r, g = 2 * s - l;
    u.r = Ct(g, l, a + 1 / 3) * 255, u.g = Ct(g, l, a) * 255, u.b = Ct(g, l, a - 1 / 3) * 255;
  }
  return u;
}
class Ht {
  /** @ignore */
  constructor(r) {
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
    this.controller = r;
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
  set r(r) {
    this._r = Math.min(255, Math.max(0, r)), this.updateLightbar();
  }
  /** Green Color Intensity (0-255) */
  get g() {
    return this._g;
  }
  set g(r) {
    this._g = Math.min(255, Math.max(0, r)), this.updateLightbar();
  }
  /** Blue Color Intensity (0-255) */
  get b() {
    return this._b;
  }
  set b(r) {
    this._b = Math.min(255, Math.max(0, r)), this.updateLightbar();
  }
  /** Blink Speed On (0-255) */
  get blinkOn() {
    return this._blinkOn;
  }
  set blinkOn(r) {
    this._blinkOn = Math.min(255, Math.max(0, r)), this.updateLightbar();
  }
  /** Blink Speed Off (0-255) */
  get blinkOff() {
    return this._blinkOff;
  }
  set blinkOff(r) {
    this._blinkOff = Math.min(255, Math.max(0, r)), this.updateLightbar();
  }
  /**
   * Sets the lightbar color (RGB)
   * @param r - Red color intensity (0-255)
   * @param g - Green color intensity (0-255)
   * @param b - Blue color intensity (0-255)
   */
  async setColorRGB(r, s, u) {
    return this._r = Math.min(255, Math.max(0, r)), this._g = Math.min(255, Math.max(0, s)), this._b = Math.min(255, Math.max(0, u)), this.updateLightbar();
  }
  /**
   * Sets the lightbar color (HSL)
   * @param h - Hue
   * @param s - Saturation
   * @param l - Lightness
   */
  async setColorHSL(r, s, u) {
    const l = Ee(r, s, u);
    return this.setColorRGB(l.r, l.g, l.b);
  }
}
class Jt {
  /** @ignore */
  constructor(r) {
    /** @ignore */
    w(this, "_light", 0);
    /** @ignore */
    w(this, "_heavy", 0);
    this.controller = r;
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
  set light(r) {
    this._light = Math.max(0, Math.min(255, r)), this.updateRumble();
  }
  /** Heavy Rumble Intensity (0-255) */
  get heavy() {
    return this._heavy;
  }
  set heavy(r) {
    this._heavy = Math.max(0, Math.min(255, r)), this.updateRumble();
  }
  /**
   * Set the rumble intensity
   * @param light - Light rumble intensity (0-255)
   * @param heavy - Heavy rumble intensity (0-255)
   */
  async setRumbleIntensity(r, s) {
    return this._light = Math.min(255, Math.max(0, r)), this._heavy = Math.min(255, Math.max(0, s)), this.updateRumble();
  }
}
function Wt(a, r = 16) {
  const s = new Uint8Array(a), u = [];
  for (let l = 0; l < s.length; l += r) {
    const g = s.subarray(l, l + r), d = Array.from(g).map((p) => "0x" + p.toString(16).padStart(2, "0")).join(" "), o = Array.from(g).map((p) => p >= 32 && p <= 126 ? String.fromCharCode(p) : ".").join("");
    u.push(
      `${l.toString(16).padStart(4, "0")}: ${d} - ${o}`
    );
  }
  return u.join(`
`);
}
function Rt(a, r = 0) {
  const s = (a - 128) / 128;
  return Math.abs(s) <= r ? 0 : Math.min(1, Math.max(-1, s));
}
function qt(a, r = 0) {
  return Math.min(1, Math.max(r, a / 255));
}
class Zt {
  constructor(r, s) {
    /** Internal WebHID device */
    w(this, "device");
    /** Internal Gamepad instance */
    w(this, "gamepad");
    /** Raw contents of the last HID Report sent by the controller. */
    w(this, "lastReport");
    /** Raw contents of the last HID Report sent to the controller. */
    w(this, "lastSentReport");
    /** Current controller state */
    w(this, "state", be);
    /** Allows lightbar control */
    w(this, "lightbar", new Ht(this));
    /** Allows rumble control */
    w(this, "rumble", new Jt(this));
    w(this, "miscData", "");
    w(this, "volume", [56, 56, 0, 79]);
    w(this, "musicPlaying", !1);
    w(this, "audioPlaybackStats");
    this.device = r, this.gamepad = s;
  }
  /* getNameOfControllerType(controllerType: Number): any {
    return DualShock4ControllerType[controllerType]
      ? DualShock4ControllerType[controllerType]
      : `Unknown Type: 0x${controllerType.toString(16).padStart(2, "0")}`;
  } */
  async init() {
    this.device.opened || (await this.device.open(), this.device.oninputreport = (r) => this.processControllerReport(r));
  }
  /**
   * Parses a report sent from the controller and updates the state.
   *
   * This function is called internally by the library each time a report is received.
   *
   * @param report - HID Report sent by the controller.
   */
  processControllerReport(r) {
    const { data: s } = r;
    if (this.lastReport = s.buffer, this.musicPlaying || (this.miscData = `HID:
${Wt(
      s.buffer.slice(0, 9)
    )}

Data:
${Wt(s.buffer.slice(10))}`), this.state.interface === Q.Disconnected) {
      if (s.byteLength === 63)
        this.state.interface = Q.USB;
      else {
        this.state.interface = Q.Bluetooth, this.device.receiveFeatureReport(2).catch(
          (u) => console.error("Failed to enable full DS4 Bluetooth reports", u)
        );
        return;
      }
      this.lightbar.setColorRGB(0, 0, 64).catch((u) => console.error(u));
    }
    this.state.timestamp = r.timeStamp, this.state.interface === Q.USB && r.reportId === 1 ? this.updateState(s) : this.state.interface === Q.Bluetooth && r.reportId === 17 && this.updateState(new DataView(s.buffer, 2));
  }
  /**
   * Updates the controller state using normalized data from the last report.
   *
   * This function is called internally by the library each time a report is received.
   *
   * @param data - Normalized data from the HID report.
   */
  updateState(r) {
    this.state.axes.leftStickX = Rt(r.getUint8(0)), this.state.axes.leftStickY = Rt(r.getUint8(1)), this.state.axes.rightStickX = Rt(r.getUint8(2)), this.state.axes.rightStickY = Rt(r.getUint8(3));
    const s = r.getUint8(4);
    this.state.buttons.triangle = !!(s & 128), this.state.buttons.circle = !!(s & 64), this.state.buttons.cross = !!(s & 32), this.state.buttons.square = !!(s & 16);
    const u = s & 15;
    this.state.buttons.dPadUp = u === 7 || u === 0 || u === 1, this.state.buttons.dPadRight = u === 1 || u === 2 || u === 3, this.state.buttons.dPadDown = u === 3 || u === 4 || u === 5, this.state.buttons.dPadLeft = u === 5 || u === 6 || u === 7;
    const l = r.getUint8(5);
    this.state.buttons.l1 = !!(l & 1), this.state.buttons.r1 = !!(l & 2), this.state.buttons.l2 = !!(l & 4), this.state.buttons.r2 = !!(l & 8), this.state.buttons.share = !!(l & 16), this.state.buttons.options = !!(l & 32), this.state.buttons.l3 = !!(l & 64), this.state.buttons.r3 = !!(l & 128);
    const g = r.getUint8(6);
    switch (this.state.buttons.playStation = !!(g & 1), this.state.buttons.touchPadClick = !!(g & 2), this.state.controllerType) {
      case vt.Gamepad:
        this.state.axes.l2 = qt(r.getUint8(7)), this.state.axes.r2 = qt(r.getUint8(8)), this.state.charging = !!(r.getUint8(29) & 16), this.state.charging ? this.state.battery = Math.min(
          Math.floor((r.getUint8(29) & 15) * 100 / 11)
        ) : this.state.battery = Math.min(
          100,
          Math.floor((r.getUint8(29) & 15) * 100 / 8)
        ), this.state.headphones = !!(r.getUint8(29) & 32), this.state.microphone = !!(r.getUint8(29) & 64), this.state.extension = !!(r.getUint8(29) & 128), this.state.headphones && this.state.microphone ? this.state.audio = "headset" : this.state.headphones && !this.state.microphone ? this.state.audio = "headphones" : !this.state.headphones && this.state.microphone ? this.state.audio = "microphone" : this.state.audio = "volume-high", this.state.axes.gyroX = r.getUint16(13), this.state.axes.gyroY = r.getUint16(15), this.state.axes.gyroZ = r.getUint16(17), this.state.axes.accelX = r.getInt16(19), this.state.axes.accelY = r.getInt16(21), this.state.axes.accelZ = r.getInt16(23), this.state.touchpad.touches = [], r.getUint8(34) & 128 || this.state.touchpad.touches.push({
          touchId: r.getUint8(34) & 127,
          x: (r.getUint8(36) & 15) << 8 | r.getUint8(35),
          y: r.getUint8(37) << 4 | (r.getUint8(36) & 240) >> 4
        }), r.getUint8(38) & 128 || this.state.touchpad.touches.push({
          touchId: r.getUint8(38) & 127,
          x: (r.getUint8(40) & 15) << 8 | r.getUint8(39),
          y: r.getUint8(41) << 4 | (r.getUint8(40) & 240) >> 4
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
      const r = new Uint8Array(16);
      return r[0] = 5, r[1] = 255, r[4] = this.rumble.light, r[5] = this.rumble.heavy, r[6] = this.lightbar.r, r[7] = this.lightbar.g, r[8] = this.lightbar.b, r[9] = this.lightbar.blinkOn, r[10] = this.lightbar.blinkOff, this.lastSentReport = r.buffer, this.device.sendReport(r[0], r.slice(1));
    } else {
      console.log("sending report via bluetooth");
      const r = [
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
      ], s = jt(r);
      r[75] = s[0], r[76] = s[1], r[77] = s[2], r[78] = s[3], r.shift(), r.shift();
      const u = ce.Buffer.from(r);
      return this.lastSentReport = u.buffer, this.device.sendReport(17, u);
    }
  }
  /**
   * Set the volume levels for the controller.
   * leftVolume - The volume level for the left speaker (0-255).
   * rightVolume - The volume level for the right speaker (0-255).
   * micVolume - The volume level for the microphone (0-255).
   * speakerVolume - The volume level for the speaker (0-79).
   */
  async setVolume(r, s, u, l) {
    if (!this.device)
      throw new Error(
        "Controller not initialized. You must call .init() first!"
      );
    this.volume = [r, s, u, l], await this.sendLocalState();
  }
  /**
   * Sets the color for the light bar.
   * @param red
   * @param green
   * @param blue
   */
  async setLightBarColor(r, s, u) {
    if (!this.device)
      throw new Error(
        "Controller not initialized. You must call .init() first!"
      );
    this.lightbar.setColorRGB(r, s, u), await this.sendLocalState();
  }
  /**
   * Sets the rumble light and heavy intensity.
   * @param light 0 - 255
   * @param heavy 0 - 255
   */
  async setRumbleIntensity(r, s) {
    if (!this.device)
      throw new Error(
        "Controller not initialized. You must call .init() first!"
      );
    await this.rumble.setRumbleIntensity(r, s);
  }
  /** Timing of the last successful playback; undefined during playback or after failure. */
  getAudioPlaybackStats() {
    return this.audioPlaybackStats ? { ...this.audioPlaybackStats } : void 0;
  }
  /**
   * Send raw SBC frames over Bluetooth. Convert other audio with audioToSbc().
   * Resolves after the last packet's nominal duration; rejects on invalid SBC,
   * concurrent playback, a closed device, or a failed HID write.
   */
  async sendMusic(r, s = {}) {
    var u;
    if (!((u = this.device) != null && u.opened))
      throw new Error("Controller not initialized. You must call .init() first!");
    if (this.state.interface !== Q.Bluetooth)
      throw new Error("sendMusic is only supported over Bluetooth");
    if (this.musicPlaying) throw new Error("Music is already playing on this controller");
    this.musicPlaying = !0, this.audioPlaybackStats = void 0;
    try {
      this.audioPlaybackStats = await xe(this.device, await zt(r), s);
    } finally {
      this.musicPlaying = !1;
    }
  }
  getName() {
    return this.device.productName || "Unknown DualShock Device";
  }
}
var Z = /* @__PURE__ */ ((a) => (a.Disconnected = "none", a.USB = "usb", a.Bluetooth = "bt", a))(Z || {});
const Ue = {
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
}, Be = () => {
  let a;
  const r = [];
  for (let s = 0; s < 256; ++s) {
    a = s;
    for (let u = 0; u < 8; ++u) a = a & 1 ? 3988292384 ^ a >>> 1 : a >>> 1;
    r[s] = a >>> 0;
  }
  return r;
}, Ie = (a, r) => {
  window.crcTable === void 0 && (window.crcTable = Be());
  let s = -1 >>> 0;
  for (const u of a)
    s = s >>> 8 ^ (window.crcTable[(s ^ u) & 255] ?? 0);
  for (let u = 0; u < r.byteLength; ++u)
    s = s >>> 8 ^ (window.crcTable[(s ^ r.getUint8(u)) & 255] ?? 0);
  return (s ^ -1) >>> 0;
}, Se = (a, r) => {
  const s = Ie(
    [162, a],
    new DataView(r.buffer, 0, r.byteLength - 4)
  );
  r[r.byteLength - 4] = s >>> 0 & 255, r[r.byteLength - 3] = s >>> 8 & 255, r[r.byteLength - 2] = s >>> 16 & 255, r[r.byteLength - 1] = s >>> 24 & 255;
}, O = (a) => 2 * a / 255 - 1, dt = (a) => a / 255, x = (a) => a ? 1 : 0, pt = class pt {
  constructor(r, s) {
    /** Internal WebHID device */
    w(this, "device");
    /** Internal Gamepad instance */
    w(this, "gamepad");
    /** Allows lightbar control */
    w(this, "lightbar", new Ht(this));
    /** Allows rumble control */
    w(this, "rumble", new Jt(this));
    /** Raw contents of the last HID Report sent by the controller. */
    w(this, "lastReport");
    /** Raw contents of the last HID Report sent to the controller. */
    w(this, "lastSentReport");
    /** Current controller state */
    w(this, "state", Ue);
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
    this.device = r, this.gamepad = s, this.outputSeq_ = 1, this.playerLeds_ = 0, this.muteLed_ = 0, this.motorLeft_ = 0, this.motorRight_ = 0, this.l2EffectMode_ = 38, this.l2EffectParam1_ = 144, this.l2EffectParam2_ = 160, this.l2EffectParam3_ = 255, this.l2EffectParam4_ = 0, this.l2EffectParam5_ = 0, this.l2EffectParam6_ = 0, this.l2EffectParam7_ = 0, this.r2EffectMode_ = 38, this.r2EffectParam1_ = 144, this.r2EffectParam2_ = 160, this.r2EffectParam3_ = 255, this.r2EffectParam4_ = 0, this.r2EffectParam5_ = 0, this.r2EffectParam6_ = 0, this.r2EffectParam7_ = 0, this.lightbarRed_ = 255, this.lightbarGreen_ = 255, this.lightbarBlue_ = 255, this.state.interface = Z.Disconnected;
    for (const u of this.device.collections) {
      if (u.usagePage !== pt.USAGE_PAGE_GENERIC_DESKTOP || u.usage !== pt.USAGE_ID_GD_GAMEPAD)
        continue;
      let l = u.inputReports.reduce((g, d) => Math.max(
        g,
        d.items.reduce((o, p) => o + p.reportSize * p.reportCount, 0)
      ), 0);
      l == 504 ? this.state.interface = Z.USB : l == 616 && (this.state.interface = Z.Bluetooth);
    }
  }
  async readFeatureReport05() {
    this.state.interface == Z.Bluetooth && await this.device.receiveFeatureReport(5);
  }
  async init() {
    this.device.opened || (this.device.open(), this.device.oninputreport = (r) => {
      this.onInputReport(r);
    });
  }
  onInputReport(r) {
    let s = r.reportId, u = r.data;
    if (this.state.interface === Z.USB)
      if (s == 1) this.handleUsbInputReport01(u);
      else return;
    else if (this.state.interface === Z.Bluetooth)
      if (s == 1) this.handleBluetoothInputReport01(u);
      else if (s == 49) this.handleBluetoothInputReport31(u);
      else return;
    else
      return;
  }
  handleUsbInputReport01(r) {
    if (r.byteLength != 63) return;
    let s = r.getUint8(0), u = r.getUint8(1), l = r.getUint8(2), g = r.getUint8(3), d = r.getUint8(4), o = r.getUint8(5);
    r.getUint8(6);
    let p = r.getUint8(7), y = r.getUint8(8), E = r.getUint8(9);
    r.getUint8(10), r.getUint8(11), r.getUint8(12), r.getUint8(13), r.getUint8(14);
    let b = r.getUint8(15), I = r.getUint8(16), m = r.getUint8(17), U = r.getUint8(18), B = r.getUint8(19), S = r.getUint8(20), R = r.getUint8(21), _ = r.getUint8(22), D = r.getUint8(23), $ = r.getUint8(24), P = r.getUint8(25), st = r.getUint8(26);
    r.getUint8(27), r.getUint8(28), r.getUint8(29), r.getUint8(30);
    let J = r.getUint8(32), gt = r.getUint8(33), tt = r.getUint8(34), mt = r.getUint8(35), et = r.getUint8(36), yt = r.getUint8(37), rt = r.getUint8(38), ot = r.getUint8(39), at = r.getUint8(41), wt = r.getUint8(42);
    this.state.axes.l2State = wt & 15, this.state.axes.r2State = at & 15;
    let it = r.getUint8(52), xt = r.getUint8(53);
    this.state.axes.leftStickX = O(s), this.state.axes.leftStickY = O(u), this.state.axes.rightStickX = O(l), this.state.axes.rightStickY = O(g), this.state.axes.l2 = dt(d), this.state.axes.r2 = dt(o);
    let k = p & 15;
    this.state.buttons.dPadUp = x(
      k === 0 || k === 1 || k === 7
    ), this.state.buttons.dPadDown = x(
      k === 3 || k === 4 || k === 5
    ), this.state.buttons.dPadLeft = x(
      k === 5 || k === 6 || k === 7
    ), this.state.buttons.dPadRight = x(
      k === 1 || k === 2 || k === 3
    ), this.state.buttons.square = x(p & 16), this.state.buttons.cross = x(p & 32), this.state.buttons.circle = x(p & 64), this.state.buttons.triangle = x(p & 128), this.state.buttons.l1 = x(y & 1), this.state.buttons.r1 = x(y & 2), this.state.buttons.l2 = x(y & 4), this.state.buttons.r2 = x(y & 8), this.state.buttons.create = x(y & 16), this.state.buttons.options = x(y & 32), this.state.buttons.l3 = x(y & 64), this.state.buttons.r3 = x(y & 128), this.state.buttons.playStation = x(E & 1), this.state.buttons.touchPadClick = x(E & 2), this.state.buttons.mute = x(E & 4);
    let bt = !(J & 128), C = J & 127, T = (tt & 15) << 8 | gt, ct = mt << 4 | (tt & 240) >> 4;
    this.state.touchpad.touches = [], this.state.touchpad.touches.push({
      touchActive: bt,
      touchId: C,
      x: T,
      y: ct
    });
    let ut = !(et & 128), ht = et & 127, lt = (rt & 15) << 8 | yt, ft = ot << 4 | (rt & 240) >> 4;
    this.state.touchpad.touches.push({
      touchActive: ut,
      touchId: ht,
      x: lt,
      y: ft
    });
    let N = I << 8 | b;
    N > 32767 && (N -= 65536);
    let G = U << 8 | m;
    G > 32767 && (G -= 65536);
    let X = S << 8 | B;
    X > 32767 && (X -= 65536);
    let z = _ << 8 | R;
    z > 32767 && (z -= 65536);
    let W = $ << 8 | D;
    W > 32767 && (W -= 65536);
    let Y = st << 8 | P;
    Y > 32767 && (Y -= 65536), this.state.axes.gyroX = N, this.state.axes.gyroY = G, this.state.axes.gyroZ = X, this.state.axes.accelX = z, this.state.axes.accelY = W, this.state.axes.accelZ = Y;
    let V = (it & 15) * 100 / 8, Et = !!(it & 32), Ut = !!(xt & 8);
    this.state.battery = V, this.state.batteryFull = Et, this.state.charging = Ut;
  }
  handleBluetoothInputReport01(r) {
    if (r.byteLength !== 9) return;
    let s = r.getUint8(0), u = r.getUint8(1), l = r.getUint8(2), g = r.getUint8(3), d = r.getUint8(4), o = r.getUint8(5), p = r.getUint8(6), y = r.getUint8(7), E = r.getUint8(8);
    this.state.axes.leftStickX = O(s), this.state.axes.leftStickY = O(u), this.state.axes.rightStickX = O(l), this.state.axes.rightStickY = O(g), this.state.axes.l2 = dt(y), this.state.axes.r2 = dt(E);
    let b = d & 15;
    this.state.buttons.dPadUp = x(
      b === 0 || b === 1 || b === 7
    ), this.state.buttons.dPadDown = x(
      b === 3 || b === 4 || b === 5
    ), this.state.buttons.dPadLeft = x(
      b === 5 || b === 6 || b === 7
    ), this.state.buttons.dPadRight = x(
      b === 1 || b === 2 || b === 3
    ), this.state.buttons.square = x(d & 16), this.state.buttons.cross = x(d & 32), this.state.buttons.circle = x(d & 64), this.state.buttons.triangle = x(d & 128), this.state.buttons.l1 = x(o & 1), this.state.buttons.r1 = x(o & 2), this.state.buttons.l2 = x(o & 4), this.state.buttons.r2 = x(o & 8), this.state.buttons.create = x(o & 16), this.state.buttons.options = x(o & 32), this.state.buttons.l3 = x(o & 64), this.state.buttons.r3 = x(o & 128), this.state.buttons.playStation = x(p & 1), this.state.buttons.touchPadClick = x(p & 2), this.state.buttons.mute = !1, this.state.touchpad.touches = [], this.state.axes.gyroX = 0, this.state.axes.gyroY = 0, this.state.axes.gyroZ = 0, this.state.axes.accelX = 0, this.state.axes.accelY = 0, this.state.axes.accelZ = 0, this.state.battery = 0, this.state.batteryFull = !1, this.state.charging = !1;
  }
  handleBluetoothInputReport31(r) {
    if (r.byteLength !== 77) return;
    let s = r.getUint8(1), u = r.getUint8(2), l = r.getUint8(3), g = r.getUint8(4), d = r.getUint8(5), o = r.getUint8(6), p = r.getUint8(8), y = r.getUint8(9), E = r.getUint8(10);
    r.getUint8(12), r.getUint8(13), r.getUint8(14), r.getUint8(15);
    let b = r.getUint8(16), I = r.getUint8(17), m = r.getUint8(18), U = r.getUint8(19), B = r.getUint8(20), S = r.getUint8(21), R = r.getUint8(22), _ = r.getUint8(23), D = r.getUint8(24), $ = r.getUint8(25), P = r.getUint8(26), st = r.getUint8(27), J = r.getUint8(33), gt = r.getUint8(34), tt = r.getUint8(35), mt = r.getUint8(36), et = r.getUint8(37), yt = r.getUint8(38), rt = r.getUint8(39), ot = r.getUint8(40), at = r.getUint8(42), wt = r.getUint8(43);
    this.state.axes.l2State = wt & 15, this.state.axes.r2State = at & 15;
    let it = r.getUint8(53), xt = r.getUint8(54);
    this.state.axes.leftStickX = O(s), this.state.axes.leftStickY = O(u), this.state.axes.rightStickX = O(l), this.state.axes.rightStickY = O(g), this.state.axes.l2 = dt(d), this.state.axes.r2 = dt(o);
    let k = p & 15;
    this.state.buttons.dPadUp = x(
      k === 0 || k === 1 || k === 7
    ), this.state.buttons.dPadDown = x(
      k === 3 || k === 4 || k === 5
    ), this.state.buttons.dPadLeft = x(
      k === 5 || k === 6 || k === 7
    ), this.state.buttons.dPadRight = x(
      k === 1 || k === 2 || k === 3
    ), this.state.buttons.square = x(p & 16), this.state.buttons.cross = x(p & 32), this.state.buttons.circle = x(p & 64), this.state.buttons.triangle = x(p & 128), this.state.buttons.l1 = x(y & 1), this.state.buttons.r1 = x(y & 2), this.state.buttons.l2 = x(y & 4), this.state.buttons.r2 = x(y & 8), this.state.buttons.create = x(y & 16), this.state.buttons.options = x(y & 32), this.state.buttons.l3 = x(y & 64), this.state.buttons.r3 = x(y & 128), this.state.buttons.playStation = x(E & 1), this.state.buttons.touchPadClick = x(E & 2), this.state.buttons.mute = x(E & 4), this.state.touchpad.touches = [];
    let bt = !(J & 128), C = J & 127, T = (tt & 15) << 8 | gt, ct = mt << 4 | (tt & 240) >> 4;
    this.state.touchpad.touches.push({
      touchId: C,
      x: T,
      y: ct,
      touchActive: bt
    });
    let ut = !(et & 128), ht = et & 127, lt = (rt & 15) << 8 | yt, ft = ot << 4 | (rt & 240) >> 4;
    this.state.touchpad.touches.push({
      touchId: ht,
      x: lt,
      y: ft,
      touchActive: ut
    });
    let N = I << 8 | b;
    N > 32767 && (N -= 65536);
    let G = U << 8 | m;
    G > 32767 && (G -= 65536);
    let X = S << 8 | B;
    X > 32767 && (X -= 65536);
    let z = _ << 8 | R;
    z > 32767 && (z -= 65536);
    let W = $ << 8 | D;
    W > 32767 && (W -= 65536);
    let Y = st << 8 | P;
    Y > 32767 && (Y -= 65536), this.state.axes.gyroX = N, this.state.axes.gyroY = G, this.state.axes.gyroZ = X, this.state.axes.accelX = z, this.state.axes.accelY = W, this.state.axes.accelZ = Y;
    let V = (it & 15) * 100 / 8, Et = !!(it & 32), Ut = !!(xt & 8);
    this.state.battery = V, this.state.batteryFull = Et, this.state.charging = Ut;
  }
  async sendLocalState() {
    navigator.getGamepads();
    let r, s, u, l, g;
    this.state.interface == Z.Bluetooth ? (r = 49, s = new Uint8Array(77), s[0] = this.outputSeq_ << 4, ++this.outputSeq_ === 16 && (this.outputSeq_ = 0), s[1] = 16, u = new DataView(s.buffer, 2, 47), l = new DataView(s.buffer, 12, 8), g = new DataView(s.buffer, 23, 8)) : this.state.interface == Z.USB && (r = 2, s = new Uint8Array(47), u = new DataView(s.buffer, 0, 47), l = new DataView(u.buffer, 10, 8), g = new DataView(u.buffer, 21, 8)), u.setUint8(0, 255), u.setUint8(1, 247), u.setUint8(2, this.rumble.light), u.setUint8(3, this.rumble.heavy), u.setUint8(8, this.muteLed_), u.setUint8(9, this.muteLed_ ? 0 : 16), l.setUint8(0, this.r2EffectMode_), l.setUint8(1, this.r2EffectParam1_), l.setUint8(2, this.r2EffectParam2_), l.setUint8(3, this.r2EffectParam3_), l.setUint8(4, this.r2EffectParam4_), l.setUint8(5, this.r2EffectParam5_), l.setUint8(6, this.r2EffectParam6_), l.setUint8(7, this.r2EffectParam7_), g.setUint8(0, this.l2EffectMode_), g.setUint8(1, this.l2EffectParam1_), g.setUint8(2, this.l2EffectParam2_), g.setUint8(3, this.l2EffectParam3_), g.setUint8(4, this.l2EffectParam4_), g.setUint8(5, this.l2EffectParam5_), g.setUint8(6, this.l2EffectParam6_), g.setUint8(7, this.l2EffectParam7_), u.setUint8(39, 2), u.setUint8(41, 2), u.setUint8(43, this.playerLeds_), u.setUint8(44, this.lightbar.r), u.setUint8(45, this.lightbar.g), u.setUint8(46, this.lightbar.b), this.state.interface == Z.Bluetooth && Se(r, s);
    try {
      await this.device.sendReport(r, s);
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
let kt = pt;
class Ae {
  constructor() {
    w(this, "events", {});
  }
  $on(r, s) {
    return this.events[r] || (this.events[r] = []), this.events[r].push(s), this;
  }
  $off(r, s) {
    const u = this.events[r];
    return u && (this.events[r] = u.filter(
      (l) => l !== s
    ), u.length === 0 && delete this.events[r]), this;
  }
  $once(r, s) {
    const u = (...l) => {
      this.$off(r, u), s.apply(this, l);
    };
    return this.$on(r, u);
  }
  $emit(r, ...s) {
    const u = this.events[r];
    u && u.forEach((l) => {
      l.apply(this, s);
    });
  }
}
class Re extends Ae {
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
        const l = s.gamepad.id.match(/(0x)?([0-9a-fA-F]{4})/g), g = l ? l[0] : null, d = l ? l[1] : null;
        g && d ? (console.log(`Vendor ID: ${g}, Product ID: ${d}`), navigator.hid.requestDevice({
          filters: [
            {
              vendorId: parseInt(g, 16),
              productId: parseInt(d, 16)
            }
          ]
        }).then((o) => {
          if (o.length > 0) {
            const p = o[0];
            console.log("DualShock device found:", p);
            let y = null;
            p.productId === 3302 ? y = new kt(p, s.gamepad) : y = new Zt(p, s.gamepad), this.devices.push(y), this.$emit("deviceconnected", y);
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
        const u = s[0];
        console.log("DualShock/DualSense device found:", u);
        let l = null;
        u.productId === 3302 ? l = new kt(u) : l = new Zt(u), this.devices.push(l), this.$emit("deviceconnected", l);
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
async function _e(a) {
  if (typeof OfflineAudioContext > "u") throw new Error("Conversion requires Web Audio");
  let r;
  if (a instanceof Blob) {
    if (!a.size) throw new Error("Audio file is empty");
    try {
      r = await new OfflineAudioContext(2, 1, 32e3).decodeAudioData(await a.arrayBuffer());
    } catch (s) {
      throw new Error("Cannot decode audio: invalid file or format unsupported by this browser", { cause: s });
    }
  } else if (typeof AudioBuffer < "u" && a instanceof AudioBuffer)
    r = a;
  else
    throw new TypeError("Expected an audio Blob or AudioBuffer");
  if (!r.length) throw new Error("Audio has no samples");
  if (r.sampleRate !== 32e3 || r.numberOfChannels !== 2) {
    const s = new OfflineAudioContext(2, Math.ceil(r.length * 32e3 / r.sampleRate), 32e3), u = s.createBufferSource();
    u.buffer = r;
    const l = s.createGain();
    l.channelCount = 2, l.channelCountMode = "explicit", l.channelInterpretation = "speakers", u.connect(l).connect(s.destination), u.start(), r = await s.startRendering();
  }
  return [new Float32Array(r.getChannelData(0)), new Float32Array(r.getChannelData(1))];
}
const ke = new URL("audio/sbc.wasm", import.meta.url).href, Fe = "" + new URL("assets/sbc.worker-B7epEAMJ.js", import.meta.url).href;
let Lt = {}, j, Pe = 0;
const H = /* @__PURE__ */ new Map();
function Ne(a) {
  if (H.size) throw new Error("Cannot configure SBC while a conversion is running");
  Me(), Lt = { ...a };
}
function Me() {
  j == null || j.terminate(), j = void 0;
  for (const a of H.values()) a.reject(new Error("SBC codec was disposed"));
  H.clear();
}
function Ce() {
  if (j) return j;
  if (typeof Worker > "u") throw new Error("SBC conversion requires Web Workers");
  const a = new Worker(new URL(Lt.workerURL ?? Fe, document.baseURI), { type: "module" });
  a.onmessage = ({ data: s }) => {
    const u = H.get(s.id);
    u && (H.delete(s.id), "error" in s ? u.reject(new Error(s.error)) : u.resolve(s));
  };
  const r = () => {
    for (const s of H.values()) s.reject(new Error("SBC worker failed to load or execute"));
    H.clear(), a.terminate(), j === a && (j = void 0);
  };
  return a.onerror = r, a.onmessageerror = r, j = a, a;
}
function Kt(a, r) {
  return new Promise((s, u) => {
    const l = Ce(), g = Pe++;
    H.set(g, { resolve: s, reject: u });
    try {
      l.postMessage({
        ...a,
        id: g,
        wasmURL: new URL(Lt.wasmURL ?? ke, document.baseURI).href
      }, r);
    } catch (d) {
      H.delete(g), u(d);
    }
  });
}
async function ve(a) {
  const r = await Kt({ operation: "encode", channels: a }, a.map((s) => s.buffer));
  if (!("operation" in r) || r.operation !== "encode") throw new Error("Unexpected SBC worker response");
  return r.data;
}
async function Le(a) {
  const r = await Kt({ operation: "decode", data: a }, [a.buffer]);
  if (!("operation" in r) || r.operation !== "decode") throw new Error("Unexpected SBC worker response");
  return r.pcm;
}
async function Ye(a) {
  return ve(await _e(a));
}
async function Oe(a) {
  if (typeof AudioBuffer > "u") throw new Error("Decoding to AudioBuffer requires Web Audio");
  const r = await Le(await zt(a)), s = new AudioBuffer({
    sampleRate: r.sampleRate,
    numberOfChannels: r.channels.length,
    length: r.channels[0].length
  });
  return r.channels.forEach((u, l) => s.copyToChannel(u, l)), s;
}
window.DeviceManager = Re;
export {
  Ye as audioToSbc,
  Ne as configureSbcCodec,
  Me as disposeSbcCodec,
  Oe as sbcToAudioBuffer
};
