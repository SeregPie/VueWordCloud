import Function_stubArray from 'x/src/Function/stubArray';

export default {
	words: {
		type: Array,
		default: Function_stubArray,
	},

	text: {
		type: [String, Function],
		default: '',
	},

	weight: {
		type: [Number, Function],
		default: 1,
	},

	rotation: {
		type: [Number, Function],
		default: 0,
	},

	rotationUnit: {
		type: [String, Function],
		default: 'turn',
	},

	fontFamily: {
		type: [String, Function],
		default: 'serif',
	},

	fontStyle: {
		type: [String, Function],
		default: 'normal',
	},

	fontVariant: {
		type: [String, Function],
		default: 'normal',
	},

	fontWeight: {
		type: [String, Function],
		default: 'normal',
	},

	color: {
		type: [String, Function, Array],
		default: 'Black',
	},

	spacing: {
		type: Number,
		default: 0,
	},

	fontSizeRatio: {
		type: Number,
		default: 0,
	},

	maxFontSize: {
		type: Number,
		default: Infinity,
	},

	animationDuration: {
		type: Number,
		default: 5000,
	},

	animationEasing: {
		type: String,
		default: 'ease',
	},

	createCanvas: {
		type: Function,
		default() {
			return document.createElement('canvas');
		},
	},

	loadFont: {
		type: Function,
		default(fontFamily, fontStyle, fontWeight, text) {
			return document.fonts.load([fontStyle, fontWeight, '1px', fontFamily].join(' '), text);
		},
	},

	createWorker: {
		type: Function,
		default(code) {
			return new Worker(URL.createObjectURL(new Blob([code])));
		},
	},
};
