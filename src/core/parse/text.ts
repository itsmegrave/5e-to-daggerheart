import type { Ability, Feature5e, FeatureSection, Monster5e } from '../types';
import { buildFeature } from './feature';
import {
  ABILITY_WORDS, CREATURE_TYPES, SIZES, SKILL_WORDS, conditionsIn, damageTypesIn, fold,
  isNonmagicalQualifier, parseCR, signed,
} from './lexicon';

export function emptyMonster(): Monster5e {
  return {
    name: '', size: 'medium', creatureType: 'humanoid', ac: 10, hp: 1, speed: '',
    abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    saves: {}, skills: {}, resistances: [], immunities: [], vulnerabilities: [],
    physicalOnlyNonmagical: false, conditionImmunities: [], senses: '', languages: '',
    cr: 0, legendaryActionCount: 0, legendaryResistance: 0, features: [], sourceLang: 'en', warnings: [],
  };
}

const SECTION_HEADERS: Array<[RegExp, FeatureSection]> = [
  [/^(traits|special traits|caracteristicas|habilidades|tracos)$/, 'trait'],
  [/^(actions|acoes)$/, 'action'],
  [/^(bonus actions|acoes bonus|acoes adicionais)$/, 'bonus'],
  [/^(reactions|reacoes)$/, 'reaction'],
  [/^(legendary actions|acoes lendarias)$/, 'legendary'],
  [/^(lair actions|acoes de covil)$/, 'lair'],
  [/^(mythic actions|acoes miticas)$/, 'mythic'],
];

const HEADER_FIELDS = /^(armor class|ac|classe de armadura|ca|hit points|hp|pontos de vida|pv|speed|deslocamento|initiative|iniciativa|saving throws|salvaguardas|testes de resistencia|skills|pericias|damage (resistances|immunities|vulnerabilities)|resistances|immunities|vulnerabilities|resistencias( a dano)?|imunidades( a dano| a condic(ao|oes))?|vulnerabilidades( a dano)?|condition immunities|senses|sentidos|languages|idiomas|challenge|cr|nivel de desafio|nd|proficiency bonus|bonus de proficiencia|gear|equipamento)\b/;

/** Lines that start a new feature: "Name. text" / "Name (Recharge 5–6). text". */
const FEATURE_START = /^([A-ZÀ-Ý][^.:]{0,70}?(?:\s*\([^)]*\))?)\.\s+(.*)$/;
const NOT_A_TITLE = /^(hit|acerto|failure|falha|success|sucesso|trigger|gatilho|response|resposta|each|cada|the|o|a|if|se|until|ate)\b/;

function isTitle(candidate: string): boolean {
  const f = fold(candidate);
  if (NOT_A_TITLE.test(f)) return false;
  const words = candidate.replace(/\([^)]*\)/g, '').trim().split(/\s+/);
  return words.length <= 6;
}

function readAbilities(lines: string[], m: Monster5e): void {
  const joined = lines.join(' ');
  // Inline formats: "STR 8 (-1)" / 2024 table "Str 8 −1 −1" (score, mod, save)
  const re = /\b(STR|DEX|CON|INT|WIS|CHA|FOR|DES|SAB|CAR|Str|Dex|Con|Int|Wis|Cha|For|Des|Sab|Car)\b\.?\s*:?\s*(\d{1,2})(?:\s*\(\s*[+\-−–]?\s*\d+\s*\))?(?:\s+([+\-−–]\d+)\s+([+\-−–]\d+))?/g;
  let hit = 0;
  let r: RegExpExecArray | null;
  while ((r = re.exec(joined))) {
    const ab = ABILITY_WORDS[fold(r[1] ?? '')];
    if (!ab) continue;
    m.abilities[ab] = Number(r[2]);
    hit++;
    if (r[3] && r[4]) {
      const mod = signed(r[3]);
      const save = signed(r[4]);
      if (save !== mod) m.saves[ab] = save;
    }
  }
  if (hit >= 6) return;

  // Header row followed by a values row: "STR DEX CON INT WIS CHA" / "8 (−1) 14 (+2) …"
  for (let i = 0; i < lines.length - 1; i++) {
    const toks = fold(lines[i] ?? '').split(/\s+/).filter(Boolean);
    if (toks.length >= 6 && toks.slice(0, 6).every((t) => ABILITY_WORDS[t])) {
      const values = (lines.slice(i + 1, i + 7).join(' ').replace(/\([^)]*\)/g, ' ').match(/\b\d{1,2}\b/g) ?? []).map(Number);
      toks.slice(0, 6).forEach((t, j) => {
        const ab = ABILITY_WORDS[t] as Ability;
        if (values[j] !== undefined) m.abilities[ab] = values[j] as number;
      });
      return;
    }
  }
  m.warnings.push('abilitiesNotFound');
}

function readHeaderField(line: string, m: Monster5e): boolean {
  const f = fold(line);
  const rest = (n: number) => line.slice(n).trim();
  let k: RegExpMatchArray | null;

  if ((k = f.match(/^(armor class|ac|classe de armadura|ca)\b\s*:?\s*(\d+)/))) { m.ac = Number(k[2]); return true; }
  if ((k = f.match(/^(hit points|hp|pontos de vida|pv)\b\s*:?\s*(\d+)/))) { m.hp = Number(k[2]); return true; }
  if ((k = f.match(/^(speed|deslocamento)\b\s*:?/))) { m.speed = rest(k[0].length); return true; }
  if ((k = f.match(/^(challenge|cr|nivel de desafio|nd)\b\s*:?\s*([\d/.,]+)/))) { m.cr = parseCR(k[2] ?? '0'); return true; }
  if ((k = f.match(/^(senses|sentidos)\b\s*:?/))) { m.senses = rest(k[0].length); return true; }
  if ((k = f.match(/^(languages|idiomas)\b\s*:?/))) { m.languages = rest(k[0].length); return true; }

  if ((k = f.match(/^(saving throws|salvaguardas|testes de resistencia)\b\s*:?/))) {
    const re = /(\w+)\s*([+\-−]\s*\d+)/g;
    let s: RegExpExecArray | null;
    const body = fold(rest(k[0].length));
    while ((s = re.exec(body))) {
      const ab = ABILITY_WORDS[s[1] ?? ''];
      if (ab) m.saves[ab] = signed(s[2] ?? '0');
    }
    return true;
  }
  if ((k = f.match(/^(skills|pericias)\b\s*:?/))) {
    const body = fold(rest(k[0].length));
    for (const part of body.split(/[,;]/)) {
      const p = part.trim().match(/^(.+?)\s*([+\-−]\s*\d+)/);
      if (!p || !p[1]) continue;
      const key = SKILL_WORDS[p[1].trim()] ?? p[1].trim();
      m.skills[key] = signed(p[2] ?? '0');
    }
    return true;
  }
  if ((k = f.match(/^(condition immunities|imunidades? a condic(?:ao|oes))\b\s*:?/))) {
    m.conditionImmunities = conditionsIn(rest(k[0].length));
    return true;
  }
  if ((k = f.match(/^(damage resistances|resistances|resistencias(?: a dano)?)\b\s*:?/))) {
    const body = rest(k[0].length);
    m.resistances = damageTypesIn(body);
    if (isNonmagicalQualifier(body)) m.physicalOnlyNonmagical = true;
    return true;
  }
  if ((k = f.match(/^(damage immunities|immunities|imunidades(?: a dano)?)\b\s*:?/))) {
    // 2024 combines damage and conditions: "Immunities Fire, Poison; Poisoned"
    const body = rest(k[0].length);
    m.immunities = damageTypesIn(body);
    if (isNonmagicalQualifier(body)) m.physicalOnlyNonmagical = true;
    const conds = conditionsIn(body).filter((c) => !m.conditionImmunities.includes(c));
    m.conditionImmunities.push(...conds);
    return true;
  }
  if ((k = f.match(/^(damage vulnerabilities|vulnerabilities|vulnerabilidades(?: a dano)?)\b\s*:?/))) {
    m.vulnerabilities = damageTypesIn(rest(k[0].length));
    return true;
  }
  return HEADER_FIELDS.test(f);
}

function readSizeType(line: string, m: Monster5e): boolean {
  const words = fold(line).split(/[^a-z-]+/).filter(Boolean);
  const size = words.find((w) => SIZES[w]);
  const swarm = /\b(swarm|enxame)\b/.test(fold(line));
  const type = words.find((w) => CREATURE_TYPES[w]);
  if (!size && !type) return false;
  if (size) m.size = SIZES[size] ?? m.size;
  m.creatureType = swarm ? 'swarm' : (type ? CREATURE_TYPES[type] ?? 'humanoid' : m.creatureType);
  return true;
}

function looksPortuguese(text: string): boolean {
  return /classe de armadura|pontos de vida|deslocamento|acoes|nivel de desafio|idiomas/.test(fold(text));
}

/** Parse a stat block pasted as text (EN/PT, 2014/2024 layouts). */
export function parseStatBlockText(input: string): Monster5e {
  const m = emptyMonster();
  m.sourceLang = looksPortuguese(input) ? 'pt' : 'en';
  const lines = input
    .replace(/\r/g, '')
    .split('\n')
    .map((l) => l.replace(/^[#>*_\s]+|[*_]+$/g, '').replace(/\*\*|__/g, '').trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) { m.warnings.push('empty'); return m; }

  m.name = lines[0] ?? '';
  let i = 1;
  if (lines[1] && readSizeType(lines[1], m)) i = 2;

  readAbilities(lines, m);

  let section: FeatureSection = 'trait';
  let current: { name: string; text: string[]; section: FeatureSection } | null = null;
  const feats: Feature5e[] = [];
  const flush = () => {
    if (current) feats.push(buildFeature(current.name, current.text.join(' '), current.section));
    current = null;
  };
  let inHeader = true;

  for (; i < lines.length; i++) {
    const line = lines[i] ?? '';
    const f = fold(line).replace(/[:.]$/, '');

    const header = SECTION_HEADERS.find(([re]) => re.test(f));
    if (header) { flush(); section = header[1]; inHeader = false; continue; }

    if (inHeader) {
      if (readHeaderField(line, m)) continue;
      // Ability score rows are consumed by readAbilities.
      if (/^(str|dex|con|int|wis|cha|for|des|sab|car|mod|save|salv)\b/.test(f) || /^\d{1,2}\s*\(/.test(f) || /^[\d\s()+\-−]+$/.test(f)) continue;
    }

    // Legendary action preamble: "The dragon can take 3 legendary actions…" / "Legendary Action Uses: 3"
    const leg = f.match(/(?:can take|pode realizar|pode executar)\s+(\d|three|two|tres|duas|dois)\s+(?:legendary actions|acoes lendarias)|legendary action uses\s*:?\s*(\d)|usos de acao lendaria\s*:?\s*(\d)/);
    if (leg) {
      const raw = leg[1] ?? leg[2] ?? leg[3] ?? '3';
      m.legendaryActionCount = { three: 3, two: 2, tres: 3, duas: 2, dois: 2 }[raw] ?? Number(raw);
      if (section === 'legendary' && !FEATURE_START.test(line)) continue;
    }

    const fs = line.match(FEATURE_START);
    if (fs && fs[1] && isTitle(fs[1])) {
      flush();
      inHeader = false;
      current = { name: fs[1], text: [fs[2] ?? ''], section };
      continue;
    }
    if (current) current.text.push(line);
  }
  flush();

  for (const feat of feats) {
    const lr = fold(feat.name).match(/legendary resistance|resistencia lendaria/);
    if (lr) m.legendaryResistance = feat.perDay ?? 3;
  }
  if (m.legendaryActionCount === 0 && feats.some((f) => f.section === 'legendary')) m.legendaryActionCount = 3;
  m.features = feats;
  if (!m.name) m.warnings.push('noName');
  if (m.cr === 0 && !/\b(challenge|cr|nd|nivel de desafio)\b/.test(fold(input))) m.warnings.push('noCR');
  return m;
}
