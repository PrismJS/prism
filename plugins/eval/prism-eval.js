(function () {

	if (typeof self === "undefined" || !self.Prism || !self.document) {
		return;
	}

	var evalAttributeName = "data-eval";
	var outputIdAttributeName = "data-output";
	var logPrefix = "Prism-eval: ";
	var outputClassName = "prism-eval-output";
	var defaultOutputId = "prism-eval-output";
	var defaultOutputNode = document.getElementById(defaultOutputId);

	Prism.eval = {
		logLevel: "warn"
	};

	/**
	 * Write in the element with id "outputElementId-label", of outputElementId and label
	 * exist, and the element exists, and in outputElement otherwise.
	 */
	function output(style, outputElement, outputElementId, str, label) {
		var actualElement = outputElement;

		if (label) {
			if (!outputElementId) {
				warn("output asked with label \"" + label + "\", but no data-output base specified (output: \""
					+ str + "\")");
				return;
			}
			var labeledOutputElementId = outputElementId + "-" + label;
			var labeledElement = document.getElementById(outputElementId + "-" + label);
			if (!labeledElement) {
				warn("output asked in element with id \"" + labeledOutputElementId + "\", but no such element exists"
					+ " (output: \"" + str + "\")");
				return;
			}
			labeledElement.className = outputClassName;
			actualElement = labeledElement;
		}

		var line = document.createElement(outputElement.nodeName === "div" ? "div" : "span");
		line.className = "prism-eval-" + style;
		var text = document.createTextNode(str);
		line.appendChild(text);
		actualElement.appendChild(line);
	}

	var noOutput = (function(str, label) {
		// NOP
	}).bind(Prism.eval);

	function prepareNoOutput() {
		Prism.eval.log = noOutput;
		Prism.eval.info = noOutput;
		Prism.eval.warn = noOutput;
		Prism.eval.error = noOutput;
		Prism.eval.result = noOutput;

		return Prism.eval;
	}

	function defaultOutput() {
		if (defaultOutputNode) {
			Prism.eval.log = output.bind(Prism.eval, "log", defaultOutputNode, defaultOutputId);
			Prism.eval.info = output.bind(Prism.eval, "info", defaultOutputNode, defaultOutputId);
			Prism.eval.warn = output.bind(Prism.eval, "warn", defaultOutputNode, defaultOutputId);
			Prism.eval.error = output.bind(Prism.eval, "error", defaultOutputNode, defaultOutputId);
			Prism.eval.result = output.bind(Prism.eval, "result", defaultOutputNode, defaultOutputId);
		}
		else {
			prepareNoOutput();
		}
	}

	if (defaultOutputNode) {
		defaultOutputNode.className = outputClassName;
	}
	defaultOutput(); // init output

	function attribute(/*Node*/ codeElement, /*String*/ attributeName) {
		//noinspection JSUnresolvedFunction
		return codeElement.getAttribute(attributeName) ||
			(codeElement.parentNode && codeElement.parentNode.getAttribute(attributeName));
	}

	function prepareOutput(/*Node*/ codeElement) {
		var baseOutputId = attribute(codeElement, outputIdAttributeName);

		if (baseOutputId === "none") {
			return prepareNoOutput();
		}

		var outputElement;
		if (baseOutputId) {
			outputElement = document.getElementById(baseOutputId);
		}
		if (!outputElement) {
			var outputSibling = codeElement;
			if (codeElement.parentNode.nodeName.toLowerCase() === "pre") {
				outputSibling = codeElement.parentNode;
				outputElement = document.createElement("div");
			}
			else {
				outputElement = document.createElement("span");
			}
			if (baseOutputId) {
				outputElement.id = baseOutputId;
			}
			outputSibling.parentNode.insertBefore(outputElement, outputSibling.nextSibling);
		}
		outputElement.className = outputClassName;

		Prism.eval.log = output.bind(Prism.eval, "log", outputElement, baseOutputId);
		Prism.eval.info = output.bind(Prism.eval, "info", outputElement, baseOutputId);
		Prism.eval.warn = output.bind(Prism.eval, "warn", outputElement, baseOutputId);
		Prism.eval.error = output.bind(Prism.eval, "error", outputElement, baseOutputId);
		Prism.eval.result = output.bind(Prism.eval, "result", outputElement, baseOutputId);

		return Prism.eval;
	}

	function debug(str) {
		if (Prism.eval.logLevel === "debug") {
			console.debug(logPrefix + str);
		}
	}

	function info(str) {
		if (Prism.eval.logLevel === "debug" || Prism.eval.logLevel === "info") {
			console.info(logPrefix + str);
		}
	}

	function warn(str) {
		if (Prism.eval.logLevel === "debug" || Prism.eval.logLevel === "info" || Prism.eval.logLevel === "warn") {
			console.warn(logPrefix + str);
		}
	}

	function error(str) {
		if (Prism.eval.logLevel === "debug"
			|| Prism.eval.logLevel === "info"
			|| Prism.eval.logLevel === "warn"
			|| Prism.eval.logLevel === "error") {
			console.error(logPrefix + str);
		}
	}

	Prism.hooks.add("complete", function (env) {
		/* This is called twice for elements handled by File HighLight, once when it is discovered by Prism itself,
			 and once when it is loaded by the plugin. This goes for all "hooks". */


		// works only for <code> wrapped inside <pre> (not inline), with a truthy "data-eval" attribute
		if (!env || !env.element || !env.language) {
			// should not happen
			error("Prism-eval: called with an environment that does not contain an element and a language.");
			return;
		}

		if (env.language !== "javascript") {
			debug("Prism-eval: called with an environment that is not for a JavaScript code snippet. NOP.");
			return;
		}

		var evalAttribute = attribute(env.element, evalAttributeName);

		if (!evalAttribute) {
			debug("called with an environment for JavaScript without a truthy data-eval attribute on <code> or its parent.");
			return;
		}

		debug("The element is setup to execute code");
		//var preSrc = env.element.parentNode && env.element.parentNode.getAttribute("data-src");
		//if (!preSrc) { // src in HTML
		if (!env.code) {
			warn("<code> element was setup to evaluate code mentioned in html, but there is no code.");
			return;
		}
		if (env.code === "Loading…") {
			debug("<code> is loading (File HighLight).");
			return;
		}
		debug("there is code; eval on the next tick");
		var fileHighLightSrc = env.element.parentNode && env.element.parentNode.getAttribute("data-src");
		if (!fileHighLightSrc || evalAttribute !== "script") {
			debug("src in HTML, or src in external file via plugin file-highlight, but not ordered to do script; " +
				"doing eval");
			setTimeout(
				function () {
					var output = prepareOutput(env.element);
					try {
						debug("will evaluate: \"" + env.code + "\"");
						var result = eval(env.code); // will also contain exception
						if (result !== undefined) {
							output.result(result);
						}
					}
					catch (exc) {
						info("Evaluation resulted in an exception: \"" + (exc.message || exc) + "\". Code: " + env.code);
						result = null;
						output.error(exc);
					}
					finally {
						defaultOutput();
					}
				},
				0
			);
		}
		else {
			debug("src not in the HTML, but in an external file via plugin file-highlight, and ordered to do script");
			if (!defaultOutputNode) {
				warn("output of evaluation via script insertion requires an element with id \"" + defaultOutputId + "\"; no" +
					" such element exists.");
			}
			var script = document.createElement("script");
			script.async = true;
			script.src = fileHighLightSrc;
			// no type, means JavaScript; output will be defaultOutput
			document.getElementsByTagName("head")[0].appendChild(script);
		}
	});

}());
