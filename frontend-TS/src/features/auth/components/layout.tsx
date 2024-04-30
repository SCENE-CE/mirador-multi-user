import { Grid, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { NavLink } from "react-router-dom";
type LayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const Layout = ({ children, title }: LayoutProps) => {
  return(
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={2}>
      <Grid
        item
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <NavLink to="/">
        <ArrowBackIcon />
        </NavLink>
        <Typography
          variant="h2"
          component="h1">
          {title}
        </Typography>
      </Grid>
      <Grid item>
        {children}
      </Grid>
    </Grid>
  )
}
