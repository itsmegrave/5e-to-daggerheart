import { Paper, Stack, Text, Title, Tooltip } from '@mantine/core';
import { renderAdversary } from '../core/render';
import type { Adversary } from '../core/types';
import { DICTS, type Lang } from '../i18n';

interface Props {
  adversary: Adversary;
  lang: Lang;
  uiLang: Lang;
}

const KIND_CLASS = ['passive', 'action', 'reaction'] as const;

/** The converted adversary as a sticker, with its tier slapped on the corner. */
export function StatBlock({ adversary, lang, uiLang }: Props) {
  const r = renderAdversary(adversary, lang);
  const t = DICTS[lang].terms;
  const ui = DICTS[uiLang].ui;

  return (
    <Paper p={{ base: 'md', sm: 'lg' }} radius="lg" className="statblock" aria-label={r.name}>
      <div className={`tier-sticker tier-${adversary.tier}`} aria-label={r.subtitle}>
        <span className="tier-num">{t.tier} {adversary.tier}</span>
        <span className="tier-type">{t.types[adversary.type]}</span>
      </div>

      <Stack gap="md">
        <div>
          <Title order={2} className="statblock-name" fz={{ base: 26, sm: 32 }}>{r.name || '—'}</Title>
          <Text size="sm" mt={6}>
            <Text span fw={800}>{t.motives}: </Text>
            {r.motives}
          </Text>
        </div>

        <div className="stat-row">
          {r.stats.map(([k, v]) => (
            <div className="stat-chip" key={k}>
              <div className="k">{k}</div>
              <div className="v">{v}</div>
            </div>
          ))}
        </div>

        <div className="attack-strip">
          <b>{t.atk}</b> {r.attack.replace(/^[^:]+:\s*/, '')}
        </div>

        {r.experience && (
          <Text size="sm">
            <Text span fw={800}>{t.experience}: </Text>{r.experience}
          </Text>
        )}

        {r.features.length > 0 && (
          <Stack gap="sm">
            <div><span className="tape fear">{t.features}</span></div>
            {r.features.map((f, i) => {
              const kind = KIND_CLASS.find((k) => t.kinds[k] === f.kind) ?? 'action';
              return (
                <Text key={`${f.title}-${i}`} size="sm" lh={1.55} className={`feature k-${kind}`}>
                  <span className="feature-title">{f.title} – {f.kind}: </span>
                  {f.text}
                  {f.review && (
                    <Tooltip label={ui.reviewHint} multiline w={240} events={{ hover: true, focus: true, touch: true }}>
                      <span className="review-flag" tabIndex={0}>{ui.review}</span>
                    </Tooltip>
                  )}
                </Text>
              );
            })}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}
