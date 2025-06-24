import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const args = yargs(hideBin(process.argv)).argv as {
	language?: string | string[];
	update?: boolean;
};

export const language = args.language;
export const update = !!args.update;
