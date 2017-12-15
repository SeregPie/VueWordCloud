(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.VueWordCloud = factory());
}(this, (function () { 'use strict';

var Array_sample = function(array) {
	return array[Math.floor(array.length * Math.random())];
};

var Function_constant = function(value) {
	return function() {
		return value;
	};
};

var Function_isFunction = function(value) {
	return typeof value === 'function';
};

var Function_noop = function() {};

var Function_stubArray = function() {
	return [];
};

var Object_isObject = function(value) {
	return value && typeof value === 'object';
};

var defaultExport = function defaultExport() {
	this.interrupted = false;
	this.interruptHandlers = new Set();
};

defaultExport.prototype.throwIfInterrupted = function throwIfInterrupted () {
	if (this.interrupted) {
		throw new Error();
	}
};

defaultExport.prototype.interrupt = function interrupt () {
	if (!this.interrupted) {
		this.interrupted = false;
		this.interruptHandlers.forEach(function (handler) {
			handler();
		});
	}
};

defaultExport.prototype.onInterrupt = function onInterrupt (handler) {
	if (this.interrupted) {
		if (!this.interruptHandlers.has(handler)) {
			handler();
		}
	}
	this.interruptHandlers.add(handler);
};

var Object_hasOwn = function(object, key) {
	return Object.prototype.hasOwnProperty.call(object, key);
};

var String_isString = function(value) {
	return typeof value === 'string';
};

var getKeyedPopulatedWords = function(
	originalWords,
	getText,
	getWeight,
	getRotation,
	getFontFamily,
	getFontStyle,
	getFontVariant,
	getFontWeight,
	getColor
) {
	var returns = {};
	originalWords.forEach(function (originalWord) {
		var key;
		var text;
		var weight;
		var rotation;
		var fontFamily;
		var fontStyle;
		var fontVariant;
		var fontWeight;
		var color;
		if (originalWord) {
			if (String_isString(originalWord)) {
				text = originalWord;
			} else
			if (Array.isArray(originalWord)) {
				var assign;
				((assign = originalWord, text = assign[0], weight = assign[1]));
			} else
			if (Object_isObject(originalWord)) {
				var assign$1;
				((assign$1 = originalWord, key = assign$1.key, text = assign$1.text, weight = assign$1.weight, rotation = assign$1.rotation, fontFamily = assign$1.fontFamily, fontStyle = assign$1.fontStyle, fontVariant = assign$1.fontVariant, fontWeight = assign$1.fontWeight, color = assign$1.color));
			}
		}
		if (text === undefined) {
			text = getText(originalWord);
		}
		if (weight === undefined) {
			weight = getWeight(originalWord);
		}
		if (rotation === undefined) {
			rotation = getRotation(originalWord);
		}
		if (fontFamily === undefined) {
			fontFamily = getFontFamily(originalWord);
		}
		if (fontStyle === undefined) {
			fontStyle = getFontStyle(originalWord);
		}
		if (fontVariant === undefined) {
			fontVariant = getFontVariant(originalWord);
		}
		if (fontWeight === undefined) {
			fontWeight = getFontWeight(originalWord);
		}
		if (color === undefined) {
			color = getColor(originalWord);
		}
		if (key === undefined) {
			key = JSON.stringify([
				text,
				fontFamily,
				fontStyle,
				fontVariant,
				fontWeight ]);
		}
		while (Object_hasOwn(returns, key)) {
			key += '!';
		}
		returns[key] = {
			originalWord: originalWord,
			key: key,
			text: text,
			weight: weight,
			rotation: rotation,
			fontFamily: fontFamily,
			fontStyle: fontStyle,
			fontVariant: fontVariant,
			fontWeight: fontWeight,
			color: color,
		};
	});
	return returns;
};

var Math_log2 = function(v) {
	return Math.log(v) / Math.LN2;
};

var Math_ceilPowerOfTwo = function(v) {
	return Math.pow(2, Math.ceil(Math_log2(v)));
};

var Worker_getMessage = function(worker) {
	return new Promise(function(resolve, reject) {
		var dispose;
		var messageHandler = function(event) {
			dispose(event);
			resolve(event.data);
		};
		var errorHandler = function(event) {
			dispose(event);
			reject(event);
		};
		dispose = function(event) {
			event.preventDefault();
			worker.removeEventListener('message', messageHandler);
			worker.removeEventListener('error', errorHandler);
		};
		worker.addEventListener('message', messageHandler);
		worker.addEventListener('error', errorHandler);
	});
};

var Array_min = function(array, iteratee) {
	if (array.length > 0) {
		if (iteratee) {
			array = array.map(iteratee);
		}
		return array.reduce(function (minValue, currentValue) { return Math.min(minValue, currentValue); });
	}
};

var Array_max = function(array, iteratee) {
	if (array.length > 0) {
		if (iteratee) {
			array = array.map(iteratee);
		}
		return array.reduce(function (maxValue, currentValue) { return Math.max(maxValue, currentValue); });
	}
};

var Math_mapLinear = function(x, x0, x1, y0, y1) {
	return y0 + (x - x0) * (y1 - y0) / (x1 - x0);
};

var getWordFontSizes = function(words, fontSizeRatio) {
	var returns = {};
	if (words.length > 0) {
		var minWeight = Array_min(words, function (ref) {
			var weight = ref.weight;

			return weight;
		});
		var maxWeight = Array_max(words, function (ref) {
			var weight = ref.weight;

			return weight;
		});
		if (minWeight < maxWeight && fontSizeRatio > 0 && fontSizeRatio < Infinity) {
			if (fontSizeRatio < 1) {
				fontSizeRatio = 1 / fontSizeRatio;
			}
			words.forEach(function (ref) {
				var key = ref.key;
				var weight = ref.weight;

				returns[key] = Math_mapLinear(weight, minWeight, maxWeight, 1, fontSizeRatio);
			});
		} else
		if (minWeight > 0) {
			words.forEach(function (ref) {
				var key = ref.key;
				var weight = ref.weight;

				returns[key] = weight / minWeight;
			});
		} else {
			var newMinWeight = 1;
			var newMaxWeight = newMinWeight + Math.abs(minWeight) + Math.abs(maxWeight);
			words.forEach(function (ref) {
				var key = ref.key;
				var weight = ref.weight;

				returns[key] = Math_mapLinear(weight, minWeight, maxWeight, newMinWeight, newMaxWeight);
			});
		}
	}
	return returns;
};

var D2_rotateRect = function(width, height, rotation) {
	return [
		Math.ceil((width * Math.abs(Math.cos(rotation)) + height * Math.abs(Math.sin(rotation)))),
		Math.ceil((width * Math.abs(Math.sin(rotation)) + height * Math.abs(Math.cos(rotation)))) ];
};

var Math_turnToRad = function(v) {
	return v * 2 * Math.PI;
};

var getWordElementMeasures = function(
	text,
	fontStyle,
	fontVariant,
	fontWeight,
	fontSize,
	fontFamily,
	rotation
) {
	rotation = Math_turnToRad(rotation);
	var font = [fontStyle, fontVariant, fontWeight, (fontSize + "px"), fontFamily].join(' ');
	/*try {
		await document.fonts.load(font,  text);
	} catch (error) {
		// pass
	}*/
	var ctx = document.createElement('canvas').getContext('2d');
	ctx.font = font;
	var textWidth = ctx.measureText(text).width;
	var textHeight = fontSize;
	var ref = D2_rotateRect(textWidth, textHeight, rotation);
	var rectWidth = ref[0];
	var rectHeight = ref[1];
	var textPadding = Math.max(ctx.measureText('m').width, fontSize);
	var paddingTextWidth = textWidth + 2 * textPadding;
	var paddingTextHeight = textHeight + 2 * textPadding;
	var ref$1 = D2_rotateRect(paddingTextWidth, paddingTextHeight, rotation);
	var safeRectWidth = ref$1[0];
	var safeRectHeight = ref$1[1];
	return [textWidth, textHeight, rectWidth, rectHeight, safeRectWidth, safeRectHeight];
};

var getWordImage = function(
	text,
	fontStyle,
	fontVariant,
	fontWeight,
	fontSize,
	fontFamily,
	imageWidth,
	imageHeight,
	rotation
) {
	rotation = Math_turnToRad(rotation);
	var font = [fontStyle, fontVariant, fontWeight, (fontSize + "px"), fontFamily].join(' ');
	var ctx = document.createElement('canvas').getContext('2d');
	ctx.canvas.width = imageWidth;
	ctx.canvas.height = imageHeight;
	ctx.translate(imageWidth / 2, imageHeight / 2);
	ctx.rotate(rotation);
	ctx.font = font;
	ctx.shadowColor = '#000000';
	ctx.shadowBlur = fontSize / 32;
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(text, 0, 0);
	var image = new Uint8Array(imageWidth * imageHeight);
	var imageData = ctx.getImageData(0, 0, imageWidth, imageHeight).data;
	for (var i = 0, ii = image.length; i < ii; ++i) {
		image[i] = imageData[i * 4 + 3];
	}
	return image;
};

var getBoundedWordsWorkerContent = URL.createObjectURL(new Blob(["!function(){\"use strict\";var r=function(r,a,t,n,f,e){var i=function(r,a,t){for(var n=[],f=0;f<a;++f)for(var e=0;e<t;++e)r[a*e+f]&&n.push([f,e]);return n}(n,f,e);return function(r,a,t){if(r>0&&a>0){var n,f;r>a?(n=1,f=a/r):a>r?(f=1,n=r/a):n=f=1;var e=Math.floor(r/2),i=Math.floor(a/2),o=r-e,v=a-i;if(e<o)for(var u=e;u<=o;++u){var c=[u,i];if(t(c))return c}else if(i<v)for(var h=i;h<=v;++h){var s=[e,h];if(t(s))return s}for(var g=e,l=i,M=o,m=v;o<r||v<a;){e-=n,i-=f,o+=n,v+=f;var p=Math.floor(e),d=Math.floor(i),w=Math.ceil(o),y=Math.ceil(v);if(w>M)for(var A=d;A<y;++A){var k=[w,A];if(t(k))return k}if(y>m)for(var H=w;H>p;--H){var L=[H,y];if(t(L))return L}if(p<g)for(var U=y;U>d;--U){var W=[p,U];if(t(W))return W}if(d<l)for(var b=p;b<w;++b){var j=[b,d];if(t(j))return j}g=p,l=d,M=w,m=y}}}(a-f,t-e,function(t){for(var n=t[0],f=t[1],e=0,o=i.length;e<o;++e){var v=i[e],u=v[0],c=v[1];if(r[a*(c+f)+(u+n)])return!1}return!0})},a=function(r,a,t,n){for(var f=a/n,e=t/n,i=new Uint8Array(f*e),o=0;o<f;++o)for(var v=0;v<e;++v)r:for(var u=0;u<n;++u)for(var c=0;c<n;++c){var h=r[a*(v*n+c)+(o*n+u)];if(h){i[f*v+o]=h;break r}}return[i,f,e]},t=function(r,a,t,n,f,e,i,o){for(var v=0;v<i;++v)for(var u=0;u<o;++u){var c=e[i*u+v];if(c){r[a*(u+f)+(v+n)]=c}}};self.addEventListener(\"message\",function(n){var f,e=n.data,i=e.words,o=e.containerAspect,v=e.aaaa;i=(i=function(r,a){return r.map(function(r){return[a(r),r]}).sort(function(r,a){var t=r[0],n=a[0];return t>n?1:t<n?-1:0}).map(function(r){return r[1]})}(i=i.map(function(r){var a=r.imageWidth,t=r.imageHeight,n=function(r){return Math.log(r)/Math.LN2}(Math.min(a,t)/Math.pow(v,2));return Object.assign({cccc:n},r)}),function(r){return-r.cccc})).map(function(n){for(var e=n.key,i=n.rectWidth,v=n.rectHeight,u=n.image,c=n.imageWidth,h=n.imageHeight,s=n.cccc,g=[[u,c,h]],l=1;l<s;++l){var M;u=(M=a(u,c,h,2))[0],c=M[1],h=M[2],g.push([u,c,h])}if(void 0===f){var m=Math.pow(2,16),p=Math.floor(Math.sqrt(o*m)),d=Math.floor(m/p),w=new Uint8Array(p*d);f=[[w,p,d]];for(var y=1;y<g.length;++y)p*=2,d*=2,w=new Uint8Array(p*d),f.unshift([w,p,d])}var A=f[g.length-1],k=A[0],H=A[1],L=A[2],U=r(k,H,L,u,c,h),W=U[0],b=U[1];t(k,H,0,W,b,u,c,h);for(var j=g.length-1;j-- >0;){W*=2,b*=2;var q;k=(q=f[j])[0],H=q[1],L=q[2];var E;u=(E=g[j])[0],c=E[1],h=E[2],t(k,H,0,W,b,u,c,h)}return{key:e,rectLeft:W+(c-i)/2,rectTop:b+(h-v)/2}}),self.postMessage(i)})}();\n"]));

var aaaa = 4; // renameMe

var getBoundedWords = function(context, words, containerWidth, containerHeight, fontSizeRatio) {
	if (containerWidth > 0 && containerHeight > 0) {
		if (words.length > 0) {
			var containerAspect = containerWidth / containerHeight;
			var wordFontSizes = getWordFontSizes(words, fontSizeRatio);
			words = words.map(function (word) {
				var key = word.key;
				var text = word.text;
				var rotation = word.rotation;
				var fontFamily = word.fontFamily;
				var fontStyle = word.fontStyle;
				var fontVariant = word.fontVariant;
				var fontWeight = word.fontWeight;
				var fontSize = Math.pow(aaaa - 1, 2) * wordFontSizes[key] + 1;
				var ref = getWordElementMeasures(
					text,
					fontStyle,
					fontVariant,
					fontWeight,
					fontSize,
					fontFamily,
					rotation
				);
				var textWidth = ref[0];
				var textHeight = ref[1];
				var rectWidth = ref[2];
				var rectHeight = ref[3];
				var safeRectWidth = ref[4];
				var safeRectHeight = ref[5];
				var imageWidth = Math_ceilPowerOfTwo(safeRectWidth);
				var imageHeight = Math_ceilPowerOfTwo(safeRectHeight);
				var image = getWordImage(
					text,
					fontStyle,
					fontVariant,
					fontWeight,
					fontSize,
					fontFamily,
					imageWidth,
					imageHeight,
					rotation
				);
				return Object.assign({
					fontSize: fontSize,
					textWidth: textWidth,
					textHeight: textHeight,
					rectWidth: rectWidth,
					rectHeight: rectHeight,
					image: image,
					imageWidth: imageWidth,
					imageHeight: imageHeight,
				}, word);
			});
			var getBoundedWordsWorker = new Worker(getBoundedWordsWorkerContent);
			context.onInterrupt(function () {
				getBoundedWordsWorker.terminate();
			});
			getBoundedWordsWorker.postMessage({
				words: words.map(function (ref) {
					var key = ref.key;
					var rectWidth = ref.rectWidth;
					var rectHeight = ref.rectHeight;
					var image = ref.image;
					var imageWidth = ref.imageWidth;
					var imageHeight = ref.imageHeight;

					return ({
					key: key,
					rectWidth: rectWidth,
					rectHeight: rectHeight,
					image: image,
					imageWidth: imageWidth,
					imageHeight: imageHeight,
				});
			}),
				containerAspect: containerAspect,
				aaaa: aaaa,
			});
			return Worker_getMessage(getBoundedWordsWorker)
				.then(function (value) {
					var keyedWords = {};
					words.forEach(function (word) {
						var key = word.key;
						keyedWords[key] = word;
					});
					value.forEach(function (value) {
						var key = value.key;
						Object.assign(keyedWords[key], value);
					});
					return words;
				})
				.finally(function () {
					getBoundedWordsWorker.terminate();
				});
		}
	}
	return [];
};

var getScaledBoundedWords = function(words, containerWidth, containerHeight, maxFontSize) {
	var containedLeft = Array_min(words, function (ref) {
		var rectLeft = ref.rectLeft;

		return rectLeft;
	});
	var containedRight = Array_max(words, function (ref) {
		var rectLeft = ref.rectLeft;
		var rectWidth = ref.rectWidth;

		return rectLeft + rectWidth;
	});
	var containedWidth = containedRight - containedLeft;

	var containedTop = Array_min(words, function (ref) {
		var rectTop = ref.rectTop;

		return rectTop;
	});
	var containedBottom = Array_max(words, function (ref) {
		var rectTop = ref.rectTop;
		var rectHeight = ref.rectHeight;

		return rectTop + rectHeight;
	});
	var containedHeight = containedBottom - containedTop;

	var scaleFactor = Math.min(containerWidth / containedWidth, containerHeight / containedHeight);

	var currentMaxFontSize = Array_max(words, function (ref) {
		var fontSize = ref.fontSize;

		return fontSize;
	}) * scaleFactor;
	if (currentMaxFontSize > maxFontSize) {
		scaleFactor *= maxFontSize / currentMaxFontSize;
	}

	return words.map(function (word) {
		var fontSize = word.fontSize;
		var textWidth = word.textWidth;
		var textHeight = word.textHeight;
		var rectLeft = word.rectLeft;
		var rectTop = word.rectTop;
		var rectWidth = word.rectWidth;
		var rectHeight = word.rectHeight;

		fontSize *= scaleFactor;
		textWidth *= scaleFactor;
		textHeight *= scaleFactor;
		rectLeft = (rectLeft - (containedLeft + containedRight) / 2) * scaleFactor + containerWidth / 2;
		rectTop = (rectTop - (containedTop + containedBottom) / 2) * scaleFactor + containerHeight / 2;
		rectWidth *= scaleFactor;
		rectHeight *= scaleFactor;

		return Object.assign({}, word, {
			fontSize: fontSize,
			textWidth: textWidth,
			textHeight: textHeight,
			rectLeft: rectLeft,
			rectTop: rectTop,
			rectWidth: rectWidth,
			rectHeight: rectHeight,
		});
	});
};

var render = function(
	createElement,
	scopedSlots,
	words,
	animationDuration
) {
	return createElement(
		'div',
		{
			style: {
				position: 'relative',
				width: '100%',
				height: '100%',
				overflow: 'hidden',
			},
		},
		words.map(function (ref) {
			var originalWord = ref.originalWord;
			var key = ref.key;
			var text = ref.text;
			var weight = ref.weight;
			var rotation = ref.rotation;
			var fontFamily = ref.fontFamily;
			var fontStyle = ref.fontStyle;
			var fontVariant = ref.fontVariant;
			var fontWeight = ref.fontWeight;
			var color = ref.color;
			var fontSize = ref.fontSize;
			var textWidth = ref.textWidth;
			var textHeight = ref.textHeight;
			var rectLeft = ref.rectLeft;
			var rectTop = ref.rectTop;
			var rectWidth = ref.rectWidth;
			var rectHeight = ref.rectHeight;

			return createElement(
				'div',
				{
					key: key,
					style: {
						position: 'absolute',
						top: ((rectTop + rectHeight / 2) + "px"),
						left: ((rectLeft + rectWidth / 2) + "px"),
						transform: ("rotate(" + rotation + "turn)"),
						color: color,
						transitionDuration: ((Math.round(animationDuration)) + "ms"),
						transitionProperty: 'all',
						font: [fontStyle, fontVariant, fontWeight, (fontSize + "px/1"), fontFamily].join(' '),
					},
				},
				[
					createElement(
						'div',
						{
							style: {
								position: 'absolute',
								top: '50%',
								left: '50%',
								transform: 'translate(-50%, -50%)',
								//width: `${textWidth}px`,
								//height: `${textHeight}px`,
								whiteSpace: 'nowrap',
							},
						},
						[
							scopedSlots.default({
								originalWord: originalWord,
								text: text,
								weight: weight,
								rotation: rotation,
								fontFamily: fontFamily,
								fontStyle: fontStyle,
								fontVariant: fontVariant,
								fontWeight: fontWeight,
								color: color,
								fontSize: fontSize,
							}) ]
					) ]
			);
		})
	);
};

var asyncComputed = {
	boundedWords: {
		get: function get(context) {
			return getBoundedWords(
				context,
				this.populatedWords,
				this.containerWidth,
				this.containerHeight,
				this.fontSizeRatio
			);
		},
		default: Function_stubArray,
	}
};

var VueWordCloud = {
	name: 'VueWordCloud',

	props: {
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
			type: [String, Function],
			default: function default$1() {
				var values = [0, 3/4];
				return function() {
					return Array_sample(values);
				};
			},
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
			type: [String, Function],
			default: 'Black',
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

		intervalBetweenUpdateContainerSize: {
			type: Number,
			default: 1000,
		},
	},

	data: function data() {
		var this$1 = this;

		var returns = {
			containerWidth: 0,
			containerHeight: 0,
		};
		Object.entries(asyncComputed).forEach(function (ref) {
			var key = ref[0];
			var def = ref[1];

			var defaultValue = def.default;
			if (Function_isFunction(defaultValue)) {
				defaultValue = defaultValue.call(this$1);
			}
			if (Object_isObject(defaultValue)) {
				defaultValue = Object.freeze(defaultValue);
			}
			returns['fulfilled$' + key] = defaultValue;
		});
		return returns;
	},

	computed: {
		getText: function getText() {
			var value = this.text;
			return Function_isFunction(value) ? value : Function_constant(value);
		},

		getWeight: function getWeight() {
			var value = this.weight;
			return Function_isFunction(value) ? value : Function_constant(value);
		},

		getRotation: function getRotation() {
			var value = this.rotation;
			return Function_isFunction(value) ? value : Function_constant(value);
		},

		getFontFamily: function getFontFamily() {
			var value = this.fontFamily;
			return Function_isFunction(value) ? value : Function_constant(value);
		},

		getFontStyle: function getFontStyle() {
			var value = this.fontStyle;
			return Function_isFunction(value) ? value : Function_constant(value);
		},

		getFontVariant: function getFontVariant() {
			var value = this.fontVariant;
			return Function_isFunction(value) ? value : Function_constant(value);
		},

		getFontWeight: function getFontWeight() {
			var value = this.fontWeight;
			return Function_isFunction(value) ? value : Function_constant(value);
		},

		getColor: function getColor() {
			var value = this.color;
			return Function_isFunction(value) ? value : Function_constant(value);
		},

		keyedPopulatedWords: function keyedPopulatedWords() {
			return getKeyedPopulatedWords(
				this.words,
				this.getText,
				this.getWeight,
				this.getRotation,
				this.getFontFamily,
				this.getFontStyle,
				this.getFontVariant,
				this.getFontWeight,
				this.getColor
			);
		},

		populatedWords: function populatedWords() {
			return Object.values(this.keyedPopulatedWords);
		},

		scaledBoundedWords: function scaledBoundedWords() {
			return getScaledBoundedWords(
				this.boundedWords,
				this.containerWidth,
				this.containerHeight,
				this.maxFontSize
			);
		},

		startToUpdateContainerSize: function startToUpdateContainerSize() {
			return function() {
				var this$1 = this;

				if (!this._isDestroyed) {
					setTimeout(function () {
						requestAnimationFrame(function () {
							this$1.startToUpdateContainerSize();
						});
					}, this.intervalBetweenUpdateContainerSize);
					this.updateContainerSize();
				}
			};
		},
	},

	beforeCreate: function beforeCreate() {
		var this$1 = this;

		Object.entries(asyncComputed).forEach(function (ref) {
			var key = ref[0];
			var def = ref[1];

			var errorHandler = def.errorHandler || Function_noop;
			this$1.$options.computed[key] = function() {
				var this$1 = this;

				Promise
					.resolve(this['promised$' + key])
					.then(function (value) {
						if (Object_isObject(value)) {
							value = Object.freeze(value);
						}
						this$1['fulfilled$' + key] = value;
					})
					.catch(errorHandler);
				return this['fulfilled$' + key];
			};
			var outerContext = new defaultExport();
			this$1.$options.computed['promised$' + key] = function() {
				var this$1 = this;

				outerContext.interrupt();
				var innerContext = (outerContext = new defaultExport());
				return Promise
					.resolve(def.get.call(this, innerContext))
					.then(function (value) {
						if (this$1._isDestroyed) {
							throw new Error();
						}
						innerContext.throwIfInterrupted();
						return value;
					});
			};
		});
	},

	mounted: function mounted() {
		this.startToUpdateContainerSize();
	},

	methods: {
		updateContainerSize: function updateContainerSize() {
			var ref = this.$el.getBoundingClientRect();
			var width = ref.width;
			var height = ref.height;
			this.containerWidth = width;
			this.containerHeight = height;
		},
	},

	render: function render$1(createElement) {
		return render(
			createElement,
			Object.assign({
				default: function (ref) {
					var text = ref.text;

					return text;
		},
			}, this.$scopedSlots),
			this.scaledBoundedWords,
			this.animationDuration
		);
	},
};

if (typeof window !== 'undefined' && window.Vue) {
	window.Vue.component(VueWordCloud.name, VueWordCloud);
}

return VueWordCloud;

})));
