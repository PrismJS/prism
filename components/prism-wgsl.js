Prism.languages.wgsl = {
    'comment': {
        pattern: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
        greedy: true,
    },
    'attributes': {
        pattern: /(@)[_a-z]\w*/i,
        lookbehind: true,
        alias: 'symbol',
    },
    'functions': {
        pattern: /\b(fn\s+)[_a-zA-Z]\w*(?=[(<])/,
        lookbehind: true,
        alias: 'function',
        inside: {},
    },
    'keyword': [
        { pattern: /\b(?:bitcast|block|break|case|continue|continuing|default|discard|else|elseif|enable|fallthrough|for|function|if|loop|private|read|read_write|return|storage|switch|uniform|workgroup|write)\b/ },
        { pattern: /\b(?:asm|const|do|enum|handle|mat|premerge|regardless|typedef|unless|using|vec|void|while)\b/ },
        { pattern: /\b(?:let|var)\b/ },
        { pattern: /\b(?:type)\b/ },
        { pattern: /\b(?:enum)\b/ },
        { pattern: /\bfn\b/ },
    ],
    'function-calls': {
        pattern: /\b[_a-z]\w*(?=\()/i,
        alias: 'function',
        inside: {},
    },
    'types': [
        { pattern: /\b(?:bool|i32|u32|f32)\b/, alias: 'builtin' },
        { pattern: /\b(?:i64|u64|f64)\b/, alias: 'builtin' },
        { pattern: /\b(?:vec[2-4]|mat[2-4]x[2-4])\b/, alias: 'builtin' },
        { pattern: /\b(?:atomic)\b/, alias: 'builtin' },
        { pattern: /\b(?:array)\b/, alias: 'builtin' },
        { pattern: /\b(?:override|ptr|sampler|sampler_comparison|staticAssert|struct)\b/, alias: 'builtin' },
        { pattern: /\b(?:texture_1d|texture_2d|texture_2d_array|texture_3d|texture_cube|texture_cube_array|texture_multisampled_2d)\b/, alias: 'builtin' },
        { pattern: /\b(?:texture_storage_1d|texture_storage_2d|texture_storage_2d_array|texture_storage_3d|texture_depth_2d)\b/, alias: 'builtin' },
        { pattern: /\b(?:texture_depth_2d_array|texture_depth_cube|texture_depth_cube_array|texture_depth_multisampled_2d)\b/, alias: 'builtin' },
        { pattern: /\b(?:[A-Z][A-Za-z0-9]*)\b/, alias: 'class-name' },
    ],
    'built-in-values': [
        { pattern: /\b(?:vertex_index|instance_index|position)\b/, alias: 'namespace' },
        { pattern: /\b(?:front_facing|frag_depth|sample_index|sample_mask)\b/, alias: 'namespace' },
        { pattern: /\b(?:local_invocation_id|local_invocation_index|global_invocation_id|workgroup_id|num_workgroups)\b/, alias: 'namespace' },
    ],
    'bool-literal': {
        pattern: /\b(?:true|false)\b/,
        alias: 'boolean',
    },
    'hex-int-literal': [
        { pattern: /\b0[xX][0-9a-fA-F]+[iu]?(?!(?:\.|p|P))\b/, alias:'number' },
    ],
    'hex-float-literal': [
        { pattern: /0[xX][0-9a-fA-F]*\.[0-9a-fA-F]+(?:[pP](?:\+|-)?[0-9]+[fh]?)?/, alias:'number' },
        { pattern: /0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*(?:[pP](?:\+|-)?[0-9]+[fh]?)?/, alias:'number' },
        { pattern: /0[xX][0-9a-fA-F]+[pP](?:\+|-)?[0-9]+[fh]?/, alias:'number' },
    ],
    'decimal-float-literal-a': [
        { pattern: /[0-9]*\.[0-9]+(?:[eE](?:\+|-)?[0-9]+)?[fh]?/, alias:'number' },
        { pattern: /[0-9]+\.[0-9]*(?:[eE](?:\+|-)?[0-9]+)?[fh]?/, alias:'number' },
        { pattern: /[0-9]+[eE](?:\+|-)?[0-9]+[fh]?/, alias:'number' },
    ],
    'variables': {
        pattern: /\b[_a-z]\w*\b/i,
        alias: 'variable',
    },
    'decimal-float-literal-b': [
        { pattern: /0[fh]/, alias:'number' },
        { pattern: /[1-9][0-9]*[fh]/, alias:'number' },
    ],
    'int-literal': [
        { pattern: /0[iu]?/, alias:'number' },
        { pattern: /[1-9][0-9]*[iu]?/, alias:'number' },
    ],
    'operator': [
        { pattern: /(?:\^|~|\||\|\||&&|<<|>>|!)(?!=)/ },
        { pattern: /&(?![&=])/ },
        { pattern: /(?:\+=|-=|\*=|\/=|%=|\^=|&=|\|=|<<=|>>=)/},
        { pattern: /(?<![<>])=(?!=|>)/ },
        { pattern: /(?:=(?:=)?(?!>)|!=|<=|(?<!=)>=)/ },
        { pattern: /(?:(?:[+%]|(?:\*(?!\w)))(?!=))|(?:-(?!>))|(?:\/(?!\/))/ },
        { pattern: /\.(?!\.)/ },
        { pattern: /->/ },
    ],
    'punctuation': [
        { pattern: /,/ },
        { pattern: /[{}]/ },
        { pattern: /[\(\)]/ },
        { pattern: /;/ },
        { pattern: /[\[\]]/ },
        { pattern: /(?<!=)[<>]/ },
    ],
};
