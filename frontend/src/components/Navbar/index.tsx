import { ListItemButton } from '@mui/material';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SystemContext } from '../../context/useSystem';
import { StyledBox } from './styles';
import { routerList } from '../../configs/routerList';

export const Navbar: React.FC = () => {
  const { setSystem } = useContext(SystemContext);
  const navigate = useNavigate();

  return (
    <StyledBox sx={{ width: '100%' }}>
      {routerList.map((item) => (
        <ListItemButton
          key={item.name}
          onClick={() => {
            setSystem(item.name || '');
            navigate(item.path || '.');
          }}
        >
          {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
        </ListItemButton>
      ))}
    </StyledBox>
  );
};
