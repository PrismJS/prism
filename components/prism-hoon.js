Prism.languages.hoon = {
  constant: [
    {
      pattern: /(%\.n)|(%\.y)|(%[\w-]*[\w\d]?)/,
    }
  ],
  comment: {
    pattern: /::.*/,
    lookahead: true,
    greedy: true
  },
  "function-name": [
    {
      pattern: /(\+[-+]  )?([a-z]([a-z0-9-]*[a-z0-9])?)/
    },
  ],
  "class-name": [
    {
      pattern: /@([a-z])?([A-Za-z0-9-]*[A-Za-z0-9])?/,
      lookahead: true,
      greedy: true
    },
    {
      pattern: /\*/
    }
  ],
  "string": [
    {
      pattern: /"([^"])*"/,
      lookahead: true,
      greedy: true
    },
    {
      pattern: /'([^'])*'/,
      lookahead: true,
      greedy: true
    }
  ],
  "keyword": {
    pattern: /:_|\.[\^\+\*=\?]|![><:\.=\?!]|=[>|:,\.\-\^<+;/~\*\?]|\?[>|:\.\-\^<\+&~=@!]|\|[\$_%:\.\-\^~\*=@\?]|\+[|\$\+\*]|:[_\-\^\+~\*]|%[_:\.\-\^\+~\*=]|\^[|:\.\-\+&~\*=\?]|\$[|_%:<>\-\^&~@=\?]|;[:<\+;\/~\*=]|~[>|\$_%<\+\/&=\?!]|--|==/
  }
}