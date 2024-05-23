import { Button, Grid, TextField, Typography } from "@mui/material";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { ChangeEvent, useCallback, useState } from "react";
import { Project } from "../types/types.ts";
import SaveIcon from '@mui/icons-material/Save';
interface ModalProjectProps {
  project:Project,
  updateUserProject:(project:Project, newProjectName:string)=>void,
}

export const ModalProject = ({ project, updateUserProject }:ModalProjectProps)=>{
  const [editName, setEditName] = useState(false);
  const [ newProjectName, setNewProjectName] = useState(project!.name);

  const HandleUpdateProject = useCallback(async ()=>{
    updateUserProject(project,newProjectName);
    setEditName(!editName)
  },[editName, newProjectName, project])


  const handleEditName = useCallback(()=>{
    setEditName(!editName)
  },  [setEditName,editName])


  const handleChangeName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setNewProjectName(e.target.value);
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
              <TextField type="text" onChange={handleChangeName} variant="outlined" defaultValue={project.name}/>
              <Button variant="contained" onClick={HandleUpdateProject}>
                <SaveIcon/>
              </Button>
            </Grid>
          )}
      </Grid>
    </Grid>
  )
}
