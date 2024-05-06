import { Grid, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { NavLink } from "react-router-dom";
type LayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const  Layout = ({ children, title }: LayoutProps) => {
  return(
    <Grid
      container
      direction="column"
      justifyContent="space-around"
      alignItems="center"
      min-height="100vh"
    >
      <Grid
        item
        container
        direction="row"
        justifyContent="space-around"
        alignItems="center"
      >
        <Grid item>
        <NavLink to="/">
        <ArrowBackIcon />
        </NavLink>
        </Grid>
        <Grid item>
        <Typography
          variant="h2"
          component="h1">
          {title}
        </Typography>
        </Grid>
        {
          title==="Create your account" &&(
            <Grid>
              <NavLink to="/auth/login">
                <Typography variant="button">
                  LOGIN
                </Typography>
              </NavLink>
            </Grid>
          )
        }
        {
          title==="Log in to your account"&&(
            <Grid>
              <NavLink to="/auth/signin">
                <Typography variant="button">
                  REGISTER
                </Typography>
              </NavLink>
            </Grid>
          )
        }
      </Grid>
      <Grid item container
            direction="column"
            justifyContent="center"
            alignItems="center"
            minHeight="80vh"
      >
        {children}
      </Grid>
    </Grid>
  )
}
