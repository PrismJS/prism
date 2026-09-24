async function getZip (files, elt) {
	let process = async () => {
		elt.setAttribute('data-progress', Math.round((i / l) * 100));
		if (i < l) {
			await addFile(zip, files[i]);
			i++;
			await process();
		}
	};

	let zip = new JSZip();
	let l = files.length;
	let i = 0;

	await process();

	return zip;
}

// The folder with the grammars, e.g. `https://v2.dev.prismjs.com/dist/`: the zip mirrors it
let root;

// Grammars import shared files, like `../patterns-<hash>.js`, so add those too
async function addFile (zip, filepath) {
	let response = await fetch(filepath);
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	let contents = await response.text();

	// The page asks for `/languages/<id>.js`, which redirects to the folder
	root ??= new URL('../', response.url).href;
	zip.file(response.url.slice(root.length), contents);

	for (let [, path] of contents.matchAll(/(?:from|import)\s*["'](\.\.?\/[^"']+)["']/g)) {
		let url = new URL(path, response.url).href;
		if (!zip.file(url.slice(root.length))) {
			await addFile(zip, url);
		}
	}
}

document.querySelector('.download-grammars').addEventListener('click', async ({ target }) => {
	let btn = target;
	if (btn.classList.contains('loading')) {
		return;
	}
	btn.classList.add('loading');
	btn.setAttribute('data-progress', 0);

	let components = await (await fetch('/components.json')).json();
	let files = [];
	for (let id in components.languages) {
		if (id === 'meta') {
			continue;
		}
		files.push(`/${components.languages.meta.path.replace(/\{id\}/g, id)}.js`);
	}

	let zip = await getZip(files, btn);
	btn.classList.remove('loading');

	let blob = await zip.generateAsync({ type: 'blob' });
	saveAs(blob, 'prism-components.zip');
});
