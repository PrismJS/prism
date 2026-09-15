Prism.languages['ssh-config'] = {
	'comment': /#.*/,
	'keyword': /\b(?:Host|HostName|User|IdentityFile|Port|ForwardX11|ProxyCommand|LocalForward)\b/i,
	'string': {
		pattern: /(['"])(?:\\.|(?!\1)[^\\])*\1/,
		greedy: true
	},
	'variable': /~(?:\/[\w.-]*)*/
};