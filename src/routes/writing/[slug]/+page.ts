import { error } from '@sveltejs/kit';
import { getPost, posts } from '$lib/posts';
import type { EntryGenerator, PageLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => posts.map((p) => ({ slug: p.slug }));

export const load: PageLoad = async ({ params }) => {
	const post = getPost(params.slug);
	if (!post) throw error(404, 'Post not found');
	return { post };
};
