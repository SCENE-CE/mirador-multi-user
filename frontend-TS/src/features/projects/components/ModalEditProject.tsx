import {
  Button,
  Grid,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { ChangeEvent, useCallback, useState } from "react";
import { Project, ProjectUser } from "../types/types.ts";
import SaveIcon from "@mui/icons-material/Save";
import { MMUModal } from "../../../components/elements/modal.tsx";
import { ModalConfirmDelete } from "./ModalConfirmDelete.tsx";
import { ProjectRights } from "../../user-group/types/types.ts";
import { ProjectUserGroupList } from "./ProjectUserGroupList.tsx";

interface ModalProjectProps {
  projectUser:ProjectUser,
  project:Project,
  updateUserProject:(project:ProjectUser, newProjectName:string)=>void,
  deleteProject:(projectId:number)=>void,
}

export const ModalEditProject = ({ projectUser,project, updateUserProject, deleteProject }:ModalProjectProps)=>{
  const [editName, setEditName] = useState(false);
  const [ newProjectName, setNewProjectName] = useState(project!.name);
  const [openModal, setOpenMOdal] = useState(false)

  const HandleUpdateProject = useCallback(async ()=>{
    updateUserProject(projectUser,newProjectName);
    setEditName(!editName)
  },[editName, newProjectName, project])


  const handleEditName = useCallback(()=>{
    setEditName(!editName)
  },  [setEditName,editName])


  const handleChangeName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setNewProjectName(e.target.value);
  }, []);

  const handleConfirmDeleteModal = useCallback(
    ()=>{
      setOpenMOdal(!openModal)
    },[openModal]
  )


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
        {projectUser.rights === ProjectRights.ADMIN || projectUser.rights === ProjectRights.EDITOR &&(
          <ProjectUserGroupList projectUser={projectUser}/>
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
