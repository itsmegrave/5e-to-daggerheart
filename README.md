# 5e → Daggerheart

Convert D&D 5e creatures into Daggerheart adversaries, in English or Portuguese.
*Converta criaturas de D&D 5e em adversários de Daggerheart, em português ou inglês.* [↓ Português](#português)

- Paste a stat block (English or Portuguese, 2014 or 2024 layout) or import 5etools / Open5e JSON, including whole bestiary files.
- Get a Daggerheart stat block with tier, type, Difficulty, thresholds, HP, Stress, ATK, standard attack, Experiences and features.
- Every number comes with a note explaining the rule behind it; anything carried over from 5e is flagged for review.
- Override tier, type, party size, name and attack name; copy as Markdown or text, or download JSON.
- Works on phones and desktops, light and dark.

The rules are documented in [docs/CONVERSION_RULES.md](docs/CONVERSION_RULES.md). They are built on the Daggerheart SRD benchmarks, the official Homebrew Kit, and the median stats of the 129 SRD adversaries.

## Development

Requires Node 26 (current LTS). The version is pinned in `.nvmrc` / `.node-version`, which Cloudflare's build also reads.

```sh
npm install
npm run dev        # local dev server
npm test           # conversion engine tests (Vitest)
npm run build      # type-check and build to ./dist
```

Code map:

| Path | What it does |
|---|---|
| `src/core/parse/` | Reads text stat blocks (EN/PT, 2014/2024) and 5etools / Open5e JSON into one model |
| `src/core/rules.ts` | Every conversion table (benchmarks, dice, ranges, CR norms) |
| `src/core/convert.ts` | The conversion engine and its notes |
| `src/core/render.ts` | Stat block, Markdown and text output |
| `src/i18n/` | All English and Portuguese wording, including game terms |
| `src/ui/` | React + Mantine interface |

## Deploying to Cloudflare

The app is fully static. `wrangler.jsonc` serves `./dist` as Workers static assets.

```sh
npx wrangler login
npm run deploy     # builds and uploads
```

Alternatively, connect the repository in the Cloudflare dashboard (Workers & Pages → Create → Import a repository) with build command `npm run build` and deploy command `npx wrangler deploy`.

## Legal

Daggerheart content © Critical Role, LLC, used under the [Darrington Press Community Gaming License](https://www.daggerheart.com). This project is not affiliated with Critical Role or Darrington Press.
Example stat blocks come from the System Reference Document 5.1 by Wizards of the Coast LLC, licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/legalcode). Not affiliated with Wizards of the Coast.

---

## Português

- Cole um bloco de estatísticas (em português ou inglês, formato 2014 ou 2024) ou importe JSON do 5etools / Open5e, inclusive bestiários inteiros.
- Receba uma ficha de Daggerheart com nível, tipo, Dificuldade, limiares, PV, Fadiga, ATQ, ataque padrão, Experiências e características.
- Cada número vem com uma nota explicando a regra usada; o que for trazido do 5e fica marcado para revisão.
- Ajuste nível, tipo, tamanho do grupo, nome e nome do ataque; copie como Markdown ou texto, ou baixe em JSON.
- Funciona no celular e no computador, em tema claro e escuro.

As regras estão em [docs/REGRAS_DE_CONVERSAO.md](docs/REGRAS_DE_CONVERSAO.md). Elas se baseiam nas referências do SRD de Daggerheart, no Kit de Homebrew oficial e nas medianas dos 129 adversários do SRD.

A terminologia em português fica em `src/i18n/pt.ts`. Se a sua mesa usa outros termos, é só trocá-los ali.

Para rodar localmente: `npm install`, depois `npm run dev`. Para publicar na Cloudflare: `npx wrangler login` e `npm run deploy`.
