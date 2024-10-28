(function () {
	if (typeof Prism === "undefined" || typeof document === "undefined") {
		return;
	}

	Prism.plugins.lineInsert = {
		wrapLines: function (env) {
			if (!env || !env.element) return;

			const lines = env.element.innerHTML.split("\n");

			env.element.innerHTML = lines
				.map((line) => `<div class="line-wrapper">${line}</div>`)
				.join("");
		},
	};

	Prism.hooks.add("after-highlight", function (env) {
		Prism.plugins.lineInsert.wrapLines(env);
	});
})();
