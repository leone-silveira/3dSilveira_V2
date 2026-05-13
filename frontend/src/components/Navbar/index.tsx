import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Avatar, Chip, Tooltip, IconButton } from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import OutdoorGrillOutlinedIcon from '@mui/icons-material/OutdoorGrillOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { SystemContext } from '../../context/useSystem';
import { useAuth } from '../../context/useAuth';
import { authApi } from '../../api/authApi';
import { useQueryClient } from '@tanstack/react-query';
import { StyledBox, NavItems, NavButton, LogoBadge, MobileMenuButton } from './styles';
import { routerList } from '../../configs/routerList';

const NAV_ICONS: Record<string, React.ReactNode> = {
  dashboard: <DashboardOutlinedIcon sx={{ fontSize: 16 }} />,
  cooking: <OutdoorGrillOutlinedIcon sx={{ fontSize: 16 }} />,
  money: <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 16 }} />,
};

interface NavbarProps {
  onMobileMenuClick?: () => void;
  mobileOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onMobileMenuClick, mobileOpen = false }) => {
  const { system, setSystem } = useContext(SystemContext);
  const { user, refetchAuth } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      queryClient.setQueryData(['auth-me'], null);
      refetchAuth();
      navigate('/');
    }
  };

  return (
    <StyledBox>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
        <MobileMenuButton
          aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
          onClick={onMobileMenuClick}
        >
          {mobileOpen ? <CloseIcon sx={{ fontSize: 20 }} /> : <MenuIcon sx={{ fontSize: 20 }} />}
        </MobileMenuButton>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            cursor: 'pointer',
            minWidth: 0,
          }}
          onClick={() => navigate('/')}
        >
          <LogoBadge>
            <RestaurantMenuIcon sx={{ color: '#fff', fontSize: 18 }} />
          </LogoBadge>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: '0.95rem',
              color: '#f0f0f0',
              letterSpacing: '-0.02em',
              userSelect: 'none',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            Silveira<span style={{ color: '#66bb6a' }}>Manager</span>
          </Typography>
        </Box>
      </Box>

      <NavItems>
        {routerList.map((item) => (
          <NavButton
            key={item.name}
            active={system === item.name}
            onClick={() => {
              setSystem(item.name || '');
              navigate(item.path || '.');
            }}
            aria-label={item.name}
          >
            {NAV_ICONS[item.name]}
            <span>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</span>
          </NavButton>
        ))}
      </NavItems>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end', flexShrink: 0 }}>
        <Chip
          label="v2.0"
          size="small"
          sx={{
            backgroundColor: 'rgba(102,187,106,0.1)',
            color: '#66bb6a',
            border: '1px solid rgba(102,187,106,0.2)',
            fontSize: '0.7rem',
            fontWeight: 700,
            height: 22,
            display: { xs: 'none', md: 'inline-flex' },
          }}
        />
        <Tooltip title="Voltar ao portfolio" arrow>
          <IconButton
            size="small"
            onClick={() => navigate('/')}
            sx={{
              color: '#424242',
              '&:hover': { color: '#9e9e9e' },
              borderRadius: 1.5,
              display: { xs: 'none', sm: 'inline-flex' },
            }}
          >
            <HomeOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title={`Sair (${user?.username || ''})`} arrow>
          <IconButton
            size="small"
            onClick={handleLogout}
            sx={{ color: '#424242', '&:hover': { color: '#ef5350', background: 'rgba(239,83,80,0.08)' }, borderRadius: 1.5 }}
          >
            <LogoutOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <Avatar sx={{ width: 32, height: 32, backgroundColor: '#388e3c', fontSize: '0.8rem', fontWeight: 700, border: '2px solid rgba(102,187,106,0.3)' }}>
          {user?.username?.slice(0, 2).toUpperCase() || 'LS'}
        </Avatar>
      </Box>
    </StyledBox>
  );
};
