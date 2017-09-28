module.exports = {
	'env': {
		'browser': true,
		'es6': true,
		'node': true,
	},
	'extends': 'eslint:recommended',
	'parserOptions': {
		ecmaVersion: 2017,
		sourceType: 'module',
	},
	'rules': {
		'indent': ['warn', 'tab', {SwitchCase: 1}],
		'linebreak-style': ['warn', 'unix'],
		'no-undef': 0,
		'no-unused-vars': 0,
		'quotes': ['warn', 'single'],
		'semi': ['warn', 'always'],
	},
};