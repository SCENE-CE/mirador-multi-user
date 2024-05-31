import { Button, Card, CardActions, Grid, Tooltip, Typography } from "@mui/material";
import IState from "../../mirador/interface/IState.ts";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import {  useCallback, useState } from "react";
import { MMUModal } from "../../../components/elements/modal.tsx";
import { ModalEditProject } from "./ModalEditProject.tsx";
import { Project } from "../types/types.ts";
import placeholder from "../../../assets/Placeholder.svg"

interface CardProps {
  projectName: string,
  projectWorkspace: IState
  initializeMirador: (projectWorkspace: IState, projectId: number) => void,
  NumberOfManifests?: number,
  deleteProject?: (projectId: number) => void,
  projectId: number,
  project?:Project,
  updateUserProject:(project:Project, newProjectName:string)=>void,
}

export const ProjectCard= ({
  projectName,
  projectWorkspace,
  initializeMirador,
  NumberOfManifests = 0,
  deleteProject,
  projectId,
  project,
  updateUserProject
}:CardProps
) => {

  const [openModal, setOpenMOdal] = useState(false)
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
              <Typography variant="subtitle1">{projectName}</Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              {NumberOfManifests === 0 && "No manifest"}
              {NumberOfManifests === 1 && `${NumberOfManifests} manifest`}
              {NumberOfManifests > 1 && `${NumberOfManifests} manifests`}
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
                    initializeMirador(projectWorkspace, projectId);
                  }}
                  variant="contained"
                >
                  <OpenInNewIcon />
                </Button>
              </Tooltip>
                </Grid>
                {projectId && (
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
            <MMUModal openModal={openModal} setOpenModal={HandleOpenModal} children={<ModalEditProject deleteProject={deleteProject!} updateUserProject={updateUserProject} project={project!}/>}/>
          </Grid>
        </Grid>
      </Card>
    </>
  );
};
