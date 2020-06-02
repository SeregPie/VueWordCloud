import Array_is from '../../../core/Array/is';
import Array_prototype_last from '../../../core/Array/prototype/last';
import Function_cast from '../../../core/Function/cast';
import Function_noop from '../../../core/Function/noop';
import Function_stubArray from '../../../core/Function/stubArray';
import Math_degreesToRadians from '../../../core/Math/degreesToRadians';
import Math_map from '../../../core/Math/map';
import Math_turnsToRadians from '../../../core/Math/turnsToRadians';
import Object_is from '../../../core/Object/is';
import Object_isUndefined from '../../../core/Object/isUndefined';
import String_is from '../../../core/String/is';
import Worker_postMessage from '../../../core/Worker/postMessage';

import getNormalizedFontSizeRatio from './getNormalizedFontSizeRatio';
import getNormalizedAspect from './getNormalizedAspect';
import BoundingWord from './BoundingWord';
import PixelGridWorker from 'stringify!./PixelGridWorker';

const renderingFontSizeInterval = 2;
const renderingFontSizeBase = 4;

export default {
	get(context) {

		let {
			elementWidth,
			elementHeight,
			words,
			text,
			weight,
			rotation,
			rotationUnit,
			fontFamily,
			fontWeight,
			fontVariant,
			fontStyle,
			color,
			spacing,
			fontSizeRatio,
			createCanvas,
			loadFont,
			createWorker,
		} = this;

		fontSizeRatio = getNormalizedFontSizeRatio(fontSizeRatio);

		let elementAspect = getNormalizedAspect([elementWidth, elementHeight]);

		if (elementWidth > 0 && elementHeight > 0) {

			let getDefaultText = Function_cast(text);
			let getDefaultWeight = Function_cast(weight);
			let getDefaultRotation = Function_cast(rotation);
			let getDefaultRotationUnit = Function_cast(rotationUnit);
			let getDefaultFontFamily = Function_cast(fontFamily);
			let getDefaultFontWeight = Function_cast(fontWeight);
			let getDefaultFontVariant = Function_cast(fontVariant);
			let getDefaultFontStyle = Function_cast(fontStyle);
			let getDefaultColor = Function_cast(color);

			words = words.map((word, index) => {
				let text;
				let weight;
				let rotation;
				let rotationUnit;
				let fontFamily;
				let fontWeight;
				let fontVariant;
				let fontStyle;
				let color;
				if (word) {
					if (String_is(word)) {
						text = word;
					} else
					if (Array_is(word)) {
						[text, weight] = word;
					} else
					if (Object_is(word)) {
						({
							text,
							weight,
							rotation,
							rotationUnit,
							fontFamily,
							fontWeight,
							fontVariant,
							fontStyle,
							color,
						} = word);
					}
				}
				if (Object_isUndefined(text)) {
					text = getDefaultText(word, index, words);
				}
				if (Object_isUndefined(weight)) {
					weight = getDefaultWeight(word, index, words);
				}
				if (Object_isUndefined(rotation)) {
					rotation = getDefaultRotation(word, index, words);
				}
				if (Object_isUndefined(rotationUnit)) {
					rotationUnit = getDefaultRotationUnit(word, index, words);
				}
				if (Object_isUndefined(fontFamily)) {
					fontFamily = getDefaultFontFamily(word, index, words);
				}
				if (Object_isUndefined(fontWeight)) {
					fontWeight = getDefaultFontWeight(word, index, words);
				}
				if (Object_isUndefined(fontVariant)) {
					fontVariant = getDefaultFontVariant(word, index, words);
				}
				if (Object_isUndefined(fontStyle)) {
					fontStyle = getDefaultFontStyle(word, index, words);
				}
				if (Object_isUndefined(color)) {
					color = getDefaultColor(word, index, words);
				}
				let boundingWord = new BoundingWord(
					text,
					(() => {
						switch (rotationUnit) {
							case 'turn':
								return Math_turnsToRadians(rotation);
							case 'deg':
								return Math_degreesToRadians(rotation);
						}
						return rotation;
					})(),
					fontFamily,
					fontWeight,
					fontVariant,
					fontStyle,
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
				.catch(Function_noop)
				.then(() => {

					words = words
						.filter(({ǂtextWidth}) => ǂtextWidth > 0)
						.sort((word, otherWord) => otherWord.ǂweight - word.ǂweight);

					if (words.length > 0) {

						let firstWord = words[0];
						let lastWord = Array_prototype_last(words);

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
								word.ǂfontSize = Math_map(word.ǂweight, minWeight, maxWeight, 1, fontSizeRange);
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
											currentWord.ǂpadding = spacing;
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
											currentWord.ǂpadding = 0;
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
								return Worker_postMessage(gridWorker, {name: 'getBounds'});
							})
							.then(({left, top, width, height}) => {
								if (width > 0 && height > 0) {
									let scaleFactor = Math.min(elementWidth / width, elementHeight / height);
									words.forEach(word => {
										word.ǂleft -= left;
										word.ǂtop -= top;
										word.ǂfontSize *= scaleFactor;
									});
								}

								let keys = new Set();
								return words.map(({
									ǂword: word,
									ǂtext: text,
									ǂweight: weight,
									ǂrotation: rotation,
									ǂfontFamily: fontFamily,
									ǂfontWeight: fontWeight,
									ǂfontVariant: fontVariant,
									ǂfontStyle: fontStyle,
									ǂfont: font,
									ǂleft: left,
									ǂtop: top,
									ǂcolor: color,
								}) => {
									let key = JSON.stringify([
										text,
										fontFamily,
										fontWeight,
										fontVariant,
										fontStyle,
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
							})
							.finally(() => {
								context.throwIfInterrupted();
								this.progress = null;
							});
					}

					return [];
				});
		}

		return [];
	},
	default: Function_stubArray,
	/*errorHandler(error) {
		console.warn(error);
	},*/
};
