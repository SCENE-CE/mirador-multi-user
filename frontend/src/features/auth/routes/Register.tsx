import { RegisterForm } from "../components/RegisterForm.tsx";
import { Layout } from "../components/layout.tsx";
import { Grid, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

export const Register = ()=>{
    return(
      <Layout
        title="Create your account"
        rightButton={
            <Grid>
              <NavLink to="/auth/login">
                <Typography variant="button">
                  LOGIN
                </Typography>
              </NavLink>
            </Grid>
        }
      >
        <RegisterForm />
      </Layout>
    )
}
