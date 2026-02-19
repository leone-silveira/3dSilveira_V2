import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../mutations/useLoginMutation';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };
  const handleLogin = () => {
    if (username && password) {
      loginMutation.mutate(
        { username, password },
        {
          onSuccess: (data) => {
            console.log('Login successful:', data);
            navigate('/homePage');
          },
          onError: (error) => {
            console.error('Login failed:', error);
            alert(
              'Falha no login. Verifique suas credenciais e tente novamente.'
            );
          },
        }
      );
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{ mt: 2 }}
          onSubmit={handleSubmit}
        >
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
            required
          />
          <TextField
            fullWidth
            label="Senha"
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            required
          />
          <Box sx={{ mt: 4 }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleLogin}
            >
              Entrar
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};
