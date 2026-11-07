import '@mantine/core/styles.css';
import './ui/app.css';
import { MantineProvider, createTheme, localStorageColorSchemeManager } from '@mantine/core';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './ui/App';

const theme = createTheme({
  primaryColor: 'grape',
  defaultRadius: 'md',
  fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  headings: { fontFamily: 'Georgia, "Iowan Old Style", "Palatino Linotype", serif', fontWeight: '700' },
});

const colorSchemeManager = localStorageColorSchemeManager({ key: '5e2dh-color-scheme' });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="auto" colorSchemeManager={colorSchemeManager}>
      <App />
    </MantineProvider>
  </StrictMode>,
);
