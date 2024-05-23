import { useLogout, useUser } from "../../utils/auth.tsx";
import { Grid, Typography } from "@mui/material";
import { AllProjects } from "../projects/components/allProjects.tsx";
import { SideDrawer } from "../../components/elements/SideDrawer.tsx";

export const MyProjects= () =>{
  const user = useUser()
  const userId = user?.data?.id;
  const logout = useLogout({})

  if (!user || !user.data) {
    return <Typography>Loading user data...</Typography>;
  }

  const handleDiscconnect = ()=>{
    logout.mutate({})
  }

  return(
    <Grid container direction="row">
      <SideDrawer content={
        <Grid item container direction="column">
        <Grid item>
          {userId && <AllProjects user={user.data} />}
        </Grid>
      </Grid>
      }
      handleDisconnect={handleDiscconnect}/>
    </Grid>
  )
}
