(function (Prism) {

	/**
	 * A pattern is an immutable object
	 * @typedef {{ readonly source: string; readonly flags: Flags }} Pattern
	 *
	 * @typedef {'g' | 'i' | 'm' | 's' | 'u' | 'y'} Flag
	 * @typedef {{ readonly [key in Flag]?: boolean }} Flags
	 * @typedef {{ [key in Flag]?: boolean }} MutableFlags
	 */

	/** @type {readonly Flag[]} */
	var flagKeys = ['g', 'i', 'm', 's', 'u', 'y'];
	/** @type {Flags} */
	var noFlags = {};

	/**
	 * Creates a new pattern from the given source and optional flags.
	 *
	 * @param {string} source
	 * @param {Flags} [flags]
	 * @returns {Pattern}
	 */
	function p(source, flags) {
		return { source: source, flags: flags || noFlags };
	}

	/**
	 * Converts the given pattern to a `RegExp` object.
	 *
	 * @param {string | Pattern} pattern
	 * @returns {RegExp}
	 */
	function toRegExp(pattern) {
		if (typeof pattern === 'string') {
			return RegExp(pattern);
		} else {
			var patternFlags = pattern.flags;
			var flags = '';
			if (patternFlags !== noFlags) {
				flagKeys.forEach(function (f) {
					if (patternFlags[f]) {
						flags += f;
					}
				});
			}
			return RegExp(pattern.source, flags);
		}
	}

	/**
	 * This will parse the given source and replace parts of it with the given replacer function. The replaced source
	 * will be returned.
	 *
	 * The replacer will be called for every detected token. Tokens can be differentiated by assigning the content of
	 * the token a capturing group and whether this group was matched in the replacer.
	 * By default, the replacer will be called for:
	 *
	 * 1. Back references. The content of the group will be number of the referenced group.
	 *    Note: This will also contain all octal escapes except for `\0`.
	 * 2. Capturing groups. The content of the group will simply be `(`.
	 * 3. All other escape sequences which start with a backslash but there won't be a capturing group for it.
	 * 4. All character classes (e.g. `[a-z\d]`) but there won't be a capturing group for it.
	 *
	 * You can add additional tokens which will be parsed before the default tokens.
	 *
	 * The replacer will be called with the following arguments:
	 *
	 * 1. The matched string.
	 * 2. The capturing groups of the additional tokens.
	 * 3. The capturing group of backreferences.
	 * 4. The capturing group of capturing groups.
	 * 5. The index of the match.
	 * 6. The whole input string.
	 *
	 * @param {string} source
	 * @param {string} additionalTokens
	 * @param {(m: string, ...other: any[]) => string} replacer
	 * @returns {string}
	 * @example
	 * const source = replaceSource(
	 *     /(foo|[a-z])\1/.source,
	 *     '(foo)',
	 *     (m, foo, backRef, group, index, input) => {
	 *         if (foo) return 'bar';
	 *         return m;
	 *     }
	 * );
	 * console.log(source); // (bar|[a-z])\1
	 */
	function replaceSource(source, additionalTokens, replacer) {
		var tokens = (additionalTokens || '[^\\s\\S]') + '|' + /\\(?:0|([1-9]\d{0,2})|\D)|(\((?!\?))|\[[^\]]*\]/.source;
		return source.replace(RegExp(tokens, 'g'), replacer)
	}

	/**
	 * Replaces all placeholders in the given pattern with the associated replacement in the given replacement array
	 * and returns the result as a new pattern.
	 *
	 * Placeholder have to be of the form `<<\d+>>` where the number is the index of a replacement in the replacement
	 * array. The pattern of each inserted replacement will be wrapped with a non-capturing group. Backreferences in
	 * the given pattern and inserted replacements will be adjusted, so that they still reference the same group as
	 * before this operation.
	 *
	 * Escaped placeholders (e.g. `\<<2>>` or `<<3>\>`), placeholders inside character classes (e.g. `[a-z<<2>>]`), and
	 * placeholders in replacements will not be replaced.
	 *
	 * If the flags of any two replacements or of the given pattern are contradictory (e.g. the given pattern requires
	 * the `i` flag while a replacement forbids it) an error will be thrown. The given pattern and the replacements are
	 * not allowed to use octal escapes (e.g. `\2` in `/(a)\2/i`) and backreferences cannot be declared before the
	 * referenced capturing group (e.g. `/\1(a)/` is not allowed).
	 *
	 * @param {string | Pattern} pattern
	 * @param {(string | Pattern)[]} replacements
	 * @returns {Pattern}
	 */
	function template(pattern, replacements) {
		/** @type {string} */
		var source;
		/** @type {MutableFlags} */
		var flags;
		if (typeof pattern === 'string') {
			source = pattern;
			flags = noFlags;
		} else {
			source = pattern.source;
			flags = pattern.flags;
		}

		if (!Prism.MIN) {
			// This will verify that the template pattern and every replacement are valid regular expressions.
			// This is done here to catch errors early since otherwise mistakes in patterns will only result in errors
			// when converting to RegExp which may be many steps down the line.
			RegExp(source);

			replacements.forEach(function (rep) {
				if (typeof rep === 'string') {
					RegExp(rep);
				} else {
					RegExp(rep.source);
				}
			});
		}

		/** Whether the current flags set is actually mutable. */
		var mutable = false;

		/** The current number of processed groups in the base pattern. */
		var baseGroupCount = 0;
		/** The current number of added groups to the base pattern. */
		var addedGroupCount = 0;
		/**
		 * A map from the number of a capturing group in the base pattern to the number of that capturing group in the
		 * final pattern. Groups will be assigned a different number because the replacements might add their own
		 * groups.
		 *
		 * @type {Record<string, number>}
		 */
		var baseGroupMap = {};


		/**
		 * Returns the source of the given replacement and adds the flags of the replacement to the current set of
		 * flags.
		 *
		 * @param {string} key
		 * @returns {string}
		 */
		function getReplacement(key) {
			/** @type {string | Pattern} */
			var rep = replacements[key];

			if (rep == undefined && !Prism.MIN) {
				throw new Error('There is no replacement for <<' + key + '>>.');
			}

			if (typeof rep === 'string') {
				return processReplacementSource(key, rep);
			} else {
				handleReplacementFlags(key, rep.flags);
				return processReplacementSource(key, rep.source);
			}
		}

		/**
		 * Adds the flags of a replacement to the current set of flags.
		 *
		 * @param {string} key
		 * @param {Flags} repFlags
		 * @returns {void}
		 */
		function handleReplacementFlags(key, repFlags) {
			if (repFlags !== noFlags) {
				if (flags === noFlags) {
					// Just copy the replacement's flags, they're immutable after all.
					flags = repFlags;
				} else if (flags !== repFlags) {
					// The basic idea is that we go through every flag and check whether we need to change the current
					// flags. If so, we make the flags mutable, if not mutable already, and set the flag.
					flagKeys.forEach(function (f) {
						var rf = repFlags[f];
						if (rf != undefined) {
							var ff = flags[f];
							if (ff == undefined) {
								// create a mutable copy of the flags
								if (!mutable) {
									mutable = true;
									flags = Prism.util.clone(flags);
								}
								// set new flag
								flags[f] = rf;
							} else if (rf !== ff) {
								// Contradiction. This happens if two incompatible patterns are combined.
								// E.g. a case sensitive and a case insensitive pattern
								if (!Prism.MIN) {
									throw new Error('<<' + key + '>> requires the ' + f + ' flag to be ' + rf + ' in contradiction with current flags.');
								}
							}
						}
					});
				}
			}
		}

		/**
		 * Returns the adjusted source of the given replacement source. This will adjust the backreferences in the
		 * replacement and count the number of capturing groups in the replacement.
		 *
		 * @param {string} key
		 * @param {string} repSource
		 * @returns {string}
		 */
		function processReplacementSource(key, repSource) {
			var offset = baseGroupCount + addedGroupCount;
			var groupCount = 0;

			repSource = '(?:' + replaceSource(repSource, '',
				/**
				 * @param {string} m
				 * @param {string} [backRef]
				 * @param {string} [group]
				 */
				function (m, backRef, group) {
					if (backRef) {
						var ref = +backRef;
						// This reference might refer to a group which has yet to appear or to no group at all in the
						// case of an octal escape. For more information, see `getBackReference`.
						if (ref > groupCount && !Prism.MIN) {
							throw new Error('Invalid backreference \\' + backRef + ' in replacement <<' + key + '>>.');
						}
						return '\\' + (ref + offset);
					}
					if (group) {
						groupCount++;
					}
					return m;
				}) + ')';

			addedGroupCount += groupCount;

			return repSource;
		}

		/**
		 * Returns a adjusted backreference which points to the same group as the given backreference.
		 *
		 * Back reference have to be adjusted because replacements might introduce new groups which change the number
		 * of the referenced capturing group.
		 *
		 * @param {string} backRef
		 * @returns {string}
		 */
		function getBackReference(backRef) {
			var newRef = baseGroupMap[backRef];
			// The reference might refer to a group which has yet to appear. A "forward reference" so to say.
			// Example: /\1(a)/
			// For whatever reason, this is actually a valid RegExp and will work. References to groups which aren't
			// matched will be replaced with the empty string, so the above example will match the string "a".
			// The problem with these "forward reference" is that we don't know the new index of the referenced group
			// yet, so `newRef` will be undefined.
			// Note: `newRef` will also be undefined for octal escapes (e.g. /\3/) but those shouldn't be used anyway.
			if (!newRef && !Prism.MIN) {
				throw new Error('Invalid backreference \\' + backRef);
			}
			return '\\' + newRef;
		}

		source = replaceSource(source, '<<(\\d+)>>',
			/**
			 * @param {string} m
			 * @param {string} [key]
			 * @param {string} [backRef]
			 * @param {string} [group]
			 */
			function (m, key, backRef, group) {
				if (key) {
					return getReplacement(key);
				}
				if (backRef) {
					return getBackReference(backRef);
				}
				if (group) {
					baseGroupCount++;
					baseGroupMap[baseGroupCount] = baseGroupCount + addedGroupCount;
				}
				return m;
			});

		return p(source, flags);
	}

	/**
	 * @param {string} source
	 * @param {number} depth
	 * @returns {string}
	 */
	function nestedSource(source, depth) {
		var re = /<<self>>/g;
		if (depth >= 1) {
			return source.replace(re, '(?:' + nestedSource(source, depth - 1) + ')');
		} else {
			return source.replace(re, '[^\\s\\S]');
		}
	}

	/**
	 * Creates a nested version of the given pattern where the string `<<self>>` within the pattern will be replaced
	 * with the pattern itself. This will be done recursively `depth` times.
	 *
	 * This operation does not changes the flags of the pattern.
	 *
	 * Note: This operation does not support capturing groups and backreferences.
	 *
	 * @param {string | Pattern} pattern
	 * @param {number} depth
	 * @returns {Pattern}
	 */
	function nested(pattern, depth) {
		if (typeof pattern === 'string') {
			pattern = p(pattern);
		}


		if (!Prism.MIN) {
			var source = pattern.source;

			// Verify that the pattern is correct.
			RegExp(source);

			// The pattern's source is not allowed to contain capturing groups or backreferences.
			replaceSource(source, '',
				function (m, backRef, group) {
					if (group) {
						throw new Error('Capturing groups are not allowed in the nested pattern /' + source + '/');
					}
					if (backRef) {
						throw new Error('Back references are not allowed in the nested pattern /' + source + '/');
					}
					return m;
				}
			)
		}

		return p(nestedSource(pattern.source, depth), pattern.flags);
	}

	// exports

	Object.defineProperties(Prism.languages.patterns = {}, {
		pattern: { value: p },
		toRegExp: { value: toRegExp },
		template: { value: template },
		nested: { value: nested }
	});

}(Prism));
