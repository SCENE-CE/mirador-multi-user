import { Divider, Grid, Typography } from "@mui/material";
import { UserGroup } from "../types/types.ts";
import { GroupProjectList } from "./GroupProjectList.tsx";
import { UsersSearchBar } from "./UsersSearchBar.tsx";
interface ModalEditGroupProps {
  group:UserGroup
  personalGroup:UserGroup
  users:UserGroup[]
}
export const ModalEditGroup = ({ group,personalGroup, users }:ModalEditGroupProps)=>{


  return(
    <Grid item container flexDirection="row" spacing={1}>
      <Grid item container justifyContent="center" xs={8} >
        <Typography variant="h5">{group.name}</Typography>
        <Grid item container direction="column">
          <GroupProjectList
            group={group}
            personalGroup={personalGroup}
          />
        </Grid>
      </Grid>
      <Divider orientation="vertical" variant="middle" flexItem/>
      <Grid item container xs={3}>
        <UsersSearchBar users={users}/>
      </Grid>
    </Grid>
  )
}
