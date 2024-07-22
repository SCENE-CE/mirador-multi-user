import {
  Button,
  Grid,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Project, ProjectGroup, ProjectUser } from "../types/types.ts";
import SaveIcon from "@mui/icons-material/Save";
import { MMUModal } from "../../../components/elements/modal.tsx";
import { ModalConfirmDelete } from "./ModalConfirmDelete.tsx";
import { ProjectRights, UserGroup } from "../../user-group/types/types.ts";
import { ProjectUserGroupList } from "./ProjectUserGroupList.tsx";
import { SearchBar } from "../../../components/elements/SearchBar.tsx";
import { lookingForUsers } from "../../user-group/api/lookingForUsers.ts";
import { getGroupsAccessToProject } from "../api/getGroupsAccessToProject.ts";
import { addProjectToGroup } from "../../user-group/api/addProjectToGroup.ts";

interface ModalProjectProps {
  projectUser:ProjectUser,
  project:Project,
  updateUserProject:(project:ProjectUser, newProjectName:string)=>void,
  deleteProject:(projectId:number)=>void,
}

export const ModalEditProject = ({ projectUser, project, updateUserProject, deleteProject }: ModalProjectProps) => {
  const [editName, setEditName] = useState(false);
  const [newProjectName, setNewProjectName] = useState(project!.name);
  const [openModal, setOpenModal] = useState(false);
  const [userToAdd, setUserToAdd] = useState<UserGroup | null>(null);
  const [searchInput, setSearchInput] = useState<string>('');
  const [groupList, setGroupList] = useState<ProjectGroup[]>([]);

  const HandleUpdateProject = useCallback(async () => {
    updateUserProject(projectUser, newProjectName);
    setEditName(!editName);
  }, [editName, newProjectName, projectUser, updateUserProject]);

  const handleEditName = useCallback(() => {
    setEditName(!editName);
  }, [editName]);

  const fetchGroupsForProject = useCallback(async () => {
    const groups = await getGroupsAccessToProject(project.id);
    setGroupList(groups);
  }, [project.id]);

  const handleChangeName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setNewProjectName(e.target.value);
  }, []);

  const handleConfirmDeleteModal = useCallback(() => {
    setOpenModal(!openModal);
  }, [openModal]);

  const handleAddUser = async () => {
    if (userToAdd) {
      await addProjectToGroup({ projectsId: [project.id], groupId: userToAdd.id });
      fetchGroupsForProject(); // Refresh the list after adding a user
    }
  };

  const getOptionLabel = (option: UserGroup): string => {
    const user = option.users[0];
    if (user.mail.toLowerCase().includes(searchInput.toLowerCase())) {
      return user.mail;
    }
    if (user.name.toLowerCase().includes(searchInput.toLowerCase())) {
      return user.name;
    }
    return user.mail;
  };

  useEffect(() => {
    fetchGroupsForProject();
  }, [fetchGroupsForProject]);
  return(
    <Grid container>

      <Grid item container flexDirection="column">
        {!editName ? (
            <Grid item sx={{minHeight:'100px'}} container flexDirection="row" justifyContent="space-between" alignItems="center">
              <Typography>{project.name}</Typography>
              <Button variant="contained" onClick={handleEditName}>
                <ModeEditIcon/>
              </Button>
            </Grid>
          ):
          (
            <Grid item sx={{minHeight:'100px'}} container flexDirection="row" justifyContent="space-between" alignItems="center">
              <TextField type="text" onChange={handleChangeName} variant="outlined" defaultValue={project.name}/>
              <Button variant="contained" onClick={HandleUpdateProject}>
                <SaveIcon/>
              </Button>
            </Grid>
          )}
        {projectUser.rights !== ProjectRights.READER  &&(
          <>
            <SearchBar
              handleAdd={handleAddUser}
              setSelectedData={setUserToAdd}
              getOptionLabel={getOptionLabel}
              fetchFunction={lookingForUsers}
              setSearchInput={setSearchInput}
              actionButtonLabel={"ADD"}
            />
            <ProjectUserGroupList projectUser={projectUser} groupList={groupList} setGroupList={setGroupList}/>
          </>
        )}
        {projectUser.rights === ProjectRights.ADMIN &&(
          <>
            <Grid item>
              <Tooltip title={"Delete project"}>
                <Button
                  color='error'
                  onClick={handleConfirmDeleteModal}
                  variant="contained"
                >
                  DELETE PROJECT
                </Button>
              </Tooltip>
            </Grid>
            <MMUModal width={400} openModal={openModal} setOpenModal={handleConfirmDeleteModal} children={<ModalConfirmDelete deleteProject={deleteProject} projectId={project.id} projectName={project.name}/>}/>
          </>
        )
        }
      </Grid>
    </Grid>
  )
}
