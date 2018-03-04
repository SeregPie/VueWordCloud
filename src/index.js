import VueWordCloud from './VueWordCloud';

export default VueWordCloud;

if (typeof window !== 'undefined' && window.Vue) {
	window.Vue.component(VueWordCloud.name, VueWordCloud);
}
