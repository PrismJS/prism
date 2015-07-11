Prism.languages.system_verilog = {
  'comment': /\/\/.*|\/\*[\w\W]*?\*\//,
  'string': /"(\\\n|\\?.)*?"/,
  // support for any kernel function (ex: $display())
  'property': /(?!\b)\$\w+\b/,
  // support for user defined constants (ex: `define)
  'constant': /(?!\b)`\w+\b/,
  'function': {
    'pattern': /[a-z0-9_]+\(/i,
    'inside': {
      'punctuation': /\(/
    }
  },
  'boolean': /\b(true|false)\b/i,
  // support for verilog and system verilog keywords
  'keyword': /\b(alias|and|assert|assign|assume|automatic|before|begin|bind|bins|binsof|bit|break|buf|bufif0|bufif1|byte|class|case|casex|casez|cell|chandle|clocking|cmos|config|const|constraint|context|continue|cover|covergroup|coverpoint|cross|deassign|default|defparam|design|disable|dist|do|edge|else|end|endcase|endclass|endclocking|endconfig|endfunction|endgenerate|endgroup|endinterface|endmodule|endpackage|endprimitive|endprogram|endproperty|endspecify|endsequence|endtable|endtask|enum|event|expect|export|extends|extern|final|first_match|for|force|foreach|forever|fork|forkjoin|function|generate|genvar|highz0|highz1|if|iff|ifnone|ignore_bins|illegal_bins|import|incdir|include|initial|inout|input|inside|instance|int|integer|interface|intersect|join|join_any|join_none|large|liblist|library|local|localparam|logic|longint|macromodule|matches|medium|modport|module|nand|negedge|new|nmos|nor|noshowcancelled|not|notif0|notif1|null|or|output|package|packed|parameter|pmos|posedge|primitive|priority|program|property|protected|pull0|pull1|pulldown|pullup|pulsestyle_onevent|pulsestyle_ondetect|pure|rand|randc|randcase|randsequence|rcmos|real|realtime|ref|reg|release|repeat|return|rnmos|rpmos|rtran|rtranif0|rtranif1|scalared|sequence|shortint|shortreal|showcancelled|signed|small|solve|specify|specparam|static|string|strong0|strong1|struct|super|supply0|supply1|table|tagged|task|this|throughout|time|timeprecision|timeunit|tran|tranif0|tranif1|tri|tri0|tri1|triand|trior|trireg|type|typedef|union|unique|unsigned|use|uwire|var|vectored|virtual|void|wait|wait_order|wand|weak0|weak1|while|wildcard|wire|with|within|wor|xnor|xor)\b/,
  // bold highlighting for all verilog and system verilog logic blocks
  'important': /\b(always_latch|always_comb|always_ff|always) ?@?/,
  // support for time ticks, vectors, and real numbers
  'number': /(?!\b)#{1,2}\d+|(\b\d+)?'[odbh] ?[\da-f10zx_\?]+|\b\d+[._]?(e-?\d+)?/i,
  'operator': /[-+\{\}]|!=?|<{1,2}=?|>{1,2}=?|={1,3}|\^|~|%|&{1,2}|\|?\||\?|\*|\//,
  'punctuation': /[[\];(),.:]/,
};