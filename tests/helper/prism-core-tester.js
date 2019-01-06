(function (Prism) {

	/**
	 * Tests the inputs of `Prism.patterns.build` calls for the following criteria:
	 *
	 * `basePattern`:
	 * 1. Placeholders cannot be escaped. E.g. `foo\<<bar>>`.
	 * 2. Placeholders cannot be inside character sets. E.g. `foo[<<bar>>]`.
	 *
	 * `replacements`:
	 * 1. There has to be a replacement for each placeholder. E.g. `build(/<<bar>>/, {})`.
	 * 2. A replacement's flags (without the `g` and `y` flag) have to be a subset of the flags of `basePattern`.
	 *    E.g. `build(/foo<<0>>/, [ /[a-z]/i ])`
	 * 3. A replacement cannot contain backreferences. E.g. `build(/(foo)\1<<0>>/, [ /(bar)\1/ ])`
	 * 4. A replacement cannot contain capturing groups. E.g. `build(/<<0>>(foo)\1/, [ /(bar)\1/ ])`
	 *
	 * __Note:__ All strings are assumed to represent patterns without flags.
	 *
	 * @param {string|RegExp} basePattern The base pattern.
	 * @param {Object.<string, string|RegExp>|Array.<string|RegExp>} replacements The replacements.
	 * @param {RegExp} placeholder The regex to detect placeholders.
	 * @param {string} source The source of `basePattern`.
	 * @param {string} flags The flags of `basePattern`.
	 */
	Prism.patterns.build.test = function buildTest(basePattern, replacements, placeholder, source, flags) {
		/**
		 * Sorts and filters the given flags, so that only the ones relevant for the pattern remain.
		 *
		 * @param {string} flags
		 * @returns {string}
		 */
		function normalizeFlags(flags) {
			if (!flags) {
				return '';
			}
			return flags.split('').filter(f => 'gy'.indexOf(f) === -1).sort().join('');
		}

		flags = normalizeFlags(flags);


		// test the base pattern

		// 'abc<<0>>def<<1>>ghi' -> [ 'abc', '0', 'def', '1', 'ghi']
		var parts = source.split(placeholder);

		for (var i = 0; i < parts.length - 1; i += 2) {
			var part = parts[i];

			// remove escapes
			part = part.replace(/\\[\s\S]/g, '');

			// preceded by an unescaped back slash
			if (/\\$/.test(part)) {
				throw new Error('Escaped placeholder "' + parts[i + 1] + '" in ' + basePattern);
			}

			// inside a character set
			if (/\[[^\]]*$/.test(part)) {
				throw new Error('Placeholder "' + parts[i + 1] + '" inside a character set in ' + basePattern);
			}
		}

		// test the used replacements

		var names = {};
		for (var i = 1; i < parts.length; i += 2) {
			names[parts[i]] = true;
		}

		for (var name in names) {
			var replacement = replacements[name];

			// no replacement
			if (!replacement) {
				throw new Error('There is no replacement "' + name + '" for ' + basePattern);
			}

			// flags
			// strings are assumed to have no flags
			var repFlags = replacement.flags;
			if (repFlags === undefined) {
				repFlags = replacement.exec ? replacement.toString().match(/[igmuy]*$/)[0] : '';
			}
			repFlags = normalizeFlags(repFlags);

			// the replacement's flags have to be a subset of the base pattern's ones.
			repFlags.split('').forEach(function (f) {
				if (flags.indexOf(f) < 0) {
					throw new Error('The ' + f + ' flag is present in replacement "' + name +
						'" but in its base pattern ' + basePattern);
				}
			});

			// source
			replacement = '' + (replacement.source || replacement);

			// remove escapes
			replacement = replacement.replace(/\\[^1-9k]/g, '');

			// backreferences
			if (/\\(?:[1-9]|k<\w+>)/.test(replacement)) {
				throw new Error('Backreference in replacement "' + name + '" for ' + basePattern);
			}

			// remove char sets
			replacement = replacement.replace(/\[[^\]]*\]/g, '');

			// capturing groups
			if (/\((?!\?)|\(\?<\w+>/.test(replacement)) {
				throw new Error('Capturing group in replacement "' + name + '" for ' + basePattern);
			}
		}
	};

}(Prism));
