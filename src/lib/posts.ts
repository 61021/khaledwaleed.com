// Writing index. Posts live as markdown in src/posts/<slug>.svx with YAML
// frontmatter. Metadata is collected eagerly; rendered components load on
// demand from the [slug] route.

import type { Component } from 'svelte'

export interface Post {
	slug: string
	title: string
	description: string
	date: string // ISO yyyy-mm-dd
	readingTime: string
	tags: string[]
	typeface?: 'sans' // absent = the serif leaf
}

type PostMeta = Omit<Post, 'slug'>

const metaModules = import.meta.glob<PostMeta>('../posts/*.svx', {
	eager: true,
	import: 'metadata',
})

const componentLoaders = import.meta.glob<{ default: Component }>('../posts/*.svx')

function slugFromPath(path: string) {
	return path
		.split('/')
		.pop()!
		.replace(/\.svx$/, '')
}

export const posts: Post[] = Object.entries(metaModules)
	.map(([path, meta]) => ({
		slug: slugFromPath(path),
		...meta,
		// YAML parses an unquoted `date:` as a timestamp, which mdsvex then
		// serializes as a full ISO string; keep just the yyyy-mm-dd part.
		date: String(meta.date).slice(0, 10),
	}))
	.sort((a, b) => b.date.localeCompare(a.date))

export const getPost = (slug: string) => posts.find(p => p.slug === slug)

export interface Topic {
	name: string
	count: number
}

// Every tag in the corpus, busiest first, ties alphabetical: the
// writing index's filter line.
export const topics: Topic[] = (() => {
	const counts = new Map<string, number>()
	for (const post of posts) {
		for (const tag of post.tags)
			counts.set(tag, (counts.get(tag) ?? 0) + 1)
	}
	return [...counts]
		.map(([name, count]) => ({ name, count }))
		.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
})()

// Pure date helper lives in ./dates so it can be unit-tested without
// dragging in the Vite import.meta.glob above.
export { formatDate } from './dates'

export async function loadPostComponent(slug: string): Promise<Component | null> {
	const entry = Object.entries(componentLoaders).find(([path]) => slugFromPath(path) === slug)
	if (!entry)
		return null
	const mod = await entry[1]()
	return mod.default
}
