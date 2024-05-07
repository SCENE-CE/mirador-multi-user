import React, { FC } from "react";
import { Button, Card, CardActions, Grid, Tooltip, Typography } from "@mui/material";
import IWorkspace from "../../mirador/interface/IWorkspace.ts";
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';

interface CardProps {
  projectName: string,
  projectWorkspace:IWorkspace
  initializeMirador: (projectWorkspace: IWorkspace, projectName: string, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  NumberOfManifests?:number,
}

export const ProjectCard: FC<CardProps>= ({
  projectName,
  projectWorkspace,
  initializeMirador,
  NumberOfManifests,
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
                  onMouseDown={event => event.stopPropagation()}
                  onClick={event => {
                    event.stopPropagation();
                    event.preventDefault();
                    event.stopPropagation();
                    initializeMirador(projectWorkspace, projectName, event);
                  }}
                >
                  <OpenInBrowserIcon/>
                </Button>
              </Tooltip>
            </CardActions>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  )
}
