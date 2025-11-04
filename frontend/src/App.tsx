import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from './pages/login';
import { HomePage } from './pages/home';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FoodTable from './pages/manuallyTable';
import { ThemeProvider } from '@mui/material';
import { darkTheme } from './utils/appearenceMode';

const queryClient = new QueryClient();

export const App = () => {
  return (
    <React.StrictMode>
      <ThemeProvider theme={darkTheme}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/ManuallyLife" element={<FoodTable />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
};
