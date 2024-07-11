import {  Grid, Typography } from "@mui/material";
import { UserGroup } from "../types/types.ts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getAllGroupProjects } from "../api/getAllGroupProjects.ts";
import { Project } from "../../projects/types/types.ts";
import { addProjectToGroup } from "../api/addProjectToGroup.ts";
import { removeProjectToGroup } from "../api/removeProjectToGroup.ts";
import { GroupProjectList } from "./GroupProjectList.tsx";
interface ModalEditGroupProps {
  group:UserGroup
  personalGroup:UserGroup
}
export const ModalEditGroup = ({ group,personalGroup }:ModalEditGroupProps)=>{
  const [projects, setProjects]=useState<Project[]>([]);
  const [userProjects,setUserProjects]=useState<Project[]>([]);
  const [displayUserProjects, setDisplayUserProjects]=useState(false);

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

  const handleRemoveProject= async (projectId:number)=>{
    try{
      await removeProjectToGroup({projectId:projectId, groupId:group.id})
      await fetchAllGroupProjects()
    }catch(error){
      console.error(error);
    }
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
    <Grid item container justifyContent="center" >
      <Typography variant="h5">{group.name}</Typography>
      <Grid item container direction="row">
        <GroupProjectList
          displayUserProjects={displayUserProjects}
          handleAddProjectToGroup={handleAddProjectToGroup}
          handleDisplayProject={handleDisplayProject}
          handleRemoveProject={handleRemoveProject}
          personalProjectsName={personalProjectsName}
          projects={projects}
        />
      </Grid>
    </Grid>
  )
}
