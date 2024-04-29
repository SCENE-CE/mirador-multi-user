import { useNavigate } from "react-router-dom";
import { Button, Grid, Typography } from "@mui/material";

export const Landing = () => {
  // let user:string;
  const navigate = useNavigate();
  // const HandleStart = () => {
  //   if (user) {
  //     navigate('/app');
  //   } else {
  //     navigate('/auth/login');
  //   }
  // };

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
    spacing={2}
    >
      <Grid item>
      <Typography variant="h2" component="h1">Welcome to SCENE</Typography>
      </Grid>
      <Grid
        item
        container
        justifyContent="center"
        spacing={2}
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
