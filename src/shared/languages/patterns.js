export const MARKUP_TAG = /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/;

export const JS_TEMPLATE_INTERPOLATION = /\$\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})+\}/;
export const JS_TEMPLATE = RegExp(/`(?:\\[\s\S]|<i>|[^\\`$]|\$(?!\{))*`/.source.replace('<i>', () => JS_TEMPLATE_INTERPOLATION.source));
