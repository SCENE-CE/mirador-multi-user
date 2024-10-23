import { AppBar, Button, Drawer, Grid, Paper, TextField, Toolbar, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreSharp';
import IState from "../../mirador/interface/IState.ts";
import { ChangeEvent, FormEvent, useCallback, useState } from "react";

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    InitializeProject(projectWorkspace, projectName);
  };
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

            <AppBar position="absolute" color="primary" enableColorOnDark>
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
            <form onSubmit={handleSubmit}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <label>Project's title:</label>
                </Grid>
                <Grid item sx={{ width: '70%' }}>
                  <TextField
                    onChange={handleNameChange}
                    sx={{ width: '100%' }}
                    placeholder="My wonderful project!"
                    value={projectName}
                  />
                </Grid>
                <Grid item>
                  <Button
                    size="large"
                    variant="contained"
                    type="submit"
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
