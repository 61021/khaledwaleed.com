// The house sound system: a glass-tap interaction kit synthesised
// through WebAudio, and a Chopin nocturne looping quietly underneath.
// Browsers refuse sound before a real user gesture, so init() listens
// for the first one and keeps trying until playback truly starts; the
// layout persists across client navigations, so the music never
// restarts mid-visit. One switch (the header note glyph, or "m")
// rules both layers; "off" is remembered in localStorage, and the
// position survives full reloads through sessionStorage.
import { browser } from '$app/environment'

const STORAGE_KEY = 'kw-sound'
const POSITION_KEY = 'kw-music-position'
const MUSIC_VOLUME = 0.03

// One public-domain Musopen recording, fetched via Wikimedia Commons;
// credited in humans.txt. The E minor nocturne, on a loop.
const TRACK = '/audio/nocturne-op72-no1.mp3'

// The gestures Chrome counts as user activation. Scrolling is
// deliberately not one of them, so the first click, tap, or keypress
// is the earliest any browser lets the music begin.
const GESTURES = ['pointerdown', 'keydown', 'touchend', 'click'] as const

type Tick = 'tap' | 'open' | 'close'

class SoundSystem {
	enabled = $state(true)

	private ctx: AudioContext | null = null
	private master: GainNode | null = null
	private music: HTMLAudioElement | null = null
	private settled = false
	private armed = false
	private unlisten: (() => void) | null = null
	private fadeFrame = 0
	private lastTick = 0
	private swellTimer: ReturnType<typeof setTimeout> | undefined

	/**
	 * Call once from the root layout. Reads the stored preference and
	 * retries on every qualifying gesture until playback has started.
	 */
	init() {
		if (!browser)
			return
		this.enabled = localStorage.getItem(STORAGE_KEY) !== 'off'
		const tryArm = () => this.arm()
		for (const g of GESTURES) addEventListener(g, tryArm, { passive: true })
		this.unlisten = () => {
			for (const g of GESTURES) removeEventListener(g, tryArm)
		}
		addEventListener('pagehide', () => this.savePosition())
	}

	toggle() {
		this.enabled = !this.enabled
		localStorage.setItem(STORAGE_KEY, this.enabled ? 'on' : 'off')
		if (!this.armed) {
			// A toggle click's pointerdown arms first, so this only runs
			// when "off" was toggled before any gesture; nothing to do.
			return
		}
		if (this.enabled) {
			this.chime([[659, 0], [831, 0.06], [988, 0.12]], 0.15, 0.04)
			this.startMusic()
		}
		else {
			this.chime([[294, 0]], 0.18, 0.04)
			this.stopMusic()
		}
	}

	/** The interaction kit. Silent until armed and while switched off. */
	tick(kind: Tick) {
		if (!this.enabled || !this.armed || !this.ctx || !this.master)
			return
		const now = performance.now()
		if (kind === 'tap' && now - this.lastTick < 60)
			return
		this.lastTick = now
		if (kind === 'tap') {
			// A glass tap (tasting pick D): two crystalline sine partials,
			// struck with an instant attack and gone in under 50ms.
			const partials: [number, number, number][] = [
				[1760, 0.032, 0.045],
				[2637, 0.012, 0.03],
			]
			for (const [freq, peak, dur] of partials) {
				const t0 = this.ctx.currentTime
				const osc = this.ctx.createOscillator()
				const gain = this.ctx.createGain()
				osc.type = 'sine'
				osc.frequency.setValueAtTime(freq, t0)
				gain.gain.setValueAtTime(0.0001, t0)
				gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.002)
				gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
				osc.connect(gain).connect(this.master)
				osc.start(t0)
				osc.stop(t0 + dur + 0.02)
			}
		}
		else if (kind === 'open') {
			this.chime([[659, 0], [988, 0.07]], 0.16, 0.038)
		}
		else {
			this.chime([[988, 0], [659, 0.06]], 0.16, 0.032)
		}
	}

	/**
	 * The music leans in: a slow crest above the resting volume, held a
	 * moment, then settled back down. Does nothing unless the nocturne
	 * is already audibly playing; repeated calls restart the crest.
	 */
	swell() {
		if (!this.enabled || !this.armed || !this.music || this.music.paused)
			return
		const el = this.music
		clearTimeout(this.swellTimer)
		this.fadeTo(el, 0.2, 1800, () => {
			this.swellTimer = setTimeout(() => this.fadeTo(el, MUSIC_VOLUME, 3800), 2400)
		})
	}

	/** A small bell figure: sine notes as [frequency, offset] pairs. */
	private chime(notes: [number, number][], dur: number, peak: number) {
		if (!this.ctx || !this.master)
			return
		for (const [freq, at] of notes) {
			const t0 = this.ctx.currentTime + at
			const osc = this.ctx.createOscillator()
			const gain = this.ctx.createGain()
			osc.type = 'sine'
			osc.frequency.setValueAtTime(freq, t0)
			gain.gain.setValueAtTime(0.0001, t0)
			gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.01)
			gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
			osc.connect(gain).connect(this.master)
			osc.start(t0)
			osc.stop(t0 + dur + 0.02)
		}
	}

	/**
	 * Runs on every qualifying gesture until settled. Creating and
	 * resuming the context is idempotent; play() may still be refused
	 * if this gesture did not count, in which case the listeners stay
	 * for the next one. Settled means: context running and, when
	 * enabled, the music audibly playing.
	 */
	private arm() {
		if (this.settled)
			return
		if (!this.ctx) {
			this.ctx = new AudioContext()
			this.master = this.ctx.createGain()
			this.master.gain.value = 0.6
			this.master.connect(this.ctx.destination)
		}
		if (this.ctx.state === 'suspended')
			void this.ctx.resume()
		this.armed = true
		if (!this.enabled) {
			this.settle()
			return
		}
		const el = this.ensureMusic()
		if (!el.paused) {
			this.settle()
			return
		}
		el.volume = 0
		el.play().then(
			() => {
				this.fadeTo(el, MUSIC_VOLUME, 1500)
				this.settle()
			},
			() => {}, // refused: the next gesture retries
		)
	}

	private settle() {
		this.settled = true
		this.unlisten?.()
		this.unlisten = null
	}

	private ensureMusic(): HTMLAudioElement {
		if (this.music)
			return this.music
		const el = new Audio(TRACK)
		el.preload = 'auto'
		el.loop = true
		let resumeAt = 0
		try {
			const saved = JSON.parse(sessionStorage.getItem(POSITION_KEY) ?? 'null')
			resumeAt = Number(saved?.time) || 0
		}
		catch {}
		if (resumeAt > 0) {
			el.addEventListener('loadedmetadata', () => {
				el.currentTime = Math.min(resumeAt, Math.max(0, el.duration - 1))
			}, { once: true })
		}
		this.music = el
		return el
	}

	private startMusic() {
		const el = this.ensureMusic()
		el.volume = el.paused ? 0 : el.volume
		void el.play().catch(() => {})
		this.fadeTo(el, MUSIC_VOLUME, 1500)
	}

	private stopMusic() {
		clearTimeout(this.swellTimer)
		if (!this.music || this.music.paused)
			return
		const el = this.music
		this.fadeTo(el, 0, 500, () => el.pause())
	}

	private fadeTo(el: HTMLAudioElement, target: number, ms: number, done?: () => void) {
		cancelAnimationFrame(this.fadeFrame)
		const from = el.volume
		const start = performance.now()
		const step = (now: number) => {
			const k = Math.min(1, (now - start) / ms)
			el.volume = from + (target - from) * k
			if (k < 1) {
				this.fadeFrame = requestAnimationFrame(step)
			}
			else {
				done?.()
			}
		}
		this.fadeFrame = requestAnimationFrame(step)
	}

	private savePosition() {
		if (!this.music || this.music.paused)
			return
		try {
			sessionStorage.setItem(POSITION_KEY, JSON.stringify({ time: this.music.currentTime }))
		}
		catch {}
	}
}

export const sound = new SoundSystem()
