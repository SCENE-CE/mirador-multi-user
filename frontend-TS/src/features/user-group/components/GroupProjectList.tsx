import { Button, Divider, Grid, List, ListItem, ListItemText, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import { FixedSizeList } from "../../../components/elements/FixedSizeList.tsx";
import { ProjectUser } from "../../projects/types/types.ts";
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
  const [projectsUser, setProjectsUser]=useState<ProjectUser[]>([]);
  const [personalProjectsUser,setPersonalProjectsUser]=useState<ProjectUser[]>([]);
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
      console.log("groupProjects",groupProjects)
      const personalProjects = await getAllGroupProjects(personalGroup.id)
      //TODO UPDATE THIS TO FIT WITH NEW PROJECT STRUCTURE
      setPersonalProjectsUser(personalProjects);
      setProjectsUser(groupProjects);
    } catch (error) {
      throw error
    }
  }
  useEffect( () => {
    fetchAllGroupProjects();
  },[])


  const handleDisplayProject= async () => {
    const userPersonnalProjects = await getAllGroupProjects(personalGroup.id)
    setPersonalProjectsUser(userPersonnalProjects)
    setDisplayUserProjects(!displayUserProjects)
  }

  const handleAddProjectToGroup = useCallback(async (projectName: string) => {
    try{
      console.log("projectName", projectName)
      const projectUser = personalProjectsUser.find((projectUser) => projectUser.project.name == projectName);
      console.log('projectUser',projectUser)
      const project = projectUser!.project;
      await addProjectToGroup({ projectsId:[project!.id], groupId:group.id });
      await fetchAllGroupProjects()
      setDisplayUserProjects(false)
    }catch(error){
      console.error(error)
    }
  },[personalProjectsUser, personalGroup, addProjectToGroup, setDisplayUserProjects])


  const personalProjectsName = useMemo(() => personalProjectsUser.map((projectUser) => projectUser.project.name), [personalProjectsUser]);

  return(
    <>
      <Grid item container direction="column" spacing={2} >
        <Grid item container>
          <Typography> Group's Projects</Typography>
        </Grid>
        <List>
          {projectsUser.map((projectUser)=>(
            <Grid key={projectUser.project.id}>
              <ListItem>
                <ListItemText primary={projectUser.project.name}>
                </ListItemText>
                <Button variant="contained" onClick={()=>handleRemoveProject(projectUser.project.id)}  color="error">
                  <CloseIcon/>
                </Button>
              </ListItem>
              <Divider  component="li" />
            </Grid>
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
