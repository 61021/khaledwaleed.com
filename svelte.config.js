import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess(), mdsvex()],
	kit: {
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
					'/.well-known/*',
					'/avatar.svg',
					'/favicon.svg',
					'/humans.txt',
					'/llms.txt',
					'/manifest.webmanifest'
				]
			}
		})
	},
	extensions: ['.svelte', '.svx']
};

export default config;
