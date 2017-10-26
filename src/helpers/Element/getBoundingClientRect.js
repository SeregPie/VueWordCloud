export default function(element) {
	try {
		return element.getBoundingClientRect();
	} catch (error) {
		try {
			let width = element.offsetWidth;
			let height = element.offsetHeight;
			return {width, height};
		} catch (error) {
			return {width: 0, height: 0};
		}
	}
}