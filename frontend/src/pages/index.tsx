import { createBrowserRouter } from 'react-router-dom';
import { LandingPage } from './landing';
import { routerList } from '../configs/routerList';
import { MainLayout } from '../components/MainLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';

export const router = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LandingPage />,
  },
  // Protected app routes — pathless layout wraps MainLayout
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [...routerList],
  },
]);
