/**
 * Prism syntax highlighting for Nunjucks templates
 *
 * This definition adds support for Nunjucks template language syntax highlighting
 * in Prism.js. It handles both tag syntax {% %} and variable syntax {{ }},
 * as well as comments and HTML markup within Nunjucks templates.
 */

// Common patterns used in both tag and variable contexts
const commonPatterns = {
  'boolean': /\b(?:true|false|null)\b/,
  'number': /\b0x[\dA-Fa-f]+|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee][+-]?\d+)?/,
  'operator': /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
  'variable': {
    pattern: /\b\w+\.\w+\b/,
    inside: {
      'namespace': /^\w+/,
      'punctuation': /\./,
      'property': /\w+$/
    }
  },
  'string': {
    pattern: /("|')(?:\\[\s\S]|(?!\1)[^\\\r\n])*\1/,
    greedy: true
  },
  'punctuation': /[{}[\];(),.:]/
};

// Tag-specific patterns ({% %})
const tagInside = {
  'punctuation': {
    pattern: /^\{%|%\}$/
  },
  'keyword': /\b(?:if|else|for|set|extends|include|block|macro|call|import|from|filter|endfor|endif|endblock|endmacro)\b/,
  ...commonPatterns
};

// Variable-specific patterns ({{ }})
const variableInside = {
  'punctuation': {
    pattern: /^\{\{|\}\}$/
  },
  'keyword': /\b(?:in|is|not|and|or)\b/,
  'function': {
    pattern: /\|(?:[\w\-]+)/
  },
  ...commonPatterns
};

Prism.languages.nunjucks = {
  // Comments (both Nunjucks {# #} and HTML <!-- -->)
  'comment': [
    { pattern: /\{#[\s\S]*?#\}/, greedy: true },
    { pattern: /<!--[\s\S]*?-->/, greedy: true }
  ],

  // Nunjucks tags ({% %})
  'template-tag': {
    pattern: /\{%[\s\S]*?%\}/,
    greedy: true,
    alias: [ 'markup-tag', 'tag', 'script' ],
    inside: tagInside
  },

  // Nunjucks variables ({{ }})
  'template-variable': {
    pattern: /\{\{[\s\S]*?\}\}/,
    greedy: true,
    alias: [ 'variable', 'markup' ],
    inside: variableInside
  },

  // HTML tags within Nunjucks templates
  'tag': {
    pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/i,
    greedy: true,
    inside: {
      'tag': {
        pattern: /^<\/?[^\s>\/]+/i,
        inside: {
          'punctuation': /^<\/?/,
          'namespace': /^[^\s>\/:]+:/
        }
      },
      'attr-value': {
        pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/i,
        inside: {
          'punctuation': [
            /^=/,
            { pattern: /^(\s*)["']|["']$/, lookbehind: true }
          ],
          // Support for nested Nunjucks tags in HTML attributes
          'template-tag': {
            pattern: /\{%[\s\S]*?%\}/,
            greedy: true,
            alias: [ 'markup-tag', 'tag', 'script' ],
            inside: tagInside
          },
          // Support for nested Nunjucks variables in HTML attributes
          'template-variable': {
            pattern: /\{\{[\s\S]*?\}\}/,
            greedy: true,
            alias: [ 'variable', 'markup' ],
            inside: variableInside
          }
        }
      },
      'punctuation': /\/?>/,
      'attr-name': {
        pattern: /[^\s>\/]+/,
        inside: {
          'namespace': /^[^\s>\/:]+:/
        }
      }
    }
  },

  // HTML entities
  'entity': /&#?[\da-z]{1,8};/i
};

// Add aliases for convenience and compatibility
Prism.languages.njk = Prism.languages.nunjucks;

// Add hooks for markup-templating integration
Prism.hooks.add( 'before-tokenize', function( env ) {
  var nunjucksPattern = /\{#[\s\S]*?#\}|\{%[\s\S]*?%\}|\{\{[\s\S]*?\}\}/g;
  var insideRaw = false;

  Prism.languages[ 'markup-templating' ].buildPlaceholders( env, 'nunjucks', nunjucksPattern, function( match ) {
    var tagMatch = /^\{%-?\s*(\w+)/.exec( match );
    if ( tagMatch ) {
      var tag = tagMatch[ 1 ];
      if ( tag === 'raw' && !insideRaw ) {
        insideRaw = true;
        return true;
      } else if ( tag === 'endraw' ) {
        insideRaw = false;
        return true;
      }
    }
    return !insideRaw;
  } );

} );

Prism.hooks.add( 'after-tokenize', function( env ) {
  if ( Prism.languages[ 'markup-templating' ] ) {
    Prism.languages[ 'markup-templating' ].tokenizePlaceholders( env, 'nunjucks' );
  }
} );
