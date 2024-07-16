import { AppBar, Button, Drawer, Grid, Paper, TextField, Toolbar, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreSharp';
import { ChangeEvent, useCallback, useState } from "react";

interface IDrawerCreateGroupProps{
  modalCreateGroup: boolean
  toggleModalGroupCreation:()=>void
  handleCreatGroup:(name:string) => void
}

export const DrawerCreateGroup=({modalCreateGroup,toggleModalGroupCreation,handleCreatGroup: handleCreatGroup,}:IDrawerCreateGroupProps)=>{
  const [userGroupName, setUserGroupName] = useState<string>('');


  const handleNameChange  = useCallback((event:ChangeEvent<HTMLInputElement>)=>{
    setUserGroupName(event.target.value)
  },[])

  const handleUserCreation = useCallback(()=>{
    toggleModalGroupCreation();
    handleCreatGroup(userGroupName);
    setUserGroupName('');
  },[handleCreatGroup, userGroupName, toggleModalGroupCreation])

  const handleToggleModalGroupCreation= useCallback(()=>{
    toggleModalGroupCreation();
    setUserGroupName('');
  },[toggleModalGroupCreation])


  return(
    <>
      <div>
        <Drawer anchor="bottom" open={modalCreateGroup} onClose={handleToggleModalGroupCreation}>
          <Paper
            sx={{
              left: '0',
              marginTop: 6,
              paddingBottom: 2,
              paddingLeft: { sm: 3, xs: 2 },
              paddingTop: 2,
              right: '0',
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
                  <TextField onChange={handleNameChange} sx={{ width:'100%'}}></TextField>
                </Grid>
                <Grid item>
                  <Button
                    size="large"
                    variant="contained"
                    onClick={handleUserCreation}
                    disabled={userGroupName.length < 1}
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
