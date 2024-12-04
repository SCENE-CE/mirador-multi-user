import { useNavigate } from "react-router-dom";
import { Button, Grid, Typography } from "@mui/material";
import { theme } from "../../assets/theme/mainTheme.ts";

export const Landing = () => {
  const navigate = useNavigate();


  const HandleSignIn= ()=>{
    navigate('/auth/signin');
  }
  const HandleLogin= ()=>{
    navigate( '/auth/login');
  }
  return(
    <Grid
    container
    direction="column"
    justifyContent="center"
    alignItems="center"
    spacing={10}
    minHeight={'100vh'}
    sx={{
      backgroundImage: theme.palette.backgroundImage,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      marginTop:0
    }}
    >
      <Grid item>
      <Typography variant="h2" component="h1">Welcome to ARVEST</Typography>
      </Grid>
      <Grid
        item
        container
        justifyContent="center"
        spacing={5}
        alignItems="center"
      >
        <Grid item>
          <Button  variant="contained" onClick={HandleSignIn}>Create account</Button>
        </Grid>
        <Grid item>
          <Button  variant="contained" onClick={HandleLogin}>Login</Button>
        </Grid>
      </Grid>
    </Grid>
  )
}
