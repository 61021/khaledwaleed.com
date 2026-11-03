import type { Attachment } from 'svelte/attachments'
import type { BarrelLayout, BarrelOptions, BarrelSlot } from './types'
import { BARREL } from './constants'

const DEG = Math.PI / 180
const FRAME = 1000 / 60
const MOVES: Record<string, [number, number]> = {
	ArrowRight: [1, 0],
	ArrowLeft: [-1, 0],
	ArrowDown: [0, 1],
	ArrowUp: [0, -1],
}

const clamp = (v: number, min: number, max: number): number => Math.min(Math.max(v, min), max)
const mod = (v: number, n: number): number => ((v % n) + n) % n
const fold = (deg: number): number => mod(deg + 180, 360) - 180

/**
 * The showcase as a drum seen from inside: a wall of tiles curving round
 * the camera that turns and scrolls without end. The host's
 * `[data-sources]` children are the tiles; slots clone them as they come
 * round, so a few screens of DOM carry any number of pieces. Clips play
 * only on the tiles near the front once the drum is calm.
 */
export class Barrel {
	#options: BarrelOptions
	#host: HTMLElement | null = null
	#ring: HTMLElement | null = null
	#sources: HTMLElement[] = []
	#pools = new Map<number, HTMLElement[]>()
	#slots: BarrelSlot[] = []
	#layout: BarrelLayout | null = null
	#rotation = 0
	#offset = 0
	#velocity = { angle: 0, y: 0 }
	#target: { angle: number, y: number } | null = null
	#drag: { id: number, x: number, y: number, travel: number, at: number } | null = null
	#frame = 0
	#last = 0
	#front: BarrelSlot | null = null
	#hovered: BarrelSlot | null = null
	#focused = false
	#playing = new Set<HTMLVideoElement>()
	#still: MediaQueryList | null = null

	constructor(options: BarrelOptions) {
		this.#options = options
	}

	attach: Attachment<HTMLElement> = (host) => {
		this.#host = host
		this.#still = matchMedia('(prefers-reduced-motion: reduce)')
		this.#sources = [...host.querySelector('[data-sources]')?.children ?? []] as HTMLElement[]
		const stage = document.createElement('div')
		stage.className = 'barrel-stage'
		stage.setAttribute('aria-hidden', 'true')
		this.#ring = document.createElement('div')
		this.#ring.className = 'barrel-ring'
		stage.append(this.#ring)
		host.append(stage)

		const off = new AbortController()
		const on = { signal: off.signal }
		host.addEventListener('pointerdown', e => this.#down(e), on)
		host.addEventListener('pointermove', e => this.#move(e), on)
		host.addEventListener('pointerup', e => this.#up(e), on)
		host.addEventListener('pointercancel', e => this.#up(e), on)
		host.addEventListener('pointerover', e => this.#hover(e.target), on)
		host.addEventListener('pointerleave', () => this.#hover(null), on)
		host.addEventListener('wheel', e => this.#wheel(e), { signal: off.signal, passive: false })
		host.addEventListener('keydown', e => this.#key(e), on)
		host.addEventListener('focus', () => this.#focus(host.matches(':focus-visible')), on)
		host.addEventListener('blur', () => this.#focus(false), on)
		document.addEventListener('visibilitychange', () => this.#clips(), on)
		document.addEventListener('craftviewer', () => this.#clips(), on)
		const resize = new ResizeObserver(() => this.#measure())
		resize.observe(host)

		return () => {
			off.abort()
			resize.disconnect()
			cancelAnimationFrame(this.#frame)
			this.#frame = 0
			for (const video of this.#playing)
				video.pause()
			this.#playing.clear()
			stage.remove()
			this.#slots = []
			this.#pools.clear()
			this.#front = this.#hovered = null
			this.#host = this.#ring = null
		}
	}

	/** Turns the drum until a copy of this source stands in front. */
	show(source: number): void {
		const l = this.#layout
		const n = this.#sources.length
		if (!l || !n)
			return
		const from = this.#target ?? { angle: this.#rotation, y: this.#offset }
		const c0 = Math.round(from.angle / l.angleStep)
		const r0 = Math.round(from.y / l.stepY)
		const half = Math.floor(n / 2)
		let best = { row: r0, column: c0, cost: Infinity }
		for (let row = r0 - 3; row <= r0 + 3; row++) {
			const column = c0 + mod(source - row * l.across - c0 + half, n) - half
			const cost = Math.abs(column - c0) * l.stepX + Math.abs(row - r0) * l.stepY
			if (cost < best.cost)
				best = { row, column, cost }
		}
		this.#aim(best.column, best.row)
	}

	#aim(column: number, row: number): void {
		const l = this.#layout
		if (!l)
			return
		this.#velocity = { angle: 0, y: 0 }
		this.#target = { angle: column * l.angleStep, y: row * l.stepY }
		this.#wake()
	}

	#measure(): void {
		const host = this.#host
		if (!host)
			return
		const { width: w, height: h } = host.getBoundingClientRect()
		if (!w || !h)
			return
		const b = BARREL
		const width = Math.min(b.width, Math.max(60, w * 0.42))
		const height = width / b.aspect
		const stepX = width + b.gap
		const stepY = height + b.gap
		const radius = stepX / (2 * Math.tan(Math.PI / b.columns))
		// The tiles nearest the camera, edge-on at the sides, stay short of the lens.
		const lift = (h * 0.75 + height / 2) * Math.abs(Math.sin(b.tilt * DEG))
		const edge = (width / 2) * Math.sin(b.grazing * DEG) - radius * Math.cos(b.grazing * DEG) + lift
		const anchorZ = Math.min(b.perspective - b.dolly * radius, b.perspective - Math.max(b.perspective / 8, 48) - edge)
		const scale = b.perspective / Math.max(1, b.perspective - (anchorZ - radius))
		this.#layout = {
			stepX,
			stepY,
			angleStep: 360 / b.columns,
			radius,
			anchorZ,
			rows: Math.max(3, Math.ceil(h / scale / stepY) + b.overscan * 2),
			across: Math.max(1, Math.ceil(Math.sqrt(this.#sources.length))),
			degPerPx: 1 / (radius * DEG),
		}
		host.style.setProperty('--tile-width', `${width}px`)
		host.style.setProperty('--tile-height', `${height}px`)
		this.#fill()
		this.#render()
	}

	#fill(): void {
		const l = this.#layout
		const ring = this.#ring
		if (!l || !ring)
			return
		const count = l.rows * BARREL.columns
		while (this.#slots.length > count) {
			const slot = this.#slots.pop()!
			this.#release(slot)
			slot.el.remove()
		}
		while (this.#slots.length < count) {
			const i = this.#slots.length
			const el = document.createElement('div')
			el.className = 'barrel-tile'
			ring.append(el)
			this.#slots.push({ el, angle: (i % BARREL.columns) * l.angleStep, row: Math.floor(i / BARREL.columns), at: null, hidden: null, source: -1, content: null, video: null })
		}
		for (const slot of this.#slots)
			slot.at = null
	}

	#render(): void {
		const l = this.#layout
		const n = this.#sources.length
		if (!l || !this.#ring || !n)
			return
		this.#ring.style.transform = `translate3d(0, 0, ${l.anchorZ.toFixed(2)}px) rotateX(${BARREL.tilt}deg) rotateY(${this.#rotation.toFixed(4)}deg) translateY(${(-this.#offset).toFixed(2)}px)`
		const first = Math.ceil((this.#offset - l.rows * l.stepY * 0.5) / l.stepY)
		const frontRow = Math.round(this.#offset / l.stepY)
		const frontColumn = Math.round(this.#rotation / l.angleStep)
		let front: BarrelSlot | null = null
		for (const slot of this.#slots) {
			const facing = fold(slot.angle + this.#rotation)
			// Columns count rightward on screen; the ring's angles run leftward.
			const column = -Math.round((facing - this.#rotation) / l.angleStep)
			const hidden = Math.abs(facing) > BARREL.grazing
			if (hidden !== slot.hidden) {
				slot.hidden = hidden
				slot.el.style.visibility = hidden ? 'hidden' : ''
			}
			let row = slot.at ?? first + slot.row
			while (row < first)
				row += l.rows
			while (row >= first + l.rows)
				row -= l.rows
			if (row !== slot.at) {
				slot.at = row
				slot.el.style.transform = `translate(-50%, -50%) rotateY(${slot.angle}deg) translate3d(0, ${(row * l.stepY).toFixed(2)}px, ${(-l.radius).toFixed(2)}px)`
			}
			const source = mod(row * l.across + column, n)
			if (source !== slot.source)
				this.#deal(slot, source)
			if (row === frontRow && column === frontColumn)
				front = slot
		}
		if (front !== this.#front) {
			this.#front?.el.removeAttribute('data-front')
			front?.el.setAttribute('data-front', '')
			this.#front = front
		}
		this.#clips()
	}

	#deal(slot: BarrelSlot, source: number): void {
		this.#release(slot)
		const content = this.#pools.get(source)?.pop() ?? this.#clone(source)
		slot.source = source
		slot.content = content
		slot.video = content.querySelector('video')
		slot.el.replaceChildren(content)
	}

	#release(slot: BarrelSlot): void {
		if (!slot.content)
			return
		if (slot.video && this.#playing.delete(slot.video))
			slot.video.pause()
		const pool = this.#pools.get(slot.source) ?? []
		pool.push(slot.content)
		this.#pools.set(slot.source, pool)
		slot.content = slot.video = null
	}

	#clone(source: number): HTMLElement {
		const node = this.#sources[source].cloneNode(true) as HTMLElement
		for (const img of node.querySelectorAll('img'))
			img.loading = 'eager'
		const video = node.querySelector('video')
		if (video) {
			// A clone keeps the attribute, not the property Svelte may have set.
			video.muted = true
			video.addEventListener('playing', () => node.setAttribute('data-playing', ''))
		}
		return node
	}

	/**
	 * Clips play near the front while the drum is calm and hold their frame
	 * while it spins, so decoding never competes with a fling. Under reduced
	 * motion or Save-Data nothing plays on its own: the tile under the
	 * pointer, or the one in front while the drum has focus, does.
	 */
	#clips(): void {
		const l = this.#layout
		if (!l)
			return
		const want = new Set<HTMLVideoElement>()
		const resting = document.hidden || document.documentElement.hasAttribute('data-viewing')
		const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true
		if (!resting && (this.#still?.matches || saveData)) {
			for (const slot of [this.#hovered, this.#focused ? this.#front : null]) {
				if (slot?.video)
					want.add(slot.video)
			}
		}
		else if (!resting) {
			const calm = !this.#drag
				&& Math.abs(this.#velocity.y) < BARREL.calm
				&& Math.abs(this.#velocity.angle) / l.degPerPx < BARREL.calm
			for (const slot of this.#slots) {
				if (!slot.video || slot.hidden || slot.at === null)
					continue
				const near = Math.abs(fold(slot.angle + this.#rotation)) < l.angleStep * 1.5
					&& Math.abs(slot.at * l.stepY - this.#offset) < l.stepY * 1.5
				if (near && calm)
					want.add(slot.video)
			}
		}
		for (const video of this.#playing) {
			if (!want.has(video)) {
				video.pause()
				this.#playing.delete(video)
			}
		}
		for (const video of want) {
			if (this.#playing.has(video))
				continue
			if (!video.getAttribute('src') && video.dataset.src)
				video.src = video.dataset.src
			void video.play().catch(() => {})
			this.#playing.add(video)
		}
	}

	#wake(): void {
		if (!this.#frame)
			this.#frame = requestAnimationFrame(this.#tick)
	}

	#tick = (now: number): void => {
		const k = this.#last ? Math.min(now - this.#last, 64) / FRAME : 1
		this.#last = now
		const moving = this.#step(k)
		this.#render()
		if (moving) {
			this.#frame = requestAnimationFrame(this.#tick)
		}
		else {
			this.#frame = 0
			this.#last = 0
		}
	}

	/** Advances the glide or the turn to a target by k 60Hz frames; false once at rest. */
	#step(k: number): boolean {
		const l = this.#layout
		if (!l)
			return false
		if (this.#drag)
			return true
		const target = this.#target
		if (target) {
			const share = this.#still?.matches ? 1 : 1 - (1 - BARREL.ease) ** k
			this.#rotation += (target.angle - this.#rotation) * share
			this.#offset += (target.y - this.#offset) * share
			if (Math.abs(target.angle - this.#rotation) < 0.01 && Math.abs(target.y - this.#offset) < 0.2) {
				this.#rotation = target.angle
				this.#offset = target.y
				this.#target = null
				return false
			}
			return true
		}
		const v = this.#velocity
		const decay = BARREL.friction ** k
		const max = BARREL.maxSpeed
		v.angle = clamp(v.angle * decay, -max * l.degPerPx, max * l.degPerPx)
		v.y = clamp(v.y * decay, -max, max)
		if (Math.abs(v.angle) < 5e-4)
			v.angle = 0
		if (Math.abs(v.y) < 0.02)
			v.y = 0
		this.#rotation += v.angle * k
		this.#offset += v.y * k
		return v.angle !== 0 || v.y !== 0
	}

	#touched(): void {
		this.#host?.setAttribute('data-touched', '')
	}

	#down(e: PointerEvent): void {
		if (e.button !== 0 || this.#drag || !this.#host)
			return
		this.#host.setPointerCapture(e.pointerId)
		this.#drag = { id: e.pointerId, x: e.clientX, y: e.clientY, travel: 0, at: e.timeStamp }
		this.#velocity = { angle: 0, y: 0 }
		this.#target = null
		this.#host.setAttribute('data-dragging', '')
		this.#touched()
		this.#wake()
	}

	#move(e: PointerEvent): void {
		const drag = this.#drag
		const l = this.#layout
		if (drag?.id !== e.pointerId || !l)
			return
		const dx = e.clientX - drag.x
		const dy = e.clientY - drag.y
		const frames = clamp(e.timeStamp - drag.at, 4, 50) / FRAME
		drag.x = e.clientX
		drag.y = e.clientY
		drag.travel += Math.abs(dx) + Math.abs(dy)
		drag.at = e.timeStamp
		const angle = -dx * l.degPerPx
		this.#rotation += angle
		this.#offset -= dy
		// The fling speed, per 60Hz frame, half from this move and half from the last.
		this.#velocity = {
			angle: (this.#velocity.angle + angle / frames) / 2,
			y: (this.#velocity.y - dy / frames) / 2,
		}
	}

	#up(e: PointerEvent): void {
		const drag = this.#drag
		if (drag?.id !== e.pointerId)
			return
		this.#drag = null
		this.#host?.removeAttribute('data-dragging')
		if (this.#still?.matches || e.timeStamp - drag.at > BARREL.hold)
			this.#velocity = { angle: 0, y: 0 }
		this.#wake()
		if (e.type !== 'pointerup' || drag.travel > BARREL.slop)
			return
		const slot = this.#slotAt(document.elementFromPoint(e.clientX, e.clientY))
		if (slot && slot === this.#front)
			this.#options.onopen(slot.source)
		else if (slot)
			this.#bring(slot)
	}

	#bring(slot: BarrelSlot): void {
		const l = this.#layout
		if (!l || slot.at === null)
			return
		this.#velocity = { angle: 0, y: 0 }
		this.#target = { angle: this.#rotation - fold(slot.angle + this.#rotation), y: slot.at * l.stepY }
		this.#wake()
	}

	#slotAt(target: EventTarget | null): BarrelSlot | null {
		const el = target instanceof Element ? target.closest('.barrel-tile') : null
		return el ? this.#slots.find(slot => slot.el === el) ?? null : null
	}

	#hover(target: EventTarget | null): void {
		const slot = this.#slotAt(target)
		if (slot === this.#hovered)
			return
		this.#hovered = slot
		this.#clips()
	}

	#focus(on: boolean): void {
		this.#focused = on
		this.#clips()
	}

	#wheel(e: WheelEvent): void {
		const l = this.#layout
		if (!l)
			return
		e.preventDefault()
		// Read before deltaMode: Firefox then reports pixels, not lines.
		const dx = e.deltaX
		const dy = e.deltaY
		const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1
		const angle = dx * unit * BARREL.wheel * l.degPerPx
		const y = dy * unit * BARREL.wheel
		this.#target = null
		this.#touched()
		if (this.#still?.matches) {
			this.#rotation += angle
			this.#offset += y
		}
		else {
			this.#velocity.angle += angle
			this.#velocity.y += y
		}
		this.#wake()
	}

	#key(e: KeyboardEvent): void {
		const l = this.#layout
		const n = this.#sources.length
		if (!l || !n || e.altKey || e.ctrlKey || e.metaKey)
			return
		const at = this.#target ?? { angle: this.#rotation, y: this.#offset }
		const column = Math.round(at.angle / l.angleStep)
		const row = Math.round(at.y / l.stepY)
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault()
			this.#options.onopen(mod(row * l.across + column, n))
			return
		}
		const move = MOVES[e.key]
		if (!move)
			return
		e.preventDefault()
		this.#touched()
		this.#aim(column + move[0], row + move[1])
		this.#options.onfront(mod((row + move[1]) * l.across + column + move[0], n))
	}
}
