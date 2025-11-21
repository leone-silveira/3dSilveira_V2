import { createBrowserRouter } from 'react-router-dom';
import { LoginPage } from './login';
import { routerList } from '../configs/routerList';
import { MainLayout } from '../components/MainLayout';


export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: 
    [ 
      ...routerList
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
]);
