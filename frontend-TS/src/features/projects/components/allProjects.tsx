import { Button, Card, CardActionArea, Grid, Typography } from "@mui/material";
import { getUserAllProjects } from "../../miscellaneous/api/getUserAllProjects.ts";
import { FC, useEffect, useState } from "react";
import {Project} from "../types/types.ts";
import MiradorViewer from "../../mirador/Mirador.tsx";
import IWorkspace from "../../mirador/interface/IWorkspace.ts";
import { User } from "../../auth/types/types.ts";

interface AllProjectsProps {
  user: User;
}


export const AllProjects: FC<AllProjectsProps> = ({ user }) => {
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [mirador, setMirador] = useState(false)
  const [miradorWorkspace, setMiradorWorkspace] = useState<IWorkspace>()
  const [projectTitle, setProjectTitle] = useState('')
  const emptyWorkspace: IWorkspace = {
    catalog:[],
    companionWindows:{},
    config:{},
    elasticLayout:{},
    layers:{},
    manifests:{},
    viewers:{},
    windows:{},
    workspace:{},
  }
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projects = await getUserAllProjects(user.id);
        setUserProjects(projects);
        console.log(projects);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };
    fetchProjects();
  }, [user]);

  const initializeMirador = (workspace:IWorkspace, title:string) => {
  setMirador(!mirador)
    setMiradorWorkspace(workspace)
    setProjectTitle(title)
  }

  return (
    <Grid container spacing={2} justifyContent="center" flexDirection="column">
      {
        !mirador &&(
          <Grid item container justifyContent="center">
          <Typography variant="h1">{user.name}'s Projects</Typography>
        </Grid>
        )
      }
      <Grid item container spacing={4} justifyContent="center">

      {!mirador && userProjects ? (
        <>
          {userProjects.map((project) => (
              <Grid item key={project.id}>
                <Card sx={{ maxWidth: 250 }}>
                  <CardActionArea>
                    <Button onClick={() => initializeMirador(project.userWorkspace, project.name)}>
                      {project.name}
                    </Button>
                  </CardActionArea>
                </Card>
              </Grid>
            )
          )}
          <Grid item>
            <Card sx={{ maxWidth: 250 }}>
              <CardActionArea>
                <Button onClick={() => initializeMirador(emptyWorkspace, "New Project")}>
                  +
                </Button>
              </CardActionArea>
            </Card>
          </Grid>
        </>
      ) : (
        <Grid item xs={12}>
          <MiradorViewer workspace={miradorWorkspace!} toggleMirador={()=> setMirador(!mirador)} projectTitle={projectTitle}/>
        </Grid>
      )}
      </Grid>
    </Grid>
  )
}
