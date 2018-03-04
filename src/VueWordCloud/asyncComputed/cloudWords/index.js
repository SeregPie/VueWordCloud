import Array_first from 'x/src/Array/first';
import Array_last from 'x/src/Array/last';
import Function_cast from 'x/src/Function/cast';
import Function_stubArray from 'x/src/Function/stubArray';
import Lang_isUndefined from 'x/src/Lang/isUndefined';
import Math_degToRad from 'x/src/Math/degToRad';
import Math_mapLinear from 'x/src/Math/mapLinear';
import Math_turnToRad from 'x/src/Math/turnToRad';
import Object_isObject from 'x/src/Object/isObject';
import String_isString from 'x/src/String/isString';
import Worker_postMessage from 'x/src/Worker/postMessage';

import getNormalizedFontSizeRatio from './getNormalizedFontSizeRatio';
import getNormalizedAspect from './getNormalizedAspect';
import BoundingWord from './BoundingWord';
import PixelGridWorker from 'stringify!./PixelGridWorker/index.js';

export default {
	get(context) {

		let elementWidth = this.elementWidth;
		let elementHeight = this.elementHeight;
		let elementAspect = getNormalizedAspect([elementWidth, elementHeight]);
		let words = this.words;
		let text = this.text;
		let weight = this.weight;
		let rotation = this.rotation;
		let rotationUnit = this.rotationUnit;
		let fontFamily = this.fontFamily;
		let fontStyle = this.fontStyle;
		let fontVariant = this.fontVariant;
		let fontWeight = this.fontWeight;
		let color = this.color;
		let spacing = this.spacing;
		let fontSizeRatio = getNormalizedFontSizeRatio(this.fontSizeRatio);
		let renderingFontSizeInterval = this.renderingFontSizeInterval;
		let renderingFontSizeBase = this.renderingFontSizeBase;
		let createCanvas = this.createCanvas;
		let loadFont = this.loadFont;
		let createWorker = this.createWorker;

		if (!(elementWidth > 0 && elementHeight > 0)) {
			return [];
		}

		let getDefaultText = Function_cast(text);
		let getDefaultWeight = Function_cast(weight);
		let getDefaultRotation = Function_cast(rotation);
		let getDefaultRotationUnit = Function_cast(rotationUnit);
		let getDefaultFontFamily = Function_cast(fontFamily);
		let getDefaultFontStyle = Function_cast(fontStyle);
		let getDefaultFontVariant = Function_cast(fontVariant);
		let getDefaultFontWeight = Function_cast(fontWeight);
		let getDefaultColor = Function_cast(color);

		words = words.map((word, index) => {
			let text;
			let weight;
			let rotation;
			let rotationUnit;
			let fontFamily;
			let fontStyle;
			let fontVariant;
			let fontWeight;
			let color;
			if (word) {
				if (String_isString(word)) {
					text = word;
				} else
				if (Array.isArray(word)) {
					[text, weight] = word;
				} else
				if (Object_isObject(word)) {
					({
						text,
						weight,
						rotation,
						rotationUnit,
						fontFamily,
						fontStyle,
						fontVariant,
						fontWeight,
						color,
					} = word);
				}
			}
			if (Lang_isUndefined(text)) {
				text = getDefaultText(word, index, words);
			}
			if (Lang_isUndefined(weight)) {
				weight = getDefaultWeight(word, index, words);
			}
			if (Lang_isUndefined(rotation)) {
				rotation = getDefaultRotation(word, index, words);
			}
			if (Lang_isUndefined(rotationUnit)) {
				rotationUnit = getDefaultRotationUnit(word, index, words);
			}
			if (Lang_isUndefined(fontFamily)) {
				fontFamily = getDefaultFontFamily(word, index, words);
			}
			if (Lang_isUndefined(fontStyle)) {
				fontStyle = getDefaultFontStyle(word, index, words);
			}
			if (Lang_isUndefined(fontVariant)) {
				fontVariant = getDefaultFontVariant(word, index, words);
			}
			if (Lang_isUndefined(fontWeight)) {
				fontWeight = getDefaultFontWeight(word, index, words);
			}
			if (Lang_isUndefined(color)) {
				color = getDefaultColor(word, index, words);
			}
			let boundingWord = new BoundingWord(
				text,
				(() => {
					switch (rotationUnit) {
						case 'turn':
							return Math_turnToRad(rotation);
						case 'deg':
							return Math_degToRad(rotation);
					}
					return rotation;
				})(),
				fontFamily,
				fontStyle,
				fontVariant,
				fontWeight,
				createCanvas,
			);
			Object.assign(boundingWord, {
				ǂword: word,
				ǂweight: weight,
				ǂcolor: color,
			});
			return boundingWord;
		});

		return Promise
			.resolve()
			.then(() => {
				return Promise.all(words.map(({ǂfontFamily, ǂfontStyle, ǂfontWeight, ǂtext}) => {
					return loadFont(ǂfontFamily, ǂfontStyle, ǂfontWeight, ǂtext);
				}));
			})
			.then(() => {

				words = words
					.filter(({ǂtextWidth}) => ǂtextWidth > 0)
					.sort((word, otherWord) => otherWord.ǂweight - word.ǂweight);

				if (!(words.length > 0)) {
					return [];
				}

				let firstWord = Array_first(words);
				let lastWord = Array_last(words);

				let maxWeight = firstWord.ǂweight;
				let minWeight = lastWord.ǂweight;
				if (minWeight < maxWeight) {
					let fontSizeRange = (() => {
						if (fontSizeRatio > 0) {
							return 1 / fontSizeRatio;
						}
						if (minWeight > 0) {
							return maxWeight / minWeight;
						}
						if (maxWeight < 0) {
							return minWeight / maxWeight;
						}
						return 1 + maxWeight - minWeight;
					})();
					words.forEach(word => {
						word.ǂfontSize = Math_mapLinear(word.ǂweight, minWeight, maxWeight, 1, fontSizeRange);
					});
				}

				words.reduceRight((renderingFontSizeFactor, word) => {
					if (word.ǂfontSize < renderingFontSizeInterval * renderingFontSizeFactor) {
						word.ǂfontSize /= renderingFontSizeFactor;
					} else {
						renderingFontSizeFactor = word.ǂfontSize;
						word.ǂfontSize = 1;
					}
					return (word.ǂrenderingFontSizeFactor = renderingFontSizeFactor);
				}, 1);

				words.forEach(word => {
					word.ǂfontSize *= renderingFontSizeBase;
				});

				let gridWorker = createWorker(PixelGridWorker);

				let process = {
					completedWords: 0,
					totalWords: words.length,
				};

				return Promise
					.resolve()
					.then(() => {
						context.throwIfInterrupted();
						this.progress = process;

						return Worker_postMessage(gridWorker, elementAspect);
					})
					.then(() => {
						context.throwIfInterrupted();
						process.completedWords++;

						let promise = Promise.resolve();
						words.reduce((previousWord, currentWord, index) => {
							promise = promise
								.then(() => {
									if (currentWord.ǂrenderingFontSizeFactor < previousWord.ǂrenderingFontSizeFactor) {
										return Promise
											.resolve()
											.then(() => {
												return Worker_postMessage(gridWorker, {name: 'clear'});
											})
											.then(() => {
												let promise = Promise.resolve();
												let scaleFactor = previousWord.ǂrenderingFontSizeFactor / currentWord.ǂrenderingFontSizeFactor;
												words.slice(0, index).forEach(previousWord => {
													promise = promise.then(() => {
														previousWord.ǂfontSize *= scaleFactor;
														return Worker_postMessage(gridWorker, {
															name: 'put',
															args: [previousWord.ǂimagePixels, previousWord.ǂimageLeft, previousWord.ǂimageTop],
														});
													});
												});
												return promise;
											});
									}
									return Worker_postMessage(gridWorker, {
										name: 'put',
										args: [previousWord.ǂimagePixels, previousWord.ǂimageLeft, previousWord.ǂimageTop],
									});
								})
								.then(() => {
									currentWord.ǂrelativePadding = spacing;
									return Worker_postMessage(gridWorker, {
										name: 'findFit',
										args: [currentWord.ǂimagePixels, currentWord.ǂimageLeft, currentWord.ǂimageTop],
									});
								})
								.then(([imageLeft, imageTop]) => {
									context.throwIfInterrupted();
									process.completedWords++;

									currentWord.ǂimageLeft = imageLeft;
									currentWord.ǂimageTop = imageTop;
									currentWord.ǂrelativePadding = 0;
								});
							return currentWord;
						});
						return promise;
					})
					.then(() => {
						return Worker_postMessage(gridWorker, {
							name: 'put',
							args: [lastWord.ǂimagePixels, lastWord.ǂimageLeft, lastWord.ǂimageTop],
						});
					})
					.then(() => {
						let promise = Promise.resolve();
						return Promise.all([
							promise = promise.then(() => {
								return Worker_postMessage(gridWorker, {name: 'getWidth'});
							}),
							promise = promise.then(() => {
								return Worker_postMessage(gridWorker, {name: 'getHeight'});
							}),
							promise = promise.then(() => {
								return Worker_postMessage(gridWorker, {name: 'getLeft'});
							}),
							promise = promise.then(() => {
								return Worker_postMessage(gridWorker, {name: 'getTop'});
							}),
						]);
					})
					.then(([gridWidth, gridHeight, gridLeft, gridTop]) => {
						if (gridWidth > 0 && gridHeight > 0) {
							let scaleFactor = Math.min(elementWidth / gridWidth, elementHeight / gridHeight);
							words.forEach(word => {
								word.ǂleft -= gridLeft;
								word.ǂtop -= gridTop;
								word.ǂfontSize *= scaleFactor;
							});
						}

						let keys = new Set();
						return words.map(({
							ǂword: word,
							ǂtext: text,
							ǂweight: weight,
							ǂrotation: rotation,
							ǂfont: font,
							ǂleft: left,
							ǂtop: top,
							ǂcolor: color,
						}) => {
							let key = JSON.stringify([
								text,
								fontFamily,
								fontStyle,
								fontVariant,
								fontWeight,
							]);
							while (keys.has(key)) {
								key += '!';
							}
							keys.add(key);
							return {
								key,
								word,
								text,
								weight,
								rotation,
								font,
								color,
								left,
								top,
							};
						});
					})
					.finally(() => {
						gridWorker.terminate();

						context.throwIfInterrupted();
						this.progress = null;
					});
			});
	},
	default: Function_stubArray,
	/*errorHandler(error) {
		console.log(error);
	},*/
};
