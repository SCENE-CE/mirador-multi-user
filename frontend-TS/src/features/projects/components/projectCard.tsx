import { Button, Card, CardActions, Grid, SelectChangeEvent, Tooltip, Typography } from "@mui/material";
import IState from "../../mirador/interface/IState.ts";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { useCallback, useMemo, useState } from "react";
import { MMUModal } from "../../../components/elements/modal.tsx";
import { Project, ProjectGroup, ProjectUser } from "../types/types.ts";
import placeholder from "../../../assets/Placeholder.svg";
import { ProjectRights, UserGroup } from "../../user-group/types/types.ts";
import { MMUModalEdit } from "../../../components/elements/MMUModalEdit.tsx";
import { ListItem } from "../../../components/types.ts";
import { getGroupsAccessToProject } from "../api/getGroupsAccessToProject.ts";
import { updateProject } from "../api/updateProject.ts";
import { addProjectToGroup } from "../../user-group/api/addProjectToGroup.ts";
import { lookingForUsers } from "../../user-group/api/lookingForUsers.ts";

interface CardProps {
  initializeMirador: (projectWorkspace: IState, projectUser: ProjectUser) => void,
  deleteProject: (projectId: number) => void,
  ProjectUser:ProjectUser,
  updateUserProject:(project:ProjectUser, newProjectName:string)=>void,
  project:Project
}

export const ProjectCard= (
  {
    initializeMirador,
    deleteProject,
    ProjectUser,
    updateUserProject,
    project
  }:CardProps
) => {
  const [openModal, setOpenMOdal] = useState(false)
  const [groupList, setGroupList] = useState<ProjectGroup[]>([]);
  const [userToAdd, setUserToAdd] = useState<UserGroup | null>(null);
  const [searchInput, setSearchInput] = useState<string>('');



  const handleChangeRights = (group: ListItem) => async (event: SelectChangeEvent) => {
    const userGroup = groupList.find((itemGroup) => itemGroup.user_group.id === group.id);
    await updateProject({
      id: userGroup!.id,
      project: ProjectUser.project,
      group: userGroup!.user_group,
      rights: event.target.value as ProjectRights
    });
    await fetchGroupsForProject();
  };

  const fetchGroupsForProject = useCallback(async () => {
    const groups = await getGroupsAccessToProject(project.id);
    setGroupList(groups);
  }, [project.id]);

  const HandleOpenModal = useCallback(()=>{
    setOpenMOdal(!openModal)
  },[setOpenMOdal,openModal])

  const handleAddUser = async () => {
    if (userToAdd) {
      await addProjectToGroup({ projectsId: [project.id], groupId: userToAdd.id });
      fetchGroupsForProject(); // Refresh the list after adding a user
    }
  };

  const getOptionLabel = (option: UserGroup): string => {
    const user = option.users![0];
    if (user.mail.toLowerCase().includes(searchInput.toLowerCase())) {
      return user.mail;
    }
    if (user.name.toLowerCase().includes(searchInput.toLowerCase())) {
      return user.name;
    }
    return user.mail;
  };

  const listOfGroup: ListItem[] = useMemo(() => {
    return groupList.map((projectGroup) => ({
      id: projectGroup.user_group.id,
      name: projectGroup.user_group.name,
      rights: projectGroup.rights.toString()
    }));
  }, [groupList]);

  return (
    <Card>
      <Grid item container flexDirection="row" wrap="nowrap" sx={{minHeight:'120px'}}>
        <Grid item container flexDirection="row"  alignItems="center" justifyContent="flex-start" spacing={2}>
          <Grid item xs={12} sm={4}>
            <img src={placeholder} alt="placeholder" style={{height:100, width:150}}/>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1">{project.name}</Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            {project.userWorkspace.catalog.length === 0 && "No manifest"}
            {project.userWorkspace.catalog.length === 1 && `${project.userWorkspace.catalog.length} manifest`}
            {project.userWorkspace.catalog.length > 1 && `${project.userWorkspace.catalog.length} manifests`}
          </Grid>
        </Grid>
        <Grid item
              alignSelf="center"
        >
          <CardActions>
            <Grid item container flexDirection="row" wrap="nowrap" spacing={2}>
              <Grid item>

                <Tooltip title={"Open project"}>
                  <Button
                    onClick={() => {
                      initializeMirador(project.userWorkspace, ProjectUser);
                    }}
                    variant="contained"
                  >
                    <OpenInNewIcon />
                  </Button>
                </Tooltip>
              </Grid>
              {project.id  && (
                <>
                  <Grid item>
                    {
                      ProjectUser.rights == ProjectRights.READER ? (
                        <Button
                          disabled={true}
                          onClick={HandleOpenModal}
                          variant="contained"
                        >
                          <ModeEditIcon/>
                        </Button>
                      ):(
                        <Tooltip title={"Project configuration"}>
                          <Button
                            disabled={false}
                            onClick={HandleOpenModal}
                            variant="contained"
                          >
                            <ModeEditIcon/>
                          </Button>
                        </Tooltip>
                      )
                    }
                  </Grid>
                </>
              )}
            </Grid>
          </CardActions>
          <MMUModal
            width={500}
            openModal={openModal}
            setOpenModal={HandleOpenModal}
            children={
              <MMUModalEdit
                label={ProjectUser.project.name}
                handleSelectorChange={handleChangeRights}
                fetchData={fetchGroupsForProject}
                listOfItem={listOfGroup}
                itemOwner={ProjectUser}
                deleteItem={deleteProject}
                getGroupsAccessToItem={getGroupsAccessToProject}
                getOptionLabel={getOptionLabel}
                setSearchInput={setSearchInput}
                handleAddItem={handleAddUser}
                item={ProjectUser}
                itemRights={ProjectUser.rights}
                searchInput={searchInput}
                searchModalEditItem={lookingForUsers}
                setItemToAdd={setUserToAdd}
                updateItem={updateUserProject}
                rights={ProjectUser.rights}
              />
            }/>
        </Grid>
      </Grid>
    </Card>
  );
};
