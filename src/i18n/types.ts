import type { AdversaryType, Condition5e, DHDamageType, DHRange, DHTrait, DamageType5e, FeatureKind, NoteLevel } from '../core/types';

export type Params = Record<string, string | number>;
type Fn = (p: Params) => string;

export interface Dict {
  ui: {
    appTitle: string; tagline: string; input: string; inputHelp: string; inputPlaceholder: string;
    samples: string; uploadJson: string; clear: string; pickMonster: string; options: string;
    tier: string; type: string; auto: string; partySize: string; outputLang: string; result: string;
    notes: string; notesHelp: string; copyMarkdown: string; copyText: string; downloadJson: string;
    copied: string; empty: string; parseError: string; review: string; reviewHint: string;
    rules: string; source: string; themeToggle: string; uiLang: string;
    noteLevels: Record<NoteLevel, string>; detected: string; legal: string; name: string; attackName: string; heroTag: string;
  };
  terms: {
    tier: string; difficulty: string; thresholds: string; hp: string; stress: string; atk: string;
    experience: string; motives: string; features: string; none: string;
    kinds: Record<FeatureKind, string>;
    types: Record<AdversaryType, string>;
    ranges: Record<DHRange, string>;
    damageTypes: Record<DHDamageType, string>;
    damageTypesLong: Record<DHDamageType, string>;
    traits: Record<DHTrait, string>;
    elements: Record<DamageType5e, string>;
    conditions5e: Record<Condition5e, string>;
    experiences: Record<string, string>;
    motiveList: Record<string, string>;
  };
  features: {
    cost: { stress: string; fear: string };
    within: (range: string) => string;
    reactionRoll: (trait: string) => string;
    /** Plural subject ("targets who fail …"). */
    conditions: { restrained: string; vulnerable: string; stress: string };
    /** Single target ("on a failure, the target …"). */
    conditionsOne: { restrained: string; vulnerable: string; stress: string };
    list: (items: string[]) => string;
    names: Record<string, string>;
    text: Record<string, Fn>;
    condTailJoin: string;
    sourceEffect: string;
    sourceEffectOne: string;
    carriedPrefix: string;
  };
  notes: Record<string, Fn>;
}

export type Lang = 'en' | 'pt';
