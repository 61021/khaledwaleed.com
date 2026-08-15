import antfu from '@antfu/eslint-config'

export default antfu(
	{
		svelte: true,
		formatters: true,
		// The repo has been tab-indented since day one; ESLint can't re-indent
		// Svelte markup, so converting to spaces isn't worth the churn.
		stylistic: { indent: 'tab' },
		ignores: ['static/**'],
	},
	{
		rules: {
			// Prettier wrapped long values as tab indentation + space alignment;
			// smart-tabs accepts that instead of re-wrapping the whole repo.
			'style/no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
		},
	},
	{
		files: ['**/*.svelte'],
		rules: {
			// This site deploys at the domain root with no base path, so wrapping
			// every href in resolve() buys nothing and costs readability.
			'svelte/no-navigation-without-resolve': 'off',
			// Handlers in one section reference runes state declared in a later
			// section; TS still reports any real use-before-init.
			'no-use-before-define': 'off',
		},
	},
)
