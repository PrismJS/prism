import { assert } from 'chai';
import { toArray } from '../src/shared/util';
import { getComponent, getLanguageIds } from './helper/prism-loader';
const { languages } = require('./../components.json');


for (const lang of getLanguageIds()) {
	describe(`Testing language aliases of '${lang}'`, () => {
		it('- should have all alias titles registered as alias', async () => {
			const aliases = new Set(toArray((await getComponent(lang)).alias));
			/** @type {Record<string, string>} */
			const aliasTitles = languages[lang].aliasTitles ?? {};

			Object.keys(aliasTitles).forEach(id => {
				if (!aliases.has(id)) {
					const titleJson = JSON.stringify(aliasTitles[id]);
					assert.fail(`The alias '${id}' with the title ${titleJson} is not registered as an alias.`);
				}
			});
		});
	});
}
