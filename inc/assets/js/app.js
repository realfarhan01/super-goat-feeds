(() => {
	"use strict";

	function t(t, e, n) {
		return Math.max(t, Math.min(e, n))
	}
	var e = class {
			isRunning = !1;
			value = 0;
			from = 0;
			to = 0;
			currentTime = 0;
			lerp;
			duration;
			easing;
			onUpdate;
			advance(e) {
				if (!this.isRunning) return;
				let n = !1;
				if (this.duration && this.easing) {
					this.currentTime += e;
					const r = t(0, this.currentTime / this.duration, 1);
					n = r >= 1;
					const i = n ? 1 : this.easing(r);
					this.value = this.from + (this.to - this.from) * i
				} else this.lerp ? (this.value = function(t, e, n, r) {
					return function(t, e, n) {
						return (1 - n) * t + n * e
					}(t, e, 1 - Math.exp(-n * r))
				}(this.value, this.to, 60 * this.lerp, e), Math.round(this.value) === this.to && (this.value = this.to, n = !0)) : (this.value = this.to, n = !0);
				n && this.stop(), this.onUpdate?.(this.value, n)
			}
			stop() {
				this.isRunning = !1
			}
			fromTo(t, e, {
				lerp: n,
				duration: r,
				easing: i,
				onStart: s,
				onUpdate: o
			}) {
				this.from = this.value = t, this.to = e, this.lerp = n, this.duration = r, this.easing = i, this.currentTime = 0, this.isRunning = !0, s?.(), this.onUpdate = o
			}
		},
		n = class {
			constructor(t, e, {
				autoResize: n = !0,
				debounce: r = 250
			} = {}) {
				this.wrapper = t, this.content = e, n && (this.debouncedResize = function(t, e) {
					let n;
					return function(...r) {
						let i = this;
						clearTimeout(n), n = setTimeout((() => {
							n = void 0, t.apply(i, r)
						}), e)
					}
				}(this.resize, r), this.wrapper instanceof Window ? window.addEventListener("resize", this.debouncedResize, !1) : (this.wrapperResizeObserver = new ResizeObserver(this.debouncedResize), this.wrapperResizeObserver.observe(this.wrapper)), this.contentResizeObserver = new ResizeObserver(this.debouncedResize), this.contentResizeObserver.observe(this.content)), this.resize()
			}
			width = 0;
			height = 0;
			scrollHeight = 0;
			scrollWidth = 0;
			debouncedResize;
			wrapperResizeObserver;
			contentResizeObserver;
			destroy() {
				this.wrapperResizeObserver?.disconnect(), this.contentResizeObserver?.disconnect(), this.wrapper === window && this.debouncedResize && window.removeEventListener("resize", this.debouncedResize, !1)
			}
			resize = () => {
				this.onWrapperResize(), this.onContentResize()
			};
			onWrapperResize = () => {
				this.wrapper instanceof Window ? (this.width = window.innerWidth, this.height = window.innerHeight) : (this.width = this.wrapper.clientWidth, this.height = this.wrapper.clientHeight)
			};
			onContentResize = () => {
				this.wrapper instanceof Window ? (this.scrollHeight = this.content.scrollHeight, this.scrollWidth = this.content.scrollWidth) : (this.scrollHeight = this.wrapper.scrollHeight, this.scrollWidth = this.wrapper.scrollWidth)
			};
			get limit() {
				return {
					x: this.scrollWidth - this.width,
					y: this.scrollHeight - this.height
				}
			}
		},
		r = class {
			events = {};
			emit(t, ...e) {
				let n = this.events[t] || [];
				for (let t = 0, r = n.length; t < r; t++) n[t]?.(...e)
			}
			on(t, e) {
				return this.events[t]?.push(e) || (this.events[t] = [e]), () => {
					this.events[t] = this.events[t]?.filter((t => e !== t))
				}
			}
			off(t, e) {
				this.events[t] = this.events[t]?.filter((t => e !== t))
			}
			destroy() {
				this.events = {}
			}
		},
		i = 100 / 6,
		s = {
			passive: !1
		},
		o = class {
			constructor(t, e = {
				wheelMultiplier: 1,
				touchMultiplier: 1
			}) {
				this.element = t, this.options = e, window.addEventListener("resize", this.onWindowResize, !1), this.onWindowResize(), this.element.addEventListener("wheel", this.onWheel, s), this.element.addEventListener("touchstart", this.onTouchStart, s), this.element.addEventListener("touchmove", this.onTouchMove, s), this.element.addEventListener("touchend", this.onTouchEnd, s)
			}
			touchStart = {
				x: 0,
				y: 0
			};
			lastDelta = {
				x: 0,
				y: 0
			};
			window = {
				width: 0,
				height: 0
			};
			emitter = new r;
			on(t, e) {
				return this.emitter.on(t, e)
			}
			destroy() {
				this.emitter.destroy(), window.removeEventListener("resize", this.onWindowResize, !1), this.element.removeEventListener("wheel", this.onWheel, s), this.element.removeEventListener("touchstart", this.onTouchStart, s), this.element.removeEventListener("touchmove", this.onTouchMove, s), this.element.removeEventListener("touchend", this.onTouchEnd, s)
			}
			onTouchStart = t => {
				const {
					clientX: e,
					clientY: n
				} = t.targetTouches ? t.targetTouches[0] : t;
				this.touchStart.x = e, this.touchStart.y = n, this.lastDelta = {
					x: 0,
					y: 0
				}, this.emitter.emit("scroll", {
					deltaX: 0,
					deltaY: 0,
					event: t
				})
			};
			onTouchMove = t => {
				const {
					clientX: e,
					clientY: n
				} = t.targetTouches ? t.targetTouches[0] : t, r = -(e - this.touchStart.x) * this.options.touchMultiplier, i = -(n - this.touchStart.y) * this.options.touchMultiplier;
				this.touchStart.x = e, this.touchStart.y = n, this.lastDelta = {
					x: r,
					y: i
				}, this.emitter.emit("scroll", {
					deltaX: r,
					deltaY: i,
					event: t
				})
			};
			onTouchEnd = t => {
				this.emitter.emit("scroll", {
					deltaX: this.lastDelta.x,
					deltaY: this.lastDelta.y,
					event: t
				})
			};
			onWheel = t => {
				let {
					deltaX: e,
					deltaY: n,
					deltaMode: r
				} = t;
				e *= 1 === r ? i : 2 === r ? this.window.width : 1, n *= 1 === r ? i : 2 === r ? this.window.height : 1, e *= this.options.wheelMultiplier, n *= this.options.wheelMultiplier, this.emitter.emit("scroll", {
					deltaX: e,
					deltaY: n,
					event: t
				})
			};
			onWindowResize = () => {
				this.window = {
					width: window.innerWidth,
					height: window.innerHeight
				}
			}
		},
		a = class {
			_isScrolling = !1;
			_isStopped = !1;
			_isLocked = !1;
			_preventNextNativeScrollEvent = !1;
			_resetVelocityTimeout = null;
			isTouching;
			time = 0;
			userData = {};
			lastVelocity = 0;
			velocity = 0;
			direction = 0;
			options;
			targetScroll;
			animatedScroll;
			animate = new e;
			emitter = new r;
			dimensions;
			virtualScroll;
			constructor({
				wrapper: t = window,
				content: e = document.documentElement,
				eventsTarget: r = t,
				smoothWheel: i = !0,
				syncTouch: s = !1,
				syncTouchLerp: a = .075,
				touchInertiaMultiplier: l = 35,
				duration: u,
				easing: c = t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
				lerp: h = .1,
				infinite: d = !1,
				orientation: f = "vertical",
				gestureOrientation: p = "vertical",
				touchMultiplier: m = 1,
				wheelMultiplier: g = 1,
				autoResize: v = !0,
				prevent: _,
				virtualScroll: y,
				overscroll: w = !0,
				__experimental__naiveDimensions: b = !1
			} = {}) {
				window.lenisVersion = "1.1.14", t && t !== document.documentElement && t !== document.body || (t = window), this.options = {
					wrapper: t,
					content: e,
					eventsTarget: r,
					smoothWheel: i,
					syncTouch: s,
					syncTouchLerp: a,
					touchInertiaMultiplier: l,
					duration: u,
					easing: c,
					lerp: h,
					infinite: d,
					gestureOrientation: p,
					orientation: f,
					touchMultiplier: m,
					wheelMultiplier: g,
					autoResize: v,
					prevent: _,
					virtualScroll: y,
					overscroll: w,
					__experimental__naiveDimensions: b
				}, this.dimensions = new n(t, e, {
					autoResize: v
				}), this.updateClassName(), this.targetScroll = this.animatedScroll = this.actualScroll, this.options.wrapper.addEventListener("scroll", this.onNativeScroll, !1), this.options.wrapper.addEventListener("pointerdown", this.onPointerDown, !1), this.virtualScroll = new o(r, {
					touchMultiplier: m,
					wheelMultiplier: g
				}), this.virtualScroll.on("scroll", this.onVirtualScroll)
			}
			destroy() {
				this.emitter.destroy(), this.options.wrapper.removeEventListener("scroll", this.onNativeScroll, !1), this.options.wrapper.removeEventListener("pointerdown", this.onPointerDown, !1), this.virtualScroll.destroy(), this.dimensions.destroy(), this.cleanUpClassName()
			}
			on(t, e) {
				return this.emitter.on(t, e)
			}
			off(t, e) {
				return this.emitter.off(t, e)
			}
			setScroll(t) {
				this.isHorizontal ? this.rootElement.scrollLeft = t : this.rootElement.scrollTop = t
			}
			onPointerDown = t => {
				1 === t.button && this.reset()
			};
			onVirtualScroll = t => {
				if ("function" == typeof this.options.virtualScroll && !1 === this.options.virtualScroll(t)) return;
				const {
					deltaX: e,
					deltaY: n,
					event: r
				} = t;
				if (this.emitter.emit("virtual-scroll", {
						deltaX: e,
						deltaY: n,
						event: r
					}), r.ctrlKey) return;
				if (r.lenisStopPropagation) return;
				const i = r.type.includes("touch"),
					s = r.type.includes("wheel");
				if (this.isTouching = "touchstart" === r.type || "touchmove" === r.type, this.options.syncTouch && i && "touchstart" === r.type && !this.isStopped && !this.isLocked) return void this.reset();
				const o = 0 === e && 0 === n,
					a = "vertical" === this.options.gestureOrientation && 0 === n || "horizontal" === this.options.gestureOrientation && 0 === e;
				if (o || a) return;
				let l = r.composedPath();
				l = l.slice(0, l.indexOf(this.rootElement));
				const u = this.options.prevent;
				if (l.find((t => t instanceof HTMLElement && ("function" == typeof u && u?.(t) || t.hasAttribute?.("data-lenis-prevent") || i && t.hasAttribute?.("data-lenis-prevent-touch") || s && t.hasAttribute?.("data-lenis-prevent-wheel"))))) return;
				if (this.isStopped || this.isLocked) return void r.preventDefault();
				if (!(this.options.syncTouch && i || this.options.smoothWheel && s)) return this.isScrolling = "native", this.animate.stop(), void(r.lenisStopPropagation = !0);
				let c = n;
				"both" === this.options.gestureOrientation ? c = Math.abs(n) > Math.abs(e) ? n : e : "horizontal" === this.options.gestureOrientation && (c = e), (!this.options.overscroll || this.options.infinite || this.options.wrapper !== window && (this.animatedScroll > 0 && this.animatedScroll < this.limit || 0 === this.animatedScroll && n > 0 || this.animatedScroll === this.limit && n < 0)) && (r.lenisStopPropagation = !0), r.preventDefault();
				const h = i && this.options.syncTouch,
					d = i && "touchend" === r.type && Math.abs(c) > 5;
				d && (c = this.velocity * this.options.touchInertiaMultiplier), this.scrollTo(this.targetScroll + c, {
					programmatic: !1,
					...h ? {
						lerp: d ? this.options.syncTouchLerp : 1
					} : {
						lerp: this.options.lerp,
						duration: this.options.duration,
						easing: this.options.easing
					}
				})
			};
			resize() {
				this.dimensions.resize(), this.animatedScroll = this.targetScroll = this.actualScroll, this.emit()
			}
			emit() {
				this.emitter.emit("scroll", this)
			}
			onNativeScroll = () => {
				if (null !== this._resetVelocityTimeout && (clearTimeout(this._resetVelocityTimeout), this._resetVelocityTimeout = null), this._preventNextNativeScrollEvent) this._preventNextNativeScrollEvent = !1;
				else if (!1 === this.isScrolling || "native" === this.isScrolling) {
					const t = this.animatedScroll;
					this.animatedScroll = this.targetScroll = this.actualScroll, this.lastVelocity = this.velocity, this.velocity = this.animatedScroll - t, this.direction = Math.sign(this.animatedScroll - t), this.isScrolling = "native", this.emit(), 0 !== this.velocity && (this._resetVelocityTimeout = setTimeout((() => {
						this.lastVelocity = this.velocity, this.velocity = 0, this.isScrolling = !1, this.emit()
					}), 400))
				}
			};
			reset() {
				this.isLocked = !1, this.isScrolling = !1, this.animatedScroll = this.targetScroll = this.actualScroll, this.lastVelocity = this.velocity = 0, this.animate.stop()
			}
			start() {
				this.isStopped && (this.isStopped = !1, this.reset())
			}
			stop() {
				this.isStopped || (this.isStopped = !0, this.animate.stop(), this.reset())
			}
			raf(t) {
				const e = t - (this.time || t);
				this.time = t, this.animate.advance(.001 * e)
			}
			scrollTo(e, {
				offset: n = 0,
				immediate: r = !1,
				lock: i = !1,
				duration: s = this.options.duration,
				easing: o = this.options.easing,
				lerp: a = this.options.lerp,
				onStart: l,
				onComplete: u,
				force: c = !1,
				programmatic: h = !0,
				userData: d
			} = {}) {
				if (!this.isStopped && !this.isLocked || c) {
					if ("string" == typeof e && ["top", "left", "start"].includes(e)) e = 0;
					else if ("string" == typeof e && ["bottom", "right", "end"].includes(e)) e = this.limit;
					else {
						let t;
						if ("string" == typeof e ? t = document.querySelector(e) : e instanceof HTMLElement && e?.nodeType && (t = e), t) {
							if (this.options.wrapper !== window) {
								const t = this.rootElement.getBoundingClientRect();
								n -= this.isHorizontal ? t.left : t.top
							}
							const r = t.getBoundingClientRect();
							e = (this.isHorizontal ? r.left : r.top) + this.animatedScroll
						}
					}
					if ("number" == typeof e) {
						if (e += n, e = Math.round(e), this.options.infinite ? h && (this.targetScroll = this.animatedScroll = this.scroll) : e = t(0, e, this.limit), e === this.targetScroll) return l?.(this), void u?.(this);
						if (this.userData = d ?? {}, r) return this.animatedScroll = this.targetScroll = e, this.setScroll(this.scroll), this.reset(), this.preventNextNativeScrollEvent(), this.emit(), u?.(this), void(this.userData = {});
						h || (this.targetScroll = e), this.animate.fromTo(this.animatedScroll, e, {
							duration: s,
							easing: o,
							lerp: a,
							onStart: () => {
								i && (this.isLocked = !0), this.isScrolling = "smooth", l?.(this)
							},
							onUpdate: (t, e) => {
								this.isScrolling = "smooth", this.lastVelocity = this.velocity, this.velocity = t - this.animatedScroll, this.direction = Math.sign(this.velocity), this.animatedScroll = t, this.setScroll(this.scroll), h && (this.targetScroll = t), e || this.emit(), e && (this.reset(), this.emit(), u?.(this), this.userData = {}, this.preventNextNativeScrollEvent())
							}
						})
					}
				}
			}
			preventNextNativeScrollEvent() {
				this._preventNextNativeScrollEvent = !0, requestAnimationFrame((() => {
					this._preventNextNativeScrollEvent = !1
				}))
			}
			get rootElement() {
				return this.options.wrapper === window ? document.documentElement : this.options.wrapper
			}
			get limit() {
				return this.options.__experimental__naiveDimensions ? this.isHorizontal ? this.rootElement.scrollWidth - this.rootElement.clientWidth : this.rootElement.scrollHeight - this.rootElement.clientHeight : this.dimensions.limit[this.isHorizontal ? "x" : "y"]
			}
			get isHorizontal() {
				return "horizontal" === this.options.orientation
			}
			get actualScroll() {
				return this.isHorizontal ? this.rootElement.scrollLeft : this.rootElement.scrollTop
			}
			get scroll() {
				return this.options.infinite ? (this.animatedScroll % (t = this.limit) + t) % t : this.animatedScroll;
				var t
			}
			get progress() {
				return 0 === this.limit ? 1 : this.scroll / this.limit
			}
			get isScrolling() {
				return this._isScrolling
			}
			set isScrolling(t) {
				this._isScrolling !== t && (this._isScrolling = t, this.updateClassName())
			}
			get isStopped() {
				return this._isStopped
			}
			set isStopped(t) {
				this._isStopped !== t && (this._isStopped = t, this.updateClassName())
			}
			get isLocked() {
				return this._isLocked
			}
			set isLocked(t) {
				this._isLocked !== t && (this._isLocked = t, this.updateClassName())
			}
			get isSmooth() {
				return "smooth" === this.isScrolling
			}
			get className() {
				let t = "lenis";
				return this.isStopped && (t += " lenis-stopped"), this.isLocked && (t += " lenis-locked"), this.isScrolling && (t += " lenis-scrolling"), "smooth" === this.isScrolling && (t += " lenis-smooth"), t
			}
			updateClassName() {
				this.cleanUpClassName(), this.rootElement.className = `${this.rootElement.className} ${this.className}`.trim()
			}
			cleanUpClassName() {
				this.rootElement.className = this.rootElement.className.replace(/lenis(-\w+)?/g, "").trim()
			}
		};

	function l(t) {
		if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		return t
	}

	function u(t, e) {
		t.prototype = Object.create(e.prototype), t.prototype.constructor = t, t.__proto__ = e
	}
	var c, h, d, f, p, m, g, v, _, y, w, b, x, T, S, E, k, M = {
			autoSleep: 120,
			force3D: "auto",
			nullTargetWarn: 1,
			units: {
				lineHeight: ""
			}
		},
		O = {
			duration: .5,
			overwrite: !1,
			delay: 0
		},
		C = 1e8,
		A = 1e-8,
		P = 2 * Math.PI,
		L = P / 4,
		D = 0,
		R = Math.sqrt,
		z = Math.cos,
		B = Math.sin,
		N = function(t) {
			return "string" == typeof t
		},
		I = function(t) {
			return "function" == typeof t
		},
		q = function(t) {
			return "number" == typeof t
		},
		F = function(t) {
			return void 0 === t
		},
		Y = function(t) {
			return "object" == typeof t
		},
		X = function(t) {
			return !1 !== t
		},
		W = function() {
			return "undefined" != typeof window
		},
		H = function(t) {
			return I(t) || N(t)
		},
		U = "function" == typeof ArrayBuffer && ArrayBuffer.isView || function() {},
		V = Array.isArray,
		$ = /(?:-?\.?\d|\.)+/gi,
		j = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,
		G = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g,
		Q = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,
		Z = /[+-]=-?[.\d]+/,
		K = /[^,'"\[\]\s]+/gi,
		J = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,
		tt = {},
		et = {},
		nt = function(t) {
			return (et = Pt(t, tt)) && Ln
		},
		rt = function(t, e) {
			return console.warn("Invalid property", t, "set to", e, "Missing plugin? gsap.registerPlugin()")
		},
		it = function(t, e) {
			return !e && console.warn(t)
		},
		st = function(t, e) {
			return t && (tt[t] = e) && et && (et[t] = e) || tt
		},
		ot = function() {
			return 0
		},
		at = {
			suppressEvents: !0,
			isStart: !0,
			kill: !1
		},
		lt = {
			suppressEvents: !0,
			kill: !1
		},
		ut = {
			suppressEvents: !0
		},
		ct = {},
		ht = [],
		dt = {},
		ft = {},
		pt = {},
		mt = 30,
		gt = [],
		vt = "",
		_t = function(t) {
			var e, n, r = t[0];
			if (Y(r) || I(r) || (t = [t]), !(e = (r._gsap || {}).harness)) {
				for (n = gt.length; n-- && !gt[n].targetTest(r););
				e = gt[n]
			}
			for (n = t.length; n--;) t[n] && (t[n]._gsap || (t[n]._gsap = new Ue(t[n], e))) || t.splice(n, 1);
			return t
		},
		yt = function(t) {
			return t._gsap || _t(le(t))[0]._gsap
		},
		wt = function(t, e, n) {
			return (n = t[e]) && I(n) ? t[e]() : F(n) && t.getAttribute && t.getAttribute(e) || n
		},
		bt = function(t, e) {
			return (t = t.split(",")).forEach(e) || t
		},
		xt = function(t) {
			return Math.round(1e5 * t) / 1e5 || 0
		},
		Tt = function(t) {
			return Math.round(1e7 * t) / 1e7 || 0
		},
		St = function(t, e) {
			var n = e.charAt(0),
				r = parseFloat(e.substr(2));
			return t = parseFloat(t), "+" === n ? t + r : "-" === n ? t - r : "*" === n ? t * r : t / r
		},
		Et = function(t, e) {
			for (var n = e.length, r = 0; t.indexOf(e[r]) < 0 && ++r < n;);
			return r < n
		},
		kt = function() {
			var t, e, n = ht.length,
				r = ht.slice(0);
			for (dt = {}, ht.length = 0, t = 0; t < n; t++)(e = r[t]) && e._lazy && (e.render(e._lazy[0], e._lazy[1], !0)._lazy = 0)
		},
		Mt = function(t, e, n, r) {
			ht.length && !h && kt(), t.render(e, n, r || h && e < 0 && (t._initted || t._startAt)), ht.length && !h && kt()
		},
		Ot = function(t) {
			var e = parseFloat(t);
			return (e || 0 === e) && (t + "").match(K).length < 2 ? e : N(t) ? t.trim() : t
		},
		Ct = function(t) {
			return t
		},
		At = function(t, e) {
			for (var n in e) n in t || (t[n] = e[n]);
			return t
		},
		Pt = function(t, e) {
			for (var n in e) t[n] = e[n];
			return t
		},
		Lt = function t(e, n) {
			for (var r in n) "__proto__" !== r && "constructor" !== r && "prototype" !== r && (e[r] = Y(n[r]) ? t(e[r] || (e[r] = {}), n[r]) : n[r]);
			return e
		},
		Dt = function(t, e) {
			var n, r = {};
			for (n in t) n in e || (r[n] = t[n]);
			return r
		},
		Rt = function(t) {
			var e, n = t.parent || f,
				r = t.keyframes ? (e = V(t.keyframes), function(t, n) {
					for (var r in n) r in t || "duration" === r && e || "ease" === r || (t[r] = n[r])
				}) : At;
			if (X(t.inherit))
				for (; n;) r(t, n.vars.defaults), n = n.parent || n._dp;
			return t
		},
		zt = function(t, e, n, r, i) {
			void 0 === n && (n = "_first"), void 0 === r && (r = "_last");
			var s, o = t[r];
			if (i)
				for (s = e[i]; o && o[i] > s;) o = o._prev;
			return o ? (e._next = o._next, o._next = e) : (e._next = t[n], t[n] = e), e._next ? e._next._prev = e : t[r] = e, e._prev = o, e.parent = e._dp = t, e
		},
		Bt = function(t, e, n, r) {
			void 0 === n && (n = "_first"), void 0 === r && (r = "_last");
			var i = e._prev,
				s = e._next;
			i ? i._next = s : t[n] === e && (t[n] = s), s ? s._prev = i : t[r] === e && (t[r] = i), e._next = e._prev = e.parent = null
		},
		Nt = function(t, e) {
			t.parent && (!e || t.parent.autoRemoveChildren) && t.parent.remove && t.parent.remove(t), t._act = 0
		},
		It = function(t, e) {
			if (t && (!e || e._end > t._dur || e._start < 0))
				for (var n = t; n;) n._dirty = 1, n = n.parent;
			return t
		},
		qt = function(t, e, n, r) {
			return t._startAt && (h ? t._startAt.revert(lt) : t.vars.immediateRender && !t.vars.autoRevert || t._startAt.render(e, !0, r))
		},
		Ft = function t(e) {
			return !e || e._ts && t(e.parent)
		},
		Yt = function(t) {
			return t._repeat ? Xt(t._tTime, t = t.duration() + t._rDelay) * t : 0
		},
		Xt = function(t, e) {
			var n = Math.floor(t /= e);
			return t && n === t ? n - 1 : n
		},
		Wt = function(t, e) {
			return (t - e._start) * e._ts + (e._ts >= 0 ? 0 : e._dirty ? e.totalDuration() : e._tDur)
		},
		Ht = function(t) {
			return t._end = Tt(t._start + (t._tDur / Math.abs(t._ts || t._rts || A) || 0))
		},
		Ut = function(t, e) {
			var n = t._dp;
			return n && n.smoothChildTiming && t._ts && (t._start = Tt(n._time - (t._ts > 0 ? e / t._ts : ((t._dirty ? t.totalDuration() : t._tDur) - e) / -t._ts)), Ht(t), n._dirty || It(n, t)), t
		},
		Vt = function(t, e) {
			var n;
			if ((e._time || !e._dur && e._initted || e._start < t._time && (e._dur || !e.add)) && (n = Wt(t.rawTime(), e), (!e._dur || ie(0, e.totalDuration(), n) - e._tTime > A) && e.render(n, !0)), It(t, e)._dp && t._initted && t._time >= t._dur && t._ts) {
				if (t._dur < t.duration())
					for (n = t; n._dp;) n.rawTime() >= 0 && n.totalTime(n._tTime), n = n._dp;
				t._zTime = -1e-8
			}
		},
		$t = function(t, e, n, r) {
			return e.parent && Nt(e), e._start = Tt((q(n) ? n : n || t !== f ? ee(t, n, e) : t._time) + e._delay), e._end = Tt(e._start + (e.totalDuration() / Math.abs(e.timeScale()) || 0)), zt(t, e, "_first", "_last", t._sort ? "_start" : 0), Zt(e) || (t._recent = e), r || Vt(t, e), t._ts < 0 && Ut(t, t._tTime), t
		},
		jt = function(t, e) {
			return (tt.ScrollTrigger || rt("scrollTrigger", e)) && tt.ScrollTrigger.create(e, t)
		},
		Gt = function(t, e, n, r, i) {
			return Je(t, e, i), t._initted ? !n && t._pt && !h && (t._dur && !1 !== t.vars.lazy || !t._dur && t.vars.lazy) && _ !== Le.frame ? (ht.push(t), t._lazy = [i, r], 1) : void 0 : 1
		},
		Qt = function t(e) {
			var n = e.parent;
			return n && n._ts && n._initted && !n._lock && (n.rawTime() < 0 || t(n))
		},
		Zt = function(t) {
			var e = t.data;
			return "isFromStart" === e || "isStart" === e
		},
		Kt = function(t, e, n, r) {
			var i = t._repeat,
				s = Tt(e) || 0,
				o = t._tTime / t._tDur;
			return o && !r && (t._time *= s / t._dur), t._dur = s, t._tDur = i ? i < 0 ? 1e10 : Tt(s * (i + 1) + t._rDelay * i) : s, o > 0 && !r && Ut(t, t._tTime = t._tDur * o), t.parent && Ht(t), n || It(t.parent, t), t
		},
		Jt = function(t) {
			return t instanceof $e ? It(t) : Kt(t, t._dur)
		},
		te = {
			_start: 0,
			endTime: ot,
			totalDuration: ot
		},
		ee = function t(e, n, r) {
			var i, s, o, a = e.labels,
				l = e._recent || te,
				u = e.duration() >= C ? l.endTime(!1) : e._dur;
			return N(n) && (isNaN(n) || n in a) ? (s = n.charAt(0), o = "%" === n.substr(-1), i = n.indexOf("="), "<" === s || ">" === s ? (i >= 0 && (n = n.replace(/=/, "")), ("<" === s ? l._start : l.endTime(l._repeat >= 0)) + (parseFloat(n.substr(1)) || 0) * (o ? (i < 0 ? l : r).totalDuration() / 100 : 1)) : i < 0 ? (n in a || (a[n] = u), a[n]) : (s = parseFloat(n.charAt(i - 1) + n.substr(i + 1)), o && r && (s = s / 100 * (V(r) ? r[0] : r).totalDuration()), i > 1 ? t(e, n.substr(0, i - 1), r) + s : u + s)) : null == n ? u : +n
		},
		ne = function(t, e, n) {
			var r, i, s = q(e[1]),
				o = (s ? 2 : 1) + (t < 2 ? 0 : 1),
				a = e[o];
			if (s && (a.duration = e[1]), a.parent = n, t) {
				for (r = a, i = n; i && !("immediateRender" in r);) r = i.vars.defaults || {}, i = X(i.vars.inherit) && i.parent;
				a.immediateRender = X(r.immediateRender), t < 2 ? a.runBackwards = 1 : a.startAt = e[o - 1]
			}
			return new sn(e[0], a, e[o + 1])
		},
		re = function(t, e) {
			return t || 0 === t ? e(t) : e
		},
		ie = function(t, e, n) {
			return n < t ? t : n > e ? e : n
		},
		se = function(t, e) {
			return N(t) && (e = J.exec(t)) ? e[1] : ""
		},
		oe = [].slice,
		ae = function(t, e) {
			return t && Y(t) && "length" in t && (!e && !t.length || t.length - 1 in t && Y(t[0])) && !t.nodeType && t !== p
		},
		le = function(t, e, n) {
			return d && !e && d.selector ? d.selector(t) : !N(t) || n || !m && De() ? V(t) ? function(t, e, n) {
				return void 0 === n && (n = []), t.forEach((function(t) {
					var r;
					return N(t) && !e || ae(t, 1) ? (r = n).push.apply(r, le(t)) : n.push(t)
				})) || n
			}(t, n) : ae(t) ? oe.call(t, 0) : t ? [t] : [] : oe.call((e || g).querySelectorAll(t), 0)
		},
		ue = function(t) {
			return t = le(t)[0] || it("Invalid scope") || {},
				function(e) {
					var n = t.current || t.nativeElement || t;
					return le(e, n.querySelectorAll ? n : n === t ? it("Invalid scope") || g.createElement("div") : t)
				}
		},
		ce = function(t) {
			return t.sort((function() {
				return .5 - Math.random()
			}))
		},
		he = function(t) {
			if (I(t)) return t;
			var e = Y(t) ? t : {
					each: t
				},
				n = Fe(e.ease),
				r = e.from || 0,
				i = parseFloat(e.base) || 0,
				s = {},
				o = r > 0 && r < 1,
				a = isNaN(r) || o,
				l = e.axis,
				u = r,
				c = r;
			return N(r) ? u = c = {
					center: .5,
					edges: .5,
					end: 1
				} [r] || 0 : !o && a && (u = r[0], c = r[1]),
				function(t, o, h) {
					var d, f, p, m, g, v, _, y, w, b = (h || e).length,
						x = s[b];
					if (!x) {
						if (!(w = "auto" === e.grid ? 0 : (e.grid || [1, C])[1])) {
							for (_ = -C; _ < (_ = h[w++].getBoundingClientRect().left) && w < b;);
							w < b && w--
						}
						for (x = s[b] = [], d = a ? Math.min(w, b) * u - .5 : r % w, f = w === C ? 0 : a ? b * c / w - .5 : r / w | 0, _ = 0, y = C, v = 0; v < b; v++) p = v % w - d, m = f - (v / w | 0), x[v] = g = l ? Math.abs("y" === l ? m : p) : R(p * p + m * m), g > _ && (_ = g), g < y && (y = g);
						"random" === r && ce(x), x.max = _ - y, x.min = y, x.v = b = (parseFloat(e.amount) || parseFloat(e.each) * (w > b ? b - 1 : l ? "y" === l ? b / w : w : Math.max(w, b / w)) || 0) * ("edges" === r ? -1 : 1), x.b = b < 0 ? i - b : i, x.u = se(e.amount || e.each) || 0, n = n && b < 0 ? Ie(n) : n
					}
					return b = (x[t] - x.min) / x.max || 0, Tt(x.b + (n ? n(b) : b) * x.v) + x.u
				}
		},
		de = function(t) {
			var e = Math.pow(10, ((t + "").split(".")[1] || "").length);
			return function(n) {
				var r = Tt(Math.round(parseFloat(n) / t) * t * e);
				return (r - r % 1) / e + (q(n) ? 0 : se(n))
			}
		},
		fe = function(t, e) {
			var n, r, i = V(t);
			return !i && Y(t) && (n = i = t.radius || C, t.values ? (t = le(t.values), (r = !q(t[0])) && (n *= n)) : t = de(t.increment)), re(e, i ? I(t) ? function(e) {
				return r = t(e), Math.abs(r - e) <= n ? r : e
			} : function(e) {
				for (var i, s, o = parseFloat(r ? e.x : e), a = parseFloat(r ? e.y : 0), l = C, u = 0, c = t.length; c--;)(i = r ? (i = t[c].x - o) * i + (s = t[c].y - a) * s : Math.abs(t[c] - o)) < l && (l = i, u = c);
				return u = !n || l <= n ? t[u] : e, r || u === e || q(e) ? u : u + se(e)
			} : de(t))
		},
		pe = function(t, e, n, r) {
			return re(V(t) ? !e : !0 === n ? !!(n = 0) : !r, (function() {
				return V(t) ? t[~~(Math.random() * t.length)] : (n = n || 1e-5) && (r = n < 1 ? Math.pow(10, (n + "").length - 2) : 1) && Math.floor(Math.round((t - n / 2 + Math.random() * (e - t + .99 * n)) / n) * n * r) / r
			}))
		},
		me = function(t, e, n) {
			return re(n, (function(n) {
				return t[~~e(n)]
			}))
		},
		ge = function(t) {
			for (var e, n, r, i, s = 0, o = ""; ~(e = t.indexOf("random(", s));) r = t.indexOf(")", e), i = "[" === t.charAt(e + 7), n = t.substr(e + 7, r - e - 7).match(i ? K : $), o += t.substr(s, e - s) + pe(i ? n : +n[0], i ? 0 : +n[1], +n[2] || 1e-5), s = r + 1;
			return o + t.substr(s, t.length - s)
		},
		ve = function(t, e, n, r, i) {
			var s = e - t,
				o = r - n;
			return re(i, (function(e) {
				return n + ((e - t) / s * o || 0)
			}))
		},
		_e = function(t, e, n) {
			var r, i, s, o = t.labels,
				a = C;
			for (r in o)(i = o[r] - e) < 0 == !!n && i && a > (i = Math.abs(i)) && (s = r, a = i);
			return s
		},
		ye = function(t, e, n) {
			var r, i, s, o = t.vars,
				a = o[e],
				l = d,
				u = t._ctx;
			if (a) return r = o[e + "Params"], i = o.callbackScope || t, n && ht.length && kt(), u && (d = u), s = r ? a.apply(i, r) : a.call(i), d = l, s
		},
		we = function(t) {
			return Nt(t), t.scrollTrigger && t.scrollTrigger.kill(!!h), t.progress() < 1 && ye(t, "onInterrupt"), t
		},
		be = [],
		xe = function(t) {
			if (t)
				if (t = !t.name && t.default || t, W() || t.headless) {
					var e = t.name,
						n = I(t),
						r = e && !n && t.init ? function() {
							this._props = []
						} : t,
						i = {
							init: ot,
							render: pn,
							add: Ze,
							kill: gn,
							modifier: mn,
							rawVars: 0
						},
						s = {
							targetTest: 0,
							get: 0,
							getSetter: cn,
							aliases: {},
							register: 0
						};
					if (De(), t !== r) {
						if (ft[e]) return;
						At(r, At(Dt(t, i), s)), Pt(r.prototype, Pt(i, Dt(t, s))), ft[r.prop = e] = r, t.targetTest && (gt.push(r), ct[e] = 1), e = ("css" === e ? "CSS" : e.charAt(0).toUpperCase() + e.substr(1)) + "Plugin"
					}
					st(e, r), t.register && t.register(Ln, r, yn)
				} else be.push(t)
		},
		Te = 255,
		Se = {
			aqua: [0, Te, Te],
			lime: [0, Te, 0],
			silver: [192, 192, 192],
			black: [0, 0, 0],
			maroon: [128, 0, 0],
			teal: [0, 128, 128],
			blue: [0, 0, Te],
			navy: [0, 0, 128],
			white: [Te, Te, Te],
			olive: [128, 128, 0],
			yellow: [Te, Te, 0],
			orange: [Te, 165, 0],
			gray: [128, 128, 128],
			purple: [128, 0, 128],
			green: [0, 128, 0],
			red: [Te, 0, 0],
			pink: [Te, 192, 203],
			cyan: [0, Te, Te],
			transparent: [Te, Te, Te, 0]
		},
		Ee = function(t, e, n) {
			return (6 * (t += t < 0 ? 1 : t > 1 ? -1 : 0) < 1 ? e + (n - e) * t * 6 : t < .5 ? n : 3 * t < 2 ? e + (n - e) * (2 / 3 - t) * 6 : e) * Te + .5 | 0
		},
		ke = function(t, e, n) {
			var r, i, s, o, a, l, u, c, h, d, f = t ? q(t) ? [t >> 16, t >> 8 & Te, t & Te] : 0 : Se.black;
			if (!f) {
				if ("," === t.substr(-1) && (t = t.substr(0, t.length - 1)), Se[t]) f = Se[t];
				else if ("#" === t.charAt(0)) {
					if (t.length < 6 && (r = t.charAt(1), i = t.charAt(2), s = t.charAt(3), t = "#" + r + r + i + i + s + s + (5 === t.length ? t.charAt(4) + t.charAt(4) : "")), 9 === t.length) return [(f = parseInt(t.substr(1, 6), 16)) >> 16, f >> 8 & Te, f & Te, parseInt(t.substr(7), 16) / 255];
					f = [(t = parseInt(t.substr(1), 16)) >> 16, t >> 8 & Te, t & Te]
				} else if ("hsl" === t.substr(0, 3))
					if (f = d = t.match($), e) {
						if (~t.indexOf("=")) return f = t.match(j), n && f.length < 4 && (f[3] = 1), f
					} else o = +f[0] % 360 / 360, a = +f[1] / 100, r = 2 * (l = +f[2] / 100) - (i = l <= .5 ? l * (a + 1) : l + a - l * a), f.length > 3 && (f[3] *= 1), f[0] = Ee(o + 1 / 3, r, i), f[1] = Ee(o, r, i), f[2] = Ee(o - 1 / 3, r, i);
				else f = t.match($) || Se.transparent;
				f = f.map(Number)
			}
			return e && !d && (r = f[0] / Te, i = f[1] / Te, s = f[2] / Te, l = ((u = Math.max(r, i, s)) + (c = Math.min(r, i, s))) / 2, u === c ? o = a = 0 : (h = u - c, a = l > .5 ? h / (2 - u - c) : h / (u + c), o = u === r ? (i - s) / h + (i < s ? 6 : 0) : u === i ? (s - r) / h + 2 : (r - i) / h + 4, o *= 60), f[0] = ~~(o + .5), f[1] = ~~(100 * a + .5), f[2] = ~~(100 * l + .5)), n && f.length < 4 && (f[3] = 1), f
		},
		Me = function(t) {
			var e = [],
				n = [],
				r = -1;
			return t.split(Ce).forEach((function(t) {
				var i = t.match(G) || [];
				e.push.apply(e, i), n.push(r += i.length + 1)
			})), e.c = n, e
		},
		Oe = function(t, e, n) {
			var r, i, s, o, a = "",
				l = (t + a).match(Ce),
				u = e ? "hsla(" : "rgba(",
				c = 0;
			if (!l) return t;
			if (l = l.map((function(t) {
					return (t = ke(t, e, 1)) && u + (e ? t[0] + "," + t[1] + "%," + t[2] + "%," + t[3] : t.join(",")) + ")"
				})), n && (s = Me(t), (r = n.c).join(a) !== s.c.join(a)))
				for (o = (i = t.replace(Ce, "1").split(G)).length - 1; c < o; c++) a += i[c] + (~r.indexOf(c) ? l.shift() || u + "0,0,0,0)" : (s.length ? s : l.length ? l : n).shift());
			if (!i)
				for (o = (i = t.split(Ce)).length - 1; c < o; c++) a += i[c] + l[c];
			return a + i[o]
		},
		Ce = function() {
			var t, e = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b";
			for (t in Se) e += "|" + t + "\\b";
			return new RegExp(e + ")", "gi")
		}(),
		Ae = /hsl[a]?\(/,
		Pe = function(t) {
			var e, n = t.join(" ");
			if (Ce.lastIndex = 0, Ce.test(n)) return e = Ae.test(n), t[1] = Oe(t[1], e), t[0] = Oe(t[0], e, Me(t[1])), !0
		},
		Le = function() {
			var t, e, n, r, i, s, o = Date.now,
				a = 500,
				l = 33,
				u = o(),
				c = u,
				h = 1e3 / 240,
				d = h,
				f = [],
				_ = function n(p) {
					var m, g, v, _, y = o() - c,
						w = !0 === p;
					if ((y > a || y < 0) && (u += y - l), ((m = (v = (c += y) - u) - d) > 0 || w) && (_ = ++r.frame, i = v - 1e3 * r.time, r.time = v /= 1e3, d += m + (m >= h ? 4 : h - m), g = 1), w || (t = e(n)), g)
						for (s = 0; s < f.length; s++) f[s](v, i, _, p)
				};
			return r = {
				time: 0,
				frame: 0,
				tick: function() {
					_(!0)
				},
				deltaRatio: function(t) {
					return i / (1e3 / (t || 60))
				},
				wake: function() {
					v && (!m && W() && (p = m = window, g = p.document || {}, tt.gsap = Ln, (p.gsapVersions || (p.gsapVersions = [])).push(Ln.version), nt(et || p.GreenSockGlobals || !p.gsap && p || {}), be.forEach(xe)), n = "undefined" != typeof requestAnimationFrame && requestAnimationFrame, t && r.sleep(), e = n || function(t) {
						return setTimeout(t, d - 1e3 * r.time + 1 | 0)
					}, w = 1, _(2))
				},
				sleep: function() {
					(n ? cancelAnimationFrame : clearTimeout)(t), w = 0, e = ot
				},
				lagSmoothing: function(t, e) {
					a = t || 1 / 0, l = Math.min(e || 33, a)
				},
				fps: function(t) {
					h = 1e3 / (t || 240), d = 1e3 * r.time + h
				},
				add: function(t, e, n) {
					var i = e ? function(e, n, s, o) {
						t(e, n, s, o), r.remove(i)
					} : t;
					return r.remove(t), f[n ? "unshift" : "push"](i), De(), i
				},
				remove: function(t, e) {
					~(e = f.indexOf(t)) && f.splice(e, 1) && s >= e && s--
				},
				_listeners: f
			}
		}(),
		De = function() {
			return !w && Le.wake()
		},
		Re = {},
		ze = /^[\d.\-M][\d.\-,\s]/,
		Be = /["']/g,
		Ne = function(t) {
			for (var e, n, r, i = {}, s = t.substr(1, t.length - 3).split(":"), o = s[0], a = 1, l = s.length; a < l; a++) n = s[a], e = a !== l - 1 ? n.lastIndexOf(",") : n.length, r = n.substr(0, e), i[o] = isNaN(r) ? r.replace(Be, "").trim() : +r, o = n.substr(e + 1).trim();
			return i
		},
		Ie = function(t) {
			return function(e) {
				return 1 - t(1 - e)
			}
		},
		qe = function t(e, n) {
			for (var r, i = e._first; i;) i instanceof $e ? t(i, n) : !i.vars.yoyoEase || i._yoyo && i._repeat || i._yoyo === n || (i.timeline ? t(i.timeline, n) : (r = i._ease, i._ease = i._yEase, i._yEase = r, i._yoyo = n)), i = i._next
		},
		Fe = function(t, e) {
			return t && (I(t) ? t : Re[t] || function(t) {
				var e, n, r, i, s = (t + "").split("("),
					o = Re[s[0]];
				return o && s.length > 1 && o.config ? o.config.apply(null, ~t.indexOf("{") ? [Ne(s[1])] : (e = t, n = e.indexOf("(") + 1, r = e.indexOf(")"), i = e.indexOf("(", n), e.substring(n, ~i && i < r ? e.indexOf(")", r + 1) : r)).split(",").map(Ot)) : Re._CE && ze.test(t) ? Re._CE("", t) : o
			}(t)) || e
		},
		Ye = function(t, e, n, r) {
			void 0 === n && (n = function(t) {
				return 1 - e(1 - t)
			}), void 0 === r && (r = function(t) {
				return t < .5 ? e(2 * t) / 2 : 1 - e(2 * (1 - t)) / 2
			});
			var i, s = {
				easeIn: e,
				easeOut: n,
				easeInOut: r
			};
			return bt(t, (function(t) {
				for (var e in Re[t] = tt[t] = s, Re[i = t.toLowerCase()] = n, s) Re[i + ("easeIn" === e ? ".in" : "easeOut" === e ? ".out" : ".inOut")] = Re[t + "." + e] = s[e]
			})), s
		},
		Xe = function(t) {
			return function(e) {
				return e < .5 ? (1 - t(1 - 2 * e)) / 2 : .5 + t(2 * (e - .5)) / 2
			}
		},
		We = function t(e, n, r) {
			var i = n >= 1 ? n : 1,
				s = (r || (e ? .3 : .45)) / (n < 1 ? n : 1),
				o = s / P * (Math.asin(1 / i) || 0),
				a = function(t) {
					return 1 === t ? 1 : i * Math.pow(2, -10 * t) * B((t - o) * s) + 1
				},
				l = "out" === e ? a : "in" === e ? function(t) {
					return 1 - a(1 - t)
				} : Xe(a);
			return s = P / s, l.config = function(n, r) {
				return t(e, n, r)
			}, l
		},
		He = function t(e, n) {
			void 0 === n && (n = 1.70158);
			var r = function(t) {
					return t ? --t * t * ((n + 1) * t + n) + 1 : 0
				},
				i = "out" === e ? r : "in" === e ? function(t) {
					return 1 - r(1 - t)
				} : Xe(r);
			return i.config = function(n) {
				return t(e, n)
			}, i
		};
	bt("Linear,Quad,Cubic,Quart,Quint,Strong", (function(t, e) {
		var n = e < 5 ? e + 1 : e;
		Ye(t + ",Power" + (n - 1), e ? function(t) {
			return Math.pow(t, n)
		} : function(t) {
			return t
		}, (function(t) {
			return 1 - Math.pow(1 - t, n)
		}), (function(t) {
			return t < .5 ? Math.pow(2 * t, n) / 2 : 1 - Math.pow(2 * (1 - t), n) / 2
		}))
	})), Re.Linear.easeNone = Re.none = Re.Linear.easeIn, Ye("Elastic", We("in"), We("out"), We()), b = 7.5625, S = 2 * (T = 1 / (x = 2.75)), E = 2.5 * T, Ye("Bounce", (function(t) {
		return 1 - k(1 - t)
	}), k = function(t) {
		return t < T ? b * t * t : t < S ? b * Math.pow(t - 1.5 / x, 2) + .75 : t < E ? b * (t -= 2.25 / x) * t + .9375 : b * Math.pow(t - 2.625 / x, 2) + .984375
	}), Ye("Expo", (function(t) {
		return t ? Math.pow(2, 10 * (t - 1)) : 0
	})), Ye("Circ", (function(t) {
		return -(R(1 - t * t) - 1)
	})), Ye("Sine", (function(t) {
		return 1 === t ? 1 : 1 - z(t * L)
	})), Ye("Back", He("in"), He("out"), He()), Re.SteppedEase = Re.steps = tt.SteppedEase = {
		config: function(t, e) {
			void 0 === t && (t = 1);
			var n = 1 / t,
				r = t + (e ? 0 : 1),
				i = e ? 1 : 0;
			return function(t) {
				return ((r * ie(0, .99999999, t) | 0) + i) * n
			}
		}
	}, O.ease = Re["quad.out"], bt("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", (function(t) {
		return vt += t + "," + t + "Params,"
	}));
	var Ue = function(t, e) {
			this.id = D++, t._gsap = this, this.target = t, this.harness = e, this.get = e ? e.get : wt, this.set = e ? e.getSetter : cn
		},
		Ve = function() {
			function t(t) {
				this.vars = t, this._delay = +t.delay || 0, (this._repeat = t.repeat === 1 / 0 ? -2 : t.repeat || 0) && (this._rDelay = t.repeatDelay || 0, this._yoyo = !!t.yoyo || !!t.yoyoEase), this._ts = 1, Kt(this, +t.duration, 1, 1), this.data = t.data, d && (this._ctx = d, d.data.push(this)), w || Le.wake()
			}
			var e = t.prototype;
			return e.delay = function(t) {
				return t || 0 === t ? (this.parent && this.parent.smoothChildTiming && this.startTime(this._start + t - this._delay), this._delay = t, this) : this._delay
			}, e.duration = function(t) {
				return arguments.length ? this.totalDuration(this._repeat > 0 ? t + (t + this._rDelay) * this._repeat : t) : this.totalDuration() && this._dur
			}, e.totalDuration = function(t) {
				return arguments.length ? (this._dirty = 0, Kt(this, this._repeat < 0 ? t : (t - this._repeat * this._rDelay) / (this._repeat + 1))) : this._tDur
			}, e.totalTime = function(t, e) {
				if (De(), !arguments.length) return this._tTime;
				var n = this._dp;
				if (n && n.smoothChildTiming && this._ts) {
					for (Ut(this, t), !n._dp || n.parent || Vt(n, this); n && n.parent;) n.parent._time !== n._start + (n._ts >= 0 ? n._tTime / n._ts : (n.totalDuration() - n._tTime) / -n._ts) && n.totalTime(n._tTime, !0), n = n.parent;
					!this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && t < this._tDur || this._ts < 0 && t > 0 || !this._tDur && !t) && $t(this._dp, this, this._start - this._delay)
				}
				return (this._tTime !== t || !this._dur && !e || this._initted && Math.abs(this._zTime) === A || !t && !this._initted && (this.add || this._ptLookup)) && (this._ts || (this._pTime = t), Mt(this, t, e)), this
			}, e.time = function(t, e) {
				return arguments.length ? this.totalTime(Math.min(this.totalDuration(), t + Yt(this)) % (this._dur + this._rDelay) || (t ? this._dur : 0), e) : this._time
			}, e.totalProgress = function(t, e) {
				return arguments.length ? this.totalTime(this.totalDuration() * t, e) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.rawTime() > 0 ? 1 : 0
			}, e.progress = function(t, e) {
				return arguments.length ? this.totalTime(this.duration() * (!this._yoyo || 1 & this.iteration() ? t : 1 - t) + Yt(this), e) : this.duration() ? Math.min(1, this._time / this._dur) : this.rawTime() > 0 ? 1 : 0
			}, e.iteration = function(t, e) {
				var n = this.duration() + this._rDelay;
				return arguments.length ? this.totalTime(this._time + (t - 1) * n, e) : this._repeat ? Xt(this._tTime, n) + 1 : 1
			}, e.timeScale = function(t, e) {
				if (!arguments.length) return -1e-8 === this._rts ? 0 : this._rts;
				if (this._rts === t) return this;
				var n = this.parent && this._ts ? Wt(this.parent._time, this) : this._tTime;
				return this._rts = +t || 0, this._ts = this._ps || -1e-8 === t ? 0 : this._rts, this.totalTime(ie(-Math.abs(this._delay), this._tDur, n), !1 !== e), Ht(this),
					function(t) {
						for (var e = t.parent; e && e.parent;) e._dirty = 1, e.totalDuration(), e = e.parent;
						return t
					}(this)
			}, e.paused = function(t) {
				return arguments.length ? (this._ps !== t && (this._ps = t, t ? (this._pTime = this._tTime || Math.max(-this._delay, this.rawTime()), this._ts = this._act = 0) : (De(), this._ts = this._rts, this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, 1 === this.progress() && Math.abs(this._zTime) !== A && (this._tTime -= A)))), this) : this._ps
			}, e.startTime = function(t) {
				if (arguments.length) {
					this._start = t;
					var e = this.parent || this._dp;
					return e && (e._sort || !this.parent) && $t(e, this, t - this._delay), this
				}
				return this._start
			}, e.endTime = function(t) {
				return this._start + (X(t) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1)
			}, e.rawTime = function(t) {
				var e = this.parent || this._dp;
				return e ? t && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : this._ts ? Wt(e.rawTime(t), this) : this._tTime : this._tTime
			}, e.revert = function(t) {
				void 0 === t && (t = ut);
				var e = h;
				return h = t, (this._initted || this._startAt) && (this.timeline && this.timeline.revert(t), this.totalTime(-.01, t.suppressEvents)), "nested" !== this.data && !1 !== t.kill && this.kill(), h = e, this
			}, e.globalTime = function(t) {
				for (var e = this, n = arguments.length ? t : e.rawTime(); e;) n = e._start + n / (Math.abs(e._ts) || 1), e = e._dp;
				return !this.parent && this._sat ? this._sat.globalTime(t) : n
			}, e.repeat = function(t) {
				return arguments.length ? (this._repeat = t === 1 / 0 ? -2 : t, Jt(this)) : -2 === this._repeat ? 1 / 0 : this._repeat
			}, e.repeatDelay = function(t) {
				if (arguments.length) {
					var e = this._time;
					return this._rDelay = t, Jt(this), e ? this.time(e) : this
				}
				return this._rDelay
			}, e.yoyo = function(t) {
				return arguments.length ? (this._yoyo = t, this) : this._yoyo
			}, e.seek = function(t, e) {
				return this.totalTime(ee(this, t), X(e))
			}, e.restart = function(t, e) {
				return this.play().totalTime(t ? -this._delay : 0, X(e))
			}, e.play = function(t, e) {
				return null != t && this.seek(t, e), this.reversed(!1).paused(!1)
			}, e.reverse = function(t, e) {
				return null != t && this.seek(t || this.totalDuration(), e), this.reversed(!0).paused(!1)
			}, e.pause = function(t, e) {
				return null != t && this.seek(t, e), this.paused(!0)
			}, e.resume = function() {
				return this.paused(!1)
			}, e.reversed = function(t) {
				return arguments.length ? (!!t !== this.reversed() && this.timeScale(-this._rts || (t ? -1e-8 : 0)), this) : this._rts < 0
			}, e.invalidate = function() {
				return this._initted = this._act = 0, this._zTime = -1e-8, this
			}, e.isActive = function() {
				var t, e = this.parent || this._dp,
					n = this._start;
				return !(e && !(this._ts && this._initted && e.isActive() && (t = e.rawTime(!0)) >= n && t < this.endTime(!0) - A))
			}, e.eventCallback = function(t, e, n) {
				var r = this.vars;
				return arguments.length > 1 ? (e ? (r[t] = e, n && (r[t + "Params"] = n), "onUpdate" === t && (this._onUpdate = e)) : delete r[t], this) : r[t]
			}, e.then = function(t) {
				var e = this;
				return new Promise((function(n) {
					var r = I(t) ? t : Ct,
						i = function() {
							var t = e.then;
							e.then = null, I(r) && (r = r(e)) && (r.then || r === e) && (e.then = t), n(r), e.then = t
						};
					e._initted && 1 === e.totalProgress() && e._ts >= 0 || !e._tTime && e._ts < 0 ? i() : e._prom = i
				}))
			}, e.kill = function() {
				we(this)
			}, t
		}();
	At(Ve.prototype, {
		_time: 0,
		_start: 0,
		_end: 0,
		_tTime: 0,
		_tDur: 0,
		_dirty: 0,
		_repeat: 0,
		_yoyo: !1,
		parent: null,
		_initted: !1,
		_rDelay: 0,
		_ts: 1,
		_dp: 0,
		ratio: 0,
		_zTime: -1e-8,
		_prom: 0,
		_ps: !1,
		_rts: 1
	});
	var $e = function(t) {
		function e(e, n) {
			var r;
			return void 0 === e && (e = {}), (r = t.call(this, e) || this).labels = {}, r.smoothChildTiming = !!e.smoothChildTiming, r.autoRemoveChildren = !!e.autoRemoveChildren, r._sort = X(e.sortChildren), f && $t(e.parent || f, l(r), n), e.reversed && r.reverse(), e.paused && r.paused(!0), e.scrollTrigger && jt(l(r), e.scrollTrigger), r
		}
		u(e, t);
		var n = e.prototype;
		return n.to = function(t, e, n) {
			return ne(0, arguments, this), this
		}, n.from = function(t, e, n) {
			return ne(1, arguments, this), this
		}, n.fromTo = function(t, e, n, r) {
			return ne(2, arguments, this), this
		}, n.set = function(t, e, n) {
			return e.duration = 0, e.parent = this, Rt(e).repeatDelay || (e.repeat = 0), e.immediateRender = !!e.immediateRender, new sn(t, e, ee(this, n), 1), this
		}, n.call = function(t, e, n) {
			return $t(this, sn.delayedCall(0, t, e), n)
		}, n.staggerTo = function(t, e, n, r, i, s, o) {
			return n.duration = e, n.stagger = n.stagger || r, n.onComplete = s, n.onCompleteParams = o, n.parent = this, new sn(t, n, ee(this, i)), this
		}, n.staggerFrom = function(t, e, n, r, i, s, o) {
			return n.runBackwards = 1, Rt(n).immediateRender = X(n.immediateRender), this.staggerTo(t, e, n, r, i, s, o)
		}, n.staggerFromTo = function(t, e, n, r, i, s, o, a) {
			return r.startAt = n, Rt(r).immediateRender = X(r.immediateRender), this.staggerTo(t, e, r, i, s, o, a)
		}, n.render = function(t, e, n) {
			var r, i, s, o, a, l, u, c, d, p, m, g, v = this._time,
				_ = this._dirty ? this.totalDuration() : this._tDur,
				y = this._dur,
				w = t <= 0 ? 0 : Tt(t),
				b = this._zTime < 0 != t < 0 && (this._initted || !y);
			if (this !== f && w > _ && t >= 0 && (w = _), w !== this._tTime || n || b) {
				if (v !== this._time && y && (w += this._time - v, t += this._time - v), r = w, d = this._start, l = !(c = this._ts), b && (y || (v = this._zTime), (t || !e) && (this._zTime = t)), this._repeat) {
					if (m = this._yoyo, a = y + this._rDelay, this._repeat < -1 && t < 0) return this.totalTime(100 * a + t, e, n);
					if (r = Tt(w % a), w === _ ? (o = this._repeat, r = y) : ((o = ~~(w / a)) && o === w / a && (r = y, o--), r > y && (r = y)), p = Xt(this._tTime, a), !v && this._tTime && p !== o && this._tTime - p * a - this._dur <= 0 && (p = o), m && 1 & o && (r = y - r, g = 1), o !== p && !this._lock) {
						var x = m && 1 & p,
							T = x === (m && 1 & o);
						if (o < p && (x = !x), v = x ? 0 : w % y ? y : w, this._lock = 1, this.render(v || (g ? 0 : Tt(o * a)), e, !y)._lock = 0, this._tTime = w, !e && this.parent && ye(this, "onRepeat"), this.vars.repeatRefresh && !g && (this.invalidate()._lock = 1), v && v !== this._time || l !== !this._ts || this.vars.onRepeat && !this.parent && !this._act) return this;
						if (y = this._dur, _ = this._tDur, T && (this._lock = 2, v = x ? y : -1e-4, this.render(v, !0), this.vars.repeatRefresh && !g && this.invalidate()), this._lock = 0, !this._ts && !l) return this;
						qe(this, g)
					}
				}
				if (this._hasPause && !this._forcing && this._lock < 2 && (u = function(t, e, n) {
						var r;
						if (n > e)
							for (r = t._first; r && r._start <= n;) {
								if ("isPause" === r.data && r._start > e) return r;
								r = r._next
							} else
								for (r = t._last; r && r._start >= n;) {
									if ("isPause" === r.data && r._start < e) return r;
									r = r._prev
								}
					}(this, Tt(v), Tt(r)), u && (w -= r - (r = u._start))), this._tTime = w, this._time = r, this._act = !c, this._initted || (this._onUpdate = this.vars.onUpdate, this._initted = 1, this._zTime = t, v = 0), !v && r && !e && !o && (ye(this, "onStart"), this._tTime !== w)) return this;
				if (r >= v && t >= 0)
					for (i = this._first; i;) {
						if (s = i._next, (i._act || r >= i._start) && i._ts && u !== i) {
							if (i.parent !== this) return this.render(t, e, n);
							if (i.render(i._ts > 0 ? (r - i._start) * i._ts : (i._dirty ? i.totalDuration() : i._tDur) + (r - i._start) * i._ts, e, n), r !== this._time || !this._ts && !l) {
								u = 0, s && (w += this._zTime = -1e-8);
								break
							}
						}
						i = s
					} else {
						i = this._last;
						for (var S = t < 0 ? t : r; i;) {
							if (s = i._prev, (i._act || S <= i._end) && i._ts && u !== i) {
								if (i.parent !== this) return this.render(t, e, n);
								if (i.render(i._ts > 0 ? (S - i._start) * i._ts : (i._dirty ? i.totalDuration() : i._tDur) + (S - i._start) * i._ts, e, n || h && (i._initted || i._startAt)), r !== this._time || !this._ts && !l) {
									u = 0, s && (w += this._zTime = S ? -1e-8 : A);
									break
								}
							}
							i = s
						}
					}
				if (u && !e && (this.pause(), u.render(r >= v ? 0 : -1e-8)._zTime = r >= v ? 1 : -1, this._ts)) return this._start = d, Ht(this), this.render(t, e, n);
				this._onUpdate && !e && ye(this, "onUpdate", !0), (w === _ && this._tTime >= this.totalDuration() || !w && v) && (d !== this._start && Math.abs(c) === Math.abs(this._ts) || this._lock || ((t || !y) && (w === _ && this._ts > 0 || !w && this._ts < 0) && Nt(this, 1), e || t < 0 && !v || !w && !v && _ || (ye(this, w === _ && t >= 0 ? "onComplete" : "onReverseComplete", !0), this._prom && !(w < _ && this.timeScale() > 0) && this._prom())))
			}
			return this
		}, n.add = function(t, e) {
			var n = this;
			if (q(e) || (e = ee(this, e, t)), !(t instanceof Ve)) {
				if (V(t)) return t.forEach((function(t) {
					return n.add(t, e)
				})), this;
				if (N(t)) return this.addLabel(t, e);
				if (!I(t)) return this;
				t = sn.delayedCall(0, t)
			}
			return this !== t ? $t(this, t, e) : this
		}, n.getChildren = function(t, e, n, r) {
			void 0 === t && (t = !0), void 0 === e && (e = !0), void 0 === n && (n = !0), void 0 === r && (r = -C);
			for (var i = [], s = this._first; s;) s._start >= r && (s instanceof sn ? e && i.push(s) : (n && i.push(s), t && i.push.apply(i, s.getChildren(!0, e, n)))), s = s._next;
			return i
		}, n.getById = function(t) {
			for (var e = this.getChildren(1, 1, 1), n = e.length; n--;)
				if (e[n].vars.id === t) return e[n]
		}, n.remove = function(t) {
			return N(t) ? this.removeLabel(t) : I(t) ? this.killTweensOf(t) : (Bt(this, t), t === this._recent && (this._recent = this._last), It(this))
		}, n.totalTime = function(e, n) {
			return arguments.length ? (this._forcing = 1, !this._dp && this._ts && (this._start = Tt(Le.time - (this._ts > 0 ? e / this._ts : (this.totalDuration() - e) / -this._ts))), t.prototype.totalTime.call(this, e, n), this._forcing = 0, this) : this._tTime
		}, n.addLabel = function(t, e) {
			return this.labels[t] = ee(this, e), this
		}, n.removeLabel = function(t) {
			return delete this.labels[t], this
		}, n.addPause = function(t, e, n) {
			var r = sn.delayedCall(0, e || ot, n);
			return r.data = "isPause", this._hasPause = 1, $t(this, r, ee(this, t))
		}, n.removePause = function(t) {
			var e = this._first;
			for (t = ee(this, t); e;) e._start === t && "isPause" === e.data && Nt(e), e = e._next
		}, n.killTweensOf = function(t, e, n) {
			for (var r = this.getTweensOf(t, n), i = r.length; i--;) je !== r[i] && r[i].kill(t, e);
			return this
		}, n.getTweensOf = function(t, e) {
			for (var n, r = [], i = le(t), s = this._first, o = q(e); s;) s instanceof sn ? Et(s._targets, i) && (o ? (!je || s._initted && s._ts) && s.globalTime(0) <= e && s.globalTime(s.totalDuration()) > e : !e || s.isActive()) && r.push(s) : (n = s.getTweensOf(i, e)).length && r.push.apply(r, n), s = s._next;
			return r
		}, n.tweenTo = function(t, e) {
			e = e || {};
			var n, r = this,
				i = ee(r, t),
				s = e,
				o = s.startAt,
				a = s.onStart,
				l = s.onStartParams,
				u = s.immediateRender,
				c = sn.to(r, At({
					ease: e.ease || "none",
					lazy: !1,
					immediateRender: !1,
					time: i,
					overwrite: "auto",
					duration: e.duration || Math.abs((i - (o && "time" in o ? o.time : r._time)) / r.timeScale()) || A,
					onStart: function() {
						if (r.pause(), !n) {
							var t = e.duration || Math.abs((i - (o && "time" in o ? o.time : r._time)) / r.timeScale());
							c._dur !== t && Kt(c, t, 0, 1).render(c._time, !0, !0), n = 1
						}
						a && a.apply(c, l || [])
					}
				}, e));
			return u ? c.render(0) : c
		}, n.tweenFromTo = function(t, e, n) {
			return this.tweenTo(e, At({
				startAt: {
					time: ee(this, t)
				}
			}, n))
		}, n.recent = function() {
			return this._recent
		}, n.nextLabel = function(t) {
			return void 0 === t && (t = this._time), _e(this, ee(this, t))
		}, n.previousLabel = function(t) {
			return void 0 === t && (t = this._time), _e(this, ee(this, t), 1)
		}, n.currentLabel = function(t) {
			return arguments.length ? this.seek(t, !0) : this.previousLabel(this._time + A)
		}, n.shiftChildren = function(t, e, n) {
			void 0 === n && (n = 0);
			for (var r, i = this._first, s = this.labels; i;) i._start >= n && (i._start += t, i._end += t), i = i._next;
			if (e)
				for (r in s) s[r] >= n && (s[r] += t);
			return It(this)
		}, n.invalidate = function(e) {
			var n = this._first;
			for (this._lock = 0; n;) n.invalidate(e), n = n._next;
			return t.prototype.invalidate.call(this, e)
		}, n.clear = function(t) {
			void 0 === t && (t = !0);
			for (var e, n = this._first; n;) e = n._next, this.remove(n), n = e;
			return this._dp && (this._time = this._tTime = this._pTime = 0), t && (this.labels = {}), It(this)
		}, n.totalDuration = function(t) {
			var e, n, r, i = 0,
				s = this,
				o = s._last,
				a = C;
			if (arguments.length) return s.timeScale((s._repeat < 0 ? s.duration() : s.totalDuration()) / (s.reversed() ? -t : t));
			if (s._dirty) {
				for (r = s.parent; o;) e = o._prev, o._dirty && o.totalDuration(), (n = o._start) > a && s._sort && o._ts && !s._lock ? (s._lock = 1, $t(s, o, n - o._delay, 1)._lock = 0) : a = n, n < 0 && o._ts && (i -= n, (!r && !s._dp || r && r.smoothChildTiming) && (s._start += n / s._ts, s._time -= n, s._tTime -= n), s.shiftChildren(-n, !1, -Infinity), a = 0), o._end > i && o._ts && (i = o._end), o = e;
				Kt(s, s === f && s._time > i ? s._time : i, 1, 1), s._dirty = 0
			}
			return s._tDur
		}, e.updateRoot = function(t) {
			if (f._ts && (Mt(f, Wt(t, f)), _ = Le.frame), Le.frame >= mt) {
				mt += M.autoSleep || 120;
				var e = f._first;
				if ((!e || !e._ts) && M.autoSleep && Le._listeners.length < 2) {
					for (; e && !e._ts;) e = e._next;
					e || Le.sleep()
				}
			}
		}, e
	}(Ve);
	At($e.prototype, {
		_lock: 0,
		_hasPause: 0,
		_forcing: 0
	});
	var je, Ge, Qe = function(t, e, n, r, i, s, o) {
			var a, l, u, c, h, d, f, p, m = new yn(this._pt, t, e, 0, 1, fn, null, i),
				g = 0,
				v = 0;
			for (m.b = n, m.e = r, n += "", (f = ~(r += "").indexOf("random(")) && (r = ge(r)), s && (s(p = [n, r], t, e), n = p[0], r = p[1]), l = n.match(Q) || []; a = Q.exec(r);) c = a[0], h = r.substring(g, a.index), u ? u = (u + 1) % 5 : "rgba(" === h.substr(-5) && (u = 1), c !== l[v++] && (d = parseFloat(l[v - 1]) || 0, m._pt = {
				_next: m._pt,
				p: h || 1 === v ? h : ",",
				s: d,
				c: "=" === c.charAt(1) ? St(d, c) - d : parseFloat(c) - d,
				m: u && u < 4 ? Math.round : 0
			}, g = Q.lastIndex);
			return m.c = g < r.length ? r.substring(g, r.length) : "", m.fp = o, (Z.test(r) || f) && (m.e = 0), this._pt = m, m
		},
		Ze = function(t, e, n, r, i, s, o, a, l, u) {
			I(r) && (r = r(i || 0, t, s));
			var c, h = t[e],
				d = "get" !== n ? n : I(h) ? l ? t[e.indexOf("set") || !I(t["get" + e.substr(3)]) ? e : "get" + e.substr(3)](l) : t[e]() : h,
				f = I(h) ? l ? ln : an : on;
			if (N(r) && (~r.indexOf("random(") && (r = ge(r)), "=" === r.charAt(1) && ((c = St(d, r) + (se(d) || 0)) || 0 === c) && (r = c)), !u || d !== r || Ge) return isNaN(d * r) || "" === r ? (!h && !(e in t) && rt(e, r), Qe.call(this, t, e, d, r, f, a || M.stringFilter, l)) : (c = new yn(this._pt, t, e, +d || 0, r - (d || 0), "boolean" == typeof h ? dn : hn, 0, f), l && (c.fp = l), o && c.modifier(o, this, t), this._pt = c)
		},
		Ke = function(t, e, n, r, i, s) {
			var o, a, l, u;
			if (ft[t] && !1 !== (o = new ft[t]).init(i, o.rawVars ? e[t] : function(t, e, n, r, i) {
					if (I(t) && (t = en(t, i, e, n, r)), !Y(t) || t.style && t.nodeType || V(t) || U(t)) return N(t) ? en(t, i, e, n, r) : t;
					var s, o = {};
					for (s in t) o[s] = en(t[s], i, e, n, r);
					return o
				}(e[t], r, i, s, n), n, r, s) && (n._pt = a = new yn(n._pt, i, t, 0, 1, o.render, o, 0, o.priority), n !== y))
				for (l = n._ptLookup[n._targets.indexOf(i)], u = o._props.length; u--;) l[o._props[u]] = a;
			return o
		},
		Je = function t(e, n, r) {
			var i, s, o, a, l, u, d, p, m, g, v, _, y, w = e.vars,
				b = w.ease,
				x = w.startAt,
				T = w.immediateRender,
				S = w.lazy,
				E = w.onUpdate,
				k = w.runBackwards,
				M = w.yoyoEase,
				P = w.keyframes,
				L = w.autoRevert,
				D = e._dur,
				R = e._startAt,
				z = e._targets,
				B = e.parent,
				N = B && "nested" === B.data ? B.vars.targets : z,
				I = "auto" === e._overwrite && !c,
				q = e.timeline;
			if (q && (!P || !b) && (b = "none"), e._ease = Fe(b, O.ease), e._yEase = M ? Ie(Fe(!0 === M ? b : M, O.ease)) : 0, M && e._yoyo && !e._repeat && (M = e._yEase, e._yEase = e._ease, e._ease = M), e._from = !q && !!w.runBackwards, !q || P && !w.stagger) {
				if (_ = (p = z[0] ? yt(z[0]).harness : 0) && w[p.prop], i = Dt(w, ct), R && (R._zTime < 0 && R.progress(1), n < 0 && k && T && !L ? R.render(-1, !0) : R.revert(k && D ? lt : at), R._lazy = 0), x) {
					if (Nt(e._startAt = sn.set(z, At({
							data: "isStart",
							overwrite: !1,
							parent: B,
							immediateRender: !0,
							lazy: !R && X(S),
							startAt: null,
							delay: 0,
							onUpdate: E && function() {
								return ye(e, "onUpdate")
							},
							stagger: 0
						}, x))), e._startAt._dp = 0, e._startAt._sat = e, n < 0 && (h || !T && !L) && e._startAt.revert(lt), T && D && n <= 0 && r <= 0) return void(n && (e._zTime = n))
				} else if (k && D && !R)
					if (n && (T = !1), o = At({
							overwrite: !1,
							data: "isFromStart",
							lazy: T && !R && X(S),
							immediateRender: T,
							stagger: 0,
							parent: B
						}, i), _ && (o[p.prop] = _), Nt(e._startAt = sn.set(z, o)), e._startAt._dp = 0, e._startAt._sat = e, n < 0 && (h ? e._startAt.revert(lt) : e._startAt.render(-1, !0)), e._zTime = n, T) {
						if (!n) return
					} else t(e._startAt, A, A);
				for (e._pt = e._ptCache = 0, S = D && X(S) || S && !D, s = 0; s < z.length; s++) {
					if (d = (l = z[s])._gsap || _t(z)[s]._gsap, e._ptLookup[s] = g = {}, dt[d.id] && ht.length && kt(), v = N === z ? s : N.indexOf(l), p && !1 !== (m = new p).init(l, _ || i, e, v, N) && (e._pt = a = new yn(e._pt, l, m.name, 0, 1, m.render, m, 0, m.priority), m._props.forEach((function(t) {
							g[t] = a
						})), m.priority && (u = 1)), !p || _)
						for (o in i) ft[o] && (m = Ke(o, i, e, v, l, N)) ? m.priority && (u = 1) : g[o] = a = Ze.call(e, l, o, "get", i[o], v, N, 0, w.stringFilter);
					e._op && e._op[s] && e.kill(l, e._op[s]), I && e._pt && (je = e, f.killTweensOf(l, g, e.globalTime(n)), y = !e.parent, je = 0), e._pt && S && (dt[d.id] = 1)
				}
				u && _n(e), e._onInit && e._onInit(e)
			}
			e._onUpdate = E, e._initted = (!e._op || e._pt) && !y, P && n <= 0 && q.render(C, !0, !0)
		},
		tn = function(t, e, n, r) {
			var i, s, o = e.ease || r || "power1.inOut";
			if (V(e)) s = n[t] || (n[t] = []), e.forEach((function(t, n) {
				return s.push({
					t: n / (e.length - 1) * 100,
					v: t,
					e: o
				})
			}));
			else
				for (i in e) s = n[i] || (n[i] = []), "ease" === i || s.push({
					t: parseFloat(t),
					v: e[i],
					e: o
				})
		},
		en = function(t, e, n, r, i) {
			return I(t) ? t.call(e, n, r, i) : N(t) && ~t.indexOf("random(") ? ge(t) : t
		},
		nn = vt + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert",
		rn = {};
	bt(nn + ",id,stagger,delay,duration,paused,scrollTrigger", (function(t) {
		return rn[t] = 1
	}));
	var sn = function(t) {
		function e(e, n, r, i) {
			var s;
			"number" == typeof n && (r.duration = n, n = r, r = null);
			var o, a, u, h, d, p, m, g, v = (s = t.call(this, i ? n : Rt(n)) || this).vars,
				_ = v.duration,
				y = v.delay,
				w = v.immediateRender,
				b = v.stagger,
				x = v.overwrite,
				T = v.keyframes,
				S = v.defaults,
				E = v.scrollTrigger,
				k = v.yoyoEase,
				O = n.parent || f,
				C = (V(e) || U(e) ? q(e[0]) : "length" in n) ? [e] : le(e);
			if (s._targets = C.length ? _t(C) : it("GSAP target " + e + " not found. https://gsap.com", !M.nullTargetWarn) || [], s._ptLookup = [], s._overwrite = x, T || b || H(_) || H(y)) {
				if (n = s.vars, (o = s.timeline = new $e({
						data: "nested",
						defaults: S || {},
						targets: O && "nested" === O.data ? O.vars.targets : C
					})).kill(), o.parent = o._dp = l(s), o._start = 0, b || H(_) || H(y)) {
					if (h = C.length, m = b && he(b), Y(b))
						for (d in b) ~nn.indexOf(d) && (g || (g = {}), g[d] = b[d]);
					for (a = 0; a < h; a++)(u = Dt(n, rn)).stagger = 0, k && (u.yoyoEase = k), g && Pt(u, g), p = C[a], u.duration = +en(_, l(s), a, p, C), u.delay = (+en(y, l(s), a, p, C) || 0) - s._delay, !b && 1 === h && u.delay && (s._delay = y = u.delay, s._start += y, u.delay = 0), o.to(p, u, m ? m(a, p, C) : 0), o._ease = Re.none;
					o.duration() ? _ = y = 0 : s.timeline = 0
				} else if (T) {
					Rt(At(o.vars.defaults, {
						ease: "none"
					})), o._ease = Fe(T.ease || n.ease || "none");
					var A, P, L, D = 0;
					if (V(T)) T.forEach((function(t) {
						return o.to(C, t, ">")
					})), o.duration();
					else {
						for (d in u = {}, T) "ease" === d || "easeEach" === d || tn(d, T[d], u, T.easeEach);
						for (d in u)
							for (A = u[d].sort((function(t, e) {
									return t.t - e.t
								})), D = 0, a = 0; a < A.length; a++)(L = {
								ease: (P = A[a]).e,
								duration: (P.t - (a ? A[a - 1].t : 0)) / 100 * _
							})[d] = P.v, o.to(C, L, D), D += L.duration;
						o.duration() < _ && o.to({}, {
							duration: _ - o.duration()
						})
					}
				}
				_ || s.duration(_ = o.duration())
			} else s.timeline = 0;
			return !0 !== x || c || (je = l(s), f.killTweensOf(C), je = 0), $t(O, l(s), r), n.reversed && s.reverse(), n.paused && s.paused(!0), (w || !_ && !T && s._start === Tt(O._time) && X(w) && Ft(l(s)) && "nested" !== O.data) && (s._tTime = -1e-8, s.render(Math.max(0, -y) || 0)), E && jt(l(s), E), s
		}
		u(e, t);
		var n = e.prototype;
		return n.render = function(t, e, n) {
			var r, i, s, o, a, l, u, c, d, f = this._time,
				p = this._tDur,
				m = this._dur,
				g = t < 0,
				v = t > p - A && !g ? p : t < A ? 0 : t;
			if (m) {
				if (v !== this._tTime || !t || n || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== g) {
					if (r = v, c = this.timeline, this._repeat) {
						if (o = m + this._rDelay, this._repeat < -1 && g) return this.totalTime(100 * o + t, e, n);
						if (r = Tt(v % o), v === p ? (s = this._repeat, r = m) : ((s = ~~(v / o)) && s === Tt(v / o) && (r = m, s--), r > m && (r = m)), (l = this._yoyo && 1 & s) && (d = this._yEase, r = m - r), a = Xt(this._tTime, o), r === f && !n && this._initted && s === a) return this._tTime = v, this;
						s !== a && (c && this._yEase && qe(c, l), this.vars.repeatRefresh && !l && !this._lock && this._time !== o && this._initted && (this._lock = n = 1, this.render(Tt(o * s), !0).invalidate()._lock = 0))
					}
					if (!this._initted) {
						if (Gt(this, g ? t : r, n, e, v)) return this._tTime = 0, this;
						if (!(f === this._time || n && this.vars.repeatRefresh && s !== a)) return this;
						if (m !== this._dur) return this.render(t, e, n)
					}
					if (this._tTime = v, this._time = r, !this._act && this._ts && (this._act = 1, this._lazy = 0), this.ratio = u = (d || this._ease)(r / m), this._from && (this.ratio = u = 1 - u), r && !f && !e && !s && (ye(this, "onStart"), this._tTime !== v)) return this;
					for (i = this._pt; i;) i.r(u, i.d), i = i._next;
					c && c.render(t < 0 ? t : c._dur * c._ease(r / this._dur), e, n) || this._startAt && (this._zTime = t), this._onUpdate && !e && (g && qt(this, t, 0, n), ye(this, "onUpdate")), this._repeat && s !== a && this.vars.onRepeat && !e && this.parent && ye(this, "onRepeat"), v !== this._tDur && v || this._tTime !== v || (g && !this._onUpdate && qt(this, t, 0, !0), (t || !m) && (v === this._tDur && this._ts > 0 || !v && this._ts < 0) && Nt(this, 1), e || g && !f || !(v || f || l) || (ye(this, v === p ? "onComplete" : "onReverseComplete", !0), this._prom && !(v < p && this.timeScale() > 0) && this._prom()))
				}
			} else ! function(t, e, n, r) {
				var i, s, o, a = t.ratio,
					l = e < 0 || !e && (!t._start && Qt(t) && (t._initted || !Zt(t)) || (t._ts < 0 || t._dp._ts < 0) && !Zt(t)) ? 0 : 1,
					u = t._rDelay,
					c = 0;
				if (u && t._repeat && (c = ie(0, t._tDur, e), s = Xt(c, u), t._yoyo && 1 & s && (l = 1 - l), s !== Xt(t._tTime, u) && (a = 1 - l, t.vars.repeatRefresh && t._initted && t.invalidate())), l !== a || h || r || t._zTime === A || !e && t._zTime) {
					if (!t._initted && Gt(t, e, r, n, c)) return;
					for (o = t._zTime, t._zTime = e || (n ? A : 0), n || (n = e && !o), t.ratio = l, t._from && (l = 1 - l), t._time = 0, t._tTime = c, i = t._pt; i;) i.r(l, i.d), i = i._next;
					e < 0 && qt(t, e, 0, !0), t._onUpdate && !n && ye(t, "onUpdate"), c && t._repeat && !n && t.parent && ye(t, "onRepeat"), (e >= t._tDur || e < 0) && t.ratio === l && (l && Nt(t, 1), n || h || (ye(t, l ? "onComplete" : "onReverseComplete", !0), t._prom && t._prom()))
				} else t._zTime || (t._zTime = e)
			}(this, t, e, n);
			return this
		}, n.targets = function() {
			return this._targets
		}, n.invalidate = function(e) {
			return (!e || !this.vars.runBackwards) && (this._startAt = 0), this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0, this._ptLookup = [], this.timeline && this.timeline.invalidate(e), t.prototype.invalidate.call(this, e)
		}, n.resetTo = function(t, e, n, r, i) {
			w || Le.wake(), this._ts || this.play();
			var s = Math.min(this._dur, (this._dp._time - this._start) * this._ts);
			return this._initted || Je(this, s),
				function(t, e, n, r, i, s, o, a) {
					var l, u, c, h, d = (t._pt && t._ptCache || (t._ptCache = {}))[e];
					if (!d)
						for (d = t._ptCache[e] = [], c = t._ptLookup, h = t._targets.length; h--;) {
							if ((l = c[h][e]) && l.d && l.d._pt)
								for (l = l.d._pt; l && l.p !== e && l.fp !== e;) l = l._next;
							if (!l) return Ge = 1, t.vars[e] = "+=0", Je(t, o), Ge = 0, a ? it(e + " not eligible for reset") : 1;
							d.push(l)
						}
					for (h = d.length; h--;)(l = (u = d[h])._pt || u).s = !r && 0 !== r || i ? l.s + (r || 0) + s * l.c : r, l.c = n - l.s, u.e && (u.e = xt(n) + se(u.e)), u.b && (u.b = l.s + se(u.b))
				}(this, t, e, n, r, this._ease(s / this._dur), s, i) ? this.resetTo(t, e, n, r, 1) : (Ut(this, 0), this.parent || zt(this._dp, this, "_first", "_last", this._dp._sort ? "_start" : 0), this.render(0))
		}, n.kill = function(t, e) {
			if (void 0 === e && (e = "all"), !(t || e && "all" !== e)) return this._lazy = this._pt = 0, this.parent ? we(this) : this;
			if (this.timeline) {
				var n = this.timeline.totalDuration();
				return this.timeline.killTweensOf(t, e, je && !0 !== je.vars.overwrite)._first || we(this), this.parent && n !== this.timeline.totalDuration() && Kt(this, this._dur * this.timeline._tDur / n, 0, 1), this
			}
			var r, i, s, o, a, l, u, c = this._targets,
				h = t ? le(t) : c,
				d = this._ptLookup,
				f = this._pt;
			if ((!e || "all" === e) && function(t, e) {
					for (var n = t.length, r = n === e.length; r && n-- && t[n] === e[n];);
					return n < 0
				}(c, h)) return "all" === e && (this._pt = 0), we(this);
			for (r = this._op = this._op || [], "all" !== e && (N(e) && (a = {}, bt(e, (function(t) {
					return a[t] = 1
				})), e = a), e = function(t, e) {
					var n, r, i, s, o = t[0] ? yt(t[0]).harness : 0,
						a = o && o.aliases;
					if (!a) return e;
					for (r in n = Pt({}, e), a)
						if (r in n)
							for (i = (s = a[r].split(",")).length; i--;) n[s[i]] = n[r];
					return n
				}(c, e)), u = c.length; u--;)
				if (~h.indexOf(c[u]))
					for (a in i = d[u], "all" === e ? (r[u] = e, o = i, s = {}) : (s = r[u] = r[u] || {}, o = e), o)(l = i && i[a]) && ("kill" in l.d && !0 !== l.d.kill(a) || Bt(this, l, "_pt"), delete i[a]), "all" !== s && (s[a] = 1);
			return this._initted && !this._pt && f && we(this), this
		}, e.to = function(t, n) {
			return new e(t, n, arguments[2])
		}, e.from = function(t, e) {
			return ne(1, arguments)
		}, e.delayedCall = function(t, n, r, i) {
			return new e(n, 0, {
				immediateRender: !1,
				lazy: !1,
				overwrite: !1,
				delay: t,
				onComplete: n,
				onReverseComplete: n,
				onCompleteParams: r,
				onReverseCompleteParams: r,
				callbackScope: i
			})
		}, e.fromTo = function(t, e, n) {
			return ne(2, arguments)
		}, e.set = function(t, n) {
			return n.duration = 0, n.repeatDelay || (n.repeat = 0), new e(t, n)
		}, e.killTweensOf = function(t, e, n) {
			return f.killTweensOf(t, e, n)
		}, e
	}(Ve);
	At(sn.prototype, {
		_targets: [],
		_lazy: 0,
		_startAt: 0,
		_op: 0,
		_onInit: 0
	}), bt("staggerTo,staggerFrom,staggerFromTo", (function(t) {
		sn[t] = function() {
			var e = new $e,
				n = oe.call(arguments, 0);
			return n.splice("staggerFromTo" === t ? 5 : 4, 0, 0), e[t].apply(e, n)
		}
	}));
	var on = function(t, e, n) {
			return t[e] = n
		},
		an = function(t, e, n) {
			return t[e](n)
		},
		ln = function(t, e, n, r) {
			return t[e](r.fp, n)
		},
		un = function(t, e, n) {
			return t.setAttribute(e, n)
		},
		cn = function(t, e) {
			return I(t[e]) ? an : F(t[e]) && t.setAttribute ? un : on
		},
		hn = function(t, e) {
			return e.set(e.t, e.p, Math.round(1e6 * (e.s + e.c * t)) / 1e6, e)
		},
		dn = function(t, e) {
			return e.set(e.t, e.p, !!(e.s + e.c * t), e)
		},
		fn = function(t, e) {
			var n = e._pt,
				r = "";
			if (!t && e.b) r = e.b;
			else if (1 === t && e.e) r = e.e;
			else {
				for (; n;) r = n.p + (n.m ? n.m(n.s + n.c * t) : Math.round(1e4 * (n.s + n.c * t)) / 1e4) + r, n = n._next;
				r += e.c
			}
			e.set(e.t, e.p, r, e)
		},
		pn = function(t, e) {
			for (var n = e._pt; n;) n.r(t, n.d), n = n._next
		},
		mn = function(t, e, n, r) {
			for (var i, s = this._pt; s;) i = s._next, s.p === r && s.modifier(t, e, n), s = i
		},
		gn = function(t) {
			for (var e, n, r = this._pt; r;) n = r._next, r.p === t && !r.op || r.op === t ? Bt(this, r, "_pt") : r.dep || (e = 1), r = n;
			return !e
		},
		vn = function(t, e, n, r) {
			r.mSet(t, e, r.m.call(r.tween, n, r.mt), r)
		},
		_n = function(t) {
			for (var e, n, r, i, s = t._pt; s;) {
				for (e = s._next, n = r; n && n.pr > s.pr;) n = n._next;
				(s._prev = n ? n._prev : i) ? s._prev._next = s: r = s, (s._next = n) ? n._prev = s : i = s, s = e
			}
			t._pt = r
		},
		yn = function() {
			function t(t, e, n, r, i, s, o, a, l) {
				this.t = e, this.s = r, this.c = i, this.p = n, this.r = s || hn, this.d = o || this, this.set = a || on, this.pr = l || 0, this._next = t, t && (t._prev = this)
			}
			return t.prototype.modifier = function(t, e, n) {
				this.mSet = this.mSet || this.set, this.set = vn, this.m = t, this.mt = n, this.tween = e
			}, t
		}();
	bt(vt + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger", (function(t) {
		return ct[t] = 1
	})), tt.TweenMax = tt.TweenLite = sn, tt.TimelineLite = tt.TimelineMax = $e, f = new $e({
		sortChildren: !1,
		defaults: O,
		autoRemoveChildren: !0,
		id: "root",
		smoothChildTiming: !0
	}), M.stringFilter = Pe;
	var wn = [],
		bn = {},
		xn = [],
		Tn = 0,
		Sn = 0,
		En = function(t) {
			return (bn[t] || xn).map((function(t) {
				return t()
			}))
		},
		kn = function() {
			var t = Date.now(),
				e = [];
			t - Tn > 2 && (En("matchMediaInit"), wn.forEach((function(t) {
				var n, r, i, s, o = t.queries,
					a = t.conditions;
				for (r in o)(n = p.matchMedia(o[r]).matches) && (i = 1), n !== a[r] && (a[r] = n, s = 1);
				s && (t.revert(), i && e.push(t))
			})), En("matchMediaRevert"), e.forEach((function(t) {
				return t.onMatch(t, (function(e) {
					return t.add(null, e)
				}))
			})), Tn = t, En("matchMedia"))
		},
		Mn = function() {
			function t(t, e) {
				this.selector = e && ue(e), this.data = [], this._r = [], this.isReverted = !1, this.id = Sn++, t && this.add(t)
			}
			var e = t.prototype;
			return e.add = function(t, e, n) {
				I(t) && (n = e, e = t, t = I);
				var r = this,
					i = function() {
						var t, i = d,
							s = r.selector;
						return i && i !== r && i.data.push(r), n && (r.selector = ue(n)), d = r, t = e.apply(r, arguments), I(t) && r._r.push(t), d = i, r.selector = s, r.isReverted = !1, t
					};
				return r.last = i, t === I ? i(r, (function(t) {
					return r.add(null, t)
				})) : t ? r[t] = i : i
			}, e.ignore = function(t) {
				var e = d;
				d = null, t(this), d = e
			}, e.getTweens = function() {
				var e = [];
				return this.data.forEach((function(n) {
					return n instanceof t ? e.push.apply(e, n.getTweens()) : n instanceof sn && !(n.parent && "nested" === n.parent.data) && e.push(n)
				})), e
			}, e.clear = function() {
				this._r.length = this.data.length = 0
			}, e.kill = function(t, e) {
				var n = this;
				if (t ? function() {
						for (var e, r = n.getTweens(), i = n.data.length; i--;) "isFlip" === (e = n.data[i]).data && (e.revert(), e.getChildren(!0, !0, !1).forEach((function(t) {
							return r.splice(r.indexOf(t), 1)
						})));
						for (r.map((function(t) {
								return {
									g: t._dur || t._delay || t._sat && !t._sat.vars.immediateRender ? t.globalTime(0) : -1 / 0,
									t
								}
							})).sort((function(t, e) {
								return e.g - t.g || -1 / 0
							})).forEach((function(e) {
								return e.t.revert(t)
							})), i = n.data.length; i--;)(e = n.data[i]) instanceof $e ? "nested" !== e.data && (e.scrollTrigger && e.scrollTrigger.revert(), e.kill()) : !(e instanceof sn) && e.revert && e.revert(t);
						n._r.forEach((function(e) {
							return e(t, n)
						})), n.isReverted = !0
					}() : this.data.forEach((function(t) {
						return t.kill && t.kill()
					})), this.clear(), e)
					for (var r = wn.length; r--;) wn[r].id === this.id && wn.splice(r, 1)
			}, e.revert = function(t) {
				this.kill(t || {})
			}, t
		}(),
		On = function() {
			function t(t) {
				this.contexts = [], this.scope = t, d && d.data.push(this)
			}
			var e = t.prototype;
			return e.add = function(t, e, n) {
				Y(t) || (t = {
					matches: t
				});
				var r, i, s, o = new Mn(0, n || this.scope),
					a = o.conditions = {};
				for (i in d && !o.selector && (o.selector = d.selector), this.contexts.push(o), e = o.add("onMatch", e), o.queries = t, t) "all" === i ? s = 1 : (r = p.matchMedia(t[i])) && (wn.indexOf(o) < 0 && wn.push(o), (a[i] = r.matches) && (s = 1), r.addListener ? r.addListener(kn) : r.addEventListener("change", kn));
				return s && e(o, (function(t) {
					return o.add(null, t)
				})), this
			}, e.revert = function(t) {
				this.kill(t || {})
			}, e.kill = function(t) {
				this.contexts.forEach((function(e) {
					return e.kill(t, !0)
				}))
			}, t
		}(),
		Cn = {
			registerPlugin: function() {
				for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++) e[n] = arguments[n];
				e.forEach((function(t) {
					return xe(t)
				}))
			},
			timeline: function(t) {
				return new $e(t)
			},
			getTweensOf: function(t, e) {
				return f.getTweensOf(t, e)
			},
			getProperty: function(t, e, n, r) {
				N(t) && (t = le(t)[0]);
				var i = yt(t || {}).get,
					s = n ? Ct : Ot;
				return "native" === n && (n = ""), t ? e ? s((ft[e] && ft[e].get || i)(t, e, n, r)) : function(e, n, r) {
					return s((ft[e] && ft[e].get || i)(t, e, n, r))
				} : t
			},
			quickSetter: function(t, e, n) {
				if ((t = le(t)).length > 1) {
					var r = t.map((function(t) {
							return Ln.quickSetter(t, e, n)
						})),
						i = r.length;
					return function(t) {
						for (var e = i; e--;) r[e](t)
					}
				}
				t = t[0] || {};
				var s = ft[e],
					o = yt(t),
					a = o.harness && (o.harness.aliases || {})[e] || e,
					l = s ? function(e) {
						var r = new s;
						y._pt = 0, r.init(t, n ? e + n : e, y, 0, [t]), r.render(1, r), y._pt && pn(1, y)
					} : o.set(t, a);
				return s ? l : function(e) {
					return l(t, a, n ? e + n : e, o, 1)
				}
			},
			quickTo: function(t, e, n) {
				var r, i = Ln.to(t, Pt(((r = {})[e] = "+=0.1", r.paused = !0, r), n || {})),
					s = function(t, n, r) {
						return i.resetTo(e, t, n, r)
					};
				return s.tween = i, s
			},
			isTweening: function(t) {
				return f.getTweensOf(t, !0).length > 0
			},
			defaults: function(t) {
				return t && t.ease && (t.ease = Fe(t.ease, O.ease)), Lt(O, t || {})
			},
			config: function(t) {
				return Lt(M, t || {})
			},
			registerEffect: function(t) {
				var e = t.name,
					n = t.effect,
					r = t.plugins,
					i = t.defaults,
					s = t.extendTimeline;
				(r || "").split(",").forEach((function(t) {
					return t && !ft[t] && !tt[t] && it(e + " effect requires " + t + " plugin.")
				})), pt[e] = function(t, e, r) {
					return n(le(t), At(e || {}, i), r)
				}, s && ($e.prototype[e] = function(t, n, r) {
					return this.add(pt[e](t, Y(n) ? n : (r = n) && {}, this), r)
				})
			},
			registerEase: function(t, e) {
				Re[t] = Fe(e)
			},
			parseEase: function(t, e) {
				return arguments.length ? Fe(t, e) : Re
			},
			getById: function(t) {
				return f.getById(t)
			},
			exportRoot: function(t, e) {
				void 0 === t && (t = {});
				var n, r, i = new $e(t);
				for (i.smoothChildTiming = X(t.smoothChildTiming), f.remove(i), i._dp = 0, i._time = i._tTime = f._time, n = f._first; n;) r = n._next, !e && !n._dur && n instanceof sn && n.vars.onComplete === n._targets[0] || $t(i, n, n._start - n._delay), n = r;
				return $t(f, i, 0), i
			},
			context: function(t, e) {
				return t ? new Mn(t, e) : d
			},
			matchMedia: function(t) {
				return new On(t)
			},
			matchMediaRefresh: function() {
				return wn.forEach((function(t) {
					var e, n, r = t.conditions;
					for (n in r) r[n] && (r[n] = !1, e = 1);
					e && t.revert()
				})) || kn()
			},
			addEventListener: function(t, e) {
				var n = bn[t] || (bn[t] = []);
				~n.indexOf(e) || n.push(e)
			},
			removeEventListener: function(t, e) {
				var n = bn[t],
					r = n && n.indexOf(e);
				r >= 0 && n.splice(r, 1)
			},
			utils: {
				wrap: function t(e, n, r) {
					var i = n - e;
					return V(e) ? me(e, t(0, e.length), n) : re(r, (function(t) {
						return (i + (t - e) % i) % i + e
					}))
				},
				wrapYoyo: function t(e, n, r) {
					var i = n - e,
						s = 2 * i;
					return V(e) ? me(e, t(0, e.length - 1), n) : re(r, (function(t) {
						return e + ((t = (s + (t - e) % s) % s || 0) > i ? s - t : t)
					}))
				},
				distribute: he,
				random: pe,
				snap: fe,
				normalize: function(t, e, n) {
					return ve(t, e, 0, 1, n)
				},
				getUnit: se,
				clamp: function(t, e, n) {
					return re(n, (function(n) {
						return ie(t, e, n)
					}))
				},
				splitColor: ke,
				toArray: le,
				selector: ue,
				mapRange: ve,
				pipe: function() {
					for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++) e[n] = arguments[n];
					return function(t) {
						return e.reduce((function(t, e) {
							return e(t)
						}), t)
					}
				},
				unitize: function(t, e) {
					return function(n) {
						return t(parseFloat(n)) + (e || se(n))
					}
				},
				interpolate: function t(e, n, r, i) {
					var s = isNaN(e + n) ? 0 : function(t) {
						return (1 - t) * e + t * n
					};
					if (!s) {
						var o, a, l, u, c, h = N(e),
							d = {};
						if (!0 === r && (i = 1) && (r = null), h) e = {
							p: e
						}, n = {
							p: n
						};
						else if (V(e) && !V(n)) {
							for (l = [], u = e.length, c = u - 2, a = 1; a < u; a++) l.push(t(e[a - 1], e[a]));
							u--, s = function(t) {
								t *= u;
								var e = Math.min(c, ~~t);
								return l[e](t - e)
							}, r = n
						} else i || (e = Pt(V(e) ? [] : {}, e));
						if (!l) {
							for (o in n) Ze.call(d, e, o, "get", n[o]);
							s = function(t) {
								return pn(t, d) || (h ? e.p : e)
							}
						}
					}
					return re(r, s)
				},
				shuffle: ce
			},
			install: nt,
			effects: pt,
			ticker: Le,
			updateRoot: $e.updateRoot,
			plugins: ft,
			globalTimeline: f,
			core: {
				PropTween: yn,
				globals: st,
				Tween: sn,
				Timeline: $e,
				Animation: Ve,
				getCache: yt,
				_removeLinkedListItem: Bt,
				reverting: function() {
					return h
				},
				context: function(t) {
					return t && d && (d.data.push(t), t._ctx = d), d
				},
				suppressOverwrites: function(t) {
					return c = t
				}
			}
		};
	bt("to,from,fromTo,delayedCall,set,killTweensOf", (function(t) {
		return Cn[t] = sn[t]
	})), Le.add($e.updateRoot), y = Cn.to({}, {
		duration: 0
	});
	var An = function(t, e) {
			for (var n = t._pt; n && n.p !== e && n.op !== e && n.fp !== e;) n = n._next;
			return n
		},
		Pn = function(t, e) {
			return {
				name: t,
				rawVars: 1,
				init: function(t, n, r) {
					r._onInit = function(t) {
						var r, i;
						if (N(n) && (r = {}, bt(n, (function(t) {
								return r[t] = 1
							})), n = r), e) {
							for (i in r = {}, n) r[i] = e(n[i]);
							n = r
						}! function(t, e) {
							var n, r, i, s = t._targets;
							for (n in e)
								for (r = s.length; r--;)(i = t._ptLookup[r][n]) && (i = i.d) && (i._pt && (i = An(i, n)), i && i.modifier && i.modifier(e[n], t, s[r], n))
						}(t, n)
					}
				}
			}
		},
		Ln = Cn.registerPlugin({
			name: "attr",
			init: function(t, e, n, r, i) {
				var s, o, a;
				for (s in this.tween = n, e) a = t.getAttribute(s) || "", (o = this.add(t, "setAttribute", (a || 0) + "", e[s], r, i, 0, 0, s)).op = s, o.b = a, this._props.push(s)
			},
			render: function(t, e) {
				for (var n = e._pt; n;) h ? n.set(n.t, n.p, n.b, n) : n.r(t, n.d), n = n._next
			}
		}, {
			name: "endArray",
			init: function(t, e) {
				for (var n = e.length; n--;) this.add(t, n, t[n] || 0, e[n], 0, 0, 0, 0, 0, 1)
			}
		}, Pn("roundProps", de), Pn("modifiers"), Pn("snap", fe)) || Cn;
	sn.version = $e.version = Ln.version = "3.12.5", v = 1, W() && De(), Re.Power0, Re.Power1, Re.Power2, Re.Power3, Re.Power4, Re.Linear, Re.Quad, Re.Cubic, Re.Quart, Re.Quint, Re.Strong, Re.Elastic, Re.Back, Re.SteppedEase, Re.Bounce, Re.Sine, Re.Expo, Re.Circ;
	var Dn, Rn, zn, Bn, Nn, In, qn, Fn, Yn = {},
		Xn = 180 / Math.PI,
		Wn = Math.PI / 180,
		Hn = Math.atan2,
		Un = /([A-Z])/g,
		Vn = /(left|right|width|margin|padding|x)/i,
		$n = /[\s,\(]\S/,
		jn = {
			autoAlpha: "opacity,visibility",
			scale: "scaleX,scaleY",
			alpha: "opacity"
		},
		Gn = function(t, e) {
			return e.set(e.t, e.p, Math.round(1e4 * (e.s + e.c * t)) / 1e4 + e.u, e)
		},
		Qn = function(t, e) {
			return e.set(e.t, e.p, 1 === t ? e.e : Math.round(1e4 * (e.s + e.c * t)) / 1e4 + e.u, e)
		},
		Zn = function(t, e) {
			return e.set(e.t, e.p, t ? Math.round(1e4 * (e.s + e.c * t)) / 1e4 + e.u : e.b, e)
		},
		Kn = function(t, e) {
			var n = e.s + e.c * t;
			e.set(e.t, e.p, ~~(n + (n < 0 ? -.5 : .5)) + e.u, e)
		},
		Jn = function(t, e) {
			return e.set(e.t, e.p, t ? e.e : e.b, e)
		},
		tr = function(t, e) {
			return e.set(e.t, e.p, 1 !== t ? e.b : e.e, e)
		},
		er = function(t, e, n) {
			return t.style[e] = n
		},
		nr = function(t, e, n) {
			return t.style.setProperty(e, n)
		},
		rr = function(t, e, n) {
			return t._gsap[e] = n
		},
		ir = function(t, e, n) {
			return t._gsap.scaleX = t._gsap.scaleY = n
		},
		sr = function(t, e, n, r, i) {
			var s = t._gsap;
			s.scaleX = s.scaleY = n, s.renderTransform(i, s)
		},
		or = function(t, e, n, r, i) {
			var s = t._gsap;
			s[e] = n, s.renderTransform(i, s)
		},
		ar = "transform",
		lr = ar + "Origin",
		ur = function t(e, n) {
			var r = this,
				i = this.target,
				s = i.style,
				o = i._gsap;
			if (e in Yn && s) {
				if (this.tfm = this.tfm || {}, "transform" === e) return jn.transform.split(",").forEach((function(e) {
					return t.call(r, e, n)
				}));
				if (~(e = jn[e] || e).indexOf(",") ? e.split(",").forEach((function(t) {
						return r.tfm[t] = Mr(i, t)
					})) : this.tfm[e] = o.x ? o[e] : Mr(i, e), e === lr && (this.tfm.zOrigin = o.zOrigin), this.props.indexOf(ar) >= 0) return;
				o.svg && (this.svgo = i.getAttribute("data-svg-origin"), this.props.push(lr, n, "")), e = ar
			}(s || n) && this.props.push(e, n, s[e])
		},
		cr = function(t) {
			t.translate && (t.removeProperty("translate"), t.removeProperty("scale"), t.removeProperty("rotate"))
		},
		hr = function() {
			var t, e, n = this.props,
				r = this.target,
				i = r.style,
				s = r._gsap;
			for (t = 0; t < n.length; t += 3) n[t + 1] ? r[n[t]] = n[t + 2] : n[t + 2] ? i[n[t]] = n[t + 2] : i.removeProperty("--" === n[t].substr(0, 2) ? n[t] : n[t].replace(Un, "-$1").toLowerCase());
			if (this.tfm) {
				for (e in this.tfm) s[e] = this.tfm[e];
				s.svg && (s.renderTransform(), r.setAttribute("data-svg-origin", this.svgo || "")), (t = qn()) && t.isStart || i[ar] || (cr(i), s.zOrigin && i[lr] && (i[lr] += " " + s.zOrigin + "px", s.zOrigin = 0, s.renderTransform()), s.uncache = 1)
			}
		},
		dr = function(t, e) {
			var n = {
				target: t,
				props: [],
				revert: hr,
				save: ur
			};
			return t._gsap || Ln.core.getCache(t), e && e.split(",").forEach((function(t) {
				return n.save(t)
			})), n
		},
		fr = function(t, e) {
			var n = Rn.createElementNS ? Rn.createElementNS((e || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), t) : Rn.createElement(t);
			return n && n.style ? n : Rn.createElement(t)
		},
		pr = function t(e, n, r) {
			var i = getComputedStyle(e);
			return i[n] || i.getPropertyValue(n.replace(Un, "-$1").toLowerCase()) || i.getPropertyValue(n) || !r && t(e, gr(n) || n, 1) || ""
		},
		mr = "O,Moz,ms,Ms,Webkit".split(","),
		gr = function(t, e, n) {
			var r = (e || Nn).style,
				i = 5;
			if (t in r && !n) return t;
			for (t = t.charAt(0).toUpperCase() + t.substr(1); i-- && !(mr[i] + t in r););
			return i < 0 ? null : (3 === i ? "ms" : i >= 0 ? mr[i] : "") + t
		},
		vr = function() {
			"undefined" != typeof window && window.document && (Dn = window, Rn = Dn.document, zn = Rn.documentElement, Nn = fr("div") || {
				style: {}
			}, fr("div"), ar = gr(ar), lr = ar + "Origin", Nn.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0", Fn = !!gr("perspective"), qn = Ln.core.reverting, Bn = 1)
		},
		_r = function t(e) {
			var n, r = fr("svg", this.ownerSVGElement && this.ownerSVGElement.getAttribute("xmlns") || "http://www.w3.org/2000/svg"),
				i = this.parentNode,
				s = this.nextSibling,
				o = this.style.cssText;
			if (zn.appendChild(r), r.appendChild(this), this.style.display = "block", e) try {
				n = this.getBBox(), this._gsapBBox = this.getBBox, this.getBBox = t
			} catch (t) {} else this._gsapBBox && (n = this._gsapBBox());
			return i && (s ? i.insertBefore(this, s) : i.appendChild(this)), zn.removeChild(r), this.style.cssText = o, n
		},
		yr = function(t, e) {
			for (var n = e.length; n--;)
				if (t.hasAttribute(e[n])) return t.getAttribute(e[n])
		},
		wr = function(t) {
			var e;
			try {
				e = t.getBBox()
			} catch (n) {
				e = _r.call(t, !0)
			}
			return e && (e.width || e.height) || t.getBBox === _r || (e = _r.call(t, !0)), !e || e.width || e.x || e.y ? e : {
				x: +yr(t, ["x", "cx", "x1"]) || 0,
				y: +yr(t, ["y", "cy", "y1"]) || 0,
				width: 0,
				height: 0
			}
		},
		br = function(t) {
			return !(!t.getCTM || t.parentNode && !t.ownerSVGElement || !wr(t))
		},
		xr = function(t, e) {
			if (e) {
				var n, r = t.style;
				e in Yn && e !== lr && (e = ar), r.removeProperty ? ("ms" !== (n = e.substr(0, 2)) && "webkit" !== e.substr(0, 6) || (e = "-" + e), r.removeProperty("--" === n ? e : e.replace(Un, "-$1").toLowerCase())) : r.removeAttribute(e)
			}
		},
		Tr = function(t, e, n, r, i, s) {
			var o = new yn(t._pt, e, n, 0, 1, s ? tr : Jn);
			return t._pt = o, o.b = r, o.e = i, t._props.push(n), o
		},
		Sr = {
			deg: 1,
			rad: 1,
			turn: 1
		},
		Er = {
			grid: 1,
			flex: 1
		},
		kr = function t(e, n, r, i) {
			var s, o, a, l, u = parseFloat(r) || 0,
				c = (r + "").trim().substr((u + "").length) || "px",
				h = Nn.style,
				d = Vn.test(n),
				f = "svg" === e.tagName.toLowerCase(),
				p = (f ? "client" : "offset") + (d ? "Width" : "Height"),
				m = 100,
				g = "px" === i,
				v = "%" === i;
			if (i === c || !u || Sr[i] || Sr[c]) return u;
			if ("px" !== c && !g && (u = t(e, n, r, "px")), l = e.getCTM && br(e), (v || "%" === c) && (Yn[n] || ~n.indexOf("adius"))) return s = l ? e.getBBox()[d ? "width" : "height"] : e[p], xt(v ? u / s * m : u / 100 * s);
			if (h[d ? "width" : "height"] = m + (g ? c : i), o = ~n.indexOf("adius") || "em" === i && e.appendChild && !f ? e : e.parentNode, l && (o = (e.ownerSVGElement || {}).parentNode), o && o !== Rn && o.appendChild || (o = Rn.body), (a = o._gsap) && v && a.width && d && a.time === Le.time && !a.uncache) return xt(u / a.width * m);
			if (!v || "height" !== n && "width" !== n)(v || "%" === c) && !Er[pr(o, "display")] && (h.position = pr(e, "position")), o === e && (h.position = "static"), o.appendChild(Nn), s = Nn[p], o.removeChild(Nn), h.position = "absolute";
			else {
				var _ = e.style[n];
				e.style[n] = m + i, s = e[p], _ ? e.style[n] = _ : xr(e, n)
			}
			return d && v && ((a = yt(o)).time = Le.time, a.width = o[p]), xt(g ? s * u / m : s && u ? m / s * u : 0)
		},
		Mr = function(t, e, n, r) {
			var i;
			return Bn || vr(), e in jn && "transform" !== e && ~(e = jn[e]).indexOf(",") && (e = e.split(",")[0]), Yn[e] && "transform" !== e ? (i = Ir(t, r), i = "transformOrigin" !== e ? i[e] : i.svg ? i.origin : qr(pr(t, lr)) + " " + i.zOrigin + "px") : (!(i = t.style[e]) || "auto" === i || r || ~(i + "").indexOf("calc(")) && (i = Pr[e] && Pr[e](t, e, n) || pr(t, e) || wt(t, e) || ("opacity" === e ? 1 : 0)), n && !~(i + "").trim().indexOf(" ") ? kr(t, e, i, n) + n : i
		},
		Or = function(t, e, n, r) {
			if (!n || "none" === n) {
				var i = gr(e, t, 1),
					s = i && pr(t, i, 1);
				s && s !== n ? (e = i, n = s) : "borderColor" === e && (n = pr(t, "borderTopColor"))
			}
			var o, a, l, u, c, h, d, f, p, m, g, v = new yn(this._pt, t.style, e, 0, 1, fn),
				_ = 0,
				y = 0;
			if (v.b = n, v.e = r, n += "", "auto" == (r += "") && (h = t.style[e], t.style[e] = r, r = pr(t, e) || r, h ? t.style[e] = h : xr(t, e)), Pe(o = [n, r]), r = o[1], l = (n = o[0]).match(G) || [], (r.match(G) || []).length) {
				for (; a = G.exec(r);) d = a[0], p = r.substring(_, a.index), c ? c = (c + 1) % 5 : "rgba(" !== p.substr(-5) && "hsla(" !== p.substr(-5) || (c = 1), d !== (h = l[y++] || "") && (u = parseFloat(h) || 0, g = h.substr((u + "").length), "=" === d.charAt(1) && (d = St(u, d) + g), f = parseFloat(d), m = d.substr((f + "").length), _ = G.lastIndex - m.length, m || (m = m || M.units[e] || g, _ === r.length && (r += m, v.e += m)), g !== m && (u = kr(t, e, h, m) || 0), v._pt = {
					_next: v._pt,
					p: p || 1 === y ? p : ",",
					s: u,
					c: f - u,
					m: c && c < 4 || "zIndex" === e ? Math.round : 0
				});
				v.c = _ < r.length ? r.substring(_, r.length) : ""
			} else v.r = "display" === e && "none" === r ? tr : Jn;
			return Z.test(r) && (v.e = 0), this._pt = v, v
		},
		Cr = {
			top: "0%",
			bottom: "100%",
			left: "0%",
			right: "100%",
			center: "50%"
		},
		Ar = function(t, e) {
			if (e.tween && e.tween._time === e.tween._dur) {
				var n, r, i, s = e.t,
					o = s.style,
					a = e.u,
					l = s._gsap;
				if ("all" === a || !0 === a) o.cssText = "", r = 1;
				else
					for (i = (a = a.split(",")).length; --i > -1;) n = a[i], Yn[n] && (r = 1, n = "transformOrigin" === n ? lr : ar), xr(s, n);
				r && (xr(s, ar), l && (l.svg && s.removeAttribute("transform"), Ir(s, 1), l.uncache = 1, cr(o)))
			}
		},
		Pr = {
			clearProps: function(t, e, n, r, i) {
				if ("isFromStart" !== i.data) {
					var s = t._pt = new yn(t._pt, e, n, 0, 0, Ar);
					return s.u = r, s.pr = -10, s.tween = i, t._props.push(n), 1
				}
			}
		},
		Lr = [1, 0, 0, 1, 0, 0],
		Dr = {},
		Rr = function(t) {
			return "matrix(1, 0, 0, 1, 0, 0)" === t || "none" === t || !t
		},
		zr = function(t) {
			var e = pr(t, ar);
			return Rr(e) ? Lr : e.substr(7).match(j).map(xt)
		},
		Br = function(t, e) {
			var n, r, i, s, o = t._gsap || yt(t),
				a = t.style,
				l = zr(t);
			return o.svg && t.getAttribute("transform") ? "1,0,0,1,0,0" === (l = [(i = t.transform.baseVal.consolidate().matrix).a, i.b, i.c, i.d, i.e, i.f]).join(",") ? Lr : l : (l !== Lr || t.offsetParent || t === zn || o.svg || (i = a.display, a.display = "block", (n = t.parentNode) && t.offsetParent || (s = 1, r = t.nextElementSibling, zn.appendChild(t)), l = zr(t), i ? a.display = i : xr(t, "display"), s && (r ? n.insertBefore(t, r) : n ? n.appendChild(t) : zn.removeChild(t))), e && l.length > 6 ? [l[0], l[1], l[4], l[5], l[12], l[13]] : l)
		},
		Nr = function(t, e, n, r, i, s) {
			var o, a, l, u = t._gsap,
				c = i || Br(t, !0),
				h = u.xOrigin || 0,
				d = u.yOrigin || 0,
				f = u.xOffset || 0,
				p = u.yOffset || 0,
				m = c[0],
				g = c[1],
				v = c[2],
				_ = c[3],
				y = c[4],
				w = c[5],
				b = e.split(" "),
				x = parseFloat(b[0]) || 0,
				T = parseFloat(b[1]) || 0;
			n ? c !== Lr && (a = m * _ - g * v) && (l = x * (-g / a) + T * (m / a) - (m * w - g * y) / a, x = x * (_ / a) + T * (-v / a) + (v * w - _ * y) / a, T = l) : (x = (o = wr(t)).x + (~b[0].indexOf("%") ? x / 100 * o.width : x), T = o.y + (~(b[1] || b[0]).indexOf("%") ? T / 100 * o.height : T)), r || !1 !== r && u.smooth ? (y = x - h, w = T - d, u.xOffset = f + (y * m + w * v) - y, u.yOffset = p + (y * g + w * _) - w) : u.xOffset = u.yOffset = 0, u.xOrigin = x, u.yOrigin = T, u.smooth = !!r, u.origin = e, u.originIsAbsolute = !!n, t.style[lr] = "0px 0px", s && (Tr(s, u, "xOrigin", h, x), Tr(s, u, "yOrigin", d, T), Tr(s, u, "xOffset", f, u.xOffset), Tr(s, u, "yOffset", p, u.yOffset)), t.setAttribute("data-svg-origin", x + " " + T)
		},
		Ir = function(t, e) {
			var n = t._gsap || new Ue(t);
			if ("x" in n && !e && !n.uncache) return n;
			var r, i, s, o, a, l, u, c, h, d, f, p, m, g, v, _, y, w, b, x, T, S, E, k, O, C, A, P, L, D, R, z, B = t.style,
				N = n.scaleX < 0,
				I = "px",
				q = "deg",
				F = getComputedStyle(t),
				Y = pr(t, lr) || "0";
			return r = i = s = l = u = c = h = d = f = 0, o = a = 1, n.svg = !(!t.getCTM || !br(t)), F.translate && ("none" === F.translate && "none" === F.scale && "none" === F.rotate || (B[ar] = ("none" !== F.translate ? "translate3d(" + (F.translate + " 0 0").split(" ").slice(0, 3).join(", ") + ") " : "") + ("none" !== F.rotate ? "rotate(" + F.rotate + ") " : "") + ("none" !== F.scale ? "scale(" + F.scale.split(" ").join(",") + ") " : "") + ("none" !== F[ar] ? F[ar] : "")), B.scale = B.rotate = B.translate = "none"), g = Br(t, n.svg), n.svg && (n.uncache ? (O = t.getBBox(), Y = n.xOrigin - O.x + "px " + (n.yOrigin - O.y) + "px", k = "") : k = !e && t.getAttribute("data-svg-origin"), Nr(t, k || Y, !!k || n.originIsAbsolute, !1 !== n.smooth, g)), p = n.xOrigin || 0, m = n.yOrigin || 0, g !== Lr && (w = g[0], b = g[1], x = g[2], T = g[3], r = S = g[4], i = E = g[5], 6 === g.length ? (o = Math.sqrt(w * w + b * b), a = Math.sqrt(T * T + x * x), l = w || b ? Hn(b, w) * Xn : 0, (h = x || T ? Hn(x, T) * Xn + l : 0) && (a *= Math.abs(Math.cos(h * Wn))), n.svg && (r -= p - (p * w + m * x), i -= m - (p * b + m * T))) : (z = g[6], D = g[7], A = g[8], P = g[9], L = g[10], R = g[11], r = g[12], i = g[13], s = g[14], u = (v = Hn(z, L)) * Xn, v && (k = S * (_ = Math.cos(-v)) + A * (y = Math.sin(-v)), O = E * _ + P * y, C = z * _ + L * y, A = S * -y + A * _, P = E * -y + P * _, L = z * -y + L * _, R = D * -y + R * _, S = k, E = O, z = C), c = (v = Hn(-x, L)) * Xn, v && (_ = Math.cos(-v), R = T * (y = Math.sin(-v)) + R * _, w = k = w * _ - A * y, b = O = b * _ - P * y, x = C = x * _ - L * y), l = (v = Hn(b, w)) * Xn, v && (k = w * (_ = Math.cos(v)) + b * (y = Math.sin(v)), O = S * _ + E * y, b = b * _ - w * y, E = E * _ - S * y, w = k, S = O), u && Math.abs(u) + Math.abs(l) > 359.9 && (u = l = 0, c = 180 - c), o = xt(Math.sqrt(w * w + b * b + x * x)), a = xt(Math.sqrt(E * E + z * z)), v = Hn(S, E), h = Math.abs(v) > 2e-4 ? v * Xn : 0, f = R ? 1 / (R < 0 ? -R : R) : 0), n.svg && (k = t.getAttribute("transform"), n.forceCSS = t.setAttribute("transform", "") || !Rr(pr(t, ar)), k && t.setAttribute("transform", k))), Math.abs(h) > 90 && Math.abs(h) < 270 && (N ? (o *= -1, h += l <= 0 ? 180 : -180, l += l <= 0 ? 180 : -180) : (a *= -1, h += h <= 0 ? 180 : -180)), e = e || n.uncache, n.x = r - ((n.xPercent = r && (!e && n.xPercent || (Math.round(t.offsetWidth / 2) === Math.round(-r) ? -50 : 0))) ? t.offsetWidth * n.xPercent / 100 : 0) + I, n.y = i - ((n.yPercent = i && (!e && n.yPercent || (Math.round(t.offsetHeight / 2) === Math.round(-i) ? -50 : 0))) ? t.offsetHeight * n.yPercent / 100 : 0) + I, n.z = s + I, n.scaleX = xt(o), n.scaleY = xt(a), n.rotation = xt(l) + q, n.rotationX = xt(u) + q, n.rotationY = xt(c) + q, n.skewX = h + q, n.skewY = d + q, n.transformPerspective = f + I, (n.zOrigin = parseFloat(Y.split(" ")[2]) || !e && n.zOrigin || 0) && (B[lr] = qr(Y)), n.xOffset = n.yOffset = 0, n.force3D = M.force3D, n.renderTransform = n.svg ? Vr : Fn ? Ur : Yr, n.uncache = 0, n
		},
		qr = function(t) {
			return (t = t.split(" "))[0] + " " + t[1]
		},
		Fr = function(t, e, n) {
			var r = se(e);
			return xt(parseFloat(e) + parseFloat(kr(t, "x", n + "px", r))) + r
		},
		Yr = function(t, e) {
			e.z = "0px", e.rotationY = e.rotationX = "0deg", e.force3D = 0, Ur(t, e)
		},
		Xr = "0deg",
		Wr = "0px",
		Hr = ") ",
		Ur = function(t, e) {
			var n = e || this,
				r = n.xPercent,
				i = n.yPercent,
				s = n.x,
				o = n.y,
				a = n.z,
				l = n.rotation,
				u = n.rotationY,
				c = n.rotationX,
				h = n.skewX,
				d = n.skewY,
				f = n.scaleX,
				p = n.scaleY,
				m = n.transformPerspective,
				g = n.force3D,
				v = n.target,
				_ = n.zOrigin,
				y = "",
				w = "auto" === g && t && 1 !== t || !0 === g;
			if (_ && (c !== Xr || u !== Xr)) {
				var b, x = parseFloat(u) * Wn,
					T = Math.sin(x),
					S = Math.cos(x);
				x = parseFloat(c) * Wn, b = Math.cos(x), s = Fr(v, s, T * b * -_), o = Fr(v, o, -Math.sin(x) * -_), a = Fr(v, a, S * b * -_ + _)
			}
			m !== Wr && (y += "perspective(" + m + Hr), (r || i) && (y += "translate(" + r + "%, " + i + "%) "), (w || s !== Wr || o !== Wr || a !== Wr) && (y += a !== Wr || w ? "translate3d(" + s + ", " + o + ", " + a + ") " : "translate(" + s + ", " + o + Hr), l !== Xr && (y += "rotate(" + l + Hr), u !== Xr && (y += "rotateY(" + u + Hr), c !== Xr && (y += "rotateX(" + c + Hr), h === Xr && d === Xr || (y += "skew(" + h + ", " + d + Hr), 1 === f && 1 === p || (y += "scale(" + f + ", " + p + Hr), v.style[ar] = y || "translate(0, 0)"
		},
		Vr = function(t, e) {
			var n, r, i, s, o, a = e || this,
				l = a.xPercent,
				u = a.yPercent,
				c = a.x,
				h = a.y,
				d = a.rotation,
				f = a.skewX,
				p = a.skewY,
				m = a.scaleX,
				g = a.scaleY,
				v = a.target,
				_ = a.xOrigin,
				y = a.yOrigin,
				w = a.xOffset,
				b = a.yOffset,
				x = a.forceCSS,
				T = parseFloat(c),
				S = parseFloat(h);
			d = parseFloat(d), f = parseFloat(f), (p = parseFloat(p)) && (f += p = parseFloat(p), d += p), d || f ? (d *= Wn, f *= Wn, n = Math.cos(d) * m, r = Math.sin(d) * m, i = Math.sin(d - f) * -g, s = Math.cos(d - f) * g, f && (p *= Wn, o = Math.tan(f - p), i *= o = Math.sqrt(1 + o * o), s *= o, p && (o = Math.tan(p), n *= o = Math.sqrt(1 + o * o), r *= o)), n = xt(n), r = xt(r), i = xt(i), s = xt(s)) : (n = m, s = g, r = i = 0), (T && !~(c + "").indexOf("px") || S && !~(h + "").indexOf("px")) && (T = kr(v, "x", c, "px"), S = kr(v, "y", h, "px")), (_ || y || w || b) && (T = xt(T + _ - (_ * n + y * i) + w), S = xt(S + y - (_ * r + y * s) + b)), (l || u) && (o = v.getBBox(), T = xt(T + l / 100 * o.width), S = xt(S + u / 100 * o.height)), o = "matrix(" + n + "," + r + "," + i + "," + s + "," + T + "," + S + ")", v.setAttribute("transform", o), x && (v.style[ar] = o)
		},
		$r = function(t, e, n, r, i) {
			var s, o, a = 360,
				l = N(i),
				u = parseFloat(i) * (l && ~i.indexOf("rad") ? Xn : 1) - r,
				c = r + u + "deg";
			return l && ("short" === (s = i.split("_")[1]) && (u %= a) != u % 180 && (u += u < 0 ? a : -360), "cw" === s && u < 0 ? u = (u + 36e9) % a - ~~(u / a) * a : "ccw" === s && u > 0 && (u = (u - 36e9) % a - ~~(u / a) * a)), t._pt = o = new yn(t._pt, e, n, r, u, Qn), o.e = c, o.u = "deg", t._props.push(n), o
		},
		jr = function(t, e) {
			for (var n in e) t[n] = e[n];
			return t
		},
		Gr = function(t, e, n) {
			var r, i, s, o, a, l, u, c = jr({}, n._gsap),
				h = n.style;
			for (i in c.svg ? (s = n.getAttribute("transform"), n.setAttribute("transform", ""), h[ar] = e, r = Ir(n, 1), xr(n, ar), n.setAttribute("transform", s)) : (s = getComputedStyle(n)[ar], h[ar] = e, r = Ir(n, 1), h[ar] = s), Yn)(s = c[i]) !== (o = r[i]) && "perspective,force3D,transformOrigin,svgOrigin".indexOf(i) < 0 && (a = se(s) !== (u = se(o)) ? kr(n, i, s, u) : parseFloat(s), l = parseFloat(o), t._pt = new yn(t._pt, r, i, a, l - a, Gn), t._pt.u = u || 0, t._props.push(i));
			jr(r, c)
		};
	bt("padding,margin,Width,Radius", (function(t, e) {
		var n = "Top",
			r = "Right",
			i = "Bottom",
			s = "Left",
			o = (e < 3 ? [n, r, i, s] : [n + s, n + r, i + r, i + s]).map((function(n) {
				return e < 2 ? t + n : "border" + n + t
			}));
		Pr[e > 1 ? "border" + t : t] = function(t, e, n, r, i) {
			var s, a;
			if (arguments.length < 4) return s = o.map((function(e) {
				return Mr(t, e, n)
			})), 5 === (a = s.join(" ")).split(s[0]).length ? s[0] : a;
			s = (r + "").split(" "), a = {}, o.forEach((function(t, e) {
				return a[t] = s[e] = s[e] || s[(e - 1) / 2 | 0]
			})), t.init(e, a, i)
		}
	}));
	var Qr, Zr, Kr = {
		name: "css",
		register: vr,
		targetTest: function(t) {
			return t.style && t.nodeType
		},
		init: function(t, e, n, r, i) {
			var s, o, a, l, u, c, h, d, f, p, m, g, v, _, y, w, b, x, T, S, E = this._props,
				k = t.style,
				O = n.vars.startAt;
			for (h in Bn || vr(), this.styles = this.styles || dr(t), w = this.styles.props, this.tween = n, e)
				if ("autoRound" !== h && (o = e[h], !ft[h] || !Ke(h, e, n, r, t, i)))
					if (u = typeof o, c = Pr[h], "function" === u && (u = typeof(o = o.call(n, r, t, i))), "string" === u && ~o.indexOf("random(") && (o = ge(o)), c) c(this, t, h, o, n) && (y = 1);
					else if ("--" === h.substr(0, 2)) s = (getComputedStyle(t).getPropertyValue(h) + "").trim(), o += "", Ce.lastIndex = 0, Ce.test(s) || (d = se(s), f = se(o)), f ? d !== f && (s = kr(t, h, s, f) + f) : d && (o += d), this.add(k, "setProperty", s, o, r, i, 0, 0, h), E.push(h), w.push(h, 0, k[h]);
			else if ("undefined" !== u) {
				if (O && h in O ? (s = "function" == typeof O[h] ? O[h].call(n, r, t, i) : O[h], N(s) && ~s.indexOf("random(") && (s = ge(s)), se(s + "") || "auto" === s || (s += M.units[h] || se(Mr(t, h)) || ""), "=" === (s + "").charAt(1) && (s = Mr(t, h))) : s = Mr(t, h), l = parseFloat(s), (p = "string" === u && "=" === o.charAt(1) && o.substr(0, 2)) && (o = o.substr(2)), a = parseFloat(o), h in jn && ("autoAlpha" === h && (1 === l && "hidden" === Mr(t, "visibility") && a && (l = 0), w.push("visibility", 0, k.visibility), Tr(this, k, "visibility", l ? "inherit" : "hidden", a ? "inherit" : "hidden", !a)), "scale" !== h && "transform" !== h && ~(h = jn[h]).indexOf(",") && (h = h.split(",")[0])), m = h in Yn)
					if (this.styles.save(h), g || ((v = t._gsap).renderTransform && !e.parseTransform || Ir(t, e.parseTransform), _ = !1 !== e.smoothOrigin && v.smooth, (g = this._pt = new yn(this._pt, k, ar, 0, 1, v.renderTransform, v, 0, -1)).dep = 1), "scale" === h) this._pt = new yn(this._pt, v, "scaleY", v.scaleY, (p ? St(v.scaleY, p + a) : a) - v.scaleY || 0, Gn), this._pt.u = 0, E.push("scaleY", h), h += "X";
					else {
						if ("transformOrigin" === h) {
							w.push(lr, 0, k[lr]), x = void 0, T = void 0, S = void 0, T = (x = (b = o).split(" "))[0], S = x[1] || "50%", "top" !== T && "bottom" !== T && "left" !== S && "right" !== S || (b = T, T = S, S = b), x[0] = Cr[T] || T, x[1] = Cr[S] || S, o = x.join(" "), v.svg ? Nr(t, o, 0, _, 0, this) : ((f = parseFloat(o.split(" ")[2]) || 0) !== v.zOrigin && Tr(this, v, "zOrigin", v.zOrigin, f), Tr(this, k, h, qr(s), qr(o)));
							continue
						}
						if ("svgOrigin" === h) {
							Nr(t, o, 1, _, 0, this);
							continue
						}
						if (h in Dr) {
							$r(this, v, h, l, p ? St(l, p + o) : o);
							continue
						}
						if ("smoothOrigin" === h) {
							Tr(this, v, "smooth", v.smooth, o);
							continue
						}
						if ("force3D" === h) {
							v[h] = o;
							continue
						}
						if ("transform" === h) {
							Gr(this, o, t);
							continue
						}
					}
				else h in k || (h = gr(h) || h);
				if (m || (a || 0 === a) && (l || 0 === l) && !$n.test(o) && h in k) a || (a = 0), (d = (s + "").substr((l + "").length)) !== (f = se(o) || (h in M.units ? M.units[h] : d)) && (l = kr(t, h, s, f)), this._pt = new yn(this._pt, m ? v : k, h, l, (p ? St(l, p + a) : a) - l, m || "px" !== f && "zIndex" !== h || !1 === e.autoRound ? Gn : Kn), this._pt.u = f || 0, d !== f && "%" !== f && (this._pt.b = s, this._pt.r = Zn);
				else if (h in k) Or.call(this, t, h, s, p ? p + o : o);
				else if (h in t) this.add(t, h, s || t[h], p ? p + o : o, r, i);
				else if ("parseTransform" !== h) {
					rt(h, o);
					continue
				}
				m || (h in k ? w.push(h, 0, k[h]) : w.push(h, 1, s || t[h])), E.push(h)
			}
			y && _n(this)
		},
		render: function(t, e) {
			if (e.tween._time || !qn())
				for (var n = e._pt; n;) n.r(t, n.d), n = n._next;
			else e.styles.revert()
		},
		get: Mr,
		aliases: jn,
		getSetter: function(t, e, n) {
			var r = jn[e];
			return r && r.indexOf(",") < 0 && (e = r), e in Yn && e !== lr && (t._gsap.x || Mr(t, "x")) ? n && In === n ? "scale" === e ? ir : rr : (In = n || {}) && ("scale" === e ? sr : or) : t.style && !F(t.style[e]) ? er : ~e.indexOf("-") ? nr : cn(t, e)
		},
		core: {
			_removeProperty: xr,
			_getMatrix: Br
		}
	};
	Ln.utils.checkPrefix = gr, Ln.core.getStyleSaver = dr, Zr = bt("x,y,z,scale,scaleX,scaleY,xPercent,yPercent" + "," + (Qr = "rotation,rotationX,rotationY,skewX,skewY") + ",transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", (function(t) {
		Yn[t] = 1
	})), bt(Qr, (function(t) {
		M.units[t] = "deg", Dr[t] = 1
	})), jn[Zr[13]] = "x,y,z,scale,scaleX,scaleY,xPercent,yPercent," + Qr, bt("0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY", (function(t) {
		var e = t.split(":");
		jn[e[1]] = Zr[e[0]]
	})), bt("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", (function(t) {
		M.units[t] = "px"
	})), Ln.registerPlugin(Kr);
	var Jr = Ln.registerPlugin(Kr) || Ln;

	function ti(t, e) {
		for (var n = 0; n < e.length; n++) {
			var r = e[n];
			r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
		}
	}
	Jr.core.Tween;
	var ei, ni, ri, ii, si, oi, ai, li, ui, ci, hi, di, fi, pi = function() {
			return ei || "undefined" != typeof window && (ei = window.gsap) && ei.registerPlugin && ei
		},
		mi = 1,
		gi = [],
		vi = [],
		_i = [],
		yi = Date.now,
		wi = function(t, e) {
			return e
		},
		bi = function(t, e) {
			return ~_i.indexOf(t) && _i[_i.indexOf(t) + 1][e]
		},
		xi = function(t) {
			return !!~ci.indexOf(t)
		},
		Ti = function(t, e, n, r, i) {
			return t.addEventListener(e, n, {
				passive: !1 !== r,
				capture: !!i
			})
		},
		Si = function(t, e, n, r) {
			return t.removeEventListener(e, n, !!r)
		},
		Ei = "scrollLeft",
		ki = "scrollTop",
		Mi = function() {
			return hi && hi.isPressed || vi.cache++
		},
		Oi = function(t, e) {
			var n = function n(r) {
				if (r || 0 === r) {
					mi && (ri.history.scrollRestoration = "manual");
					var i = hi && hi.isPressed;
					r = n.v = Math.round(r) || (hi && hi.iOS ? 1 : 0), t(r), n.cacheID = vi.cache, i && wi("ss", r)
				} else(e || vi.cache !== n.cacheID || wi("ref")) && (n.cacheID = vi.cache, n.v = t());
				return n.v + n.offset
			};
			return n.offset = 0, t && n
		},
		Ci = {
			s: Ei,
			p: "left",
			p2: "Left",
			os: "right",
			os2: "Right",
			d: "width",
			d2: "Width",
			a: "x",
			sc: Oi((function(t) {
				return arguments.length ? ri.scrollTo(t, Ai.sc()) : ri.pageXOffset || ii[Ei] || si[Ei] || oi[Ei] || 0
			}))
		},
		Ai = {
			s: ki,
			p: "top",
			p2: "Top",
			os: "bottom",
			os2: "Bottom",
			d: "height",
			d2: "Height",
			a: "y",
			op: Ci,
			sc: Oi((function(t) {
				return arguments.length ? ri.scrollTo(Ci.sc(), t) : ri.pageYOffset || ii[ki] || si[ki] || oi[ki] || 0
			}))
		},
		Pi = function(t, e) {
			return (e && e._ctx && e._ctx.selector || ei.utils.toArray)(t)[0] || ("string" == typeof t && !1 !== ei.config().nullTargetWarn ? console.warn("Element not found:", t) : null)
		},
		Li = function(t, e) {
			var n = e.s,
				r = e.sc;
			xi(t) && (t = ii.scrollingElement || si);
			var i = vi.indexOf(t),
				s = r === Ai.sc ? 1 : 2;
			!~i && (i = vi.push(t) - 1), vi[i + s] || Ti(t, "scroll", Mi);
			var o = vi[i + s],
				a = o || (vi[i + s] = Oi(bi(t, n), !0) || (xi(t) ? r : Oi((function(e) {
					return arguments.length ? t[n] = e : t[n]
				}))));
			return a.target = t, o || (a.smooth = "smooth" === ei.getProperty(t, "scrollBehavior")), a
		},
		Di = function(t, e, n) {
			var r = t,
				i = t,
				s = yi(),
				o = s,
				a = e || 50,
				l = Math.max(500, 3 * a),
				u = function(t, e) {
					var l = yi();
					e || l - s > a ? (i = r, r = t, o = s, s = l) : n ? r += t : r = i + (t - i) / (l - o) * (s - o)
				};
			return {
				update: u,
				reset: function() {
					i = r = n ? 0 : r, o = s = 0
				},
				getVelocity: function(t) {
					var e = o,
						a = i,
						c = yi();
					return (t || 0 === t) && t !== r && u(t), s === o || c - o > l ? 0 : (r + (n ? a : -a)) / ((n ? c : s) - e) * 1e3
				}
			}
		},
		Ri = function(t, e) {
			return e && !t._gsapAllow && t.preventDefault(), t.changedTouches ? t.changedTouches[0] : t
		},
		zi = function(t) {
			var e = Math.max.apply(Math, t),
				n = Math.min.apply(Math, t);
			return Math.abs(e) >= Math.abs(n) ? e : n
		},
		Bi = function() {
			var t, e, n, r;
			(ui = ei.core.globals().ScrollTrigger) && ui.core && (t = ui.core, e = t.bridge || {}, n = t._scrollers, r = t._proxies, n.push.apply(n, vi), r.push.apply(r, _i), vi = n, _i = r, wi = function(t, n) {
				return e[t](n)
			})
		},
		Ni = function(t) {
			return ei = t || pi(), !ni && ei && "undefined" != typeof document && document.body && (ri = window, ii = document, si = ii.documentElement, oi = ii.body, ci = [ri, ii, si, oi], ei.utils.clamp, fi = ei.core.context || function() {}, li = "onpointerenter" in oi ? "pointer" : "mouse", ai = Ii.isTouch = ri.matchMedia && ri.matchMedia("(hover: none), (pointer: coarse)").matches ? 1 : "ontouchstart" in ri || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0 ? 2 : 0, di = Ii.eventTypes = ("ontouchstart" in si ? "touchstart,touchmove,touchcancel,touchend" : "onpointerdown" in si ? "pointerdown,pointermove,pointercancel,pointerup" : "mousedown,mousemove,mouseup,mouseup").split(","), setTimeout((function() {
				return mi = 0
			}), 500), Bi(), ni = 1), ni
		};
	Ci.op = Ai, vi.cache = 0;
	var Ii = function() {
		function t(t) {
			this.init(t)
		}
		var e, n;
		return t.prototype.init = function(t) {
			ni || Ni(ei) || console.warn("Please gsap.registerPlugin(Observer)"), ui || Bi();
			var e = t.tolerance,
				n = t.dragMinimum,
				r = t.type,
				i = t.target,
				s = t.lineHeight,
				o = t.debounce,
				a = t.preventDefault,
				l = t.onStop,
				u = t.onStopDelay,
				c = t.ignore,
				h = t.wheelSpeed,
				d = t.event,
				f = t.onDragStart,
				p = t.onDragEnd,
				m = t.onDrag,
				g = t.onPress,
				v = t.onRelease,
				_ = t.onRight,
				y = t.onLeft,
				w = t.onUp,
				b = t.onDown,
				x = t.onChangeX,
				T = t.onChangeY,
				S = t.onChange,
				E = t.onToggleX,
				k = t.onToggleY,
				M = t.onHover,
				O = t.onHoverEnd,
				C = t.onMove,
				A = t.ignoreCheck,
				P = t.isNormalizer,
				L = t.onGestureStart,
				D = t.onGestureEnd,
				R = t.onWheel,
				z = t.onEnable,
				B = t.onDisable,
				N = t.onClick,
				I = t.scrollSpeed,
				q = t.capture,
				F = t.allowClicks,
				Y = t.lockAxis,
				X = t.onLockAxis;
			this.target = i = Pi(i) || si, this.vars = t, c && (c = ei.utils.toArray(c)), e = e || 1e-9, n = n || 0, h = h || 1, I = I || 1, r = r || "wheel,touch,pointer", o = !1 !== o, s || (s = parseFloat(ri.getComputedStyle(oi).lineHeight) || 22);
			var W, H, U, V, $, j, G, Q = this,
				Z = 0,
				K = 0,
				J = t.passive || !a,
				tt = Li(i, Ci),
				et = Li(i, Ai),
				nt = tt(),
				rt = et(),
				it = ~r.indexOf("touch") && !~r.indexOf("pointer") && "pointerdown" === di[0],
				st = xi(i),
				ot = i.ownerDocument || ii,
				at = [0, 0, 0],
				lt = [0, 0, 0],
				ut = 0,
				ct = function() {
					return ut = yi()
				},
				ht = function(t, e) {
					return (Q.event = t) && c && ~c.indexOf(t.target) || e && it && "touch" !== t.pointerType || A && A(t, e)
				},
				dt = function() {
					var t = Q.deltaX = zi(at),
						n = Q.deltaY = zi(lt),
						r = Math.abs(t) >= e,
						i = Math.abs(n) >= e;
					S && (r || i) && S(Q, t, n, at, lt), r && (_ && Q.deltaX > 0 && _(Q), y && Q.deltaX < 0 && y(Q), x && x(Q), E && Q.deltaX < 0 != Z < 0 && E(Q), Z = Q.deltaX, at[0] = at[1] = at[2] = 0), i && (b && Q.deltaY > 0 && b(Q), w && Q.deltaY < 0 && w(Q), T && T(Q), k && Q.deltaY < 0 != K < 0 && k(Q), K = Q.deltaY, lt[0] = lt[1] = lt[2] = 0), (V || U) && (C && C(Q), U && (m(Q), U = !1), V = !1), j && !(j = !1) && X && X(Q), $ && (R(Q), $ = !1), W = 0
				},
				ft = function(t, e, n) {
					at[n] += t, lt[n] += e, Q._vx.update(t), Q._vy.update(e), o ? W || (W = requestAnimationFrame(dt)) : dt()
				},
				pt = function(t, e) {
					Y && !G && (Q.axis = G = Math.abs(t) > Math.abs(e) ? "x" : "y", j = !0), "y" !== G && (at[2] += t, Q._vx.update(t, !0)), "x" !== G && (lt[2] += e, Q._vy.update(e, !0)), o ? W || (W = requestAnimationFrame(dt)) : dt()
				},
				mt = function(t) {
					if (!ht(t, 1)) {
						var e = (t = Ri(t, a)).clientX,
							r = t.clientY,
							i = e - Q.x,
							s = r - Q.y,
							o = Q.isDragging;
						Q.x = e, Q.y = r, (o || Math.abs(Q.startX - e) >= n || Math.abs(Q.startY - r) >= n) && (m && (U = !0), o || (Q.isDragging = !0), pt(i, s), o || f && f(Q))
					}
				},
				gt = Q.onPress = function(t) {
					ht(t, 1) || t && t.button || (Q.axis = G = null, H.pause(), Q.isPressed = !0, t = Ri(t), Z = K = 0, Q.startX = Q.x = t.clientX, Q.startY = Q.y = t.clientY, Q._vx.reset(), Q._vy.reset(), Ti(P ? i : ot, di[1], mt, J, !0), Q.deltaX = Q.deltaY = 0, g && g(Q))
				},
				vt = Q.onRelease = function(t) {
					if (!ht(t, 1)) {
						Si(P ? i : ot, di[1], mt, !0);
						var e = !isNaN(Q.y - Q.startY),
							n = Q.isDragging,
							r = n && (Math.abs(Q.x - Q.startX) > 3 || Math.abs(Q.y - Q.startY) > 3),
							s = Ri(t);
						!r && e && (Q._vx.reset(), Q._vy.reset(), a && F && ei.delayedCall(.08, (function() {
							if (yi() - ut > 300 && !t.defaultPrevented)
								if (t.target.click) t.target.click();
								else if (ot.createEvent) {
								var e = ot.createEvent("MouseEvents");
								e.initMouseEvent("click", !0, !0, ri, 1, s.screenX, s.screenY, s.clientX, s.clientY, !1, !1, !1, !1, 0, null), t.target.dispatchEvent(e)
							}
						}))), Q.isDragging = Q.isGesturing = Q.isPressed = !1, l && n && !P && H.restart(!0), p && n && p(Q), v && v(Q, r)
					}
				},
				_t = function(t) {
					return t.touches && t.touches.length > 1 && (Q.isGesturing = !0) && L(t, Q.isDragging)
				},
				yt = function() {
					return (Q.isGesturing = !1) || D(Q)
				},
				wt = function(t) {
					if (!ht(t)) {
						var e = tt(),
							n = et();
						ft((e - nt) * I, (n - rt) * I, 1), nt = e, rt = n, l && H.restart(!0)
					}
				},
				bt = function(t) {
					if (!ht(t)) {
						t = Ri(t, a), R && ($ = !0);
						var e = (1 === t.deltaMode ? s : 2 === t.deltaMode ? ri.innerHeight : 1) * h;
						ft(t.deltaX * e, t.deltaY * e, 0), l && !P && H.restart(!0)
					}
				},
				xt = function(t) {
					if (!ht(t)) {
						var e = t.clientX,
							n = t.clientY,
							r = e - Q.x,
							i = n - Q.y;
						Q.x = e, Q.y = n, V = !0, l && H.restart(!0), (r || i) && pt(r, i)
					}
				},
				Tt = function(t) {
					Q.event = t, M(Q)
				},
				St = function(t) {
					Q.event = t, O(Q)
				},
				Et = function(t) {
					return ht(t) || Ri(t, a) && N(Q)
				};
			H = Q._dc = ei.delayedCall(u || .25, (function() {
				Q._vx.reset(), Q._vy.reset(), H.pause(), l && l(Q)
			})).pause(), Q.deltaX = Q.deltaY = 0, Q._vx = Di(0, 50, !0), Q._vy = Di(0, 50, !0), Q.scrollX = tt, Q.scrollY = et, Q.isDragging = Q.isGesturing = Q.isPressed = !1, fi(this), Q.enable = function(t) {
				return Q.isEnabled || (Ti(st ? ot : i, "scroll", Mi), r.indexOf("scroll") >= 0 && Ti(st ? ot : i, "scroll", wt, J, q), r.indexOf("wheel") >= 0 && Ti(i, "wheel", bt, J, q), (r.indexOf("touch") >= 0 && ai || r.indexOf("pointer") >= 0) && (Ti(i, di[0], gt, J, q), Ti(ot, di[2], vt), Ti(ot, di[3], vt), F && Ti(i, "click", ct, !0, !0), N && Ti(i, "click", Et), L && Ti(ot, "gesturestart", _t), D && Ti(ot, "gestureend", yt), M && Ti(i, li + "enter", Tt), O && Ti(i, li + "leave", St), C && Ti(i, li + "move", xt)), Q.isEnabled = !0, t && t.type && gt(t), z && z(Q)), Q
			}, Q.disable = function() {
				Q.isEnabled && (gi.filter((function(t) {
					return t !== Q && xi(t.target)
				})).length || Si(st ? ot : i, "scroll", Mi), Q.isPressed && (Q._vx.reset(), Q._vy.reset(), Si(P ? i : ot, di[1], mt, !0)), Si(st ? ot : i, "scroll", wt, q), Si(i, "wheel", bt, q), Si(i, di[0], gt, q), Si(ot, di[2], vt), Si(ot, di[3], vt), Si(i, "click", ct, !0), Si(i, "click", Et), Si(ot, "gesturestart", _t), Si(ot, "gestureend", yt), Si(i, li + "enter", Tt), Si(i, li + "leave", St), Si(i, li + "move", xt), Q.isEnabled = Q.isPressed = Q.isDragging = !1, B && B(Q))
			}, Q.kill = Q.revert = function() {
				Q.disable();
				var t = gi.indexOf(Q);
				t >= 0 && gi.splice(t, 1), hi === Q && (hi = 0)
			}, gi.push(Q), P && xi(i) && (hi = Q), Q.enable(d)
		}, e = t, (n = [{
			key: "velocityX",
			get: function() {
				return this._vx.getVelocity()
			}
		}, {
			key: "velocityY",
			get: function() {
				return this._vy.getVelocity()
			}
		}]) && ti(e.prototype, n), t
	}();
	Ii.version = "3.12.5", Ii.create = function(t) {
		return new Ii(t)
	}, Ii.register = Ni, Ii.getAll = function() {
		return gi.slice()
	}, Ii.getById = function(t) {
		return gi.filter((function(e) {
			return e.vars.id === t
		}))[0]
	}, pi() && ei.registerPlugin(Ii);
	var qi, Fi, Yi, Xi, Wi, Hi, Ui, Vi, $i, ji, Gi, Qi, Zi, Ki, Ji, ts, es, ns, rs, is, ss, os, as, ls, us, cs, hs, ds, fs, ps, ms, gs, vs, _s, ys, ws, bs, xs, Ts = 1,
		Ss = Date.now,
		Es = Ss(),
		ks = 0,
		Ms = 0,
		Os = function(t, e, n) {
			var r = Xs(t) && ("clamp(" === t.substr(0, 6) || t.indexOf("max") > -1);
			return n["_" + e + "Clamp"] = r, r ? t.substr(6, t.length - 7) : t
		},
		Cs = function(t, e) {
			return !e || Xs(t) && "clamp(" === t.substr(0, 6) ? t : "clamp(" + t + ")"
		},
		As = function t() {
			return Ms && requestAnimationFrame(t)
		},
		Ps = function() {
			return Ki = 1
		},
		Ls = function() {
			return Ki = 0
		},
		Ds = function(t) {
			return t
		},
		Rs = function(t) {
			return Math.round(1e5 * t) / 1e5 || 0
		},
		zs = function() {
			return "undefined" != typeof window
		},
		Bs = function() {
			return qi || zs() && (qi = window.gsap) && qi.registerPlugin && qi
		},
		Ns = function(t) {
			return !!~Ui.indexOf(t)
		},
		Is = function(t) {
			return ("Height" === t ? ms : Yi["inner" + t]) || Wi["client" + t] || Hi["client" + t]
		},
		qs = function(t) {
			return bi(t, "getBoundingClientRect") || (Ns(t) ? function() {
				return Jo.width = Yi.innerWidth, Jo.height = ms, Jo
			} : function() {
				return ho(t)
			})
		},
		Fs = function(t, e) {
			var n = e.s,
				r = e.d2,
				i = e.d,
				s = e.a;
			return Math.max(0, (n = "scroll" + r) && (s = bi(t, n)) ? s() - qs(t)()[i] : Ns(t) ? (Wi[n] || Hi[n]) - Is(r) : t[n] - t["offset" + r])
		},
		Ys = function(t, e) {
			for (var n = 0; n < rs.length; n += 3)(!e || ~e.indexOf(rs[n + 1])) && t(rs[n], rs[n + 1], rs[n + 2])
		},
		Xs = function(t) {
			return "string" == typeof t
		},
		Ws = function(t) {
			return "function" == typeof t
		},
		Hs = function(t) {
			return "number" == typeof t
		},
		Us = function(t) {
			return "object" == typeof t
		},
		Vs = function(t, e, n) {
			return t && t.progress(e ? 0 : 1) && n && t.pause()
		},
		$s = function(t, e) {
			if (t.enabled) {
				var n = t._ctx ? t._ctx.add((function() {
					return e(t)
				})) : e(t);
				n && n.totalTime && (t.callbackAnimation = n)
			}
		},
		js = Math.abs,
		Gs = "left",
		Qs = "right",
		Zs = "bottom",
		Ks = "width",
		Js = "height",
		to = "Right",
		eo = "Left",
		no = "Top",
		ro = "Bottom",
		io = "padding",
		so = "margin",
		oo = "Width",
		ao = "Height",
		lo = "px",
		uo = function(t) {
			return Yi.getComputedStyle(t)
		},
		co = function(t, e) {
			for (var n in e) n in t || (t[n] = e[n]);
			return t
		},
		ho = function(t, e) {
			var n = e && "matrix(1, 0, 0, 1, 0, 0)" !== uo(t)[Ji] && qi.to(t, {
					x: 0,
					y: 0,
					xPercent: 0,
					yPercent: 0,
					rotation: 0,
					rotationX: 0,
					rotationY: 0,
					scale: 1,
					skewX: 0,
					skewY: 0
				}).progress(1),
				r = t.getBoundingClientRect();
			return n && n.progress(0).kill(), r
		},
		fo = function(t, e) {
			var n = e.d2;
			return t["offset" + n] || t["client" + n] || 0
		},
		po = function(t) {
			var e, n = [],
				r = t.labels,
				i = t.duration();
			for (e in r) n.push(r[e] / i);
			return n
		},
		mo = function(t) {
			var e = qi.utils.snap(t),
				n = Array.isArray(t) && t.slice(0).sort((function(t, e) {
					return t - e
				}));
			return n ? function(t, r, i) {
				var s;
				if (void 0 === i && (i = .001), !r) return e(t);
				if (r > 0) {
					for (t -= i, s = 0; s < n.length; s++)
						if (n[s] >= t) return n[s];
					return n[s - 1]
				}
				for (s = n.length, t += i; s--;)
					if (n[s] <= t) return n[s];
				return n[0]
			} : function(n, r, i) {
				void 0 === i && (i = .001);
				var s = e(n);
				return !r || Math.abs(s - n) < i || s - n < 0 == r < 0 ? s : e(r < 0 ? n - t : n + t)
			}
		},
		go = function(t, e, n, r) {
			return n.split(",").forEach((function(n) {
				return t(e, n, r)
			}))
		},
		vo = function(t, e, n, r, i) {
			return t.addEventListener(e, n, {
				passive: !r,
				capture: !!i
			})
		},
		_o = function(t, e, n, r) {
			return t.removeEventListener(e, n, !!r)
		},
		yo = function(t, e, n) {
			(n = n && n.wheelHandler) && (t(e, "wheel", n), t(e, "touchmove", n))
		},
		wo = {
			startColor: "green",
			endColor: "red",
			indent: 0,
			fontSize: "16px",
			fontWeight: "normal"
		},
		bo = {
			toggleActions: "play",
			anticipatePin: 0
		},
		xo = {
			top: 0,
			left: 0,
			center: .5,
			bottom: 1,
			right: 1
		},
		To = function(t, e) {
			if (Xs(t)) {
				var n = t.indexOf("="),
					r = ~n ? +(t.charAt(n - 1) + 1) * parseFloat(t.substr(n + 1)) : 0;
				~n && (t.indexOf("%") > n && (r *= e / 100), t = t.substr(0, n - 1)), t = r + (t in xo ? xo[t] * e : ~t.indexOf("%") ? parseFloat(t) * e / 100 : parseFloat(t) || 0)
			}
			return t
		},
		So = function(t, e, n, r, i, s, o, a) {
			var l = i.startColor,
				u = i.endColor,
				c = i.fontSize,
				h = i.indent,
				d = i.fontWeight,
				f = Xi.createElement("div"),
				p = Ns(n) || "fixed" === bi(n, "pinType"),
				m = -1 !== t.indexOf("scroller"),
				g = p ? Hi : n,
				v = -1 !== t.indexOf("start"),
				_ = v ? l : u,
				y = "border-color:" + _ + ";font-size:" + c + ";color:" + _ + ";font-weight:" + d + ";pointer-events:none;white-space:nowrap;font-family:sans-serif,Arial;z-index:1000;padding:4px 8px;border-width:0;border-style:solid;";
			return y += "position:" + ((m || a) && p ? "fixed;" : "absolute;"), (m || a || !p) && (y += (r === Ai ? Qs : Zs) + ":" + (s + parseFloat(h)) + "px;"), o && (y += "box-sizing:border-box;text-align:left;width:" + o.offsetWidth + "px;"), f._isStart = v, f.setAttribute("class", "gsap-marker-" + t + (e ? " marker-" + e : "")), f.style.cssText = y, f.innerText = e || 0 === e ? t + "-" + e : t, g.children[0] ? g.insertBefore(f, g.children[0]) : g.appendChild(f), f._offset = f["offset" + r.op.d2], Eo(f, 0, r, v), f
		},
		Eo = function(t, e, n, r) {
			var i = {
					display: "block"
				},
				s = n[r ? "os2" : "p2"],
				o = n[r ? "p2" : "os2"];
			t._isFlipped = r, i[n.a + "Percent"] = r ? -100 : 0, i[n.a] = r ? "1px" : 0, i["border" + s + oo] = 1, i["border" + o + oo] = 0, i[n.p] = e + "px", qi.set(t, i)
		},
		ko = [],
		Mo = {},
		Oo = function() {
			return Ss() - ks > 34 && (ys || (ys = requestAnimationFrame(Vo)))
		},
		Co = function() {
			(!as || !as.isPressed || as.startX > Hi.clientWidth) && (vi.cache++, as ? ys || (ys = requestAnimationFrame(Vo)) : Vo(), ks || zo("scrollStart"), ks = Ss())
		},
		Ao = function() {
			cs = Yi.innerWidth, us = Yi.innerHeight
		},
		Po = function() {
			vi.cache++, !Zi && !os && !Xi.fullscreenElement && !Xi.webkitFullscreenElement && (!ls || cs !== Yi.innerWidth || Math.abs(Yi.innerHeight - us) > .25 * Yi.innerHeight) && Vi.restart(!0)
		},
		Lo = {},
		Do = [],
		Ro = function t() {
			return _o(oa, "scrollEnd", t) || Wo(!0)
		},
		zo = function(t) {
			return Lo[t] && Lo[t].map((function(t) {
				return t()
			})) || Do
		},
		Bo = [],
		No = function(t) {
			for (var e = 0; e < Bo.length; e += 5)(!t || Bo[e + 4] && Bo[e + 4].query === t) && (Bo[e].style.cssText = Bo[e + 1], Bo[e].getBBox && Bo[e].setAttribute("transform", Bo[e + 2] || ""), Bo[e + 3].uncache = 1)
		},
		Io = function(t, e) {
			var n;
			for (ts = 0; ts < ko.length; ts++) !(n = ko[ts]) || e && n._ctx !== e || (t ? n.kill(1) : n.revert(!0, !0));
			gs = !0, e && No(e), e || zo("revert")
		},
		qo = function(t, e) {
			vi.cache++, (e || !ws) && vi.forEach((function(t) {
				return Ws(t) && t.cacheID++ && (t.rec = 0)
			})), Xs(t) && (Yi.history.scrollRestoration = fs = t)
		},
		Fo = 0,
		Yo = function() {
			Hi.appendChild(ps), ms = !as && ps.offsetHeight || Yi.innerHeight, Hi.removeChild(ps)
		},
		Xo = function(t) {
			return $i(".gsap-marker-start, .gsap-marker-end, .gsap-marker-scroller-start, .gsap-marker-scroller-end").forEach((function(e) {
				return e.style.display = t ? "none" : "block"
			}))
		},
		Wo = function(t, e) {
			if (!ks || t || gs) {
				Yo(), ws = oa.isRefreshing = !0, vi.forEach((function(t) {
					return Ws(t) && ++t.cacheID && (t.rec = t())
				}));
				var n = zo("refreshInit");
				is && oa.sort(), e || Io(), vi.forEach((function(t) {
					Ws(t) && (t.smooth && (t.target.style.scrollBehavior = "auto"), t(0))
				})), ko.slice(0).forEach((function(t) {
					return t.refresh()
				})), gs = !1, ko.forEach((function(t) {
					if (t._subPinOffset && t.pin) {
						var e = t.vars.horizontal ? "offsetWidth" : "offsetHeight",
							n = t.pin[e];
						t.revert(!0, 1), t.adjustPinSpacing(t.pin[e] - n), t.refresh()
					}
				})), vs = 1, Xo(!0), ko.forEach((function(t) {
					var e = Fs(t.scroller, t._dir),
						n = "max" === t.vars.end || t._endClamp && t.end > e,
						r = t._startClamp && t.start >= e;
					(n || r) && t.setPositions(r ? e - 1 : t.start, n ? Math.max(r ? e : t.start + 1, e) : t.end, !0)
				})), Xo(!1), vs = 0, n.forEach((function(t) {
					return t && t.render && t.render(-1)
				})), vi.forEach((function(t) {
					Ws(t) && (t.smooth && requestAnimationFrame((function() {
						return t.target.style.scrollBehavior = "smooth"
					})), t.rec && t(t.rec))
				})), qo(fs, 1), Vi.pause(), Fo++, ws = 2, Vo(2), ko.forEach((function(t) {
					return Ws(t.vars.onRefresh) && t.vars.onRefresh(t)
				})), ws = oa.isRefreshing = !1, zo("refresh")
			} else vo(oa, "scrollEnd", Ro)
		},
		Ho = 0,
		Uo = 1,
		Vo = function(t) {
			if (2 === t || !ws && !gs) {
				oa.isUpdating = !0, xs && xs.update(0);
				var e = ko.length,
					n = Ss(),
					r = n - Es >= 50,
					i = e && ko[0].scroll();
				if (Uo = Ho > i ? -1 : 1, ws || (Ho = i), r && (ks && !Ki && n - ks > 200 && (ks = 0, zo("scrollEnd")), Gi = Es, Es = n), Uo < 0) {
					for (ts = e; ts-- > 0;) ko[ts] && ko[ts].update(0, r);
					Uo = 1
				} else
					for (ts = 0; ts < e; ts++) ko[ts] && ko[ts].update(0, r);
				oa.isUpdating = !1
			}
			ys = 0
		},
		$o = [Gs, "top", Zs, Qs, so + ro, so + to, so + no, so + eo, "display", "flexShrink", "float", "zIndex", "gridColumnStart", "gridColumnEnd", "gridRowStart", "gridRowEnd", "gridArea", "justifySelf", "alignSelf", "placeSelf", "order"],
		jo = $o.concat([Ks, Js, "boxSizing", "max" + oo, "max" + ao, "position", so, io, io + no, io + to, io + ro, io + eo]),
		Go = function(t, e, n, r) {
			if (!t._gsap.swappedIn) {
				for (var i, s = $o.length, o = e.style, a = t.style; s--;) o[i = $o[s]] = n[i];
				o.position = "absolute" === n.position ? "absolute" : "relative", "inline" === n.display && (o.display = "inline-block"), a[Zs] = a[Qs] = "auto", o.flexBasis = n.flexBasis || "auto", o.overflow = "visible", o.boxSizing = "border-box", o[Ks] = fo(t, Ci) + lo, o[Js] = fo(t, Ai) + lo, o[io] = a[so] = a.top = a[Gs] = "0", Zo(r), a[Ks] = a["max" + oo] = n[Ks], a[Js] = a["max" + ao] = n[Js], a[io] = n[io], t.parentNode !== e && (t.parentNode.insertBefore(e, t), e.appendChild(t)), t._gsap.swappedIn = !0
			}
		},
		Qo = /([A-Z])/g,
		Zo = function(t) {
			if (t) {
				var e, n, r = t.t.style,
					i = t.length,
					s = 0;
				for ((t.t._gsap || qi.core.getCache(t.t)).uncache = 1; s < i; s += 2) n = t[s + 1], e = t[s], n ? r[e] = n : r[e] && r.removeProperty(e.replace(Qo, "-$1").toLowerCase())
			}
		},
		Ko = function(t) {
			for (var e = jo.length, n = t.style, r = [], i = 0; i < e; i++) r.push(jo[i], n[jo[i]]);
			return r.t = t, r
		},
		Jo = {
			left: 0,
			top: 0
		},
		ta = function(t, e, n, r, i, s, o, a, l, u, c, h, d, f) {
			Ws(t) && (t = t(a)), Xs(t) && "max" === t.substr(0, 3) && (t = h + ("=" === t.charAt(4) ? To("0" + t.substr(3), n) : 0));
			var p, m, g, v = d ? d.time() : 0;
			if (d && d.seek(0), isNaN(t) || (t = +t), Hs(t)) d && (t = qi.utils.mapRange(d.scrollTrigger.start, d.scrollTrigger.end, 0, h, t)), o && Eo(o, n, r, !0);
			else {
				Ws(e) && (e = e(a));
				var _, y, w, b, x = (t || "0").split(" ");
				g = Pi(e, a) || Hi, (_ = ho(g) || {}) && (_.left || _.top) || "none" !== uo(g).display || (b = g.style.display, g.style.display = "block", _ = ho(g), b ? g.style.display = b : g.style.removeProperty("display")), y = To(x[0], _[r.d]), w = To(x[1] || "0", n), t = _[r.p] - l[r.p] - u + y + i - w, o && Eo(o, w, r, n - w < 20 || o._isStart && w > 20), n -= n - w
			}
			if (f && (a[f] = t || -.001, t < 0 && (t = 0)), s) {
				var T = t + n,
					S = s._isStart;
				p = "scroll" + r.d2, Eo(s, T, r, S && T > 20 || !S && (c ? Math.max(Hi[p], Wi[p]) : s.parentNode[p]) <= T + 1), c && (l = ho(o), c && (s.style[r.op.p] = l[r.op.p] - r.op.m - s._offset + lo))
			}
			return d && g && (p = ho(g), d.seek(h), m = ho(g), d._caScrollDist = p[r.p] - m[r.p], t = t / d._caScrollDist * h), d && d.seek(v), d ? t : Math.round(t)
		},
		ea = /(webkit|moz|length|cssText|inset)/i,
		na = function(t, e, n, r) {
			if (t.parentNode !== e) {
				var i, s, o = t.style;
				if (e === Hi) {
					for (i in t._stOrig = o.cssText, s = uo(t)) + i || ea.test(i) || !s[i] || "string" != typeof o[i] || "0" === i || (o[i] = s[i]);
					o.top = n, o.left = r
				} else o.cssText = t._stOrig;
				qi.core.getCache(t).uncache = 1, e.appendChild(t)
			}
		},
		ra = function(t, e, n) {
			var r = e,
				i = r;
			return function(e) {
				var s = Math.round(t());
				return s !== r && s !== i && Math.abs(s - r) > 3 && Math.abs(s - i) > 3 && (e = s, n && n()), i = r, r = e, e
			}
		},
		ia = function(t, e, n) {
			var r = {};
			r[e.p] = "+=" + n, qi.set(t, r)
		},
		sa = function(t, e) {
			var n = Li(t, e),
				r = "_scroll" + e.p2,
				i = function e(i, s, o, a, l) {
					var u = e.tween,
						c = s.onComplete,
						h = {};
					o = o || n();
					var d = ra(n, o, (function() {
						u.kill(), e.tween = 0
					}));
					return l = a && l || 0, a = a || i - o, u && u.kill(), s[r] = i, s.inherit = !1, s.modifiers = h, h[r] = function() {
						return d(o + a * u.ratio + l * u.ratio * u.ratio)
					}, s.onUpdate = function() {
						vi.cache++, e.tween && Vo()
					}, s.onComplete = function() {
						e.tween = 0, c && c.call(u)
					}, u = e.tween = qi.to(t, s)
				};
			return t[r] = n, n.wheelHandler = function() {
				return i.tween && i.tween.kill() && (i.tween = 0)
			}, vo(t, "wheel", n.wheelHandler), oa.isTouch && vo(t, "touchmove", n.wheelHandler), i
		},
		oa = function() {
			function t(e, n) {
				Fi || t.register(qi) || console.warn("Please gsap.registerPlugin(ScrollTrigger)"), ds(this), this.init(e, n)
			}
			return t.prototype.init = function(e, n) {
				if (this.progress = this.start = 0, this.vars && this.kill(!0, !0), Ms) {
					var r, i, s, o, a, l, u, c, h, d, f, p, m, g, v, _, y, w, b, x, T, S, E, k, M, O, C, A, P, L, D, R, z, B, N, I, q, F, Y, X, W, H, U = e = co(Xs(e) || Hs(e) || e.nodeType ? {
							trigger: e
						} : e, bo),
						V = U.onUpdate,
						$ = U.toggleClass,
						j = U.id,
						G = U.onToggle,
						Q = U.onRefresh,
						Z = U.scrub,
						K = U.trigger,
						J = U.pin,
						tt = U.pinSpacing,
						et = U.invalidateOnRefresh,
						nt = U.anticipatePin,
						rt = U.onScrubComplete,
						it = U.onSnapComplete,
						st = U.once,
						ot = U.snap,
						at = U.pinReparent,
						lt = U.pinSpacer,
						ut = U.containerAnimation,
						ct = U.fastScrollEnd,
						ht = U.preventOverlaps,
						dt = e.horizontal || e.containerAnimation && !1 !== e.horizontal ? Ci : Ai,
						ft = !Z && 0 !== Z,
						pt = Pi(e.scroller || Yi),
						mt = qi.core.getCache(pt),
						gt = Ns(pt),
						vt = "fixed" === ("pinType" in e ? e.pinType : bi(pt, "pinType") || gt && "fixed"),
						_t = [e.onEnter, e.onLeave, e.onEnterBack, e.onLeaveBack],
						yt = ft && e.toggleActions.split(" "),
						wt = "markers" in e ? e.markers : bo.markers,
						bt = gt ? 0 : parseFloat(uo(pt)["border" + dt.p2 + oo]) || 0,
						xt = this,
						Tt = e.onRefreshInit && function() {
							return e.onRefreshInit(xt)
						},
						St = function(t, e, n) {
							var r = n.d,
								i = n.d2,
								s = n.a;
							return (s = bi(t, "getBoundingClientRect")) ? function() {
								return s()[r]
							} : function() {
								return (e ? Is(i) : t["client" + i]) || 0
							}
						}(pt, gt, dt),
						Et = function(t, e) {
							return !e || ~_i.indexOf(t) ? qs(t) : function() {
								return Jo
							}
						}(pt, gt),
						kt = 0,
						Mt = 0,
						Ot = 0,
						Ct = Li(pt, dt);
					if (xt._startClamp = xt._endClamp = !1, xt._dir = dt, nt *= 45, xt.scroller = pt, xt.scroll = ut ? ut.time.bind(ut) : Ct, o = Ct(), xt.vars = e, n = n || e.animation, "refreshPriority" in e && (is = 1, -9999 === e.refreshPriority && (xs = xt)), mt.tweenScroll = mt.tweenScroll || {
							top: sa(pt, Ai),
							left: sa(pt, Ci)
						}, xt.tweenTo = r = mt.tweenScroll[dt.p], xt.scrubDuration = function(t) {
							(z = Hs(t) && t) ? R ? R.duration(t) : R = qi.to(n, {
								ease: "expo",
								totalProgress: "+=0",
								inherit: !1,
								duration: z,
								paused: !0,
								onComplete: function() {
									return rt && rt(xt)
								}
							}): (R && R.progress(1).kill(), R = 0)
						}, n && (n.vars.lazy = !1, n._initted && !xt.isReverted || !1 !== n.vars.immediateRender && !1 !== e.immediateRender && n.duration() && n.render(0, !0, !0), xt.animation = n.pause(), n.scrollTrigger = xt, xt.scrubDuration(Z), L = 0, j || (j = n.vars.id)), ot && (Us(ot) && !ot.push || (ot = {
							snapTo: ot
						}), "scrollBehavior" in Hi.style && qi.set(gt ? [Hi, Wi] : pt, {
							scrollBehavior: "auto"
						}), vi.forEach((function(t) {
							return Ws(t) && t.target === (gt ? Xi.scrollingElement || Wi : pt) && (t.smooth = !1)
						})), s = Ws(ot.snapTo) ? ot.snapTo : "labels" === ot.snapTo ? function(t) {
							return function(e) {
								return qi.utils.snap(po(t), e)
							}
						}(n) : "labelsDirectional" === ot.snapTo ? (X = n, function(t, e) {
							return mo(po(X))(t, e.direction)
						}) : !1 !== ot.directional ? function(t, e) {
							return mo(ot.snapTo)(t, Ss() - Mt < 500 ? 0 : e.direction)
						} : qi.utils.snap(ot.snapTo), B = ot.duration || {
							min: .1,
							max: 2
						}, B = Us(B) ? ji(B.min, B.max) : ji(B, B), N = qi.delayedCall(ot.delay || z / 2 || .1, (function() {
							var t = Ct(),
								e = Ss() - Mt < 500,
								i = r.tween;
							if (!(e || Math.abs(xt.getVelocity()) < 10) || i || Ki || kt === t) xt.isActive && kt !== t && N.restart(!0);
							else {
								var o, a, c = (t - l) / g,
									h = n && !ft ? n.totalProgress() : c,
									d = e ? 0 : (h - D) / (Ss() - Gi) * 1e3 || 0,
									f = qi.utils.clamp(-c, 1 - c, js(d / 2) * d / .185),
									p = c + (!1 === ot.inertia ? 0 : f),
									m = ot,
									v = m.onStart,
									_ = m.onInterrupt,
									y = m.onComplete;
								if (o = s(p, xt), Hs(o) || (o = p), a = Math.round(l + o * g), t <= u && t >= l && a !== t) {
									if (i && !i._initted && i.data <= js(a - t)) return;
									!1 === ot.inertia && (f = o - c), r(a, {
										duration: B(js(.185 * Math.max(js(p - h), js(o - h)) / d / .05 || 0)),
										ease: ot.ease || "power3",
										data: js(a - t),
										onInterrupt: function() {
											return N.restart(!0) && _ && _(xt)
										},
										onComplete: function() {
											xt.update(), kt = Ct(), n && (R ? R.resetTo("totalProgress", o, n._tTime / n._tDur) : n.progress(o)), L = D = n && !ft ? n.totalProgress() : xt.progress, it && it(xt), y && y(xt)
										}
									}, t, f * g, a - t - f * g), v && v(xt, r.tween)
								}
							}
						})).pause()), j && (Mo[j] = xt), (Y = (K = xt.trigger = Pi(K || !0 !== J && J)) && K._gsap && K._gsap.stRevert) && (Y = Y(xt)), J = !0 === J ? K : Pi(J), Xs($) && ($ = {
							targets: K,
							className: $
						}), J && (!1 === tt || tt === so || (tt = !(!tt && J.parentNode && J.parentNode.style && "flex" === uo(J.parentNode).display) && io), xt.pin = J, (i = qi.core.getCache(J)).spacer ? v = i.pinState : (lt && ((lt = Pi(lt)) && !lt.nodeType && (lt = lt.current || lt.nativeElement), i.spacerIsNative = !!lt, lt && (i.spacerState = Ko(lt))), i.spacer = w = lt || Xi.createElement("div"), w.classList.add("pin-spacer"), j && w.classList.add("pin-spacer-" + j), i.pinState = v = Ko(J)), !1 !== e.force3D && qi.set(J, {
							force3D: !0
						}), xt.spacer = w = i.spacer, P = uo(J), k = P[tt + dt.os2], x = qi.getProperty(J), T = qi.quickSetter(J, dt.a, lo), Go(J, w, P), y = Ko(J)), wt) {
						p = Us(wt) ? co(wt, wo) : wo, d = So("scroller-start", j, pt, dt, p, 0), f = So("scroller-end", j, pt, dt, p, 0, d), b = d["offset" + dt.op.d2];
						var At = Pi(bi(pt, "content") || pt);
						c = this.markerStart = So("start", j, At, dt, p, b, 0, ut), h = this.markerEnd = So("end", j, At, dt, p, b, 0, ut), ut && (F = qi.quickSetter([c, h], dt.a, lo)), vt || _i.length && !0 === bi(pt, "fixedMarkers") || (H = uo(W = gt ? Hi : pt).position, W.style.position = "absolute" === H || "fixed" === H ? H : "relative", qi.set([d, f], {
							force3D: !0
						}), O = qi.quickSetter(d, dt.a, lo), A = qi.quickSetter(f, dt.a, lo))
					}
					if (ut) {
						var Pt = ut.vars.onUpdate,
							Lt = ut.vars.onUpdateParams;
						ut.eventCallback("onUpdate", (function() {
							xt.update(0, 0, 1), Pt && Pt.apply(ut, Lt || [])
						}))
					}
					if (xt.previous = function() {
							return ko[ko.indexOf(xt) - 1]
						}, xt.next = function() {
							return ko[ko.indexOf(xt) + 1]
						}, xt.revert = function(t, e) {
							if (!e) return xt.kill(!0);
							var r = !1 !== t || !xt.enabled,
								i = Zi;
							r !== xt.isReverted && (r && (I = Math.max(Ct(), xt.scroll.rec || 0), Ot = xt.progress, q = n && n.progress()), c && [c, h, d, f].forEach((function(t) {
								return t.style.display = r ? "none" : "block"
							})), r && (Zi = xt, xt.update(r)), !J || at && xt.isActive || (r ? function(t, e, n) {
								Zo(n);
								var r = t._gsap;
								if (r.spacerIsNative) Zo(r.spacerState);
								else if (t._gsap.swappedIn) {
									var i = e.parentNode;
									i && (i.insertBefore(t, e), i.removeChild(e))
								}
								t._gsap.swappedIn = !1
							}(J, w, v) : Go(J, w, uo(J), M)), r || xt.update(r), Zi = i, xt.isReverted = r)
						}, xt.refresh = function(i, s, p, b) {
							if (!Zi && xt.enabled || s)
								if (J && i && ks) vo(t, "scrollEnd", Ro);
								else {
									!ws && Tt && Tt(xt), Zi = xt, r.tween && !p && (r.tween.kill(), r.tween = 0), R && R.pause(), et && n && n.revert({
										kill: !1
									}).invalidate(), xt.isReverted || xt.revert(!0, !0), xt._subPinOffset = !1;
									var T, k, O, A, P, L, D, z, B, F, Y, X, W, H = St(),
										U = Et(),
										V = ut ? ut.duration() : Fs(pt, dt),
										$ = g <= .01,
										j = 0,
										G = b || 0,
										Z = Us(p) ? p.end : e.end,
										nt = e.endTrigger || K,
										rt = Us(p) ? p.start : e.start || (0 !== e.start && K ? J ? "0 0" : "0 100%" : 0),
										it = xt.pinnedContainer = e.pinnedContainer && Pi(e.pinnedContainer, xt),
										st = K && Math.max(0, ko.indexOf(xt)) || 0,
										ot = st;
									for (wt && Us(p) && (X = qi.getProperty(d, dt.p), W = qi.getProperty(f, dt.p)); ot--;)(L = ko[ot]).end || L.refresh(0, 1) || (Zi = xt), !(D = L.pin) || D !== K && D !== J && D !== it || L.isReverted || (F || (F = []), F.unshift(L), L.revert(!0, !0)), L !== ko[ot] && (st--, ot--);
									for (Ws(rt) && (rt = rt(xt)), rt = Os(rt, "start", xt), l = ta(rt, K, H, dt, Ct(), c, d, xt, U, bt, vt, V, ut, xt._startClamp && "_startClamp") || (J ? -.001 : 0), Ws(Z) && (Z = Z(xt)), Xs(Z) && !Z.indexOf("+=") && (~Z.indexOf(" ") ? Z = (Xs(rt) ? rt.split(" ")[0] : "") + Z : (j = To(Z.substr(2), H), Z = Xs(rt) ? rt : (ut ? qi.utils.mapRange(0, ut.duration(), ut.scrollTrigger.start, ut.scrollTrigger.end, l) : l) + j, nt = K)), Z = Os(Z, "end", xt), u = Math.max(l, ta(Z || (nt ? "100% 0" : V), nt, H, dt, Ct() + j, h, f, xt, U, bt, vt, V, ut, xt._endClamp && "_endClamp")) || -.001, j = 0, ot = st; ot--;)(D = (L = ko[ot]).pin) && L.start - L._pinPush <= l && !ut && L.end > 0 && (T = L.end - (xt._startClamp ? Math.max(0, L.start) : L.start), (D === K && L.start - L._pinPush < l || D === it) && isNaN(rt) && (j += T * (1 - L.progress)), D === J && (G += T));
									if (l += j, u += j, xt._startClamp && (xt._startClamp += j), xt._endClamp && !ws && (xt._endClamp = u || -.001, u = Math.min(u, Fs(pt, dt))), g = u - l || (l -= .01) && .001, $ && (Ot = qi.utils.clamp(0, 1, qi.utils.normalize(l, u, I))), xt._pinPush = G, c && j && ((T = {})[dt.a] = "+=" + j, it && (T[dt.p] = "-=" + Ct()), qi.set([c, h], T)), !J || vs && xt.end >= Fs(pt, dt)) {
										if (K && Ct() && !ut)
											for (k = K.parentNode; k && k !== Hi;) k._pinOffset && (l -= k._pinOffset, u -= k._pinOffset), k = k.parentNode
									} else T = uo(J), A = dt === Ai, O = Ct(), S = parseFloat(x(dt.a)) + G, !V && u > 1 && (Y = {
										style: Y = (gt ? Xi.scrollingElement || Wi : pt).style,
										value: Y["overflow" + dt.a.toUpperCase()]
									}, gt && "scroll" !== uo(Hi)["overflow" + dt.a.toUpperCase()] && (Y.style["overflow" + dt.a.toUpperCase()] = "scroll")), Go(J, w, T), y = Ko(J), k = ho(J, !0), z = vt && Li(pt, A ? Ci : Ai)(), tt ? ((M = [tt + dt.os2, g + G + lo]).t = w, (ot = tt === io ? fo(J, dt) + g + G : 0) && (M.push(dt.d, ot + lo), "auto" !== w.style.flexBasis && (w.style.flexBasis = ot + lo)), Zo(M), it && ko.forEach((function(t) {
										t.pin === it && !1 !== t.vars.pinSpacing && (t._subPinOffset = !0)
									})), vt && Ct(I)) : (ot = fo(J, dt)) && "auto" !== w.style.flexBasis && (w.style.flexBasis = ot + lo), vt && ((P = {
										top: k.top + (A ? O - l : z) + lo,
										left: k.left + (A ? z : O - l) + lo,
										boxSizing: "border-box",
										position: "fixed"
									})[Ks] = P["max" + oo] = Math.ceil(k.width) + lo, P[Js] = P["max" + ao] = Math.ceil(k.height) + lo, P[so] = P[so + no] = P[so + to] = P[so + ro] = P[so + eo] = "0", P[io] = T[io], P[io + no] = T[io + no], P[io + to] = T[io + to], P[io + ro] = T[io + ro], P[io + eo] = T[io + eo], _ = function(t, e, n) {
										for (var r, i = [], s = t.length, o = n ? 8 : 0; o < s; o += 2) r = t[o], i.push(r, r in e ? e[r] : t[o + 1]);
										return i.t = t.t, i
									}(v, P, at), ws && Ct(0)), n ? (B = n._initted, ss(1), n.render(n.duration(), !0, !0), E = x(dt.a) - S + g + G, C = Math.abs(g - E) > 1, vt && C && _.splice(_.length - 2, 2), n.render(0, !0, !0), B || n.invalidate(!0), n.parent || n.totalTime(n.totalTime()), ss(0)) : E = g, Y && (Y.value ? Y.style["overflow" + dt.a.toUpperCase()] = Y.value : Y.style.removeProperty("overflow-" + dt.a));
									F && F.forEach((function(t) {
										return t.revert(!1, !0)
									})), xt.start = l, xt.end = u, o = a = ws ? I : Ct(), ut || ws || (o < I && Ct(I), xt.scroll.rec = 0), xt.revert(!1, !0), Mt = Ss(), N && (kt = -1, N.restart(!0)), Zi = 0, n && ft && (n._initted || q) && n.progress() !== q && n.progress(q || 0, !0).render(n.time(), !0, !0), ($ || Ot !== xt.progress || ut || et) && (n && !ft && n.totalProgress(ut && l < -.001 && !Ot ? qi.utils.normalize(l, u, 0) : Ot, !0), xt.progress = $ || (o - l) / g === Ot ? 0 : Ot), J && tt && (w._pinOffset = Math.round(xt.progress * E)), R && R.invalidate(), isNaN(X) || (X -= qi.getProperty(d, dt.p), W -= qi.getProperty(f, dt.p), ia(d, dt, X), ia(c, dt, X - (b || 0)), ia(f, dt, W), ia(h, dt, W - (b || 0))), $ && !ws && xt.update(), !Q || ws || m || (m = !0, Q(xt), m = !1)
								}
						}, xt.getVelocity = function() {
							return (Ct() - a) / (Ss() - Gi) * 1e3 || 0
						}, xt.endAnimation = function() {
							Vs(xt.callbackAnimation), n && (R ? R.progress(1) : n.paused() ? ft || Vs(n, xt.direction < 0, 1) : Vs(n, n.reversed()))
						}, xt.labelToScroll = function(t) {
							return n && n.labels && (l || xt.refresh() || l) + n.labels[t] / n.duration() * g || 0
						}, xt.getTrailing = function(t) {
							var e = ko.indexOf(xt),
								n = xt.direction > 0 ? ko.slice(0, e).reverse() : ko.slice(e + 1);
							return (Xs(t) ? n.filter((function(e) {
								return e.vars.preventOverlaps === t
							})) : n).filter((function(t) {
								return xt.direction > 0 ? t.end <= l : t.start >= u
							}))
						}, xt.update = function(t, e, i) {
							if (!ut || i || t) {
								var s, c, h, f, p, m, v, b = !0 === ws ? I : xt.scroll(),
									x = t ? 0 : (b - l) / g,
									M = x < 0 ? 0 : x > 1 ? 1 : x || 0,
									P = xt.progress;
								if (e && (a = o, o = ut ? Ct() : b, ot && (D = L, L = n && !ft ? n.totalProgress() : M)), nt && J && !Zi && !Ts && ks && (!M && l < b + (b - a) / (Ss() - Gi) * nt ? M = 1e-4 : 1 === M && u > b + (b - a) / (Ss() - Gi) * nt && (M = .9999)), M !== P && xt.enabled) {
									if (f = (p = (s = xt.isActive = !!M && M < 1) != (!!P && P < 1)) || !!M != !!P, xt.direction = M > P ? 1 : -1, xt.progress = M, f && !Zi && (c = M && !P ? 0 : 1 === M ? 1 : 1 === P ? 2 : 3, ft && (h = !p && "none" !== yt[c + 1] && yt[c + 1] || yt[c], v = n && ("complete" === h || "reset" === h || h in n))), ht && (p || v) && (v || Z || !n) && (Ws(ht) ? ht(xt) : xt.getTrailing(ht).forEach((function(t) {
											return t.endAnimation()
										}))), ft || (!R || Zi || Ts ? n && n.totalProgress(M, !(!Zi || !Mt && !t)) : (R._dp._time - R._start !== R._time && R.render(R._dp._time - R._start), R.resetTo ? R.resetTo("totalProgress", M, n._tTime / n._tDur) : (R.vars.totalProgress = M, R.invalidate().restart()))), J)
										if (t && tt && (w.style[tt + dt.os2] = k), vt) {
											if (f) {
												if (m = !t && M > P && u + 1 > b && b + 1 >= Fs(pt, dt), at)
													if (t || !s && !m) na(J, w);
													else {
														var z = ho(J, !0),
															B = b - l;
														na(J, Hi, z.top + (dt === Ai ? B : 0) + lo, z.left + (dt === Ai ? 0 : B) + lo)
													} Zo(s || m ? _ : y), C && M < 1 && s || T(S + (1 !== M || m ? 0 : E))
											}
										} else T(Rs(S + E * M));
									ot && !r.tween && !Zi && !Ts && N.restart(!0), $ && (p || st && M && (M < 1 || !_s)) && $i($.targets).forEach((function(t) {
										return t.classList[s || st ? "add" : "remove"]($.className)
									})), V && !ft && !t && V(xt), f && !Zi ? (ft && (v && ("complete" === h ? n.pause().totalProgress(1) : "reset" === h ? n.restart(!0).pause() : "restart" === h ? n.restart(!0) : n[h]()), V && V(xt)), !p && _s || (G && p && $s(xt, G), _t[c] && $s(xt, _t[c]), st && (1 === M ? xt.kill(!1, 1) : _t[c] = 0), p || _t[c = 1 === M ? 1 : 3] && $s(xt, _t[c])), ct && !s && Math.abs(xt.getVelocity()) > (Hs(ct) ? ct : 2500) && (Vs(xt.callbackAnimation), R ? R.progress(1) : Vs(n, "reverse" === h ? 1 : !M, 1))) : ft && V && !Zi && V(xt)
								}
								if (A) {
									var q = ut ? b / ut.duration() * (ut._caScrollDist || 0) : b;
									O(q + (d._isFlipped ? 1 : 0)), A(q)
								}
								F && F(-b / ut.duration() * (ut._caScrollDist || 0))
							}
						}, xt.enable = function(e, n) {
							xt.enabled || (xt.enabled = !0, vo(pt, "resize", Po), gt || vo(pt, "scroll", Co), Tt && vo(t, "refreshInit", Tt), !1 !== e && (xt.progress = Ot = 0, o = a = kt = Ct()), !1 !== n && xt.refresh())
						}, xt.getTween = function(t) {
							return t && r ? r.tween : R
						}, xt.setPositions = function(t, e, n, r) {
							if (ut) {
								var i = ut.scrollTrigger,
									s = ut.duration(),
									o = i.end - i.start;
								t = i.start + o * t / s, e = i.start + o * e / s
							}
							xt.refresh(!1, !1, {
								start: Cs(t, n && !!xt._startClamp),
								end: Cs(e, n && !!xt._endClamp)
							}, r), xt.update()
						}, xt.adjustPinSpacing = function(t) {
							if (M && t) {
								var e = M.indexOf(dt.d) + 1;
								M[e] = parseFloat(M[e]) + t + lo, M[1] = parseFloat(M[1]) + t + lo, Zo(M)
							}
						}, xt.disable = function(e, n) {
							if (xt.enabled && (!1 !== e && xt.revert(!0, !0), xt.enabled = xt.isActive = !1, n || R && R.pause(), I = 0, i && (i.uncache = 1), Tt && _o(t, "refreshInit", Tt), N && (N.pause(), r.tween && r.tween.kill() && (r.tween = 0)), !gt)) {
								for (var s = ko.length; s--;)
									if (ko[s].scroller === pt && ko[s] !== xt) return;
								_o(pt, "resize", Po), gt || _o(pt, "scroll", Co)
							}
						}, xt.kill = function(t, r) {
							xt.disable(t, r), R && !r && R.kill(), j && delete Mo[j];
							var s = ko.indexOf(xt);
							s >= 0 && ko.splice(s, 1), s === ts && Uo > 0 && ts--, s = 0, ko.forEach((function(t) {
								return t.scroller === xt.scroller && (s = 1)
							})), s || ws || (xt.scroll.rec = 0), n && (n.scrollTrigger = null, t && n.revert({
								kill: !1
							}), r || n.kill()), c && [c, h, d, f].forEach((function(t) {
								return t.parentNode && t.parentNode.removeChild(t)
							})), xs === xt && (xs = 0), J && (i && (i.uncache = 1), s = 0, ko.forEach((function(t) {
								return t.pin === J && s++
							})), s || (i.spacer = 0)), e.onKill && e.onKill(xt)
						}, ko.push(xt), xt.enable(!1, !1), Y && Y(xt), n && n.add && !g) {
						var Dt = xt.update;
						xt.update = function() {
							xt.update = Dt, l || u || xt.refresh()
						}, qi.delayedCall(.01, xt.update), g = .01, l = u = 0
					} else xt.refresh();
					J && function() {
						if (bs !== Fo) {
							var t = bs = Fo;
							requestAnimationFrame((function() {
								return t === Fo && Wo(!0)
							}))
						}
					}()
				} else this.update = this.refresh = this.kill = Ds
			}, t.register = function(e) {
				return Fi || (qi = e || Bs(), zs() && window.document && t.enable(), Fi = Ms), Fi
			}, t.defaults = function(t) {
				if (t)
					for (var e in t) bo[e] = t[e];
				return bo
			}, t.disable = function(t, e) {
				Ms = 0, ko.forEach((function(n) {
					return n[e ? "kill" : "disable"](t)
				})), _o(Yi, "wheel", Co), _o(Xi, "scroll", Co), clearInterval(Qi), _o(Xi, "touchcancel", Ds), _o(Hi, "touchstart", Ds), go(_o, Xi, "pointerdown,touchstart,mousedown", Ps), go(_o, Xi, "pointerup,touchend,mouseup", Ls), Vi.kill(), Ys(_o);
				for (var n = 0; n < vi.length; n += 3) yo(_o, vi[n], vi[n + 1]), yo(_o, vi[n], vi[n + 2])
			}, t.enable = function() {
				if (Yi = window, Xi = document, Wi = Xi.documentElement, Hi = Xi.body, qi && ($i = qi.utils.toArray, ji = qi.utils.clamp, ds = qi.core.context || Ds, ss = qi.core.suppressOverwrites || Ds, fs = Yi.history.scrollRestoration || "auto", Ho = Yi.pageYOffset, qi.core.globals("ScrollTrigger", t), Hi)) {
					Ms = 1, (ps = document.createElement("div")).style.height = "100vh", ps.style.position = "absolute", Yo(), As(), Ii.register(qi), t.isTouch = Ii.isTouch, hs = Ii.isTouch && /(iPad|iPhone|iPod|Mac)/g.test(navigator.userAgent), ls = 1 === Ii.isTouch, vo(Yi, "wheel", Co), Ui = [Yi, Xi, Wi, Hi], qi.matchMedia ? (t.matchMedia = function(t) {
						var e, n = qi.matchMedia();
						for (e in t) n.add(e, t[e]);
						return n
					}, qi.addEventListener("matchMediaInit", (function() {
						return Io()
					})), qi.addEventListener("matchMediaRevert", (function() {
						return No()
					})), qi.addEventListener("matchMedia", (function() {
						Wo(0, 1), zo("matchMedia")
					})), qi.matchMedia("(orientation: portrait)", (function() {
						return Ao(), Ao
					}))) : console.warn("Requires GSAP 3.11.0 or later"), Ao(), vo(Xi, "scroll", Co);
					var e, n, r = Hi.style,
						i = r.borderTopStyle,
						s = qi.core.Animation.prototype;
					for (s.revert || Object.defineProperty(s, "revert", {
							value: function() {
								return this.time(-.01, !0)
							}
						}), r.borderTopStyle = "solid", e = ho(Hi), Ai.m = Math.round(e.top + Ai.sc()) || 0, Ci.m = Math.round(e.left + Ci.sc()) || 0, i ? r.borderTopStyle = i : r.removeProperty("border-top-style"), Qi = setInterval(Oo, 250), qi.delayedCall(.5, (function() {
							return Ts = 0
						})), vo(Xi, "touchcancel", Ds), vo(Hi, "touchstart", Ds), go(vo, Xi, "pointerdown,touchstart,mousedown", Ps), go(vo, Xi, "pointerup,touchend,mouseup", Ls), Ji = qi.utils.checkPrefix("transform"), jo.push(Ji), Fi = Ss(), Vi = qi.delayedCall(.2, Wo).pause(), rs = [Xi, "visibilitychange", function() {
							var t = Yi.innerWidth,
								e = Yi.innerHeight;
							Xi.hidden ? (es = t, ns = e) : es === t && ns === e || Po()
						}, Xi, "DOMContentLoaded", Wo, Yi, "load", Wo, Yi, "resize", Po], Ys(vo), ko.forEach((function(t) {
							return t.enable(0, 1)
						})), n = 0; n < vi.length; n += 3) yo(_o, vi[n], vi[n + 1]), yo(_o, vi[n], vi[n + 2])
				}
			}, t.config = function(e) {
				"limitCallbacks" in e && (_s = !!e.limitCallbacks);
				var n = e.syncInterval;
				n && clearInterval(Qi) || (Qi = n) && setInterval(Oo, n), "ignoreMobileResize" in e && (ls = 1 === t.isTouch && e.ignoreMobileResize), "autoRefreshEvents" in e && (Ys(_o) || Ys(vo, e.autoRefreshEvents || "none"), os = -1 === (e.autoRefreshEvents + "").indexOf("resize"))
			}, t.scrollerProxy = function(t, e) {
				var n = Pi(t),
					r = vi.indexOf(n),
					i = Ns(n);
				~r && vi.splice(r, i ? 6 : 2), e && (i ? _i.unshift(Yi, e, Hi, e, Wi, e) : _i.unshift(n, e))
			}, t.clearMatchMedia = function(t) {
				ko.forEach((function(e) {
					return e._ctx && e._ctx.query === t && e._ctx.kill(!0, !0)
				}))
			}, t.isInViewport = function(t, e, n) {
				var r = (Xs(t) ? Pi(t) : t).getBoundingClientRect(),
					i = r[n ? Ks : Js] * e || 0;
				return n ? r.right - i > 0 && r.left + i < Yi.innerWidth : r.bottom - i > 0 && r.top + i < Yi.innerHeight
			}, t.positionInViewport = function(t, e, n) {
				Xs(t) && (t = Pi(t));
				var r = t.getBoundingClientRect(),
					i = r[n ? Ks : Js],
					s = null == e ? i / 2 : e in xo ? xo[e] * i : ~e.indexOf("%") ? parseFloat(e) * i / 100 : parseFloat(e) || 0;
				return n ? (r.left + s) / Yi.innerWidth : (r.top + s) / Yi.innerHeight
			}, t.killAll = function(t) {
				if (ko.slice(0).forEach((function(t) {
						return "ScrollSmoother" !== t.vars.id && t.kill()
					})), !0 !== t) {
					var e = Lo.killAll || [];
					Lo = {}, e.forEach((function(t) {
						return t()
					}))
				}
			}, t
		}();
	oa.version = "3.12.5", oa.saveStyles = function(t) {
		return t ? $i(t).forEach((function(t) {
			if (t && t.style) {
				var e = Bo.indexOf(t);
				e >= 0 && Bo.splice(e, 5), Bo.push(t, t.style.cssText, t.getBBox && t.getAttribute("transform"), qi.core.getCache(t), ds())
			}
		})) : Bo
	}, oa.revert = function(t, e) {
		return Io(!t, e)
	}, oa.create = function(t, e) {
		return new oa(t, e)
	}, oa.refresh = function(t) {
		return t ? Po() : (Fi || oa.register()) && Wo(!0)
	}, oa.update = function(t) {
		return ++vi.cache && Vo(!0 === t ? 2 : 0)
	}, oa.clearScrollMemory = qo, oa.maxScroll = function(t, e) {
		return Fs(t, e ? Ci : Ai)
	}, oa.getScrollFunc = function(t, e) {
		return Li(Pi(t), e ? Ci : Ai)
	}, oa.getById = function(t) {
		return Mo[t]
	}, oa.getAll = function() {
		return ko.filter((function(t) {
			return "ScrollSmoother" !== t.vars.id
		}))
	}, oa.isScrolling = function() {
		return !!ks
	}, oa.snapDirectional = mo, oa.addEventListener = function(t, e) {
		var n = Lo[t] || (Lo[t] = []);
		~n.indexOf(e) || n.push(e)
	}, oa.removeEventListener = function(t, e) {
		var n = Lo[t],
			r = n && n.indexOf(e);
		r >= 0 && n.splice(r, 1)
	}, oa.batch = function(t, e) {
		var n, r = [],
			i = {},
			s = e.interval || .016,
			o = e.batchMax || 1e9,
			a = function(t, e) {
				var n = [],
					r = [],
					i = qi.delayedCall(s, (function() {
						e(n, r), n = [], r = []
					})).pause();
				return function(t) {
					n.length || i.restart(!0), n.push(t.trigger), r.push(t), o <= n.length && i.progress(1)
				}
			};
		for (n in e) i[n] = "on" === n.substr(0, 2) && Ws(e[n]) && "onRefreshInit" !== n ? a(0, e[n]) : e[n];
		return Ws(o) && (o = o(), vo(oa, "refresh", (function() {
			return o = e.batchMax()
		}))), $i(t).forEach((function(t) {
			var e = {};
			for (n in i) e[n] = i[n];
			e.trigger = t, r.push(oa.create(e))
		})), r
	};
	var aa, la = function(t, e, n, r) {
			return e > r ? t(r) : e < 0 && t(0), n > r ? (r - e) / (n - e) : n < 0 ? e / (e - n) : 1
		},
		ua = function t(e, n) {
			!0 === n ? e.style.removeProperty("touch-action") : e.style.touchAction = !0 === n ? "auto" : n ? "pan-" + n + (Ii.isTouch ? " pinch-zoom" : "") : "none", e === Wi && t(Hi, n)
		},
		ca = {
			auto: 1,
			scroll: 1
		},
		ha = function(t) {
			var e, n = t.event,
				r = t.target,
				i = t.axis,
				s = (n.changedTouches ? n.changedTouches[0] : n).target,
				o = s._gsap || qi.core.getCache(s),
				a = Ss();
			if (!o._isScrollT || a - o._isScrollT > 2e3) {
				for (; s && s !== Hi && (s.scrollHeight <= s.clientHeight && s.scrollWidth <= s.clientWidth || !ca[(e = uo(s)).overflowY] && !ca[e.overflowX]);) s = s.parentNode;
				o._isScroll = s && s !== r && !Ns(s) && (ca[(e = uo(s)).overflowY] || ca[e.overflowX]), o._isScrollT = a
			}(o._isScroll || "x" === i) && (n.stopPropagation(), n._gsapAllow = !0)
		},
		da = function(t, e, n, r) {
			return Ii.create({
				target: t,
				capture: !0,
				debounce: !1,
				lockAxis: !0,
				type: e,
				onWheel: r = r && ha,
				onPress: r,
				onDrag: r,
				onScroll: r,
				onEnable: function() {
					return n && vo(Xi, Ii.eventTypes[0], pa, !1, !0)
				},
				onDisable: function() {
					return _o(Xi, Ii.eventTypes[0], pa, !0)
				}
			})
		},
		fa = /(input|label|select|textarea)/i,
		pa = function(t) {
			var e = fa.test(t.target.tagName);
			(e || aa) && (t._gsapAllow = !0, aa = e)
		};
	oa.sort = function(t) {
		return ko.sort(t || function(t, e) {
			return -1e6 * (t.vars.refreshPriority || 0) + t.start - (e.start + -1e6 * (e.vars.refreshPriority || 0))
		})
	}, oa.observe = function(t) {
		return new Ii(t)
	}, oa.normalizeScroll = function(t) {
		if (void 0 === t) return as;
		if (!0 === t && as) return as.enable();
		if (!1 === t) return as && as.kill(), void(as = t);
		var e = t instanceof Ii ? t : function(t) {
			Us(t) || (t = {}), t.preventDefault = t.isNormalizer = t.allowClicks = !0, t.type || (t.type = "wheel,touch"), t.debounce = !!t.debounce, t.id = t.id || "normalizer";
			var e, n, r, i, s, o, a, l, u = t,
				c = u.normalizeScrollX,
				h = u.momentum,
				d = u.allowNestedScroll,
				f = u.onRelease,
				p = Pi(t.target) || Wi,
				m = qi.core.globals().ScrollSmoother,
				g = m && m.get(),
				v = hs && (t.content && Pi(t.content) || g && !1 !== t.content && !g.smooth() && g.content()),
				_ = Li(p, Ai),
				y = Li(p, Ci),
				w = 1,
				b = (Ii.isTouch && Yi.visualViewport ? Yi.visualViewport.scale * Yi.visualViewport.width : Yi.outerWidth) / Yi.innerWidth,
				x = 0,
				T = Ws(h) ? function() {
					return h(e)
				} : function() {
					return h || 2.8
				},
				S = da(p, t.type, !0, d),
				E = function() {
					return i = !1
				},
				k = Ds,
				M = Ds,
				O = function() {
					n = Fs(p, Ai), M = ji(hs ? 1 : 0, n), c && (k = ji(0, Fs(p, Ci))), r = Fo
				},
				C = function() {
					v._gsap.y = Rs(parseFloat(v._gsap.y) + _.offset) + "px", v.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + parseFloat(v._gsap.y) + ", 0, 1)", _.offset = _.cacheID = 0
				},
				A = function() {
					O(), s.isActive() && s.vars.scrollY > n && (_() > n ? s.progress(1) && _(n) : s.resetTo("scrollY", n))
				};
			return v && qi.set(v, {
				y: "+=0"
			}), t.ignoreCheck = function(t) {
				return hs && "touchmove" === t.type && function() {
					if (i) {
						requestAnimationFrame(E);
						var t = Rs(e.deltaY / 2),
							n = M(_.v - t);
						if (v && n !== _.v + _.offset) {
							_.offset = n - _.v;
							var r = Rs((parseFloat(v && v._gsap.y) || 0) - _.offset);
							v.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + r + ", 0, 1)", v._gsap.y = r + "px", _.cacheID = vi.cache, Vo()
						}
						return !0
					}
					_.offset && C(), i = !0
				}() || w > 1.05 && "touchstart" !== t.type || e.isGesturing || t.touches && t.touches.length > 1
			}, t.onPress = function() {
				i = !1;
				var t = w;
				w = Rs((Yi.visualViewport && Yi.visualViewport.scale || 1) / b), s.pause(), t !== w && ua(p, w > 1.01 || !c && "x"), o = y(), a = _(), O(), r = Fo
			}, t.onRelease = t.onGestureStart = function(t, e) {
				if (_.offset && C(), e) {
					vi.cache++;
					var r, i, o = T();
					c && (i = (r = y()) + .05 * o * -t.velocityX / .227, o *= la(y, r, i, Fs(p, Ci)), s.vars.scrollX = k(i)), i = (r = _()) + .05 * o * -t.velocityY / .227, o *= la(_, r, i, Fs(p, Ai)), s.vars.scrollY = M(i), s.invalidate().duration(o).play(.01), (hs && s.vars.scrollY >= n || r >= n - 1) && qi.to({}, {
						onUpdate: A,
						duration: o
					})
				} else l.restart(!0);
				f && f(t)
			}, t.onWheel = function() {
				s._ts && s.pause(), Ss() - x > 1e3 && (r = 0, x = Ss())
			}, t.onChange = function(t, e, n, i, s) {
				if (Fo !== r && O(), e && c && y(k(i[2] === e ? o + (t.startX - t.x) : y() + e - i[1])), n) {
					_.offset && C();
					var l = s[2] === n,
						u = l ? a + t.startY - t.y : _() + n - s[1],
						h = M(u);
					l && u !== h && (a += h - u), _(h)
				}(n || e) && Vo()
			}, t.onEnable = function() {
				ua(p, !c && "x"), oa.addEventListener("refresh", A), vo(Yi, "resize", A), _.smooth && (_.target.style.scrollBehavior = "auto", _.smooth = y.smooth = !1), S.enable()
			}, t.onDisable = function() {
				ua(p, !0), _o(Yi, "resize", A), oa.removeEventListener("refresh", A), S.kill()
			}, t.lockAxis = !1 !== t.lockAxis, (e = new Ii(t)).iOS = hs, hs && !_() && _(1), hs && qi.ticker.add(Ds), l = e._dc, s = qi.to(e, {
				ease: "power4",
				paused: !0,
				inherit: !1,
				scrollX: c ? "+=0.1" : "+=0",
				scrollY: "+=0.1",
				modifiers: {
					scrollY: ra(_, _(), (function() {
						return s.pause()
					}))
				},
				onUpdate: Vo,
				onComplete: l.vars.onComplete
			}), e
		}(t);
		return as && as.target === e.target && as.kill(), Ns(e.target) && (as = e), e
	}, oa.core = {
		_getVelocityProp: Di,
		_inputObserver: da,
		_scrollers: vi,
		_proxies: _i,
		bridge: {
			ss: function() {
				ks || zo("scrollStart"), ks = Ss()
			},
			ref: function() {
				return Zi
			}
		}
	}, Bs() && qi.registerPlugin(oa);
	const ma = document.body.classList.contains("admin-bar"),
		ga = "rtl" === document.documentElement.dir,
		va = {
			is_animating: !1,
			show_menu: t => {
				if (null == t) return;
				let e = t.querySelectorAll(":scope > li > a");
				e.length < 1 || (xa(t), Jr.to([t, ...e], {
					autoAlpha: 1,
					marginTop: 0,
					overwrite: "auto",
					"pointer-events": "auto",
					ease: "power4.inOut"
				}))
			},
			hide_menu: (t, e) => {
				null != t && Jr.to(t, {
					x: 0,
					y: 0,
					marginTop: 15,
					autoAlpha: 0,
					overwrite: "auto",
					"pointer-events": "none",
					ease: "power4.inOut"
				})
			},
			hide_menu_links: t => {
				null != t && Jr.to(t, {
					autoAlpha: 0,
					duration: .3,
					overwrite: "auto",
					ease: "power4.inOut"
				})
			},
			hide_bg_box: t => {
				let e = document.querySelector(".nav-dropdown-bg"),
					n = document.querySelector(".nav-dropdown-bg-icon"),
					r = _a(e);
				null != r && (Jr.to(n, {
					autoAlpha: 0,
					ease: "power4.inOut",
					overwrite: "auto",
					onComplete: () => {
						null != n && void 0 !== n.parentNode && null !== n.parentNode && n.parentNode.removeChild(n)
					}
				}), Jr.to(e, {
					autoAlpha: 0,
					y: r.y + 50,
					ease: "power4.inOut",
					overwrite: "auto",
					onComplete: () => {
						null != e && void 0 !== e.parentNode && null !== e.parentNode && e.parentNode.removeChild(e)
					},
					onUpdateParams: [e, !1],
					onUpdate: ya
				}))
			}
		},
		_a = t => {
			if (null != t) return t.getBoundingClientRect()
		},
		ya = (t, e = !0) => {
			let n = document.querySelector(".nav-dropdown-bg-icon");
			if (null == n && e && (n = (() => {
					let t = (() => {
						let t = document.createElement("div");
						return t.className = "icon", t.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M9.39 265.4l127.1-128C143.6 131.1 151.8 128 160 128s16.38 3.125 22.63 9.375l127.1 128c9.156 9.156 11.9 22.91 6.943 34.88S300.9 320 287.1 320H32.01c-12.94 0-24.62-7.781-29.58-19.75S.2333 274.5 9.39 265.4z"/></svg>', t
					})();
					return t.classList.add("nav-dropdown-bg-icon"), document.body.appendChild(t), t
				})()), null == t || null == n) return;
			let r = _a(t);
			return ma && (r.y -= 32), Jr.set(n, {
				x: r.x,
				y: r.y
			}), n
		},
		wa = (t, e, n, r = !0, i = {}) => {
			if (null == t) return;
			const s = {
				y: e.top,
				x: e.left,
				width: e.width,
				height: e.height,
				overwrite: "auto",
				...n
			};
			if (ga && (s.x = -1 * (document.documentElement.clientWidth - s.x - s.width)), ma && (s.y -= 32), r) {
				if (Jr.to(t, {
						...s,
						...i,
						ease: "power4.inOut",
						onUpdateParams: [t],
						onUpdate: ya
					}), i.length) {
					let t = document.querySelector(".nav-dropdown-bg-icon");
					Jr.to(t, {
						...i,
						ease: "power4.inOut",
						overwrite: "auto"
					})
				}
			} else Jr.set(t, s)
		},
		ba = t => {
			if (null == t) return;
			let e = document.querySelector(".navigation-menu");
			if (null == e) return;
			if (t.parentNode === e) return t.querySelector(".sub-menu");
			let n = t.closest(".sub-menu");
			return null !== n && n !== t ? ba(n) : null !== n && n === t ? ba(n.parentNode) : n
		},
		xa = t => {
			if (null == t) return;
			let e = _a(t),
				n = window.innerWidth,
				r = (t.matches(".navigation-menu > li > .sub-menu > li > .sub-menu"), t.matches(".navigation-menu > li > .sub-menu"));
			e.right > n && r ? t.style.setProperty("left", e.right - n - 25 + "px") : e.right > n ? (t.style.setProperty("left", "initial"), t.style.setProperty("right", "100%")) : t.matches(".sub-menu .sub-menu")
		},
		Ta = t => {
			let e = document.querySelector(".navigation-menu");
			null != e && ("mouseenter" === t.type && t.target.parentNode === e ? (t => {
				let e = t.srcElement,
					n = _a(e),
					r = ba(e);
				va.show_menu(r);
				let i = _a(r),
					s = document.querySelector(".nav-dropdown-bg"),
					o = document.querySelector(".nav-dropdown-bg-icon");
				if (null == s) {
					s = ((t, e = null) => {
						if (null == t) return;
						let n = document.createElement("div");
						n.className = "nav-dropdown-bg";
						let r = _a(t);
						return wa(n, r, e, !1), document.body.appendChild(n), n
					})(r), o = ya(s), Jr.set([s, o], {
						y: n.bottom + 50
					}), Jr.to(o, {
						autoAlpha: 1,
						ease: "power4.inOut"
					});
					let t = n.bottom;
					ma && (t -= 32), Jr.to(s, {
						autoAlpha: 1,
						y: t,
						ease: "power4.inOut",
						onUpdateParams: [s],
						onUpdate: ya
					})
				} else Jr.to(o, {
					autoAlpha: 1,
					ease: "power4.inOut",
					overwrite: "auto"
				}), wa(s, i, {
					x: n.left - 25,
					y: n.bottom
				}, !0, {
					autoAlpha: 1
				});
				var a, l;
				a = s.querySelector(".icon"), l = (n.right - n.left + 15) / 2, null != a && Jr.to(a, {
					left: l,
					overwrite: "auto"
				})
			})(t) : "mouseleave" === t.type && (t => {
				let e = t.target.querySelectorAll(".sub-menu"),
					n = t.target.querySelectorAll(":scope .sub-menu li a");
				va.is_animating = !0, va.hide_menu_links(n), va.hide_menu(e), va.hide_bg_box()
			})(t))
		},
		Sa = () => {
			let t = document.querySelectorAll(".sticky-nav");
			if (t.length < 1) return;
			let e = void 0 !== document.body.scrollbar ? document.body.scrollbar.scroll().position.y : window.scrollY;
			t.forEach((t => {
				let n = t.getBoundingClientRect();
				e - 30 > n.top ? t.classList.add("scrolled") : t.classList.remove("scrolled")
			}))
		},
		Ea = t => {
			t.target.closest(".hamburger").classList.toggle("shown"), document.querySelector("body.custom-scrollbar > .os-scrollbar-vertical")?.classList?.toggle("hamburger-shown")
		};
	var ka;
	ka = Sa, void 0 === document.body.scrollEvents && (document.body.scrollEvents = []), document.body.scrollEvents.push(ka);
	const Ma = (t, e) => {
			let n = t.querySelectorAll(e);
			return n.length < 1 ? 0 : Array.from(n).reduce(((t, e) => t + e.offsetHeight), 0)
		},
		Oa = {
			get_offset: t => {
				let e = t.offsetWidth,
					n = window.getComputedStyle(t).getPropertyValue("padding-right");
				return e + parseFloat(n)
			},
			show_dropdown: t => {
				let e = t.closest(".navigation-menu-wrapper"),
					n = t.closest("ul"),
					r = t.closest(".menu-item-has-children").querySelector(".sub-menu");
				Jr.to(n, {
					x: -1 * Oa.get_offset(n),
					autoAlpha: 1
				}), Jr.to(n.querySelectorAll(":scope > li > a"), {
					autoAlpha: 0
				}), Jr.to([r, r.querySelectorAll(":scope > li > a")], {
					autoAlpha: 1
				}), Jr.to(e, {
					height: Ma(r, ":scope > li")
				})
			},
			hide_dropdown: t => {
				let e = t.closest(".navigation-menu-wrapper"),
					n = t.closest("ul"),
					r = n.parentNode.parentNode.closest("ul");
				Jr.to(r, {
					x: 0,
					autoAlpha: 1
				}), Jr.to(r.querySelectorAll(":scope > li > a"), {
					autoAlpha: 1
				}), Jr.to([n, n.querySelectorAll(":scope > li > a")], {
					autoAlpha: 0
				}), Jr.to(e, {
					height: Ma(r, ":scope > li")
				})
			}
		},
		Ca = (t, e = !1) => {
			t.preventDefault(), e ? Oa.hide_dropdown(t.target) : Oa.show_dropdown(t.target)
		};
	Jr.registerPlugin(oa), document.addEventListener("DOMContentLoaded", (function() {
			if ("undefined" != typeof Swiper) {
				new Swiper(".hero-slider", {
				  effect: "fade",
				  speed: 500,
				  slidesPerView: 1,
				  centeredSlides: true,
				  navigation: {
				    nextEl: ".swiper-hero-button-next",
				    prevEl: ".swiper-hero-button-prev",
				  },
				  pagination: {
				    el: ".swiper-hero-pagination",
				    clickable: true,
				  },
				  keyboard: true,
				  autoplay: {
				    delay: 3000, // Slide changes every 3 seconds
				    disableOnInteraction: false, // Keep autoplay even after user interactions
				  },
				  on: {
				    init: function () {
				      const t = document.querySelector(".swiper-slide-active .hero-text-box");
				      t &&
				        Jr.fromTo(
				          t,
				          {
				            autoAlpha: 0,
				            y: 20,
				          },
				          {
				            autoAlpha: 1,
				            y: 0,
				            duration: 0.5,
				            delay: 0.3,
				          }
				        );
				    },
				    slideChangeTransitionStart: function () {
				      const t = document.querySelector(".swiper-slide-active .hero-text-box"),
				        e = document.querySelector(".swiper-slide-active .hero-slide-bg");
				      t &&
				        Jr.to(t, {
				          autoAlpha: 0,
				          duration: 0.25,
				        });
				      e &&
				        Jr.fromTo(
				          e,
				          {
				            x: 0,
				          },
				          {
				            x: 0,
				          }
				        );
				    },
				    slideChangeTransitionEnd: function () {
				      const t = document.querySelector(".swiper-slide-active .hero-text-box");
				      t &&
				        Jr.fromTo(
				          t,
				          {
				            autoAlpha: 0,
				            y: 20,
				          },
				          {
				            autoAlpha: 1,
				            y: 0,
				            duration: 0.5,
				          }
				        );
				    },
				  },
				});

				const t = new Swiper(".feedback-swiper", {
					centeredSlides: !0,
					centeredSlidesBounds: !0,
					initialSlide: 4,
					on: {
						click(e) {
							console.log("event.target", this.clickedIndex), t.slideTo(this.clickedIndex)
						}
					},
					pagination: {
						el: ".feedback-pagination",
						clickable: !0
					},
					breakpoints: {
						768: {
							slidesPerView: 1,
							spaceBetween: 30
						},
						1024: {
							slidesPerView: 2,
							spaceBetween: 30
						},
						1280: {
							slidesPerView: 2,
							spaceBetween: 30
						}
					}
				});
				new Swiper(".gallerySwiper", {
					loop: !0,
					centeredSlides: !0,
					autoplay: {
						delay: 2500,
						disableOnInteraction: !1
					},
					pagination: {
						el: ".gallery-pagination",
						clickable: !0
					}
				})
			} else console.warn("Swiper library is not available on this page.")
		})), ["contactForm", "contactForm1", "contactForm2", "contactForm3", "contactForm4", "contactForm5"].forEach((t => {
			const e = document.getElementById(t);
			if (e) {
				function n(t, e, n) {
					const r = document.getElementById(e),
						i = document.createElement("div");
					i.className = "error", i.textContent = n, r.parentElement.appendChild(i)
				}

				function r(t) {
					t.querySelectorAll(".error").forEach((function(t) {
						t.remove()
					}))
				}
				e.addEventListener("submit", (function(i) {
					i.preventDefault(), r(e);
					let s = !1;
					const o = t.replace("contactForm", ""),
						a = document.getElementById(`name${o}`).value.trim(),
						l = document.getElementById(`email${o}`).value.trim(),
						u = document.getElementById(`phone${o}`).value.trim(),
						c = document.getElementById(`message${o}`).value.trim();
					if ("" === a && (n(0, `name${o}`, "Name is required."), s = !0), "" === l ? (n(0, `email${o}`, "Email address is required."), s = !0) : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(l) || (n(0, `email${o}`, "Please enter a valid email address."), s = !0), "" === u ? (n(0, `phone${o}`, "Phone number is required."), s = !0) : /^\d{11}$/.test(u) || (n(0, `phone${o}`, "Phone number must be 11 digits."), s = !0), "" === c && (n(0, `message${o}`, "Message is required."), s = !0), !s) {
						const t = document.getElementById(`successMessage${o}`);
						t && (t.textContent = "Thank you for contacting us!", t.style.color = "green", t.style.fontFamily = "var(--font-family-spartan)", t.style.fontWeight = "bold", t.style.textAlign = "center", t.style.marginTop = "15px"), e.reset()
					}
				}))
			} else console.warn(`Form with ID "${t}" not found on the page.`)
		})),
		function() {
			const t = document.getElementById("submit-btn");
			t ? t.addEventListener("click", (function() {
				const t = document.getElementById("emailInput").value,
					e = document.getElementById("error-message");
				/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t) ? (e.style.visibility = "hidden", alert("Thank you for subscribing!")) : (e.textContent = "Please enter a valid email address.", e.style.visibility = "visible")
			})) : console.warn("Submit button not available on this page.")
		}(),
		function() {
			const t = document.getElementById("videoTrigger"),
				e = document.querySelector(".close-btn"),
				n = document.getElementById("videoModal"),
				r = document.getElementById("videoIframe");
			t ? t.addEventListener("click", (function(t) {
				t.preventDefault(), r && (r.src = "https://www.youtube.com/embed/kLLYnXcDth4?si=20M2T8r8wmrjikPA"), n && (n.style.display = "block")
			})) : console.warn("Video trigger element not found on this page."), e ? e.addEventListener("click", (function() {
				n && (n.style.display = "none"), r && (r.src = "")
			})) : console.warn("Close button not found on this page."), n ? window.addEventListener("click", (function(t) {
				t.target == n && (n.style.display = "none", r && (r.src = ""))
			})) : console.warn("Modal not found on this page.")
		}(),
		function() {
			let t = document.getElementsByClassName("accordion");
			if (t.length > 0)
				for (let e = 0; e < t.length; e++) t[e].addEventListener("click", (function() {
					for (let e = 0; e < t.length; e++)
						if (t[e] !== this) {
							t[e].classList.remove("active");
							let n = t[e].querySelector(".accordian-plus-icon"),
								r = t[e].querySelector(".accordian-minus-icon");
							n && r && (n.style.display = "inline", r.style.display = "none");
							let i = t[e].nextElementSibling;
							i.classList.contains("open") && (i.classList.remove("open"), i.style.maxHeight = null)
						} this.classList.toggle("active");
					let e = this.querySelector(".accordian-plus-icon"),
						n = this.querySelector(".accordian-minus-icon");
					e && n && ("none" === e.style.display ? (e.style.display = "inline", n.style.display = "none") : (e.style.display = "none", n.style.display = "inline"));
					let r = this.nextElementSibling;
					r.classList.contains("open") ? (r.classList.remove("open"), r.style.maxHeight = null) : (r.classList.add("open"), r.style.maxHeight = r.scrollHeight + "px")
				}));
			else console.warn("No accordion elements found on this page.")
		}(),
		function() {
			const t = ["showCardTab1", "showCardTab2", "showCardTab3"],
				e = ["card1", "card2", "card3"];
			t.every((t => null !== document.getElementById(t))) ? t.forEach(((t, n) => {
				document.getElementById(t).addEventListener("click", (function() {
					! function(t, e) {
						const n = document.getElementById(t),
							r = document.getElementById(e);
						document.querySelectorAll(".toggle-card").forEach((t => t.classList.add("hidden"))), document.querySelectorAll(".tab-links").forEach((t => t.classList.remove("active-tab"))), n.classList.remove("hidden"), r.classList.add("active-tab")
					}(e[n], t)
				}))
			})) : console.warn("One or more tab elements are not available on this page.")
		}(),
		function() {
			if ("undefined" != typeof Isotope) {
				let t = new Isotope(".gallery", {
					itemSelector: ".gallery-item",
					layoutMode: "fitRows"
				});
				const e = document.getElementById("load-more"),
					n = document.querySelectorAll(".gallery-item.hidden");

				function r(t) {
					t.addEventListener("click", (function(e) {
						i(e.target, "button") && (t.querySelector(".is-checked").classList.remove("is-checked"), e.target.classList.add("is-checked"))
					}))
				}

				function i(t, e) {
					return t.matches(e) || t.webkitMatchesSelector(e) || t.msMatchesSelector(e)
				}
				e.addEventListener("click", (() => {
					event.preventDefault();
					let r = 0;
					n.forEach((t => {
						t.classList.contains("hidden") && r < 3 && (t.classList.remove("hidden"), r++)
					})), t.layout(), 0 === document.querySelectorAll(".gallery-item.hidden").length && (e.style.display = "none")
				})), document.querySelector(".filters-button-group").addEventListener("click", (function(e) {
					if (!i(e.target, "button")) return;
					const n = e.target.getAttribute("data-filter");
					t.arrange({
						filter: n
					})
				})), document.querySelectorAll(".button-group").forEach((t => r(t)))
			} else console.warn("Isotope is not available on this page.")
		}(),
		function() {
			const t = document.querySelector(".services-btn");
			t && t.addEventListener("click", (function(t) {
				t.preventDefault();
				const e = document.querySelectorAll(".hidden-item");
				e.length > 0 && (e.forEach((t => {
					t.classList.add("visible")
				})), this.style.display = "none")
			}))
		}(), document.addEventListener("DOMContentLoaded", (function() {
			const t = document.querySelectorAll(".img-gallery .img-block"),
				e = document.querySelector(".img-popup"),
				n = document.querySelector(".popup-image"),
				r = document.querySelector(".close-btn");
			t.length > 0 && (t.forEach((t => {
				t.addEventListener("click", (function() {
					const r = t.querySelector(".dog-img").getAttribute("src");
					n.setAttribute("src", r), e.classList.add("opened")
				}))
			})), r.addEventListener("click", (function() {
				e.classList.remove("opened"), n.setAttribute("src", "")
			})), e.addEventListener("click", (function(t) {
				t.target === e && (e.classList.remove("opened"), n.setAttribute("src", ""))
			})))
		})),
		function() {
			const t = document.querySelectorAll(".service-btn"),
				e = document.querySelectorAll(".service-content-block");
			if (t.length > 0 && e.length > 0) {
				function n(n) {
					e.forEach((t => {
						t.classList.remove("active"), t.style.display = "none"
					})), t.forEach((t => t.classList.remove("active")));
					const r = t[n].getAttribute("data-target"),
						i = document.getElementById(r);
					i && (i.style.display = "block", setTimeout((() => i.classList.add("active")), 10), t[n].classList.add("active"))
				}
				t.forEach(((t, e) => {
					t.addEventListener("click", (t => {
						t.preventDefault(), n(e)
					}))
				})), t[1] && n(1)
			}
		}(),
		function() {
			const t = document.querySelectorAll(".dog-breed-card"),
				e = document.querySelectorAll(".dog-breed-content");
			if (t.length > 0 && e.length > 0) {
				function n(n) {
					e.forEach((t => {
						t.classList.remove("active"), t.style.display = "none"
					})), t.forEach((t => t.classList.remove("active")));
					const r = t[n].getAttribute("data-target"),
						i = document.getElementById(r);
					i && (i.style.display = "block", setTimeout((() => i.classList.add("active")), 10), t[n].classList.add("active"))
				}
				t.forEach(((t, e) => {
					t.addEventListener("click", (t => {
						t.preventDefault(), n(e)
					}))
				})), t[1] && n(1)
			}
		}(),
		function() {
			let t = document.querySelector(".scrollToTopBtn"),
				e = document.documentElement;
			t.addEventListener("click", (function() {
				document.body.lenis.scrollTo(0, {
					duration: 2,
					easing: t => 0 === t ? 0 : 1 === t ? 1 : t < .5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2
				})
			})), document.addEventListener("scroll", (function() {
				var n = e.scrollHeight - e.clientHeight;
				e.scrollTop / n > .15 ? t.classList.add("showBtn") : t.classList.remove("showBtn")
			}))
		}();
	const Aa = [() => {
		const t = new a({
			duration: 1.8
		});
		t.on("scroll", oa.update), Jr.ticker.add((e => {
			t.raf(1e3 * e)
		})), Jr.ticker.lagSmoothing(0), document.body.lenis = t
	}];
	window.addEventListener("load", (() => {
		Aa.forEach((t => t()))
	}));
	const Pa = {
		".hamburger-icon": Ea,
		".hamburger-overlay": Ea,
		".hamburger-close": Ea,
		".navigation-menu.mobile": t => {
			t.target.closest(".back-button") && Ca(t, !0), t.target.parentNode.matches(".menu-item-has-children") && Ca(t)
		},
		".search-icon": t => {
			t.target.closest(".search").classList.toggle("active")
		},
		body: t => {
			const e = document.querySelector(".search.active");
			null == e || t.target.closest(".search") || e.classList.remove("active")
		}
	};
	document.addEventListener("click", (t => {
		for (const [e, n] of Object.entries(Pa)) t.target.closest(e) && n(t)
	})), document.body.addEventListener("mouseenter", (function(t) {
		t.stopPropagation(), t.target.matches(".navigation-menu.desktop > .menu-item-has-children") && Ta(t)
	}), !0), document.body.addEventListener("mouseleave", (function(t) {
		t.stopPropagation(), t.target.matches(".navigation-menu.desktop > .menu-item-has-children") && Ta(t), t.target.matches(".navigation-menu.desktop .sub-menu .sub-menu") && (t => {
			let e = t.target;
			va.hide_menu(e, !1)
		})(t)
	}), !0), document.body.addEventListener("mouseover", (t => {
		t.stopPropagation(), t.target.closest(".navigation-menu.desktop .sub-menu > .menu-item-has-children") && (t => {
			let e = t.target.parentNode.querySelector(".sub-menu");
			va.show_menu(e)
		})(t)
	}), !0), document.body.addEventListener("mouseout", (t => {
		t.target.closest(".navigation-menu.desktop .sub-menu > .menu-item-has-children") && (t => {
			if (t.target.parentNode.contains(t.toElement)) return;
			let e = t.target.parentNode.querySelector(".sub-menu");
			va.hide_menu(e, !1)
		})(t)
	}));
	const La = [Sa];
	window.addEventListener("scroll", (() => {
		La.forEach((t => t()))
	}), {
		passive: !0
	}), [{
		selector: ".full-1, .fill-1",
		rotateTo: 153
	}, {
		selector: ".full-2, .fill-2",
		rotateTo: 90
	}, {
		selector: ".full-3, .fill-3",
		rotateTo: 135
	}, {
		selector: ".full-4, .fill-4",
		rotateTo: 65
	}].forEach((({
		selector: t,
		rotateTo: e
	}) => {
		Jr.fromTo(t, {
			rotation: 0
		}, {
			rotation: e,
			scrollTrigger: {
				trigger: t,
				start: "top 80%",
				toggleActions: "play none none none"
			},
			duration: 2,
			ease: "power2.inOut"
		})
	})), document.querySelectorAll(".inside-circle").forEach(((t, e) => {
		const n = parseInt(t.textContent);
		Jr.fromTo(t, {
			innerText: 0
		}, {
			innerText: n,
			scrollTrigger: {
				trigger: t,
				start: "top 80%",
				toggleActions: "play none none none"
			},
			duration: 2,
			ease: "power2.inOut",
			snap: {
				innerText: 1
			},
			onUpdate: function() {
				t.textContent = Math.round(this.targets()[0].innerText)
			}
		})
	}))
})();