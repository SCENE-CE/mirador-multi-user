import { useLogout, useUser } from "../../utils/auth.tsx";
import { Grid, Typography } from "@mui/material";
import { AllProjects } from "../projects/components/allProjects.tsx";
import { SideDrawer } from "../../components/elements/SideDrawer.tsx";
import { useState } from "react";

export const MyProjects = () => {
  const user = useUser();
  const logout = useLogout({});

  const [selectedProjectId, setSelectedProjectId] = useState<number | undefined>(undefined);

  if (!user || !user.data) {
    return <Typography>Loading user data...</Typography>;
  }

  const handleDiscconnect = () => {
    logout.mutate({});
  };

  return (
    <Grid container direction="row">
      <SideDrawer
        user={user.data}
        handleDisconnect={handleDiscconnect}
        selectedProjectId={selectedProjectId}
        setSelectedProjectId={setSelectedProjectId}
      />

    </Grid>
  );
};
