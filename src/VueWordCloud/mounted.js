import setAnimation from '/utils/setAnimation';

export default function() {
	setAnimation(() => {
		if (this._isDestroyed) {
			return false;
		}
		this.detectElementResize();
	}, 1000);
}
