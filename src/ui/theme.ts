import { createTheme, type MantineColorsTuple } from '@mantine/core';

// Spray-paint magenta, the primary "can" of the palette.
const spray: MantineColorsTuple = [
  '#fff0f7', '#ffd6e9', '#ffadd2', '#ff80b9', '#ff57a2', '#ff3d93', '#ff2e88', '#e6157a', '#c80a68', '#a30052',
];
const cyan: MantineColorsTuple = [
  '#e3fbff', '#c4f4fd', '#8fe9fa', '#59ddf7', '#33d4f5', '#23d5f5', '#0fbfe0', '#00a6c7', '#0090ad', '#007a94',
];
const lime: MantineColorsTuple = [
  '#f2fce6', '#e1f8c8', '#c6f095', '#a9e85f', '#93e23a', '#8be03c', '#74c823', '#5fa816', '#4c880c', '#386603',
];

export const theme = createTheme({
  primaryColor: 'spray',
  primaryShade: 6,
  colors: { spray, cyan, lime },
  autoContrast: true,
  luminanceThreshold: 0.45,
  black: '#141019',
  defaultRadius: 'lg',
  fontFamily: 'Archivo, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
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
