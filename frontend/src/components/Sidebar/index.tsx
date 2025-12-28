import {
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SideBarBox } from './styles';
import { sideBarList } from '../../configs/barList';
import { SystemContext } from '../../context/useSystem';
import KeyboardDoubleArrowRightTwoToneIcon from '@mui/icons-material/KeyboardDoubleArrowRightTwoTone';
import KeyboardDoubleArrowLeftTwoToneIcon from '@mui/icons-material/KeyboardDoubleArrowLeftTwoTone';

export const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { system } = useContext(SystemContext);
  const currentPage =
    sideBarList.find((item) => item.name === system)?.optionList || [];
  return (
    <SideBarBox isOpened={open}>
      {currentPage.map((item) => (
        <ListItemButton key={item.name} onClick={() => navigate(item.path)}>
          <ListItemIcon sx={{ justifyContent: 'center' }}>
            <item.icon />
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
