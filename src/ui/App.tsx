import {
  ActionIcon, Alert, Anchor, Button, Card, Container, CopyButton, FileButton, Grid, Group,
  NumberInput, SegmentedControl, Select, Stack, Text, TextInput, Textarea, Tooltip,
  useComputedColorScheme, useMantineColorScheme,
} from '@mantine/core';
import {
  IconBook, IconBrandGithub, IconCheck, IconCopy, IconDownload, IconFileUpload, IconMoon, IconSun, IconTrash,
} from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { useEffect, useMemo, useState } from 'react';
import { convert } from '../core/convert';
import { parseInput } from '../core/parse';
import { formatCR, noteText, toMarkdown, toPlainText } from '../core/render';
import { SAMPLES } from '../core/samples';
import type { AdversaryType, Monster5e, NoteLevel, Tier } from '../core/types';
import { DICTS, type Lang } from '../i18n';
import { SprayHeart } from './SprayHeart';
import { StatBlock } from './StatBlock';

const REPO = 'https://github.com/itsmegrave/5e-to-daggerheart';
const RULES: Record<Lang, string> = {
  en: `${REPO}/blob/main/docs/CONVERSION_RULES.md`,
  pt: `${REPO}/blob/main/docs/REGRAS_DE_CONVERSAO.md`,
};
const TYPES: AdversaryType[] = ['bruiser', 'horde', 'leader', 'minion', 'ranged', 'skulk', 'social', 'solo', 'standard', 'support'];
const LEVELS: NoteLevel[] = ['info', 'review', 'dropped'];

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
  const [input, setInput] = useState<string>(() => load('5e2dh-input', SAMPLES.find((s) => s.id === 'adult-red-dragon')!.text));
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
  const isPhone = useMediaQuery('(max-width: 48em)');

  useEffect(() => { save('5e2dh-lang', uiLang); document.documentElement.lang = uiLang === 'pt' ? 'pt-BR' : 'en'; }, [uiLang]);
  useEffect(() => { save('5e2dh-input', input); }, [input]);
  useEffect(() => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', scheme === 'dark' ? '#0b0614' : '#1a0f28');
  }, [scheme]);

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
    <>
      <header className="street-bar">
        <Group justify="space-between" wrap="nowrap" gap="xs" maw={1320} mx="auto">
          <span className="street-logo">5e <span className="arrow">→</span> DH</span>
          <Group gap={8} wrap="nowrap">
            <SegmentedControl
              size="xs"
              radius="xl"
              color="hope"
              value={uiLang}
              onChange={(v) => { setUiLang(v as Lang); setOutLang(v as Lang); }}
              data={[{ value: 'pt', label: 'PT' }, { value: 'en', label: 'EN' }]}
              aria-label={ui.uiLang}
            />
            <Tooltip label={ui.rules}>
              <ActionIcon component="a" href={RULES[uiLang]} target="_blank" rel="noopener" color="sage" size="lg" aria-label={ui.rules}>
                <IconBook size={18} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={ui.source}>
              <ActionIcon component="a" href={REPO} target="_blank" rel="noopener" color="codex" size="lg" aria-label={ui.source} visibleFrom="xs">
                <IconBrandGithub size={18} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={ui.themeToggle}>
              <ActionIcon color="hope" size="lg" aria-label={ui.themeToggle} onClick={() => setColorScheme(scheme === 'dark' ? 'light' : 'dark')}>
                {scheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </header>

      <Container size={1320} className="app-main">
        <section className="hero">
          <h1 className="hero-title"><span className="five">5e</span> → Daggerheart</h1>
          <span className="hero-tag" aria-hidden="true">{ui.heroTag}</span>
          <p className="hero-sub">{ui.tagline}</p>
        </section>

        <div className="workbench">
              <Card p="lg" className="area-input">
                <Stack gap="sm">
                  <Group justify="space-between" align="center" wrap="wrap" gap="xs">
                    <label htmlFor="stat-input" className="tape">{ui.input}</label>
                    <Group gap={8}>
                      <FileButton onChange={onFile} accept="application/json,.json,text/plain,.txt,.md">
                        {(props) => <Button {...props} size="xs" color="codex" leftSection={<IconFileUpload size={14} />}>{ui.uploadJson}</Button>}
                      </FileButton>
                      <Button size="xs" color="gray.0" leftSection={<IconTrash size={14} />} onClick={() => setInput('')}>{ui.clear}</Button>
                    </Group>
                  </Group>
                  <Textarea
                    id="stat-input"
                    value={input}
                    onChange={(e) => { setInput(e.currentTarget.value); setPick(0); }}
                    placeholder={ui.inputPlaceholder}
                    description={ui.inputHelp}
                    autosize
                    minRows={isPhone ? 6 : 8}
                    maxRows={isPhone ? 11 : 20}
                    spellCheck={false}
                    classNames={{ input: 'field stat-input' }}
                  />
                  <div>
                    <Text size="sm" fw={800} mb={8}>{ui.samples}</Text>
                    <Group gap={10}>
                      {SAMPLES.map((s) => (
                        <button type="button" key={s.id} className="sample-sticker" onClick={() => loadSample(s.id)}>{s.label[uiLang]}</button>
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

              <Card p="lg" className="area-adjust">
                <Stack gap="sm">
                  <div><span className="tape codex">{ui.options}</span></div>
                  <Grid gutter="sm">
                    <Grid.Col span={6}>
                      <Select id="tier" label={ui.tier} value={tier} onChange={(v) => setTier(v ?? 'auto')} data={tierOptions} allowDeselect={false} />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Select id="type" label={ui.type} value={type} onChange={(v) => setType(v ?? 'auto')} data={typeOptions} allowDeselect={false} />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <NumberInput id="party" label={ui.partySize} value={party} min={1} max={8} onChange={(v) => setParty(Number(v) || 4)} />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Text size="sm" fw={500} mb={4}>{ui.outputLang}</Text>
                      <SegmentedControl
                        fullWidth
                        radius="xl"
                        color="hope"
                        value={outLang}
                        onChange={(v) => setOutLang(v as Lang)}
                        data={[{ value: 'pt', label: 'PT' }, { value: 'en', label: 'EN' }]}
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
              {parsed.error && <Alert color="blade" variant="filled" radius="lg" className="panel area-result">{ui.parseError}</Alert>}
              {!result && !parsed.error && (
                <Card p="lg" className="area-result"><Text fw={600}>{ui.empty}</Text></Card>
              )}
              {result && (
                <div className="area-result">
                  <Group gap={8} justify="flex-end" wrap="wrap">
                    <CopyButton value={toMarkdown(result.adversary, outLang)}>
                      {({ copied, copy }) => (
                        <Button size="xs" color="sage" onClick={copy} leftSection={copied ? <IconCheck size={14} /> : <IconCopy size={14} />}>
                          {copied ? ui.copied : ui.copyMarkdown}
                        </Button>
                      )}
                    </CopyButton>
                    <CopyButton value={toPlainText(result.adversary, outLang)}>
                      {({ copied, copy }) => (
                        <Button size="xs" color="codex" onClick={copy} leftSection={copied ? <IconCheck size={14} /> : <IconCopy size={14} />}>
                          {copied ? ui.copied : ui.copyText}
                        </Button>
                      )}
                    </CopyButton>
                    <Button size="xs" color="fear" onClick={downloadJson} leftSection={<IconDownload size={14} />}>{ui.downloadJson}</Button>
                  </Group>

                  <div style={{ paddingTop: 10 }}>
                    <StatBlock adversary={result.adversary} lang={outLang} uiLang={uiLang} />
                  </div>

                </div>
              )}
              {result && (
                <Card p="lg" className="area-notes">
                    <Stack gap="sm">
                      <div><span className="tape">{ui.notes}</span></div>
                      <Text size="sm" fw={500}>{ui.notesHelp}</Text>
                      <div className="legend" aria-hidden="true">
                        {LEVELS.map((l) => <span key={l}><i className={`note-dot ${l}`} />{ui.noteLevels[l]}</span>)}
                      </div>
                      <ul className="notes-list">
                        {result.notes.map((n, i) => (
                          <li key={i}>
                            <Group gap={10} wrap="nowrap" align="flex-start">
                              <i className={`note-dot ${n.level}`} title={ui.noteLevels[n.level]} />
                              <Text size="sm" style={{ minWidth: 0 }}>
                                <span className="sr-only">{ui.noteLevels[n.level]}: </span>
                                {noteText(n, uiLang)}
                              </Text>
                            </Group>
                          </li>
                        ))}
                      </ul>
                    </Stack>
                  </Card>
                )}
        </div>

        <footer className="site-footer">
          <p className="signature">
            {ui.madeWith} <SprayHeart /> {ui.by}{' '}
            <a href="https://github.com/itsmegrave" target="_blank" rel="noopener">itsmegrave</a>
          </p>
        <Text size="xs" maw={720} className="legal">
          {ui.legal}{' '}
          <Anchor href={RULES[uiLang]} target="_blank" rel="noopener" size="xs" fw={700} c="inherit" td="underline">{ui.rules}</Anchor>
          {', '}
          <Anchor href={REPO} target="_blank" rel="noopener" size="xs" fw={700} c="inherit" td="underline">{ui.source}</Anchor>
        </Text>
        </footer>
      </Container>
    </>
  );
}
