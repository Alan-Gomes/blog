import { readFile } from 'fs/promises';
import * as prettier from 'prettier';

const prettierConfig = JSON.parse(await readFile('.prettierrc', 'utf-8'));

export async function formatCode(code: string) {
	return (await prettier.format(code, { ...prettierConfig, parser: 'typescript' })).trim();
}
