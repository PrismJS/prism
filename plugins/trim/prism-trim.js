(function() {
	"use strict";
	if ( !self.Prism || ![].filter) return;

	// classes for disabling trimming
	var dont = /\bdont-trim(?:-(indent|start|end|trailing))?\b/g;
	// the horrible character classes below are just \s without \r and \n
	var eolSpace = /[ \f\t\v​\u00a0\u1680​\u180e\u2000-\u200a\u2028\u2029\u202f\u205f​\u3000\ufeff]+$/gm;
	var solSpace = /^[ \f\t\v​\u00a0\u1680​\u180e\u2000-\u200a\u2028\u2029\u202f\u205f​\u3000\ufeff]+(?=\S)/m;

	// determines what to trim (can be affected by any ancestor)
	function get_conf(el) {
		if (!/pre/i.test(el.parentNode.nodeName)) return false; // only trim blocks
		var conf = {
			'indent': true,
			'start': true,
			'end': true,
			'trailing': true
		};
		function updateConf(m, t) {
			if (t === undefined) conf = false;
			else conf[t] = false;
		}
		while (el && conf) {
			// note: abusing .replace to iterate over matches
			(""+el.className).replace(dont, updateConf);
			el = el.parentNode;
		}
		return conf;
	}
	
	function trim(env) {
		var conf = get_conf(env.element);
		if (conf) {
			if (conf.start) env.code = env.code.replace(/^\s*\n/g, '');
			if (conf.end) env.code = env.code.replace(/\r?\n\s+$/g, '');
			if (conf.trailing) env.code = env.code.replace(eolSpace, '');
			if (conf.indent) {
				var first_indent = env.code.match(solSpace);
				if (first_indent) {
					env.code = env.code.replace(
						(new RegExp("^"+first_indent[0], "gm")),
						''
					);
				}
			}
		}
	}

	Prism.hooks.add('before-highlight', trim);
	Prism.hooks.add('wont-highlight', function (env) {
		if (env.code && env.language === "none") {
			// find just the child that is the code,
			// in case other plugins have added extra already
			var codeChild = [].filter.call(
				env.element.childNodes,
				function (el) {
					if (el.textContent === env.code) return true;
					else return false;
				}
			)[0];
			if (codeChild) {
				trim(env);
				codeChild.textContent = env.code;
			}
		}
	});
})();
