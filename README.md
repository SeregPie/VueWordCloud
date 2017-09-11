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
  :words="[['a', 12], ['b', 5], ['c', 5], ['d', 1]]"
  :color="([, weight]) => weight > 6 ? 'DeepPink' : weight > 3 ? 'RoyalBlue' : 'Indigo'"
  font-family="Roboto"
></vue-word-cloud>

```

## properties

`words`

An array of words. A value of the array is either an object, a string or an array.

If the value is an object: `{text, weight, color, rotation, fontFamily, fontStyle, fontVariant, fontWeight}`.

If the value is an array: `[text, weight, color, rotation, fontFamily, fontStyle, fontVariant, fontWeight]`.

If the value is a string: `text`;

---

`text`

A string or a function for the text of each word.

---

`weight`

A number or a function for the weight of each word.

---

`color`

A string or a function for the color of each word.

---

`rotation`

A number or a function for the rotation of each word. The units for the rotation are turns (1 turn is 360 degrees).

---

`fontFamily`

A string or a function for the font family.

---

`fontStyle`

A string or a function for the font style of each word. Possible values are `'normal'`, `'italic'` and `'oblique'`.

---

`fontVariant`

A string or a function for the font variant of each word. Possible values are `'normal'` and `'small-caps'`.

---

`fontWeight`

A string or a function for the font weight of each word. Possible values are `'normal'`, `'bold'`, `'bolder'`, `'lighter'` and `'100'` to `'900'`.

---

`text`<br/>
`weight`<br/>
`color`<br/>
`rotation`<br/>
`fontFamily`<br/>
`fontStyle`<br/>
`fontVariant`<br/>
`fontWeight`<br/>

If the property is a function, it will be called with a given word as the first paramater, awaiting a value in return. The value is set for each word, where the value is not already set.
