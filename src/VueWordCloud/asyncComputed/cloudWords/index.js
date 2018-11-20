import Array_last from '/utils/Array/last';
import Function_noop from '/utils/Function/noop';
import Function_stubArray from '/utils/Function/stubArray';
import Math_degToRad from '/utils/Math/degToRad';
import Math_mapLinear from '/utils/Math/mapLinear';
import Math_turnToRad from '/utils/Math/turnToRad';
import Worker_postMessage from '/utils/Worker/postMessage';

import BoundingWord from './BoundingWord';
import PixelGridWorker from 'stringify!./PixelGridWorker/index.js';

const renderingFontSizeInterval = 2;
const renderingFontSizeBase = 4;

export default {
	get(context) {

		let {
			colorValues,
			createCanvas,
			createWorker,
			elementHeight,
			elementWidth,
			fontFamilyValues,
			fontStyleValues,
			fontVariantValues,
			fontWeightValues,
			loadFont,
			normalizedFontSizeRatio: fontSizeRatio,
			rotationUnitValues,
			rotationValues,
			spacing,
			textValues,
			weightValues,
			words,
		} = this;

		if (elementWidth > 0 && elementHeight > 0) {

			words = words.map((word, index) => {
				let color = colorValues[index];
				let fontFamily = fontFamilyValues[index];
				let fontStyle = fontStyleValues[index];
				let fontVariant = fontVariantValues[index];
				let fontWeight = fontWeightValues[index];
				let rotation = rotationValues[index];
				let rotationUnit = rotationUnitValues[index];
				let text = textValues[index];
				let weight = weightValues[index];
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

								return Worker_postMessage(gridWorker, [elementWidth, elementHeight]);
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
