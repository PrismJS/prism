import { argv } from 'yargs';

const args = /** @type {any} */ (argv);

export const language = /** @type {string | string[] | undefined} */ (args.language);
export const update = !!args.update;
