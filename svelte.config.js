import adapter from '@sveltejs/adapter-cloudflare'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { mdsvex } from 'mdsvex'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess(), mdsvex()],
	kit: {
		// A phone tab outlives deploys, and with every chunk immutable-cached
		// nothing ever fails loudly enough for SvelteKit's own fallback: the
		// tab kept hanging retired canvases for days. Poll for new builds;
		// the layout hard-navigates once `updated` flips.
		version: { pollInterval: 300_000 },
		// Keep _routes.json under Cloudflare's 100-rule limit. The default
		// `<files>` token lists every static asset individually (440+ posters),
		// which overflows. Instead collapse the asset folders into wildcards.
		adapter: adapter({
			routes: {
				include: ['/*'],
				exclude: [
					'<build>',
					'<prerendered>',
					'/paintings/*',
					'/logos/*',
					'/audio/*',
					'/.well-known/*',
					'/avatar.svg',
					'/favicon.svg',
					'/apple-touch-icon.png',
					'/icon-192.png',
					'/icon-512.png',
					'/khaled-waleed.jpg',
					'/khaled-waleed-480.jpg',
					'/khaled-waleed.avif',
					'/khaled-waleed-480.avif',
					'/khaled-waleed.webp',
					'/khaled-waleed-480.webp',
					'/humans.txt',
					'/llms.txt',
					'/rss.xsl',
					'/manifest.webmanifest',
				],
			},
		}),
	},
	extensions: ['.svelte', '.svx'],
}

export default config
