import { Button, Divider, Grid, List, ListItem, ListItemText, Typography } from "@mui/material";
import { UserGroup } from "../types/types.ts";
import { useEffect, useMemo, useState } from "react";
import { getAllGroupProjects } from "../api/getAllGroupProjects.ts";
import { Project } from "../../projects/types/types.ts";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { FixedSizeList } from "../../../components/elements/FixedSizeList.tsx";
import { useUser } from "../../../utils/auth.tsx";

interface ModalEditGroupProps {
  group:UserGroup
}
export const ModalEditGroup = ({ group }:ModalEditGroupProps)=>{
  const [projects, setProjects]=useState<Project[]>([]);
  const [displayProjects, setDisplayProjects]=useState(false);
  const user = useUser()
  useEffect( () => {
    const fetchAllGroupProjects = async ()=>{
      try {
        const userProjects = await getAllGroupProjects(group.id)
        setProjects(userProjects);
      } catch (error) {
        throw error
      }
    }
    fetchAllGroupProjects();
  },[])

  const handleDisplayProject=()=>{
    const userPersonnalProject = getAllGroupProjects(user.data!.id)
    setDisplayProjects(true)
  }
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

  const personalProjectsName = useMemo(() => projects.map((project) => project.name), [projects]);

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
                <ListItem key={project.id}>
                  <ListItemText primary={project.name}>
                  </ListItemText>
                  <Button variant="contained" onClick={()=>handleRemoveProject(project)}>
                    <CloseIcon/>
                  </Button>
                </ListItem>
                <Divider  component="li" />
              </>
            ))}
            <>
              <ListItem>
                <ListItemText primary="Add project">
                </ListItemText>
                <Button variant="contained" onClick={handleDisplayProject}>
                  <AddIcon/>
                </Button>
              </ListItem>
              <Divider  component="li" />
            </>
            {
              displayProjects &&(
                <FixedSizeList contents={personalProjectsName} />
              )
            }
          </List>
        </Grid>
        <Grid item container direction="column"></Grid>
      </Grid>
    </Grid>
  )
}
