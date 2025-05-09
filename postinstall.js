// The script is compatible with Node.js 10+

const { execSync } = require('child_process');
const { resolve } = require('path');

function gulpInstalled () {
	try {
		require.resolve('gulp');
		return true;
	}
	catch {
		return false;
	}
}

const root = resolve(__dirname, '.');

if (!gulpInstalled()) {
	console.log('[postinstall] Dependencies missing — installing...');
	execSync('npm install', { cwd: root, stdio: 'inherit' });
}
else {
	console.log('[postinstall] Dependencies already installed.');
}

console.log('[postinstall] Running build...');
execSync('npm run build', { cwd: root, stdio: 'inherit' });
