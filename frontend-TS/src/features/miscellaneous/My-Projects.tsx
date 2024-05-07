import { useLogout, useUser } from "../../utils/auth.tsx";
import { Button, Grid, Typography } from "@mui/material";
import { AllProjects } from "../projects/components/allProjects.tsx";

export const MyProjects= () =>{
  const user = useUser()
  const userId = user?.data?.id;
  const logout = useLogout({})
  if (!user || !user.data) {
    return <Typography>Loading user data...</Typography>;
  }

  return(
    <Grid container direction="column">
      <Grid item>
        <Button onClick={() => logout.mutate({})}>Disconnect</Button>
      </Grid>
      <Grid item>
      {userId && <AllProjects user={user.data} />}
      </Grid>
    </Grid>
  )
}
