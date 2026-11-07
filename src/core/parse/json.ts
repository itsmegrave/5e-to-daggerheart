import type { Ability, FeatureSection, Monster5e } from '../types';
import { buildFeature } from './feature';
import {
  CREATURE_TYPES, SIZES, SKILL_WORDS, conditionsIn, damageTypesIn, fold, isNonmagicalQualifier, parseCR,
} from './lexicon';
import { emptyMonster } from './text';

type Json = Record<string, unknown>;
const ABILITIES: Ability[] = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
const LONG: Record<Ability, string> = {
  str: 'strength', dex: 'dexterity', con: 'constitution', int: 'intelligence', wis: 'wisdom', cha: 'charisma',
};
const ABILITY_NAME: Record<string, string> = {
  str: 'Strength', dex: 'Dexterity', con: 'Constitution', int: 'Intelligence', wis: 'Wisdom', cha: 'Charisma',
};

const isObj = (v: unknown): v is Json => typeof v === 'object' && v !== null && !Array.isArray(v);
const num = (v: unknown, d = 0): number => {
  const n = typeof v === 'number' ? v : parseFloat(String(v ?? ''));
  return Number.isFinite(n) ? n : d;
};

// ---------- 5etools ----------

/** Replace 5etools inline tags ({@hit 4}, {@damage 1d6+2}, …) with plain stat-block text. */
export function stripTags(s: string): string {
  return s
    .replace(/\{@atkr? ([^}]*)\}/g, (_m, t: string) => {
      const parts = t.split(',').map((x) => x.trim());
      const melee = parts.some((p) => p.startsWith('m'));
      const ranged = parts.some((p) => p.startsWith('r'));
      const label = melee && ranged ? 'Melee or Ranged' : ranged ? 'Ranged' : 'Melee';
      return `${label} Attack:`;
    })
    .replace(/\{@hit (-?\d+)\}/g, (_m, n: string) => (Number(n) >= 0 ? `+${n}` : n))
    .replace(/\{@h\}/g, 'Hit: ')
    .replace(/\{@actSave (\w+)\}/g, (_m, a: string) => `${ABILITY_NAME[a] ?? a} Saving Throw:`)
    .replace(/\{@actSaveFail\}/g, 'Failure:')
    .replace(/\{@actSaveSuccess\}/g, 'Success:')
    .replace(/\{@actSaveSuccessOrFail\}/g, 'Failure or Success:')
    .replace(/\{@dc (\d+)\}/g, 'DC $1')
    .replace(/\{@recharge (\d)\}/g, '(Recharge $1-6)')
    .replace(/\{@recharge\}/g, '(Recharge 6)')
    .replace(/\{@(?:damage|dice|d20|scaledamage|scaledice) ([^}|]*)[^}]*\}/g, '$1')
    .replace(/\{@\w+ ([^}|]*)[^}]*\}/g, '$1')
    .replace(/\{@\w+\}/g, '');
}

function entriesToText(entries: unknown): string {
  if (typeof entries === 'string') return stripTags(entries);
  if (Array.isArray(entries)) return entries.map(entriesToText).join(' ');
  if (isObj(entries)) {
    if ('entries' in entries) return entriesToText(entries.entries);
    if ('items' in entries) return entriesToText(entries.items);
    if ('entry' in entries) return entriesToText(entries.entry);
  }
  return '';
}

function typeFrom5etools(t: unknown): string {
  const raw = isObj(t) ? (isObj(t.type) ? String((t.type as Json).choose ?? '') : String(t.type ?? '')) : String(t ?? '');
  if (isObj(t) && 'swarmSize' in t) return 'swarm';
  return CREATURE_TYPES[fold(raw)] ?? 'humanoid';
}

function resistList(v: unknown, m: Monster5e): ReturnType<typeof damageTypesIn> {
  if (!Array.isArray(v)) return [];
  const out = new Set<ReturnType<typeof damageTypesIn>[number]>();
  for (const e of v) {
    if (typeof e === 'string') damageTypesIn(e).forEach((t) => out.add(t));
    else if (isObj(e)) {
      const inner = (e.resist ?? e.immune ?? e.vulnerable) as unknown;
      const note = String(e.note ?? '') + String(e.preNote ?? '');
      if (isNonmagicalQualifier(note)) m.physicalOnlyNonmagical = true;
      resistList(inner, m).forEach((t) => out.add(t));
    }
  }
  return [...out];
}

function from5etools(o: Json): Monster5e {
  const m = emptyMonster();
  m.name = String(o.name ?? '');
  const size = Array.isArray(o.size) ? String(o.size[0] ?? 'M') : String(o.size ?? 'M');
  m.size = ({ T: 'tiny', S: 'small', M: 'medium', L: 'large', H: 'huge', G: 'gargantuan' } as Record<string, string>)[size] ?? 'medium';
  m.creatureType = typeFrom5etools(o.type);
  const ac = Array.isArray(o.ac) ? o.ac[0] : o.ac;
  m.ac = isObj(ac) ? num(ac.ac, 10) : num(ac, 10);
  m.hp = isObj(o.hp) ? num((o.hp as Json).average, 1) : num(o.hp, 1);
  m.speed = isObj(o.speed) ? Object.entries(o.speed).map(([k, v]) => `${k} ${isObj(v) ? v.number : v} ft.`).join(', ') : '';
  for (const a of ABILITIES) m.abilities[a] = num(o[a], 10);
  if (isObj(o.save)) for (const [k, v] of Object.entries(o.save)) if (ABILITIES.includes(k as Ability)) m.saves[k as Ability] = num(v);
  if (isObj(o.skill)) for (const [k, v] of Object.entries(o.skill)) m.skills[SKILL_WORDS[fold(k)] ?? k] = num(v);
  m.resistances = resistList(o.resist, m);
  m.immunities = resistList(o.immune, m);
  m.vulnerabilities = resistList(o.vulnerable, m);
  m.conditionImmunities = Array.isArray(o.conditionImmune)
    ? conditionsIn(o.conditionImmune.map((c) => (isObj(c) ? JSON.stringify(c) : String(c))).join(' '))
    : [];
  m.senses = Array.isArray(o.senses) ? o.senses.map(String).map(stripTags).join(', ') : '';
  m.languages = Array.isArray(o.languages) ? o.languages.map(String).join(', ') : '';
  m.cr = parseCR(isObj(o.cr) ? String((o.cr as Json).cr ?? '0') : String(o.cr ?? '0'));

  const sections: Array<[string, FeatureSection]> = [
    ['trait', 'trait'], ['action', 'action'], ['bonus', 'bonus'], ['reaction', 'reaction'],
    ['legendary', 'legendary'], ['mythic', 'mythic'],
  ];
  for (const [key, section] of sections) {
    const list = o[key];
    if (!Array.isArray(list)) continue;
    for (const f of list) {
      if (!isObj(f)) continue;
      const name = stripTags(String(f.name ?? ''));
      m.features.push(buildFeature(name, entriesToText(f.entries), section));
    }
  }
  if (Array.isArray(o.legendary)) m.legendaryActionCount = num(o.legendaryActions, 3);
  const lr = m.features.find((f) => /legendary resistance/i.test(f.name));
  if (lr) {
    // 5etools keeps "(3/Day)" in the original name, which buildFeature strips; read it from the raw list.
    const raw = (Array.isArray(o.trait) ? o.trait : []).find((t) => isObj(t) && /legendary resistance/i.test(String(t.name)));
    m.legendaryResistance = num(String(isObj(raw) ? raw.name : '').match(/(\d)\s*\/\s*day/i)?.[1], 3);
  }
  return m;
}

// ---------- Open5e (v1 /monsters) ----------

function fromOpen5e(o: Json): Monster5e {
  const m = emptyMonster();
  m.name = String(o.name ?? '');
  m.size = SIZES[fold(String(o.size ?? 'medium'))] ?? 'medium';
  const type = fold(String(o.type ?? ''));
  m.creatureType = /swarm/.test(type) || /swarm/.test(fold(String(o.name ?? ''))) ? 'swarm' : CREATURE_TYPES[type] ?? 'humanoid';
  m.ac = num(o.armor_class, 10);
  m.hp = num(o.hit_points, 1);
  m.speed = isObj(o.speed) ? Object.entries(o.speed).map(([k, v]) => `${k} ${v} ft.`).join(', ') : String(o.speed ?? '');
  for (const a of ABILITIES) {
    m.abilities[a] = num(o[LONG[a]], 10);
    const save = o[`${LONG[a]}_save`];
    if (save !== null && save !== undefined && save !== '') m.saves[a] = num(save);
  }
  if (isObj(o.skills)) for (const [k, v] of Object.entries(o.skills)) m.skills[SKILL_WORDS[fold(k)] ?? fold(k)] = num(v);
  const res = String(o.damage_resistances ?? '');
  const imm = String(o.damage_immunities ?? '');
  m.resistances = damageTypesIn(res);
  m.immunities = damageTypesIn(imm);
  m.vulnerabilities = damageTypesIn(String(o.damage_vulnerabilities ?? ''));
  m.physicalOnlyNonmagical = isNonmagicalQualifier(res + imm);
  m.conditionImmunities = conditionsIn(String(o.condition_immunities ?? ''));
  m.senses = String(o.senses ?? '');
  m.languages = String(o.languages ?? '');
  m.cr = o.cr !== undefined ? num(o.cr) : parseCR(String(o.challenge_rating ?? '0'));

  const sections: Array<[string, FeatureSection]> = [
    ['special_abilities', 'trait'], ['actions', 'action'], ['bonus_actions', 'bonus'],
    ['reactions', 'reaction'], ['legendary_actions', 'legendary'],
  ];
  for (const [key, section] of sections) {
    const list = o[key];
    if (!Array.isArray(list)) continue;
    for (const f of list) {
      if (!isObj(f)) continue;
      m.features.push(buildFeature(String(f.name ?? ''), String(f.desc ?? ''), section));
    }
  }
  if (Array.isArray(o.legendary_actions) && o.legendary_actions.length > 0) {
    const n = String(o.legendary_desc ?? '').match(/take (\d|three|two)/i)?.[1];
    m.legendaryActionCount = n ? ({ three: 3, two: 2 } as Record<string, number>)[n.toLowerCase()] ?? Number(n) : 3;
  }
  const lr = m.features.find((f) => /legendary resistance/i.test(f.name));
  if (lr) m.legendaryResistance = Number(lr.text.match(/(\d)/)?.[1] ?? 3);
  return m;
}

// ---------- dispatch ----------

function looksLike5etools(o: Json): boolean {
  return 'ac' in o && ('hp' in o || 'cr' in o) && ('action' in o || 'trait' in o || 'str' in o);
}
function looksLikeOpen5e(o: Json): boolean {
  return 'armor_class' in o && 'hit_points' in o;
}

/** Accepts a single monster, an array, a 5etools bestiary file ({monster: […]}), or an Open5e page ({results: […]}). */
export function parseMonsterJson(raw: string): Monster5e[] {
  const data: unknown = JSON.parse(raw);
  const list: unknown[] = Array.isArray(data)
    ? data
    : isObj(data) && Array.isArray(data.monster) ? data.monster
    : isObj(data) && Array.isArray(data.results) ? data.results
    : [data];
  const out: Monster5e[] = [];
  for (const item of list) {
    if (!isObj(item)) continue;
    if (looksLikeOpen5e(item)) out.push(fromOpen5e(item));
    else if (looksLike5etools(item)) out.push(from5etools(item));
  }
  if (out.length === 0) throw new Error('unrecognizedJson');
  return out;
}
