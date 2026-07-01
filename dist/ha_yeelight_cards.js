//#region node_modules/@lit/reactive-element/css-tag.js
var e = globalThis, t = e.ShadowRoot && (e.ShadyCSS === void 0 || e.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, n = Symbol(), r = /* @__PURE__ */ new WeakMap(), i = class {
	constructor(e, t, r) {
		if (this._$cssResult$ = !0, r !== n) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, n = this.t;
		if (t && e === void 0) {
			let t = n !== void 0 && n.length === 1;
			t && (e = r.get(n)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), t && r.set(n, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, a = (e) => new i(typeof e == "string" ? e : e + "", void 0, n), o = (e, ...t) => new i(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
	if (!0 === e._$cssResult$) return e.cssText;
	if (typeof e == "number") return e;
	throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[r + 1], e[0]), e, n), s = (n, r) => {
	if (t) n.adoptedStyleSheets = r.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let t of r) {
		let r = document.createElement("style"), i = e.litNonce;
		i !== void 0 && r.setAttribute("nonce", i), r.textContent = t.cssText, n.appendChild(r);
	}
}, c = t ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return a(t);
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: ee, getOwnPropertyNames: te, getOwnPropertySymbols: ne, getPrototypeOf: re } = Object, d = globalThis, ie = d.trustedTypes, ae = ie ? ie.emptyScript : "", oe = d.reactiveElementPolyfillSupport, f = (e, t) => e, se = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? ae : null;
				break;
			case Object:
			case Array: e = e == null ? e : JSON.stringify(e);
		}
		return e;
	},
	fromAttribute(e, t) {
		let n = e;
		switch (t) {
			case Boolean:
				n = e !== null;
				break;
			case Number:
				n = e === null ? null : Number(e);
				break;
			case Object:
			case Array: try {
				n = JSON.parse(e);
			} catch {
				n = null;
			}
		}
		return n;
	}
}, ce = (e, t) => !l(e, t), le = {
	attribute: !0,
	type: String,
	converter: se,
	reflect: !1,
	useDefault: !1,
	hasChanged: ce
};
Symbol.metadata ??= Symbol("metadata"), d.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var p = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = le) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && u(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = ee(this.prototype, e) ?? {
			get() {
				return this[t];
			},
			set(e) {
				this[t] = e;
			}
		};
		return {
			get: r,
			set(t) {
				let a = r?.call(this);
				i?.call(this, t), this.requestUpdate(e, a, n);
			},
			configurable: !0,
			enumerable: !0
		};
	}
	static getPropertyOptions(e) {
		return this.elementProperties.get(e) ?? le;
	}
	static _$Ei() {
		if (this.hasOwnProperty(f("elementProperties"))) return;
		let e = re(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(f("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(f("properties"))) {
			let e = this.properties, t = [...te(e), ...ne(e)];
			for (let n of t) this.createProperty(n, e[n]);
		}
		let e = this[Symbol.metadata];
		if (e !== null) {
			let t = litPropertyMetadata.get(e);
			if (t !== void 0) for (let [e, n] of t) this.elementProperties.set(e, n);
		}
		this._$Eh = /* @__PURE__ */ new Map();
		for (let [e, t] of this.elementProperties) {
			let n = this._$Eu(e, t);
			n !== void 0 && this._$Eh.set(n, e);
		}
		this.elementStyles = this.finalizeStyles(this.styles);
	}
	static finalizeStyles(e) {
		let t = [];
		if (Array.isArray(e)) {
			let n = new Set(e.flat(Infinity).reverse());
			for (let e of n) t.unshift(c(e));
		} else e !== void 0 && t.push(c(e));
		return t;
	}
	static _$Eu(e, t) {
		let n = t.attribute;
		return !1 === n ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
	}
	constructor() {
		super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
	}
	_$Ev() {
		this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
	}
	addController(e) {
		(this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
	}
	removeController(e) {
		this._$EO?.delete(e);
	}
	_$E_() {
		let e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
		for (let n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
		e.size > 0 && (this._$Ep = e);
	}
	createRenderRoot() {
		let e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
		return s(e, this.constructor.elementStyles), e;
	}
	connectedCallback() {
		this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
	}
	enableUpdating(e) {}
	disconnectedCallback() {
		this._$EO?.forEach((e) => e.hostDisconnected?.());
	}
	attributeChangedCallback(e, t, n) {
		this._$AK(e, n);
	}
	_$ET(e, t) {
		let n = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, n);
		if (r !== void 0 && !0 === n.reflect) {
			let i = (n.converter?.toAttribute === void 0 ? se : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? se : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? ce)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
			this.C(e, t, n);
		}
		!1 === this.isUpdatePending && (this._$ES = this._$EP());
	}
	C(e, t, { useDefault: n, reflect: r, wrapped: i }, a) {
		n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), !0 !== i || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), !0 === r && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
	}
	async _$EP() {
		this.isUpdatePending = !0;
		try {
			await this._$ES;
		} catch (e) {
			Promise.reject(e);
		}
		let e = this.scheduleUpdate();
		return e != null && await e, !this.isUpdatePending;
	}
	scheduleUpdate() {
		return this.performUpdate();
	}
	performUpdate() {
		if (!this.isUpdatePending) return;
		if (!this.hasUpdated) {
			if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
				for (let [e, t] of this._$Ep) this[e] = t;
				this._$Ep = void 0;
			}
			let e = this.constructor.elementProperties;
			if (e.size > 0) for (let [t, n] of e) {
				let { wrapped: e } = n, r = this[t];
				!0 !== e || this._$AL.has(t) || r === void 0 || this.C(t, void 0, n, r);
			}
		}
		let e = !1, t = this._$AL;
		try {
			e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((e) => e.hostUpdate?.()), this.update(t)) : this._$EM();
		} catch (t) {
			throw e = !1, this._$EM(), t;
		}
		e && this._$AE(t);
	}
	willUpdate(e) {}
	_$AE(e) {
		this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
	}
	_$EM() {
		this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
	}
	get updateComplete() {
		return this.getUpdateComplete();
	}
	getUpdateComplete() {
		return this._$ES;
	}
	shouldUpdate(e) {
		return !0;
	}
	update(e) {
		this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
	}
	updated(e) {}
	firstUpdated(e) {}
};
p.elementStyles = [], p.shadowRootOptions = { mode: "open" }, p[f("elementProperties")] = /* @__PURE__ */ new Map(), p[f("finalized")] = /* @__PURE__ */ new Map(), oe?.({ ReactiveElement: p }), (d.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var ue = globalThis, de = (e) => e, m = ue.trustedTypes, fe = m ? m.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, pe = "$lit$", h = `lit$${Math.random().toFixed(9).slice(2)}$`, me = "?" + h, he = `<${me}>`, g = document, _ = () => g.createComment(""), v = (e) => e === null || typeof e != "object" && typeof e != "function", y = Array.isArray, ge = (e) => y(e) || typeof e?.[Symbol.iterator] == "function", b = "[ 	\n\f\r]", x = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, _e = /-->/g, ve = />/g, S = RegExp(`>|${b}(?:([^\\s"'>=/]+)(${b}*=${b}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), ye = /'/g, be = /"/g, xe = /^(?:script|style|textarea|title)$/i, C = ((e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}))(1), w = Symbol.for("lit-noChange"), T = Symbol.for("lit-nothing"), Se = /* @__PURE__ */ new WeakMap(), E = g.createTreeWalker(g, 129);
function Ce(e, t) {
	if (!y(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return fe === void 0 ? t : fe.createHTML(t);
}
var we = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = x;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === x ? c[1] === "!--" ? o = _e : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = S) : (xe.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = S) : o = ve : o === S ? c[0] === ">" ? (o = i ?? x, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? S : c[3] === "\"" ? be : ye) : o === be || o === ye ? o = S : o === _e || o === ve ? o = x : (o = S, i = void 0);
		let ee = o === S && e[t + 1].startsWith("/>") ? " " : "";
		a += o === x ? n + he : l >= 0 ? (r.push(s), n.slice(0, l) + pe + n.slice(l) + h + ee) : n + h + (l === -2 ? t : ee);
	}
	return [Ce(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, Te = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = we(t, n);
		if (this.el = e.createElement(l, r), E.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = E.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(pe)) {
					let t = u[o++], n = i.getAttribute(e).split(h), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Oe : r[1] === "?" ? ke : r[1] === "@" ? Ae : O
					}), i.removeAttribute(e);
				} else e.startsWith(h) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (xe.test(i.tagName)) {
					let e = i.textContent.split(h), t = e.length - 1;
					if (t > 0) {
						i.textContent = m ? m.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], _()), E.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], _());
					}
				}
			} else if (i.nodeType === 8) if (i.data === me) c.push({
				type: 2,
				index: a
			});
			else {
				let e = -1;
				for (; (e = i.data.indexOf(h, e + 1)) !== -1;) c.push({
					type: 7,
					index: a
				}), e += h.length - 1;
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = g.createElement("template");
		return n.innerHTML = e, n;
	}
};
function D(e, t, n = e, r) {
	if (t === w) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = v(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = D(e, i._$AS(e, t.values), i, r)), t;
}
var Ee = class {
	constructor(e, t) {
		this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
	}
	get parentNode() {
		return this._$AM.parentNode;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	u(e) {
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? g).importNode(t, !0);
		E.currentNode = r;
		let i = E.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new De(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new je(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = E.nextNode(), a++);
		}
		return E.currentNode = g, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, De = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = T, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
	}
	get parentNode() {
		let e = this._$AA.parentNode, t = this._$AM;
		return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
	}
	get startNode() {
		return this._$AA;
	}
	get endNode() {
		return this._$AB;
	}
	_$AI(e, t = this) {
		e = D(this, e, t), v(e) ? e === T || e == null || e === "" ? (this._$AH !== T && this._$AR(), this._$AH = T) : e !== this._$AH && e !== w && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? ge(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== T && v(this._$AH) ? this._$AA.nextSibling.data = e : this.T(g.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = Te.createElement(Ce(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new Ee(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = Se.get(e.strings);
		return t === void 0 && Se.set(e.strings, t = new Te(e)), t;
	}
	k(t) {
		y(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(_()), this.O(_()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = de(e).nextSibling;
			de(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, O = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = T, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = T;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = D(this, e, t, 0), a = !v(e) || e !== this._$AH && e !== w, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = D(this, r[n + o], t, o), s === w && (s = this._$AH[o]), a ||= !v(s) || s !== this._$AH[o], s === T ? e = T : e !== T && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === T ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Oe = class extends O {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === T ? void 0 : e;
	}
}, ke = class extends O {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== T);
	}
}, Ae = class extends O {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = D(this, e, t, 0) ?? T) === w) return;
		let n = this._$AH, r = e === T && n !== T || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== T && (n === T || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, je = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		D(this, e);
	}
}, Me = ue.litHtmlPolyfillSupport;
Me?.(Te, De), (ue.litHtmlVersions ??= []).push("3.3.3");
var Ne = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new De(t.insertBefore(_(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, Pe = globalThis, k = class extends p {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ne(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return w;
	}
};
k._$litElement$ = !0, k.finalized = !0, Pe.litElementHydrateSupport?.({ LitElement: k });
var Fe = Pe.litElementPolyfillSupport;
Fe?.({ LitElement: k }), (Pe.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region src/styles.ts
var Ie = o`
  :host {
    display: block;
    container-type: inline-size;
  }

  ha-card {
    height: 100%;
    overflow: hidden;
    border-radius: var(--ha-card-border-radius, 12px);
    background: var(--ha-card-background, var(--card-background-color, #fff));
    color: var(--primary-text-color, #212121);
  }

  .card {
    display: grid;
    gap: 12px;
    min-width: 0;
    padding: 16px;
  }

  .card.compact {
    gap: 10px;
    padding: 12px;
  }

  .card.vertical .header {
    grid-template-columns: 1fr;
    justify-items: start;
  }

  .card.vertical .state {
    justify-self: start;
  }

  .header {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  .icon {
    display: grid;
    place-items: center;
    width: 42px;
    height: 42px;
    border: 0;
    border-radius: 999px;
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
    color: var(--primary-text-color, #212121);
    cursor: pointer;
    overflow: hidden;
  }

  .icon.square {
    border-radius: 8px;
  }

  .icon.rounded {
    border-radius: 14px;
  }

  .icon.active {
    color: var(--primary-color, #03a9f4);
    background: color-mix(in srgb, var(--primary-color, #03a9f4) 14%, transparent);
  }

  .entity-picture {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  .title,
  .subtitle,
  .state {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .title {
    font-size: 15px;
    font-weight: 600;
  }

  .subtitle,
  .state,
  .chip {
    color: var(--secondary-text-color, #727272);
    font-size: 12px;
  }

  .state {
    justify-self: end;
    max-width: 120px;
    font-weight: 600;
  }

  .body {
    display: grid;
    gap: 10px;
  }

  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .chip {
    min-height: 24px;
    display: inline-flex;
    align-items: center;
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    border-radius: 999px;
    padding: 0 8px;
    background: color-mix(in srgb, var(--secondary-background-color, #f3f3f3) 80%, transparent);
  }

  .controls,
  .tiles {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    min-width: 0;
  }

  button.text,
  select,
  input[type="range"] {
    min-height: 36px;
  }

  button.text,
  select {
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    border-radius: 10px;
    background: var(--secondary-background-color, #f3f3f3);
    color: var(--primary-text-color, #212121);
    cursor: pointer;
    padding: 0 12px;
    font: inherit;
  }

  button.text:hover,
  select:hover {
    border-color: var(--primary-color, #03a9f4);
  }

  button.text:focus-visible,
  select:focus-visible,
  input[type="range"]:focus-visible {
    outline: 2px solid var(--primary-color, #03a9f4);
    outline-offset: 2px;
  }

  button:disabled,
  select:disabled,
  input:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  select {
    min-width: 132px;
    max-width: 100%;
  }

  input[type="range"] {
    flex: 1 1 150px;
    min-width: 140px;
    accent-color: var(--primary-color, #03a9f4);
  }

  .tile {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 6px;
    flex: 1 1 150px;
    min-width: 140px;
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    border-radius: 10px;
    padding: 10px;
    background: color-mix(in srgb, var(--secondary-background-color, #f3f3f3) 72%, transparent);
  }

  .tile strong,
  .tile span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .error {
    border-radius: 8px;
    padding: 8px 10px;
    color: var(--error-color, #db4437);
    background: color-mix(in srgb, var(--error-color, #db4437) 10%, transparent);
    font-size: 12px;
  }

  .empty {
    color: var(--secondary-text-color, #727272);
    font-size: 13px;
  }

  @container (max-width: 360px) {
    .card {
      padding: 12px;
    }

    .header {
      grid-template-columns: auto minmax(0, 1fr);
    }

    .state {
      grid-column: 2;
      justify-self: start;
      max-width: 100%;
    }

    .controls,
    .tiles {
      display: grid;
      grid-template-columns: 1fr;
    }

    input[type="range"],
    .tile,
    select {
      min-width: 0;
      width: 100%;
    }
  }
`, Le = {
	"card.light.name": "Yeelight 灯光卡",
	"card.light.description": "基于 HA 实体和服务的单灯增强控制。",
	"card.light.label": "Yeelight 灯光",
	"card.room.name": "Yeelight 房间卡",
	"card.room.description": "房间级灯光层、灯组和相关传感器摘要。",
	"card.room.label": "Yeelight 房间",
	"card.scene.name": "Yeelight 场景卡",
	"card.scene.description": "通过 HA 场景、按钮和选项实体控制场景、效果、节律和模式。",
	"card.scene.label": "Yeelight 场景",
	"card.strip.name": "Yeelight 灯带卡",
	"card.strip.description": "灯带、多区、渐变和效果控制，能力来自 HA 暴露的实体。",
	"card.strip.label": "Yeelight 灯带",
	"card.health.name": "Yeelight 诊断卡",
	"card.health.description": "展示 LAN、固件、在线、网关和能力诊断信息。",
	"card.health.label": "Yeelight 诊断",
	"card.channel.name": "Yeelight 多通道卡",
	"card.channel.description": "表达主光、氛围光、夜灯、继电器和多照明层关系。",
	"card.channel.label": "Yeelight 多通道",
	"card.panel.name": "Yeelight 面板卡",
	"card.panel.description": "场景面板、旋钮和屏幕快捷入口。",
	"card.panel.label": "Yeelight 面板",
	"card.device.name": "Yeelight 设备卡",
	"card.device.description": "面向同一设备扩展能力的自适应组合卡。",
	"card.device.label": "Yeelight 设备",
	"state.on": "开启",
	"state.off": "关闭",
	"state.open": "打开",
	"state.closed": "关闭",
	"state.unavailable": "不可用",
	"state.unknown": "未知",
	"state.action": "可执行",
	"domain.light": "灯光",
	"domain.switch": "开关",
	"domain.group": "分组",
	"domain.scene": "场景",
	"domain.button": "按钮",
	"domain.select": "选项",
	"domain.number": "数值",
	"domain.sensor": "传感器",
	"domain.binary_sensor": "二元传感器",
	"domain.event": "事件",
	"domain.update": "更新",
	"empty.select_entity": "请选择一个 Home Assistant 实体。",
	"empty.entity_unavailable": "{entity} 当前不可用。",
	"a11y.more_info": "查看更多信息",
	"chip.read_only": "只读",
	"chip.yeelight": "易来",
	"summary.health.ok": "诊断：可见实体均可用",
	"summary.health.issue": "诊断：{count} 个实体需要关注",
	"summary.health.empty": "未发现同设备诊断实体",
	"summary.room.layers": "已开启 {active}/{total} 个照明层",
	"summary.channel": "主光 / 氛围光 / 夜灯 / 继电器通道由 HA 实体提供",
	"summary.strip": "颜色、效果、渐变和分区能力来自 HA 暴露的实体",
	"summary.strip.empty": "未发现灯带效果、渐变或分区参数",
	"summary.scene": "场景、效果、节律和模式快捷入口",
	"summary.scene.empty": "未发现同设备场景、模式或效果入口",
	"summary.panel": "场景面板和旋钮快捷入口",
	"summary.device.empty": "未发现同设备的扩展能力实体",
	"summary.yeelight_pro_hint": "Yeelight Pro 实体可自动聚合同设备能力",
	"experience.main_light": "主光",
	"experience.ambient": "氛围光",
	"experience.night": "夜灯",
	"experience.strip": "灯带",
	"experience.relay": "继电器",
	"experience.mode": "模式 / 效果",
	"experience.scene": "场景",
	"experience.effect_param": "效果参数",
	"action.turn_on": "开启",
	"action.turn_off": "关闭",
	"action.press": "按下",
	"action.activate": "激活",
	"control.option": "选项",
	"control.effect": "效果",
	"control.brightness": "亮度",
	"control.percentage": "百分比",
	"health.firmware": "固件",
	"health.lan": "LAN 控制",
	"health.gateway": "网关",
	"health.cloud": "云连接",
	"health.online": "在线状态",
	"editor.loading_native": "正在加载 Home Assistant 原生可视化编辑器。",
	"editor.primary_helper": "选择一个 Home Assistant 实体即可开始。卡片会在显示时根据实体能力组织灯光层、场景和诊断信息。",
	"editor.entity_helper": "从 Home Assistant 已有实体中选择，不需要手写实体 ID。",
	"editor.entities_helper": "可选，使用 Home Assistant 实体选择器添加同一张卡内展示或控制的关联实体。",
	"editor.name_helper": "留空时使用 HA 实体名称。",
	"editor.card": "卡片",
	"editor.entity": "实体",
	"editor.entities": "实体",
	"editor.title": "标题",
	"editor.name": "名称",
	"editor.icon": "图标",
	"editor.icon_height": "图标高度",
	"editor.color": "颜色",
	"editor.theme": "主题",
	"editor.columns": "列数",
	"editor.display": "显示",
	"editor.actions": "动作",
	"editor.tap_action": "点击",
	"editor.hold_action": "长按",
	"editor.icon_hold_action": "图标长按",
	"editor.double_tap_action": "双击",
	"editor.icon_double_tap_action": "图标双击",
	"editor.advanced": "高级",
	"editor.layout": "布局",
	"editor.content_layout": "内容布局",
	"editor.appearance": "外观",
	"editor.primary_info": "主要信息",
	"editor.secondary_info": "次要信息",
	"editor.state_content": "状态内容",
	"editor.icon_type": "图标类型",
	"editor.icon_shape": "图标形态",
	"editor.show_entity_picture": "显示实体图片",
	"editor.show_name": "显示名称",
	"editor.show_icon": "显示图标",
	"editor.show_state": "显示状态",
	"editor.hide_state": "隐藏状态",
	"editor.show_controls": "显示控制项",
	"editor.state_color": "按状态着色",
	"editor.fill_container": "填充容器",
	"editor.vertical": "垂直布局",
	"editor.icon_tap_action": "图标点击",
	"option.default": "默认",
	"option.compact": "紧凑",
	"option.horizontal": "横向",
	"option.vertical": "纵向",
	"option.filled": "填充",
	"option.tonal": "柔和",
	"option.plain": "简洁",
	"option.icon": "图标",
	"option.entity-picture": "实体图片",
	"option.circle": "圆形",
	"option.square": "方形",
	"option.rounded": "圆角",
	"option.more-info": "更多信息",
	"option.toggle": "切换",
	"option.call-service": "调用服务",
	"option.navigate": "导航",
	"option.url": "打开 URL",
	"option.name": "名称",
	"option.state": "状态",
	"option.entity-id": "实体 ID",
	"option.last-changed": "最后变化",
	"option.last-updated": "最后更新",
	"option.brightness": "亮度",
	"option.color-temp": "色温",
	"option.effect": "效果",
	"option.bottom": "底部",
	"option.inline": "内联",
	"option.none": "不显示"
}, A = {
	"card.light.name": "Yeelight Light Card",
	"card.light.description": "Enhanced single-light control using HA entities and services.",
	"card.light.label": "Yeelight Light",
	"card.room.name": "Yeelight Room Card",
	"card.room.description": "Room-level lighting summary for layers, groups, and related sensors.",
	"card.room.label": "Yeelight Room",
	"card.scene.name": "Yeelight Scene Card",
	"card.scene.description": "Scene, effect, rhythm, and mode actions through HA entities.",
	"card.scene.label": "Yeelight Scene",
	"card.strip.name": "Yeelight Strip Card",
	"card.strip.description": "Strip, multi-zone, gradient, and effect controls exposed by HA.",
	"card.strip.label": "Yeelight Strip",
	"card.health.name": "Yeelight Health Card",
	"card.health.description": "LAN, firmware, online, gateway, and capability diagnostics.",
	"card.health.label": "Yeelight Health",
	"card.channel.name": "Yeelight Channel Card",
	"card.channel.description": "Main, ambient, night, relay, and layered lighting channels.",
	"card.channel.label": "Yeelight Channel",
	"card.panel.name": "Yeelight Panel Card",
	"card.panel.description": "Scene panel, knob, and screen-oriented shortcuts.",
	"card.panel.label": "Yeelight Panel",
	"card.device.name": "Yeelight Device Card",
	"card.device.description": "Adaptive bundle card for extended capabilities on one device.",
	"card.device.label": "Yeelight Device",
	"state.on": "On",
	"state.off": "Off",
	"state.open": "Open",
	"state.closed": "Closed",
	"state.unavailable": "Unavailable",
	"state.unknown": "Unknown",
	"state.action": "Ready",
	"domain.light": "Light",
	"domain.switch": "Switch",
	"domain.group": "Group",
	"domain.scene": "Scene",
	"domain.button": "Button",
	"domain.select": "Select",
	"domain.number": "Number",
	"domain.sensor": "Sensor",
	"domain.binary_sensor": "Binary sensor",
	"domain.event": "Event",
	"domain.update": "Update",
	"empty.select_entity": "Select a Home Assistant entity.",
	"empty.entity_unavailable": "{entity} is not available.",
	"a11y.more_info": "More information",
	"chip.read_only": "Read only",
	"chip.yeelight": "Yeelight",
	"summary.health.ok": "Diagnostics: all visible entities available",
	"summary.health.issue": "Diagnostics: {count} visible entities need attention",
	"summary.health.empty": "No diagnostic entities found on this device",
	"summary.room.layers": "{active}/{total} lighting layers active",
	"summary.channel": "Main / ambient / night / relay channels from HA entities",
	"summary.strip": "Color, effect, gradient, and zone controls exposed by HA",
	"summary.strip.empty": "No strip effect, gradient, or zone parameters found",
	"summary.scene": "Scenes, effects, rhythm, and mode shortcuts",
	"summary.scene.empty": "No scene, mode, or effect entry found on this device",
	"summary.panel": "Scene panel and knob shortcuts",
	"summary.device.empty": "No extended capability entities found on this device",
	"summary.yeelight_pro_hint": "Yeelight Pro entities can auto-group same-device capabilities",
	"experience.main_light": "Main light",
	"experience.ambient": "Ambient light",
	"experience.night": "Night light",
	"experience.strip": "Strip",
	"experience.relay": "Relay",
	"experience.mode": "Mode / effect",
	"experience.scene": "Scene",
	"experience.effect_param": "Effect parameter",
	"action.turn_on": "Turn on",
	"action.turn_off": "Turn off",
	"action.press": "Press",
	"action.activate": "Activate",
	"control.option": "Option",
	"control.effect": "Effect",
	"control.brightness": "Brightness",
	"control.percentage": "Percentage",
	"health.firmware": "Firmware",
	"health.lan": "LAN control",
	"health.gateway": "Gateway",
	"health.cloud": "Cloud",
	"health.online": "Online",
	"editor.loading_native": "Loading the Home Assistant native visual editor.",
	"editor.primary_helper": "Pick a Home Assistant entity to start. The card organizes lighting layers, scenes, and diagnostics from the entity capabilities while rendering.",
	"editor.entity_helper": "Choose from existing Home Assistant entities. No manual entity ID typing is needed.",
	"editor.entities_helper": "Optional. Use the Home Assistant entity selector to add related entities shown or controlled by this card.",
	"editor.name_helper": "Leave empty to use the HA entity name.",
	"editor.card": "Card",
	"editor.entity": "Entity",
	"editor.entities": "Entities",
	"editor.title": "Title",
	"editor.name": "Name",
	"editor.icon": "Icon",
	"editor.icon_height": "Icon height",
	"editor.color": "Color",
	"editor.theme": "Theme",
	"editor.columns": "Columns",
	"editor.display": "Display",
	"editor.actions": "Actions",
	"editor.tap_action": "Tap",
	"editor.hold_action": "Hold",
	"editor.icon_hold_action": "Icon hold",
	"editor.double_tap_action": "Double tap",
	"editor.icon_double_tap_action": "Icon double tap",
	"editor.advanced": "Advanced",
	"editor.layout": "Layout",
	"editor.content_layout": "Content layout",
	"editor.appearance": "Appearance",
	"editor.primary_info": "Primary info",
	"editor.secondary_info": "Secondary info",
	"editor.state_content": "State content",
	"editor.icon_type": "Icon type",
	"editor.icon_shape": "Icon shape",
	"editor.show_entity_picture": "Show entity picture",
	"editor.show_name": "Show name",
	"editor.show_icon": "Show icon",
	"editor.show_state": "Show state",
	"editor.hide_state": "Hide state",
	"editor.show_controls": "Show controls",
	"editor.state_color": "State color",
	"editor.fill_container": "Fill container",
	"editor.vertical": "Vertical",
	"editor.icon_tap_action": "Icon tap",
	"option.default": "Default",
	"option.compact": "Compact",
	"option.horizontal": "Horizontal",
	"option.vertical": "Vertical",
	"option.filled": "Filled",
	"option.tonal": "Tonal",
	"option.plain": "Plain",
	"option.icon": "Icon",
	"option.entity-picture": "Entity picture",
	"option.circle": "Circle",
	"option.square": "Square",
	"option.rounded": "Rounded",
	"option.more-info": "More info",
	"option.toggle": "Toggle",
	"option.call-service": "Call service",
	"option.navigate": "Navigate",
	"option.url": "Open URL",
	"option.name": "Name",
	"option.state": "State",
	"option.entity-id": "Entity ID",
	"option.last-changed": "Last changed",
	"option.last-updated": "Last updated",
	"option.brightness": "Brightness",
	"option.color-temp": "Color temperature",
	"option.effect": "Effect",
	"option.bottom": "Bottom",
	"option.inline": "Inline",
	"option.none": "None"
};
//#endregion
//#region src/i18n.ts
function j(e, t, n = {}) {
	return Ue((Be(e) === "zh" ? Le : A)[t] ?? A[t] ?? t, n);
}
function M(e, t = "zh-Hans") {
	return Ue((He(t) ? Le : A)[e] ?? A[e] ?? e);
}
function Re(e, t) {
	let n = `state.${t}`;
	return Ve(n) ? j(e, n) : t;
}
function ze(e, t) {
	let n = `domain.${t}`;
	return Ve(n) ? j(e, n) : t;
}
function N(e, t) {
	return `card.${e}.${t}`;
}
function Be(e) {
	return He(e?.locale?.language) ? "zh" : "en";
}
function Ve(e) {
	return e in A;
}
function He(e) {
	return !e || /^zh\b|^zh-/i.test(e);
}
function Ue(e, t = {}) {
	return Object.entries(t).reduce((e, [t, n]) => e.replaceAll(`{${t}}`, String(n)), e);
}
//#endregion
//#region src/entity.ts
var We = new Set([
	"sensor",
	"binary_sensor",
	"event"
]), Ge = new Set(["button", "scene"]);
function P(e) {
	return e.split(".", 1)[0] ?? "";
}
function F(e, t) {
	if (!e || !t) return;
	let n = e.states?.[t];
	if (!n) return;
	let r = P(t);
	return {
		entityId: t,
		domain: r,
		state: n.state,
		name: Je(n),
		icon: Ye(n, r),
		available: e.connected !== !1 && n.state !== "unavailable" && (n.state !== "unknown" || Ge.has(r)),
		readOnly: We.has(r),
		attributes: n.attributes ?? {},
		lastChanged: n.last_changed
	};
}
function I(e, t) {
	if (e?.states) return Object.keys(e.states).filter((e) => t.includes(P(e))).sort((t, n) => qe(e.states[n]) - qe(e.states[t]) || t.localeCompare(n)).at(0);
}
function Ke(e) {
	if (!e) return !1;
	let t = e.attributes ?? {}, n = `${e.entity_id} ${String(t.friendly_name ?? "")} ${String(t.manufacturer ?? "")} ${String(t.model ?? "")} ${String(t.device_class ?? "")}`.toLowerCase();
	return n.includes("yeelight") || n.includes("易来") || n.includes("yeelink");
}
function L(e, t) {
	if (Ge.has(e.domain) && e.state === "unknown") return j(t, "state.action");
	let n = Xe(e.attributes, "unit_of_measurement");
	return n ? `${e.state} ${n}` : Re(t, e.state);
}
function R(e, t) {
	let n = e[t];
	return typeof n == "number" && Number.isFinite(n) ? n : void 0;
}
function z(e, t) {
	let n = e[t];
	return Array.isArray(n) ? n.filter((e) => typeof e == "string") : [];
}
function qe(e) {
	let t = e.state !== "unavailable" && e.state !== "unknown" ? 10 : 0, n = `${e.entity_id} ${e.attributes?.friendly_name ?? ""}`.toLowerCase();
	return t + (n.includes("yeelight") || n.includes("易来") ? 1 : 0);
}
function Je(e) {
	return typeof e.attributes?.friendly_name == "string" && e.attributes.friendly_name.trim() ? e.attributes.friendly_name : e.entity_id;
}
function Ye(e, t) {
	return typeof e.attributes?.icon == "string" && e.attributes.icon ? e.attributes.icon : {
		light: "mdi:lightbulb",
		switch: "mdi:toggle-switch",
		cover: "mdi:curtains",
		climate: "mdi:thermostat",
		fan: "mdi:fan",
		sensor: "mdi:gauge",
		binary_sensor: "mdi:checkbox-marked-circle-outline",
		event: "mdi:calendar-alert",
		scene: "mdi:movie-open-play",
		button: "mdi:button-pointer",
		select: "mdi:form-dropdown",
		number: "mdi:numeric"
	}[t] ?? "mdi:devices";
}
function Xe(e, t) {
	let n = e[t];
	return typeof n == "string" && n ? n : void 0;
}
//#endregion
//#region src/actions.ts
var Ze = new Set([
	"light",
	"switch",
	"fan"
]);
function Qe(e, t) {
	e.dispatchEvent(new CustomEvent("hass-more-info", {
		detail: { entityId: t },
		bubbles: !0,
		composed: !0
	}));
}
async function $e(e, t, n, r, i) {
	let a = nt(n, i), o = a?.action ?? (i === "tap" || i.startsWith("icon_") ? "more-info" : "none");
	if (!(a?.confirmation && !rt(a))) {
		if (o === "more-info") {
			Qe(e, r.entityId);
			return;
		}
		if (o === "toggle") {
			await tt(t, r.entityId);
			return;
		}
		if (o === "call-service") {
			if (!a) throw Error("call-service action requires configuration.");
			await it(t, a);
			return;
		}
		if (o === "navigate" && a?.navigation_path) {
			history.pushState(null, "", a.navigation_path), window.dispatchEvent(new CustomEvent("location-changed"));
			return;
		}
		o === "url" && a?.url_path && window.open(a.url_path, "_blank", "noopener");
	}
}
async function et(e, t, n, r) {
	let i = at(e, t);
	switch (n) {
		case "turn_on":
		case "turn_off": return B(i, [
			"light",
			"switch",
			"fan"
		]), V(e, i.domain, n, i.entityId);
		case "brightness": return B(i, ["light"]), V(e, "light", "turn_on", i.entityId, { brightness_pct: Number(r) });
		case "effect": return B(i, ["light"]), V(e, "light", "turn_on", i.entityId, { effect: String(r) });
		case "open": return B(i, ["cover"]), V(e, "cover", "open_cover", i.entityId);
		case "close": return B(i, ["cover"]), V(e, "cover", "close_cover", i.entityId);
		case "temperature": return B(i, ["climate"]), V(e, "climate", "set_temperature", i.entityId, { temperature: Number(r) });
		case "hvac_mode": return B(i, ["climate"]), V(e, "climate", "set_hvac_mode", i.entityId, { hvac_mode: String(r) });
		case "fan_mode": return B(i, ["climate"]), V(e, "climate", "set_fan_mode", i.entityId, { fan_mode: String(r) });
		case "percentage": return B(i, ["fan"]), V(e, "fan", "set_percentage", i.entityId, { percentage: Number(r) });
		case "press": return B(i, ["button"]), V(e, "button", "press", i.entityId);
		case "option": return B(i, ["select"]), V(e, "select", "select_option", i.entityId, { option: String(r) });
		case "scene": return B(i, ["scene"]), V(e, "scene", "turn_on", i.entityId);
		case "number": return B(i, ["number"]), V(e, "number", "set_value", i.entityId, { value: ot(i, Number(r)) });
		default: throw Error(`Unsupported action: ${n}`);
	}
}
async function tt(e, t) {
	let n = at(e, t);
	if (!Ze.has(n.domain)) throw Error(`Toggle is not supported for ${n.domain}.`);
	return V(e, n.domain, n.state === "on" ? "turn_off" : "turn_on", n.entityId);
}
function nt(e, t) {
	return t === "tap" ? e.tap_action : t === "icon_tap" ? e.icon_tap_action : t === "icon_hold" ? e.icon_hold_action : t === "icon_double_tap" ? e.icon_double_tap_action : t === "hold" ? e.hold_action : e.double_tap_action;
}
function rt(e) {
	let t = typeof e.confirmation == "object" ? e.confirmation.text : "Are you sure?";
	return window.confirm(t || "Are you sure?");
}
async function it(e, t) {
	if (!e || e.connected === !1) throw Error("Home Assistant is not connected.");
	let [n, r] = String(t.service ?? "").split(".");
	if (!n || !r) throw Error("call-service action requires service: domain.service.");
	let i = st(t.service_data), a = st(t.target), o = ct(i.entity_id ?? a.entity_id);
	if (!o) throw Error("call-service action requires one entity_id.");
	at(e, o), await e.callService(n, r, {
		...i,
		...a,
		entity_id: o
	});
}
function at(e, t) {
	if (!e || e.connected === !1) throw Error("Home Assistant is not connected.");
	let n = F(e, t);
	if (!n || !n.available || n.readOnly) throw Error("Entity is not available for write actions.");
	return n;
}
function B(e, t) {
	if (!t.includes(e.domain)) throw Error(`${e.entityId} cannot run this action.`);
}
async function V(e, t, n, r, i = {}) {
	await e?.callService(t, n, {
		entity_id: r,
		...i
	});
}
function ot(e, t) {
	let n = R(e.attributes, "min") ?? -Infinity, r = R(e.attributes, "max") ?? Infinity, i = R(e.attributes, "step") ?? 1;
	return Math.min(r, Math.max(n, Math.round(t / i) * i));
}
function st(e) {
	return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
function ct(e) {
	return typeof e == "string" && P(e) ? e : void 0;
}
//#endregion
//#region src/cards/definitions.ts
function H(e, t, n, r) {
	return {
		kind: e,
		tag: t,
		type: `custom:${t}`,
		name: M(N(e, "name")),
		nameKey: N(e, "name"),
		description: M(N(e, "description")),
		descriptionKey: N(e, "description"),
		icon: n,
		domains: r,
		semantic: e,
		label: M(N(e, "label")),
		labelKey: N(e, "label")
	};
}
var U = [
	H("light", "yeelight-light-card", "mdi:lightbulb", ["light"]),
	H("room", "yeelight-room-card", "mdi:home-lightbulb", [
		"light",
		"group",
		"switch"
	]),
	H("scene", "yeelight-scene-card", "mdi:movie-open-play", [
		"scene",
		"button",
		"select"
	]),
	H("strip", "yeelight-strip-card", "mdi:led-strip-variant", [
		"light",
		"select",
		"number",
		"sensor"
	]),
	H("health", "yeelight-health-card", "mdi:heart-pulse", [
		"sensor",
		"binary_sensor",
		"switch",
		"update"
	]),
	H("channel", "yeelight-channel-card", "mdi:lightbulb-group", [
		"light",
		"switch",
		"number",
		"select",
		"sensor"
	]),
	H("panel", "yeelight-panel-card", "mdi:gesture-tap-button", [
		"light",
		"button",
		"select",
		"number",
		"sensor",
		"switch"
	]),
	H("device", "yeelight-device-card", "mdi:devices", [
		"light",
		"switch",
		"sensor",
		"binary_sensor",
		"event",
		"button",
		"select",
		"number",
		"scene",
		"update"
	])
], lt = Object.fromEntries(U.map((e) => [e.kind, e]));
function ut(e) {
	let t = dt(e);
	return U.find((e) => e.type === t || e.tag === t);
}
function dt(e) {
	let t = e?.trim();
	return t ? t.startsWith("custom:") ? t : t.endsWith("-card") ? `custom:${t}` : `custom:yeelight-${t}-card` : "";
}
//#endregion
//#region src/config.ts
var W = {
	layout: "default",
	content_layout: "horizontal",
	appearance: "default",
	primary_info: "name",
	secondary_info: "state",
	icon_type: "icon",
	icon_shape: "circle",
	show_entity_picture: !1,
	show_name: !0,
	show_icon: !0,
	show_state: !0,
	hide_state: !1,
	show_controls: !0,
	state_color: !1,
	fill_container: !1,
	vertical: !1
};
function G(e, t) {
	if (!e || typeof e != "object") throw Error("Card config must be an object.");
	let n = e, r = dt(typeof n.type == "string" ? n.type : t), i = ut(r);
	if (!i) throw Error(`Unsupported Yeelight card type: ${r || "(missing)"}.`);
	return {
		...W,
		type: i.type,
		entity: K(n.entity),
		entities: gt(n.entities),
		title: K(n.title),
		name: K(n.name),
		icon: K(n.icon),
		icon_height: K(n.icon_height),
		color: K(n.color),
		theme: K(n.theme),
		columns: pt(n.columns),
		layout: J(n.layout, [
			"default",
			"compact",
			"horizontal"
		], W.layout),
		content_layout: J(n.content_layout, ["horizontal", "vertical"], W.content_layout),
		appearance: J(n.appearance, [
			"default",
			"filled",
			"tonal",
			"plain"
		], W.appearance),
		primary_info: J(n.primary_info, ["name", "state"], W.primary_info),
		secondary_info: J(n.secondary_info, [
			"state",
			"entity-id",
			"last-changed",
			"none"
		], W.secondary_info),
		state_content: ht(n.state_content),
		icon_type: J(n.icon_type, [
			"icon",
			"entity-picture",
			"none"
		], W.icon_type),
		icon_shape: J(n.icon_shape, [
			"circle",
			"square",
			"rounded"
		], W.icon_shape),
		show_entity_picture: q(n.show_entity_picture, W.show_entity_picture),
		show_name: q(n.show_name, W.show_name),
		show_icon: q(n.show_icon, W.show_icon),
		show_state: q(n.show_state, W.show_state),
		hide_state: q(n.hide_state, W.hide_state),
		show_controls: q(n.show_controls, W.show_controls),
		state_color: q(n.state_color, W.state_color),
		fill_container: q(n.fill_container, W.fill_container),
		vertical: q(n.vertical, W.vertical),
		grid_options: mt(n.grid_options),
		tap_action: Y(n.tap_action),
		icon_tap_action: Y(n.icon_tap_action),
		hold_action: Y(n.hold_action),
		icon_hold_action: Y(n.icon_hold_action),
		double_tap_action: Y(n.double_tap_action),
		icon_double_tap_action: Y(n.icon_double_tap_action)
	};
}
function ft(e, t) {
	let n = dt(e);
	return t ? {
		type: n,
		entity: t
	} : { type: n };
}
function K(e) {
	return typeof e == "string" && e.trim() ? e.trim() : void 0;
}
function q(e, t) {
	return typeof e == "boolean" ? e : t;
}
function pt(e) {
	return typeof e == "number" && Number.isFinite(e) && e > 0 ? e : void 0;
}
function J(e, t, n) {
	return typeof e == "string" && t.includes(e) ? e : n;
}
function Y(e) {
	return e && typeof e == "object" ? e : void 0;
}
function mt(e) {
	return e && typeof e == "object" && !Array.isArray(e) ? { ...e } : void 0;
}
function ht(e) {
	if (typeof e == "string" && e.trim()) return [e.trim()];
	if (!Array.isArray(e)) return;
	let t = e.filter((e) => typeof e == "string" && !!e.trim()).map((e) => e.trim());
	return t.length ? t : void 0;
}
function gt(e) {
	if (!Array.isArray(e)) return;
	let t = e.map((e) => {
		if (typeof e == "string" && e.trim()) return e.trim();
		if (e && typeof e == "object") {
			let t = K(e.entity);
			if (t) {
				let n = K(e.name);
				return n ? {
					entity: t,
					name: n
				} : { entity: t };
			}
		}
	}).filter((e) => !!e);
	return t.length ? t : void 0;
}
//#endregion
//#region src/experience.ts
function _t(e, t) {
	let n = X(t);
	return /firmware|固件/.test(n) ? j(e, "health.firmware") : /lan|局域网/.test(n) ? j(e, "health.lan") : /gateway|网关/.test(n) ? j(e, "health.gateway") : /cloud|云/.test(n) ? j(e, "health.cloud") : /online|在线/.test(n) ? j(e, "health.online") : t.name;
}
function vt(e, t) {
	let n = X(t);
	return t.domain === "light" && /ambient|氛围|辅光|背光/.test(n) ? j(e, "experience.ambient") : t.domain === "light" && /night|夜灯|起夜/.test(n) ? j(e, "experience.night") : t.domain === "light" && /strip|led|灯带|彩光|gradient|flow/.test(n) ? j(e, "experience.strip") : t.domain === "light" ? j(e, "experience.main_light") : t.domain === "switch" ? /relay|继电器|开关/.test(n) ? j(e, "experience.relay") : t.name : t.domain === "select" ? /scene|mode|effect|场景|模式|效果|律动|节律/.test(n) ? j(e, "experience.mode") : t.name : t.domain === "button" || t.domain === "scene" ? j(e, "experience.scene") : t.domain === "number" ? /duration|time|delay|speed|时长|延时|速度|渐变/.test(n) ? j(e, "experience.effect_param") : t.name : t.domain === "sensor" || t.domain === "binary_sensor" ? _t(e, t) : t.name;
}
function yt(e, t) {
	return St(t) ? !1 : e === "health" ? [
		"sensor",
		"binary_sensor",
		"update"
	].includes(t.domain) || Et(t) : e === "scene" || e === "panel" ? Dt(t) || Ot(t) || kt(t) : e === "strip" ? At(t) || Ot(t) || kt(t) : e === "channel" || e === "room" || e === "device" ? Ct(t) || wt(t) || Tt(t) : !0;
}
function bt(e, t) {
	let n = X(t);
	return e === "health" ? /online|在线|lan|局域网|gateway|网关|cloud|云/.test(n) ? 0 : /firmware|固件|update/.test(n) ? 1 : t.readOnly ? 2 : 3 : e === "scene" || e === "panel" ? ["scene", "button"].includes(t.domain) ? 0 : t.domain === "select" ? 1 : 2 : e === "strip" ? /strip|led|灯带|彩光|gradient|flow/.test(n) ? 0 : t.domain === "select" ? 1 : t.domain === "number" ? 2 : 3 : t.domain === "light" && /ambient|氛围|night|夜灯|strip|灯带/.test(n) ? 0 : t.domain === "switch" ? 1 : t.domain === "select" || t.domain === "scene" || t.domain === "button" ? 2 : t.domain === "number" ? 3 : 4;
}
function xt(e, t) {
	return e.domain === "scene" || e.domain === "button" ? j(t, "state.action") : L(e, t);
}
function St(e) {
	return e.state === "unknown" && !["button", "scene"].includes(e.domain) && !z(e.attributes, "options").length;
}
function Ct(e) {
	return e.domain === "light";
}
function wt(e) {
	return e.domain === "switch" && /relay|继电器|双路|开关/.test(X(e));
}
function Tt(e) {
	return [
		"sensor",
		"binary_sensor",
		"update"
	].includes(e.domain) && /lux|照度|luminance|brightness|功率|power|energy|电量|online|在线|lan|局域网|firmware|固件|gateway|网关|cloud|云/.test(X(e));
}
function Et(e) {
	return e.domain === "switch" && /lan|局域网|gateway|网关|cloud|云|online|在线/.test(X(e));
}
function Dt(e) {
	let t = X(e);
	return ["scene", "button"].includes(e.domain) || e.domain === "switch" && /scene|场景|movie|观影|sleep|睡眠|night|起夜|rhythm|律动|节律/.test(t);
}
function Ot(e) {
	return e.domain === "select" && /scene|mode|effect|场景|模式|效果|律动|节律|music|音乐/.test(X(e));
}
function kt(e) {
	return e.domain === "number" && /duration|time|delay|speed|brightness|时长|延时|速度|渐变|亮度/.test(X(e));
}
function At(e) {
	return e.domain === "light" && /strip|led|灯带|彩光|gradient|flow|渐变|流光/.test(X(e));
}
function X(e) {
	return `${e.entityId} ${e.name} ${String(e.attributes.device_class ?? "")}`.toLowerCase();
}
//#endregion
//#region src/editor-element.ts
var jt = "ha-yeelight-card-editor", Mt = "yeelight-card-editor";
function Nt(e) {
	let t = document.createElement(jt);
	return t.cardType = e.type, t;
}
//#endregion
//#region src/layout.ts
function Pt(e, t) {
	return {
		...e === "device" ? {
			columns: 6,
			rows: 3,
			min_columns: 3,
			min_rows: 2
		} : {
			columns: 6,
			rows: 2,
			min_columns: 3,
			min_rows: 2
		},
		...It(t?.grid_options)
	};
}
function Ft(e) {
	let t = Lt(e.icon_height);
	return t ? `width:${t};height:${t}` : "";
}
function It(e) {
	return e ? Object.fromEntries(Object.entries(e).filter(([, e]) => typeof e == "number" && Number.isFinite(e) && e > 0)) : {};
}
function Lt(e) {
	return e ? /^\d+(\.\d+)?$/.test(e) ? `${e}px` : /^[\w\s.%(),#-]+$/.test(e) ? e : "" : "";
}
//#endregion
//#region src/registry.ts
var Rt = new Set(["yeelight_pro"]), zt = /* @__PURE__ */ new WeakMap();
function Bt(e) {
	if (!e?.callWS) return Promise.resolve(Xt());
	let t = zt.get(e);
	if (t) return t;
	let n = Wt(e).catch(() => Xt());
	return zt.set(e, n), n;
}
function Vt(e, t) {
	return e?.status === "ready" && e.entitySources.get(t) === "yeelight_pro";
}
function Ht(e, t) {
	return t && e?.status === "ready" ? e.entityDeviceIds.get(t) : void 0;
}
function Ut(e, t) {
	return !t || e?.status !== "ready" ? [] : Array.from(e.entityDeviceIds.entries()).filter(([n, r]) => r === t && Vt(e, n)).map(([e]) => e).sort();
}
async function Wt(e) {
	let [t, n] = await Promise.all([Gt(e, "entity_registry/list", "config/entity_registry/list"), Gt(e, "device_registry/list", "config/device_registry/list").catch(() => [])]), r = new Set(n.filter(qt).map((e) => e.id).filter((e) => !!e)), i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = typeof e.entity_id == "string" ? e.entity_id : "";
		t && (typeof e.device_id == "string" && e.device_id && a.set(t, e.device_id), i.set(t, Yt(e.platform) || typeof e.device_id == "string" && r.has(e.device_id) ? "yeelight_pro" : "other"));
	}
	return {
		status: "ready",
		entitySources: i,
		entityDeviceIds: a
	};
}
async function Gt(e, t, n) {
	try {
		return Kt(await e.callWS?.({ type: t }));
	} catch {
		return Kt(await e.callWS?.({ type: n }));
	}
}
function Kt(e) {
	return Array.isArray(e) ? e : [];
}
function qt(e) {
	return Jt(e.identifiers).some(([e]) => Yt(e));
}
function Jt(e) {
	return Array.isArray(e) ? e.map((e) => Array.isArray(e) && typeof e[0] == "string" && typeof e[1] == "string" ? [e[0], e[1]] : void 0).filter((e) => !!e) : [];
}
function Yt(e) {
	return typeof e == "string" && Rt.has(e);
}
function Xt() {
	return {
		status: "unavailable",
		entitySources: /* @__PURE__ */ new Map(),
		entityDeviceIds: /* @__PURE__ */ new Map()
	};
}
//#endregion
//#region src/card.ts
function Zt(e) {
	let t = lt[e];
	return class extends Qt {
		constructor(...e) {
			super(...e), this.definition = t;
		}
		static getConfigElement() {
			return Nt(t);
		}
		static getStubConfig(e) {
			return ft(t.type, I(e, t.domains));
		}
	};
}
var Qt = class extends k {
	constructor(...e) {
		super(...e), this.definition = lt.device, this.error = "", this.registryRequest = 0;
	}
	static {
		this.styles = Ie;
	}
	setConfig(e) {
		this.config = G(e, this.definition.type);
	}
	set hass(e) {
		this._hass = e, this.loadRegistry(), this.requestUpdate();
	}
	get hass() {
		return this._hass;
	}
	connectedCallback() {
		super.connectedCallback(), this.loadRegistry();
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.clearTapTimer();
	}
	getCardSize() {
		return this.definition.kind === "device" ? 3 : 2;
	}
	getGridOptions() {
		return Pt(this.definition.kind, this.config);
	}
	render() {
		let e = this.config;
		if (!e?.entity) return C`<ha-card><div class="card"><div class="empty">${j(this.hass, "empty.select_entity")}</div></div></ha-card>`;
		let t = F(this.hass, e.entity);
		if (!t) return C`<ha-card><div class="card"><div class="empty">${j(this.hass, "empty.entity_unavailable", { entity: e.entity })}</div></div></ha-card>`;
		let n = t.state === "on" || t.state === "open" || t.domain === "scene", r = [
			"card",
			e.layout === "compact" ? "compact" : "",
			e.content_layout === "vertical" || e.vertical ? "vertical" : "",
			e.appearance
		].filter(Boolean).join(" ");
		return C`
      <ha-card .header=${e.title || T} .theme=${e.theme || T}>
        <div
          class=${r}
          @click=${(e) => this.onSurfaceClick(e, t)}
          @dblclick=${(e) => this.onSurfaceDoubleClick(e, t)}
          @contextmenu=${(e) => this.onSurfaceHold(e, t)}
        >
          ${this.renderHeader(e, t, n)}
          <div class="body">
            ${this.renderExperienceSummary(e, t)}
            ${this.renderChips(e, t)}
            ${e.show_controls ? this.renderControls(t) : T}
            ${this.renderExperienceTiles(e, t)}
          </div>
          ${this.error ? C`<div class="error" role="status">${this.error}</div>` : T}
        </div>
      </ha-card>
    `;
	}
	renderHeader(e, t, n) {
		let r = e.name || (e.primary_info === "state" ? L(t, this.hass) : t.name), i = e.secondary_info === "entity-id" ? t.entityId : e.secondary_info === "last-changed" ? t.lastChanged ?? "" : e.secondary_info === "none" ? "" : L(t, this.hass);
		return C`
      <div class="header">
        ${e.show_icon && e.icon_type !== "none" ? C`<button
              class=${`icon ${e.icon_shape} ${n && e.state_color ? "active" : ""}`}
              style=${Ft(e)}
              aria-label=${j(this.hass, "a11y.more_info")}
              @click=${(e) => this.onIconClick(e, t)}
              @dblclick=${(e) => this.onIconDoubleClick(e, t)}
              @contextmenu=${(e) => this.onIconHold(e, t)}
            >
              ${this.renderIcon(e, t)}
            </button>` : T}
        <div class=${e.show_name ? "" : "visually-hidden"}>
          ${e.show_name ? C`<div class="title">${r}</div>` : T}
          ${i ? C`<div class="subtitle">${i}</div>` : T}
        </div>
        ${e.show_state && !e.hide_state ? C`<div class="state">${L(t, this.hass)}</div>` : T}
      </div>
    `;
	}
	renderIcon(e, t) {
		let n = typeof t.attributes.entity_picture == "string" ? t.attributes.entity_picture : "";
		return (e.icon_type === "entity-picture" || e.show_entity_picture) && n ? C`<img class="entity-picture" alt="" src=${n} />` : C`<ha-icon .icon=${e.icon || t.icon}></ha-icon>`;
	}
	renderChips(e, t) {
		let n = [j(this.hass, this.definition.labelKey), t.available ? ze(this.hass, t.domain) : j(this.hass, "state.unavailable")];
		return Vt(this.registryIndex, t.entityId) && n.push(j(this.hass, "chip.yeelight")), t.readOnly && n.push(j(this.hass, "chip.read_only")), C`<div class="chips">${n.map((e) => C`<span class="chip">${e}</span>`)}</div>`;
	}
	renderExperienceSummary(e, t) {
		if (this.definition.kind === "health") {
			let n = [t, ...this.relatedEntities(e, t)].filter((e) => !e.available).length;
			return C`<div class="subtitle">${n ? j(this.hass, "summary.health.issue", { count: n }) : j(this.hass, "summary.health.ok")}</div>`;
		}
		if (this.definition.kind === "room") {
			let n = [t, ...this.relatedEntities(e, t)].filter((e) => e.domain === "light"), r = n.filter((e) => e.state === "on").length;
			return C`<div class="subtitle">${j(this.hass, "summary.room.layers", {
				active: r,
				total: n.length || 1
			})}</div>`;
		}
		return this.definition.kind === "channel" ? C`<div class="subtitle">${j(this.hass, "summary.channel")}</div>` : this.definition.kind === "strip" ? C`<div class="subtitle">${j(this.hass, "summary.strip")}</div>` : this.definition.kind === "scene" ? C`<div class="subtitle">${j(this.hass, "summary.scene")}</div>` : this.definition.kind === "panel" ? C`<div class="subtitle">${j(this.hass, "summary.panel")}</div>` : C``;
	}
	renderControls(e) {
		if (!e.available || e.readOnly) return C``;
		switch (e.domain) {
			case "light": return C`<div class="controls"><button class="text" @click=${(t) => this.run(t, e.entityId, e.state === "on" ? "turn_off" : "turn_on")}>${e.state === "on" ? j(this.hass, "action.turn_off") : j(this.hass, "action.turn_on")}</button>${this.renderLightControls(e)}</div>`;
			case "switch":
			case "fan": return C`<div class="controls"><button class="text" @click=${(t) => this.run(t, e.entityId, e.state === "on" ? "turn_off" : "turn_on")}>${e.state === "on" ? j(this.hass, "action.turn_off") : j(this.hass, "action.turn_on")}</button>${e.domain === "fan" ? this.renderFanPercentage(e) : T}</div>`;
			case "button": return C`<div class="controls"><button class="text" @click=${(t) => this.run(t, e.entityId, "press")}>${j(this.hass, "action.press")}</button></div>`;
			case "scene": return C`<div class="controls"><button class="text" @click=${(t) => this.run(t, e.entityId, "scene")}>${j(this.hass, "action.activate")}</button></div>`;
			case "select": return this.renderSelect(e);
			case "number": return this.renderNumber(e);
			default: return C``;
		}
	}
	renderSelect(e) {
		return C`<div class="controls">${this.renderOptionSelect(j(this.hass, "control.option"), e, "option", z(e.attributes, "options"))}</div>`;
	}
	renderOptionSelect(e, t, n, r) {
		return r.length ? C`<label><span class="subtitle">${e}</span><select aria-label=${e} @change=${(e) => this.run(e, t.entityId, n, e.target.value)}>${r.map((e) => C`<option value=${e} ?selected=${e === t.state}>${e}</option>`)}</select></label>` : C``;
	}
	renderFanPercentage(e) {
		let t = Number(e.attributes.percentage ?? 0);
		return C`<input type="range" min="0" max="100" .value=${String(t)} aria-label=${`${e.name} ${j(this.hass, "control.percentage")}`} @change=${(t) => this.run(t, e.entityId, "percentage", Number(t.target.value))} />`;
	}
	renderLightControls(e) {
		let t = Number(e.attributes.brightness ?? 0), n = Math.round(t / 255 * 100), r = z(e.attributes, "effect_list");
		return C`
      ${Number.isFinite(t) && t > 0 ? C`<input type="range" min="1" max="100" .value=${String(n)} aria-label=${`${e.name} ${j(this.hass, "control.brightness")}`} @change=${(t) => this.run(t, e.entityId, "brightness", Number(t.target.value))} />` : T}
      ${this.renderOptionSelect(j(this.hass, "control.effect"), e, "effect", r)}
    `;
	}
	renderNumber(e) {
		return C`<div class="controls"><input type="range" min=${R(e.attributes, "min") ?? 0} max=${R(e.attributes, "max") ?? 100} step=${R(e.attributes, "step") ?? 1} .value=${e.state} aria-label=${e.name} @change=${(t) => this.run(t, e.entityId, "number", Number(t.target.value))} /></div>`;
	}
	renderExperienceTiles(e, t) {
		let n = this.relatedEntities(e, t).map((e) => ({ normalized: e }));
		return n.length ? C`<div class="tiles">${n.map((e) => this.renderTile(e.normalized))}</div>` : this.renderEmptyExperience(t);
	}
	renderTile(e) {
		let t = this.definition.kind === "health";
		return C`
      <div class=${`tile ${e.available ? "" : "unavailable"} ${e.readOnly ? "readonly" : ""}`}>
        <strong>${t ? _t(this.hass, e) : vt(this.hass, e)}</strong>
        <span>${xt(e, this.hass)}</span>
        ${!t && !e.readOnly && e.available ? this.renderControls(e) : T}
      </div>
    `;
	}
	renderEmptyExperience(e) {
		return this.definition.kind === "light" ? C`` : C`<div class="empty-line">${this.definition.kind === "health" ? j(this.hass, "summary.health.empty") : this.definition.kind === "scene" || this.definition.kind === "panel" ? j(this.hass, "summary.scene.empty") : this.definition.kind === "strip" ? j(this.hass, "summary.strip.empty") : j(this.hass, "summary.device.empty")}${Vt(this.registryIndex, e.entityId) ? "" : ` · ${j(this.hass, "summary.yeelight_pro_hint")}`}</div>`;
	}
	relatedEntities(e, t) {
		let n = e.entities ?? [], r = this.autoRelatedEntityIds(t);
		return [...n, ...r].map((e) => F(this.hass, typeof e == "string" ? e : e.entity)).filter((e) => !!(e && e.entityId !== t?.entityId)).filter((e) => yt(this.definition.kind, e)).filter($t).sort((e, t) => bt(this.definition.kind, e) - bt(this.definition.kind, t) || e.name.localeCompare(t.name)).slice(0, en(this.definition.kind));
	}
	autoRelatedEntityIds(e) {
		if (this.definition.kind === "light") return [];
		let t = Ht(this.registryIndex, e?.entityId);
		return Ut(this.registryIndex, t).filter((t) => t !== e?.entityId);
	}
	loadRegistry() {
		let e = this._hass;
		if (!this.isConnected || !e) return;
		let t = ++this.registryRequest;
		Bt(e).then((n) => {
			t === this.registryRequest && this._hass === e && (this.registryIndex = n, this.requestUpdate());
		});
	}
	async run(e, t, n, r) {
		e.stopPropagation(), this.error = "";
		try {
			await et(this.hass, t, n, r);
		} catch (e) {
			this.error = e instanceof Error ? e.message : String(e);
		}
	}
	async onIconClick(e, t) {
		e.stopPropagation(), this.clearTapTimer(), this.error = "";
		try {
			await $e(this, this.hass, this.config, t, "icon_tap");
		} catch (e) {
			this.error = e instanceof Error ? e.message : String(e);
		}
	}
	onIconDoubleClick(e, t) {
		e.stopPropagation(), e.preventDefault(), this.clearTapTimer(), this.runIconAction(t, "icon_double_tap");
	}
	onIconHold(e, t) {
		e.stopPropagation(), e.preventDefault(), this.clearTapTimer(), this.runIconAction(t, "icon_hold");
	}
	async onSurfaceClick(e, t) {
		tn(e) || (this.clearTapTimer(), this.tapTimer = window.setTimeout(() => {
			this.runAction(t, "tap");
		}, 220));
	}
	onSurfaceDoubleClick(e, t) {
		tn(e) || (e.preventDefault(), this.clearTapTimer(), this.runAction(t, "double_tap"));
	}
	onSurfaceHold(e, t) {
		tn(e) || (e.preventDefault(), this.clearTapTimer(), this.runAction(t, "hold"));
	}
	async runAction(e, t) {
		try {
			await $e(this, this.hass, this.config, e, t);
		} catch (e) {
			this.error = e instanceof Error ? e.message : String(e);
		}
	}
	async runIconAction(e, t) {
		this.error = "";
		try {
			await $e(this, this.hass, this.config, e, t);
		} catch (e) {
			this.error = e instanceof Error ? e.message : String(e);
		}
	}
	clearTapTimer() {
		this.tapTimer !== void 0 && (window.clearTimeout(this.tapTimer), this.tapTimer = void 0);
	}
};
function $t(e, t, n) {
	return n.findIndex((t) => t.entityId === e.entityId) === t;
}
function en(e) {
	return e === "health" ? 4 : e === "device" ? 6 : 5;
}
function tn(e) {
	let t = e.composedPath()[0];
	return t instanceof Element && !!t.closest("button,input,select,a,textarea");
}
//#endregion
//#region src/editor.ts
var nn = class extends k {
	static {
		this.styles = o`
    :host{display:block}.editor{display:grid;gap:12px;color:var(--primary-text-color)}.title{display:flex;align-items:center;gap:10px;min-width:0;font-size:16px;font-weight:500;line-height:1.3}.title ha-icon{color:var(--primary-color);--mdc-icon-size:22px}.hint,.native-loading{color:var(--secondary-text-color);font-size:13px;line-height:1.5}ha-form{display:block}
  `;
	}
	connectedCallback() {
		super.connectedCallback(), sn();
	}
	set hass(e) {
		this._hass = e, this.requestUpdate();
	}
	setConfig(e) {
		this.config = G(e, this.cardType);
	}
	render() {
		let e = this.config, t = ut(e?.type ?? this.cardType);
		if (!t) return C`<div class="editor"><div class="native-loading">${j(this._hass, "editor.loading_native")}</div></div>`;
		let n = e ?? G({ type: t.type }, t.type);
		return C`
      <div class="editor">
        <div class="title">
          <ha-icon .icon=${t.icon}></ha-icon>
          <span>${j(this._hass, t.nameKey)}</span>
        </div>
        <div class="hint">${j(this._hass, "editor.primary_helper")}</div>
        ${this.renderNativeForm(n, t)}
      </div>
    `;
	}
	renderNativeForm(e, t) {
		let n = [
			{
				name: "entity",
				selector: { entity: { domain: t.domains } }
			},
			{
				name: "name",
				selector: { entity_name: {} },
				context: { entity: "entity" }
			},
			{
				type: "grid",
				name: "",
				schema: [
					{
						name: "title",
						selector: { text: {} }
					},
					{
						name: "theme",
						selector: { theme: {} }
					},
					{
						name: "columns",
						selector: { number: {
							min: 1,
							mode: "box"
						} }
					}
				]
			},
			{
				name: "entities",
				selector: { entity: {
					domain: t.domains,
					multiple: !0
				} }
			},
			{
				type: "grid",
				name: "",
				schema: [
					{
						name: "icon",
						selector: { icon: {} },
						context: { icon_entity: "entity" }
					},
					{
						name: "icon_height",
						selector: { text: { suffix: "px" } }
					},
					{
						name: "color",
						selector: { ui_color: {} }
					},
					$(this._hass, "icon_shape", [
						"circle",
						"square",
						"rounded"
					])
				]
			},
			{
				type: "grid",
				name: "",
				schema: [
					$(this._hass, "layout", [
						"default",
						"compact",
						"horizontal"
					]),
					$(this._hass, "content_layout", ["horizontal", "vertical"]),
					Z("vertical"),
					Z("fill_container")
				]
			},
			{
				type: "grid",
				name: "",
				schema: [
					$(this._hass, "primary_info", ["name", "state"]),
					$(this._hass, "secondary_info", [
						"state",
						"entity-id",
						"last-changed",
						"none"
					]),
					an(this._hass, "state_content", [
						"state",
						"last-changed",
						"last-updated",
						"brightness",
						"color-temp",
						"effect"
					])
				]
			},
			{
				type: "grid",
				name: "",
				schema: [
					$(this._hass, "icon_type", [
						"icon",
						"entity-picture",
						"none"
					]),
					Z("show_entity_picture"),
					Z("show_name"),
					Z("show_icon"),
					Z("show_state"),
					Z("hide_state")
				]
			},
			{
				type: "grid",
				name: "",
				schema: [
					Z("show_controls"),
					Z("state_color"),
					$(this._hass, "appearance", [
						"default",
						"filled",
						"tonal",
						"plain"
					])
				]
			},
			Q("tap_action", "more-info"),
			Q("icon_tap_action", "more-info"),
			Q("hold_action", "none"),
			Q("icon_hold_action", "none"),
			Q("double_tap_action", "none"),
			Q("icon_double_tap_action", "none")
		];
		return this.renderHaForm(rn(e, /* @__PURE__ */ "entity.entities.title.name.icon.icon_height.color.theme.columns.icon_shape.layout.content_layout.vertical.fill_container.primary_info.secondary_info.state_content.icon_type.show_entity_picture.show_name.show_icon.show_state.hide_state.show_controls.state_color.appearance.tap_action.icon_tap_action.hold_action.icon_hold_action.double_tap_action.icon_double_tap_action".split(".")), n, (e) => this.patchConfig(on(e.detail.value)), (e) => j(this._hass, `editor.${e.name}`), (e) => e.name === "entity" ? j(this._hass, "editor.entity_helper") : e.name === "entities" ? j(this._hass, "editor.entities_helper") : e.name === "name" ? j(this._hass, "editor.name_helper") : "");
	}
	renderHaForm(e, t, n, r, i = () => "") {
		return customElements.get("ha-form") ? C`<ha-form .hass=${this._hass} .data=${e} .schema=${t} .computeLabel=${r} .computeHelper=${i} @value-changed=${n}></ha-form>` : C`<div class="native-loading">${j(this._hass, "editor.loading_native")}</div>`;
	}
	patchConfig(e) {
		let t = {
			...this.config,
			type: this.config?.type ?? this.cardType,
			...e
		};
		this.config = G(t, this.cardType), this.dispatchEvent(new CustomEvent("config-changed", {
			detail: { config: this.config },
			bubbles: !0,
			composed: !0
		}));
	}
};
function rn(e, t) {
	return Object.fromEntries(t.map((t) => [t, e[t]]).filter(([, e]) => e !== void 0));
}
function Z(e) {
	return {
		name: e,
		selector: { boolean: {} }
	};
}
function Q(e, t) {
	return {
		name: e,
		selector: { ui_action: {
			actions: [
				"more-info",
				"toggle",
				"call-service",
				"navigate",
				"url",
				"none"
			],
			default_action: t
		} }
	};
}
function $(e, t, n) {
	return {
		name: t,
		selector: { select: {
			mode: "dropdown",
			options: n.map((t) => ({
				value: t,
				label: j(e, `option.${t}`)
			}))
		} }
	};
}
function an(e, t, n) {
	return {
		name: t,
		selector: { select: {
			multiple: !0,
			mode: "dropdown",
			options: n.map((t) => ({
				value: t,
				label: j(e, `option.${t}`)
			}))
		} }
	};
}
function on(e) {
	return Object.fromEntries(Object.entries(e).map(([e, t]) => [e, t === "" ? void 0 : t]));
}
function sn() {
	customElements.get("ha-form") || customElements.get("hui-tile-card")?.getConfigElement?.();
}
//#endregion
//#region src/index.ts
var cn = "https://github.com/Yeelight/ha_yeelight_cards";
ln();
function ln() {
	customElements.get("ha-yeelight-card-editor") || customElements.define(jt, nn), customElements.get("yeelight-card-editor") || customElements.define(Mt, class extends nn {});
	for (let e of U) customElements.get(e.tag) || customElements.define(e.tag, Zt(e.kind)), un(e);
	dn(), console.info("%c YEELIGHT CARDS %c Card Pack ", "color:white;background:#111;padding:2px 4px;border-radius:4px 0 0 4px", "color:white;background:#1976d2;padding:2px 4px;border-radius:0 4px 4px 0");
}
function un(e) {
	let t = customElements.get(e.tag);
	t && Object.defineProperties(t, {
		getConfigElement: {
			configurable: !0,
			value: () => Nt(e)
		},
		getStubConfig: {
			configurable: !0,
			value: (t) => ft(e.type, I(t, e.domains))
		}
	});
}
function dn() {
	let e = window.customCards ?? (window.customCards = []), t = new Set(U.map((e) => e.tag));
	for (let n = e.length - 1; n >= 0; --n) {
		let r = e[n];
		typeof r?.type == "string" && t.has(r.type) && e.splice(n, 1);
	}
	for (let t of U) e.push({
		type: t.tag,
		name: t.name,
		description: t.description,
		preview: !0,
		documentationURL: cn,
		getStubConfig: (e) => ft(t.type, I(e, t.domains)),
		getConfigElement: () => Nt(t),
		getEntitySuggestion: (e, n) => fn(e, n, t)
	});
}
function fn(e, t, n) {
	return !e?.states?.[t] || !n.domains.includes(P(t)) || !pn(e, t, n) ? null : {
		label: n.label,
		config: {
			type: n.type,
			entity: t
		}
	};
}
function pn(e, t, n) {
	let r = P(t);
	return Ke(e.states[t]) ? !0 : n.semantic === "light" ? r === "light" : n.semantic === "scene" ? [
		"scene",
		"button",
		"select"
	].includes(r) : n.semantic === "strip" ? r === "light" && /strip|led|rgb|color|gradient|灯带|彩光/i.test(t + " " + String(e.states[t].attributes?.friendly_name ?? "")) : n.semantic === "health" ? /lan|firmware|gateway|cloud|online|update|固件|网关|在线|局域网/i.test(t + " " + String(e.states[t].attributes?.friendly_name ?? "")) : !1;
}
//#endregion
export { U as CARD_DEFINITIONS };
