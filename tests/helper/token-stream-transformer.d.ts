/**
    * Simplifies the token stream to ease the matching with the expected token stream.
    *
    * * Strings are kept as-is
    * * In arrays each value is transformed individually
    * * Values that are empty (empty arrays or strings only containing whitespace)
    *
    * @param {TokenStream} tokenStream
    * @returns {SimplifiedTokenStream}
    */
export function simplify(tokenStream: TokenStream): SimplifiedTokenStream;
/**
    * @param {TokenStream} tokenStream
    * @param {string} [indentation]
    * @returns {string}
    */
export function prettyprint(tokenStream: TokenStream, indentation?: string): string;
