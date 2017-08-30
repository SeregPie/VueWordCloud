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
  :words="[['a',5],['fdf',3],['fdf',3],['fdf',3]]"
  :color="({weight}) => weight > 5 ? 'Red' : weight > 3 ? 'Blue' : 'Green'"
  font-family="Roboto"
></vue-word-cloud>

```
