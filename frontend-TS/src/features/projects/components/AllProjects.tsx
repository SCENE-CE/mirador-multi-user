import { Grid, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useCallback, useEffect, useState } from "react";
import { CreateProjectDto, Project } from "../types/types.ts";
import MiradorViewer from "../../mirador/Mirador.tsx";
import IState from "../../mirador/interface/IState.ts";
import { User } from "../../auth/types/types.ts";
import { ProjectCard } from "./projectCard.tsx";
import { deleteProject } from "../api/deleteProject.ts";
import { getUserAllProjects } from "../api/getUserAllProjects.ts";
import { updateProject } from "../api/updateProject";
import { createProject } from "../api/createProject";
import { FloatingActionButton } from "../../../components/elements/FloatingActionButton.tsx";
import { DrawerCreateProject } from "./DrawerCreateProject.tsx";
import toast from 'react-hot-toast';


interface AllProjectsProps {
  user: User;
  setSelectedProjectId: (id: number) => void;
  selectedProjectId?: number;
}

const emptyWorkspace: IState = {
  catalog: [],
  companionWindows: {},
  config: {},
  elasticLayout: {},
  layers: {},
  manifests: {},
  viewers: {},
  windows: {},
  workspace: {},

};


const emptyProject: Project = {
  id: 0,
  name: "",
  owner: {
    access_token:"" ,
    id: 0,
    mail: "",
    name: "",
    userGroups:[]
  },
  userWorkspace: emptyWorkspace
};

export const AllProjects = ({ user, selectedProjectId, setSelectedProjectId }:AllProjectsProps) => {
  const [userProjects, setUserProjects] = useState<Project[]>([]);


  const [miradorState, setMiradorState] = useState<IState>();

  const [modalCreateProjectIsOpen, setModalCreateProjectIsOpen]= useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projects = await getUserAllProjects(user.id);
        setUserProjects(projects);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };
    fetchProjects();
  }, [user]);

  const deleteUserProject = useCallback(async (projectId: number) => {
    await deleteProject(projectId);
    const updatedListOfProject = userProjects.filter(function(project) {
      return project.id != projectId;
    });
    console.log(updatedListOfProject);
    setUserProjects(updatedListOfProject);
  },[userProjects]);

  const updateUserProject = useCallback(async (project:Project, newProjectName:string)=>{
    const updatedProject = {...project, name:newProjectName}
    console.log(updatedProject)
    await updateProject({...updatedProject})
    let updatedListOfProject = userProjects.filter(function(p) {
      return p.id != project.id;
    });
    updatedListOfProject = [updatedProject,...updatedListOfProject]
    setUserProjects(updatedListOfProject);
  },[userProjects])

  const initializeMirador = useCallback((miradorState: IState | undefined, projectId: number) => {
    setSelectedProjectId(projectId);
    setMiradorState(miradorState);
  },[selectedProjectId]);

  const toggleModalProjectCreation = useCallback(()=>{
    setModalCreateProjectIsOpen(!modalCreateProjectIsOpen);
  },[modalCreateProjectIsOpen,setModalCreateProjectIsOpen])

  const InitializeProject = useCallback(async (workspace: IState, projectName: string) => {
    const response = await createProject({
        name: projectName,
        owner: user,
        userWorkspace: workspace
      }
    )
    setUserProjects((prevState: Project[]) => [...prevState,
      response]
    );
    initializeMirador(undefined, response.id)
    toggleModalProjectCreation()
  },[initializeMirador, toggleModalProjectCreation, user.id])



  const handleSaveProject = useCallback((newProject:Project)=>{
    setUserProjects(userProjects => [...userProjects, newProject]);

  },[setUserProjects])

  const saveProject = useCallback((state: IState, name: string)=>{
    if (selectedProjectId) {
      // Use coalesce operator to avoid typescript error "value possibly undefined"
      // That's non sense to use coalesce operator here, because selectedProjectId is always defined
      const updatedProject = userProjects.find(project => project.id == selectedProjectId) ?? emptyProject;
      updatedProject.userWorkspace = state;
      updatedProject.name = name;
      updateProject(updatedProject).then(r => {
        console.log(r);
        toast.success("Project saved");
      });
    } else {
      const project:CreateProjectDto = {
        name: name,
        owner: user,
        userWorkspace: state,
      };
      createProject(project).then(r => {
        setSelectedProjectId(r.id);
        handleSaveProject( { id: r.id,...project });
      });
    }
  },[handleSaveProject, selectedProjectId, user.id, userProjects])


  console.log(userProjects)

  return (
    <>
      <Grid container spacing={2} justifyContent="center" flexDirection="column">
        {
          !selectedProjectId && (
            <Grid item container justifyContent="center">
              <Typography variant="h5" component="h1">{user.name}'s Projects</Typography>
            </Grid>
          )
        }
        <Grid item container spacing={1}>
          {!userProjects.length && (
            <Grid
              container
              justifyContent={"center"}
            >
              <Typography variant="h6" component="h2">No projects yet, start to work when clicking on "New project" button.</Typography>
            </Grid>
          )}
          {!selectedProjectId && userProjects ? (
            <Grid item container spacing={1} flexDirection="column" sx={{marginBottom:"70px"}}>
              {userProjects.map((project) => (
                  <Grid item key={project.id} >
                    <ProjectCard
                      project={project}
                      projectName={project.name}
                      projectWorkspace={project.userWorkspace}
                      initializeMirador={initializeMirador}
                      NumberOfManifests={project.userWorkspace.catalog.length}
                      deleteProject={deleteUserProject}
                      projectId={project.id}
                      updateUserProject={updateUserProject}
                    />
                  </Grid>
                )
              )}
              <Grid item>
                <FloatingActionButton onClick={toggleModalProjectCreation} content={"New Project"} Icon={<AddIcon />} />
                <div>
                  <DrawerCreateProject
                    InitializeProject={InitializeProject}
                    projectWorkspace={emptyWorkspace}
                    toggleModalProjectCreation={toggleModalProjectCreation}
                    modalCreateProjectIsOpen={modalCreateProjectIsOpen}/>
                </div>
              </Grid>
            </Grid>
          ) : (
            <Grid item xs={12}>
              <MiradorViewer
                miradorState={miradorState!}
                saveMiradorState={saveProject}
                project={userProjects.find(project => project.id == selectedProjectId)!}
                updateUserProject={updateUserProject}
              />
            </Grid>
          )}
        </Grid>
      </Grid>
    </>
  );
};
