(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('vue')) :
	typeof define === 'function' && define.amd ? define(['vue'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.VueWordCloud = factory(global.Vue));
}(this, (function (vue) { 'use strict';

	var isArray = Array.isArray;

	function isObject (value) {
	  if (value) {
	    let type = typeof value;
	    return type === 'object' || type === 'function';
	  }

	  return false;
	}

	function isString (value) {
	  return typeof value === 'string';
	}

	function scaleNumber (n, inMin, inMax, outMin, outMax) {
	  return outMin + (n - inMin) * (outMax - outMin) / (inMax - inMin);
	}

	function toCSSFont (family, size, style, variant, weight) {
	  let el = document.createElement('span');
	  el.style.font = '1px serif';
	  el.style.fontFamily = family;
	  el.style.fontSize = `${size}px`;
	  el.style.fontStyle = style;
	  el.style.fontVariant = variant;
	  el.style.fontWeight = weight;
	  return el.style.font;
	}

	function useFFF (fn, {
	  immediate = false
	} = {}) {
	  let stopped = false;
	  let paused = false;
	  let id;
	  let loop0;
	  let loop1;

	  loop0 = () => {
	    try {
	      fn();
	    } finally {
	      if (!paused) {
	        loop1();
	      }
	    }
	  };

	  loop1 = () => {
	    id = requestAnimationFrame(loop0);
	  };

	  let start = immediate ? loop0 : loop1;

	  let resume = () => {
	    if (!stopped) {
	      if (paused) {
	        paused = false;
	        start();
	      }
	    }
	  };

	  let pause = () => {
	    if (!paused) {
	      paused = true;
	      cancelAnimationFrame(id);
	    }
	  };

	  let stop = () => {
	    if (!stopped) {
	      stopped = true;
	      pause();
	    }
	  };

	  if (vue.getCurrentInstance()) {
	    vue.onUnmounted(stop);
	  }

	  start();
	  return {
	    pause,
	    resume,
	    stop
	  };
	}

	function constant (value) {
	  return () => value;
	}

	function stubArray () {
	  return [];
	}

	var component = vue.defineComponent({
	  name: 'VueWordCloud',
	  props: {
	    animationDuration: {
	      type: Number,
	      default: 1000
	    },
	    animationEasing: {
	      type: String,
	      default: 'ease'
	    },
	    animationOverlap: {
	      type: Number,
	      default: 1
	    },

	    /*colorStrategy: {
	    	type: [String, Function],
	    	default: 'Black',
	    },*/
	    enterAnimation: {
	      type: [Object, String],
	      default: constant({
	        opacity: 0
	      })
	    },
	    fontFamily: {
	      type: String,
	      default: 'serif'
	    },
	    fontSizeRatio: {
	      type: Number,
	      default: 0
	    },
	    fontStyle: {
	      type: String,
	      default: 'normal'
	    },
	    fontVariant: {
	      type: String,
	      default: 'normal'
	    },
	    fontWeight: {
	      type: String,
	      default: 'normal'
	    },
	    leaveAnimation: {
	      type: [Object, String],
	      default: constant({
	        opacity: 0
	      })
	    },

	    /*loadFont: {
	    	type: Function,
	    	default(fontFamily, fontStyle, fontWeight, text) {
	    		return document.fonts.load([fontStyle, fontWeight, '1px', fontFamily].join(' '), text);
	    	},
	    },*/

	    /*rotationStrategy: {
	    	type: [String, Function],
	    	default: 0,
	    },*/
	    spacing: {
	      type: Number,
	      default: 0
	    },
	    words: {
	      type: Array,
	      default: stubArray
	    }
	  },

	  setup(props, {
	    emit,
	    slots
	  }) {
	    let elRef = vue.shallowRef();
	    let cloudWidthRef = vue.shallowRef(0);
	    let cloudHeightRef = vue.shallowRef(0);
	    vue.onMounted(() => {
	      useFFF(() => {
	        let el = elRef.value;

	        if (el) {
	          cloudWidthRef.value = el.offsetWidth;
	          cloudHeightRef.value = el.offsetHeight;
	        }
	      }, {
	        immediate: true
	      });
	    });
	    let cloudWords = vue.reactive(new Map());
	    vue.watchEffect(() => {
	      console.log('watchEffect 1');
	      let {
	        fontFamily: defaultFontFamily,
	        fontStyle: defaultFontStyle,
	        fontVariant: defaultFontVariant,
	        fontWeight: defaultFontWeight,
	        words
	      } = props;
	      let defaultText = '';
	      let defaultWeight = 1;
	      let oldKeys = new Set(cloudWords.keys());
	      let newKeys = new Set();
	      words.forEach(word => {
	        let {
	          color,
	          fontFamily = defaultFontFamily,
	          fontStyle = defaultFontStyle,
	          fontVariant = defaultFontVariant,
	          fontWeight = defaultFontWeight,
	          rotation,
	          text = defaultText,
	          weight = defaultWeight
	        } = (() => {
	          if (isString(word)) {
	            let text = word;
	            return {
	              text
	            };
	          }

	          if (isArray(word)) {
	            let [text, weight] = word;
	            return {
	              text,
	              weight
	            };
	          }

	          if (isObject(word)) {
	            return word;
	          }

	          return {};
	        })();

	        let key;
	        {
	          let i = 0;

	          do {
	            key = JSON.stringify([text, i]);
	            i++;
	          } while (newKeys.has(key));

	          newKeys.add(key);
	        }
	        let cloudWord = cloudWords.get(key);

	        if (cloudWord) {
	          console.log('UPDATE', key);
	          Object.assign(cloudWord, {
	            color,
	            fontFamily,
	            fontStyle,
	            fontVariant,
	            fontWeight,
	            rotation,
	            text,
	            weight,
	            word
	          });
	        } else {
	          console.log('CREATE', key);
	          cloudWords.set(key, {
	            color,
	            fontFamily,
	            fontStyle,
	            fontVariant,
	            fontWeight,
	            rotation,
	            text,
	            weight,
	            word
	          });
	        }
	      });
	      oldKeys.forEach(key => {
	        if (!newKeys.has(key)) {
	          console.log('DELETE', key);
	          cloudWords.delete(key);
	        }
	      });
	    });
	    let fontSizeRatioRef = vue.computed(() => {
	      let n = props.fontSizeRatio;
	      n = Math.abs(n);

	      if (n > 1) {
	        n = 1 / n;
	      }

	      return n;
	    });
	    vue.watchEffect(() => {
	      console.log('watchEffect 2');
	      let words = cloudWords;
	      let fontSizeRatio = fontSizeRatioRef.value;
	      let minWeight = +Infinity;
	      let maxWeight = -Infinity;
	      words.forEach(({
	        weight
	      }) => {
	        minWeight = Math.min(minWeight, weight);
	        maxWeight = Math.max(maxWeight, weight);
	      });
	      let minSize = 1;

	      let maxSize = (() => {
	        if (minWeight < maxWeight) {
	          if (fontSizeRatio) {
	            return 1 / fontSizeRatio;
	          }

	          if (minWeight > 0) {
	            return maxWeight / minWeight;
	          }

	          if (maxWeight < 0) {
	            return minWeight / maxWeight;
	          }

	          return 1 + maxWeight - minWeight;
	        }

	        return 1;
	      })();

	      words.forEach(word => {
	        let {
	          weight
	        } = word;
	        let size = scaleNumber(weight, minWeight, maxWeight, minSize, maxSize);
	        Object.assign(word, {
	          size
	        });
	      });
	    });
	    vue.watchEffect(() => {
	      console.log('watchEffect 3');
	      let words = cloudWords;
	      cloudWidthRef.value;
	      cloudHeightRef.value;
	      let ojozLeft = 0;
	      let ojozRight = 0;
	      let ojozTop = 0;
	      let ojozBottom = 0;
	      let canvas = document.createElement('canvas');
	      let ctx = canvas.getContext('2d');
	      words.forEach(word => {
	        let {
	          fontFamily,
	          fontSize,
	          fontStyle,
	          fontVariant,
	          fontWeight,
	          rotation = Math.random() * Math.PI,
	          text
	        } = word;
	        let font = toCSSFont(fontFamily, fontSize, fontStyle, fontVariant, fontWeight);
	        let width;
	        let height;
	        {
	          ctx.font = font;
	          let x = ctx.measureText(text).width + fontSize;
	          let y = fontSize * 2;
	          let a = rotation;
	          let cosA = Math.abs(Math.cos(a));
	          let sinA = Math.abs(Math.sin(a));
	          width = x * cosA + y * sinA;
	          height = x * sinA + y * cosA;
	        }

	        let left = ((min, max) => min + (max - min) * Math.random())(ojozLeft - width, ojozRight + width);

	        let top = ((min, max) => min + (max - min) * Math.random())(ojozTop - height, ojozBottom + height);

	        ojozLeft = Math.min(ojozLeft, left);
	        ojozRight = Math.max(ojozRight, left + width);
	        ojozTop = Math.min(ojozTop, top);
	        ojozBottom = Math.max(ojozBottom, top + height);
	        Object.assign(word, {
	          left,
	          rotation,
	          top
	        });
	      });
	      let satpLeft = (ojozLeft + ojozRight) / 2;
	      let satpTop = (ojozTop + ojozBottom) / 2;
	      words.forEach(word => {
	        word.left -= satpLeft;
	        word.top -= satpTop;
	      });
	    });
	    vue.watchEffect(() => {
	      console.log('watchEffect 4');
	      let words = cloudWords;
	      words.forEach(word => {
	        let {
	          color = 'Black'
	        } = word;
	        Object.assign(word, {
	          color
	        });
	      });
	    });
	    return () => {
	      let genWord = (() => {
	        let slot = slots['word'];

	        if (slot) {
	          return slot;
	        }

	        return ({
	          text
	        }) => text;
	      })();

	      return vue.h('div', {
	        style: {
	          height: '100%',
	          position: 'relative',
	          width: '100%'
	        },
	        ref: elRef
	      }, [vue.h('div', {
	        style: {
	          bottom: '50%',
	          position: 'absolute',
	          right: '50%',
	          transform: 'translate(50%,50%)'
	        }
	      }, [...cloudWords.values()].map(({
	        color,
	        font,
	        key,
	        left,
	        rotation,
	        text,
	        top,
	        weight,
	        word
	      }) => {
	        return vue.h('div', {
	          key,
	          style: {
	            color: color,
	            font: font,
	            left: `${left}px`,
	            position: 'absolute',
	            top: `${top}px`,
	            transform: `rotate(${rotation}rad)`,
	            transformOrigin: 'center',
	            whiteSpace: 'nowrap'
	          }
	        }, genWord({
	          text,
	          weight,
	          word
	        }));
	      }))]);
	    };
	  }

	});

	return component;

})));
