import { Grid, Typography } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import {Project} from "../types/types.ts";
import MiradorViewer from "../../mirador/Mirador.tsx";
import IWorkspace from "../../mirador/interface/IWorkspace.ts";
import { User } from "../../auth/types/types.ts";
import { ProjectCard } from "./projectCard.tsx";
import { deleteProject } from "../api/deleteProject.ts";
import { getUserAllProjects } from "../api/getUserAllProjects.ts";
interface AllProjectsProps {
  user: User;
}

export const AllProjects: FC<AllProjectsProps> = ({ user }) => {
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [mirador, setMirador] = useState(false)
  const [miradorWorkspace, setMiradorWorkspace] = useState<IWorkspace>()
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
      return project.id == projectId
    })
    setUserProjects(updatedListOfProject)
  }

  const initializeMirador = (workspace:IWorkspace) => {
    setMirador(!mirador)
    setMiradorWorkspace(workspace)
  }

  const saveProject = () => {
    console.log("Save Project")
  }

  return (
    <Grid container spacing={2} justifyContent="center" flexDirection="column">
      {
        !mirador &&(
          <Grid item container justifyContent="center">
          <Typography variant="h5" component="h1">{user.name}'s Projects</Typography>
        </Grid>
        )
      }
      <Grid item container spacing={4} >

      {!mirador && userProjects ? (
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
          />
        </>
      ) : (
        <Grid item xs={12}>
          <MiradorViewer workspace={miradorWorkspace!} toggleMirador={()=> setMirador(!mirador)} saveState={saveProject} />
        </Grid>
      )}
      </Grid>
    </Grid>
  )
}
