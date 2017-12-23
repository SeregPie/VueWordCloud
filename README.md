# VueWordCloud

A word cloud generator.

## demo

[Try it out!](https://seregpie.github.io/VueWordCloud/)

## dependencies

- [Vue](https://github.com/vuejs/vue)

## setup

### npm

```sh

npm install vuewordcloud

```

### ES module

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
    [VueWordCloud.name]: VueWordCloud,
  },
};

```

### browser

```html

<script src="https://unpkg.com/vue"></script>
<script src="https://unpkg.com/vuewordcloud"></script>

```

If Vue is detected, the component will be registered automatically.

Include [polyfills](https://polyfill.io/) to support older browsers.

```html

<script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=default,Object.entries,Object.values"></script>

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
  <template slot-scope="{text, weight, originalWord}">
    <div style="cursor: pointer;" :title="weight" @click="onWordClick(originalWord)">
      {{ text }}
    </div>
  </template>
</vue-word-cloud>

```

## properties

| property | type | default | description |
| ---: | :--- | :--- | :--- |
| `words` | `Array` | `[]` | The words to place into the cloud. A value of the array could be either an object, an array or a string.<br/>If the value is an object, it will be resolved to `{text, weight, rotation, fontFamily, fontStyle, fontVariant, fontWeight, color}`.<br/>If the value is an array, it will be resolved to `[text, weight]`.<br/>If the value is a string, it will be resolved to `text`. |
| `text` | `[String, Function]` | `''` | The text for each word.<br/>The function will be called with the original word as parameter. |
| `weight` | `[Number, Function]` | `1` | The weight for each word.<br/>The function will be called with the original word as parameter. |
| `rotation` | `[Number, Function]` | * | The rotation of each word. The units for the rotation must be turns (1 turn is 360 degrees).<br/>The function will be called with the original word as parameter.<br/>The default value is a function, that returns a random value from `[0, 0.75]`. |
| `fontFamily` | `[String, Function]` | `'serif'` | The font family for each word.<br/>The function will be called with the original word as parameter. |
| `fontStyle` | `[String, Function]` | `'normal'` | The font style for each word. Possible values are `'normal'`, `'italic'` and `'oblique'`.<br/>The function will be called with the original word as parameter. |
| `fontVariant` | `[String, Function]` | `'normal'` | The font variant for each word. Possible values are `'normal'` and `'small-caps'`.<br/>The function will be called with the original word as parameter. |
| `fontWeight` | `[String, Function]` | `'normal'` | The font weight for each word. Possible values are `'normal'`, `'bold'`, `'bolder'`, `'lighter'` and `'100'` to `'900'`.<br/>The function will be called with the original word as parameter. |
| `color` | `[String, Function]` | `'Black'` | The color for each word.<br/>The function will be called with the original word as parameter. |
| `fontSizeRatio` | `Number` | `0` | The font size of the words will be scaled to respect the given ratio. For example, if the value equals `5`, then the biggest word will be 5 times bigger than the smallest one. The value can be an integer or a fraction. For example, the value `4` has the same effect as the value `1/4`. |
| `maxFontSize` | `Number` | `Infinity` | The maximum font size of the placed words. |
| `animationDuration` | `Number` | `5000` | The duration of the animation, when words are placed. |
