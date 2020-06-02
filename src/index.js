import VueWordCloud from './VueWordCloud';

{
	let {window} = globalThis;
	if (window) {
		let {Vue} = window;
		if (Vue) {
			Vue.component(VueWordCloud.name, VueWordCloud);
		}
	}
}

export default VueWordCloud;
