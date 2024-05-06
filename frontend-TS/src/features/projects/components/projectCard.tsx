import { FC } from "react";
import { Button, Card, CardActionArea, Grid } from "@mui/material";
import IWorkspace from "../../mirador/interface/IWorkspace.ts";

interface CardProps {
  projectName: string,
  projectId: number,
  projectWorkspace:IWorkspace
  initializeMirador: (projectWorkspace:IWorkspace, projectName:string) => void,
}

export const ProjectCard: FC<CardProps>= ({
  projectName,
  projectId,
  projectWorkspace,
  initializeMirador
}
) => {
  return(
    <Grid item key={projectId}>
      <Card sx={{ maxWidth: 250 }} raised={true}>
        <CardActionArea>
          <Button onClick={() => initializeMirador(projectWorkspace, projectName)}>
            {projectName}
          </Button>
        </CardActionArea>
      </Card>
    </Grid>
  )
}
