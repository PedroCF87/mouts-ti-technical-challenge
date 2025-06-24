'use client';

import { Box, Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import Link from 'next/link';
import { useCreateUserMutation } from '@/hooks/mutations/useCreateUserMutation';
import { useForm, Controller, FieldValues } from 'react-hook-form';
import { User } from '@/types/user';

export default function NewUserPage() {
  const { mutate: createUser, isPending } = useCreateUserMutation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'user',
      isActive: true,
    },
  });

  const onSubmit = (data: FieldValues) => {
    createUser(data as Omit<User, 'id' | 'createdAt' | 'updatedAt'>);
  };

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
        rules={{ required: 'Senha é obrigatória' }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Senha"
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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Link href="/" passHref>
          <Button variant="outlined" disabled={isPending}>
            Cancelar
          </Button>
        </Link>
        <Button type="submit" variant="contained" disabled={isPending}>
          {isPending ? 'Salvando...' : 'Salvar'}
        </Button>
      </Box>
    </Box>
  );
}
