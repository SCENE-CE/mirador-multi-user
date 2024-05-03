import { useUser } from "../../utils/auth.tsx";
import { Grid, Typography } from "@mui/material";

export const MyProjects= () =>{
  const user = useUser()
  console.log(user)
  return(
    <Grid container direction="column" justifyContent="center" alignItems="center">
      <Grid item>
        <Typography variant="h1">'s projects</Typography>
      </Grid>

    </Grid>
  )
}
