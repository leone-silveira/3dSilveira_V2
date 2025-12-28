import { RouterProvider } from 'react-router-dom';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material';
import { darkTheme } from './utils/appearenceMode';
import { router } from './pages';
import { AppProviders } from './context';

const queryClient = new QueryClient();

export const App = () => {
  return (
    <React.StrictMode>
      <ThemeProvider theme={darkTheme}>
        <AppProviders>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </AppProviders>
      </ThemeProvider>
    </React.StrictMode>
  );
};
