import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import DonutSmallIcon from '@mui/icons-material/DonutSmall';


export const sideBarList = [
  {
    name: 'dashboard',
    path: '/dashboard',
    optionList: [
      {
        name: 'overview',
        path: '/dashboard/overview',
        icon: AutoGraphIcon,
      },
      {
        name: 'stats',
        path: '/dashboard/stats',
        icon: DonutSmallIcon,
      },
    ],
  },
  {
    name: 'cooking',
    path: '/cooking',
    optionList: [
      {
        name: 'recipes',
        path: '/cooking/recipes',
        icon: DonutSmallIcon,
      },
      {
        name: 'stock',
        path: '/cooking/stock',
        icon: DonutSmallIcon,
      },
      {
        name: 'shopping list',
        path: '/cooking/shopping-list',
        icon: DonutSmallIcon,
      },
      {
        name: 'meal plans',
        path: '/cooking/meal-plans',
        icon: DonutSmallIcon,
      },
    ],
  },
  {
    name: 'learning',
    path: '/learning',
    optionList: [
      {
        name: 'courses',
        path: '/learning/courses',
        icon: DonutSmallIcon,
      },
      {
        name: 'tutorials',
        path: '/learning/tutorials',
        icon: DonutSmallIcon,
      },
    ],
  },
  {
    name: 'gym',
    path: '/gym',
    optionList: [
      {
        name: 'workouts',
        path: '/gym/workouts',
        icon: DonutSmallIcon,
      },
      {
        name: 'progress',
        path: '/gym/progress',
        icon: DonutSmallIcon,
      },
    ],
  },
];
