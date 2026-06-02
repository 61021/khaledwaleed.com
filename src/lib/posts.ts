// Writing index. Posts live as markdown in src/posts/<slug>.svx with YAML
// frontmatter. Metadata is collected eagerly; rendered components load on
// demand from the [slug] route.

import type { Component } from 'svelte';

export interface Post {
	slug: string;
	title: string;
	description: string;
	date: string; // ISO yyyy-mm-dd
	readingTime: string;
	tags: string[];
}

type PostMeta = Omit<Post, 'slug'>;

const metaModules = import.meta.glob<PostMeta>('../posts/*.svx', {
	eager: true,
	import: 'metadata'
});

const componentLoaders = import.meta.glob<{ default: Component }>('../posts/*.svx');

const slugFromPath = (path: string) =>
	path
		.split('/')
		.pop()!
		.replace(/\.svx$/, '');

export const posts: Post[] = Object.entries(metaModules)
	.map(([path, meta]) => ({ slug: slugFromPath(path), ...meta }))
	.sort((a, b) => b.date.localeCompare(a.date));

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

export const loadPostComponent = async (slug: string): Promise<Component | null> => {
	const entry = Object.entries(componentLoaders).find(([path]) => slugFromPath(path) === slug);
	if (!entry) return null;
	const mod = await entry[1]();
	return mod.default;
};
