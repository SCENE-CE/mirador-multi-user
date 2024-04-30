import { useNavigate } from 'react-router-dom';

import { Layout } from '../components/layout';
import { LoginForm } from '../components/LoginForm';
import { Grid } from "@mui/material";

export const Login = () => {
  const navigate = useNavigate();

  return (
    <Grid
      container
      spacing={2}
      justifyContent="center"
      alignItems="center"
    >
    <Layout title="Log in to your account">
      <LoginForm onSuccess={() => navigate('/')} />
    </Layout>
    </Grid>
  );
};
