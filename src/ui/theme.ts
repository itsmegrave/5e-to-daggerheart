import { createTheme, type MantineColorsTuple } from '@mantine/core';

// Daggerheart palette: Hope (gold) and Fear (violet), the Duality Dice,
// plus domain-card colors used as accents.
const hope: MantineColorsTuple = [
  '#fff8e6', '#ffefc4', '#fde29a', '#f9d26c', '#f6c54d', '#f4bd40', '#f2b83b', '#d89d22', '#bf8812', '#a37100',
];
const fear: MantineColorsTuple = [
  '#f3edfd', '#e2d6f8', '#c5adf0', '#a783e9', '#8f61e2', '#8352d8', '#7c4dcc', '#6a3db5', '#5d35a1', '#4f2a8c',
];
const codex: MantineColorsTuple = [
  '#e8f4fd', '#d1e8fa', '#a6d1f3', '#79b9ec', '#5aa9e6', '#4a9fe3', '#3d97e1', '#2d83c8', '#2174b4', '#08649f',
];
const sage: MantineColorsTuple = [
  '#ebf8ed', '#d9f0dc', '#b4e1b9', '#8cd193', '#6fc27a', '#5bba67', '#50b65d', '#409f4c', '#368d42', '#287a35',
];
const blade: MantineColorsTuple = [
  '#fdecee', '#f8d6da', '#f0aab3', '#e97c8a', '#e0566b', '#de4a5f', '#dd3c54', '#c42e45', '#af263d', '#991a33',
];

export const theme = createTheme({
  primaryColor: 'hope',
  primaryShade: 6,
  colors: { hope, fear, codex, sage, blade },
  autoContrast: true,
  luminanceThreshold: 0.45,
  black: '#1a0f28',
  defaultRadius: 'lg',
  fontFamily: '"Archivo Variable", Archivo, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  headings: {
    fontFamily: 'Bungee, Impact, "Arial Black", sans-serif',
    fontWeight: '400',
  },
  components: {
    Button: { defaultProps: { radius: 'xl' }, classNames: { root: 'btn-sticker' } },
    ActionIcon: { defaultProps: { radius: 'xl' }, classNames: { root: 'btn-sticker' } },
    Card: { defaultProps: { radius: 'lg', withBorder: false }, classNames: { root: 'panel' } },
    Paper: { classNames: { root: 'panel' } },
    Textarea: { classNames: { input: 'field' } },
    TextInput: { classNames: { input: 'field' } },
    NumberInput: { classNames: { input: 'field' } },
    Select: { classNames: { input: 'field' } },
    SegmentedControl: { classNames: { root: 'seg' } },
  },
});
