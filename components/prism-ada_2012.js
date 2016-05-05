/**
 * Ada 2012
 * Written Luke A. Guest
    'string': /(\'|\")(\\?.)*?\1/,
 */
Prism.languages.ada_2012 = Prism.languages.extend('ada_2005', {
    'keyword': /\b(abort|abs|abstract|accept|access|aliased|all|and|array|at|begin|body|case|constant|declare|delay|delta|digits|do|else|new|return|elsif|end|entry|exception|exit|for|function|generic|goto|if|in|interface|is|limited|loop|mod|not|null|of|others|out|overriding|package|pragma|private|procedure|protected|raise|range|record|rem|renames|requeue|reverse|select|separate|some|subtype|synchronized|tagged|task|terminate|then|type|until|use|when|while|with|xor)\b/i,
});
