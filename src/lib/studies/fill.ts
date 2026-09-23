import type { Attachment } from 'svelte/attachments'

// Paints how far a range input is along its track into --fill, which
// the studies layout uses for the pen-colored part of the track.
// Chromium has no ::-moz-range-progress, so the track needs the number.
export const fill: Attachment<HTMLInputElement> = (input) => {
	const paint = (): void => {
		const min = Number(input.min || 0)
		const max = Number(input.max || 100)
		const at = ((Number(input.value) - min) / (max - min)) * 100
		input.style.setProperty('--fill', `${Math.min(100, Math.max(0, at))}%`)
	}
	paint()
	input.addEventListener('input', paint)
	return () => input.removeEventListener('input', paint)
}
