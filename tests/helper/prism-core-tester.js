(function (Prism) {

	Prism.patterns.build.test = function buildTest(basePattern, replacements, placeholder, source, flags) {

		// test the base pattern

		// 'abc<<0>>def<<1>>ghi' -> [ 'abc', '0', 'def', '1', 'ghi']
		var parts = source.split(placeholder);

		for (var i = 0; i < parts.length - 1; i += 2) {
			var part = parts[i];

			// remove escapes
			part = part.replace(/\\[^1-9]/g, '');

			// preceded by an unescaped back slash
			if (/\\$/.test(part))
				throw new Error('Escaped placeholder "' + parts[i + 1] + '" in ' + basePattern);

			// inside a character set
			if (/\[[^\]]*$/.test(part))
				throw new Error('Placeholder "' + parts[i + 1] + '" inside a character set in ' + basePattern);
		}

		// test the used replacements

		var names = {};
		for (var i = 1; i < parts.length; i += 2)
			names[parts[i]] = true;

		for (var name in names) {
			var replacement = replacements[name];

			// no replacement
			if (!replacement)
				throw new Error('There is no replacement "' + name + '" for ' + basePattern);

			replacement = '' + (replacement.source || replacement);

			// remove escapes
			replacement = replacement.replace(/\\[^1-9]/g, '');

			// backreferences
			if (/\\[1-9]/.test(replacement))
				throw new Error('Backreference in replacement "' + name + '" for ' + basePattern);

			// remove char sets
			replacement = replacement.replace(/\[[^\]]*\]/g, '');

			// capturing groups
			if (/\((?!\?)/.test(replacement))
				throw new Error('Capturing group in replacement "' + name + '" for ' + basePattern);
		}
	};

}(Prism));
