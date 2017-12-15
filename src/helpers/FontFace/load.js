export default function(font, text) {
	// needs ie11 polyfill
	return document.fonts.load(font, text);
}