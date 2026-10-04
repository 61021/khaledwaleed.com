<script lang='ts'>
	const AWAY_TITLE = 'I’ll be here'
	const AWAY_ICON = '/favicon-away.svg'

	let roomTitle = ''
	let roomIcon = ''

	function onVisibilityChange() {
		const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
		if (document.hidden) {
			roomTitle = document.title
			document.title = AWAY_TITLE
			if (icon) {
				roomIcon = icon.href
				icon.href = AWAY_ICON
			}
			return
		}
		// Svelte only writes the title when the room changes, so the
		// room's own title comes back by hand.
		if (document.title === AWAY_TITLE)
			document.title = roomTitle
		if (icon && roomIcon)
			icon.href = roomIcon
	}
</script>

<svelte:document onvisibilitychange={onVisibilityChange} />
