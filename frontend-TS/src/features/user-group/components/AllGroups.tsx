import {User} from '../../auth/types/types.ts'
import { Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { UserGroup } from "../types/types.ts";
import { getAllUserGroups } from "../api/getAllUserGroups.ts";
import { GroupCard } from "./GroupCard.tsx";


interface allGroupsProps {
  user: User;
}
export const AllGroups= ({user}:allGroupsProps)=>{
  const [groups, setGroups] = useState<UserGroup[]>([]);

  useEffect(
  () =>{
    const fetchGroups = async () => {
      try {
        const groups = await getAllUserGroups(user.id)
        setGroups(groups)
      } catch (error) {
        throw error
      }
    }
      fetchGroups()
  },[]
)

  return(
    <Grid container justifyContent='center' flexDirection='column'>
      <Grid item container justifyContent="center">
        <Typography variant="h5" component="h1" >
          {user.name}'s groups
        </Typography>
      </Grid>
      <Grid item container spacing={1} flexDirection="column" sx={{marginBottom:"70px"}}>
        {
          groups.map((group)=>(
            <Grid item key={group.id}>
            <GroupCard userGroup={group}/>
            </Grid>
          ))

        }
      </Grid>
    </Grid>
  )
}
