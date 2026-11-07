import '@mantine/core/styles.css';
import './ui/app.css';
import { MantineProvider, localStorageColorSchemeManager } from '@mantine/core';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './ui/App';
import { theme } from './ui/theme';

const colorSchemeManager = localStorageColorSchemeManager({ key: '5e2dh-color-scheme' });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="auto" colorSchemeManager={colorSchemeManager}>
      <App />
    </MantineProvider>
  </StrictMode>,
);
