import { RouterProvider } from 'react-router-dom';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { darkTheme } from './utils/appearenceMode';
import { router } from './pages';
import { AppProviders } from './context';

const queryClient = new QueryClient();

export const App = () => {
  return (
    <React.StrictMode>
      <ThemeProvider theme={darkTheme}>
        {/* QueryClientProvider must wrap AppProviders because AppProviders uses useQuery */}
        <QueryClientProvider client={queryClient}>
          <AppProviders>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
            <RouterProvider router={router} />
          </AppProviders>
        </QueryClientProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
};
