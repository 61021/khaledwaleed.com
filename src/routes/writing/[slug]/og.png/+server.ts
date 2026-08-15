import type { EntryGenerator, RequestHandler } from './$types'
import { formatDate, getPost, posts } from '$lib/posts'
import { layoutHeadline, renderOgPng, writingPalette } from '$lib/server/og'
import { error } from '@sveltejs/kit'

// One social card per essay, prerendered at build time.
export const prerender = true

export const entries: EntryGenerator = () => posts.map(p => ({ slug: p.slug }))

export const GET: RequestHandler = async ({ params }) => {
	const post = getPost(params.slug)
	if (!post)
		throw error(404, 'Post not found')

	const { lines, size } = layoutHeadline(post.title)

	const png = await renderOgPng({
		palette: writingPalette,
		eyebrow: `an essay · ${post.readingTime}`,
		headline: lines,
		headlineSize: size,
		footerLeft: 'khaledwaleed.com',
		footerRight: formatDate(post.date),
	})

	return new Response(png, {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=31536000, immutable',
		},
	})
}
