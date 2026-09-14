import { assert } from 'chai';
import { createTestSuite } from '../helper/prism-dom-util.js';

const jsDiff = `
@@ -4,6 +4,5 @@
-    let foo = bar.baz([1, 2, 3]);
-    foo = foo + 1;
+    const foo = bar.baz([1, 2, 3]) + 1;
     console.log(\`foo: \${foo}\`);
`.trim();

const djangoCss = `
a {
{% if setColor %}
	color: {{ bar }};
{% endif %}
}
`.trim();

const djangoCssDiff = `
@@ -1,3 +1,3 @@
 a {
-	color: {{ foo }};
+	color: {{ bar }};
 }
`.trim();

describe('Compound language ids (outer:inner)', () => {
	const { it } = createTestSuite({
		languages: ['diff', 'javascript', 'css', 'django', 'liquid', 'php'],
	});

	it('should highlight a diff of another language', ({ util }) => {
		util.assert.highlight({ language: 'diff:javascript', code: jsDiff });
	});

	it('should resolve aliases in compound ids', ({ Prism }) => {
		assert.strictEqual(
			Prism.highlight(jsDiff, 'diff:js'),
			Prism.highlight(jsDiff, 'diff:javascript')
		);
		assert.strictEqual(
			Prism.highlight(djangoCss, 'jinja2:css'),
			Prism.highlight(djangoCss, 'django:css')
		);
	});

	it('should work with language-xxxx classes on elements', ({ util }) => {
		util.assert.highlightElement({ language: 'diff:js', code: jsDiff });
	});

	it('should set the compound language class on the parent <pre>', ({ document, Prism }) => {
		const pre = document.createElement('pre');
		const code = document.createElement('code');
		code.className = 'language-diff:js';
		code.textContent = jsDiff;
		pre.appendChild(code);

		Prism.highlightElement(code);

		assert.isTrue(pre.classList.contains('language-diff:js'));
		assert.isTrue(code.classList.contains('language-diff:js'));
		assert.include(code.innerHTML, 'class="token keyword">const<');
	});

	it('should let templating languages produce other languages', ({ util }) => {
		util.assert.highlight({ language: 'django:css', code: djangoCss });
	});

	it('should default to the declared inner language', ({ Prism }) => {
		const code = '<b>{{ foo | upcase }}</b>';
		assert.strictEqual(Prism.highlight(code, 'liquid:markup'), Prism.highlight(code, 'liquid'));
		assert.include(Prism.highlight(code, 'liquid'), 'class="token tag"');

		// `none` opts out of the inner language
		const none = Prism.highlight(code, 'liquid:none');
		assert.notInclude(none, 'class="token tag"');
		assert.include(none, 'class="token liquid"');
	});

	it('should be recursive', ({ util }) => {
		util.assert.highlight({ language: 'diff:django:css', code: djangoCssDiff });
	});

	it('should support custom composition (php)', ({ util }) => {
		util.assert.highlight({ language: 'php:none', code: '<?php echo 1; ?> <b>text</b>' });
	});

	it('should treat compound ids of non-meta-languages as unknown', ({ Prism }) => {
		assert.isNull(Prism.languageRegistry.getLanguage('javascript:css'));
		assert.throws(() => Prism.highlight('foo', 'javascript:css'), /has no grammar/);
		assert.throws(() => Prism.highlight('foo', 'diff:nope'), /has no grammar/);
	});
});
