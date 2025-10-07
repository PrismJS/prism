import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const args = /** @type {Args} */ (yargs(hideBin(process.argv)).argv);

export const language = args.language;
export const update = !!args.update;

/**
 * @typedef {object} Args
 * @property {string|string[]} [language]
 * @property {boolean} [update]
 */
