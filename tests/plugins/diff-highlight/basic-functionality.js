import { createTestSuite } from '../../helper/prism-dom-util';

const jsCode = `
@@ -4,6 +4,5 @@
-    let foo = bar.baz([1, 2, 3]);
-    foo = foo + 1;
+    const foo = bar.baz([1, 2, 3]) + 1;
     console.log(\`foo: \${foo}\`);
`.trim();

describe('Diff Highlight', () => {
	const { it } = createTestSuite({
		languages: ['javascript'],
		plugins: 'diff-highlight'
	});

	it('should work with language-diff', ({ util }) => {
		util.assert.highlight({
			language: 'diff',
			code: jsCode
		});
	});

	it('should work with language-diff-javascript', ({ util }) => {
		util.assert.highlight({
			language: 'diff-javascript',
			code: jsCode
		});
	});

	it('should work with aliases', ({ util }) => {
		util.assert.highlight({
			language: 'diff-js',
			code: jsCode
		});
	});
});
