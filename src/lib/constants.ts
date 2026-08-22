// PocketBase (records + poster files) lives on the Contabo box behind
// Cloudflare. Kept out of pocketbase.ts so the public film pages can build
// file URLs without pulling the PB SDK into their bundle.
export const PB_URL = 'https://api.khaledwaleed.com'
