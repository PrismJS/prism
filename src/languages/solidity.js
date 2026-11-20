import registry from '../registry.js';
import clike from './clike.js';

/** @type {import('../types.d.ts').LanguageProto<'solidity'>} */
const Self = {
	id: 'solidity',
	base: clike,
	alias: 'sol',
	grammar () {
		return {
			'class-name': {
				pattern: /(\b(?:contract|enum|interface|library|new|struct|using)\s+)(?!\d)[\w$]+/,
				lookbehind: true,
			},
			'keyword': [
				{
					// the `from` keyword in import statements:
					// `import {A as B} from "...";`, `import * as X from "...";`
					pattern:
						/(\bimport\b\s+(?:\{[\s\S]*?\}|\*\s+as\s+[A-Za-z_$][\w$]*)\s+)\bfrom\b/,
					lookbehind: true,
				},
				/\b(?:_|anonymous|as|assembly|assert|break|calldata|case|constant|constructor|continue|contract|default|delete|do|else|emit|enum|event|external|for|function|if|import|indexed|inherited|interface|internal|is|let|library|mapping|memory|modifier|new|payable|pragma|private|public|pure|require|returns?|revert(?=\s*(?:\(|[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*\s*\())|selfdestruct|solidity|storage|struct|suicide|switch|this|throw|using|var|view|while)\b/,
			],
			'operator': /=>|->|:=|=:|\*\*|\+\+|--|\|\||&&|<<=?|>>=?|[-+*/%^&|<>!=]=?|[~?]/,
			$insertBefore: {
				'keyword': {
					'builtin':
						/\b(?:address|bool|byte|u?int(?:8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?|string|bytes(?:[1-9]|[12]\d|3[0-2])?)\b/,
				},
				'number': {
					'version': {
						pattern: /([<>]=?|\^)\d+\.\d+\.\d+\b/,
						lookbehind: true,
						alias: 'number',
					},
				},
			},
		};
	},
};

export default Self;

registry.add(Self);
