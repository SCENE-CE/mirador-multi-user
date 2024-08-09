import {  Grid,  Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useCallback, useEffect, useMemo, useState } from "react";
import { Project, ProjectGroup, ProjectUser } from "../types/types.ts";
import IState from "../../mirador/interface/IState.ts";
import { User } from "../../auth/types/types.ts";
import { deleteProject } from "../api/deleteProject.ts";
import { getUserAllProjects } from "../api/getUserAllProjects.ts";
import { updateProject } from "../api/updateProject";
import { createProject } from "../api/createProject";
import { FloatingActionButton } from "../../../components/elements/FloatingActionButton.tsx";
import { DrawerCreateProject } from "./DrawerCreateProject.tsx";
import { getAllGroupProjects } from "../../user-group/api/getAllGroupProjects.ts";
import { SearchBar } from "../../../components/elements/SearchBar.tsx";
import { lookingForProject } from "../api/lookingForProject.ts";
import { getUserPersonalGroup } from "../api/getUserPersonalGroup.ts";
import { ProjectRights, UserGroup } from "../../user-group/types/types.ts";
import MMUCard from "../../../components/elements/MMUCard.tsx";
import { ProjectDefaultButton } from "./ProjectDefaultButton.tsx";
import { ProjectEditorButton } from "./ProjectEditorButton.tsx";
import { ProjectReaderButton } from "./ProjectReaderButton.tsx";
import { removeProjectToGroup } from "../../user-group/api/removeProjectToGroup.ts";
import { addProjectToGroup } from "../../user-group/api/addProjectToGroup.ts";
import { ListItem } from "../../../components/types.ts";
import { getGroupsAccessToProject } from "../api/getGroupsAccessToProject.ts";
import { lookingForUsers } from "../../user-group/api/lookingForUsers.ts";


interface AllProjectsProps {
  user: User;
  setSelectedProjectId: (id: number) => void;
  selectedProjectId?: number;
  setUserProjects:(userProjects: ProjectUser[])=>void;
  userProjects:ProjectUser[]
  handleSetMiradorState:(state:IState | undefined)=>void;
}

const emptyWorkspace: IState = {
  catalog: [],
  companionWindows: {},
  config: {
    selectedTheme: "light"
  },
  elasticLayout: {},
  layers: {},
  manifests: {},
  viewers: {},
  windows: {},
  workspace: {},
};

export const AllProjects = ({ user, selectedProjectId, setSelectedProjectId,userProjects,setUserProjects,handleSetMiradorState }:AllProjectsProps) => {
  const [searchedProject, setSearchedProject] = useState<ProjectUser|null>(null);
  const [userPersonalGroup, setUserPersonalGroup] = useState<UserGroup>()
  const [openModalProjectId, setOpenModalProjectId] = useState<number | null>(null); // Updated state
  const [userToAdd, setUserToAdd ] = useState<UserGroup | null>(null)
  const [modalCreateProjectIsOpen, setModalCreateProjectIsOpen]= useState(false);
  const [groupList, setGroupList] = useState<ProjectGroup[]>([]);

  const fetchProjects = async () => {
    try {
      const projects = await getUserAllProjects(user.id);
      setUserProjects(projects);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  const fetchUserPersonalGroup = async()=>{
    const personalGroup = await getUserPersonalGroup(user.id)
    setUserPersonalGroup(personalGroup)
  }
  useEffect(() => {
    fetchProjects();
    fetchUserPersonalGroup()
  }, [user]);



  const deleteUserProject = useCallback(async (projectId: number) => {
    await deleteProject(projectId);
    const updatedListOfProject = userProjects.filter(function(ProjectUser) {
      return ProjectUser.project.id != projectId;
    });
    setUserProjects(updatedListOfProject);
  },[setUserProjects, userProjects]);

  const updateUserProject = useCallback(async (projectUser:ProjectUser, newProjectName:string)=>{
    const updatedProject:ProjectUser = {...projectUser, project: {
        ...projectUser.project,
        name: newProjectName
      }}
    await updateProject({...updatedProject})
    let updatedListOfProject = userProjects.filter(function(p) {
      return p.project.id != updatedProject.project.id;
    });
    updatedListOfProject = [updatedProject,...updatedListOfProject]
    setUserProjects(updatedListOfProject);
  },[setUserProjects, userProjects])

  const initializeMirador = useCallback((miradorState: IState | undefined, projectUser: ProjectUser) => {
    setSelectedProjectId(projectUser.project.id);
    handleSetMiradorState(miradorState);
  },[handleSetMiradorState, setSelectedProjectId]);

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
    setUserProjects( [...userProjects,
      response]
    );
    initializeMirador(undefined, response)
    toggleModalProjectCreation()
  },[initializeMirador, setUserProjects, toggleModalProjectCreation, user, userProjects])

  const handleLookingForProject = async (partialProjectName: string) => {
    const userProjectArray = await lookingForProject(partialProjectName, userPersonalGroup!.id)
    const projectArray = []
    for(const projectUser of userProjectArray){
      projectArray.push(projectUser.project)
    }
    return projectArray;
  }

  const handleSetSearchProject = (project:Project)=>{
    if(project){
      const  searchedProject = userProjects.find(userProject => userProject.project.id === project.id)
      setSearchedProject(searchedProject!)
    }else{
      setSearchedProject(null);
    }
  }

  const HandleOpenModal =useCallback ((projectId: number)=>{
    setOpenModalProjectId(openModalProjectId === projectId ? null : projectId); // Updated logic
  },[setOpenModalProjectId, openModalProjectId])


  const handleAddUser = async ( projectId: number) => {
      await addProjectToGroup({ projectsId: [projectId], groupId: userToAdd!.id });
  };

  const handleRemoveUser = async ( projectId: number, userToRemoveId: number) =>{
    await removeProjectToGroup({ groupId: userToRemoveId, projectId:projectId })
  }

  const getOptionLabel = (option: UserGroup , searchInput: string): string => {
    const user = option.users![0];
    if (user.mail.toLowerCase().includes(searchInput.toLowerCase())) {
      return user.mail;
    }
    if (user.name.toLowerCase().includes(searchInput.toLowerCase())) {
      return user.name;
    }
    return user.mail;
  };

  const handleChangeRights = async (group: ListItem, eventValue: string, projectId: number,ProjectUser:ProjectUser) => {
    const groups:ProjectGroup[] = await getGroupsAccessToProject(projectId);

    const userGroup = groups.find((itemGroup) => itemGroup.user_group.id === group.id);
    await updateProject({
      id: userGroup!.id,
      project: ProjectUser.project,
      group: userGroup!.user_group,
      rights: eventValue as ProjectRights
    });
  };

  const listOfGroup: ListItem[] = useMemo(() => {
    return groupList.map((projectGroup) => ({
      id: projectGroup.user_group.id,
      name: projectGroup.user_group.name,
      rights: projectGroup.rights
    }));
  }, [groupList]);

  const getOptionLabelForProjectSearchBar = (option: Project): string => {
    return option.name;
  };

  return (
    <>
      <Grid container spacing={2} justifyContent="center" flexDirection="column">
        <Grid item container direction="row-reverse" spacing={2} alignItems="center">
          {
            !selectedProjectId &&(
              <Grid item>
                <SearchBar fetchFunction={handleLookingForProject} getOptionLabel={getOptionLabelForProjectSearchBar} setSearchedData={handleSetSearchProject}/>
              </Grid>
            )
          }
        </Grid>
        <Grid item container spacing={1}>
          {!userProjects.length && (
            <Grid
              container
              justifyContent={"center"}
            >
              <Typography variant="h6" component="h2">No projects yet, start to work when clicking on "New project" button.</Typography>
            </Grid>
          )}
          {!selectedProjectId && !searchedProject && userProjects && (
            <Grid item container spacing={1} flexDirection="column" sx={{marginBottom:"70px"}}>
              {userProjects.map((projectUser) => (
                  <>
                    <Grid item>
                      <MMUCard
                        description="Some description"
                        HandleOpenModal={()=>HandleOpenModal(projectUser.project.id)}
                        openModal={openModalProjectId === projectUser.project.id}
                        DefaultButton={<ProjectDefaultButton initializeMirador={initializeMirador} projectUser={projectUser}/>}
                        EditorButton={<ProjectEditorButton HandleOpenModal={()=>HandleOpenModal(projectUser.project.id)}/>}
                        ReaderButton={<ProjectReaderButton HandleOpenModal={()=>HandleOpenModal(projectUser.project.id)} />}
                        id={projectUser.id}
                        name={projectUser.project.name}
                        rights={projectUser.rights}
                        deleteItem={deleteUserProject}
                        getOptionLabel={getOptionLabel}
                        AddAccessListItemFunction={handleAddUser}
                        handleSelectorChange={handleChangeRights}
                        item={projectUser.project}
                        itemLabel={projectUser.project.name}
                        itemOwner={projectUser}
                        listOfItem={listOfGroup}
                        searchModalEditItem={lookingForUsers}
                        getAccessToItem={getGroupsAccessToProject}
                        setItemToAdd={setUserToAdd}
                        updateItem={updateUserProject}
                        removeAccessListItemFunction={handleRemoveUser}
                        setItemList={setGroupList}
                      />
                    </Grid>
                  </>
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
          ) }
          {
            searchedProject && !selectedProjectId &&(
              <Grid item container spacing={1} flexDirection="column" sx={{marginBottom:"70px"}}>
                <Grid item>
                  <MMUCard
                    description="Some description"
                    HandleOpenModal={()=>HandleOpenModal(searchedProject.project.id)}
                    openModal={openModalProjectId === searchedProject.project.id}
                    DefaultButton={<ProjectDefaultButton initializeMirador={initializeMirador} projectUser={searchedProject}/>}
                    EditorButton={<ProjectEditorButton HandleOpenModal={()=>HandleOpenModal(searchedProject.project.id)}/>}
                    ReaderButton={<ProjectReaderButton HandleOpenModal={()=>HandleOpenModal(searchedProject.project.id)} />}
                    id={searchedProject.id}
                    name={searchedProject.project.name}
                    rights={searchedProject.rights}
                    deleteItem={deleteUserProject}
                    getOptionLabel={getOptionLabel}
                    AddAccessListItemFunction={handleAddUser}
                    handleSelectorChange={handleChangeRights}
                    item={searchedProject.project}
                    itemLabel={searchedProject.project.name}
                    itemOwner={searchedProject}
                    listOfItem={listOfGroup}
                    searchModalEditItem={lookingForUsers}
                    getAccessToItem={getGroupsAccessToProject}
                    setItemToAdd={setUserToAdd}
                    updateItem={updateUserProject}
                    removeAccessListItemFunction={handleRemoveUser}
                    setItemList={setGroupList}
                  />
                </Grid>

              </Grid>
            )
          }
        </Grid>
      </Grid>
    </>
  );
};
