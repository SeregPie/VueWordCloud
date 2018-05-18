import VueWordCloud from './VueWordCloud';

if (typeof window !== 'undefined' && window.Vue) {
	window.Vue.component(VueWordCloud.name, VueWordCloud);
}

export default VueWordCloud;
