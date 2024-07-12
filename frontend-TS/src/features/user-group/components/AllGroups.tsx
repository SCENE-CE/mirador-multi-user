import {User} from '../../auth/types/types.ts'
import { Divider, Grid, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { UserGroup } from "../types/types.ts";
import { getAllUserGroups } from "../api/getAllUserGroups.ts";
import { GroupCard } from "./GroupCard.tsx";
import { useUser } from "../../../utils/auth.tsx";


interface allGroupsProps {
  user: User;
}
export const AllGroups= ({user}:allGroupsProps)=>{
  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [users, setUsers] = useState<UserGroup[]>([]);
  const currentUser = useUser()

  useEffect(
    () =>{
      const fetchGroups = async () => {
        try {
          let groups = await getAllUserGroups(user.id)
          const users : UserGroup[] = groups.filter((group:UserGroup)=> group.users.length < 2)
          groups = groups.filter(((group : UserGroup)=>{ return users.indexOf(group) < 0}))
          setGroups(groups)
          setUsers(users)
        } catch (error) {
          throw error
        }
      }
      fetchGroups()
    },[]
  )

  const personalGroup = useMemo(() => {
    if (!Array.isArray(groups)) return null;

    const filteredGroups = users.filter(group => Array.isArray(group.users) && group.name === currentUser.data!.name );

    return filteredGroups[0];
  }, [groups]);

  return(
    <Grid container justifyContent='center' flexDirection='column' spacing={4}>
      <Grid item container justifyContent="center" spacing={2}>
        <Typography variant="h5" component="h1">
          {user.name}'s groups
        </Typography>
      </Grid>
      <Grid item container spacing={2} flexDirection="column" sx={{ marginBottom: "40px" }}>
        {groups.map((group) => (
          <>
            <Grid item key={group.id}>
              <GroupCard group={group} personalGroup={personalGroup!} />
            </Grid>
            <Grid item>
              <Divider />
            </Grid>
          </>
        ))}
      </Grid>
    </Grid>

  )
}
