import { HomePage } from "../pages/home";
import { LoginPage } from "../pages/login";
import { FoodTable } from "../pages/manuallyTable";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import LoginIcon from '@mui/icons-material/Login';
    
export const routesConfig = [
  {
    path: "/home",
    element: <HomePage />,
    icon: <HomeIcon />  ,
  },
  {
    path: "/manuallyLife",
    element: <FoodTable />,
    icon: <MenuIcon />,
  },
    {
    path: "/login",
    element: <LoginPage />,
    icon: <LoginIcon />,
  },
];
