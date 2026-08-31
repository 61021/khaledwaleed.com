// Seats a node at the end of <body>. The glide (smoother.ts) moves the
// page content by transform, and a transformed ancestor becomes the
// containing block for position: fixed (a CSS rule, not a bug), so the
// few fixed plates step outside it. Use as {@attach portal}.
export function portal(node: HTMLElement): () => void {
	document.body.appendChild(node)
	return () => node.remove()
}
