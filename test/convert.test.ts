import { describe, expect, it } from 'vitest';
import { convert } from '../src/core/convert';
import { parseInput } from '../src/core/parse';
import { noteText, renderAdversary, toMarkdown } from '../src/core/render';
import { SAMPLES } from '../src/core/samples';

const sample = (id: string) => {
  const s = SAMPLES.find((x) => x.id === id);
  if (!s) throw new Error(id);
  return parseInput(s.text)[0]!;
};

describe('text parser', () => {
  it('reads an English 2014 stat block', () => {
    const m = sample('goblin');
    expect(m).toMatchObject({ name: 'Goblin', size: 'small', creatureType: 'humanoid', ac: 15, hp: 7, cr: 0.25 });
    expect(m.abilities).toEqual({ str: 8, dex: 14, con: 10, int: 10, wis: 8, cha: 8 });
    expect(m.skills.stealth).toBe(6);
    const scimitar = m.features.find((f) => f.name === 'Scimitar')!;
    expect(scimitar.attack).toMatchObject({ kind: 'melee', toHit: 4, reachFt: 5 });
    expect(scimitar.attack!.damage).toEqual([{ dice: '1d6+2', average: 5, type: 'slashing' }]);
    const bow = m.features.find((f) => f.name === 'Shortbow')!;
    expect(bow.attack).toMatchObject({ kind: 'ranged', reachFt: 80 });
  });

  it('reads the same goblin in Portuguese', () => {
    const en = sample('goblin');
    const pt = sample('goblin-pt');
    expect(pt.sourceLang).toBe('pt');
    expect(pt).toMatchObject({ ac: en.ac, hp: en.hp, cr: en.cr, size: 'small', creatureType: 'humanoid' });
    expect(pt.abilities).toEqual(en.abilities);
    expect(pt.skills.stealth).toBe(6);
    const scimitar = pt.features.find((f) => f.name === 'Cimitarra')!;
    expect(scimitar.attack).toMatchObject({ kind: 'melee', toHit: 4, reachFt: 5 });
    expect(scimitar.attack!.damage[0]).toMatchObject({ dice: '1d6+2', type: 'slashing' });
    const bow = pt.features.find((f) => f.name === 'Arco Curto')!;
    expect(bow.attack).toMatchObject({ kind: 'ranged', reachFt: 80 });
  });

  it('reads a 2024 layout in Portuguese', () => {
    const [m] = parseInput(`Guerreiro Goblin
Fada Pequena (Goblinoide), Caótico e Neutro
CA 15 Iniciativa +2 (12)
PV 10 (3d6)
Deslocamento 9 m
For 8 −1 −1 Des 15 +2 +2 Con 10 +0 +0
Int 10 +0 +0 Sab 8 −1 −1 Car 8 −1 −1
Perícias Furtividade +6
Sentidos Visão no Escuro 18 m; Percepção Passiva 9
Idiomas Comum, Goblin
ND 1/4 (XP 50; BP +2)
Ações
Cimitarra. Jogada de Ataque Corpo a Corpo: +4, alcance 1,5 m. Acerto: 5 (1d6 + 2) de dano Cortante, mais 2 (1d4) de dano Cortante se o ataque tiver Vantagem.`);
    expect(m).toMatchObject({ ac: 15, hp: 10, cr: 0.25, size: 'small', creatureType: 'fey' });
    expect(m!.abilities.dex).toBe(15);
    const a = m!.features[0]!;
    expect(a.attack).toMatchObject({ kind: 'melee', toHit: 4, reachFt: 5 });
  });

  it('reads an English 2024 layout with saving-throw actions', () => {
    const [m] = parseInput(`Ogre Zombie
Large Undead, Neutral Evil
AC 8 Initiative −2 (8)
HP 85 (9d10 + 36)
Speed 30 ft.
Str 19 +4 +4 Dex 6 −2 −2 Con 18 +4 +4
Int 3 −4 −4 Wis 6 −2 +0 Cha 5 −3 −3
Immunities Poison; Exhaustion, Poisoned
Senses Darkvision 60 ft.; Passive Perception 8
Languages Understands Common and Giant but can't speak
CR 2 (XP 450; PB +2)
Traits
Undead Fortitude. If damage reduces the zombie to 0 Hit Points, it makes a Constitution saving throw (DC 5 plus the damage taken) unless the damage is Radiant or from a Critical Hit.
Actions
Slam. Melee Attack Roll: +6, reach 5 ft. Hit: 13 (2d8 + 4) Bludgeoning damage.`);
    expect(m).toMatchObject({ ac: 8, hp: 85, cr: 2, size: 'large', creatureType: 'undead' });
    expect(m!.immunities).toEqual(['poison']);
    expect(m!.conditionImmunities).toEqual(expect.arrayContaining(['exhaustion', 'poisoned']));
    expect(m!.saves.wis).toBe(0);
    const slam = m!.features.find((f) => f.name === 'Slam')!;
    expect(slam.attack).toMatchObject({ kind: 'melee', toHit: 6 });
  });

  it('reads legendary data and recharge', () => {
    const m = sample('adult-red-dragon');
    expect(m.legendaryActionCount).toBe(3);
    expect(m.legendaryResistance).toBe(3);
    const breath = m.features.find((f) => f.name === 'Fire Breath')!;
    expect(breath.recharge).toBe(5);
    expect(breath.save).toMatchObject({ dc: 21, ability: 'dex', areaFt: 60, halfOnSuccess: true });
    expect(breath.save!.damage[0]).toMatchObject({ average: 63, type: 'fire' });
    const wing = m.features.find((f) => f.name === 'Wing Attack')!;
    expect(wing.section).toBe('legendary');
    expect(wing.conditions).toContain('prone');
  });
});

describe('JSON importers', () => {
  it('reads 5etools JSON (2024 tags)', () => {
    const json = JSON.stringify({
      name: 'Goblin Warrior', size: ['S'], type: { type: 'fey', tags: ['goblinoid'] },
      ac: [{ ac: 15, from: ['leather armor', 'shield'] }], hp: { average: 10, formula: '3d6' },
      speed: { walk: 30 }, str: 8, dex: 15, con: 10, int: 10, wis: 8, cha: 8,
      skill: { stealth: '+6' }, cr: '1/4',
      action: [{ name: 'Scimitar', entries: ['{@atkr m} {@hit 4}, reach 5 ft. {@h}5 ({@damage 1d6 + 2}) Slashing damage.'] }],
      bonus: [{ name: 'Nimble Escape', entries: ['The goblin takes the Disengage or Hide action.'] }],
    });
    const [m] = parseInput(json);
    expect(m).toMatchObject({ name: 'Goblin Warrior', ac: 15, hp: 10, cr: 0.25, creatureType: 'fey' });
    expect(m!.features[0]!.attack).toMatchObject({ kind: 'melee', toHit: 4, reachFt: 5 });
    expect(m!.features[0]!.attack!.damage[0]).toMatchObject({ dice: '1d6+2', type: 'slashing' });
  });

  it('reads a 5etools bestiary file with several creatures', () => {
    const json = JSON.stringify({ monster: [
      { name: 'A', ac: [12], hp: { average: 20 }, cr: '1', str: 10, action: [] },
      { name: 'B', ac: [14], hp: { average: 40 }, cr: { cr: '3' }, str: 10, action: [] },
    ] });
    const ms = parseInput(json);
    expect(ms.map((m) => [m.name, m.cr])).toEqual([['A', 1], ['B', 3]]);
  });

  it('reads Open5e JSON', () => {
    const json = JSON.stringify({
      name: 'Wolf', size: 'Medium', type: 'beast', armor_class: 13, hit_points: 11,
      speed: { walk: 40 }, strength: 12, dexterity: 15, constitution: 12, intelligence: 3, wisdom: 12, charisma: 6,
      skills: { perception: 3, stealth: 4 }, challenge_rating: '1/4', cr: 0.25,
      damage_resistances: '', damage_immunities: '', condition_immunities: '',
      special_abilities: [{ name: 'Pack Tactics', desc: "The wolf has advantage on an attack roll against a creature if at least one of the wolf's allies is within 5 ft. of the creature and the ally isn't incapacitated." }],
      actions: [{ name: 'Bite', desc: "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (2d4 + 2) piercing damage. If the target is a creature, it must succeed on a DC 11 Strength saving throw or be knocked prone." }],
    });
    const [m] = parseInput(json);
    expect(m).toMatchObject({ name: 'Wolf', ac: 13, hp: 11, cr: 0.25, creatureType: 'beast' });
    expect(m!.features.find((f) => f.name === 'Bite')!.conditions).toContain('prone');
  });

  it('rejects JSON it does not recognize', () => {
    expect(() => parseInput('{"foo": 1}')).toThrow('unrecognizedJson');
  });
});

describe('conversion', () => {
  it('goblin → Tier 1 Minion with SRD minion values', () => {
    const { adversary: a } = convert(sample('goblin'));
    expect(a).toMatchObject({ tier: 1, type: 'minion', hp: 1, stress: 1, major: null, severe: null, damage: '2' });
    expect(a.features.map((f) => f.key)).toEqual(['minion', 'groupAttack']);
    expect(a.features[0]!.params.x).toBe(4);
  });

  it('goblin forced to Skulk keeps the 5e flavor', () => {
    const { adversary: a } = convert(sample('goblin'), { type: 'skulk' });
    expect(a).toMatchObject({ tier: 1, type: 'skulk', difficulty: 13, range: 'melee', damage: '1d8+2' });
    expect(a.experiences).toEqual([{ key: 'stealth', value: 2 }]);
    expect(a.features.find((f) => f.key === 'secondaryAttack')?.params.range).toBe('far');
  });

  it('English and Portuguese sources convert to the same adversary', () => {
    const en = convert(sample('goblin'), { type: 'standard' }).adversary;
    const pt = convert(sample('goblin-pt'), { type: 'standard' }).adversary;
    expect({ ...pt, name: '', attackName: '', features: pt.features.map((f) => ({ ...f, name: '', sourceText: '' })) })
      .toEqual({ ...en, name: '', attackName: '', features: en.features.map((f) => ({ ...f, name: '', sourceText: '' })) });
  });

  it('swarm of rats → Horde with physical resistance', () => {
    const { adversary: a } = convert(sample('swarm-of-rats'));
    expect(a.type).toBe('horde');
    expect(a.features.map((f) => f.key)).toEqual(['horde', 'physicalResistance']);
  });

  it('ogre → Tier 1 Bruiser with a ranged javelin', () => {
    const { adversary: a } = convert(sample('ogre'));
    expect(a).toMatchObject({ tier: 1, type: 'bruiser', range: 'melee', damage: '1d10+2', damageType: 'phy' });
    expect(a.major).toBe(8);
    expect(a.features.find((f) => f.key === 'secondaryAttack')).toMatchObject({ name: 'Javelin', params: { range: 'close' } });
  });

  it('adult red dragon → Tier 4 Solo with Relentless and a Fear breath', () => {
    const { adversary: a, notes } = convert(sample('adult-red-dragon'));
    expect(a).toMatchObject({ tier: 4, type: 'solo', range: 'veryClose' });
    const keys = a.features.map((f) => f.key);
    expect(keys).toContain('relentless');
    expect(keys).toContain('elementImmunity');
    const breath = a.features.find((f) => f.name === 'Fire Breath')!;
    expect(breath).toMatchObject({ key: 'areaSave', cost: 'fear', params: { range: 'far', trait: 'agility', dtype: 'mag', half: 1 } });
    const presence = a.features.find((f) => f.name === 'Frightful Presence')!;
    expect(presence).toMatchObject({ key: 'areaSaveEffect', cost: 'stress', params: { trait: 'instinct', conditions: 'stress' } });
    expect(a.features.find((f) => f.name === 'Wing Attack')?.params.conditions).toBe('vulnerable');
    expect(notes.some((n) => n.key === 'legendaryResistance')).toBe(true);
    // Passives first, then actions, then reactions (Homebrew Kit ordering).
    const order = a.features.map((f) => ({ passive: 0, action: 1, reaction: 2 })[f.kind]);
    expect([...order].sort()).toEqual(order);
  });

  it('respects tier and party-size overrides', () => {
    const base = convert(sample('ogre')).adversary;
    const big = convert(sample('ogre'), { tier: 2, partySize: 6 }).adversary;
    expect(big.tier).toBe(2);
    expect(big.difficulty).toBeGreaterThan(base.difficulty);
    expect(big.hp).toBe(base.hp + 1);
  });

  it('stays inside the SRD benchmark bands for every sample and type', () => {
    const types = ['bruiser', 'horde', 'leader', 'minion', 'ranged', 'skulk', 'social', 'solo', 'standard', 'support'] as const;
    for (const s of SAMPLES) {
      for (const type of types) {
        const { adversary: a } = convert(parseInput(s.text)[0]!, { type });
        expect(a.difficulty).toBeGreaterThanOrEqual(8);
        expect(a.difficulty).toBeLessThanOrEqual(22);
        expect(a.hp).toBeGreaterThanOrEqual(1);
        expect(a.hp).toBeLessThanOrEqual(13);
        if (type !== 'minion') expect(a.damage).toMatch(new RegExp(`^${a.tier}d\\d+`));
      }
    }
  });
});

describe('rendering', () => {
  it('renders English and Portuguese stat blocks with each SRD term', () => {
    const { adversary: a } = convert(sample('ogre'));
    const en = renderAdversary(a, 'en');
    expect(en.subtitle).toBe('Tier 1 Bruiser');
    expect(en.stats.map(([k]) => k)).toEqual(['Difficulty', 'Thresholds', 'HP', 'Stress']);
    expect(en.attack).toMatch(/^ATK: \+\d \| Greatclub: Melee \| 1d10\+2 phy$/);
    const pt = renderAdversary(a, 'pt');
    expect(pt.subtitle).toBe('Nível 1 Brutamontes');
    expect(pt.stats.map(([k]) => k)).toEqual(['Dificuldade', 'Limiares', 'PV', 'Fadiga']);
    expect(pt.attack).toMatch(/^ATQ: \+\d \| Greatclub: Corpo a Corpo \| 1d10\+2 fís$/);
    expect(pt.features.find((f) => f.title === 'Javelin')!.text).toContain('dentro do alcance Perto');
  });

  it('writes Markdown and has a note text for every note key', () => {
    for (const s of SAMPLES) {
      const r = convert(parseInput(s.text)[0]!);
      expect(toMarkdown(r.adversary, 'pt')).toContain(`# ${r.adversary.name}`);
      for (const n of r.notes) {
        expect(noteText(n, 'en')).not.toBe(n.key);
        expect(noteText(n, 'pt')).not.toBe(n.key);
      }
    }
  });

  it('every generated feature has a template in both languages', () => {
    for (const s of SAMPLES) {
      for (const type of ['solo', 'standard', 'minion', 'horde'] as const) {
        const { adversary: a } = convert(parseInput(s.text)[0]!, { type });
        for (const lang of ['en', 'pt'] as const) {
          for (const f of renderAdversary(a, lang).features) {
            expect(f.text.length).toBeGreaterThan(10);
            expect(f.text).not.toMatch(/undefined|NaN|\{|\}/);
          }
        }
      }
    }
  });
});

describe('regressions', () => {
  it('does not add a shorter-range attack as a second attack', () => {
    const { adversary: a } = convert(sample('adult-red-dragon'));
    expect(a.features.some((f) => f.key === 'secondaryAttack')).toBe(false);
  });

  it('does not count Legendary Resistance as a limited-use power for Stress', () => {
    const { adversary: a } = convert(sample('adult-red-dragon'));
    // Solo T4 benchmark 6, +1 for Legendary Resistance; one Recharge power is not enough for the +1.
    expect(a.stress).toBe(7);
  });

  it('uses correct articles and agreement', () => {
    const { adversary: a } = convert(sample('adult-red-dragon'));
    const en = renderAdversary(a, 'en').features.map((f) => f.text).join(' ');
    expect(en).toContain('an Instinct Reaction Roll');
    expect(en).toContain('an Agility Reaction Roll');
    expect(en).not.toMatch(/\ba (Agility|Instinct)\b/);
    const pt = renderAdversary(a, 'pt').features.map((f) => f.text).join(' ');
    expect(pt).toContain('Os que falharem devem marcar 1 Fadiga');
    expect(pt).not.toContain('Quem falhar');
  });

  it('uses comma decimals for meters in Portuguese notes', () => {
    const r = convert(sample('ogre'));
    const range = r.notes.find((n) => n.key === 'range')!;
    expect(noteText(range, 'pt')).toBe('5 pés (1,5 m) → Corpo a Corpo.');
  });
});
