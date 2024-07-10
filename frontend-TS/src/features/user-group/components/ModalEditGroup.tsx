import { Button, Divider, Grid, List, ListItem, ListItemText, Typography } from "@mui/material";
import { UserGroup } from "../types/types.ts";
import { useEffect, useState } from "react";
import { getUserAllProjects } from "../api/getUserAllProjects.ts";
import { useUser } from "../../../utils/auth.tsx";
import { Project } from "../../projects/types/types.ts";
import CloseIcon from '@mui/icons-material/Close';
import { updateProject } from "../../projects/api/updateProject.ts";

interface ModalEditGroupProps {
  group:UserGroup
}
export const ModalEditGroup = ({ group }:ModalEditGroupProps)=>{
  const [projects, setProjects]=useState<Project[]>([]);

  const user = useUser();

  useEffect( () => {
    //TODO: fetch USER GROUP project and not USER PROJECT
    const fetchUserProjects = async ()=>{
      try {
        const userProjects = await getUserAllProjects(user.data!.id)
        setProjects(userProjects);
      } catch (error) {
        throw error
      }
    }
    fetchUserProjects()
  },[])

  //TODO: Update the group to remove project
  const handleRemoveProject= (projectToRemove:Project)=>{
  // const updateGroup = async ()=>{
  //   try{
  //     const groupWithoutProject = { ...group,
  //
  //     }
  //     const updateRequest = await updateProject(projectToRemove)
  //   }catch(error){
  //
  //   }
  // }
  }
  return(
    <Grid item container justifyContent="center" >
      <Typography variant="h5">{group.name}</Typography>
      <Grid item container direction="row">
        <Grid item container direction="column" spacing={2} >
          <Grid item container>
            <Typography> Group's Projects</Typography>
          </Grid>
          <List>
            {projects.map((project)=>(
              <>
                <ListItem>
                  <ListItemText primary={project.name}>
                  </ListItemText>
                  <Button variant="contained" onClick={()=>handleRemoveProject(project)}>
                    <CloseIcon/>
                  </Button>
                </ListItem>
                <Divider  component="li" />
              </>
            ))}
          </List>
        </Grid>
        <Grid item container direction="column"></Grid>
      </Grid>
    </Grid>
  )
}
