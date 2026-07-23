/** @type {import('../types.d.ts').LanguageProto<'ssh-config'>} */
export default {
	id: 'ssh-config',
	alias: ['sshconfig', 'ssh_config', 'sshd_config'],
	grammar: {
		'comment': {
			pattern: /(^[ \t]*)#.*/m,
			lookbehind: true,
			greedy: true,
		},
		// Host / Match blocks start a new section (word-boundary so HostName is not a Host)
		'section': {
			pattern: /(^[ \t]*)(?:Host|Match)\b(?:[ \t]+[^\n\r#]+)?/m,
			lookbehind: true,
			inside: {
				'keyword': /^(?:Host|Match)\b/,
				'operator': /[*?!]/,
				'string': /\S+/,
			},
		},
		// Common OpenSSH client/server keywords (ssh_config / sshd_config)
		'keyword': {
			pattern:
				/(^[ \t]*)(?:AcceptEnv|AddressFamily|AllowAgentForwarding|AllowGroups|AllowTcpForwarding|AllowUsers|AuthenticationMethods|AuthorizedKeysFile|Banner|BatchMode|BindAddress|CertificateFile|CheckHostIP|Ciphers|ClearAllForwardings|ClientAliveCountMax|ClientAliveInterval|Compression|ConnectTimeout|ControlMaster|ControlPath|ControlPersist|DynamicForward|EscapeChar|ExitOnForwardFailure|ForwardAgent|ForwardX11|GatewayPorts|GlobalKnownHostsFile|HashKnownHosts|HostName|IdentitiesOnly|IdentityAgent|IdentityFile|Include|IPQoS|KbdInteractiveAuthentication|KexAlgorithms|LocalCommand|LocalForward|LogLevel|MACs|PasswordAuthentication|PermitRootLogin|Port|PreferredAuthentications|ProxyCommand|ProxyJump|PubkeyAuthentication|RemoteCommand|RemoteForward|RequestTTY|SendEnv|ServerAliveCountMax|ServerAliveInterval|SetEnv|StrictHostKeyChecking|TCPKeepAlive|Tunnel|UpdateHostKeys|UseDNS|User|UserKnownHostsFile|VerifyHostKeyDNS|VisualHostKey|X11Forwarding)\b/im,
			lookbehind: true,
		},
		'boolean': {
			pattern: /\b(?:no|off|on|yes)\b/i,
			alias: 'constant',
		},
		'number': {
			pattern: /\b\d+\b/,
		},
		'variable': {
			pattern: /%[%CDdHhIiKkLlnpru]/i,
			alias: 'symbol',
		},
		'operator': /=/,
		'punctuation': /[,:]/,
	},
};
