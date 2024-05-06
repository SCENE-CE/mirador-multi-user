import { useUser } from "../../utils/auth.tsx";
import { Grid, Typography } from "@mui/material";
import { AllProjects } from "../projects/components/allProjects.tsx";

export const MyProjects= () =>{
  const user = useUser()
  const userId = user?.data?.id;

  if (!user || !user.data) {
    return <Typography>Loading user data...</Typography>;
  }

  console.log("ID", user?.data?.id)
  return(
    <Grid container direction="column" justifyContent="center" alignItems="center">
      {userId && <AllProjects user={user.data} />}
    </Grid>
  )
}
