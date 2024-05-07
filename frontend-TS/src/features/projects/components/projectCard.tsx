import React, { FC } from "react";
import { Button, Card, CardActions, CardContent, Grid } from "@mui/material";
import IWorkspace from "../../mirador/interface/IWorkspace.ts";

interface CardProps {
  projectName: string,
  projectWorkspace:IWorkspace
  initializeMirador: (projectWorkspace: IWorkspace, projectName: string, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
}

export const ProjectCard: FC<CardProps>= ({
  projectName,
  projectWorkspace,
  initializeMirador
}
) => {
  return(
    <Grid item >
      <Card sx={{ maxWidth: 250 }} raised={true}>
        <CardActions>
          <CardContent>
            <Button
              onMouseDown={event => event.stopPropagation()}
              onClick={event => {
                event.stopPropagation();
                event.preventDefault();
                event.stopPropagation();
                initializeMirador(projectWorkspace, projectName, event);
              }}
            >
              {projectName}
            </Button>
          </CardContent>
        </CardActions>
      </Card>
    </Grid>
  )
}
