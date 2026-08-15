import { defineConfig } from 'vitest/config'

// Deliberately not vite.config.ts: the unit tests are plain TS and do not
// need the sveltekit plugin (or a kit sync) to run.
export default defineConfig({
	test: {
		include: ['src/**/*.test.ts'],
	},
})
