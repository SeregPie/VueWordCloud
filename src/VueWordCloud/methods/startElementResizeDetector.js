export default function() {
	requestAnimationFrame(() => {
		if (!this._isDestroyed) {
			setTimeout(() => {
				this.startElementResizeDetector();
			}, 1000);
			this.detectElementResize();
		}
	});
}
