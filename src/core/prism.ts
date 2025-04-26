import Prism from "./prism-class";

/**
 * Prism singleton.
 * This will always be available, and will automatically read config options.
 * This instance of Prism is unique. Even if this module is imported from
 * different sources, the same Prism instance will be returned.
 * In global builds, it will also be the Prism global variable.
 * Any imported plugins and languages will automatically be added to this instance.
 */
export default new Prism();
