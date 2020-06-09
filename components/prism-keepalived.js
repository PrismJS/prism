Prism.languages.keepalived = {
	'comment': {
		pattern: /(^|[^"{\\])#.*/,
		lookbehind: true
	},
	'property': {
		pattern: /([\s\t]*)(?:\bglobal_defs|notification_email|notification_email_from|smtp_server|smtp_connect_timeout|router_id|virtual_server|fwmark|delay_loop|lb_algo|lb_kind|persistence_timeout|persistence_granularity|virtualhost|protocol|sorry_server|real_server|weight|TCP_CHECK|MISC_CHECK|misc_path|HTTP_GET|SSL_GET|url|path|digest|connect_port|connect_timeout|retry|delay_before_retry|vrrp_instance|state|interface|mcast_src_ip|lvs_sync_daemon_inteface|virtual_router_id|priority|advert_int|smtp_alert|authentication|auth_type|auth_pass|virtual_ipaddress|virtual_ipaddress_excluded|notify_master|notify_backup|notify_fault|vrrp_sync_group|vrrp_script|interval|script)\b/,
		lookbehind: true
	},
	'constant': {
		pattern: /(^[ \t]*)(?:rr|wrr|lc|wlc|sh|dh|lblc|NAT|DR|TUN|TCP|UDP|MASTER|BACKUP|PASS|AH)\b/,
		lookbehind: true
	},
	'string': /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
	'email': {
		pattern: /(?:[\w-])+@([\w-])+((\.[\w-]{2,3}){1,2})/,
		alias: 'string',
	},
	'path': {
		pattern: /(?:\/(?:[^\/\s]+\/)*[^\/\s]*)|(?:[a-zA-Z]:\\(?:\w+\\)*(?:\w+\.\w+)?)/,
		alias: 'string',
	},
	'ip': {
		pattern: /(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:225[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)/,
		alias: 'number'
	},
	'number': {
		pattern: /(^|[^\w.-])-?\d*\.?\d+/,
		lookbehind: true
	},
	'punctuation': /[\{\}]/
};