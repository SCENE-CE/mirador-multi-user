import { Button, Divider, Grid, List, ListItem, ListItemText, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import { FixedSizeList } from "../../../components/elements/FixedSizeList.tsx";
import { Project } from "../../projects/types/types.ts";
import { getAllGroupProjects } from "../api/getAllGroupProjects.ts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { UserGroup } from "../types/types.ts";
import { addProjectToGroup } from "../api/addProjectToGroup.ts";
import { removeProjectToGroup } from "../api/removeProjectToGroup.ts";

interface IGroupProjectListProps {
  group:UserGroup,
  personalGroup:UserGroup
}
export const GroupProjectList = ({group, personalGroup}:IGroupProjectListProps)=>{
  const [projects, setProjects]=useState<Project[]>([]);
  const [userProjects,setUserProjects]=useState<Project[]>([]);
  const [displayUserProjects, setDisplayUserProjects]=useState(false);


  const handleRemoveProject= async (projectId:number)=>{
    try{
      await removeProjectToGroup({projectId:projectId, groupId:group.id})
      await fetchAllGroupProjects()
    }catch(error){
      console.error(error);
    }
  }

  const fetchAllGroupProjects = async ()=>{
    try {
      const groupProjects = await getAllGroupProjects(group.id)
      console.log(groupProjects)
      setProjects(groupProjects);
    } catch (error) {
      throw error
    }
  }
  useEffect( () => {
    fetchAllGroupProjects();
  },[])


  const handleDisplayProject= async () => {
    console.log('personalGroup',personalGroup)
    const userPersonnalProjects = await getAllGroupProjects(personalGroup.id)
    console.log('userPersonnalProjects',userPersonnalProjects)
    setUserProjects(userPersonnalProjects)
    setDisplayUserProjects(!displayUserProjects)
  }

  const handleAddProjectToGroup = useCallback(async (projectName: string) => {
    try{

      const project = userProjects.find((project) => project.name == projectName);
      console.log('projectID :', project!.id)
      console.log(group.id)
      await addProjectToGroup({ projectId:project!.id, groupId:group.id });
      fetchAllGroupProjects()
      setDisplayUserProjects(false)
    }catch(error){
      console.error(error)
    }
  },[userProjects, personalGroup, addProjectToGroup, setDisplayUserProjects])


  const personalProjectsName = useMemo(() => userProjects.map((project) => project.name), [userProjects]);

  return(
    <>
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
                <Button variant="contained" onClick={()=>handleRemoveProject(project.id)}  color="error">
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
                {displayUserProjects ? <ArrowBackIcon /> : <AddIcon />}
              </Button>
            </ListItem>
            <Divider  component="li" />
          </>
          {
            displayUserProjects &&(
              <FixedSizeList contents={personalProjectsName} action={handleAddProjectToGroup}/>
            )
          }
        </List>
      </Grid>
      <Grid item container direction="column"></Grid>
    </>
  )
}
