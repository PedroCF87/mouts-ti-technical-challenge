'use client';

import { useState, Fragment } from 'react';
import { Container, TextField, Button, Typography, Box, CssBaseline } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { login } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const router = useRouter();

  const { mutate, isError, error } = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: () => {
      console.log('Login bem-sucedido, redirecionando para home.');
      router.push('/');
    },
    onError: (err) => {
      console.error('Erro ao fazer login:', err);
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setEmailError(email === '');
    setPasswordError(password === '');

    if (email && password) {
      mutate();
    }
  };

  return (
    <Fragment>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          {isError && <Typography color="error">{(error as Error).message}</Typography>}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
              helperText={emailError ? 'Email é obrigatório' : ''}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError}
              helperText={passwordError ? 'Senha é obrigatória' : ''}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Entrar
            </Button>
          </Box>
        </Box>
      </Container>
    </Fragment>
  );
}
