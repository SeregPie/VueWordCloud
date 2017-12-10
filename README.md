# VueWordCloud

A word cloud generator.

## demo

[Try it out!](https://seregpie.github.io/VueWordCloud/)

## dependencies

- [Vue](https://github.com/vuejs/vue)

## setup

### NPM

```sh

npm install vuewordcloud

```

### ES2015

Register the component globally.

```js

import Vue from 'vue';
import VueWordCloud from 'vuewordcloud';

Vue.component(VueWordCloud.name, VueWordCloud);

```

*or*

Register the component in the scope of another instance.

```js

import VueWordCloud from 'vuewordcloud';

export default {
  // ...
  components: {
    VueWordCloud,
  },
};

```

### Browser

```html

<script src="https://unpkg.com/vue"></script>
<script src="https://unpkg.com/vuewordcloud"></script>

```

If Vue is detected, the component will be registered automatically.

Include [polyfills](https://polyfill.io/) to support older browsers.

```html

<script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=default,Math.log2,Object.entries,Object.values"></script>

```

## usage

```html

<vue-word-cloud
  :words="[['romance', 19], ['horror', 3], ['fantasy', 7], ['adventure', 3]]"
  :color="([, weight]) => weight > 10 ? 'DeepPink' : weight > 5 ? 'RoyalBlue' : 'Indigo'"
  font-family="Roboto"
></vue-word-cloud>

```

---

Pass custom renderer for the words.

```html

<vue-word-cloud :words="words">
  <template slot-scope="word">
    <div style="cursor: pointer;" :title="word.weight" @click="onWordClick(word)">
      {{ word.text }}
    </div>
  </template>
</vue-word-cloud>

```

## properties

`words = []`

*type*: `Array`

The words to place into the cloud. A value of the array could be either an object, an array or a string.

`Object`: `{key, text, weight, rotation, fontFamily, fontStyle, fontVariant, fontWeight, color}`.

`Array`: `[text, weight]`.

`String`: `text`.

---

`text = ''`

*type*: `String` or `Function`

The text of each word.

---

`weight = 1`

*type*: `Number` or `Function`

The weight of each word.

---

`rotation`

*type*: `Number` or `Function`

The rotation of each word. The units for the rotation are turns (1 turn is 360 degrees).

---

`fontFamily = 'serif'`

*type*: `String` or `Function`

The font family.

---

`fontStyle = 'normal'`

*type*: `String` or `Function`

The font style of each word. Possible values are `'normal'`, `'italic'` and `'oblique'`.

---

`fontVariant = 'normal'`

*type*: `String` or `Function`

The font variant of each word. Possible values are `'normal'` and `'small-caps'`.

---

`fontWeight = 'normal'`

*type*: `String` or `Function`

The font weight of each word. Possible values are `'normal'`, `'bold'`, `'bolder'`, `'lighter'` and `'100'` to `'900'`.

---

`color = 'Black'`

*type*: `String` or `Function`

The color of each word.

---

`text`<br/>
`weight`<br/>
`color`<br/>
`rotation`<br/>
`fontFamily`<br/>
`fontStyle`<br/>
`fontVariant`<br/>
`fontWeight`<br/>

If the property is a function, it will be called with a given word as the first paramater, awaiting the corresponding attribute in return. The attribute is assigned to each word, where the attribute is not already present.

---

`fontSizeRatio`

*type*: `Number`

By default, if we have a word with a weight of 1 and a word with a weight of 500, we can only read the big word, the one are so small that it won't be readable in most cases.

If `fontSizeRatio` is specified, the words' font size will be scaled to respect the given ratio.
For example, if the ratio equals `5`, this means that the biggest word will be 5 times bigger than the smallest one, improving readability.

The value of `4` is the same as the value of `1/4`. The value of `3/2` is the same as the value of `2/3`.

---

`maxFontSize = Infinity`

*type*: `Number`

---

`animationDuration = 5000`

*type*: `Number`
