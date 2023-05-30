import { assert } from 'chai';
import { readFileSync } from 'fs';
import path from 'path';
import { forEach, noop, toArray } from '../src/shared/util';
import { getComponent, getComponentIds, getLanguageIds } from './helper/prism-loader';


describe('Components', () => {
	it('- should not have redundant optional dependencies', async function () {
		this.timeout(10_000);

		for (const id of getComponentIds()) {
			const proto = await getComponent(id).catch(noop);
			const require = new Set(toArray(proto?.require).map((p) => p.id));

			forEach(proto?.optional, (opt) => {
				if (require.has(opt)) {
					assert.fail(`The optional dependency ${opt} is redundant because ${id} already requires it. Remove the optional dependency.`);
				}
			});
		}
	});


	it('- should have unique aliases', async function () {
		this.timeout(10_000);

		const seen = new Map<string, string>();

		const add = (id: string, desc: string) => {
			const already = seen.get(id);
			if (already) {
				assert.fail(`Expected ${id} to be ${desc} but it is already ${already}`);
			}
			seen.set(id, desc);
		};

		for (const id of getComponentIds()) {
			const proto = await getComponent(id).catch(noop);
			add(id, 'a component id');
			forEach(proto?.alias, (a) => add(a, `an alias of ${id}`));
		}
	});
});

const components = JSON.parse(readFileSync(path.join(__dirname, '../src/components.json'), 'utf-8')) as Components;

type Components = Record<string, ComponentCategory>;
type ComponentCategory = Record<string, ComponentEntry | string>;
interface ComponentEntry {
	/**
	 * The title of the component.
	 */
	title?: string;
	/**
	 * The GitHub user name of the owner.
	 */
	owner?: string;
	/**
	 * Whether the component doesn't have style sheets which should also be loaded.
	 */
	noCSS?: boolean;
	/**
	 * An optional map from an alias to its title.
	 *
	 * Aliases which are not in this map will the get title of the component.
	 */
	aliasTitles?: Record<string, string>;
}

describe('components.json', () => {

	function forEachEntry(consumeFn: (entry: ComponentEntry, id: string, entries: Record<string, ComponentEntry>) => void) {
		const entries: Record<string, ComponentEntry> = {};

		for (const category in components) {
			for (const id in components[category]) {
				const entry = components[category][id];
				if (id !== 'meta' && entry && typeof entry === 'object') {
					entries[id] = entry;
				}
			}
		}

		for (const id in entries) {
			consumeFn(entries[id], id, entries);
		}
	}

	describe('- should have valid alias titles', () => {
		for (const lang of getLanguageIds()) {
			it(`- ${lang} should have all alias titles registered as alias`, async () => {
				const aliases = new Set(toArray((await getComponent(lang)).alias));
				const aliasTitles = (components.languages[lang] as ComponentEntry | undefined)?.aliasTitles ?? {};

				Object.keys(aliasTitles).forEach((id) => {
					if (!aliases.has(id)) {
						const titleJson = JSON.stringify(aliasTitles[id]);
						assert.fail(`The alias '${id}' with the title ${titleJson} is not registered as an alias.`);
					}
				});
			});
		}
	});

	it('- should have a sorted language list', () => {
		const ignore = new Set(['meta', 'xml', 'markup', 'css', 'clike', 'javascript', 'plain']);
		const languages = Object.keys(components.languages).filter((key) => !ignore.has(key)).map((key): { id: string, title: string } => {
			return {
				id: key,
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				title: (components.languages[key] as ComponentEntry).title!
			};
		});

		/**
		 * Transforms the given title into an intermediate representation to allowed for sensible comparisons
		 * between titles.
		 */
		function transformTitle(title: string) {
			return title.replace(/\W+/g, '').replace(/^\d+/, '').toLowerCase();
		}

		const sorted = [...languages].sort((a, b) => {
			const comp = transformTitle(a.title).localeCompare(transformTitle(b.title));
			if (comp !== 0) {
				return comp;
			}
			// a and b have the same intermediate form (e.g. "C" => "C", "C++" => "C", "C#" => "C").
			return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
		});

		assert.sameOrderedMembers(languages, sorted);
	});

	it('- should not have unknown properties', () => {
		const knownProperties = new Set([
			'title',
			'description',
			'aliasTitles',
			'owner',

			'noCSS',
			'option'
		]);

		forEachEntry((entry, id) => {
			for (const prop in entry) {
				if (!knownProperties.has(prop)) {
					assert.fail(
						`Component "${id}":` +
						` The property ${JSON.stringify(prop)} is not supported by Prism.`
					);
				}
			}
		});
	});
});
