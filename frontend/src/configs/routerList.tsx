import { HomePage } from '../pages/home';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import DonutSmallIcon from '@mui/icons-material/DonutSmall';
import ReceiptLongTwoToneIcon from '@mui/icons-material/ReceiptLongTwoTone';
import FoodBankTwoToneIcon from '@mui/icons-material/FoodBankTwoTone';
import RamenDiningTwoToneIcon from '@mui/icons-material/RamenDiningTwoTone';
import InventoryTwoToneIcon from '@mui/icons-material/InventoryTwoTone';
import PivotTableChartTwoToneIcon from '@mui/icons-material/PivotTableChartTwoTone';
import ChairRoundedIcon from '@mui/icons-material/ChairRounded';
import StockPage from '../pages/cook/stock';
import { FoodTable2 } from '../pages/cook/recipes';
import { FoodTable } from '../pages/cook/manuallyTable';

interface RouterList {
  name: string;
  path: string;
  element?: React.ReactNode;
  icon?: React.ElementType;
  children?: RouterList[];
}

export const routerList: RouterList[] = [
  {
    name: 'dashboard',
    path: 'dashboard',
    children: [
      {
        path: '',
        name: 'home',
        element: <HomePage />,
      },
      {
        path: 'overview',
        name: 'overview',
        element: <div>overview page</div>,
        icon: AutoGraphIcon,
      },
      {
        path: 'stats',
        name: 'stats',
        element: <div>stats page</div>,
        icon: ChairRoundedIcon,
      },
    ],
  },
  {
    path: 'cooking',
    name: 'cooking',
    children: [
      {
        path: '',
        name: 'cooking home',
        element: <HomePage />,
      },
      {
        path: 'stock',
        name: 'stock',
        element: <StockPage />,
        icon: InventoryTwoToneIcon,
      },
      {
        path: 'recipes',
        name: 'recipes',
        element: < FoodTable />,
        icon: PivotTableChartTwoToneIcon,
      },
      {
        path: 'shop',
        name: 'shopping list',
        element:  <div>shopping list page</div>,
        icon: ReceiptLongTwoToneIcon,
      },
      {
        path: 'lovely-meals',
        name: 'lovely meals',
        element: <div>lovely meals page</div>,
        icon: RamenDiningTwoToneIcon,
      },
      {
        path: 'meal-plans',
        name: 'meal plans',
        element: <div>meal plans page</div>,
        icon: FoodBankTwoToneIcon,
      },
    ],
  },
  {
    path: 'money',
    name: 'money',
    children: [
      {
        path: '',
        element: <div>money main page</div>,
        icon: DonutSmallIcon,
        name: 'money',
      },
      {
        path: 'list',
        name: 'list',
        element: <div>list page</div>,
        icon: DonutSmallIcon,
      },
      {
        path: 'predicts',
        name: 'predicts',
        element: <div>predicts page</div>,
        icon: DonutSmallIcon,
      },
      {
        path: 'intencions',
        name: 'intencions',
        element: <div>buy intencions page</div>,
        icon: DonutSmallIcon,
      },
    ],
  },
];
