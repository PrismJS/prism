/**
 * Ada95
 * Written Luke A. Guest
    'string': /(\'|\")(\\?.)*?\1/,
 */
Prism.languages.ada95 = Prism.languages.extend('ada83', {
    'keyword': /\b(abort|abs|abstract|accept|access|aliased|all|and|array|at|begin|body|case|constant|declare|delay|delta|digits|do|else|new|return|elsif|end|entry|exception|exit|for|function|generic|goto|if|in|is|limited|loop|mod|not|null|of|others|out|package|pragma|private|procedure|protected|raise|range|record|rem|renames|requeue|reverse|select|separate|subtype|tagged|task|terminate|then|type|until|use|when|while|with|xor)\b/i,
});
