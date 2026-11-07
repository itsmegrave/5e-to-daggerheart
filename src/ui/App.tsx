import {
  ActionIcon, Alert, Anchor, AppShell, Badge, Button, Card, Container, CopyButton, FileButton, Grid, Group,
  NumberInput, SegmentedControl, Select, Stack, Text, TextInput, Textarea, Title, Tooltip,
  useComputedColorScheme, useMantineColorScheme,
} from '@mantine/core';
import {
  IconBook, IconBrandGithub, IconCheck, IconCopy, IconDownload, IconFileUpload, IconMoon, IconSun, IconTrash,
} from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { convert } from '../core/convert';
import { parseInput } from '../core/parse';
import { formatCR, noteText, toMarkdown, toPlainText } from '../core/render';
import { SAMPLES } from '../core/samples';
import type { AdversaryType, Monster5e, NoteLevel, Tier } from '../core/types';
import { DICTS, type Lang } from '../i18n';
import { StatBlock } from './StatBlock';

const REPO = 'https://github.com/itsmegrave/5e-to-daggerheart';
const RULES: Record<Lang, string> = {
  en: `${REPO}/blob/main/docs/CONVERSION_RULES.md`,
  pt: `${REPO}/blob/main/docs/REGRAS_DE_CONVERSAO.md`,
};
const TYPES: AdversaryType[] = ['bruiser', 'horde', 'leader', 'minion', 'ranged', 'skulk', 'social', 'solo', 'standard', 'support'];
const LEVEL_COLOR: Record<NoteLevel, string> = { info: 'gray', review: 'yellow', dropped: 'red' };

function load(key: string, fallback: string): string {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}
function save(key: string, value: string): void {
  try { localStorage.setItem(key, value); } catch { /* storage unavailable */ }
}

function initialLang(): Lang {
  const saved = load('5e2dh-lang', '');
  if (saved === 'en' || saved === 'pt') return saved;
  return typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'en';
}

export function App() {
  const [uiLang, setUiLang] = useState<Lang>(initialLang);
  const [outLang, setOutLang] = useState<Lang>(uiLang);
  const [input, setInput] = useState<string>(() => load('5e2dh-input', SAMPLES.find((s) => s.id === 'ogre')!.text));
  const [pick, setPick] = useState(0);
  const [tier, setTier] = useState<string>('auto');
  const [type, setType] = useState<string>('auto');
  const [party, setParty] = useState<number>(4);
  const [nameOverride, setNameOverride] = useState('');
  const [attackOverride, setAttackOverride] = useState('');

  const ui = DICTS[uiLang].ui;
  const terms = DICTS[uiLang].terms;
  const { setColorScheme } = useMantineColorScheme();
  const scheme = useComputedColorScheme('light');

  useEffect(() => { save('5e2dh-lang', uiLang); document.documentElement.lang = uiLang === 'pt' ? 'pt-BR' : 'en'; }, [uiLang]);
  useEffect(() => { save('5e2dh-input', input); }, [input]);

  const parsed = useMemo((): { monsters: Monster5e[]; error: boolean } => {
    try { return { monsters: parseInput(input), error: false }; } catch { return { monsters: [], error: true }; }
  }, [input]);

  const monster = parsed.monsters[Math.min(pick, parsed.monsters.length - 1)] ?? null;

  // Reset per-creature edits when the creature changes.
  useEffect(() => { setNameOverride(''); setAttackOverride(''); }, [monster?.name, input]);

  const result = useMemo(() => {
    if (!monster) return null;
    const r = convert(monster, {
      tier: tier === 'auto' ? undefined : (Number(tier) as Tier),
      type: type === 'auto' ? undefined : (type as AdversaryType),
      partySize: party,
    });
    if (nameOverride.trim()) r.adversary.name = nameOverride.trim();
    if (attackOverride.trim()) r.adversary.attackName = attackOverride.trim();
    return r;
  }, [monster, tier, type, party, nameOverride, attackOverride]);

  const loadSample = (id: string) => {
    const s = SAMPLES.find((x) => x.id === id);
    if (s) { setInput(s.text); setPick(0); setTier('auto'); setType('auto'); }
  };

  const onFile = async (file: File | null) => {
    if (!file) return;
    setInput(await file.text());
    setPick(0);
  };

  const downloadJson = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result.adversary, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(result.adversary.name || 'adversary').toLowerCase().replace(/[^a-z0-9]+/gi, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tierOptions = [
    { value: 'auto', label: result ? `${ui.auto} (${result.detected.tier})` : ui.auto },
    ...[1, 2, 3, 4].map((n) => ({ value: String(n), label: String(n) })),
  ];
  const typeOptions = [
    { value: 'auto', label: result ? `${ui.auto} (${terms.types[result.detected.type]})` : ui.auto },
    ...TYPES.map((v) => ({ value: v, label: terms.types[v] })),
  ];

  return (
    <AppShell header={{ height: 60 }} padding={0}>
      <AppShell.Header className="app-header">
        <Group h="100%" justify="space-between" wrap="nowrap" gap="xs">
          <Group gap={8} wrap="nowrap" miw={0}>
            <img src="/favicon.svg" alt="" width={28} height={28} />
            <Title order={1} size="h4" style={{ whiteSpace: 'nowrap' }}>{ui.appTitle}</Title>
          </Group>
          <Group gap={6} wrap="nowrap">
            <SegmentedControl
              size="xs"
              value={uiLang}
              onChange={(v) => { setUiLang(v as Lang); setOutLang(v as Lang); }}
              data={[{ value: 'pt', label: 'PT' }, { value: 'en', label: 'EN' }]}
              aria-label={ui.uiLang}
            />
            <Tooltip label={ui.rules}>
              <ActionIcon component="a" href={RULES[uiLang]} target="_blank" rel="noopener" variant="default" size="lg" aria-label={ui.rules}>
                <IconBook size={18} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={ui.source}>
              <ActionIcon component="a" href={REPO} target="_blank" rel="noopener" variant="default" size="lg" aria-label={ui.source} visibleFrom="xs">
                <IconBrandGithub size={18} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={ui.themeToggle}>
              <ActionIcon variant="default" size="lg" aria-label={ui.themeToggle} onClick={() => setColorScheme(scheme === 'dark' ? 'light' : 'dark')}>
                {scheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="xl" py="md" className="app-main">
          <Text c="dimmed" mb="md">{ui.tagline}</Text>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 5 }}>
              <Stack gap="md">
                <Card withBorder>
                  <Stack gap="sm">
                    <Group justify="space-between" align="flex-end" wrap="wrap" gap="xs">
                      <Text fw={700} component="label" htmlFor="stat-input">{ui.input}</Text>
                      <Group gap={6}>
                        <FileButton onChange={onFile} accept="application/json,.json,text/plain,.txt,.md">
                          {(props) => <Button {...props} size="xs" variant="default" leftSection={<IconFileUpload size={14} />}>{ui.uploadJson}</Button>}
                        </FileButton>
                        <Button size="xs" variant="subtle" color="gray" leftSection={<IconTrash size={14} />} onClick={() => setInput('')}>{ui.clear}</Button>
                      </Group>
                    </Group>
                    <Textarea
                      id="stat-input"
                      value={input}
                      onChange={(e) => { setInput(e.currentTarget.value); setPick(0); }}
                      placeholder={ui.inputPlaceholder}
                      description={ui.inputHelp}
                      autosize
                      minRows={8}
                      maxRows={22}
                      spellCheck={false}
                      classNames={{ input: 'stat-input' }}
                    />
                    <div>
                      <Text size="xs" c="dimmed" mb={4}>{ui.samples}</Text>
                      <Group gap={6}>
                        {SAMPLES.map((s) => (
                          <Button key={s.id} size="compact-xs" variant="light" onClick={() => loadSample(s.id)}>{s.label[uiLang]}</Button>
                        ))}
                      </Group>
                    </div>
                    {parsed.monsters.length > 1 && (
                      <Select
                        id="pick-monster"
                        label={ui.pickMonster}
                        searchable
                        value={String(pick)}
                        onChange={(v) => setPick(Number(v ?? 0))}
                        data={parsed.monsters.map((m, i) => ({ value: String(i), label: `${m.name} (CR ${formatCR(m.cr)})` }))}
                      />
                    )}
                  </Stack>
                </Card>

                <Card withBorder>
                  <Stack gap="sm">
                    <Text fw={700}>{ui.options}</Text>
                    <Grid gutter="sm">
                      <Grid.Col span={{ base: 6 }}>
                        <Select id="tier" label={ui.tier} value={tier} onChange={(v) => setTier(v ?? 'auto')} data={tierOptions} allowDeselect={false} />
                      </Grid.Col>
                      <Grid.Col span={{ base: 6 }}>
                        <Select id="type" label={ui.type} value={type} onChange={(v) => setType(v ?? 'auto')} data={typeOptions} allowDeselect={false} />
                      </Grid.Col>
                      <Grid.Col span={{ base: 6 }}>
                        <NumberInput id="party" label={ui.partySize} value={party} min={1} max={8} onChange={(v) => setParty(Number(v) || 4)} />
                      </Grid.Col>
                      <Grid.Col span={{ base: 6 }}>
                        <Text size="sm" fw={500} mb={4}>{ui.outputLang}</Text>
                        <SegmentedControl
                          fullWidth
                          value={outLang}
                          onChange={(v) => setOutLang(v as Lang)}
                          data={[{ value: 'pt', label: 'Português' }, { value: 'en', label: 'English' }]}
                          aria-label={ui.outputLang}
                        />
                      </Grid.Col>
                      {result && (
                        <>
                          <Grid.Col span={{ base: 12, xs: 6 }}>
                            <TextInput id="name" label={ui.name} placeholder={monster?.name} value={nameOverride} onChange={(e) => setNameOverride(e.currentTarget.value)} />
                          </Grid.Col>
                          <Grid.Col span={{ base: 12, xs: 6 }}>
                            <TextInput id="attack" label={ui.attackName} placeholder={result.adversary.attackName} value={attackOverride} onChange={(e) => setAttackOverride(e.currentTarget.value)} />
                          </Grid.Col>
                        </>
                      )}
                    </Grid>
                  </Stack>
                </Card>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 7 }}>
              <Stack gap="md">
                {parsed.error && <Alert color="red" variant="light">{ui.parseError}</Alert>}
                {!result && !parsed.error && (
                  <Card withBorder><Text c="dimmed">{ui.empty}</Text></Card>
                )}
                {result && (
                  <>
                    <Group justify="space-between" wrap="wrap" gap="xs">
                      <Title order={2} size="h4">{ui.result}</Title>
                      <Group gap={6}>
                        <CopyButton value={toMarkdown(result.adversary, outLang)}>
                          {({ copied, copy }) => (
                            <Button size="xs" variant="default" onClick={copy} leftSection={copied ? <IconCheck size={14} /> : <IconCopy size={14} />}>
                              {copied ? ui.copied : ui.copyMarkdown}
                            </Button>
                          )}
                        </CopyButton>
                        <CopyButton value={toPlainText(result.adversary, outLang)}>
                          {({ copied, copy }) => (
                            <Button size="xs" variant="default" onClick={copy} leftSection={copied ? <IconCheck size={14} /> : <IconCopy size={14} />}>
                              {copied ? ui.copied : ui.copyText}
                            </Button>
                          )}
                        </CopyButton>
                        <Button size="xs" variant="default" onClick={downloadJson} leftSection={<IconDownload size={14} />}>{ui.downloadJson}</Button>
                      </Group>
                    </Group>

                    <StatBlock adversary={result.adversary} lang={outLang} uiLang={uiLang} />

                    <Card withBorder>
                      <Stack gap="xs">
                        <div>
                          <Title order={3} size="h5">{ui.notes}</Title>
                          <Text size="xs" c="dimmed">{ui.notesHelp}</Text>
                        </div>
                        <ul className="notes-list" style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
                          {result.notes.map((n, i) => (
                            <li key={i}>
                              <Group gap={8} wrap="nowrap" align="flex-start">
                                <Badge size="xs" variant="light" color={LEVEL_COLOR[n.level]} miw={92} style={{ flexShrink: 0, marginTop: 3 }}>
                                  {ui.noteLevels[n.level]}
                                </Badge>
                                <Text size="sm" style={{ minWidth: 0 }}>{noteText(n, uiLang)}</Text>
                              </Group>
                            </li>
                          ))}
                        </ul>
                      </Stack>
                    </Card>
                  </>
                )}
              </Stack>
            </Grid.Col>
          </Grid>

          <Text size="xs" c="dimmed" mt="xl" maw={720}>
            {ui.legal}{' '}
            <Anchor href={RULES[uiLang]} target="_blank" rel="noopener" size="xs">{ui.rules}</Anchor>
            {' · '}
            <Anchor href={REPO} target="_blank" rel="noopener" size="xs">{ui.source}</Anchor>
          </Text>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
