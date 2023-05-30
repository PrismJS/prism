import { argv } from 'yargs';

const args = argv as any;

export const language = args.language as string | string[] | undefined;
export const update = !!args.update;
