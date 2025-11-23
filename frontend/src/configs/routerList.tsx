import type { RouteObject } from 'react-router-dom';
import { HomePage } from '../pages/home';
import FoodTable from '../pages/manuallyTable';


export const routerList: RouteObject[] = [
    {
      index: true,
      element: <HomePage />,
    },
  {
    path: '/inicio',
    element: <HomePage />,
  },
  {
    path: '/saude',
    element: <FoodTable />,
  },
];
