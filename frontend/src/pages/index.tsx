import { createBrowserRouter } from 'react-router-dom';
import { App } from '../App';
import { HomePage } from './home';
import { LoginPage } from './login';
import FoodTable from './manuallyTable';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'FoodTable', element: <FoodTable /> },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
]);
