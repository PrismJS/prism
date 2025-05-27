import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const components = JSON.parse(
	fs.readFileSync(path.join(__dirname, '../src/components.json'), 'utf-8')
) as Record<string, Record<string, { title: string; aliasTitles?: Record<string, string>; noCSS?: boolean }>>;
