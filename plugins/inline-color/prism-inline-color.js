(function () {

	if (typeof self === 'undefined' || typeof Prism === 'undefined' || typeof document === 'undefined') {
		return;
	}

	// Copied from markup language definition
	var HTML_TAG = /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/g;

	/**
	 * @typedef Color A normalized RGBA color.
	 * @property {number} r The red channel of the color. `0 <= r <= 1`.
	 * @property {number} g The green channel of the color. `0 <= g <= 1`.
	 * @property {number} b The blue channel of the color. `0 <= b <= 1`.
	 * @property {number} a The alpha channel of the color. `0 <= a <= 1`.
	 */

	/**
	 * Parses the given hexadecimal representation and returns the parsed color.
	 *
	 * If the format of the given string is invalid, `undefined` will be returned.
	 * Valid formats are: `RGB`, `RGBA`, `RRGGBB`, and `RRGGBBAA`.
	 *
	 * @param {string} hex
	 * @returns {Color | undefined}
	 */
	function parseHexColor(hex) {
		// the regex explained: In first lookahead we check whether the string is valid and then we use the
		// capturing groups to split the string into its components.
		var match = /^#?(?=(?:[\da-f]{1,2}){3,4}$)([\da-f][\da-f]?)([\da-f][\da-f]?)([\da-f][\da-f]?)([\da-f][\da-f]?)?$/i.exec(hex);

		// This is used to scale normalize 4bit and 8bit values
		var scale = hex.length <= 4 ? 1 / 15 : 1 / 255;

		if (match) {
			return {
				r: parseInt(match[1], 16) * scale,
				g: parseInt(match[2], 16) * scale,
				b: parseInt(match[3], 16) * scale,
				a: match[4] === undefined ? 1 : (parseInt(match[4], 16) * scale)
			};
		}
		return undefined;
	}

	/**
	 * Validates the given Color using the current browser's internal implementation.
	 *
	 * @param {string} color
	 * @returns {string | undefined}
	 */
	function validateColor(color) {
		var s = new Option().style;
		s.color = color;
		return s.color ? color : undefined;
	}

	/**
	 * An array of function which parse a given string representation of a color.
	 *
	 * These parser serve as validators and as a layer of compatibility to support color formats which the browser
	 * might not support natively.
	 *
	 * @type {((value: string) => (Color|string|undefined))[]}
	 */
	var parsers = [
		parseHexColor,
		validateColor
	];

	Prism.hooks.add('wrap', function (env) {
		if (env.type === 'color' || env.type === 'hexcode') {
			var content = env.content;

			// remove all HTML tags inside
			var rawText = content.split(HTML_TAG).join('');

			var color;
			for (var i = 0, l = parsers.length; i < l && !color; i++) {
				color = parsers[i](rawText);
			}

			if (!color) {
				return;
			}

			// we can't a simple hex because some browsers (Edge, IE11) don't support hex literals with an alpha channel
			var value = typeof color === 'string' ? color : 'rgba(' + [color.r, color.g, color.b].map(function (c) {
				return String(Math.round(c * 255));
			}).join(',') + ',' + color.a + ')';

			var previewElement = '<span class="inline-color" style="background-color:' + value + ';"></span>';

			env.attributes['data-color'] = '';
			env.content = previewElement + content;
		}
	});

}());
