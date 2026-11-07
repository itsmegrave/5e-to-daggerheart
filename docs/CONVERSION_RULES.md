# 5e → Daggerheart conversion rules

*[Leia em português](REGRAS_DE_CONVERSAO.md)*

There is no official rule for converting D&D 5e creatures to Daggerheart. This converter builds every adversary from the official Daggerheart design guidance and then nudges it with the 5e creature's own numbers. Each converted adversary comes with notes that say which rule produced each value.

## Sources

| Source | What it gives us |
|---|---|
| Daggerheart SRD, *Using Adversaries* | Stat block layout, the ten adversary types, feature kinds (Action, Reaction, Passive), Minion (X), Horde (X), Relentless (X), Battle Points, and the tier benchmark table (ATK +1/+2/+3/+4, Difficulty 11/14/17/20, thresholds 7/12, 10/20, 20/32, 25/45). |
| Daggerheart Homebrew Kit v1.0 | HP ranges (1, 2, 3, 4–6, 7–9, 10+), damage die by type, "number of damage dice = tier", which types run higher or lower on ATK, feature order (passives, actions, reactions) and "Fear costs are for the most powerful features". |
| The 129 SRD adversaries | Medians of Difficulty, HP, Stress, ATK and thresholds for each type and tier (table below). |
| D&D 5e SRD 5.1 / 5.2 and the DMG | Typical AC, attack bonus and HP for each Challenge Rating, used to decide whether a creature is above or below its CR norm. |

## 1. Tier

Daggerheart tiers cover PC levels 1, 2–4, 5–7 and 8–10. A Daggerheart level is roughly half a 5e level, so:

| Challenge Rating | Tier |
|---|---|
| 0 – 2 | 1 |
| 3 – 8 | 2 |
| 9 – 14 | 3 |
| 15+ | 4 |

The tier can always be set by hand.

## 2. Type

Checked in this order; the first match wins. The type can always be set by hand.

1. **Solo**: has Legendary Actions; or is Huge or larger with CR 3+; or is a dragon of Large size or bigger (the SRD builds its dragons as Solos).
2. **Horde**: is a swarm.
3. **Minion**: CR 1/4 or lower and 12 HP or fewer.
4. **Leader**: commands, rallies or summons allies (Leadership, summon, call reinforcements…).
5. **Support**: heals or buffs (Cure Wounds, Healing Word, Bless…) and its best attack averages 8 damage or less.
6. **Social**: no attacks, or a weak attack (≤ 4 average) with a strong mental score (14+) and Persuasion or Deception.
7. **Ranged**: its best attack is ranged with a normal range of 60 ft. or more.
8. **Skulk**: Sneak Attack, Nimble Escape, Cunning Action, ambush or shadow stealth features, or Stealth +6 or better.
9. **Bruiser**: Strength 18+ and Large or larger, or HP at least 20% above its CR norm.
10. **Standard**: everything else.

## 3. Base numbers by type and tier

Medians of the SRD adversaries of that type and tier. Values marked * have one or no SRD example and were interpolated from the neighboring tiers and the SRD tier benchmark.

| Type | Tier | Difficulty | HP | Stress | ATK | Major / Severe |
|---|---|---|---|---|---|---|
| Bruiser | 1 / 2 / 3 / 4 | 13 / 15 / 17 / 20 | 7 / 7 / 7 / 8 | 3 / 4 / 4 / 5 | +1 / +2 / +3 / +4 | 8/15 · 14/28 · 22/40 · 37/70 |
| Horde | 1 / 2 / 3* / 4 | 11 / 14 / 16 / 17 | 6 / 5 / 6 / 8 | 3 / 3 / 4 / 5 | 0 / 0 / +1 / +2 | 6/11 · 10/20 · 18/33 · 25/45 |
| Leader | 1 / 2 / 3 / 4 | 14 / 16 / 17 / 20 | 6 / 6 / 7 / 8 | 3 / 4 / 5 / 6 | +3 / +3 / +4 / +6 | 7/14 · 13/26 · 22/38 · 35/68 |
| Minion | 1 / 2 / 3 / 4 | 10 / 13 / 15 / 18 | 1 | 1 | −2 / 0 / 0 / +2 | none |
| Ranged | 1 / 2 / 3 / 4* | 11 / 14 / 16 / 19 | 3 / 5 / 5 / 4 | 2 / 3 / 4 / 3 | +1 / +3 / +4 / +5 | 4/7 · 8/16 · 18/31 · 25/45 |
| Skulk | 1 / 2 / 3 / 4* | 12 / 14 / 15 / 18 | 3 / 4 / 5 / 5 | 2 / 3 / 4 / 4 | +1 / +2 / +3 / +4 | 5/9 · 8/17 · 16/30 · 26/45 |
| Social | 1 / 2 / 3* / 4* | 12 / 14 / 16 / 18 | 3 / 3 / 5 / 5 | 3 / 3 / 4 / 5 | −3 / −2 / 0 / +1 | 4/8 · 8/16 · 16/32 · 24/45 |
| Solo | 1 / 2 / 3 / 4 | 13 / 15 / 18 / 20 | 8 / 9 / 10 / 10 | 3 / 5 / 6 / 6 | +3 / +3 / +4 / +7 | 8/15 · 13/25 · 20/35 · 35/65 |
| Standard | 1 / 2 / 3 / 4* | 12 / 14 / 16 / 19 | 4 / 4 / 5 / 6 | 2 / 3 / 4 / 4 | +1 / +1 / +3 / +4 | 5/9 · 9/18 · 18/35 · 26/48 |
| Support | 1* / 2* / 3 / 4 | 13 / 14 / 17 / 19 | 4 / 4 / 5 / 5 | 4 / 5 / 5 / 5 | +1 / +2 / +2 / +4 | 5/9 · 9/18 · 17/33 · 26/45 |

## 4. Adjusting from the 5e creature

The base numbers are then moved by how the creature compares with a typical monster of its CR. Each adjustment is capped at ±2 so the result stays inside the SRD band for its type.

| Value | Rule |
|---|---|
| **Difficulty** | base + (AC − typical AC for the CR) ÷ 2, rounded, capped ±2. Typical AC: 13 (CR ≤ 3), 14 (4), 15 (5–7), 16 (8–9), 17 (10–12), 18 (13–16), 19 (17+). |
| **HP** | base + (5e HP ÷ typical HP − 1) × 3, rounded, capped ±2; +1 with Legendary Resistance; +1 for parties of 6+, −1 for parties of 1–2 (Homebrew Kit). Never below 3 (except Minions, always 1). Typical HP: 3 (CR 0), 8 (1/8), 11 (1/4), 18 (1/2), otherwise 15 × CR + 15, which matches the SRD bestiary better than the DMG table. |
| **Stress** | base; +1 for spellcasters or creatures with two or more Recharge or X/Day powers; +1 with Legendary Resistance. |
| **ATK** | base + (best attack's to-hit − typical to-hit for the CR), capped ±2. Typical to-hit: +3 (CR ≤ 2), +4 (3), +5 (4), +6 (5–7), +7 (8–10), +8 (11–15), +9 (16), +10 (17–20), +11 (21+). |
| **Thresholds** | the base values. Minions have none. |

## 5. Standard attack

- **Which attack**: the attack with the highest average damage (for Ranged adversaries, the best ranged attack).
- **Damage dice**: number of dice = tier; die by type (Homebrew Kit): Solo d12, Bruiser/Leader/Ranged d10, Standard/Skulk/Horde d8, Support d6, Social d4. Flat bonus by tier: +2, +3, +3, +10 (keeps the average in the SRD band of 1d6+2…1d12+4, 2d6+3…2d12+4, 3d8+3…3d12+5, 4d8+10…4d12+15). Multiattack adds +tier per extra attack, up to two extra.
- **Minions** deal flat damage: 2 / 5 / 7 / 11 by tier (SRD medians).
- **Damage type**: bludgeoning, piercing, slashing, acid and poison → physical (phy); fire, cold, lightning, thunder, force, necrotic, radiant and psychic → magic (mag). Mixed damage uses whichever part is larger.
- **Range**: reach or normal range in feet → Melee (≤ 5 ft.), Very Close (≤ 15), Close (≤ 30), Far (≤ 120), Very Far (beyond). Portuguese books use meters: 1.5 m = 5 ft.

## 6. Features

Order follows the Homebrew Kit: passives, then actions, then reactions.

| 5e | Daggerheart |
|---|---|
| Minion type | **Minion (X)** passive with X = 4 / 6 / 8 / 12, and **Group Attack** (spend a Fear), both as in the SRD. |
| Swarm | **Horde (X)** passive with X = 1d4+2 / 2d4+1 / 2d6+3 / 2d6+5. |
| Legendary Actions | **Relentless (2)** at tiers 1–2, **Relentless (3)** at tiers 3–4. Legendary options that only attack or detect are covered by it; options with a saving throw become actions that cost a Stress. |
| Legendary Resistance | No adversary ever makes a saving throw, so it becomes +1 HP and +1 Stress. |
| Multiattack | Folded into the standard attack's damage. |
| Other attacks | An attack that reaches farther than the standard attack (a thrown javelin, a shortbow) becomes an action with the standard damage. Others are folded in. |
| Saving-throw powers (breath weapons, auras…) | An action asking for a **Reaction Roll**: STR/CON → Strength, DEX → Agility, INT → Knowledge, WIS → Instinct, CHA → Presence. Area powers hit "all targets within" the range of the area. Damage uses tier × d8, or tier × d12 when the 5e damage is at least 1.5× the standard attack, plus the tier bonus. "Half on a success" is kept. |
| Recharge 5–6 or rarer | Costs a **Fear**. |
| Recharge 4–6, X/Day, bonus actions | Cost a **Stress**. |
| Conditions inflicted | Grappled/restrained → **Restrained**; prone, blinded, poisoned, deafened, exhaustion → **Vulnerable**; paralyzed, stunned, petrified, unconscious, incapacitated → **Restrained** and **Vulnerable**; frightened, charmed → **mark a Stress**. |
| Resistance (or nonmagical immunity) to two or more of bludgeoning/piercing/slashing | Passive: resistant to physical damage. True immunity to physical damage also becomes resistance (flagged for review). |
| Resistance or immunity to four or more magic damage types | **Arcane Form**: resistant to magic damage (SRD example feature). |
| Fewer magic resistances or immunities | Passive naming the element (flagged for review). |
| Vulnerability | Passive: marks an additional HP from that element (flagged for review). |
| Immunity to grappled/restrained/paralyzed | Passive: can't be Restrained. Other condition immunities have no Daggerheart condition and are dropped. |
| Pack Tactics | Passive: advantage against a target within Melee range of another adversary. |
| Magic Resistance | Passive: +2 Difficulty against Spellcast Rolls. |
| Spellcasting | Action: mark a Stress to cast one of the listed spells, run as a Daggerheart action (flagged for review). |
| Keen Senses traits, high skills | **Experiences** (SRD list): the two highest skills of +4 or more map to Stealth, Keen Senses, Tracker, Intimidation, Socialite, Acrobatics, Magical Knowledge, Nobility, Blademaster, Nature's Friend or Intrusion; +3 when the skill is +8 or more, otherwise +2. |
| Anything else | Carried over with its 5e text and flagged **Review** so the GM can rewrite it. Minions and Hordes drop these instead, since they should have the fewest features. |

Ability scores, saving throws, speed, senses and languages have no Daggerheart field. Describe them in the fiction.

## 7. Motives & Tactics

Starting suggestions by creature type (for example, beasts: hunt, defend territory, feed, flee when hurt). Edit them to fit the scene.

## Terminology

English output uses the Daggerheart SRD terms. Portuguese output uses the vocabulary of the Daggerheart edition published in Brazil (Fadiga, Limiares, Lacaio, Implacável, Contido, Vulnerável, Rolagem de Reação…). All terms live in `src/i18n/`, so a table that prefers other words can change them in one place.
