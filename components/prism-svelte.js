// Define a regular expression pattern for specific blocks
const blocks = '(if|else if|await|then|catch|each|html|debug)';

// Extend the Prism markup language to support Svelte syntax
Prism.languages.svelte = Prism.languages.extend('markup', {
    // Define syntax highlighting for Svelte each block
    each: {
        pattern: new RegExp(
            '{[#/]each' + '(?:(?:\\{(?:(?:\\{(?:[^{}])*\\})|(?:[^{}]))*\\})|(?:[^{}]))*}'
        ),
        inside: {
            'language-javascript': [
                // Define patterns for 'as' keyword followed by JavaScript content inside parentheses
                {
                    pattern: /(as[\s\S]*)\([\s\S]*\)(?=\s*\})/,
                    lookbehind: true,
                    inside: Prism.languages['javascript']
                },
                // Define patterns for 'as' keyword followed by JavaScript content without parentheses
                {
                    pattern: /(as[\s]*)[\s\S]*(?=\s*)/,
                    lookbehind: true,
                    inside: Prism.languages['javascript']
                },
                // Define patterns for '#each' followed by JavaScript content until 'as' keyword
                {
                    pattern: /(#each[\s]*)[\s\S]*(?=as)/,
                    lookbehind: true,
                    inside: Prism.languages['javascript']
                }
            ],
            keyword: /[#/]each|as/, // Define keyword patterns
            punctuation: /{|}/ // Define punctuation patterns
        }
    },
    // Define syntax highlighting for Svelte block elements
    block: {
        pattern: new RegExp(
            '{[#:/@]/s' + blocks + '(?:(?:\\{(?:(?:\\{(?:[^{}])*\\})|(?:[^{}]))*\\})|(?:[^{}]))*}'
        ),
        inside: {
            punctuation: /^{|}$/, // Define punctuation patterns
            keyword: [new RegExp('[#:/@]' + blocks + '( )*'), /as/, /then/], // Define keyword patterns
            'language-javascript': { // Define JavaScript language patterns
                pattern: /[\s\S]*/, // Match any JavaScript content
                inside: Prism.languages['javascript']
            }
        }
    },
    // Define syntax highlighting for Svelte HTML tags and attributes
    tag: {
        pattern:
            /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?:"[^"]*"|'[^']*'|{[\s\S]+?}(?=[\s/>])))|(?=[\s/>])))+)?\s*\/?>/i,
        greedy: true,
        inside: {
            tag: {
                pattern: /^<\/?[^\s>\/]+/i,
                inside: {
                    punctuation: /^<\/?/,
                    namespace: /^[^\s>\/:]+:/
                }
            },
            'language-javascript': { // Define JavaScript language patterns within tags
                pattern: /\{(?:(?:\{(?:(?:\{(?:[^{}])*\})|(?:[^{}]))*\})|(?:[^{}]))*\}/,
                inside: Prism.languages['javascript']
            },
            'attr-value': { // Define attribute value patterns
                pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/i,
                inside: {
                    punctuation: [
                        /^=/,
                        {
                            pattern: /^(\s*)["']|["']$/,
                            lookbehind: true
                        }
                    ],
                    'language-javascript': { // Define JavaScript language patterns within attribute values
                        pattern: /{[\s\S]+}/,
                        inside: Prism.languages['javascript']
                    }
                }
            },
            punctuation: /\/?>/, // Define punctuation patterns for tags
            'attr-name': { // Define attribute name patterns
                pattern: /[^\s>\/]+/,
                inside: {
                    namespace: /^[^\s>\/:]+:/
                }
            }
        }
    },
    // Define syntax highlighting for inline JavaScript content
    'language-javascript': {
        pattern: /\{(?:(?:\{(?:(?:\{(?:[^{}])*\})|(?:[^{}]))*\})|(?:[^{}]))*\}/,
        lookbehind: true,
        inside: Prism.languages['javascript']
    }
});

// Add entity highlighting support for Svelte tags
Prism.languages.svelte['tag'].inside['attr-value'].inside['entity'] =
    Prism.languages.svelte['entity'];

// Add a hook to wrap entities with additional attributes
Prism.hooks.add('wrap', (env) => {
    if (env.type === 'entity') {
        env.attributes['title'] = env.content.replace(/&amp;/, '&');
    }
});

// Define a function to add inline language support for specific tags
Object.defineProperty(Prism.languages.svelte.tag, 'addInlined', {
    value: function addInlined(tagName, lang) {
        const includedCdataInside = {};
        includedCdataInside['language-' + lang] = {
            pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
            lookbehind: true,
            inside: Prism.languages[lang]
        };
        includedCdataInside['cdata'] = /^<!\[CDATA\[|\]\]>$/i;

        const inside = {
            'included-cdata': {
                pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
                inside: includedCdataInside
            }
        };
        inside['language-' + lang] = {
            pattern: /[\s\S]+/,
            inside: Prism.languages[lang]
        };

        const def = {};
        def[tagName] = {
            pattern: RegExp(
                /(<_tagName_[\s\S]*?>)(?:<!\[CDATA\[[\s\S]*?\]\]>\s*|[\s\S])*?(?=<\/_tagName_>)/.source.replace(
                    /_tagName_/g,
                    tagName
                ),
                'i'
            ),
            lookbehind: true,
            greedy: true,
            inside
        };

        Prism.languages.insertBefore('svelte', 'cdata', def);
    }
});

// Add inline language support for CSS and JavaScript within style and script tags
Prism.languages.svelte.tag.addInlined('style', 'css');
Prism.languages.svelte.tag.addInlined('script', 'javascript');
