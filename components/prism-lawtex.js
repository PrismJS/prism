Prism.languages.lawtex = {
  'comment': [
    {
      pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
      lookbehind: true,
      greedy: true
    },
    {
      pattern: /(^|[^\\:])\/\/.*/,
      lookbehind: true,
      greedy: true
    }
  ],
  'string': {
    pattern: /(^|[^\\](?:\\\\)*)(")(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|(?!\2)[^\\`$])*\2/,
    lookbehind: true,
    greedy: true,
    inside: {
      'escape': /\\./
    }
  },
  'keyword': /\b(?:metainfo|head|body|foot|extra|where|extends|externs|template|list|struct|dependency|branch|topic|loop|period|if|else|elseif|foreach|print|use)\b/,
  'important': /\b(?:this|value|id|mask|transient|itemsOnPage|language|style|type|default|description|tags|statement|overview|components|audience|inputs|functionalities|warnings|upgrades|title|name|label|order|mandatory|version|index|lower|upper|separator|request|element|help|tip|atomic|fields|loaders|options|key|operation|declarations|operations)\b/,
  'logical': /\b(?:NOT|AND|OR|XOR|EXISTS|FORALL|IN)/,
  'class-name': /\b(?:List|Object|String|Integer|Real|Boolean|Date|Time|Text|Document|Currency|Vector|Struct)\b/,
  'function': /\b[A-Z].*?\b/,    
  'boolean': /\b(?:true|false|null)\b/,
  'operator': /(?:\[|\]|==|~=|<=|>=|<|>|\|)/,
  'assignment': /=/,
  'arithmetic': /(?:\-|\+|\&|\*|\/|%|\^)/,
  'number': /(?:(?:0(?:x|X)[0-9a-fA-F]*)|(?:\+|-)?\b(?:(?:[0-9]+(?:\.[0-9]*)?)|(?:\.[0-9]+))(?:(?:e|E)(?:\+|-)?[0-9]+)?)(?:[LlFfUuDd]|UL|ul)?\b/
};