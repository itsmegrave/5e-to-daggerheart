/**
 * Example stat blocks from the System Reference Document 5.1 by Wizards of the Coast LLC,
 * licensed under CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/legalcode).
 * The Portuguese goblin is a translation of the same SRD entry.
 */
export interface Sample {
  id: string;
  label: { en: string; pt: string };
  text: string;
}

export const SAMPLES: Sample[] = [
  {
    id: 'goblin',
    label: { en: 'Goblin (CR 1/4)', pt: 'Goblin (ND 1/4)' },
    text: `Goblin
Small humanoid (goblinoid), neutral evil
Armor Class 15 (leather armor, shield)
Hit Points 7 (2d6)
Speed 30 ft.
STR DEX CON INT WIS CHA
8 (-1) 14 (+2) 10 (+0) 10 (+0) 8 (-1) 8 (-1)
Skills Stealth +6
Senses darkvision 60 ft., passive Perception 9
Languages Common, Goblin
Challenge 1/4 (50 XP)
Nimble Escape. The goblin can take the Disengage or Hide action as a bonus action on each of its turns.
Actions
Scimitar. Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) slashing damage.
Shortbow. Ranged Weapon Attack: +4 to hit, range 80/320 ft., one target. Hit: 5 (1d6 + 2) piercing damage.`,
  },
  {
    id: 'goblin-pt',
    label: { en: 'Goblin, in Portuguese', pt: 'Goblin, em português' },
    text: `Goblin
Humanoide (goblinoide) Pequeno, neutro e mau
Classe de Armadura 15 (armadura de couro, escudo)
Pontos de Vida 7 (2d6)
Deslocamento 9 m
FOR DES CON INT SAB CAR
8 (-1) 14 (+2) 10 (+0) 10 (+0) 8 (-1) 8 (-1)
Perícias Furtividade +6
Sentidos visão no escuro 18 m, Percepção passiva 9
Idiomas Comum, Goblin
Nível de Desafio 1/4 (50 XP)
Fuga Ágil. O goblin pode realizar a ação Desengajar ou Esconder como uma ação bônus em cada um de seus turnos.
Ações
Cimitarra. Ataque Corpo-a-Corpo com Arma: +4 para atingir, alcance 1,5 m, um alvo. Acerto: 5 (1d6 + 2) de dano cortante.
Arco Curto. Ataque à Distância com Arma: +4 para atingir, distância 24/96 m, um alvo. Acerto: 5 (1d6 + 2) de dano perfurante.`,
  },
  {
    id: 'swarm-of-rats',
    label: { en: 'Swarm of Rats (CR 1/4)', pt: 'Enxame de Ratos (ND 1/4)' },
    text: `Swarm of Rats
Medium swarm of Tiny beasts, unaligned
Armor Class 10
Hit Points 24 (7d8 - 7)
Speed 30 ft.
STR DEX CON INT WIS CHA
9 (-1) 11 (+0) 9 (-1) 2 (-4) 10 (+0) 3 (-4)
Damage Resistances bludgeoning, piercing, slashing
Condition Immunities charmed, frightened, grappled, paralyzed, petrified, prone, restrained, stunned
Senses darkvision 30 ft., passive Perception 10
Languages —
Challenge 1/4 (50 XP)
Keen Smell. The swarm has advantage on Wisdom (Perception) checks that rely on smell.
Swarm. The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny rat. The swarm can't regain hit points or gain temporary hit points.
Actions
Bites. Melee Weapon Attack: +2 to hit, reach 0 ft., one target in the swarm's space. Hit: 7 (2d6) piercing damage, or 3 (1d6) piercing damage if the swarm has half of its hit points or fewer.`,
  },
  {
    id: 'ogre',
    label: { en: 'Ogre (CR 2)', pt: 'Ogro (ND 2)' },
    text: `Ogre
Large giant, chaotic evil
Armor Class 11 (hide armor)
Hit Points 59 (7d10 + 21)
Speed 40 ft.
STR DEX CON INT WIS CHA
19 (+4) 8 (-1) 16 (+3) 5 (-3) 7 (-2) 7 (-2)
Senses darkvision 60 ft., passive Perception 8
Languages Common, Giant
Challenge 2 (450 XP)
Actions
Greatclub. Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 13 (2d8 + 4) bludgeoning damage.
Javelin. Melee or Ranged Weapon Attack: +6 to hit, reach 5 ft. or range 30/120 ft., one target. Hit: 11 (2d6 + 4) piercing damage.`,
  },
  {
    id: 'adult-red-dragon',
    label: { en: 'Adult Red Dragon (CR 17)', pt: 'Dragão Vermelho Adulto (ND 17)' },
    text: `Adult Red Dragon
Huge dragon, chaotic evil
Armor Class 19 (natural armor)
Hit Points 256 (19d12 + 133)
Speed 40 ft., climb 40 ft., fly 80 ft.
STR DEX CON INT WIS CHA
27 (+8) 10 (+0) 25 (+7) 16 (+3) 13 (+1) 21 (+5)
Saving Throws Dex +6, Con +13, Wis +7, Cha +11
Skills Perception +13, Stealth +6
Damage Immunities fire
Senses blindsight 60 ft., darkvision 120 ft., passive Perception 23
Languages Common, Draconic
Challenge 17 (18,000 XP)
Legendary Resistance (3/Day). If the dragon fails a saving throw, it can choose to succeed instead.
Actions
Multiattack. The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.
Bite. Melee Weapon Attack: +14 to hit, reach 10 ft., one target. Hit: 19 (2d10 + 8) piercing damage plus 7 (2d6) fire damage.
Claw. Melee Weapon Attack: +14 to hit, reach 5 ft., one target. Hit: 15 (2d6 + 8) slashing damage.
Tail. Melee Weapon Attack: +14 to hit, reach 15 ft., one target. Hit: 17 (2d8 + 8) bludgeoning damage.
Frightful Presence. Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.
Fire Breath (Recharge 5–6). The dragon exhales fire in a 60-foot cone. Each creature in that area must make a DC 21 Dexterity saving throw, taking 63 (18d6) fire damage on a failed save, or half as much damage on a successful one.
Legendary Actions
The dragon can take 3 legendary actions, choosing from the options below. Only one legendary action option can be used at a time and only at the end of another creature's turn. The dragon regains spent legendary actions at the start of its turn.
Detect. The dragon makes a Wisdom (Perception) check.
Tail Attack. The dragon makes a tail attack.
Wing Attack (Costs 2 Actions). The dragon beats its wings. Each creature within 10 feet of the dragon must succeed on a DC 22 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.`,
  },
];
