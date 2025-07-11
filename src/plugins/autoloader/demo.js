async function getZip (files, elt) {
	let process = async () => {
		elt.setAttribute('data-progress', Math.round((i / l) * 100));
		if (i < l) {
			await addFile(zip, files[i][0], files[i][1]);
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

async function addFile (zip, filename, filepath) {
	let contents = await getFileContents(filepath);
	zip.file(filename, contents);
}

async function getFileContents (filepath) {
	let response = await fetch(filepath);
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	return response.text();
}

document.querySelector('.download-grammars').addEventListener('click', async ({ target }) => {
	let btn = target;
	if (btn.classList.contains('loading')) {
		return;
	}
	btn.classList.add('loading');
	btn.setAttribute('data-progress', 0);

	let files = [];
	for (let id in components.languages) {
		if (id === 'meta') {
			continue;
		}
		let basepath =
			'https://dev.prismjs.com/' + components.languages.meta.path.replace(/\{id}/g, id);
		let basename = basepath.substring(basepath.lastIndexOf('/') + 1);
		files.push([basename + '.js', basepath + '.js']);
		files.push([basename + '.min.js', basepath + '.min.js']);
	}

	let zip = await getZip(files, btn);
	btn.classList.remove('loading');

	let blob = await zip.generateAsync({ type: 'blob' });
	saveAs(blob, 'prism-components.zip');
});
