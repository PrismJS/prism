import fs from 'fs/promises';
import { runTask } from './tasks';

runTask(async () => {
	const changelog = 'CHANGELOG.md';
	let content = await fs.readFile(changelog, 'utf-8');

	content = content.replace(/#(\d+)(?![\d\]])/g, '[#$1](https://github.com/PrismJS/prism/issues/$1)');
	content = content.replace(
		/\[[\da-f]+(?:, *[\da-f]+)*\]/g,
		(m) => m.replace(/([\da-f]{7})[\da-f]*/g, '[`$1`](https://github.com/PrismJS/prism/commit/$1)')
	);

	await fs.writeFile(changelog, content, 'utf-8');
});
