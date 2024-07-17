import { Button, Card, CardActions, Grid, Tooltip, Typography } from "@mui/material";
import IState from "../../mirador/interface/IState.ts";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import {  useCallback, useState } from "react";
import { MMUModal } from "../../../components/elements/modal.tsx";
import { ModalEditProject } from "./ModalEditProject.tsx";
import { ProjectUser } from "../types/types.ts";
import placeholder from "../../../assets/Placeholder.svg"

interface CardProps {
  initializeMirador: (projectWorkspace: IState, projectId: number) => void,
  deleteProject: (projectId: number) => void,
  ProjectUser:ProjectUser,
  updateUserProject:(project:ProjectUser, newProjectName:string)=>void,
}

export const ProjectCard= ({
  initializeMirador,
  deleteProject,
  ProjectUser,
  updateUserProject
}:CardProps
) => {
  const [openModal, setOpenMOdal] = useState(false)
const project = ProjectUser.project
  const HandleOpenModal = useCallback(()=>{
    setOpenMOdal(!openModal)
  },[setOpenMOdal,openModal])

  return (
    <>
      <Card>
        <Grid item container flexDirection="row" wrap="nowrap" justifyContent="space-between" sx={{minHeight:'120px'}}>
          <Grid item container flexDirection="row"  alignItems="center" justifyContent="flex-start" spacing={2}>
            <Grid item xs={12} sm={4}>
              <img src={placeholder} alt="placeholder" style={{height:100, width:200}}/>
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
                    initializeMirador(project.userWorkspace, project.id);
                  }}
                  variant="contained"
                >
                  <OpenInNewIcon />
                </Button>
              </Tooltip>
                </Grid>
                {project.id && (
                  <>
                  <Grid item>
                    <Tooltip title={"Project configuration"}>
                      <Button
                        onClick={HandleOpenModal}
                        variant="contained"
                      >
                        <ModeEditIcon/>
                      </Button>
                    </Tooltip>
                  </Grid>
                  </>
                )}
              </Grid>
            </CardActions>
            <MMUModal width={400} openModal={openModal} setOpenModal={HandleOpenModal} children={<ModalEditProject project={project} deleteProject={deleteProject!} updateUserProject={updateUserProject} projectUser={ProjectUser}/>}/>
          </Grid>
        </Grid>
      </Card>
    </>
  );
};
