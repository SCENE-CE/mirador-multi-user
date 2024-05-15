import { FC } from "react";
import { Button, Card, CardActions, Grid, Tooltip, Typography } from "@mui/material";
import IWorkspace from "../../mirador/interface/IWorkspace.ts";
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import DeleteIcon from '@mui/icons-material/Delete';
interface CardProps {
  projectName: string,
  projectWorkspace:IWorkspace
  initializeMirador: (projectWorkspace: IWorkspace, projectId: number | undefined) => void,
  NumberOfManifests?:number,
  deleteProject?:(projectId:number) => void,
  projectId?:number,
}

export const ProjectCard: FC<CardProps>= ({
  projectName,
  projectWorkspace,
  initializeMirador,
  NumberOfManifests,
  deleteProject,
  projectId
}
) => {
  return(
    <Grid item>
      <Card sx={{ width: 175, height:125, padding:'1px'}}>
        <Grid item container flexDirection="column" justifyContent="space-between" sx={{width:'100%', height:'100%'}}>
          <Grid  item container flexDirection='column' alignItems="center" justifyContent="center" spacing={2}>
            <Grid item>
              <Typography variant="subtitle1">{projectName}</Typography>
            </Grid>
            {NumberOfManifests &&(
              <Grid item>
                {NumberOfManifests} Manifests
              </Grid>
            )
            }
          </Grid>
          <Grid item>
            <CardActions>
              <Tooltip title={"Open project"}>
                <Button
                  onClick={ ()=> {
                    initializeMirador(projectWorkspace,projectId);
                  }}
                  variant="contained"
                >
                  <OpenInBrowserIcon/>
                </Button>
              </Tooltip>
              {deleteProject && projectId &&(
              <Tooltip title={"Delete project"}>
                <Button
                  onClick={()=> {
                    deleteProject(projectId);
                  }}
                  variant="contained"
                >
                  <DeleteIcon/>
                </Button>
              </Tooltip>
                )}
            </CardActions>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  )
}
