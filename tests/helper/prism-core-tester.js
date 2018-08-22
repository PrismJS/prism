(function (Prism) {

	Prism.patterns.build.test = function buildTest(basePattern, replacements, placeholder, source, flags) {

		// test the base pattern

		var parts = source.split(placeholder);

		for (var i = 0; i < parts.length - 1; i += 2) {
			var part = parts[i];

			// preceded by an unescaped back slash
			if (/(?:^|[^\\])(?:\\\\)*\\$/.test(part))
				throw new Error('Escaped placeholder in ' + basePattern);

			// inside a char set
			if (/(?:^|[^\\])(?:\\\\)*\[(?:[^\\\]]|\\.)*$/.test(part))
				throw new Error('Placeholder inside of char set in ' + basePattern);
		}

		// test the replacements

		var names = {};
		for (var i = 1; i < parts.length; i += 2)
			names[parts[i]] = true;

		for (var name in names) {
			var replacement = replacements[name];

			// no replacement
			if (!replacement)
				throw new Error('"' + name + '" does not have a replacement in ' + basePattern);

			replacement = '' + (replacement.source || replacement);

			// remove escapes
			replacement = replacement.replace(/\\[^1-9]/g, '');

			// backreferences
			if (/\\[1-9]/.test(replacement))
				throw new Error('Backreference in replacement ' + name);

			// remove char sets
			replacement = replacement.replace(/\[[^\]]*\]/g, '');

			// capturing groups
			if (/\((?!\?)/.test(replacement))
				throw new Error('Capturing group in replacement ' + name);
		}
	};

}(Prism));
