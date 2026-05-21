// Writing index. Add new posts here. Each entry corresponds to a route at
// /writing/<slug>. Keep ordered newest-first.

export interface Post {
	slug: string;
	title: string;
	description: string;
	date: string; // ISO yyyy-mm-dd
	readingTime: string;
	tags: string[];
}

export const posts: Post[] = [
	{
		slug: 'building-for-the-web-from-baghdad',
		title: 'Building for the web from Baghdad',
		description:
			'A few honest notes on shipping production software from Iraq — the tooling, the trade-offs, and what international clients actually want.',
		date: '2026-05-20',
		readingTime: '4 min read',
		tags: ['career', 'iraq', 'remote']
	}
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
