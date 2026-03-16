'use client';
/**
 * ThemeRegistry — wires MUI's emotion cache to Next.js App Router
 * so CSS-in-JS styles are injected at SSR time correctly.
 */
import { useState } from 'react';
import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const muiTheme = createTheme({
  palette: {
    mode: 'dark',
    primary:   { main: '#00c9a7' },
    secondary: { main: '#0099d9' },
    background: { default: '#070d1a', paper: '#111e34' },
    success:   { main: '#2ecc71' },
    warning:   { main: '#f39c12' },
    error:     { main: '#e74c3c' },
  },
  typography: {
    fontFamily: "'Outfit', sans-serif",
    h1: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800 },
    h2: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 },
    h3: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: '#111e34',
          border: '1px solid rgba(255,255,255,0.07)',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 100, background: 'rgba(255,255,255,0.06)' },
        bar:  { borderRadius: 100 },
      },
    },
  },
});

export default function ThemeRegistry({ children }) {
  const [{ cache, flush }] = useState(() => {
    const cache = createCache({ key: 'mui' });
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted = [];
    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) inserted.push(serialized.name);
      return prevInsert(...args);
    };
    const flush = () => { const prev = inserted; inserted = []; return prev; };
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (!names.length) return null;
    let styles = '';
    for (const name of names) {
      styles += cache.inserted[name];
    }
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
