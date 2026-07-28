import { error } from '@sveltejs/kit';
import { getPost, loadPostComponent, posts } from '$lib/posts';
import type { EntryGenerator, PageLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => posts.map((p) => ({ slug: p.slug }));

export const load: PageLoad = async ({ params }) => {
	const post = getPost(params.slug);
	if (!post) throw error(404, 'Post not found');
	const Content = await loadPostComponent(params.slug);
	if (!Content) throw error(404, 'Post not found');

	// Neighbouring essays (posts are sorted newest-first).
	const idx = posts.findIndex((p) => p.slug === params.slug);
	const pick = (p: (typeof posts)[number]) => ({ slug: p.slug, title: p.title });
	const newer = idx > 0 ? pick(posts[idx - 1]) : null;
	const older = idx >= 0 && idx < posts.length - 1 ? pick(posts[idx + 1]) : null;

	return { post, Content, newer, older };
};
