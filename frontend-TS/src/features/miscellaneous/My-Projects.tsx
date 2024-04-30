import { useUser } from "../../utils/auth.tsx";
import { Grid, Typography } from "@mui/material";

export const MyProjects= () =>{
  const user = useUser()
  return(
    <Grid container direction="column" justifyContent="center" alignItems="center">
      <Grid item>
        <Typography variant="h1">{user?.data?.name}'s projects</Typography>
      </Grid>

    </Grid>
  )
}
