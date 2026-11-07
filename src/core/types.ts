// ---------- D&D 5e (normalized) ----------

export type Ability = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

export type DamageType5e =
  | 'acid' | 'bludgeoning' | 'cold' | 'fire' | 'force' | 'lightning' | 'necrotic'
  | 'piercing' | 'poison' | 'psychic' | 'radiant' | 'slashing' | 'thunder';

export type Condition5e =
  | 'blinded' | 'charmed' | 'deafened' | 'exhaustion' | 'frightened' | 'grappled'
  | 'incapacitated' | 'invisible' | 'paralyzed' | 'petrified' | 'poisoned' | 'prone'
  | 'restrained' | 'stunned' | 'unconscious';

export interface DamageRoll {
  /** e.g. "2d6+4" (no spaces). Empty when the damage is a flat number. */
  dice: string;
  average: number;
  type: DamageType5e | null;
}

export interface Attack5e {
  kind: 'melee' | 'ranged' | 'both';
  toHit: number;
  /** Reach (melee) or normal range (ranged) in feet. */
  reachFt: number;
  /** Normal range in feet for thrown or 'melee or ranged' attacks. */
  rangeFt: number | null;
  damage: DamageRoll[];
}

export interface SavingEffect5e {
  dc: number;
  ability: Ability;
  /** Area or range in feet, when stated. */
  areaFt: number | null;
  damage: DamageRoll[];
  halfOnSuccess: boolean;
}

export type FeatureSection = 'trait' | 'action' | 'bonus' | 'reaction' | 'legendary' | 'lair' | 'mythic';

export interface Feature5e {
  name: string;
  text: string;
  section: FeatureSection;
  attack: Attack5e | null;
  save: SavingEffect5e | null;
  /** "Recharge 5-6" → 5; "Recharge 6" → 6; "Recharges after a Short or Long Rest" → 7. */
  recharge: number | null;
  /** "3/Day" → 3. */
  perDay: number | null;
  conditions: Condition5e[];
}

export interface Monster5e {
  name: string;
  size: string;
  creatureType: string;
  ac: number;
  hp: number;
  speed: string;
  abilities: Record<Ability, number>;
  saves: Partial<Record<Ability, number>>;
  skills: Record<string, number>;
  resistances: DamageType5e[];
  immunities: DamageType5e[];
  vulnerabilities: DamageType5e[];
  /** True when B/P/S resistances or immunities only apply to nonmagical attacks. */
  physicalOnlyNonmagical: boolean;
  conditionImmunities: Condition5e[];
  senses: string;
  languages: string;
  cr: number;
  legendaryActionCount: number;
  legendaryResistance: number;
  features: Feature5e[];
  /** Language the source block was written in. */
  sourceLang: 'en' | 'pt';
  /** Parser warnings to surface in the UI. */
  warnings: string[];
}

// ---------- Daggerheart ----------

export type Tier = 1 | 2 | 3 | 4;

export type AdversaryType =
  | 'bruiser' | 'horde' | 'leader' | 'minion' | 'ranged'
  | 'skulk' | 'social' | 'solo' | 'standard' | 'support';

export type DHRange = 'melee' | 'veryClose' | 'close' | 'far' | 'veryFar';

export type DHDamageType = 'phy' | 'mag';

export type DHTrait = 'agility' | 'strength' | 'finesse' | 'instinct' | 'presence' | 'knowledge';

export type FeatureKind = 'passive' | 'action' | 'reaction';

/**
 * A generated feature. Its text is built from a localizable template so the
 * renderer can print it in English or Portuguese. `sourceText` keeps the 5e
 * wording for features that could only be carried over, not rewritten.
 */
export interface DHFeature {
  kind: FeatureKind;
  /** Template key in the i18n feature catalog, or 'carried' for 5e text carried over. */
  key: string;
  name: string;
  params: Record<string, string | number>;
  sourceText?: string;
  cost?: 'stress' | 'fear' | null;
  /** True when the GM should look at this feature before play. */
  review: boolean;
}

export interface Experience {
  key: string;
  value: number;
}

export interface Adversary {
  name: string;
  tier: Tier;
  type: AdversaryType;
  creatureType: string;
  motives: string[];
  difficulty: number;
  major: number | null;
  severe: number | null;
  hp: number;
  stress: number;
  atk: number;
  attackName: string;
  range: DHRange;
  damage: string;
  damageType: DHDamageType;
  experiences: Experience[];
  features: DHFeature[];
}

export type NoteLevel = 'info' | 'review' | 'dropped';

export interface ConversionNote {
  level: NoteLevel;
  key: string;
  params: Record<string, string | number>;
}

export interface ConversionOptions {
  tier?: Tier;
  type?: AdversaryType;
  /** Party size, used to adjust HP (Homebrew Kit guidance). */
  partySize?: number;
}

export interface ConversionResult {
  adversary: Adversary;
  notes: ConversionNote[];
  /** What the engine picked before overrides, so the UI can show "auto". */
  detected: { tier: Tier; type: AdversaryType; typeReason: string };
}
