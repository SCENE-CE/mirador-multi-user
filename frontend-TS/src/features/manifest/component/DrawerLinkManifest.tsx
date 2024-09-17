import { AppBar, Button, Drawer, Grid, Paper, TextField, Toolbar, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMoreSharp";
import { ChangeEvent, useCallback, useState } from "react";


interface IDrawerCreateManifestProps{
  modalCreateManifestIsOpen: boolean
  toggleModalManifestCreation:()=>void
  linkingManifest:(link:string)=>void
}

export const DrawerLinkManifest = ({toggleModalManifestCreation,modalCreateManifestIsOpen,linkingManifest}:IDrawerCreateManifestProps) =>{

  const [manifestLink, setManifestLink] = useState('');

  const handleNameChange  = useCallback((event:ChangeEvent<HTMLInputElement>)=>{
    setManifestLink(event.target.value);
  },[])

  const handleLinkingManifest = useCallback(()=>{
    toggleModalManifestCreation();
    linkingManifest(manifestLink);
    setManifestLink('');
  },[linkingManifest, manifestLink, toggleModalManifestCreation])

  const handleToggleModalGroupCreation= useCallback(()=>{
    toggleModalManifestCreation();
    setManifestLink('');
  },[toggleModalManifestCreation])
  return (
    <>
      <div>
        <Drawer anchor="bottom" open={modalCreateManifestIsOpen} onClose={handleToggleModalGroupCreation}>
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
                  onClick={toggleModalManifestCreation}
                >
                  <ExpandMoreIcon />
                </Button>
                <Typography>LINK MANIFEST</Typography>
              </Toolbar>
            </AppBar>
            <form>
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <label>Manifest's link :</label>
                </Grid>
                <Grid item sx={{ width:'70%'}}>
                  <TextField onChange={handleNameChange} sx={{ width:'100%'}} ></TextField>
                </Grid>
                <Grid item>
                  <Button
                    size="large"
                    variant="contained"
                    onClick={handleLinkingManifest}
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