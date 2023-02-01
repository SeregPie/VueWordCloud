const svgNS = 'http://www.w3.org/2000/svg';
svgNSCommonAttr = [
    { attrName: 'width', value: '24px' },
    { attrName: 'height', value: '24px' },
    { attrName: 'style', value: 'height: 1em; width: 1em;' },
    { attrName: 'viewBox', value: '0 0 12 12' },
];

const App = {
    data: function() {
        return {
            animation: undefined,
            animationDurationValueIndex: 2,
            animationDurationValues: [0, 1000, 5000, 10000],
            animationEasing: undefined,
            animationEasingValues: [
                'ease',
                'linear',
                'ease-in',
                'ease-out',
                'ease-in-out',
                'cubic-bezier(0.1,0.7,1.0,0.1)',
            ],
            animationItems: [
                {
                    title: 'bounce',
                    value: ['bounceIn', 'bounceOut'],
                },
                {
                    title: 'fade',
                    value: ['fadeIn', 'fadeOut'],
                },
                {
                    title: 'flipX',
                    value: ['flipInX', 'flipOutX'],
                },
                {
                    title: 'flipY',
                    value: ['flipInY', 'flipOutY'],
                },
                {
                    title: 'rotate',
                    value: ['rotateIn', 'rotateOut'],
                },
                {
                    title: 'zoom',
                    value: ['zoomIn', 'zoomOut'],
                },
            ],
            animationOverlapValueIndex: 1,
            animationOverlapValues: [0, 1/5, 1/2, 1],
            colorItemIndex: undefined,
            colorItems: [
                ['#d99cd1', '#c99cd1', '#b99cd1', '#a99cd1'],
                ['#403030', '#f97a7a'],
                ['#31a50d', '#d1b022', '#74482a'],
                ['#ffd077', '#3bc4c7', '#3a9eea', '#ff4e69', '#461e47'],
            ],
            drawer: true,
            fontFamily: undefined,
            fontFamilyValues: [
                'Abril Fatface',
                'Annie Use Your Telescope',
                'Anton',
                'Bahiana',
                'Baloo Bhaijaan',
                'Barrio',
                'Finger Paint',
                'Fredericka the Great',
                'Gloria Hallelujah',
                'Indie Flower',
                'Life Savers',
                'Londrina Sketch',
                'Love Ya Like A Sister',
                'Merienda',
                'Nothing You Could Do',
                'Pacifico',
                'Quicksand',
                'Righteous',
                'Sacramento',
                'Shadows Into Light',
            ],
            fontSizeRatioValueIndex: 0,
            fontSizeRatioValues: [0, 1/20, 1/5, 1/2, 1],
            progress: undefined,
            progressVisible: true,
            rotationItemIndex: undefined,
            rotationItems: [
                {
                    value: 0,
                    svg: (function() {
                        var div = document.createElement('div');
                        div.appendChild((function() {
                            var svg = document.createElementNS(svgNS, 'svg');
                            svgNSCommonAttr.forEach((commonAttr) => {
                                svg.setAttribute(commonAttr.attrName, commonAttr.value);
                            });
                            svg.appendChild((function() {
                                var path = document.createElementNS(svgNS, 'path');
                                path.setAttribute('d', 'M0 7 L0 5 L12 5 L12 7 Z');
                                return path;
                            })());
                            return svg;
                        })());
                        return div.innerHTML;
                    })(),
                },
                {
                    value: 7/8,
                    svg: (function() {
                        var div = document.createElement('div');
                        div.appendChild((function() {
                            var svg = document.createElementNS(svgNS, 'svg');
                            svgNSCommonAttr.forEach((commonAttr) => {
                                svg.setAttribute(commonAttr.attrName, commonAttr.value);
                            });
                            svg.appendChild((function() {
                                var path = document.createElementNS(svgNS, 'path');
                                path.setAttribute('d', 'M0 7 L0 5 L12 5 L12 7 Z');
                                path.setAttribute('transform', 'rotate(315 6 6)');
                                return path;
                            })());
                            return svg;
                        })());
                        return div.innerHTML;
                    })(),
                },
                {
                    value: function(word) {
                        var chance = new Chance(word[0]);
                        return chance.pickone([0, 3/4]);
                    },
                    svg: (function() {
                        var div = document.createElement('div');
                        div.appendChild((function() {
                            var svg = document.createElementNS(svgNS, 'svg');
                            svgNSCommonAttr.forEach((commonAttr) => {
                                svg.setAttribute(commonAttr.attrName, commonAttr.value);
                            });
                            svg.appendChild((function() {
                                var path = document.createElementNS(svgNS, 'path');
                                path.setAttribute('d', 'M0 7 L0 5 L12 5 L12 7 Z');
                                return path;
                            })());
                            svg.appendChild((function() {
                                var path = document.createElementNS(svgNS, 'path');
                                path.setAttribute('d', 'M0 7 L0 5 L12 5 L12 7 Z');
                                path.setAttribute('transform', 'rotate(90 6 6)');
                                return path;
                            })());
                            return svg;
                        })());
                        return div.innerHTML;
                    })(),
                },
                {
                    value: function(word) {
                        var chance = new Chance(word[0]);
                        return chance.pickone([0, 1/8, 3/4, 7/8]);
                    },
                    svg: (function() {
                        var div = document.createElement('div');
                        div.appendChild((function() {
                            var svg = document.createElementNS(svgNS, 'svg');
                            svgNSCommonAttr.forEach((commonAttr) => {
                                svg.setAttribute(commonAttr.attrName, commonAttr.value);
                            });
                            svg.appendChild((function() {
                                var path = document.createElementNS(svgNS, 'path');
                                path.setAttribute('d', 'M0 7 L0 5 L12 5 L12 7 Z');
                                return path;
                            })());
                            svg.appendChild((function() {
                                var path = document.createElementNS(svgNS, 'path');
                                path.setAttribute('d', 'M0 7 L0 5 L12 5 L12 7 Z');
                                path.setAttribute('transform', 'rotate(45 6 6)');
                                return path;
                            })());
                            svg.appendChild((function() {
                                var path = document.createElementNS(svgNS, 'path');
                                path.setAttribute('d', 'M0 7 L0 5 L12 5 L12 7 Z');
                                path.setAttribute('transform', 'rotate(90 6 6)');
                                return path;
                            })());
                            svg.appendChild((function() {
                                var path = document.createElementNS(svgNS, 'path');
                                path.setAttribute('d', 'M0 7 L0 5 L12 5 L12 7 Z');
                                path.setAttribute('transform', 'rotate(315 6 6)');
                                return path;
                            })());
                            return svg;
                        })());
                        return div.innerHTML;
                    })(),
                },
                {
                    value: function(word) {
                        var chance = new Chance(word[0]);
                        return chance.random();
                    },
                    svg: (function() {
                        var div = document.createElement('div');
                        div.appendChild((function() {
                            var svg = document.createElementNS(svgNS, 'svg');
                            svgNSCommonAttr.forEach((commonAttr) => {
                                svg.setAttribute(commonAttr.attrName, commonAttr.value);
                            });
                            svg.appendChild((function() {
                                var circle = document.createElementNS(svgNS, 'circle');
                                circle.setAttribute('cx', 6);
                                circle.setAttribute('cy', 6);
                                circle.setAttribute('r', 6);
                                return circle;
                            })());
                            return svg;
                        })());
                        return div.innerHTML;
                    })(),
                }
            ],
            snackbarText: '',
            snackbarVisible: false,
            spacingValueIndex: 1,
            spacingValues: [0, 1/4, 1/2, 1, 2],
            wordsText: undefined,
        };
    },
    components: {
        ['vue-word-cloud']: VueWordCloud
    },
    computed: {
        animationDuration: function() {
            return this.animationDurationValues[this.animationDurationValueIndex];
        },
        animationOverlap: function() {
            return this.animationOverlapValues[this.animationOverlapValueIndex];
        },
        color: function() {
            var colors = this.colorItems[this.colorItemIndex];
            return function() {
                return chance.pickone(colors);
            };
        },
        enterAnimation: function() {
            return [
                'animated',
                this.animation.value[0],
            ]
                .map(function(value) {
                    return 'animate__' + value;
                })
                .join(' ');
        },
        fontSizeRatio: function() {
            return this.fontSizeRatioValues[this.fontSizeRatioValueIndex];
        },
        leaveAnimation: function() {
            return [
                'animated',
                this.animation.value[1],
            ]
                .map(function(value) {
                    return 'animate__' + value;
                })
                .join(' ');
        },
        rotation: function() {
            var item = this.rotationItems[this.rotationItemIndex];
            return item.value;
        },
        spacing: function() {
            return this.spacingValues[this.spacingValueIndex];
        },
        words: function() {
            let wrds = this.wordsText
                .split(/[\r\n]+/)
                .map(function(line) {
                    return /^(.+)\s+(-?\d+)$/.exec(line);
                })
                .filter(function(matched) {
                    return matched;
                })
                .map(function(matched) {
                    var text = matched[1];
                    var weight = Number(matched[2]);
                    return [text, weight];
                });
            return wrds;
        },
    },
    watch: {
        progress: function(currentProgress, previousProgress) {
            if (currentProgress && currentProgress.completedWords == currentProgress.totalWords) {
                progress = undefined;
            }
        },
    },
    created: function() {
        this.generateWordsText();
        this.animation = chance.pickone(this.animationItems);
        this.animationEasing = chance.pickone(this.animationEasingValues);
        this.colorItemIndex = chance.integer({min: 0, max: this.colorItems.length - 1});
        this.fontFamily = chance.pickone(this.fontFamilyValues);
        this.rotationItemIndex = chance.integer({min: 0, max: this.rotationItems.length - 1});
    },
    methods: {
        generateWordsText: function() {
            this.wordsText = [
                [9, 1, 3],
                [4, 5, 15],
                [2, 5, 15],
                [1, 25, 150],
            ]
                .reduce(function(returns, item) {
                    var weight = item[0];
                    var minCount = item[1];
                    var maxCount = item[2];
                    var count = chance.integer({min: minCount, max: maxCount});
                    chance.n(function() {
                        var word = chance.word();
                        returns.push(word+' '+weight);
                    }, count);
                    return returns;
                }, [])
                .join('\n');
        },
        loadFont: function(fontFamily, fontStyle, fontWeight, text) {
            return (new FontFaceObserver(fontFamily, {style: fontStyle, weight: fontWeight})).load(text);
        },
        onWordClick: function(word) {
            this.snackbarVisible = true;
            this.snackbarText = word[0];
        },
    },
};

const vuetify = Vuetify.createVuetify({});

Vue.createApp(App).use(vuetify).mount('#app');
