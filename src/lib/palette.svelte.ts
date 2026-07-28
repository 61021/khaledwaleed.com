// Cross-component signal so the header (or anything else) can open the
// command palette without owning its state.
class PaletteSignal {
	requests = $state(0);
	request() {
		this.requests += 1;
	}
}

export const paletteSignal = new PaletteSignal();
