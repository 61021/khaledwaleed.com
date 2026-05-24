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
		slug: 'in-defense-of-melancholy',
		title: 'In defense of melancholy',
		description:
			'On Friedrich, Shakespeare, Swan Lake, and what a culture loses when it decides sadness is a bug to be fixed.',
		date: '2026-05-24',
		readingTime: '3 min read',
		tags: ['art', 'philosophy', 'culture']
	},
	{
		slug: 'sitting-in-discomfort-on-purpose',
		title: 'Sitting in discomfort on purpose',
		description:
			'The small, private, unglamorous habit of being slightly uncomfortable every day — and what it buys you when the involuntary discomforts arrive.',
		date: '2026-05-23',
		readingTime: '3 min read',
		tags: ['discipline', 'body', 'philosophy']
	},
	{
		slug: 'absurdism-without-nihilism',
		title: 'Absurdism without nihilism',
		description:
			'Camus is read badly more often than he is read well. A short defense of the harder reading — the one that asks you to keep pushing the rock.',
		date: '2026-05-22',
		readingTime: '3 min read',
		tags: ['philosophy', 'camus', 'meaning']
	}
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
