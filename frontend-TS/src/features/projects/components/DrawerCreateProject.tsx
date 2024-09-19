import { AppBar, Button, Drawer, Grid, Paper, TextField, Toolbar, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreSharp';
import IState from "../../mirador/interface/IState.ts";
import { ChangeEvent, useCallback, useState } from "react";

interface IDrawerCreateProjectProps{
  modalCreateProjectIsOpen: boolean
  toggleModalProjectCreation:()=>void
  InitializeProject:(workspace: IState, projectName:string) => void
  projectWorkspace:IState
}

export const DrawerCreateProject=({modalCreateProjectIsOpen,toggleModalProjectCreation,InitializeProject,projectWorkspace}:IDrawerCreateProjectProps)=>{
  const [projectName, setProjectName] = useState('');

  const handleNameChange  = useCallback((event:ChangeEvent<HTMLInputElement>)=>{
    setProjectName(event.target.value);
  },[])
  return(
    <>
      <div>
        <Drawer anchor="bottom" open={modalCreateProjectIsOpen} onClose={toggleModalProjectCreation}>
          <Paper
            sx={{
              left: '0',
              marginTop: 6,
              paddingBottom: 2,
              paddingLeft: { sm: 3, xs: 2 },
              paddingRight: { sm: 3, xs: 2 },
              paddingTop: 2,
              right: '0',
            }}
          >

            <AppBar position="absolute" color="primary" enableColorOnDark >
              <Toolbar variant="dense">
                <Button
                  color="inherit"
                  onClick={toggleModalProjectCreation}
                >
                  <ExpandMoreIcon />
                </Button>
               <Typography>CREATE PROJECT</Typography>
              </Toolbar>
            </AppBar>
            <form>
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                <label>Project's name :</label>
                </Grid>
                <Grid item sx={{ width:'70%'}}>
                  <TextField onChange={handleNameChange} sx={{ width:'100%'}} placeholder="My wonderfull project !"></TextField>
                </Grid>
                <Grid item>
                  <Button
                    size="large"
                    variant="contained"
                    onClick={()=>InitializeProject(projectWorkspace, projectName)}
                  >
                    ADD
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Drawer>
      </div>
    </>
  )
}
