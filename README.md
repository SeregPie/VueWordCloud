# VueWordCloud

A word cloud generator.

## demo

[Try it out!](https://seregpie.github.io/VueWordCloud/)

## dependencies

- [Vue](https://github.com/vuejs/vue)

## setup

Install the [package](https://www.npmjs.com/package/vuewordcloud) via npm.

```sh

npm install vuewordcloud

```

---

Include the code in your page via a CDN.

```html

<script src="https://unpkg.com/vue"></script>
<script src="https://unpkg.com/vuewordcloud"></script>

```

## usage

```html

<vue-word-cloud
  :words="[['romance', 19], ['horror', 3], ['fantasy', 7], ['adventure', 3]]"
  :color="([, weight]) => weight > 10 ? 'DeepPink' : weight > 5 ? 'RoyalBlue' : 'Indigo'"
  font-family="Roboto"
></vue-word-cloud>

```

## properties

`words = []`

*type*: `Array`

The words to place into the cloud. A value of the array could be either an object, an array or a string.

Object: `{text, weight, rotation, fontFamily, fontStyle, fontVariant, fontWeight, color}`.

Array: `[text, weight]`.

String: `text`.

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

`maxFontSize = Infinity`

*type*: `Number`

---

`animationDuration = 5000`

*type*: `Number`

---

`containerSizeUpdateInterval = 1000`

*type*: `Number`
