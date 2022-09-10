import yargs from 'yargs';

const args = /** @type {any} */ (yargs.argv);

export const language = /** @type {string | string[] | undefined} */ (args.language);
export const update = !!args.update;
