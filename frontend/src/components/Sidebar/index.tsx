import {
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SideBarBox } from './styles';
import { SystemContext } from '../../context/useSystem';
import KeyboardDoubleArrowRightTwoToneIcon from '@mui/icons-material/KeyboardDoubleArrowRightTwoTone';
import KeyboardDoubleArrowLeftTwoToneIcon from '@mui/icons-material/KeyboardDoubleArrowLeftTwoTone';
import { routerList } from '../../configs/routerList';
import { resolvePath } from '../../utils/utils';

export const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { system } = useContext(SystemContext);
  const currentPage =
    routerList.find((item) => item.name === system)?.children || [];
  const currentPageFiltered = currentPage.filter((item) => item.path !== '');

  return (
    <SideBarBox isOpened={open}>
      {currentPageFiltered.map((item) => (
        <ListItemButton key={item.name} onClick={() => navigate(resolvePath(system, item.path))}>
          <ListItemIcon sx={{ justifyContent: 'center' }}>
            {item.icon && <item.icon />}
          </ListItemIcon>
          {open && <ListItemText primary={item.name} />}
        </ListItemButton>
      ))}
      <Divider />
      <ListItemButton onClick={() => setOpen(!open)}>
        {open ? (
          <KeyboardDoubleArrowLeftTwoToneIcon />
        ) : (
          <KeyboardDoubleArrowRightTwoToneIcon />
        )}
      </ListItemButton>
    </SideBarBox>
  );
};
