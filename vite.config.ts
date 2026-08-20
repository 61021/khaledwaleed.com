import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Vite+ keys: `vp check`/`vp check --fix` would otherwise run oxfmt/oxlint
// against a tree whose only formatter is eslint --fix. Spread because plain
// Vite's config types don't know these keys.
const vitePlus = {
	check: { fmt: false, lint: false },
}

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	...vitePlus,
})
