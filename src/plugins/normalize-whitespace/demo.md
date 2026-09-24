---
layout: null
eleventyExcludeFromCollections: true
---

<body>
<section id="main" class="language-javascript">

<pre>

	<code>


		let example = {
			foo: true,

			bar: false
		};


	</code>

</pre>

<pre data-break-lines="50">

	<code>


		let there_is_a_very_very_very_very_long_line_it_can_break_it_for_you = true;

		if (there_is_a_very_very_very_very_long_line_it_can_break_it_for_you === true) {
		};


	</code>

</pre>

</section>

<script type="module">
import Prism from "https://v2.dev.prismjs.com/dist/index.js";
import "https://v2.dev.prismjs.com/dist/plugins/normalize-whitespace.js";

// Optional
Prism.pluginRegistry.peek("normalize-whitespace").plugin.setDefaults({
	"remove-trailing": true,
	"remove-indent": true,
	"left-trim": true,
	"right-trim": true,
});
</script>
</body>
