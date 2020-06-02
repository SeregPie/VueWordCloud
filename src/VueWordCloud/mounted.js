import startAnimationLoop from '../core/startAnimationLoop';

export default function() {
	startAnimationLoop(() => {
		if (this._isDestroyed) {
			return false;
		}
		this.updateElementSize();
	}, 1000);
}
