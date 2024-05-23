import { Button, Card, CardActions, Grid, Tooltip, Typography } from "@mui/material";
import IWorkspace from "../../mirador/interface/IWorkspace.ts";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import {  useCallback, useState } from "react";
import { MMUModal } from "../../../components/elements/modal.tsx";
import { ModalProject } from "./ModalContent.tsx";
import { Project } from "../types/types.ts";

interface CardProps {
  projectName: string,
  projectWorkspace: IWorkspace
  initializeMirador: (projectWorkspace: IWorkspace, projectId: number) => void,
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
          <Grid item container flexDirection="row"  alignItems="center" justifyContent="space-around" spacing={2}>
            <Grid item xs={5}>
              <Typography variant="subtitle1">{projectName}</Typography>
            </Grid>
            {NumberOfManifests == 0 && (
              <Grid item xs={4}>
                No manifest
              </Grid>
            )
            }
            {NumberOfManifests == 1 && (
              <Grid item>
                {NumberOfManifests} manifest
              </Grid>
            )
            }
            {NumberOfManifests > 1 && (
              <Grid item>
                {NumberOfManifests} manifests
              </Grid>
            )
            }
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
                {deleteProject && projectId && (
                  <>
                  <Grid item>
                    <Tooltip title={"Delete project"}>
                      <Button
                        onClick={() => {
                          deleteProject(projectId);
                        }}
                        variant="contained"
                      >
                        <DeleteIcon />
                      </Button>
                    </Tooltip>
                  </Grid>
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
            <MMUModal openModal={openModal} setOpenModal={HandleOpenModal} children={<ModalProject updateUserProject={updateUserProject} project={project!}/>}/>
          </Grid>
        </Grid>
      </Card>
    </>
  );
};
