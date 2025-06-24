"use client";
import React, { useState, useEffect } from "react";
import { CssBaseline, Container, Typography, Alert, Box, Button } from "@mui/material";
import Link from "next/link";
import UserList from "./UserList";
import { User } from "@/types/user";
import AddIcon from '@mui/icons-material/Add';
import { deleteUser } from '@/lib/api';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

export default function UserListContainer({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  const handleDelete = async (id: string) => {
    setDeleteLoading(true);
    setError(null);
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setDeleteId(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar usuário');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="md">
        <Typography variant="h4" component="h1" gutterBottom>
          Desafio técnico Mouts TI
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h5" component="h2" gutterBottom>
            Lista de Usuários
          </Typography>
          <Link href="/users/new" passHref>
            <Button variant="contained" startIcon={<AddIcon />}>Novo</Button>
          </Link>
        </Box>
        {error && <Alert severity="error">Ocorreu um erro: {error}</Alert>}
        {!error && <UserList users={users} onDelete={(id) => setDeleteId(id)} />}
      </Container>
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>Tem certeza que deseja excluir este usuário? Esta ação não poderá ser desfeita.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)} disabled={deleteLoading}>Cancelar</Button>
          <Button onClick={() => deleteId && handleDelete(deleteId)} color="error" disabled={deleteLoading} autoFocus>
            {deleteLoading ? 'Excluindo...' : 'Excluir'}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
