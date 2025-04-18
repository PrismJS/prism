// TODO: Remove “v2.” from the URL once Prism v2 is released
declare module 'https://v2.plugins.prismjs.com/autoloader/prism-autoloader.js' {
	import type { PluginProto } from './types';
	const autoloader: PluginProto<'autoloader'>;
	export default autoloader;
}
