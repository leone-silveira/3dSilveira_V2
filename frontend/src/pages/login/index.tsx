import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import KitchenOutlinedIcon from '@mui/icons-material/KitchenOutlined';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../mutations/useLoginMutation';

const FEATURES = [
  { icon: <KitchenOutlinedIcon />, label: 'Food inventory & stock control' },
  { icon: <RestaurantMenuIcon />, label: 'Recipe builder & nutrition tracking' },
  { icon: <AccountBalanceWalletOutlinedIcon />, label: 'Expense management & budgets' },
];

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    setError('');
    loginMutation.mutate(
      { username, password },
      {
        onSuccess: () => navigate('/dashboard'),
        onError: () => setError('Credenciais inválidas. Verifique e tente novamente.'),
      }
    );
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        backgroundColor: '#0d0d0d',
        fontFamily: '"Inter", "Roboto", sans-serif',
      }}
    >
      {/* Left panel — branding */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flex: '0 0 45%',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '60px 64px',
          background: 'linear-gradient(145deg, #0f2010 0%, #0d0d0d 50%, #1a1a08 100%)',
          position: 'relative',
          overflow: 'hidden',
          borderRight: '1px solid rgba(102,187,106,0.12)',
        }}
      >
        {/* Decorative circles */}
        <Box sx={{
          position: 'absolute', top: '-80px', left: '-80px',
          width: 360, height: 360, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(102,187,106,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <Box sx={{
          position: 'absolute', bottom: '-60px', right: '-60px',
          width: 280, height: 280, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,167,38,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 6 }}>
          <Box sx={{
            width: 44, height: 44, borderRadius: 3,
            background: 'linear-gradient(135deg, #66bb6a, #388e3c)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(102,187,106,0.35)',
          }}>
            <RestaurantMenuIcon sx={{ color: '#fff', fontSize: 24 }} />
          </Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: '#f0f0f0', letterSpacing: '-0.02em' }}>
            Silveira<span style={{ color: '#66bb6a' }}>Manager</span>
          </Typography>
        </Box>

        <Typography variant="h2" sx={{ color: '#f0f0f0', fontWeight: 800, lineHeight: 1.15, mb: 2, fontSize: { md: '2.25rem', lg: '2.75rem' } }}>
          Sua cozinha e finanças,{' '}
          <Box component="span" sx={{ color: '#66bb6a' }}>organizadas.</Box>
        </Typography>

        <Typography sx={{ color: '#757575', fontSize: '1rem', lineHeight: 1.7, mb: 5, maxWidth: 380 }}>
          Controle estoque, monte receitas com cálculo nutricional e acompanhe seus gastos — tudo em um só lugar.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {FEATURES.map((f) => (
            <Box key={f.label} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                width: 36, height: 36, borderRadius: 2,
                backgroundColor: 'rgba(102,187,106,0.12)',
                border: '1px solid rgba(102,187,106,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#66bb6a', flexShrink: 0,
              }}>
                {f.icon}
              </Box>
              <Typography sx={{ color: '#9e9e9e', fontSize: '0.9rem' }}>{f.label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Right panel — form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: { xs: '32px 24px', md: '60px 80px' },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          {/* Mobile logo */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.5, mb: 5, justifyContent: 'center' }}>
            <Box sx={{
              width: 40, height: 40, borderRadius: 3,
              background: 'linear-gradient(135deg, #66bb6a, #388e3c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <RestaurantMenuIcon sx={{ color: '#fff', fontSize: 22 }} />
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#f0f0f0' }}>
              Silveira<span style={{ color: '#66bb6a' }}>Manager</span>
            </Typography>
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: '#f0f0f0' }}>
            Bem-vindo de volta
          </Typography>
          <Typography sx={{ color: '#757575', mb: 4, fontSize: '0.95rem' }}>
            Entre para acessar seu painel
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3, borderRadius: 2, backgroundColor: 'rgba(244,67,54,0.1)', border: '1px solid rgba(244,67,54,0.2)' }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              fullWidth
              label="Usuário"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineIcon sx={{ color: '#555', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              fullWidth
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: '#555', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: '#555' }}
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loginMutation.isPending}
              sx={{
                mt: 1,
                py: 1.5,
                fontSize: '1rem',
                background: 'linear-gradient(135deg, #66bb6a, #388e3c)',
                boxShadow: '0 4px 16px rgba(102,187,106,0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #81c784, #43a047)',
                  boxShadow: '0 6px 20px rgba(102,187,106,0.4)',
                  transform: 'translateY(-2px)',
                },
                '&:disabled': { background: '#2a2a2a', color: '#555' },
              }}
            >
              {loginMutation.isPending ? (
                <CircularProgress size={22} sx={{ color: '#fff' }} />
              ) : (
                'Entrar'
              )}
            </Button>
          </Box>

          <Typography sx={{ mt: 4, textAlign: 'center', color: '#555', fontSize: '0.8rem' }}>
            SilveiraManager © {new Date().getFullYear()}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
