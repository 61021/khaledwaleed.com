import { describe, expect, it } from 'vitest'
import { legacyPosterTarget } from './legacy-posters'

const base = 'https://api.khaledwaleed.com/api/files/films/co01u9erkri9fcc/vug1dv_di1t_sa60_z8qj_cu_ue7ntk_o_1as85yyjl0.jpg'

describe('legacyPosterTarget', () => {
	it('maps each preconfigured thumb onto its stored width', () => {
		for (const [thumb, width] of [['185x0', 185], ['342x0', 342], ['500x0', 500]] as const) {
			expect(legacyPosterTarget(new URL(`${base}?thumb=${thumb}`))).toBe(
				`https://posters.khaledwaleed.com/films/co01u9erkri9fcc/w${width}/vug1dv_di1t_sa60_z8qj_cu_ue7ntk_o_1as85yyjl0.jpg`,
			)
		}
	})

	it('sends the bare file, and any unlisted thumb, to the master', () => {
		for (const url of [base, `${base}?thumb=100x100`])
			expect(legacyPosterTarget(new URL(url))).toMatch(/\/w780\//)
	})

	it('accepts the collection id form', () => {
		expect(legacyPosterTarget(new URL(base.replace('/films/', '/pbc_95057082/')))).toMatch(/\/w780\//)
	})

	it('ignores everything that was never a poster', () => {
		for (const path of ['/', '/api/health', '/api/collections/films/records', '/_/', '/api/files/films/short/x.jpg'])
			expect(legacyPosterTarget(new URL(path, base))).toBeNull()
	})
})
