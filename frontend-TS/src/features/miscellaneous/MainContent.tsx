import { useLogout, useUser } from "../../utils/auth.tsx";
import { Grid } from "@mui/material";
import { SideDrawer } from "../../components/elements/SideDrawer.tsx";
import { useState } from "react";
import { Loading } from "../../components/elements/Loading.tsx";
import { ProjectUser } from "../projects/types/types.ts";

export const MainContent = () => {
  const user = useUser();
  const logout = useLogout({});

  const [selectedProjectUser, setSelectedProjectUser] = useState<ProjectUser | undefined>(undefined);

  if (!user || !user.data) {
    return <Loading />;
  }

  const handleDiscconnect = () => {
    logout.mutate({});
  };

  return (
    <Grid container direction="row"
    >
      <SideDrawer
        user={user.data}
        handleDisconnect={handleDiscconnect}
        selectedProjectUser={selectedProjectUser}
        setSelectedProjectUser={setSelectedProjectUser}
      />
    </Grid>
  );
};
