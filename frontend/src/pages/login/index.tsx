import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LoginWrapper, StyledPaper } from "./styles";
import { Box, Button, TextField, Typography } from "@mui/material";

const schema = z.object({
  email: z.string().email("Digite um e-mail válido"),
  password: z.string().min(6, "A senha precisa de no mínimo 6 caracteres"),
});

type FormData = z.infer<typeof schema>;

export const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    console.log(data);
    window.alert("loging...");
  };

  return (
    <LoginWrapper>
      <StyledPaper elevation={3}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            fullWidth
            label="E-mail"
            type="email"
            margin="normal"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            fullWidth
            label="Senha"
            type="password"
            margin="normal"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Entrar
          </Button>

          <Typography variant="body2" align="center" mt={2}>
            Não tem conta?{" "}
            <a href="/register" style={{ color: "#1976d2" }}>
              Registrar
            </a>
          </Typography>
        </Box>
      </StyledPaper>
    </LoginWrapper>
  );
};
