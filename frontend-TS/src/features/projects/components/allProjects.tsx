import { Button, Grid } from "@mui/material";
import { getUserAllProjects } from "../../miscellaneous/api/getUserAllProjects.ts";
import { FC, useEffect, useState } from "react";
import {Project} from "../types/types.ts";
import MiradorViewer from "../../mirador/Mirador.tsx";
import IWorkspace from "../../mirador/interface/IWorkspace.ts";

interface AllProjectsProps {
  userId: number;
}


export const AllProjects: FC<AllProjectsProps> = ({ userId }) => {
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [mirador, setMirador] = useState(false)
  const [miradorWorkspace, setMiradorWorkspace] = useState<IWorkspace>()
  // const navigate = useNavigate(); // Use hooks at the top level

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projects = await getUserAllProjects(userId);
        setUserProjects(projects);
        console.log(projects);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };
    fetchProjects();
  }, [userId]);

  const initializeMirador = (workspace:IWorkspace) => {
  setMirador(!mirador)
    setMiradorWorkspace(workspace)
  }

  return (
    <Grid container spacing={2} justifyContent="center">
      {userProjects ? userProjects.map( (project) =>
        <Grid item>
          <Button onClick={() => initializeMirador(project.userWorkspace)}>{project.name}</Button>
        </Grid>) :
        ('You have no projects !')}
      {mirador &&
      <MiradorViewer workspace={miradorWorkspace!}></MiradorViewer>}
    </Grid>
  )
}
