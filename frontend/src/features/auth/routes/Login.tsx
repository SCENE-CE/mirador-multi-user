import { Layout } from '../components/layout';
import { LoginForm } from '../components/LoginForm';
import { Grid, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

export const Login = () => {

  return (
    <Layout title="Log in to your account" rightButton={
      <Grid>
      <NavLink to="/auth/signin">
        <Typography variant="button">
          REGISTER
        </Typography>
      </NavLink>
    </Grid>
    }>
      <LoginForm />
    </Layout>
  );
};
