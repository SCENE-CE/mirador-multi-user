import {  Grid, Typography } from "@mui/material";
import { UserGroup } from "../types/types.ts";
import { GroupProjectList } from "./GroupProjectList.tsx";
interface ModalEditGroupProps {
  group:UserGroup
  personalGroup:UserGroup
}
export const ModalEditGroup = ({ group,personalGroup }:ModalEditGroupProps)=>{


  return(
    <Grid item container justifyContent="center" >
      <Typography variant="h5">{group.name}</Typography>
      <Grid item container direction="row">
        <GroupProjectList
          group={group}
          personalGroup={personalGroup}
        />
      </Grid>
    </Grid>
  )
}
