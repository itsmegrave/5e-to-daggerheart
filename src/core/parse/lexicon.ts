import type { Ability, Condition5e, DamageType5e } from '../types';

/** Lowercase, strip accents, normalize dashes/minus signs. */
export function fold(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[‒–—−]/g, '-')
    .toLowerCase();
}

/** Turn "−1", "–2", "+3" into numbers. */
export function signed(s: string): number {
  return Number(s.replace(/[‒–—−]/g, '-').replace(/\s+/g, ''));
}

// Ability names and abbreviations (EN + PT), folded.
export const ABILITY_WORDS: Record<string, Ability> = {
  str: 'str', strength: 'str', for: 'str', forca: 'str',
  dex: 'dex', dexterity: 'dex', des: 'dex', destreza: 'dex',
  con: 'con', constitution: 'con', constituicao: 'con',
  int: 'int', intelligence: 'int', inteligencia: 'int',
  wis: 'wis', wisdom: 'wis', sab: 'wis', sabedoria: 'wis',
  cha: 'cha', charisma: 'cha', car: 'cha', carisma: 'cha',
};

// Damage types (EN + PT variants from 2014 and 2024 Portuguese books), folded.
export const DAMAGE_WORDS: Record<string, DamageType5e> = {
  acid: 'acid', acido: 'acid',
  bludgeoning: 'bludgeoning', concussao: 'bludgeoning', contundente: 'bludgeoning', impacto: 'bludgeoning',
  cold: 'cold', frio: 'cold',
  fire: 'fire', fogo: 'fire', igneo: 'fire',
  force: 'force', energia: 'force', forca: 'force',
  lightning: 'lightning', eletrico: 'lightning', eletricidade: 'lightning', relampago: 'lightning', raio: 'lightning',
  necrotic: 'necrotic', necrotico: 'necrotic',
  piercing: 'piercing', perfurante: 'piercing', perfuracao: 'piercing',
  poison: 'poison', veneno: 'poison', venenoso: 'poison',
  psychic: 'psychic', psiquico: 'psychic',
  radiant: 'radiant', radiante: 'radiant',
  slashing: 'slashing', cortante: 'slashing', corte: 'slashing',
  thunder: 'thunder', trovejante: 'thunder', trovao: 'thunder', sonico: 'thunder',
};

export const CONDITION_WORDS: Record<string, Condition5e> = {
  blinded: 'blinded', cego: 'blinded', cega: 'blinded',
  charmed: 'charmed', enfeiticado: 'charmed', enfeiticada: 'charmed',
  deafened: 'deafened', surdo: 'deafened', surda: 'deafened', ensurdecido: 'deafened',
  exhaustion: 'exhaustion', exaustao: 'exhaustion',
  frightened: 'frightened', amedrontado: 'frightened', amedrontada: 'frightened', assustado: 'frightened',
  grappled: 'grappled', agarrado: 'grappled', agarrada: 'grappled',
  incapacitated: 'incapacitated', incapacitado: 'incapacitated', incapacitada: 'incapacitated',
  invisible: 'invisible', invisivel: 'invisible',
  paralyzed: 'paralyzed', paralisado: 'paralyzed', paralisada: 'paralyzed',
  petrified: 'petrified', petrificado: 'petrified', petrificada: 'petrified',
  poisoned: 'poisoned', envenenado: 'poisoned', envenenada: 'poisoned',
  prone: 'prone', caido: 'prone', caida: 'prone', derrubado: 'prone', derrubada: 'prone',
  restrained: 'restrained', impedido: 'restrained', impedida: 'restrained', contido: 'restrained', contida: 'restrained', imobilizado: 'restrained',
  stunned: 'stunned', atordoado: 'stunned', atordoada: 'stunned',
  unconscious: 'unconscious', inconsciente: 'unconscious',
};

// Creature types, folded → canonical English.
export const CREATURE_TYPES: Record<string, string> = {
  aberration: 'aberration', aberracao: 'aberration',
  beast: 'beast', besta: 'beast', fera: 'beast',
  celestial: 'celestial',
  construct: 'construct', constructo: 'construct', construto: 'construct',
  dragon: 'dragon', dragao: 'dragon',
  elemental: 'elemental',
  fey: 'fey', fada: 'fey', feerico: 'fey', fae: 'fey',
  fiend: 'fiend', corruptor: 'fiend', infero: 'fiend', demonio: 'fiend', diabo: 'fiend',
  giant: 'giant', gigante: 'giant',
  humanoid: 'humanoid', humanoide: 'humanoid',
  monstrosity: 'monstrosity', monstruosidade: 'monstrosity',
  ooze: 'ooze', limo: 'ooze', gosma: 'ooze', lodo: 'ooze',
  plant: 'plant', planta: 'plant', vegetal: 'plant',
  undead: 'undead', 'morto-vivo': 'undead', 'morta-viva': 'undead', mortovivo: 'undead',
};

export const SIZES: Record<string, string> = {
  tiny: 'tiny', miudo: 'tiny', minusculo: 'tiny',
  small: 'small', pequeno: 'small', pequena: 'small',
  medium: 'medium', medio: 'medium', media: 'medium',
  large: 'large', grande: 'large',
  huge: 'huge', enorme: 'huge',
  gargantuan: 'gargantuan', imenso: 'gargantuan', imensa: 'gargantuan', colossal: 'gargantuan',
};

/** Portuguese skill names → English keys (folded). */
export const SKILL_WORDS: Record<string, string> = {
  acrobatics: 'acrobatics', acrobacia: 'acrobatics',
  'animal handling': 'animal handling', 'adestrar animais': 'animal handling', 'lidar com animais': 'animal handling',
  arcana: 'arcana', arcanismo: 'arcana',
  athletics: 'athletics', atletismo: 'athletics',
  deception: 'deception', enganacao: 'deception', blefar: 'deception',
  history: 'history', historia: 'history',
  insight: 'insight', intuicao: 'insight',
  intimidation: 'intimidation', intimidacao: 'intimidation',
  investigation: 'investigation', investigacao: 'investigation',
  medicine: 'medicine', medicina: 'medicine',
  nature: 'nature', natureza: 'nature',
  perception: 'perception', percepcao: 'perception',
  performance: 'performance', atuacao: 'performance',
  persuasion: 'persuasion', persuasao: 'persuasion',
  religion: 'religion', religiao: 'religion',
  'sleight of hand': 'sleight of hand', prestidigitacao: 'sleight of hand',
  stealth: 'stealth', furtividade: 'stealth',
  survival: 'survival', sobrevivencia: 'survival',
};

export const NUMBER_WORDS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6,
  um: 1, uma: 1, dois: 2, duas: 2, tres: 3, quatro: 4, cinco: 5, seis: 6,
};

/** Convert a distance with unit to feet. Portuguese books use 1.5 m per 5 ft. */
export function toFeet(value: string, unit: string): number {
  const n = Number(value.replace(',', '.'));
  const u = fold(unit);
  if (u.startsWith('m')) return Math.round((n / 1.5) * 5);
  return n;
}

export function parseCR(raw: string): number {
  const s = raw.trim();
  const frac = s.match(/^(\d+)\s*\/\s*(\d+)/);
  if (frac) return Number(frac[1]) / Number(frac[2]);
  const n = parseFloat(s.replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

/** Find every damage type mentioned in a list such as "fire; bludgeoning, piercing from nonmagical attacks". */
export function damageTypesIn(text: string): DamageType5e[] {
  const out = new Set<DamageType5e>();
  for (const w of fold(text).split(/[^a-z-]+/)) {
    const t = DAMAGE_WORDS[w];
    if (t) out.add(t);
  }
  return [...out];
}

export function conditionsIn(text: string): Condition5e[] {
  const out = new Set<Condition5e>();
  for (const w of fold(text).split(/[^a-z-]+/)) {
    const c = CONDITION_WORDS[w];
    if (c) out.add(c);
  }
  return [...out];
}

export function isNonmagicalQualifier(text: string): boolean {
  return /nonmagical|non-magical|nao magic|nao-magic|mundan/.test(fold(text));
}
