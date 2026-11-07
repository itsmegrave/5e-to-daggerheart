import { Badge, Group, Paper, Stack, Text, Title, Tooltip } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import { renderAdversary } from '../core/render';
import type { Adversary } from '../core/types';
import { DICTS, type Lang } from '../i18n';

interface Props {
  adversary: Adversary;
  lang: Lang;
  uiLang: Lang;
}

/** The converted adversary, laid out like a Daggerheart SRD stat block. */
export function StatBlock({ adversary, lang, uiLang }: Props) {
  const r = renderAdversary(adversary, lang);
  const t = DICTS[lang].terms;
  const ui = DICTS[uiLang].ui;

  return (
    <Paper withBorder p={{ base: 'md', sm: 'lg' }} className="statblock" aria-label={r.name}>
      <Stack gap="sm">
        <div>
          <Title order={2} className="statblock-name" fz={{ base: 24, sm: 28 }}>{r.name || '—'}</Title>
          <Text fs="italic" fw={600} c="dimmed">{r.subtitle}</Text>
        </div>

        <Text size="sm">
          <Text span fw={700}>{t.motives}: </Text>
          {r.motives}
        </Text>

        <hr className="statblock-rule" />

        <Group gap="md" className="statblock-stats" wrap="wrap">
          {r.stats.map(([k, v]) => (
            <Text key={k} size="sm">
              <Text span fw={700}>{k}: </Text>{v}
            </Text>
          ))}
        </Group>
        <Text size="sm" className="statblock-stats">
          <Text span fw={700}>{t.atk}: </Text>
          {r.attack.replace(/^[^:]+:\s*/, '')}
        </Text>
        {r.experience && (
          <Text size="sm">
            <Text span fw={700}>{t.experience}: </Text>{r.experience}
          </Text>
        )}

        {r.features.length > 0 && (
          <>
            <hr className="statblock-rule" />
            <Title order={3} size="h5" tt="uppercase" lts="0.06em">{t.features}</Title>
            <Stack gap="xs">
              {r.features.map((f, i) => (
                <Text key={`${f.title}-${i}`} size="sm" lh={1.55}>
                  <span className="feature-title">{f.title} - {f.kind}: </span>
                  {f.text}
                  {f.review && (
                    <Tooltip label={ui.reviewHint} multiline w={240} events={{ hover: true, focus: true, touch: true }}>
                      <Badge
                        ml={6}
                        size="xs"
                        variant="light"
                        color="yellow"
                        leftSection={<IconAlertTriangle size={10} />}
                        tabIndex={0}
                        style={{ verticalAlign: 'middle', cursor: 'help' }}
                      >
                        {ui.review}
                      </Badge>
                    </Tooltip>
                  )}
                </Text>
              ))}
            </Stack>
          </>
        )}
      </Stack>
    </Paper>
  );
}
