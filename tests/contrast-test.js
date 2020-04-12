const fs = require('fs');
const css = require('css');
const path = require('path');
const Color = require('color');
const { assert } = require('chai');
const { themes } = require('../components');


/**
 * @typedef {import("color")} Color
 */

/**
 * Analyzes the given CSS source code to find low-contrast colors and returns an array the found colors, the line they
 * occur in, and a suggested high-contrast color with the same hue.
 *
 * Use `@contrast-background: <color>` on a line in a comment to tell this checker the background color. The background
 * color is defined per scope.
 *
 * Use `@contrast-ignore` on a line in a comment within a rule to ignore the next property.
 *
 * @param {string} cssCode
 * @returns {string[]}
 */
function analyseContrast(cssCode) {
	/** @type {string[]} */
	const errors = [];

	const ast = css.parse(cssCode);
	analyseRules(ast.stylesheet.rules);

	/**
	 * @param {string} comment
	 */
	function parseBackground(comment) {
		const colorStr = (/^\s*(?:\*\s*)?@contrast-background:(.*)/m.exec(comment) || [, ''])[1].trim();
		if (colorStr) {
			return Color(colorStr);
		}
	}
	/**
	 * @param {string} comment
	 */
	function parseIgnore(comment) {
		return /^\s*(?:\*\s*)?@contrast-ignore\s*$/m.test(comment);
	}

	/**
	 * @param {import("css").StyleRules["rules"]} rules
	 * @param {Color | undefined} [background]
	 */
	function analyseRules(rules, background) {
		for (const element of rules) {
			if ("comment" in element) {
				background = parseBackground(element.comment) || background;
			} else if ("rules" in element) {
				analyseRules(element.rules, background);
			} else if ("declarations" in element) {
				analyseDeclarations(element.declarations, background);
			}
		}
	}
	/**
	 * @param {import("css").Rule["declarations"]} declarations
	 * @param {Color | undefined} background
	 */
	function analyseDeclarations(declarations, background) {
		let ignore = false;
		for (const decl of declarations) {
			if ("comment" in decl) {
				background = parseBackground(decl.comment) || background;
				if (parseIgnore(decl.comment)) {
					ignore = true;
				}
			} else if ("property" in decl) {
				if (ignore) {
					ignore = false;
					continue;
				}
				if (decl.property !== "color") {
					continue;
				}

				const line = `Line ${decl.position.start.line}`;

				if (!background) {
					errors.push(`${line}: There is no background defined for the color ${decl.value}.`);
					continue;
				}

				const color = Color(decl.value);
				const contrast = color.contrast(background);

				if (contrast < 4.5 - 0.01 /* some epsilon for rounding errors */) {
					const bg = `Background ${background.hex()}`;
					const correctedColor = ensureContrast(color, background, 4.5);
					const corrected = `${correctedColor.hex()} (${correctedColor.contrast(background).toFixed(2)})`;
					errors.push(`${line}: ${bg}: The color ${decl.value} has a contrast of ${contrast.toFixed(2)} < 4.5. Use ${corrected} instead.`);
				}
			}
		}
	}

	return errors;
}

/**
 * @param {Color} color
 * @param {Color} background
 * @param {number} contrastGoal
 * @returns {Color}
 */
function ensureContrast(color, background, contrastGoal) {
	if (color.contrast(background) >= contrastGoal) {
		return color.rgb();
	}

	color = color.lab();
	const makeDarker = color.luminosity() < background.luminosity();
	const ab = { a: color.object().a, b: color.object().b };

	/** @type {number} */
	let near = color.lab().object().l;
	/** @type {number} */
	let far = makeDarker ? 0 : 100;
	while (Math.abs(near - far) > 0.00001) {
		let middle = (near + far) / 2;
		color = Color.lab({ l: middle, ...ab });

		if (color.contrast(background) < contrastGoal) {
			near = middle;
		} else {
			far = middle;
		}
	}

	return color.rgb();
}


describe('Contrast', function () {

	for (const theme in themes) {
		if (theme === 'meta') {
			continue;
		}

		const file = path.join(__dirname, `../themes/${theme}.css`);

		it(`- ./themes/${theme}.css`, () => {
			const source = fs.readFileSync(file, 'utf8');

			const errors = analyseContrast(source);
			if (errors.length > 0) {
				assert.fail(`There are ${errors.length} contrast issues:\n\n` + errors.join('\n'));
			}
		});
	}

});
