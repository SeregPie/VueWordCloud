import VueWordCloud from './VueWordCloud';

{
	let {window} = globalThis;
	if (window) {
		let {Vue} = window;
		if (Vue) {
			Vue.defineComponent(VueWordCloud.name, VueWordCloud);
		}
	}
}

export default VueWordCloud;
