import type { Attack5e, DamageRoll, Feature5e, FeatureSection, SavingEffect5e } from '../types';
import {
  ABILITY_WORDS, DAMAGE_WORDS, conditionsIn, fold, signed, toFeet,
} from './lexicon';

const DICE = /(\d+)\s*\(\s*(\d+d\d+(?:\s*[+\-−–]\s*\d+)?)\s*\)/g;

function cleanDice(d: string): string {
  return d.replace(/\s+/g, '').replace(/[−–]/g, '-');
}

/** Read every "N (XdY+Z) <type>" in a stretch of text, plus flat "1 piercing damage". */
export function parseDamage(text: string): DamageRoll[] {
  const out: DamageRoll[] = [];
  const folded = fold(text);
  DICE.lastIndex = 0;
  let m: RegExpExecArray | null;
  const covered: Array<[number, number]> = [];
  while ((m = DICE.exec(text))) {
    const after = folded.slice(m.index + m[0].length, m.index + m[0].length + 30);
    const word = after.match(/^\s*(?:de\s+)?(?:dano\s+)?(?:de\s+)?([a-z-]+)/);
    const type = word && word[1] ? DAMAGE_WORDS[word[1]] ?? null : null;
    out.push({ dice: cleanDice(m[2] ?? ''), average: Number(m[1]), type });
    covered.push([m.index, m.index + m[0].length]);
  }
  if (out.length === 0) {
    // Flat damage: "Hit: 1 piercing damage." / "Acerto: 1 de dano perfurante."
    const flat = folded.match(/(\d+)\s+(?:de\s+dano\s+(?:de\s+)?)?([a-z]+)(?:\s+damage)?/);
    if (flat && flat[2] && DAMAGE_WORDS[flat[2]]) {
      out.push({ dice: '', average: Number(flat[1]), type: DAMAGE_WORDS[flat[2]] ?? null });
    }
  }
  return out;
}

function hitText(text: string): string {
  const m = text.match(/(?:Hit|Acerto)\s*:\s*([\s\S]*)/i);
  return m && m[1] ? m[1] : '';
}

export function parseAttack(text: string): Attack5e | null {
  const f = fold(text);
  const isAttack =
    /(melee|ranged)( or ranged)? (weapon |spell )?attack( roll)?\s*:/.test(f) ||
    /ataque (corpo[ -]a[ -]corpo|a distancia)( ou a distancia)?( com (arma|magia))?\s*:/.test(f) ||
    /jogada de ataque (corpo[ -]a[ -]corpo|a distancia)( ou a distancia)?\s*:/.test(f);
  if (!isAttack) return null;

  const melee = /melee|corpo[ -]a[ -]corpo/.test(f);
  const ranged = /ranged|a distancia/.test(f);
  const kind: Attack5e['kind'] = melee && ranged ? 'both' : ranged ? 'ranged' : 'melee';

  const hit = f.match(/(?:attack( roll)?|arma|magia|corpo[ -]a[ -]corpo|distancia)\s*:\s*([+-]\s*\d+)/);
  const toHit = hit && hit[2] ? signed(hit[2]) : 0;

  // Reach: "reach 10 ft." / "alcance 3 m" (no slash). Range: "range 80/320 ft." / "distância 24/96 m".
  let reachFt = 5;
  const reach = f.match(/(?:reach|alcance)\s+(\d+(?:[.,]\d+)?)\s*(ft|feet|pes|m)\b(?!\s*\/)/);
  const range = f.match(/(\d+(?:[.,]\d+)?)\s*\/\s*\d+(?:[.,]\d+)?\s*(ft|feet|pes|m)\b/);
  if (kind === 'ranged' && range && range[1] && range[2]) reachFt = toFeet(range[1], range[2]);
  else if (reach && reach[1] && reach[2]) reachFt = toFeet(reach[1], reach[2]);
  else if (range && range[1] && range[2]) reachFt = toFeet(range[1], range[2]);

  const rangeFt = range && range[1] && range[2] ? toFeet(range[1], range[2]) : null;
  return { kind, toHit, reachFt, rangeFt, damage: parseDamage(hitText(text)) };
}

export function parseSave(text: string): SavingEffect5e | null {
  const f = fold(text);
  // EN 2014: "DC 17 Dexterity saving throw"; EN 2024: "Dexterity Saving Throw: DC 17"
  // PT: "teste de resistência de Destreza CD 17", "Salvaguarda de Destreza: CD 17"
  let dc: number | null = null;
  let ability: SavingEffect5e['ability'] | null = null;
  const a =
    f.match(/(?:dc|cd)\s*(\d+)\s+(\w+)\s+saving throw/) ??
    f.match(/(\w+)\s+saving throw\s*:\s*(?:dc|cd)\s*(\d+)/);
  if (a) {
    const [n, w] = /^\d+$/.test(a[1] ?? '') ? [a[1], a[2]] : [a[2], a[1]];
    dc = Number(n);
    ability = ABILITY_WORDS[w ?? ''] ?? null;
  } else {
    const p = f.match(/(?:salvaguarda|teste de resistencia|resistencia) de (\w+)\s*:?\s*(?:com\s+)?(?:dc|cd)\s*(\d+)/) ??
      f.match(/(?:cd|dc)\s*(\d+)\s*(?:de\s+)?(?:salvaguarda|teste de resistencia) de (\w+)/);
    if (p) {
      const [w, n] = /^\d+$/.test(p[1] ?? '') ? [p[2], p[1]] : [p[1], p[2]];
      dc = Number(n);
      ability = ABILITY_WORDS[w ?? ''] ?? null;
    }
  }
  if (dc === null || ability === null) return null;

  const area = f.match(/(\d+(?:[.,]\d+)?)[- ]?(foot|feet|ft|pes|metros|m)\b[- ]?(cone|line|linha|radius|raio|sphere|esfera|cube|cubo|emanation|emanacao|area)?/);
  const areaFt = area && area[1] && area[2] ? toFeet(area[1], area[2]) : null;

  // Damage is described after "taking"/"sofrendo"/"Failure:"/"Falha:", otherwise anywhere.
  const failIdx = text.search(/taking|takes|sofrendo|sofre|Failure\s*:|Falha\s*:/i);
  const damage = parseDamage(failIdx >= 0 ? text.slice(failIdx) : text);
  const halfOnSuccess = /half as much|half damage|metade|half the damage/.test(f);
  return { dc, ability, areaFt, damage, halfOnSuccess };
}

export function parseRecharge(name: string, text: string): { recharge: number | null; perDay: number | null } {
  const s = fold(`${name} ${text.slice(0, 80)}`);
  let recharge: number | null = null;
  let perDay: number | null = null;
  const r = s.match(/\((?:recharge|recarga)\s*(\d)/);
  if (r && r[1]) recharge = Number(r[1]);
  else if (/recharges? after a (short|long)|recarrega apos um descanso/.test(s)) recharge = 7;
  const d = fold(name).match(/\((\d)\s*\/\s*(?:day|dia)/);
  if (d && d[1]) perDay = Number(d[1]);
  return { recharge, perDay };
}

/** Strip "(Recharge 5–6)", "(3/Day)", "(Costs 2 Actions)" from a feature name. */
export function cleanName(name: string): string {
  return name.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
}

export function buildFeature(rawName: string, text: string, section: FeatureSection): Feature5e {
  const { recharge, perDay } = parseRecharge(rawName, text);
  const attack = parseAttack(text);
  const save = attack ? null : parseSave(text);
  const conditions = section === 'trait' ? [] : conditionsIn(text.replace(/can'?t be \w+|immune to[^.]*|nao pode ser \w+/gi, ''));
  return { name: cleanName(rawName), text: text.trim(), section, attack, save, recharge, perDay, conditions };
}
