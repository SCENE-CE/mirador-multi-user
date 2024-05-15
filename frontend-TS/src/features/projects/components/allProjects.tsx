import { Grid, Typography } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import {Project} from "../types/types.ts";
import MiradorViewer from "../../mirador/Mirador.tsx";
import IWorkspace from "../../mirador/interface/IWorkspace.ts";
import { User } from "../../auth/types/types.ts";
import { ProjectCard } from "./projectCard.tsx";
import { deleteProject } from "../api/deleteProject.ts";
import { getUserAllProjects } from "../api/getUserAllProjects.ts";
import { updateProject } from "../api/updateProject";
import { createProject } from "../api/createProject";
interface AllProjectsProps {
  user: User;
}

export const AllProjects: FC<AllProjectsProps> = ({ user }) => {
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [isMiradorViewerVisible, setIsMiradorViewerVisible] = useState(false)
  const [miradorWorkspace, setMiradorWorkspace] = useState<IWorkspace>()
  const [selectedProjectId, setSelectedProjectId] = useState<number>(null)
  const emptyWorkspace: IWorkspace = {
    catalog:[],
    companionWindows:{},
    config:{},
    elasticLayout:{},
    layers:{},
    manifests:{},
    viewers:{},
    windows:{},
    workspace:{},
  }
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projects = await getUserAllProjects(user.id);
        setUserProjects(projects);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };
    fetchProjects();
  }, [user]);

  const deleteUserProject=(projectId:number)=>{
    deleteProject(projectId);
    const updatedListOfProject = userProjects.filter(function(project){
      return project.id == projectId // TODO Probably should use !==
    })
    setUserProjects(updatedListOfProject)
  }

  const initializeMirador = (workspace:IWorkspace, projectId:number) => {
    setIsMiradorViewerVisible(!isMiradorViewerVisible)
    setMiradorWorkspace(workspace)
    setSelectedProjectId(projectId)
  }

  const saveState = (state:IWorkspace) => {

    if(selectedProjectId){
      const updatedProject = userProjects.find(project => project.id == selectedProjectId);
      updatedProject.userWorkspace = state;
      updateProject(updatedProject).then(r => console.log(r));
    } else {
      const project = {
        name: "New Project",
        owner: user.id,
        userWorkspace: state,
      }
      createProject(project).then(r => console.log(r));
    }
    // let updatedProject = userProjects.find(project => project.id == miradorWorkspace?.project_id)//

    // updateProject()
  }

  return (
    <Grid container spacing={2} justifyContent="center" flexDirection="column">
      {
        !isMiradorViewerVisible &&(
          <Grid item container justifyContent="center">
          <Typography variant="h5" component="h1">{user.name}'s Projects</Typography>
        </Grid>
        )
      }
      <Grid item container spacing={4} >

      {!isMiradorViewerVisible && userProjects ? (
        <>
          {userProjects.map((project) => (
            <React.Fragment key={project.id}>
            <ProjectCard
              projectName={project.name}
              projectWorkspace={project.userWorkspace}
              initializeMirador={initializeMirador}
              NumberOfManifests={project.userWorkspace.catalog.length}
              deleteProject={deleteUserProject}
              projectId={project.id}
            />
            </React.Fragment>
            )
          )}
          <ProjectCard
            projectName={"New Project"}
            projectWorkspace={emptyWorkspace}
            initializeMirador={initializeMirador}
            projectId={undefined}
          />
        </>
      ) : (
        <Grid item xs={12}>
          <MiradorViewer workspace={miradorWorkspace!} toggleMirador={()=> setIsMiradorViewerVisible(!isMiradorViewerVisible)} saveState={saveState} />
        </Grid>
      )}
      </Grid>
    </Grid>
  )
}
