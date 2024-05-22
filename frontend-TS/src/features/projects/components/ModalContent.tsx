import { Button, Grid, TextField, Typography } from "@mui/material";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { ChangeEvent, useCallback, useState } from "react";
import { Project } from "../types/types.ts";
import SaveIcon from '@mui/icons-material/Save';
import IWorkspace from "../../mirador/interface/IWorkspace.ts";
interface ModalProjectProps {
  project:Project,
  saveProject: (state: IWorkspace, name: string) => void,
}
export const ModalProject = ({ project, saveProject }:ModalProjectProps)=>{
  const [editName, setEditName] = useState(false);
  const [ newName, setNewName ] = useState('')
  const handleEditName = useCallback(()=>{
    setEditName(!editName)
  },  [setEditName,editName])

  const handleSaveName = useCallback(()=>{
    console.log('toto')
    saveProject(project.userWorkspace, newName)
    setEditName(!editName);
  },[saveProject, project, newName, editName])

  const handleChangeName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  }, []);
  return(
    <Grid container>

      <Grid item container>
        {!editName ? (
            <Grid item sx={{minHeight:'100px'}} container flexDirection="row" justifyContent="space-between" alignItems="center">
              <Typography>{project.name}</Typography>
              <Button variant="contained" onClick={handleEditName}>
                <ModeEditIcon/>
              </Button>
            </Grid>
          ):
          (
            <Grid item sx={{minHeight:'100px'}} container flexDirection="row" justifyContent="space-between" alignItems="center">
              <TextField type="text" onChange={handleChangeName}variant="outlined" defaultValue={project.name}/>
              <Button variant="contained" onClick={handleSaveName}>
                <SaveIcon/>
              </Button>
            </Grid>
          )}
      </Grid>
    </Grid>
  )
}
