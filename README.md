# VueWordCloud

A word cloud generator.

## demo

[Try it out!](https://seregpie.github.io/VueWordCloud/)

## dependencies

- [Vue](https://github.com/vuejs/vue)

## setup

### npm

```shell
npm install vuewordcloud
```

### ES module

Register the component globally.

```javascript
import Vue from 'vue';
import VueWordCloud from 'vuewordcloud';

Vue.component(VueWordCloud.name, VueWordCloud);
```

*or*

Register the component in the scope of another instance.

```javascript
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
  <template slot-scope="{word, text, weight}">
    <div style="cursor: pointer;" :title="weight" @click="onWordClick(word)">
      {{ text }}
    </div>
  </template>
</vue-word-cloud>
```

## properties

| property | type | default | description |
| ---: | :--- | :--- | :--- |
| `words` | `Array` | `[]` | The words to place into the cloud. A value of the array could be either an object, an array or a string.<br/>If the value is an object, it will be resolved to `{text, weight, rotation, rotationUnit, fontFamily, fontStyle, fontVariant, fontWeight, color}`.<br/>If the value is an array, it will be resolved to `[text, weight]`.<br/>If the value is a string, it will be resolved to `text`. |
| `text` | `[String, Function]` | `''` | The default text for each word. |
| `weight` | `[Number, Function]` | `1` | The default weight for each word. |
| `rotation` | `[Number, Function]` | `0` | The default rotation for each word. |
| `rotationUnit` | `[String, Function]` | `'turn'` | The default rotation unit for each word. Possible values are `'turn'`, `'deg'` and `'rad'`. |
| `fontFamily` | `[String, Function]` | `'serif'` | The default font family for each word. |
| `fontStyle` | `[String, Function]` | `'normal'` | The default font style for each word. |
| `fontVariant` | `[String, Function]` | `'normal'` | The default font variant for each word. |
| `fontWeight` | `[String, Function]` | `'normal'` | The default font weight for each word. |
| `color` | `[String, Function]` | `'Black'` | The default color for each word. |
| `spacing` | `Number` | `0` | The spacing between the words. The value is relative to the font size. |
| `fontSizeRatio` | `Number` | `0` | The font size ratio between the words. For example, if the value is `5`, then the largest word will be 5 times larger than the smallest one. The value `5` has the same effect as the value `1/5`. |
| `animationDuration` | `Number` | `5000` | The duration of the animation. |

## events

| event | type | description |
| `update:progress` | `Object` | The current progress of the cloud words computation. |
