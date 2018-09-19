export default function() {
	let {$el} = this;
	if ($el) {
		this.elementWidth = $el.offsetWidth;
		this.elementHeight = $el.offsetHeight;
	}
}
