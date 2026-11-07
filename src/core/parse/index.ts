import type { Monster5e } from '../types';
import { parseMonsterJson } from './json';
import { parseStatBlockText } from './text';

export { parseStatBlockText } from './text';
export { parseMonsterJson, stripTags } from './json';

/** Detect JSON vs. text and return one or more normalized monsters. */
export function parseInput(input: string): Monster5e[] {
  const trimmed = input.trim();
  if (!trimmed) return [];
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) return parseMonsterJson(trimmed);
  return [parseStatBlockText(trimmed)];
}
