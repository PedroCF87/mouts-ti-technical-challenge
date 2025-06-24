"use client";

import { Box, Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Link from 'next/link';
import { useForm, Controller, FieldValues } from 'react-hook-form';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { User } from '@/types/user';
import { getUserById, updateUser, deleteUser } from '@/lib/api';

export default function EditUserPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('edit');
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<Omit<User, 'password' | 'createdAt' | 'updatedAt'> | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'user',
      isActive: true,
    },
  });

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getUserById(userId)
      .then((user) => {

        console.log('>> getUserById > user:', user)

        setInitialData(user);
        reset({
          name: user.name,
          email: user.email,
          password: '',
          role: user.role,
          isActive: user.isActive,
        });
      })
      .finally(() => setLoading(false));
  }, [userId, reset]);

  const onSubmit = (data: FieldValues) => {
    if (!userId) return;
    setLoading(true);
    // Remove o campo senha se estiver vazio
    const submitData = { ...data };
    if (!submitData.password) {
      delete submitData.password;
    }
    updateUser(userId, submitData as Omit<User, 'id' | 'createdAt' | 'updatedAt'>)
      .then(() => router.push('/'))
      .finally(() => setLoading(false));
  };

  const handleDelete = async () => {
    if (!userId) return;
    setDeleteLoading(true);
    try {
      await deleteUser(userId);
      router.push('/');
    } catch (error) {
      // Trate o erro conforme necessário (ex: exibir mensagem)
      console.error(error);
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  if (!userId) {
    return <Typography>Usuário não encontrado.</Typography>;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        marginTop: 4,
      }}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        name="name"
        control={control}
        rules={{ required: 'Nome é obrigatório' }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Nome"
            variant="outlined"
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        )}
      />
      <Controller
        name="email"
        control={control}
        rules={{
          required: 'Email é obrigatório',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Email inválido',
          },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Email"
            variant="outlined"
            type="email"
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        )}
      />
      <Controller
        name="password"
        control={control}
        rules={{}}
        render={({ field }) => (
          <TextField
            {...field}
            label="Senha (deixe em branco para não alterar)"
            variant="outlined"
            type="password"
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        )}
      />
      <Controller
        name="role"
        control={control}
        rules={{ required: 'Perfil é obrigatório' }}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.role}>
            <InputLabel>Perfil</InputLabel>
            <Select {...field} label="Perfil">
              <MenuItem value="user">Usuário</MenuItem>
              <MenuItem value="admin">Administrador</MenuItem>
            </Select>
            {errors.role && <FormHelperText>{errors.role.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
        <Button
          variant="outlined"
          color="error"
          onClick={() => setDeleteDialogOpen(true)}
          disabled={loading || deleteLoading}
        >
          Excluir
        </Button>
        <Box>
          <Link href="/" passHref>
            <Button variant="outlined" disabled={loading || deleteLoading}>
              Cancelar
            </Button>
          </Link>
          <Button type="submit" variant="contained" disabled={loading || deleteLoading} sx={{ ml: 1 }}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </Box>
      </Box>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Tem certeza que deseja excluir este usuário? Esta ação não poderá ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleteLoading}>
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error" disabled={deleteLoading} autoFocus>
            {deleteLoading ? 'Excluindo...' : 'Excluir'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
