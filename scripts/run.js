import { build } from './build.js';
import { changes, linkify } from './changelog.js';
import { run } from './tasks.js';

run({ linkify, changes, build });
