(function() {
	if ( !self.Prism || !self.document || !document.querySelectorAll ) return;

	var adapters = [
		/* github */
		function (rsp) {
			if ( rsp && rsp.meta && rsp.data ) {
				if ( rsp.meta.status && Number(rsp.meta.status >= 400) ) {
					return "Error: " + ( rsp.data.message || rsp.meta.status );
				}
				else if ( typeof(rsp.data.content) === "string" ) {
					var rsp_data_content = "Your browser cannot decode base64";
					
					if (typeof(atob) === "function")
					{
						try
						{
							rsp_data_content = atob(rsp.data.content);
						}
						catch(err)
						{
							rsp_data_content = Base64.decode(rsp.data.content);
						}
					}
					else
					{
						rsp_data_content = Base64.decode(rsp.data.content);
					}
					
					return rsp_data_content;
				}
				else {
					return "No data";
				}
			}
			return "";
		},
		/* bitbucket */
		function (rsp) {
			return rsp && rsp.node && typeof(rsp.data) === "string"
				? rsp.data
				: "";
		}
	],
	jsonpcb=0,
	loadstr = "Loading…";

	Array.prototype.slice.call(document.querySelectorAll("pre[data-jsonp]")).forEach(function(pre) {
		var code = document.createElement("code");
		code.textContent = loadstr;
		pre.appendChild(code);

		var adapterfn = pre.getAttribute("data-adapter");
		var adapter = null;
		if ( adapterfn ) {
			if ( typeof(window[adapterfn]) === "function" ) {
				adapter = window[adapterfn];
			}
			else {
				code.textContent = "JSONP adapter function '" + func + "' doesn't exist";
				return;
			}
		}

		var cb = "prismjsonp" + ( jsonpcb++ );
		
		var uri = document.createElement('a');
		var src = uri.href = pre.getAttribute("data-jsonp");
		uri.href += ( uri.search ? "&" : "?" ) + ( pre.getAttribute("data-callback") || "callback" ) + "=" + cb;

		var timeout = setTimeout(function() {
			// we could clean up window[cb], but if the request finally succeeds, keeping it around is a good thing
			if ( code.textContext === loadstr )
				code.textContent = "Timeout loading '" + src + "'";
		}, 5000);
		
		window[cb] = function(rsp) {
			clearTimeout(timeout);
			delete window[cb];

			var data = "";
			
			if ( adapter ) {
				data = adapter(rsp);
			}
			else {
				for ( var p in adapters ) {
					data = adapters[p](rsp);
					if ( data ) break;
				}
			}

			code.textContent = data || "Cannot parse response (perhaps you need an adapter function?)";
			data && Prism.highlightElement(code);
		};

		var script = document.createElement("script");
		script.src=uri.href;
		document.head.appendChild(script);
	});
})();