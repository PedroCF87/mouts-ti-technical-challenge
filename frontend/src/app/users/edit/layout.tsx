import { Container, CssBaseline, Typography } from '@mui/material';
import { Fragment } from 'react';

export default function NewUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Fragment>
      <CssBaseline />
      <Container maxWidth="md">
        <Typography variant="h4" component="h1" gutterBottom>
          Editar usuário
        </Typography>
        {children}
      </Container>
    </Fragment>
  );
}
