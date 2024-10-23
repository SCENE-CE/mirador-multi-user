import {  Grid,  Typography } from "@mui/material";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { Project, ProjectGroup, ProjectGroupUpdateDto } from "../types/types.ts";
import IState from "../../mirador/interface/IState.ts";
import { User } from "../../auth/types/types.ts";
import { deleteProject } from "../api/deleteProject.ts";
import { getUserAllProjects } from "../api/getUserAllProjects.ts";
import { updateProject } from "../api/updateProject";
import { createProject } from "../api/createProject";
import { FloatingActionButton } from "../../../components/elements/FloatingActionButton.tsx";
import { DrawerCreateProject } from "./DrawerCreateProject.tsx";
import { SearchBar } from "../../../components/elements/SearchBar.tsx";
import { lookingForProject } from "../api/lookingForProject.ts";
import { getUserPersonalGroup } from "../api/getUserPersonalGroup.ts";
import { LinkUserGroup, ProjectRights, UserGroup } from "../../user-group/types/types.ts";
import MMUCard from "../../../components/elements/MMUCard.tsx";
import { removeProjectToGroup } from "../../user-group/api/removeProjectToGroup.ts";
import { addProjectToGroup } from "../../user-group/api/addProjectToGroup.ts";
import { ListItem } from "../../../components/types.ts";
import { getGroupsAccessToProject } from "../api/getGroupsAccessToProject.ts";
import { lookingForUsers } from "../../user-group/api/lookingForUsers.ts";
import AddIcon from "@mui/icons-material/Add";
import { ModalButton } from "../../../components/elements/ModalButton.tsx";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { lookingForUserGroups } from "../../user-group/api/lookingForUserGroups.ts";
import { Media } from "../../media/types/types.ts";
import { getUserGroupMedias } from "../../media/api/getUserGroupMedias.ts";
import { SidePanelMedia } from "../../media/component/SidePanelMedia.tsx";
import { PaginationControls } from "../../../components/elements/Pagination.tsx";
import { updateAccessToProject } from "../api/UpdateAccessToProject.ts";
import SettingsIcon from '@mui/icons-material/Settings';

interface AllProjectsProps {
  user: User;
  setSelectedProjectId: (id: number) => void;
  selectedProjectId?: number;
  setUserProjects:(userProjects: Project[])=>void;
  userProjects:Project[]
  handleSetMiradorState:(state:IState | undefined)=>void;
  medias:Media[];
  setMedias:Dispatch<SetStateAction<Media[]>>
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

export const AllProjects = ({ setMedias, medias, user, selectedProjectId, setSelectedProjectId,userProjects,setUserProjects,handleSetMiradorState }:AllProjectsProps) => {
  const [searchedProject, setSearchedProject] = useState<Project|null>(null);
  const [userPersonalGroup, setUserPersonalGroup] = useState<UserGroup>()
  const [openModalProjectId, setOpenModalProjectId] = useState<number | null>(null);
  const [userToAdd, setUserToAdd ] = useState<LinkUserGroup | null>(null)
  const [modalCreateProjectIsOpen, setModalCreateProjectIsOpen]= useState(false);
  const [groupList, setGroupList] = useState<ProjectGroup[]>([]);
  const [userGroupsSearch, setUserGroupSearch] = useState<LinkUserGroup[]>([])
  const [projectFiltered, setProjectFiltered] = useState<Project[]|undefined>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const currentPageData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return userProjects.slice(start, end);
  }, [currentPage, userProjects]);

  const totalPages = Math.ceil(userProjects.length / itemsPerPage);


  console.log(userProjects)
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
  }, [user,openModalProjectId]);



  const deleteUserProject = useCallback(async (projectId: number) => {
    await deleteProject(projectId);
    setOpenModalProjectId(null)
    const updatedListOfProject = userProjects.filter(function(ProjectUser) {
      return ProjectUser.id != projectId;
    });
    setUserProjects(updatedListOfProject);
  },[setUserProjects, userProjects]);

  const updateUserProject = useCallback(async (projectUpdated:Project)=>{
    const { rights , ...projectToUpdate } = projectUpdated;
    let updatedProject : ProjectGroupUpdateDto ;
    if(rights){
      updatedProject = {
        project : { ...projectToUpdate },
        group:userPersonalGroup,
        rights:rights
      }
    }else{
      updatedProject = {
        project : { ...projectToUpdate },
        group:userPersonalGroup,
      }
    }
    await updateProject({...updatedProject})
    let updatedListOfProject = userProjects.filter(function(p) {
      return p.id != updatedProject.project.id;
    });
    updatedListOfProject = [projectUpdated,...updatedListOfProject]
    setUserProjects(updatedListOfProject);
  },[setUserProjects, userPersonalGroup, userProjects])


  const initializeMirador = useCallback((miradorState: IState | undefined, projectUser: Project) => {
    setSelectedProjectId(projectUser.id);
    handleSetMiradorState(miradorState);
  },[handleSetMiradorState, setSelectedProjectId]);

  const toggleModalProjectCreation = useCallback(()=>{
    setModalCreateProjectIsOpen(!modalCreateProjectIsOpen);
  },[modalCreateProjectIsOpen,setModalCreateProjectIsOpen])

  const InitializeProject = useCallback(async (workspace: IState, projectName: string) => {
    const response = await createProject({
        name: projectName,
        ownerId: user.id,
        userWorkspace: workspace,
        metadata: {},
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
    console.log(projectArray);
    return projectArray;
  }

  const handleSetSearchProject = (project:Project)=>{
    if(project){
      const  searchedProject = userProjects.find(userProject => userProject.id === project.id)
      setSearchedProject(searchedProject!)
    }else{
      setSearchedProject(null);
    }
  }

  const HandleOpenModal =useCallback ((projectId: number)=>{
    setOpenModalProjectId(openModalProjectId === projectId ? null : projectId);
  },[setOpenModalProjectId, openModalProjectId])


  const handleAddUser = async ( projectId: number) => {
    const linkUserGroupToAdd = userGroupsSearch.find((linkUserGroup)=> linkUserGroup.user_group.id === userToAdd!.id)
    await addProjectToGroup({ projectId:projectId, groupId:linkUserGroupToAdd!.user_group.id });
  };

  const handleRemoveUser = async ( projectId: number, userToRemoveId: number) =>{
    await removeProjectToGroup({ groupId: userToRemoveId, projectId:projectId })
  }

  const getOptionLabel = (option: UserGroup): string => {
    return option.name
  };

  const handleChangeRights = async (group: ListItem, eventValue: string, projectId: number) => {

    await updateAccessToProject(
    projectId,
     group.id,
     eventValue as ProjectRights,
    );

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

  const handleLookingForUserGroups = async (partialString: string) => {
    if(partialString.length > 0){

    const linkUserGroups : LinkUserGroup[] = await lookingForUserGroups(partialString);
    const uniqueUserGroups : UserGroup[] = linkUserGroups.map((linkUserGroup) => linkUserGroup.user_group)
      .filter(
        (group, index, self) =>
          index === self.findIndex((g) => g.id === group.id),
      );
    setUserGroupSearch(linkUserGroups);
    return uniqueUserGroups
    }else{
      setUserGroupSearch([])
      return []
    }
  }

  const handleFiltered = (partialString:string)=>{
    if(partialString.length < 1){
      return setProjectFiltered([])
    }
    if(partialString.length > 0 ){
      const filteredProjects = userProjects.filter((project)=>project.name.startsWith(partialString))
      if(filteredProjects.length >= 1){
        setProjectFiltered(filteredProjects)
      }else{
        setProjectFiltered(undefined)
      }
    }
  }

  const fetchMediaForUser = async()=>{
    const medias = await getUserGroupMedias(userPersonalGroup!.id)
    setMedias(medias);
  }

  console.log('openModalProjectId',openModalProjectId)
  return (
    <>
      <SidePanelMedia display={!!openModalProjectId} fetchMediaForUser={fetchMediaForUser} medias={medias} user={user} userPersonalGroup={userPersonalGroup!}>
        <Grid container spacing={2} justifyContent="center" flexDirection="column">
          <Grid item container direction="row-reverse" spacing={2} alignItems="center" sx={{position:'sticky', top:0, zIndex:1000, backgroundColor:'#dcdcdc', paddingBottom:"10px"}}>
            {
              !selectedProjectId &&(
                <Grid item>
                  <SearchBar handleFiltered={handleFiltered} label={"Filter Projects"} fetchFunction={handleLookingForProject} getOptionLabel={getOptionLabelForProjectSearchBar} setSearchedData={handleSetSearchProject}/>
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
            {!selectedProjectId && projectFiltered && projectFiltered.length < 1 && !searchedProject && userProjects && (
              <Grid item container spacing={1} flexDirection="column" sx={{marginBottom:"70px"}}>
                {currentPageData.map((projectUser) => (
                    <Grid item key={projectUser.id}>
                      <MMUCard
                        thumbnailUrl={projectUser.thumbnailUrl ? projectUser.thumbnailUrl : null }
                        searchBarLabel={"Search"}
                        description={projectUser.description}
                        HandleOpenModal={()=>HandleOpenModal(projectUser.id)}
                        openModal={openModalProjectId === projectUser.id}
                        DefaultButton={<ModalButton tooltipButton={"Open Project"} onClickFunction={()=>initializeMirador(projectUser.userWorkspace, projectUser)} disabled={false} icon={<OpenInNewIcon/>}/>}
                        EditorButton={<ModalButton  tooltipButton={"Configuration"} onClickFunction={()=>HandleOpenModal(projectUser.id)} icon={<SettingsIcon />} disabled={false}/>}
                        ReaderButton={<ModalButton tooltipButton={"Configuration"} onClickFunction={()=>console.log("You're not allowed to do this")} icon={<SettingsIcon />} disabled={true}/>}
                        id={projectUser.id}
                        rights={projectUser.rights!}
                        deleteItem={deleteUserProject}
                        getOptionLabel={getOptionLabel}
                        AddAccessListItemFunction={handleAddUser}
                        handleSelectorChange={handleChangeRights}
                        item={projectUser}
                        itemLabel={projectUser.name}
                        itemOwner={projectUser.owner}
                        listOfItem={listOfGroup}
                        searchModalEditItem={handleLookingForUserGroups}
                        getAccessToItem={getGroupsAccessToProject}
                        setItemToAdd={setUserToAdd}
                        updateItem={updateUserProject}
                        removeAccessListItemFunction={handleRemoveUser}
                        setItemList={setGroupList}
                        metadata={projectUser.metadata}
                      />
                    </Grid>
                  )
                )
                }
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
                <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}/>
              </Grid>
            ) }
            {
              searchedProject && !selectedProjectId &&(
                <Grid item container spacing={1} flexDirection="column" sx={{marginBottom:"70px"}}>
                  <Grid item>
                    <MMUCard
                      metadata={searchedProject.metadata}
                      searchBarLabel={"Search Users"}
                      description={searchedProject.description}
                      HandleOpenModal={()=>HandleOpenModal(searchedProject.id)}
                      openModal={openModalProjectId === searchedProject.id}
                      DefaultButton={<ModalButton tooltipButton={"Open Project"} onClickFunction={()=>initializeMirador(searchedProject.userWorkspace,searchedProject)} disabled={false} icon={<OpenInNewIcon/>}/>}
                      EditorButton={<ModalButton tooltipButton={"Configuration"} onClickFunction={()=>HandleOpenModal(searchedProject.id)} icon={<SettingsIcon />} disabled={false}/>}
                      ReaderButton={<ModalButton tooltipButton={"Open Project"} onClickFunction={()=>console.log("You're not allowed to do this")} icon={<ModeEditIcon />} disabled={true}/>}
                      id={searchedProject.id}
                      rights={searchedProject.rights!}
                      deleteItem={deleteUserProject}
                      getOptionLabel={getOptionLabel}
                      AddAccessListItemFunction={handleAddUser}
                      handleSelectorChange={handleChangeRights}
                      item={searchedProject}
                      itemLabel={searchedProject.name}
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
            {
              projectFiltered && projectFiltered.length > 0 && !searchedProject &&(
                <Grid item container spacing={1} flexDirection="column" sx={{marginBottom:"70px"}}>
                  {projectFiltered.map((projectUser) => (
                      <Grid item key={projectUser.id}>
                        <MMUCard
                          metadata={projectUser.metadata}
                          searchBarLabel={"Search"}
                          description={projectUser.description}
                          HandleOpenModal={()=>HandleOpenModal(projectUser.id)}
                          openModal={openModalProjectId === projectUser.id}
                          DefaultButton={<ModalButton tooltipButton={"Open Project"} onClickFunction={()=>initializeMirador(projectUser.userWorkspace, projectUser)} disabled={false} icon={<OpenInNewIcon/>}/>}
                          EditorButton={<ModalButton  tooltipButton={"Configuration"} onClickFunction={()=>HandleOpenModal(projectUser.id)} icon={<SettingsIcon />} disabled={false}/>}
                          ReaderButton={<ModalButton tooltipButton={"Open Project"} onClickFunction={()=>console.log("You're not allowed to do this")} icon={<ModeEditIcon />} disabled={true}/>}
                          id={projectUser.id}
                          rights={projectUser.rights!}
                          deleteItem={deleteUserProject}
                          getOptionLabel={getOptionLabel}
                          AddAccessListItemFunction={handleAddUser}
                          handleSelectorChange={handleChangeRights}
                          item={projectUser}
                          itemLabel={projectUser.name}
                          itemOwner={projectUser.owner}
                          listOfItem={listOfGroup}
                          searchModalEditItem={handleLookingForUserGroups}
                          getAccessToItem={getGroupsAccessToProject}
                          setItemToAdd={setUserToAdd}
                          updateItem={updateUserProject}
                          removeAccessListItemFunction={handleRemoveUser}
                          setItemList={setGroupList}
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
              )
            }
            {
              !projectFiltered && (
                <Grid item container justifyContent="center" alignItems="center">
                  <Typography variant="h6" component="h2">There is no project matching your research.</Typography>
                </Grid>
              )
            }
          </Grid>
        </Grid>
      </SidePanelMedia>
    </>
  );
};
