import { AppBar, Button, Drawer, Grid, Paper, TextField, Toolbar, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreSharp';
import { ChangeEvent, useCallback, useState } from "react";
import { UserGroup } from "../types/types.ts";
import { UsersSearchBar } from "./UsersSearchBar.tsx";
import { User } from "../../auth/types/types.ts";

interface IDrawerCreateGroupProps{
  modalCreateGroup: boolean
  toggleModalGroupCreation:()=>void
  InitializeGroup:() => void
  ownerId:number
}

export const DrawerCreateGroup=({ownerId,modalCreateGroup,toggleModalGroupCreation,InitializeGroup,}:IDrawerCreateGroupProps)=>{
  const [groupName, setGroupName] = useState('');
  const [usersToAdd, setUsersToAdd] = useState<UserGroup[]>([])
  const [userToAdd, setUserToAdd] = useState<UserGroup | null>(null);

  const handleAddUser = ()=>{
//TODO
  }

  const handleRemoveUser=(userToRemove:User)=>{
  //TODO
  }
  const handleNameChange  = useCallback((event:ChangeEvent<HTMLInputElement>)=>{
//TODO
  },[])

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
            <form>
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <label>Group's name :</label>
                </Grid>
                <Grid item sx={{ width:'70%'}}>
                  <TextField onChange={handleNameChange} sx={{ width:'100%'}} ></TextField>
                </Grid>
                <Grid item>
                </Grid>
              </Grid>
            </form>
            <UsersSearchBar handleAddUser={handleAddUser} setSelectedUser={setUserToAdd}/>
            <Button
              size="large"
              variant="contained"
              onClick={()=>InitializeGroup()}
            >
              CREATE GROUP
            </Button>
          </Paper>

        </Drawer>
      </div>
    </>
  )
}
