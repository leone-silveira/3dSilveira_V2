import type { RouteObject } from 'react-router-dom';
import { HomePage } from '../pages/home';
import FoodTable from '../pages/manuallyTable';


export const routerList: RouteObject[] = [
    {
      index: true,
      element: <HomePage />,
    },
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/FoodTable',
    element: <FoodTable />,
  },
];
