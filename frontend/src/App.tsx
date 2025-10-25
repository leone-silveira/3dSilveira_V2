import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { LoginPage } from './pages/login';
import { HomePage } from './pages/home';
import ManuallyLife from './pages/manuallyTable';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TemporaryDrawer from './components/sidebar';

const queryClient = new QueryClient();
function Filho() {
  const location = useLocation();
  const hideDrawer = location.pathname === '/login';

  
  return (
    <>
      {!hideDrawer && <TemporaryDrawer />}{' '}
      {/* Só mostra Drawer fora do login */}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/ManuallyLife" element={<ManuallyLife />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Filho />
      </BrowserRouter>
    </QueryClientProvider>
  );
};
