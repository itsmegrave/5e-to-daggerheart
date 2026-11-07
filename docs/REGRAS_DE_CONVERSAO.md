# Regras de conversão 5e → Daggerheart

*[Read in English](CONVERSION_RULES.md)*

Não existe regra oficial para converter criaturas de D&D 5e para Daggerheart. Este conversor monta cada adversário a partir das orientações oficiais de design de Daggerheart e depois o ajusta com os números da própria criatura de 5e. Cada conversão vem com notas que dizem qual regra gerou cada valor.

## Fontes

| Fonte | O que ela fornece |
|---|---|
| SRD de Daggerheart, *Usando Adversários* | Formato da ficha, os dez tipos de adversário, tipos de característica (Ação, Reação, Passiva), Lacaio (X), Horda (X), Implacável (X), Pontos de Batalha e a tabela de referência por nível (ATQ +1/+2/+3/+4, Dificuldade 11/14/17/20, limiares 7/12, 10/20, 20/32, 25/45). |
| Kit de Homebrew de Daggerheart v1.0 | Faixas de PV (1, 2, 3, 4–6, 7–9, 10+), dado de dano por tipo, "quantidade de dados de dano = nível", quais tipos têm ATQ maior ou menor, ordem das características (passivas, ações, reações) e "custos em Medo ficam para as características mais poderosas". |
| Os 129 adversários do SRD | Medianas de Dificuldade, PV, Fadiga, ATQ e limiares por tipo e nível (tabela abaixo). |
| SRD 5.1 / 5.2 de D&D 5e e o Guia do Mestre | CA, bônus de ataque e PV típicos para cada Nível de Desafio, usados para decidir se a criatura está acima ou abaixo do normal para o ND. |

## 1. Nível (Tier)

Os níveis de Daggerheart cobrem PJs de nível 1, 2–4, 5–7 e 8–10. Um nível de Daggerheart equivale a cerca de metade de um nível de 5e, então:

| Nível de Desafio | Nível |
|---|---|
| 0 – 2 | 1 |
| 3 – 8 | 2 |
| 9 – 14 | 3 |
| 15+ | 4 |

O nível pode sempre ser escolhido manualmente.

## 2. Tipo

Verificado nesta ordem; vale o primeiro que se aplicar. O tipo pode sempre ser escolhido manualmente.

1. **Solo**: tem Ações Lendárias; ou é Enorme ou maior com ND 3+; ou é um dragão Grande ou maior (o SRD monta seus dragões como Solos).
2. **Horda**: é um enxame.
3. **Lacaio**: ND 1/4 ou menor e até 12 PV.
4. **Líder**: comanda, reúne ou invoca aliados (Liderança, invocar, chamar reforços…).
5. **Suporte**: cura ou fortalece (Curar Ferimentos, Palavra Curativa, Bênção…) e seu melhor ataque causa em média até 8 de dano.
6. **Social**: sem ataques, ou com ataque fraco (média ≤ 4), atributo mental alto (14+) e Persuasão ou Enganação.
7. **À Distância**: seu melhor ataque é à distância, com alcance normal de 18 m (60 pés) ou mais.
8. **Furtivo**: Ataque Furtivo, Fuga Ágil, Ação Ardilosa, emboscada ou furtividade sombria, ou Furtividade +6 ou mais.
9. **Brutamontes**: Força 18+ e tamanho Grande ou maior, ou PV pelo menos 20% acima do normal para o ND.
10. **Padrão**: todo o resto.

## 3. Números-base por tipo e nível

Medianas dos adversários do SRD daquele tipo e nível. Valores com * têm um ou nenhum exemplo no SRD e foram interpolados a partir dos níveis vizinhos e da tabela de referência do SRD.

| Tipo | Nível | Dificuldade | PV | Fadiga | ATQ | Maior / Severo |
|---|---|---|---|---|---|---|
| Brutamontes | 1 / 2 / 3 / 4 | 13 / 15 / 17 / 20 | 7 / 7 / 7 / 8 | 3 / 4 / 4 / 5 | +1 / +2 / +3 / +4 | 8/15 · 14/28 · 22/40 · 37/70 |
| Horda | 1 / 2 / 3* / 4 | 11 / 14 / 16 / 17 | 6 / 5 / 6 / 8 | 3 / 3 / 4 / 5 | 0 / 0 / +1 / +2 | 6/11 · 10/20 · 18/33 · 25/45 |
| Líder | 1 / 2 / 3 / 4 | 14 / 16 / 17 / 20 | 6 / 6 / 7 / 8 | 3 / 4 / 5 / 6 | +3 / +3 / +4 / +6 | 7/14 · 13/26 · 22/38 · 35/68 |
| Lacaio | 1 / 2 / 3 / 4 | 10 / 13 / 15 / 18 | 1 | 1 | −2 / 0 / 0 / +2 | nenhum |
| À Distância | 1 / 2 / 3 / 4* | 11 / 14 / 16 / 19 | 3 / 5 / 5 / 4 | 2 / 3 / 4 / 3 | +1 / +3 / +4 / +5 | 4/7 · 8/16 · 18/31 · 25/45 |
| Furtivo | 1 / 2 / 3 / 4* | 12 / 14 / 15 / 18 | 3 / 4 / 5 / 5 | 2 / 3 / 4 / 4 | +1 / +2 / +3 / +4 | 5/9 · 8/17 · 16/30 · 26/45 |
| Social | 1 / 2 / 3* / 4* | 12 / 14 / 16 / 18 | 3 / 3 / 5 / 5 | 3 / 3 / 4 / 5 | −3 / −2 / 0 / +1 | 4/8 · 8/16 · 16/32 · 24/45 |
| Solo | 1 / 2 / 3 / 4 | 13 / 15 / 18 / 20 | 8 / 9 / 10 / 10 | 3 / 5 / 6 / 6 | +3 / +3 / +4 / +7 | 8/15 · 13/25 · 20/35 · 35/65 |
| Padrão | 1 / 2 / 3 / 4* | 12 / 14 / 16 / 19 | 4 / 4 / 5 / 6 | 2 / 3 / 4 / 4 | +1 / +1 / +3 / +4 | 5/9 · 9/18 · 18/35 · 26/48 |
| Suporte | 1* / 2* / 3 / 4 | 13 / 14 / 17 / 19 | 4 / 4 / 5 / 5 | 4 / 5 / 5 / 5 | +1 / +2 / +2 / +4 | 5/9 · 9/18 · 17/33 · 26/45 |

## 4. Ajustes a partir da criatura de 5e

Os números-base são deslocados conforme a criatura se compara a um monstro típico do seu ND. Cada ajuste é limitado a ±2, para o resultado ficar dentro da faixa do SRD para o tipo.

| Valor | Regra |
|---|---|
| **Dificuldade** | base + (CA − CA típica do ND) ÷ 2, arredondado, limitado a ±2. CA típica: 13 (ND ≤ 3), 14 (4), 15 (5–7), 16 (8–9), 17 (10–12), 18 (13–16), 19 (17+). |
| **PV** | base + (PV em 5e ÷ PV típico − 1) × 3, arredondado, limitado a ±2; +1 com Resistência Lendária; +1 para grupos de 6+, −1 para grupos de 1–2 (Kit de Homebrew). Nunca abaixo de 3 (exceto Lacaios, sempre 1). PV típico: 3 (ND 0), 8 (1/8), 11 (1/4), 18 (1/2), senão 15 × ND + 15, que acompanha melhor o bestiário do SRD do que a tabela do Guia do Mestre. |
| **Fadiga** | base; +1 para conjuradores ou criaturas com dois ou mais poderes de Recarga ou X/Dia; +1 com Resistência Lendária. |
| **ATQ** | base + (bônus para atingir do melhor ataque − bônus típico do ND), limitado a ±2. Bônus típico: +3 (ND ≤ 2), +4 (3), +5 (4), +6 (5–7), +7 (8–10), +8 (11–15), +9 (16), +10 (17–20), +11 (21+). |
| **Limiares** | os valores-base. Lacaios não têm. |

## 5. Ataque padrão

- **Qual ataque**: o de maior dano médio (para adversários À Distância, o melhor ataque à distância).
- **Dados de dano**: quantidade de dados = nível; dado por tipo (Kit de Homebrew): Solo d12, Brutamontes/Líder/À Distância d10, Padrão/Furtivo/Horda d8, Suporte d6, Social d4. Bônus fixo por nível: +2, +3, +3, +10 (mantém a média dentro da faixa do SRD: 1d6+2…1d12+4, 2d6+3…2d12+4, 3d8+3…3d12+5, 4d8+10…4d12+15). Ataques Múltiplos somam +nível por ataque extra, até dois extras.
- **Lacaios** causam dano fixo: 2 / 5 / 7 / 11 por nível (medianas do SRD).
- **Tipo de dano**: contundente, perfurante, cortante, ácido e veneno → físico (fís); fogo, frio, elétrico, trovejante, energia, necrótico, radiante e psíquico → mágico (mág). Dano misto usa a maior parte.
- **Alcance**: alcance ou distância normal → Corpo a Corpo (≤ 1,5 m), Muito Perto (≤ 4,5 m), Perto (≤ 9 m), Longe (≤ 36 m), Muito Longe (além disso). Os livros em português usam metros: 1,5 m = 5 pés.

## 6. Características

A ordem segue o Kit de Homebrew: passivas, depois ações, depois reações.

| 5e | Daggerheart |
|---|---|
| Tipo Lacaio | Passiva **Lacaio (X)** com X = 4 / 6 / 8 / 12, e **Ataque em Grupo** (gaste 1 Medo), ambos como no SRD. |
| Enxame | Passiva **Horda (X)** com X = 1d4+2 / 2d4+1 / 2d6+3 / 2d6+5. |
| Ações Lendárias | **Implacável (2)** nos níveis 1–2, **Implacável (3)** nos níveis 3–4. Opções lendárias que só atacam ou detectam são cobertas por ela; opções com salvaguarda viram ações que custam 1 Fadiga. |
| Resistência Lendária | Adversários nunca fazem salvaguardas, então ela vira +1 PV e +1 Fadiga. |
| Ataques Múltiplos | Incorporados ao dano do ataque padrão. |
| Outros ataques | Um ataque que alcança mais longe que o ataque padrão (azagaia arremessada, arco curto) vira uma ação com o dano padrão. Os demais são incorporados. |
| Poderes com salvaguarda (sopros, auras…) | Uma ação que pede uma **Rolagem de Reação**: FOR/CON → Força, DES → Agilidade, INT → Conhecimento, SAB → Instinto, CAR → Presença. Poderes em área atingem "todos os alvos dentro do alcance" da área. O dano usa nível × d8, ou nível × d12 quando o dano em 5e é pelo menos 1,5× o do ataque padrão, mais o bônus do nível. "Metade em um sucesso" é mantido. |
| Recarga 5–6 ou mais rara | Custa 1 **Medo**. |
| Recarga 4–6, X/Dia, ações bônus | Custam 1 **Fadiga**. |
| Condições impostas | Agarrado/impedido → **Contido**; caído, cego, envenenado, surdo, exaustão → **Vulnerável**; paralisado, atordoado, petrificado, inconsciente, incapacitado → **Contido** e **Vulnerável**; amedrontado, enfeitiçado → **marcar 1 Fadiga**. |
| Resistência (ou imunidade não mágica) a dois ou mais de contundente/perfurante/cortante | Passiva: resistência a dano físico. Imunidade real a dano físico também vira resistência (marcada para revisão). |
| Resistência ou imunidade a quatro ou mais tipos de dano mágico | **Forma Arcana**: resistência a dano mágico (característica de exemplo do SRD). |
| Menos resistências ou imunidades mágicas | Passiva nomeando o elemento (marcada para revisão). |
| Vulnerabilidade | Passiva: marca 1 PV adicional ao sofrer dano daquele elemento (marcada para revisão). |
| Imunidade a agarrado/impedido/paralisado | Passiva: não pode ficar Contido. As outras imunidades a condição não têm condição equivalente em Daggerheart e são descartadas. |
| Táticas de Matilha | Passiva: vantagem contra alvo no alcance Corpo a Corpo de outro adversário. |
| Resistência à Magia | Passiva: +2 na Dificuldade contra Rolagens de Conjuração. |
| Conjuração | Ação: marque 1 Fadiga para lançar uma das magias listadas, conduzida como ação de Daggerheart (marcada para revisão). |
| Sentidos aguçados, perícias altas | **Experiências** (lista do SRD): as duas maiores perícias de +4 ou mais viram Furtividade, Sentidos Aguçados, Rastreador, Intimidação, Traquejo Social, Acrobacia, Conhecimento Mágico, Nobreza, Mestre de Armas, Amigo da Natureza ou Invasão; +3 quando a perícia é +8 ou mais, senão +2. |
| Qualquer outra coisa | Trazida com o texto de 5e e marcada **Revisar** para o Mestre reescrever. Lacaios e Hordas descartam essas características, pois devem ter o menor número delas. |

Valores de atributo, salvaguardas, deslocamento, sentidos e idiomas não têm campo em Daggerheart. Descreva-os na ficção.

## 7. Motivos e Táticas

Sugestões iniciais por tipo de criatura (por exemplo, feras: caçar, defender território, alimentar-se, fugir quando ferido). Ajuste à cena.

## Terminologia

A saída em inglês usa os termos do SRD de Daggerheart. A saída em português usa o vocabulário da edição de Daggerheart publicada no Brasil (Fadiga, Limiares, Lacaio, Implacável, Contido, Vulnerável, Rolagem de Reação…). Todos os termos ficam em `src/i18n/`, então uma mesa que prefira outras palavras pode trocá-las num único lugar.
