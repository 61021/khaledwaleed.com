// Flags each item that opens a line in a wrapping list, so the separator
// hanging in front of it can stand down. The separators sit out of the
// flow, so flagging one never moves an item or changes the wrap.
export function lineStarts(list: HTMLElement): () => void {
	function mark() {
		let top: number | undefined
		for (const item of list.children as HTMLCollectionOf<HTMLElement>) {
			item.toggleAttribute('data-line-start', item.offsetTop !== top)
			top = item.offsetTop
		}
	}

	const observer = new ResizeObserver(mark)
	observer.observe(list)
	// A late webfont rewraps the lines without resizing the list.
	void document.fonts.ready.then(mark)
	return () => observer.disconnect()
}
