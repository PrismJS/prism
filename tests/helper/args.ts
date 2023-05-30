import { argv } from 'yargs';

const args = argv as {
	language?: string | string[];
	update?: boolean
};

export const language = args.language;
export const update = !!args.update;
