#!/usr/bin/env bun
/**
 * One-time Spotify OAuth helper. Gets a long-lived REFRESH TOKEN so the /music
 * page can read your top tracks & artists.
 *
 * Setup:
 *   1. Create an app at https://developer.spotify.com/dashboard
 *   2. Add this redirect URI to the app:  http://127.0.0.1:8888/callback
 *   3. Put SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env
 *   4. Run:  bun run scripts/spotify-auth.ts
 *   5. Open the printed URL, authorize, and copy the refresh token it prints
 *      into .env (SPOTIFY_REFRESH_TOKEN) and your Cloudflare Pages env vars.
 */
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT = 'http://127.0.0.1:8888/callback';
const SCOPES = 'user-top-read user-read-recently-played';

if (!CLIENT_ID || !CLIENT_SECRET) {
	console.error('✗ Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env first.');
	process.exit(1);
}

const authUrl =
	'https://accounts.spotify.com/authorize?' +
	new URLSearchParams({
		client_id: CLIENT_ID,
		response_type: 'code',
		redirect_uri: REDIRECT,
		scope: SCOPES,
		show_dialog: 'true'
	});

console.log('\n1. Open this URL and authorize:\n');
console.log('   ' + authUrl + '\n');
console.log('Waiting for the redirect on http://127.0.0.1:8888 …\n');

const server = Bun.serve({
	port: 8888,
	async fetch(req) {
		const url = new URL(req.url);
		if (url.pathname !== '/callback') return new Response('Waiting for Spotify…');
		const code = url.searchParams.get('code');
		if (!code) return new Response('No authorization code in the callback.');

		const res = await fetch('https://accounts.spotify.com/api/token', {
			method: 'POST',
			headers: {
				Authorization: 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				grant_type: 'authorization_code',
				code,
				redirect_uri: REDIRECT
			})
		});
		const json = (await res.json()) as { refresh_token?: string; error?: string };

		if (!json.refresh_token) {
			console.error('✗ Token exchange failed:', json);
			return new Response('Failed — see the terminal.');
		}

		// Write the refresh token straight into .env (no copy-paste needed).
		try {
			const envText = await Bun.file('.env')
				.text()
				.catch(() => '');
			const line = `SPOTIFY_REFRESH_TOKEN=${json.refresh_token}`;
			const next = /^SPOTIFY_REFRESH_TOKEN=.*$/m.test(envText)
				? envText.replace(/^SPOTIFY_REFRESH_TOKEN=.*$/m, line)
				: envText.replace(/\n*$/, '\n') + line + '\n';
			await Bun.write('.env', next);
			console.log('\n✓ Wrote SPOTIFY_REFRESH_TOKEN to .env');
		} catch {
			console.log('\n✓ Refresh token (could not write .env automatically):');
			console.log('   ' + json.refresh_token);
		}
		console.log('  Also add it to your Cloudflare Pages environment variables.');
		setTimeout(() => server.stop(), 400);
		return new Response('Done — you can close this tab and return to the terminal.');
	}
});
