'use client';
import { useEffect, useState, Fragment } from 'react'
import Cookies from 'js-cookie'
import {
  CssBaseline,
  Container,
  Typography,
  Alert,
  Button,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { User } from '@/types/user';
import { getUsers } from '@/lib/api';
import UserListContainer from './users/UserListContainer';

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? Cookies.get('auth_token') ?? undefined : undefined;

    getUsers(token)
      .then(setUsers)
      .catch((e) => {        
        if (e.message && (e.message.includes('401') || e.message.includes('403'))) {
          setAuthError(true);
        } else {
          setError(e.message);
        }
      });
  }, []);

  const handleGoToLogin = () => {    
    localStorage.removeItem('auth_token');
    router.push('/login');
  };

  if (authError) {
    return (
      <Container maxWidth="md">
        <CssBaseline />
        <Typography variant="h4" component="h1" gutterBottom>
          Desafio técnico Mouts TI
        </Typography>
        <Alert severity="warning">Sessão expirada. Faça login novamente.</Alert>
        <Button variant="contained" sx={{ mt: 2 }} onClick={handleGoToLogin}>
          Ir para Login
        </Button>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <CssBaseline />
        <Typography variant="h4" component="h1" gutterBottom>
          Desafio técnico Mouts TI
        </Typography>
        <Alert severity="error">Ocorreu um erro: {error}</Alert>
      </Container>
    );
  }

  return <UserListContainer initialUsers={users} />;
}
