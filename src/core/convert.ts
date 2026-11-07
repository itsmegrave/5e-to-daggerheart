import {
  BENCHMARKS, DAMAGE_BONUS, DAMAGE_DIE, HORDE_X, MINION, MOTIVES_BY_TYPE, PHYSICAL, SAVE_TO_TRAIT,
  SKILL_TO_EXPERIENCE, expectedAC, expectedHP, expectedToHit, isMagicType, rangeFromFeet, tierFromCR,
} from './rules';
import type {
  Adversary, AdversaryType, Condition5e, ConversionNote, ConversionOptions, ConversionResult, DHDamageType,
  DHFeature, Experience, Feature5e, Monster5e, Tier,
} from './types';
import { fold } from './parse/lexicon';

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const SIZE_ORDER = ['tiny', 'small', 'medium', 'large', 'huge', 'gargantuan'];
const sizeAtLeast = (m: Monster5e, s: string) => SIZE_ORDER.indexOf(m.size) >= SIZE_ORDER.indexOf(s);

const RE = {
  multiattack: /^(multiattack|ataques? multiplos?|ataque multiplo)$/,
  spellcasting: /spellcasting|innate spellcasting|conjuracao|conjuracao inata|magia inata/,
  leader: /leadership|commander|command |rally|summon|call (allies|reinforcements|for help)|lideranca|comandar|comando|invocar|convocar|reunir/,
  support: /cure wounds|healing word|mass cure|heal\b|bless\b|\baid\b|lesser restoration|curar ferimentos|palavra curativa|cura\b|bencao|auxilio/,
  skulk: /sneak attack|nimble escape|cunning action|ambush|surprise attack|shadow stealth|superior invisibility|ataque furtivo|fuga agil|acao ardilosa|emboscad|furtividade sombria/,
  packTactics: /^(pack tactics|taticas de matilha|tatica de bando)$/,
  keenSenses: /^(keen (smell|sight|hearing|senses|hearing and smell|sight and smell)|faro|visao agucada|audicao agucada|sentidos agucados|audicao e olfato agucados)/,
  magicResistance: /^(magic resistance|resistencia a magia)$/,
  legendaryResistance: /^(legendary resistance|resistencia lendaria)$/,
  swarmTrait: /^(swarm|enxame)$/,
  ignoredTraits: /^(amphibious|anfibio|hold breath|prender a respiracao|water breathing|limited amphibiousness|echolocation|ecolocalizacao)$/,
};

interface Ctx {
  m: Monster5e;
  tier: Tier;
  notes: ConversionNote[];
}

function note(ctx: Ctx, level: ConversionNote['level'], key: string, params: ConversionNote['params'] = {}) {
  ctx.notes.push({ level, key, params });
}

const avg = (f: Feature5e) => (f.attack ? f.attack.damage.reduce((s, d) => s + d.average, 0) : 0);

function attacksOf(m: Monster5e): Feature5e[] {
  return m.features.filter((f) => f.attack && (f.section === 'action' || f.section === 'bonus'));
}

function primaryAttack(m: Monster5e, preferRanged: boolean): Feature5e | null {
  const atks = attacksOf(m);
  if (atks.length === 0) return null;
  const sorted = [...atks].sort((a, b) => avg(b) - avg(a));
  if (preferRanged) return sorted.find((f) => f.attack?.kind !== 'melee') ?? sorted[0] ?? null;
  return sorted[0] ?? null;
}

function multiattackCount(m: Monster5e): number {
  const f = m.features.find((x) => RE.multiattack.test(fold(x.name)));
  if (!f) return 1;
  const t = fold(f.text);
  const w = t.match(/\b(two|three|four|five|duas|dois|tres|quatro|cinco|\d)\b/);
  const map: Record<string, number> = { two: 2, three: 3, four: 4, five: 5, duas: 2, dois: 2, tres: 3, quatro: 4, cinco: 5 };
  return w && w[1] ? map[w[1]] ?? Number(w[1]) : 2;
}

function allText(m: Monster5e): string {
  return fold(m.features.map((f) => `${f.name} ${f.text}`).join(' '));
}

export function detectType(m: Monster5e): { type: AdversaryType; reason: string } {
  const text = allText(m);
  const primary = primaryAttack(m, false);
  const ranged = primaryAttack(m, true);
  const mental = Math.max(m.abilities.int, m.abilities.wis, m.abilities.cha);

  if (m.legendaryActionCount > 0) return { type: 'solo', reason: 'legendary' };
  if (m.creatureType === 'swarm') return { type: 'horde', reason: 'swarm' };
  if (sizeAtLeast(m, 'huge') && m.cr >= 3) return { type: 'solo', reason: 'huge' };
  if (m.creatureType === 'dragon' && sizeAtLeast(m, 'large')) return { type: 'solo', reason: 'dragon' };
  if (m.cr <= 0.25 && m.hp <= 12) return { type: 'minion', reason: 'minion' };
  if (RE.leader.test(text)) return { type: 'leader', reason: 'leader' };
  if (RE.support.test(text) && avg(primary ?? ({} as Feature5e)) <= 8) return { type: 'support', reason: 'support' };
  if (!primary || (avg(primary) <= 4 && mental >= 14 && (m.skills.persuasion || m.skills.deception))) {
    return { type: 'social', reason: 'social' };
  }
  if (ranged && ranged.attack?.kind !== 'melee' && ranged.attack && ranged.attack.reachFt >= 60 && avg(ranged) >= avg(primary ?? ranged)) {
    return { type: 'ranged', reason: 'ranged' };
  }
  if (RE.skulk.test(text) || (m.skills.stealth ?? 0) >= 6) return { type: 'skulk', reason: 'skulk' };
  if (m.abilities.str >= 18 && (sizeAtLeast(m, 'large') || m.hp >= 1.2 * expectedHP(m.cr))) return { type: 'bruiser', reason: 'bruiser' };
  return { type: 'standard', reason: 'standard' };
}

function damageTypeOf(f: Feature5e | null): DHDamageType {
  if (!f) return 'phy';
  const rolls = f.attack?.damage ?? f.save?.damage ?? [];
  let mag = 0;
  let phy = 0;
  for (const r of rolls) (isMagicType(r.type) ? (mag += r.average) : (phy += r.average));
  return mag > phy ? 'mag' : 'phy';
}

function elementsOf(f: Feature5e | null): string[] {
  const rolls = f?.attack?.damage ?? f?.save?.damage ?? [];
  return [...new Set(rolls.map((r) => r.type).filter((t): t is NonNullable<typeof t> => t !== null))];
}

/** 5e conditions → Daggerheart conditions (Restrained, Vulnerable) or a Stress mark. */
function dhConditions(cs: Condition5e[]): string[] {
  const out = new Set<string>();
  for (const c of cs) {
    if (c === 'grappled' || c === 'restrained') out.add('restrained');
    else if (c === 'paralyzed' || c === 'stunned' || c === 'petrified' || c === 'unconscious' || c === 'incapacitated') {
      out.add('restrained'); out.add('vulnerable');
    } else if (c === 'prone' || c === 'blinded' || c === 'poisoned' || c === 'deafened' || c === 'exhaustion') out.add('vulnerable');
    else if (c === 'frightened' || c === 'charmed') out.add('stress');
  }
  return [...out];
}

function dice(tier: Tier, die: number, bonus: number): string {
  return bonus > 0 ? `${tier}d${die}+${bonus}` : `${tier}d${die}`;
}

function buildExperiences(m: Monster5e): Experience[] {
  const out: Experience[] = [];
  const seen = new Set<string>();
  const skills = Object.entries(m.skills).sort((a, b) => b[1] - a[1]);
  for (const [skill, bonus] of skills) {
    const key = SKILL_TO_EXPERIENCE[skill];
    if (!key || seen.has(key) || bonus < 4) continue;
    seen.add(key);
    out.push({ key, value: bonus >= 8 ? 3 : 2 });
    if (out.length === 2) break;
  }
  const keen = m.features.some((f) => f.section === 'trait' && RE.keenSenses.test(fold(f.name)));
  if (keen && !seen.has('keenSenses') && out.length < 3) out.push({ key: 'keenSenses', value: 2 });
  return out;
}

function spellList(text: string): string {
  const f = text.replace(/\s+/g, ' ');
  const i = f.search(/at will|cantrips|1st level|\d\/day|a vontade|à vontade|truques|1º círculo|1o circulo|\d\/dia/i);
  const list = i >= 0 ? f.slice(i) : f;
  return list.length > 220 ? `${list.slice(0, 217)}…` : list;
}

function convertFeatures(ctx: Ctx, type: AdversaryType, primary: Feature5e | null, stdDamage: string): DHFeature[] {
  const { m, tier } = ctx;
  const passives: DHFeature[] = [];
  const actions: DHFeature[] = [];
  const reactions: DHFeature[] = [];
  const keepFlavor = type !== 'minion' && type !== 'horde';

  // Type features
  if (type === 'minion') {
    passives.push({ kind: 'passive', key: 'minion', name: 'Minion', params: { x: MINION[tier].x }, review: false });
    actions.push({ kind: 'action', key: 'groupAttack', name: 'Group Attack', params: { damage: MINION[tier].damage }, cost: 'fear', review: false });
  }
  if (type === 'horde') {
    passives.push({ kind: 'passive', key: 'horde', name: 'Horde', params: { x: HORDE_X[tier] }, review: false });
  }
  if (m.legendaryActionCount > 0) {
    const x = tier <= 2 ? 2 : 3;
    passives.push({ kind: 'passive', key: 'relentless', name: 'Relentless', params: { x }, review: false });
    note(ctx, 'info', 'legendaryToRelentless', { count: m.legendaryActionCount, x });
  }

  // Damage resistances & immunities
  const physRes = PHYSICAL.filter((t) => m.resistances.includes(t) || (m.immunities.includes(t) && m.physicalOnlyNonmagical));
  const physImm = PHYSICAL.filter((t) => m.immunities.includes(t) && !m.physicalOnlyNonmagical);
  if (physRes.length + physImm.length >= 2) {
    passives.push({ kind: 'passive', key: 'physicalResistance', name: 'Thick Hide', params: {}, review: physImm.length > 0 });
    if (physImm.length > 0) note(ctx, 'review', 'physicalImmunityToResistance');
  }
  const magicImm = m.immunities.filter((t) => isMagicType(t));
  const magicRes = m.resistances.filter((t) => isMagicType(t) && !magicImm.includes(t));
  if (magicRes.length + magicImm.length >= 4) {
    passives.push({ kind: 'passive', key: 'magicResistance', name: 'Arcane Form', params: {}, review: false });
  } else {
    if (magicImm.length) passives.push({ kind: 'passive', key: 'elementImmunity', name: 'Elemental Immunity', params: { elements: magicImm.join(',') }, review: true });
    if (magicRes.length) passives.push({ kind: 'passive', key: 'elementResistance', name: 'Elemental Resistance', params: { elements: magicRes.join(',') }, review: true });
  }
  const otherImm = m.immunities.filter((t) => t === 'acid' || t === 'poison');
  if (otherImm.length) note(ctx, 'info', 'poisonAcidImmunity', { elements: otherImm.join(',') });
  if (m.vulnerabilities.length) {
    passives.push({ kind: 'passive', key: 'vulnerability', name: 'Weakness', params: { elements: m.vulnerabilities.join(',') }, review: true });
  }
  const restrainImm = m.conditionImmunities.some((c) => c === 'grappled' || c === 'restrained' || c === 'paralyzed');
  if (restrainImm && keepFlavor) passives.push({ kind: 'passive', key: 'unrestrainable', name: 'Unstoppable', params: {}, review: false });
  const droppedConds = m.conditionImmunities.filter((c) => !['grappled', 'restrained', 'paralyzed'].includes(c));
  if (droppedConds.length) note(ctx, 'dropped', 'conditionImmunitiesDropped', { conditions: droppedConds.join(',') });
  if (m.legendaryResistance > 0) note(ctx, 'info', 'legendaryResistance', { n: m.legendaryResistance });

  // Standard attack riders (conditions)
  if (primary && primary.conditions.length) {
    const conds = dhConditions(primary.conditions);
    if (conds.length) passives.push({ kind: 'passive', key: 'attackRider', name: primary.name, params: { conditions: conds.join(',') }, review: false });
  }

  // Secondary attack (different range band only)
  const BAND_ORDER = ['melee', 'veryClose', 'close', 'far', 'veryFar'];
  const primaryRank = primary?.attack ? BAND_ORDER.indexOf(rangeFromFeet(primary.attack.reachFt)) : -1;
  let secondaryDone = false;
  for (const f of attacksOf(m)) {
    if (f === primary || !f.attack) continue;
    const band = rangeFromFeet(f.attack.kind === 'both' && f.attack.rangeFt ? f.attack.rangeFt : f.attack.reachFt);
    if (!secondaryDone && BAND_ORDER.indexOf(band) > primaryRank && keepFlavor) {
      actions.push({
        kind: 'action', key: 'secondaryAttack', name: f.name,
        params: { range: band, damage: stdDamage, dtype: damageTypeOf(f) }, review: false,
      });
      secondaryDone = true;
    } else {
      note(ctx, 'dropped', 'attackFolded', { name: f.name });
    }
  }

  for (const f of m.features) {
    const name = fold(f.name);
    if (f.attack) continue;
    if (RE.multiattack.test(name)) { note(ctx, 'info', 'multiattackFolded', { count: multiattackCount(m) }); continue; }
    if (RE.legendaryResistance.test(name) || RE.swarmTrait.test(name)) continue;
    if (RE.keenSenses.test(name)) continue;
    if (RE.ignoredTraits.test(name)) { note(ctx, 'dropped', 'featureDropped', { name: f.name }); continue; }
    if (RE.packTactics.test(name)) { passives.push({ kind: 'passive', key: 'packTactics', name: f.name, params: {}, review: false }); continue; }
    if (RE.magicResistance.test(name)) { passives.push({ kind: 'passive', key: 'spellWard', name: f.name, params: {}, review: false }); continue; }

    if (RE.spellcasting.test(name)) {
      if (!keepFlavor) { note(ctx, 'dropped', 'featureDropped', { name: f.name }); continue; }
      actions.push({ kind: 'action', key: 'spellcasting', name: f.name, params: { spells: spellList(f.text) }, cost: 'stress', review: true });
      continue;
    }

    if (f.save) {
      const save = f.save;
      const isArea = save.areaFt !== null && /cone|line|linha|radius|raio|sphere|esfera|cube|cubo|emanation|emanacao|each creature|cada criatura|all creatures|todas as criaturas/.test(fold(f.text));
      const band = rangeFromFeet(save.areaFt ?? 30);
      const total = save.damage.reduce((s, d) => s + d.average, 0);
      const big = primary ? total >= 1.5 * avg(primary) : total > 0;
      const die = big ? 12 : 8;
      const bonus = DAMAGE_BONUS[tier];
      const cost: DHFeature['cost'] = f.recharge !== null && f.recharge >= 5 ? 'fear' : 'stress';
      const conds = dhConditions(f.conditions);
      actions.push({
        kind: f.section === 'reaction' ? 'reaction' : 'action',
        key: total > 0 ? (isArea ? 'areaSave' : 'targetSave') : (isArea ? 'areaSaveEffect' : 'targetSaveEffect'),
        name: f.name,
        params: {
          range: band, trait: SAVE_TO_TRAIT[save.ability], damage: total > 0 ? dice(tier, die, bonus) : '',
          dtype: damageTypeOf(f), half: save.halfOnSuccess ? 1 : 0, conditions: conds.join(','),
          elements: elementsOf(f).join(','),
        },
        cost, review: conds.length === 0 && total === 0,
      });
      if (f.recharge !== null) note(ctx, 'info', cost === 'fear' ? 'rechargeToFear' : 'rechargeToStress', { name: f.name });
      continue;
    }

    if (!keepFlavor) { note(ctx, 'dropped', 'featureDropped', { name: f.name }); continue; }

    if (f.section === 'legendary') { note(ctx, 'dropped', 'legendaryActionDropped', { name: f.name }); continue; }

    const kind = f.section === 'reaction' ? 'reaction' : f.section === 'trait' ? 'passive' : 'action';
    const cost: DHFeature['cost'] = f.recharge !== null && f.recharge >= 5 ? 'fear'
      : f.recharge !== null || f.perDay !== null || f.section === 'bonus' ? 'stress' : null;
    const carried: DHFeature = { kind, key: 'carried', name: f.name, params: {}, sourceText: f.text, cost, review: true };
    (kind === 'passive' ? passives : kind === 'reaction' ? reactions : actions).push(carried);
    note(ctx, 'review', 'featureCarried', { name: f.name });
  }

  return [...passives, ...actions, ...reactions];
}

export function convert(m: Monster5e, opts: ConversionOptions = {}): ConversionResult {
  const notes: ConversionNote[] = [];
  const autoTier = tierFromCR(m.cr);
  const tier = opts.tier ?? autoTier;
  const ctx: Ctx = { m, tier, notes };
  const detected = detectType(m);
  const type = opts.type ?? detected.type;
  const b = BENCHMARKS[type][tier];

  note(ctx, 'info', opts.tier ? 'tierOverride' : 'tierFromCR', { cr: m.cr, tier });
  note(ctx, 'info', opts.type ? 'typeOverride' : `type.${detected.reason}`, { type });

  // Difficulty: benchmark ± AC deviation from the CR norm.
  const acDelta = clamp(Math.round((m.ac - expectedAC(m.cr)) / 2), -2, 2);
  const difficulty = b.difficulty + acDelta;
  note(ctx, 'info', 'difficulty', { ac: m.ac, expected: expectedAC(m.cr), delta: acDelta, result: difficulty });

  // HP: benchmark ± how tough this creature is for its CR.
  let hp = b.hp;
  if (type !== 'minion') {
    const ratio = m.hp / expectedHP(m.cr);
    const hpDelta = clamp(Math.round((ratio - 1) * 3), -2, 2);
    hp = b.hp + hpDelta + (m.legendaryResistance > 0 ? 1 : 0);
    const party = opts.partySize ?? 4;
    if (party > 5) hp += 1;
    if (party < 3) hp -= 1;
    hp = Math.max(3, hp);
    note(ctx, 'info', 'hp', { hp: m.hp, expected: Math.round(expectedHP(m.cr)), delta: hpDelta, result: hp });
  }

  // Stress: benchmark, +1 for spellcasters or several limited-use powers, +1 for legendary resistance.
  let stress = b.stress;
  if (type !== 'minion') {
    const limited = m.features.filter((f) => (f.recharge !== null || f.perDay !== null) && !RE.legendaryResistance.test(fold(f.name))).length;
    const caster = m.features.some((f) => RE.spellcasting.test(fold(f.name)));
    if (caster || limited >= 2) stress += 1;
    if (m.legendaryResistance > 0) stress += 1;
  }

  // Attack modifier: benchmark ± to-hit deviation from the CR norm.
  const preferRanged = type === 'ranged';
  const primary = primaryAttack(m, preferRanged);
  const hitDelta = primary?.attack ? clamp(primary.attack.toHit - expectedToHit(m.cr), -2, 2) : 0;
  const atk = b.atk + hitDelta;
  if (primary?.attack) note(ctx, 'info', 'atk', { toHit: primary.attack.toHit, expected: expectedToHit(m.cr), delta: hitDelta, result: atk });

  // Standard attack damage.
  const multi = multiattackCount(m);
  let damage: string;
  if (type === 'minion') {
    damage = String(MINION[tier].damage);
  } else {
    const bonus = DAMAGE_BONUS[tier] + (Math.min(multi, 3) - 1) * tier;
    damage = dice(tier, DAMAGE_DIE[type], bonus);
  }
  if (primary) note(ctx, 'info', 'damage', { source: primary.attack?.damage.map((d) => d.dice || d.average).join(' + ') ?? '', result: damage, multi });

  const range = primary?.attack ? rangeFromFeet(primary.attack.reachFt) : 'melee';
  if (primary?.attack) note(ctx, 'info', 'range', { ft: primary.attack.reachFt, range });

  note(ctx, 'dropped', 'abilityScoresDropped');

  const features = convertFeatures(ctx, type, primary, damage);
  const motives = (MOTIVES_BY_TYPE[m.creatureType] ?? MOTIVES_BY_TYPE.humanoid ?? []).slice(0, 4);

  const adversary: Adversary = {
    name: m.name,
    tier,
    type,
    creatureType: m.creatureType,
    motives,
    difficulty,
    major: type === 'minion' ? null : b.major,
    severe: type === 'minion' ? null : b.severe,
    hp,
    stress,
    atk,
    attackName: primary?.name ?? '',
    range,
    damage,
    damageType: damageTypeOf(primary),
    experiences: buildExperiences(m),
    features,
  };

  for (const w of m.warnings) note(ctx, 'review', `parse.${w}`);
  return { adversary, notes, detected: { tier: autoTier, type: detected.type, typeReason: detected.reason } };
}
