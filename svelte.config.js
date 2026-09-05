import adapter from '@sveltejs/adapter-cloudflare'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { mdsvex } from 'mdsvex'

// Browser translation happily rewrites `pnpm add` into the reader's own
// language. Mark every code element in the prose as untranslatable.
function untranslatableCode() {
	return (tree) => {
		const walk = (node) => {
			if (node.type === 'element' && (node.tagName === 'code' || node.tagName === 'pre'))
				node.properties = { ...node.properties, translate: 'no' }
			node.children?.forEach(walk)
		}
		walk(tree)
	}
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess(), mdsvex({ rehypePlugins: [untranslatableCode] })],
	kit: {
		// A phone tab outlives deploys, and with every chunk immutable-cached
		// nothing ever fails loudly enough for SvelteKit's own fallback: the
		// tab kept hanging retired canvases for days. Poll for new builds;
		// the layout hard-navigates once `updated` flips.
		version: { pollInterval: 300_000 },
		adapter: adapter(),
	},
	extensions: ['.svelte', '.svx'],
}

export default config
