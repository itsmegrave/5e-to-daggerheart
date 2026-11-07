import { DICTS, type Lang } from '../i18n';
import type { Params } from '../i18n/types';
import type { Adversary, ConversionNote, DHFeature, DHRange, DHTrait, DamageType5e } from './types';

export interface RenderedFeature {
  title: string;
  kind: string;
  text: string;
  review: boolean;
  carried: boolean;
}

export interface RenderedAdversary {
  name: string;
  subtitle: string;
  motives: string;
  stats: Array<[string, string]>;
  attack: string;
  experience: string;
  features: RenderedFeature[];
}

export function formatCR(cr: number): string {
  if (cr === 0.125) return '1/8';
  if (cr === 0.25) return '1/4';
  if (cr === 0.5) return '1/2';
  return String(cr);
}

const sign = (n: number) => (n >= 0 ? `+${n}` : `${n}`);

function elements(lang: Lang, csv: string | number | undefined): string {
  const d = DICTS[lang];
  const items = String(csv ?? '').split(',').filter(Boolean).map((e) => d.terms.elements[e as DamageType5e] ?? e);
  return d.features.list(items);
}

function featureText(lang: Lang, f: DHFeature, a: Adversary): string {
  const d = DICTS[lang];
  const p = f.params;
  if (f.key === 'carried') {
    const lead = f.cost ? `${d.features.cost[f.cost]}: ` : '';
    return `${lead}${d.features.carriedPrefix}${f.sourceText ?? ''}`;
  }
  const range = d.terms.ranges[(p.range as DHRange) ?? 'close'];
  const conds = String(p.conditions ?? '').split(',').filter(Boolean)
    .map((c) => d.features.conditions[c as 'restrained' | 'vulnerable' | 'stress']);
  const single = f.key === 'targetSave' || f.key === 'targetSaveEffect';
  const condTable = single ? d.features.conditionsOne : d.features.conditions;
  const condListText = d.features.list(
    String(p.conditions ?? '').split(',').filter(Boolean).map((c) => condTable[c as 'restrained' | 'vulnerable' | 'stress']),
  );
  const condList = d.features.list(conds);
  const cost = f.cost ? d.features.cost[f.cost] : '';
  const params: Params = {
    ...p,
    adversary: a.name,
    cost,
    costLead: cost ? `${cost}. ` : '',
    within: d.features.within(range),
    roll: d.features.reactionRoll(d.terms.traits[(p.trait as DHTrait) ?? 'agility']),
    dtype: d.terms.damageTypesLong[(p.dtype as 'phy' | 'mag') ?? 'phy'],
    elements: elements(lang, p.elements),
    conditions: condList,
    condTail: conds.length ? `${d.features.condTailJoin}${condListText}` : '',
    condOrSource: conds.length ? condListText : single ? d.features.sourceEffectOne : d.features.sourceEffect,
    half: Number(p.half ?? 0),
  };
  const tpl = d.features.text[f.key];
  return tpl ? tpl(params) : f.sourceText ?? '';
}

function featureTitle(lang: Lang, f: DHFeature): string {
  const d = DICTS[lang];
  const base = d.features.names[f.key] ?? f.name;
  const x = f.params.x;
  return x !== undefined && ['minion', 'horde', 'relentless'].includes(f.key) ? `${base} (${x})` : base;
}

export function renderAdversary(a: Adversary, lang: Lang): RenderedAdversary {
  const d = DICTS[lang];
  const t = d.terms;
  const thresholds = a.major === null || a.severe === null ? t.none : `${a.major}/${a.severe}`;
  return {
    name: a.name,
    subtitle: `${t.tier} ${a.tier} ${t.types[a.type]}`,
    motives: a.motives.map((m) => t.motiveList[m] ?? m).join(', '),
    stats: [
      [t.difficulty, String(a.difficulty)],
      [t.thresholds, thresholds],
      [t.hp, String(a.hp)],
      [t.stress, String(a.stress)],
    ],
    attack: `${t.atk}: ${sign(a.atk)} | ${a.attackName || '—'}: ${t.ranges[a.range]} | ${a.damage} ${t.damageTypes[a.damageType]}`,
    experience: a.experiences.map((e) => `${t.experiences[e.key] ?? e.key} ${sign(e.value)}`).join(', '),
    features: a.features.map((f) => ({
      title: featureTitle(lang, f),
      kind: t.kinds[f.kind],
      text: featureText(lang, f, a),
      review: f.review,
      carried: f.key === 'carried',
    })),
  };
}

export function toMarkdown(a: Adversary, lang: Lang): string {
  const r = renderAdversary(a, lang);
  const t = DICTS[lang].terms;
  const lines = [
    `# ${r.name}`,
    `***${r.subtitle}***`,
    '',
    `**${t.motives}:** ${r.motives}`,
    '',
    r.stats.map(([k, v]) => `**${k}:** ${v}`).join(' | '),
    `**${r.attack.replace(/^([^:]+):/, '$1:**')}`,
  ];
  if (r.experience) lines.push(`**${t.experience}:** ${r.experience}`);
  if (r.features.length) {
    lines.push('', `## ${t.features}`, '');
    for (const f of r.features) lines.push(`***${f.title} - ${f.kind}:*** ${f.text}`, '');
  }
  return lines.join('\n').trim();
}

export function toPlainText(a: Adversary, lang: Lang): string {
  const r = renderAdversary(a, lang);
  const t = DICTS[lang].terms;
  const lines = [
    r.name.toUpperCase(),
    r.subtitle,
    `${t.motives}: ${r.motives}`,
    r.stats.map(([k, v]) => `${k}: ${v}`).join(' | '),
    r.attack,
  ];
  if (r.experience) lines.push(`${t.experience}: ${r.experience}`);
  if (r.features.length) {
    lines.push('', t.features.toUpperCase());
    for (const f of r.features) lines.push(`${f.title} - ${f.kind}: ${f.text}`);
  }
  return lines.join('\n');
}

export function noteText(n: ConversionNote, lang: Lang): string {
  const d = DICTS[lang];
  const p: Params = { ...n.params };
  if (typeof p.type === 'string') p.type = d.terms.types[p.type as keyof typeof d.terms.types] ?? p.type;
  if (typeof p.range === 'string') p.range = d.terms.ranges[p.range as DHRange] ?? p.range;
  if (typeof p.cr === 'number') p.cr = formatCR(p.cr);
  if (typeof p.elements === 'string') p.elements = elements(lang, p.elements);
  if (typeof p.conditions === 'string') {
    p.conditions = d.features.list(p.conditions.split(',').filter(Boolean).map((c) => d.terms.conditions5e[c as keyof typeof d.terms.conditions5e] ?? c));
  }
  const fn = d.notes[n.key];
  return fn ? fn(p) : n.key;
}
