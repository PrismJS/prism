(function(){

if(!window.Prism) {
	return;
}

Prism.languages.clojure = {
	'string': /"(\\?.)*?/g,
	'comment': /;[^\r\n]*(\r?\n|$)/g,
	'const': /\bnil\b/g,
	'boolean': /\b(true|false)\b/g,
	'symbol': /:\b[a-zA-Z_][a-zA-Z_0-9]*[?!]?\b/g,
	'number': /\b-?(0x)?\d*\.?\d+\b/g,
	'variable': /(\*warn-on-reflection\*|this|\*assert\*|\*agent\*|\*ns\*|\*in\*|\*out\*|\*err\*|\*command-line-args\*|\*print-meta\*|\*print-readably\*|\*print-length\*|\*allow-unresolved-args\*|\*compile-files\*|\*compile-path\*|\*file\*|\*flush-on-newline\*|\*math-context\*|\*unchecked-math\*|\*print-dup\*|\*print-level\*|\*use-context-classloader\*|\*source-path\*|\*clojure-version\*|\*read-eval\*|\*fn-loader\*|\*1|\*2|\*3|\*e)\b/g,
	'repeat': {
		pattern: /(\()(recur|map|mapcat|reduce|filter|for|doseq|dorun|doall|dotimes|map-indexed|keep|keep-indexed)\b/,
		lookbehind: true
	},
	'exception':{
		pattern: /(\()(try|catch|finally|throw)\b/,
		lookbehind: true
	},
	'function': {
		pattern: /(\()(=|not=|not|nil\?|false\?|true\?|complement|identical\?|string\?|symbol\?|map\?|seq\?|vector\?|keyword\?|var\?|special-symbol\?|apply|partial|comp|constantly|identity|comparator|fn\?|re-matcher|re-find|re-matches|re-groups|re-seq|re-pattern|str|pr|prn|print|println|pr-str|prn-str|print-str|println-str|newline|macroexpand|macroexpand-1|monitor-enter|monitor-exit|eval|find-doc|file-seq|flush|hash|load|load-file|read|read-line|scan|slurp|subs|sync|test|format|printf|loaded-libs|use|require|load-reader|load-string|\+|-|\*|\/|\+'|-'|\*'|\/'|<|<=|==|>=|>|dec|dec'|inc|inc'|min|max|neg\?|pos\?|quot|rem|zero\?|rand|rand-int|decimal\?|even\?|odd\?|float\?|integer\?|number\?|ratio\?|rational\?|bit-and|bit-or|bit-xor|bit-not|bit-shift-left|bit-shift-right|symbol|keyword|gensym|count|conj|seq|first|rest|ffirst|fnext|nfirst|nnext|second|every\?|not-every\?|some|not-any\?|concat|reverse|cycle|interleave|interpose|split-at|split-with|take|take-nth|take-while|drop|drop-while|repeat|replicate|iterate|range|into|distinct|sort|sort-by|zipmap|line-seq|butlast|last|nth|nthnext|next|repeatedly|tree-seq|enumeration-seq|iterator-seq|coll\?|associative\?|empty\?|list\?|reversible\?|sequential\?|sorted\?|list|list\*|cons|peek|pop|vec|vector|peek|pop|rseq|subvec|array-map|hash-map|sorted-map|sorted-map-by|assoc|assoc-in|dissoc|get|get-in|contains\?|find|select-keys|update-in|key|val|keys|vals|merge|merge-with|max-key|min-key|create-struct|struct-map|struct|accessor|remove-method|meta|with-meta|in-ns|refer|create-ns|find-ns|all-ns|remove-ns|import|ns-name|ns-map|ns-interns|ns-publics|ns-imports|ns-refers|ns-resolve|resolve|ns-unmap|name|namespace|require|use|set\!|find-var|var-get|var-set|ref|deref|ensure|alter|ref-set|commute|agent|send|send-off|agent-errors|clear-agent-errors|await|await-for|instance\?|bean|alength|aget|aset|aset-boolean|aset-byte|aset-char|aset-double|aset-float|aset-int|aset-long|aset-short|make-array|to-array|to-array-2d|into-array|int|long|float|double|char|boolean|short|byte|parse|add-classpath|cast|class|get-proxy-class|proxy-mappings|update-proxy|hash-set|sorted-set|set|disj|set\?|aclone|add-watch|alias|alter-var-root|ancestors|await1|bases|bigdec|bigint|bit-and-not|bit-clear|bit-flip|bit-set|bit-test|counted\?char-escape-string|char-name-string|class\?|compare|compile|construct-proxy|delay\?|derive|descendants|distinct\?|double-array|doubles|drop-last|empty|float-array|floats|force|gen-class|get-validator|int-array|ints|isa\?|long-array|longs|make-hierarchy|method-sig|not-empty|ns-aliases|ns-unalias|num|partition|parents|pmap|prefer-method|primitives-classnames|print-ctor|print-dup|print-method|print-simple|proxy-call-with-super|proxy-super|rationalize|read-string|remove|remove-watch|replace|resultset-seq|rsubseq|seque|set-validator\!|shutdown-agents|subseq|supers|unchecked-add|unchecked-dec|unchecked-divide|unchecked-inc|unchecked-multiply|unchecked-negate|unchecked-subtract|underive|xml-seq|trampoline|atom|compare-and-set\!|ifn\?|gen-interface|intern|init-proxy|io\!|memoize|proxy-name|swap\!|release-pending-sends|the-ns|unquote|while|unchecked-remainder|alter-meta\!|future-call|methods|mod|pcalls|prefers|pvalues|reset\!|realized\?|some-fn|reset-meta\!|type|vary-meta|unquote-splicing|sequence|clojure-version|counted\?|chunk-buffer|chunk-append|chunk|chunk-first|chunk-rest|chunk-next|chunk-cons|chunked-seq\?|deliver|future\?|future-done\?|future-cancel|future-cancelled\?|get-method|promise|ref-history-count|ref-min-history|ref-max-history|agent-error|assoc\!|boolean-array|booleans|bound-fn\*|bound\?|byte-array|bytes|char-array|char\?|chars|conj\!|denominator|disj\!|dissoc\!|error-handler|error-mode|extenders|extends\?|find-protocol-impl|find-protocol-method|flatten|frequencies|get-thread-bindings|group-by|hash-combine|juxt|munge|namespace-munge|numerator|object-array|partition-all|partition-by|persistent\!|pop\!|pop-thread-bindings|push-thread-bindings|rand-nth|reductions|remove-all-methods|restart-agent|satisfies\?|set-error-handler\!|set-error-mode\!|short-array|shorts|shuffle|sorted-set-by|take-last|thread-bound\?|transient|vector-of|with-bindings\*|fnil|spit|biginteger|every-pred|find-keyword|unchecked-add-int|unchecked-byte|unchecked-char|unchecked-dec-int|unchecked-divide-int|unchecked-double|unchecked-float|unchecked-inc-int|unchecked-int|unchecked-long|unchecked-multiply-int|unchecked-negate-int|unchecked-remainder-int|unchecked-short|unchecked-subtract-int|with-redefs|with-redefs-fn)/g,
		lookbehind: true
	},
	'special': {
		pattern: /(\()(\.|def|do|fn|if|let|new|quote|var|loop)\b/g,
		lookbehind: true
	},
	'define': {
		pattern: /(\()(def-|defn|defn-|defmacro|deftest|defmulti|defmethod|defstruct|defonce|declare|definline|definterface|defprotocol|defrecord|deftype)\b/g,
		lookbehind: true
	},
	'macro': {
		pattern: /(\()(and|or|->|assert|with-out-str|with-in-str|with-open|locking|destructure|ns|dosync|binding|delay|lazy-cons|lazy-cat|time|assert|with-precision|with-local-vars|..|doto|memfn|proxy|amap|areduce|refer-clojure|future|lazy-seq|letfn|with-loading-context|bound-fn|extend|extend-protocol|extend-type|reify|with-bindings|->>)\b/g,
		lookbehind: true
	}
};

})();