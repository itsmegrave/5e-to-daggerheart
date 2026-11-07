/**
 * Conversion tables. Every number here is documented in docs/CONVERSION_RULES.md.
 *
 * Daggerheart sources:
 *  - SRD "Adversary Stat Block Benchmarks" (attack +1..+4, Difficulty 11/14/17/20,
 *    thresholds 7/12, 10/20, 20/32, 25/45, damage 1d6+2 … 4d12+15).
 *  - Homebrew Kit v1.0 (HP ranges, damage die per type, attack-modifier tendencies,
 *    "number of damage dice = tier", Fear costs for the most powerful features).
 *  - Per-type numbers are the medians of the 129 SRD adversaries for that type and tier,
 *    smoothed where the SRD has one or no example (marked * in the docs).
 */
import type { AdversaryType, DHRange, DHTrait, DamageType5e, Ability, Tier } from './types';

export interface Benchmark {
  difficulty: number;
  hp: number;
  stress: number;
  atk: number;
  major: number;
  severe: number;
}

export const BENCHMARKS: Record<AdversaryType, Record<Tier, Benchmark>> = {
  bruiser: {
    1: { difficulty: 13, hp: 7, stress: 3, atk: 1, major: 8, severe: 15 },
    2: { difficulty: 15, hp: 7, stress: 4, atk: 2, major: 14, severe: 28 },
    3: { difficulty: 17, hp: 7, stress: 4, atk: 3, major: 22, severe: 40 },
    4: { difficulty: 20, hp: 8, stress: 5, atk: 4, major: 37, severe: 70 },
  },
  horde: {
    1: { difficulty: 11, hp: 6, stress: 3, atk: 0, major: 6, severe: 11 },
    2: { difficulty: 14, hp: 5, stress: 3, atk: 0, major: 10, severe: 20 },
    3: { difficulty: 16, hp: 6, stress: 4, atk: 1, major: 18, severe: 33 },
    4: { difficulty: 17, hp: 8, stress: 5, atk: 2, major: 25, severe: 45 },
  },
  leader: {
    1: { difficulty: 14, hp: 6, stress: 3, atk: 3, major: 7, severe: 14 },
    2: { difficulty: 16, hp: 6, stress: 4, atk: 3, major: 13, severe: 26 },
    3: { difficulty: 17, hp: 7, stress: 5, atk: 4, major: 22, severe: 38 },
    4: { difficulty: 20, hp: 8, stress: 6, atk: 6, major: 35, severe: 68 },
  },
  minion: {
    1: { difficulty: 10, hp: 1, stress: 1, atk: -2, major: 0, severe: 0 },
    2: { difficulty: 13, hp: 1, stress: 1, atk: 0, major: 0, severe: 0 },
    3: { difficulty: 15, hp: 1, stress: 1, atk: 0, major: 0, severe: 0 },
    4: { difficulty: 18, hp: 1, stress: 1, atk: 2, major: 0, severe: 0 },
  },
  ranged: {
    1: { difficulty: 11, hp: 3, stress: 2, atk: 1, major: 4, severe: 7 },
    2: { difficulty: 14, hp: 5, stress: 3, atk: 3, major: 8, severe: 16 },
    3: { difficulty: 16, hp: 5, stress: 4, atk: 4, major: 18, severe: 31 },
    4: { difficulty: 19, hp: 4, stress: 3, atk: 5, major: 25, severe: 45 },
  },
  skulk: {
    1: { difficulty: 12, hp: 3, stress: 2, atk: 1, major: 5, severe: 9 },
    2: { difficulty: 14, hp: 4, stress: 3, atk: 2, major: 8, severe: 17 },
    3: { difficulty: 15, hp: 5, stress: 4, atk: 3, major: 16, severe: 30 },
    4: { difficulty: 18, hp: 5, stress: 4, atk: 4, major: 26, severe: 45 },
  },
  social: {
    1: { difficulty: 12, hp: 3, stress: 3, atk: -3, major: 4, severe: 8 },
    2: { difficulty: 14, hp: 3, stress: 3, atk: -2, major: 8, severe: 16 },
    3: { difficulty: 16, hp: 5, stress: 4, atk: 0, major: 16, severe: 32 },
    4: { difficulty: 18, hp: 5, stress: 5, atk: 1, major: 24, severe: 45 },
  },
  solo: {
    1: { difficulty: 13, hp: 8, stress: 3, atk: 3, major: 8, severe: 15 },
    2: { difficulty: 15, hp: 9, stress: 5, atk: 3, major: 13, severe: 25 },
    3: { difficulty: 18, hp: 10, stress: 6, atk: 4, major: 20, severe: 35 },
    4: { difficulty: 20, hp: 10, stress: 6, atk: 7, major: 35, severe: 65 },
  },
  standard: {
    1: { difficulty: 12, hp: 4, stress: 2, atk: 1, major: 5, severe: 9 },
    2: { difficulty: 14, hp: 4, stress: 3, atk: 1, major: 9, severe: 18 },
    3: { difficulty: 16, hp: 5, stress: 4, atk: 3, major: 18, severe: 35 },
    4: { difficulty: 19, hp: 6, stress: 4, atk: 4, major: 26, severe: 48 },
  },
  support: {
    1: { difficulty: 13, hp: 4, stress: 4, atk: 1, major: 5, severe: 9 },
    2: { difficulty: 14, hp: 4, stress: 5, atk: 2, major: 9, severe: 18 },
    3: { difficulty: 17, hp: 5, stress: 5, atk: 2, major: 17, severe: 33 },
    4: { difficulty: 19, hp: 5, stress: 5, atk: 4, major: 26, severe: 45 },
  },
};

/** Homebrew Kit: damage die by type (dice count = tier). */
export const DAMAGE_DIE: Record<AdversaryType, number> = {
  bruiser: 10, solo: 12, horde: 8, leader: 10, minion: 0, ranged: 10,
  skulk: 8, standard: 8, social: 4, support: 6,
};

/** Flat bonus added to the damage dice, chosen so averages sit in the SRD tier band. */
export const DAMAGE_BONUS: Record<Tier, number> = { 1: 2, 2: 3, 3: 3, 4: 10 };

/** Minion flat damage and Minion (X) value per tier (SRD medians). */
export const MINION: Record<Tier, { damage: number; x: number }> = {
  1: { damage: 2, x: 4 }, 2: { damage: 5, x: 6 }, 3: { damage: 7, x: 8 }, 4: { damage: 11, x: 12 },
};

/** Horde (X): damage once the horde has marked half its HP (SRD values). */
export const HORDE_X: Record<Tier, string> = { 1: '1d4+2', 2: '2d4+1', 3: '2d6+3', 4: '2d6+5' };

/** Battle Points cost per type (SRD "Building Balanced Encounters"). */
export const BATTLE_POINTS: Record<AdversaryType, number> = {
  minion: 1, social: 1, support: 1, horde: 2, ranged: 2, skulk: 2, standard: 2,
  leader: 3, bruiser: 4, solo: 5,
};

/**
 * Tier from Challenge Rating. Daggerheart tiers cover PC levels 1 / 2–4 / 5–7 / 8–10;
 * 5e covers 1–20, so a Daggerheart level is roughly half a 5e level.
 */
export function tierFromCR(cr: number): Tier {
  if (cr <= 2) return 1;
  if (cr <= 8) return 2;
  if (cr <= 14) return 3;
  return 4;
}

/** Typical 5e AC by CR (DMG "Monster Statistics by Challenge Rating"). */
export function expectedAC(cr: number): number {
  if (cr <= 3) return 13;
  if (cr <= 4) return 14;
  if (cr <= 7) return 15;
  if (cr <= 9) return 16;
  if (cr <= 12) return 17;
  if (cr <= 16) return 18;
  return 19;
}

/** Typical 5e attack bonus by CR (DMG table). */
export function expectedToHit(cr: number): number {
  if (cr <= 2) return 3;
  if (cr <= 3) return 4;
  if (cr <= 4) return 5;
  if (cr <= 7) return 6;
  if (cr <= 10) return 7;
  if (cr <= 15) return 8;
  if (cr <= 16) return 9;
  if (cr <= 20) return 10;
  return 11;
}

/**
 * Typical HP of published 5e monsters by CR. The DMG table overstates low CRs
 * (a CR 1/4 goblin has 7 HP, not 36–49), so this follows the SRD bestiary instead.
 */
export function expectedHP(cr: number): number {
  if (cr <= 0) return 3;
  if (cr <= 0.125) return 8;
  if (cr <= 0.25) return 11;
  if (cr <= 0.5) return 18;
  return 15 * cr + 15;
}

/** 5e reach/range in feet → Daggerheart range band (SRD grid: 1 / 3 / 6 / 12+ squares, widened for bows). */
export function rangeFromFeet(ft: number): DHRange {
  if (ft <= 5) return 'melee';
  if (ft <= 15) return 'veryClose';
  if (ft <= 30) return 'close';
  if (ft <= 120) return 'far';
  return 'veryFar';
}

const MAGIC: DamageType5e[] = ['cold', 'fire', 'force', 'lightning', 'necrotic', 'psychic', 'radiant', 'thunder'];
export function isMagicType(t: DamageType5e | null): boolean {
  return t !== null && MAGIC.includes(t);
}
export const PHYSICAL: DamageType5e[] = ['bludgeoning', 'piercing', 'slashing'];

/** 5e saving throw ability → Daggerheart trait used for the Reaction Roll. */
export const SAVE_TO_TRAIT: Record<Ability, DHTrait> = {
  str: 'strength', dex: 'agility', con: 'strength', int: 'knowledge', wis: 'instinct', cha: 'presence',
};

/** 5e skill → Daggerheart example Experience (SRD list), used when the skill bonus is high. */
export const SKILL_TO_EXPERIENCE: Record<string, string> = {
  stealth: 'stealth', perception: 'keenSenses', survival: 'tracker', intimidation: 'intimidation',
  deception: 'socialite', persuasion: 'socialite', insight: 'socialite', acrobatics: 'acrobatics',
  arcana: 'magicalKnowledge', religion: 'magicalKnowledge', history: 'nobility', athletics: 'blademaster',
  nature: 'naturesFriend', 'animal handling': 'naturesFriend', 'sleight of hand': 'intrusion', investigation: 'keenSenses',
};

/** Default Motives & Tactics by 5e creature type (keys into the i18n motive catalog). */
export const MOTIVES_BY_TYPE: Record<string, string[]> = {
  aberration: ['alienPurpose', 'dominate', 'unsettle', 'warpMinds'],
  beast: ['hunt', 'defendTerritory', 'feed', 'flee'],
  celestial: ['judge', 'protectTheInnocent', 'smite', 'upholdOrder'],
  construct: ['followOrders', 'guard', 'obliterate', 'protect'],
  dragon: ['dominate', 'hoard', 'intimidate', 'scorch'],
  elemental: ['consume', 'engulf', 'rampage', 'reshape'],
  fey: ['bargain', 'beguile', 'playTricks', 'vanish'],
  fiend: ['corrupt', 'deceive', 'tempt', 'torment'],
  giant: ['crush', 'intimidate', 'smash', 'throwThings'],
  humanoid: ['ambush', 'outnumber', 'profit', 'survive'],
  monstrosity: ['ambush', 'devour', 'hunt', 'terrorize'],
  ooze: ['absorb', 'consume', 'divide', 'engulf'],
  plant: ['entangle', 'grow', 'lure', 'protectTheForest'],
  swarm: ['consume', 'overwhelm', 'scatter', 'surround'],
  undead: ['consume', 'hateTheLiving', 'serve', 'spreadRot'],
};
