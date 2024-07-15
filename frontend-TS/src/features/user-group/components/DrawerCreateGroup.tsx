import { AppBar, Button, Drawer, Grid, Paper, TextField, Toolbar, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreSharp';
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { UserGroup } from "../types/types.ts";
import { UsersSearchBar } from "./UsersSearchBar.tsx";
import { User } from "../../auth/types/types.ts";
import { GroupUsersList } from "./GroupUsersList.tsx";

interface IDrawerCreateGroupProps{
  modalCreateGroup: boolean
  toggleModalGroupCreation:()=>void
  handleCreatGroup:(name:string, usersToAdd:User[]) => void
  ownerId:number
}

export const DrawerCreateGroup=({ownerId,modalCreateGroup,toggleModalGroupCreation,handleCreatGroup: handleCreatGroup,}:IDrawerCreateGroupProps)=>{
  const [usersToAdd, setUsersToAdd] = useState<UserGroup[]>([])
  const [userToAdd, setUserToAdd] = useState<UserGroup | null>(null);
  const [userGroupName, setUserGroupName] = useState('');


  const handleAddUser = ()=>{
    if(usersToAdd !== null) {
    setUsersToAdd([...usersToAdd, userToAdd!]);
    }
  }

  const handleRemoveUser=(userToRemove:User)=>{
    const newUsersList = usersToAdd.filter((user)=> user.id == userToRemove.id);
    console.log('userRemovedArray', newUsersList)
    setUsersToAdd(newUsersList);
  }
  const handleNameChange  = useCallback((event:ChangeEvent<HTMLInputElement>)=>{
    setUserGroupName(event.target.value)
  },[])

  const users = useMemo(() => {
    return usersToAdd.map(group => group.users).flat();
  }, [usersToAdd]);


  return(
    <>
      <div>
        <Drawer anchor="bottom" open={modalCreateGroup} onClose={toggleModalGroupCreation}>
          <Paper
            sx={{
              left: '0',
              marginTop: 6,
              paddingBottom: 2,
              paddingLeft: { sm: 3, xs: 2 },
              paddingTop: 2,
              right: '0',
              minHeight:300,
            }}
          >

            <AppBar position="absolute" color="primary" enableColorOnDark >
              <Toolbar variant="dense">
                <Button
                  color="inherit"
                  onClick={toggleModalGroupCreation}
                >
                  <ExpandMoreIcon />
                </Button>
                <Typography>CREATE Group</Typography>
              </Toolbar>
            </AppBar>
            <Grid>
              <Grid item container alignItems="center" spacing={2}>
                <Grid item>
                  <Typography>Group's name :</Typography>
                </Grid>
                <Grid item sx={{ width:'70%'}}>
                  <TextField onChange={handleNameChange} sx={{ width:'100%'}} ></TextField>
                </Grid>
              </Grid>
              <Grid item container flexDirection="column" spacing={1}>
                <Grid item>
                  <UsersSearchBar handleAddUser={handleAddUser} setSelectedUser={setUserToAdd}/>
                </Grid>
                <Grid item>
                  <GroupUsersList users={users} handleRemoveUser={handleRemoveUser} ownerId={ownerId} />
                </Grid>
                <Grid item>
                  <Button
                    size="large"
                    variant="contained"
                    onClick={()=>handleCreatGroup(userGroupName, users)}
                  >
                    CREATE GROUP
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Drawer>
      </div>
    </>
  )
}
