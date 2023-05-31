import fs from 'fs';
import path from 'path';

export const components = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/components.json'), 'utf-8')) as Record<string, Record<string, { title: string, aliasTitles?: Record<string, string> }>>;
