(function() {
	if ( !self.Prism || !self.document || !document.querySelectorAll ) return;

	var adapters = [
		/* github */
		function (x) {
			return x.meta && x.data && typeof(x.data.content) === "string"
				? typeof(atob) === "function"
					? atob(x.data.content)
					: "Your browser cannot parse base64"
				: "";
		},
		/* butbucket */
		function (x) {
			return x.node && typeof(x.data) === "string"
				? x.data
				: "";
		}
	],
	injectResponse = function(destination, code) {
		var el = document.createElement("code");
		el.textContent = code;
		destination.innerHTML = el.outerHTML;
		Prism.highlightElement(destination);
	},
	jsonpcb=0;

	Array.prototype.slice.call(document.querySelectorAll("pre[data-jsonp]")).forEach(function(pre) {
		pre.textContent = "Loading...";
		var uri = document.createElement('a');
		uri.href = pre.getAttribute("data-jsonp");
		var cb = "prismjsonp" + ( jsonpcb++ );
		window[cb] = function(data) {
			delete window[cb];
			var code = "";
			var func = pre.getAttribute("data-adapter");
			if ( func ) {
				code = typeof(window[func]) === "function"
					? window[func](data)
					: ("JSONP adapter function '" + func + "' doesn't exist");
			}
			else {
				for ( var p in adapters ) {
					code = adapters[p](data);
					if ( code ) break;
				}
			}
			return injectResponse(pre, code || "Cannot parse response (perhaps you need an adapter function?)");
		};
		uri.href += ( uri.search ? "&" : "?" ) + ( pre.getAttribute("data-cb") || "callback" ) + "=" + cb;
		var script = document.createElement("script");
		script.src=uri.href;
		document.head.appendChild(script).parentNode.removeChild(script);
	});
})();