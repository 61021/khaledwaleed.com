import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { html as toReactNode } from 'satori-html';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { site } from '$lib/site';

export const prerender = true;

const fontsDir = join(process.cwd(), 'node_modules/@fontsource/inter/files');
const interBold = readFileSync(join(fontsDir, 'inter-latin-700-normal.woff'));
const interRegular = readFileSync(join(fontsDir, 'inter-latin-400-normal.woff'));

const markup = `
<div style="display:flex;flex-direction:column;justify-content:space-between;width:1200px;height:630px;padding:80px;background:linear-gradient(135deg,#07090c 0%,#0d1117 100%);color:#e6edf3;font-family:Inter;position:relative;">
	<div style="position:absolute;inset:0;background:radial-gradient(circle at 85% 15%,rgba(52,211,153,0.18),transparent 55%);display:flex;"></div>
	<div style="position:absolute;inset:0;background:radial-gradient(circle at 10% 90%,rgba(103,232,249,0.10),transparent 50%);display:flex;"></div>
	<div style="display:flex;align-items:center;gap:14px;font-size:22px;color:#34d399;font-family:Inter;letter-spacing:0.02em;">
		<div style="width:10px;height:10px;border-radius:9999px;background:#34d399;display:flex;"></div>
		<div style="display:flex;">khaledwaleed.com</div>
	</div>
	<div style="display:flex;flex-direction:column;gap:24px;">
		<div style="display:flex;font-size:88px;font-weight:700;line-height:1.05;letter-spacing:-0.03em;color:#e6edf3;max-width:1000px;">${site.name} — ${site.role}.</div>
		<div style="display:flex;font-size:30px;color:#94a3b8;max-width:900px;line-height:1.4;">Building fast SvelteKit + Go systems from Baghdad, Iraq.</div>
	</div>
	<div style="display:flex;align-items:center;justify-content:space-between;font-size:22px;color:#64748b;font-family:Inter;">
		<div style="display:flex;gap:32px;">
			<div style="display:flex;">SvelteKit</div>
			<div style="display:flex;">Nuxt</div>
			<div style="display:flex;">Go</div>
			<div style="display:flex;">TypeScript</div>
		</div>
		<div style="display:flex;color:#67e8f9;">@61021</div>
	</div>
</div>`;

export const GET = async () => {
	const svg = await satori(toReactNode(markup) as never, {
		width: 1200,
		height: 630,
		fonts: [
			{ name: 'Inter', data: interRegular, weight: 400, style: 'normal' },
			{ name: 'Inter', data: interBold, weight: 700, style: 'normal' }
		]
	});

	const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();

	return new Response(new Uint8Array(png), {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=31536000, immutable'
		}
	});
};
