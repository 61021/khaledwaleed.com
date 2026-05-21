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
		slug: 'hiring-senior-engineers-in-iraq',
		title: 'Hiring senior engineers in Iraq',
		description:
			'What it actually looks like to find, vet and keep senior software engineers in the Iraqi market — from someone working inside it.',
		date: '2026-05-21',
		readingTime: '5 min read',
		tags: ['hiring', 'iraq', 'engineering management']
	},
	{
		slug: 'the-cost-of-a-slow-page',
		title: 'The cost of a slow page',
		description:
			'Page speed is not a vanity metric. It is a tax on every product decision, every conversion, every retry. A short case for taking it seriously.',
		date: '2026-05-20',
		readingTime: '3 min read',
		tags: ['performance', 'frontend', 'web']
	},
	{
		slug: 'building-for-the-web-from-baghdad',
		title: 'Building for the web from Baghdad',
		description:
			'A few honest notes on shipping production software from Iraq — the tooling, the trade-offs, and what international clients actually want.',
		date: '2026-05-18',
		readingTime: '4 min read',
		tags: ['career', 'iraq', 'remote']
	}
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
