import React, { useState } from 'react';
import {
  Box, Typography, Button, Chip, Avatar, TextField, InputAdornment,
  IconButton, Dialog, DialogContent, CircularProgress, Alert, Tooltip,
  Divider,
} from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import OutdoorGrillOutlinedIcon from '@mui/icons-material/OutdoorGrillOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import CloudOutlinedIcon from '@mui/icons-material/CloudOutlined';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../mutations/useLoginMutation';
import { authApi } from '../../api/authApi';
import { useAuth } from '../../context/useAuth';
import { useQueryClient } from '@tanstack/react-query';

// ─── Config — edit this to customise the portfolio ───────────────────────────
const PROFILE = {
  name: 'Leone Silveira',
  initials: 'LS',
  title: 'Full Stack Developer',
  tagline: 'Building real tools for real life — from kitchen to finances.',
  about:
    'Apaixonado por criar soluções práticas com código limpo e arquiteturas escaláveis. Trabalho com Python, FastAPI, React e TypeScript para construir aplicações full-stack robustas.',
  github: 'https://github.com/leone-silveira',
  linkedin: 'https://linkedin.com/in/leone-silveira',
  email: 'leone@example.com',
};

const TECH_STACK = [
  { label: 'Python',      color: '#3b82f6', icon: <CodeIcon sx={{ fontSize: 14 }} /> },
  { label: 'FastAPI',     color: '#00c7b7', icon: <CodeIcon sx={{ fontSize: 14 }} /> },
  { label: 'React',       color: '#61dafb', icon: <CodeIcon sx={{ fontSize: 14 }} /> },
  { label: 'TypeScript',  color: '#3178c6', icon: <CodeIcon sx={{ fontSize: 14 }} /> },
  { label: 'PostgreSQL',  color: '#336791', icon: <StorageIcon sx={{ fontSize: 14 }} /> },
  { label: 'SQLAlchemy',  color: '#ca2222', icon: <StorageIcon sx={{ fontSize: 14 }} /> },
  { label: 'Docker',      color: '#2496ed', icon: <CloudOutlinedIcon sx={{ fontSize: 14 }} /> },
  { label: 'Nginx',       color: '#009900', icon: <CloudOutlinedIcon sx={{ fontSize: 14 }} /> },
  { label: 'Material-UI', color: '#007fff', icon: <CodeIcon sx={{ fontSize: 14 }} /> },
  { label: 'JWT / Auth',  color: '#fb923c', icon: <CodeIcon sx={{ fontSize: 14 }} /> },
];

const PROJECTS = [
  {
    name: 'SilveiraManager',
    description:
      'Personal manager combining food stock control, recipe builder with nutritional calculation, and full expense tracking — all in one dark-themed dashboard.',
    tags: ['FastAPI', 'React', 'PostgreSQL', 'Docker', 'TypeScript'],
    accentColor: '#66bb6a',
    github: 'https://github.com/leone-silveira/3dSilveira',
    live: true,
  },
];

const APP_FEATURES = [
  {
    id: 'dashboard',
    icon: <DashboardOutlinedIcon sx={{ fontSize: 28 }} />,
    title: 'Dashboard',
    description: 'Overview of expenses, charts, monthly trends, and category breakdown.',
    color: '#29b6f6',
    path: '/dashboard',
  },
  {
    id: 'cooking',
    icon: <OutdoorGrillOutlinedIcon sx={{ fontSize: 28 }} />,
    title: 'Cooking',
    description: 'Food stock with expiry alerts, recipe builder with live nutrition calculations.',
    color: '#66bb6a',
    path: '/cooking',
  },
  {
    id: 'money',
    icon: <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 28 }} />,
    title: 'Finances',
    description: 'Expense tracking with categories, recurring bills, and budget analysis.',
    color: '#ffa726',
    path: '/money',
  },
];
// ─────────────────────────────────────────────────────────────────────────────

function NavBar({ onLoginClick, isLoggedIn, onLogout, userName }: {
  onLoginClick: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  userName: string;
}) {
  return (
    <Box
      component="nav"
      sx={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(13,13,13,0.85)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        height: 60,
        display: 'flex', alignItems: 'center', px: { xs: 3, md: 6 },
        justifyContent: 'space-between',
      }}
    >
      {/* Logo */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ width: 30, height: 30, borderRadius: 2, background: 'linear-gradient(135deg,#66bb6a,#388e3c)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RestaurantMenuIcon sx={{ color: '#fff', fontSize: 16 }} />
        </Box>
        <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#f0f0f0', letterSpacing: '-0.02em' }}>
          Silveira<span style={{ color: '#66bb6a' }}>Manager</span>
        </Typography>
      </Box>

      {/* Nav links */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}>
        {['Sobre', 'Stack', 'Projetos', 'Ferramentas'].map((label) => (
          <Button
            key={label}
            size="small"
            href={`#${label.toLowerCase()}`}
            sx={{ color: '#757575', fontSize: '0.83rem', fontWeight: 500, '&:hover': { color: '#f0f0f0', background: 'rgba(255,255,255,0.05)' } }}
          >
            {label}
          </Button>
        ))}
      </Box>

      {/* Auth */}
      {isLoggedIn ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ width: 30, height: 30, backgroundColor: '#388e3c', fontSize: '0.75rem', fontWeight: 700, border: '2px solid rgba(102,187,106,0.3)' }}>
            {userName.slice(0, 2).toUpperCase()}
          </Avatar>
          <Tooltip title="Sair" arrow>
            <IconButton size="small" onClick={onLogout} sx={{ color: '#616161', '&:hover': { color: '#ef5350' }, borderRadius: 1.5 }}>
              <LogoutOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>
      ) : (
        <Button
          size="small"
          variant="outlined"
          onClick={onLoginClick}
          sx={{ borderColor: 'rgba(102,187,106,0.4)', color: '#66bb6a', fontSize: '0.83rem', '&:hover': { borderColor: '#66bb6a', background: 'rgba(102,187,106,0.08)' } }}
        >
          Login
        </Button>
      )}
    </Box>
  );
}

function LoginModal({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess: () => void }) {
  const loginMutation = useLoginMutation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) { setError('Preencha todos os campos.'); return; }
    setError('');
    loginMutation.mutate({ username, password }, {
      onSuccess: () => { onSuccess(); onClose(); setUsername(''); setPassword(''); },
      onError: () => setError('Credenciais inválidas. Tente novamente.'),
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{ backdrop: { sx: { backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.7)' } } }}
    >
      <DialogContent sx={{ background: '#131313', p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Box sx={{ width: 44, height: 44, borderRadius: 3, background: 'linear-gradient(135deg,#66bb6a,#388e3c)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5, boxShadow: '0 4px 16px rgba(102,187,106,0.3)' }}>
            <LockOpenOutlinedIcon sx={{ color: '#fff', fontSize: 22 }} />
          </Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: '#f0f0f0' }}>Acesso Privado</Typography>
          <Typography sx={{ color: '#616161', fontSize: '0.83rem', mt: 0.5, textAlign: 'center' }}>
            Entre para acessar as ferramentas pessoais
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2, backgroundColor: 'rgba(244,67,54,0.08)', border: '1px solid rgba(244,67,54,0.18)', fontSize: '0.82rem' }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth size="small" label="Usuário" type="text"
            value={username} onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><PersonOutlineIcon sx={{ color: '#555', fontSize: 18 }} /></InputAdornment> } }}
          />
          <TextField
            fullWidth size="small" label="Senha" type={showPassword ? 'text' : 'password'}
            value={password} onChange={(e) => setPassword(e.target.value)}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ color: '#555', fontSize: 18 }} /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowPassword(!showPassword)} sx={{ color: '#555' }}>
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button
            type="submit" fullWidth variant="contained"
            disabled={loginMutation.isPending}
            sx={{ mt: 0.5, py: 1.2, background: 'linear-gradient(135deg,#66bb6a,#388e3c)', '&:hover': { background: 'linear-gradient(135deg,#81c784,#43a047)' }, '&:disabled': { background: '#1e1e1e', color: '#444' } }}
          >
            {loginMutation.isPending ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : 'Entrar'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

function FeatureCard({ feature, isLoggedIn, onLoginClick }: {
  feature: typeof APP_FEATURES[0];
  isLoggedIn: boolean;
  onLoginClick: () => void;
}) {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        flex: '1 1 260px',
        minWidth: 240,
        position: 'relative',
        borderRadius: 3,
        border: `1px solid ${isLoggedIn ? `${feature.color}30` : 'rgba(255,255,255,0.06)'}`,
        background: '#161616',
        overflow: 'hidden',
        transition: 'all 0.25s ease',
        cursor: isLoggedIn ? 'pointer' : 'default',
        ...(isLoggedIn && {
          '&:hover': {
            border: `1px solid ${feature.color}50`,
            transform: 'translateY(-4px)',
            boxShadow: `0 12px 32px rgba(0,0,0,0.4), 0 0 0 1px ${feature.color}20`,
          },
        }),
        '&::before': {
          content: '""',
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: isLoggedIn ? `linear-gradient(90deg, ${feature.color}, transparent)` : 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)',
        },
      }}
      onClick={() => isLoggedIn && navigate(feature.path)}
    >
      {/* Card content */}
      <Box sx={{ p: 3, filter: isLoggedIn ? 'none' : 'grayscale(1)', opacity: isLoggedIn ? 1 : 0.35, transition: 'all 0.25s' }}>
        <Box sx={{ width: 48, height: 48, borderRadius: 2.5, backgroundColor: `${feature.color}18`, border: `1px solid ${feature.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: feature.color, mb: 2 }}>
          {feature.icon}
        </Box>
        <Typography sx={{ fontWeight: 700, color: '#f0f0f0', mb: 1, fontSize: '1rem' }}>{feature.title}</Typography>
        <Typography sx={{ color: '#616161', fontSize: '0.83rem', lineHeight: 1.65 }}>{feature.description}</Typography>
      </Box>

      {/* Lock overlay */}
      {!isLoggedIn && (
        <Box
          sx={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 1.5, p: 3,
          }}
        >
          <Box sx={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LockOutlinedIcon sx={{ color: '#424242', fontSize: 18 }} />
          </Box>
          <Button
            size="small"
            onClick={onLoginClick}
            sx={{ color: '#66bb6a', fontSize: '0.78rem', fontWeight: 600, background: 'rgba(102,187,106,0.08)', border: '1px solid rgba(102,187,106,0.2)', borderRadius: 2, px: 2, py: 0.5, '&:hover': { background: 'rgba(102,187,106,0.15)' } }}
          >
            Login para acessar
          </Button>
        </Box>
      )}

      {/* Open arrow when logged in */}
      {isLoggedIn && (
        <Box sx={{ px: 3, pb: 2.5, display: 'flex', alignItems: 'center', gap: 0.5, color: feature.color }}>
          <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: 'inherit' }}>Abrir</Typography>
          <ArrowForwardIcon sx={{ fontSize: 14 }} />
        </Box>
      )}
    </Box>
  );
}

export const LandingPage: React.FC = () => {
  const { isLoggedIn, user, refetchAuth } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      queryClient.setQueryData(['auth-me'], null);
      refetchAuth();
    }
  };

  const handleLoginSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['auth-me'] });
    refetchAuth();
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0d0d0d', color: '#f0f0f0', fontFamily: '"Inter", "Roboto", sans-serif' }}>
      <NavBar onLoginClick={() => setLoginOpen(true)} isLoggedIn={isLoggedIn} onLogout={handleLogout} userName={user?.username || 'LS'} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} onSuccess={handleLoginSuccess} />

      {/* ── HERO ── */}
      <Box
        id="sobre"
        sx={{
          minHeight: '100vh',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          textAlign: 'center', px: { xs: 3, md: 6 }, pt: 10, pb: 6,
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Background orbs */}
        <Box sx={{ position: 'absolute', top: '15%', left: '10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(102,187,106,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: '10%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,167,38,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Avatar */}
        <Avatar
          sx={{
            width: 96, height: 96,
            background: 'linear-gradient(135deg, #388e3c, #1b5e20)',
            fontSize: '2rem', fontWeight: 800, mb: 3,
            border: '3px solid rgba(102,187,106,0.25)',
            boxShadow: '0 8px 32px rgba(102,187,106,0.2)',
          }}
        >
          {PROFILE.initials}
        </Avatar>

        {/* Tag */}
        <Chip
          label="Available for opportunities"
          size="small"
          sx={{ mb: 2.5, backgroundColor: 'rgba(102,187,106,0.1)', color: '#66bb6a', border: '1px solid rgba(102,187,106,0.25)', fontSize: '0.75rem', fontWeight: 600 }}
        />

        <Typography
          variant="h1"
          sx={{ fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' }, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, mb: 1.5 }}
        >
          {PROFILE.name}
        </Typography>
        <Typography
          sx={{ fontSize: { xs: '1.1rem', md: '1.4rem' }, color: '#66bb6a', fontWeight: 600, mb: 2 }}
        >
          {PROFILE.title}
        </Typography>
        <Typography
          sx={{ fontSize: { xs: '0.95rem', md: '1.05rem' }, color: '#616161', maxWidth: 560, lineHeight: 1.75, mb: 4 }}
        >
          {PROFILE.about}
        </Typography>

        {/* CTAs */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            href="#projetos"
            variant="contained"
            sx={{ background: 'linear-gradient(135deg,#66bb6a,#388e3c)', px: 3, py: 1.2, fontWeight: 600, boxShadow: '0 4px 16px rgba(102,187,106,0.25)', '&:hover': { background: 'linear-gradient(135deg,#81c784,#43a047)', transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(102,187,106,0.35)' } }}
          >
            Ver Projetos
          </Button>
          <Button
            href={PROFILE.github} target="_blank" rel="noopener noreferrer"
            variant="outlined"
            startIcon={<GitHubIcon sx={{ fontSize: 18 }} />}
            sx={{ borderColor: 'rgba(255,255,255,0.15)', color: '#9e9e9e', px: 3, py: 1.2, '&:hover': { borderColor: 'rgba(255,255,255,0.4)', color: '#f0f0f0', background: 'rgba(255,255,255,0.04)' } }}
          >
            GitHub
          </Button>
          {isLoggedIn && (
            <Button
              href="/dashboard"
              variant="outlined"
              endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
              sx={{ borderColor: 'rgba(102,187,106,0.35)', color: '#66bb6a', px: 3, py: 1.2, '&:hover': { borderColor: '#66bb6a', background: 'rgba(102,187,106,0.08)' } }}
            >
              Abrir App
            </Button>
          )}
        </Box>

        {/* Social links */}
        <Box sx={{ display: 'flex', gap: 1.5, mt: 4 }}>
          {[
            { icon: <GitHubIcon sx={{ fontSize: 20 }} />, href: PROFILE.github, label: 'GitHub' },
            { icon: <LinkedInIcon sx={{ fontSize: 20 }} />, href: PROFILE.linkedin, label: 'LinkedIn' },
            { icon: <EmailOutlinedIcon sx={{ fontSize: 20 }} />, href: `mailto:${PROFILE.email}`, label: 'Email' },
          ].map((s) => (
            <Tooltip key={s.label} title={s.label} arrow>
              <IconButton
                href={s.href} target="_blank" rel="noopener noreferrer"
                sx={{ color: '#424242', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 2, '&:hover': { color: '#9e9e9e', borderColor: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.04)' } }}
              >
                {s.icon}
              </IconButton>
            </Tooltip>
          ))}
        </Box>
      </Box>

      {/* ── TECH STACK ── */}
      <Box id="stack" sx={{ py: 8, px: { xs: 3, md: 8 }, maxWidth: 900, mx: 'auto' }}>
        <SectionLabel>Tech Stack</SectionLabel>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '1.8rem', md: '2.25rem' }, letterSpacing: '-0.02em' }}>
          Ferramentas que uso
        </Typography>
        <Typography sx={{ color: '#616161', mb: 4, fontSize: '0.95rem' }}>
          Stack principal do dia a dia
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          {TECH_STACK.map((tech) => (
            <Box
              key={tech.label}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1,
                px: 2, py: 1,
                background: '#161616',
                border: `1px solid ${tech.color}25`,
                borderRadius: 2,
                transition: 'all 0.2s',
                '&:hover': { borderColor: `${tech.color}60`, background: `${tech.color}0a`, transform: 'translateY(-2px)' },
              }}
            >
              <Box sx={{ color: tech.color }}>{tech.icon}</Box>
              <Typography sx={{ color: '#c0c0c0', fontSize: '0.85rem', fontWeight: 500 }}>{tech.label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mx: { xs: 3, md: 8 } }} />

      {/* ── PERSONAL TOOLS ── */}
      <Box id="ferramentas" sx={{ py: 8, px: { xs: 3, md: 8 }, maxWidth: 1000, mx: 'auto' }}>
        <SectionLabel>Ferramentas</SectionLabel>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2, mb: 4 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5, fontSize: { xs: '1.8rem', md: '2.25rem' }, letterSpacing: '-0.02em' }}>
              Ferramentas Pessoais
            </Typography>
            <Typography sx={{ color: '#616161', fontSize: '0.95rem' }}>
              {isLoggedIn
                ? 'Você tem acesso completo. Clique para abrir.'
                : 'Módulos do app — faça login para acessar.'}
            </Typography>
          </Box>
          {!isLoggedIn && (
            <Button
              onClick={() => setLoginOpen(true)}
              variant="outlined"
              startIcon={<LockOpenOutlinedIcon sx={{ fontSize: 16 }} />}
              size="small"
              sx={{ borderColor: 'rgba(102,187,106,0.35)', color: '#66bb6a', '&:hover': { borderColor: '#66bb6a', background: 'rgba(102,187,106,0.08)' } }}
            >
              Fazer Login
            </Button>
          )}
          {isLoggedIn && (
            <Chip
              icon={<LockOpenOutlinedIcon sx={{ fontSize: 14, color: '#66bb6a !important' }} />}
              label="Acesso liberado"
              size="small"
              sx={{ backgroundColor: 'rgba(102,187,106,0.1)', color: '#66bb6a', border: '1px solid rgba(102,187,106,0.25)', fontWeight: 600 }}
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap' }}>
          {APP_FEATURES.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} isLoggedIn={isLoggedIn} onLoginClick={() => setLoginOpen(true)} />
          ))}
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mx: { xs: 3, md: 8 } }} />

      {/* ── PROJECTS ── */}
      <Box id="projetos" sx={{ py: 8, px: { xs: 3, md: 8 }, maxWidth: 1000, mx: 'auto' }}>
        <SectionLabel>Projetos</SectionLabel>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '1.8rem', md: '2.25rem' }, letterSpacing: '-0.02em' }}>
          Projetos em Destaque
        </Typography>
        <Typography sx={{ color: '#616161', mb: 4, fontSize: '0.95rem' }}>
          Aplicações construídas do zero
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {PROJECTS.map((project) => (
            <Box
              key={project.name}
              sx={{
                p: 4,
                background: '#161616',
                border: `1px solid ${project.accentColor}20`,
                borderRadius: 3,
                position: 'relative', overflow: 'hidden',
                '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${project.accentColor}, transparent)` },
                transition: 'all 0.25s',
                '&:hover': { borderColor: `${project.accentColor}40`, transform: 'translateY(-2px)', boxShadow: `0 8px 24px rgba(0,0,0,0.4)` },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: '#f0f0f0', mb: 0.5 }}>{project.name}</Typography>
                  <Typography sx={{ color: '#757575', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: 600 }}>{project.description}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Ver no GitHub" arrow>
                    <IconButton
                      href={project.github} target="_blank" rel="noopener noreferrer"
                      size="small"
                      sx={{ color: '#616161', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 1.5, '&:hover': { color: '#f0f0f0', borderColor: 'rgba(255,255,255,0.2)' } }}
                    >
                      <GitHubIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                  {project.live && isLoggedIn && (
                    <Tooltip title="Abrir App" arrow>
                      <IconButton
                        href="/dashboard"
                        size="small"
                        sx={{ color: project.accentColor, border: `1px solid ${project.accentColor}30`, borderRadius: 1.5, '&:hover': { background: `${project.accentColor}15`, borderColor: `${project.accentColor}60` } }}
                      >
                        <OpenInNewIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {project.tags.map((tag) => (
                  <Chip
                    key={tag} label={tag} size="small"
                    sx={{ backgroundColor: 'rgba(255,255,255,0.04)', color: '#757575', border: '1px solid rgba(255,255,255,0.08)', fontSize: '0.72rem', fontWeight: 500, height: 22 }}
                  />
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── FOOTER ── */}
      <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.05)', py: 4, px: { xs: 3, md: 8 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography sx={{ color: '#424242', fontSize: '0.8rem' }}>
          © {new Date().getFullYear()} {PROFILE.name} · Built with React + FastAPI
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <IconButton href={PROFILE.github} target="_blank" size="small" sx={{ color: '#424242', '&:hover': { color: '#9e9e9e' } }}>
            <GitHubIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton href={PROFILE.linkedin} target="_blank" size="small" sx={{ color: '#424242', '&:hover': { color: '#9e9e9e' } }}>
            <LinkedInIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton href={`mailto:${PROFILE.email}`} size="small" sx={{ color: '#424242', '&:hover': { color: '#9e9e9e' } }}>
            <EmailOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

// ─── Helper ──────────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography sx={{ color: '#66bb6a', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', mb: 1 }}>
      {children}
    </Typography>
  );
}
