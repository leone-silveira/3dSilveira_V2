import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  // sGrid,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = () => {
    if (email && password) {
      console.log("Email:", email);
      console.log("Password:", password);
      alert("Login realizado com sucesso!");
      navigate("/home");
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
