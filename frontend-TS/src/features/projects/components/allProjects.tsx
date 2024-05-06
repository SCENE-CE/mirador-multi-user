import { Button, Grid } from "@mui/material";
import { getUserAllProjects } from "../../miscellaneous/api/getUserAllProjects.ts";
import { FC, useEffect, useState } from "react";
import {Project} from "../types/types.ts";

interface AllProjectsProps {
  userId: number;
}


export const AllProjects: FC<AllProjectsProps> = ({ userId }) => {
  const [userProjects, setUserProjects] = useState<Project[]>([]);

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

  const initializeMirador = () => {

  }
  return (
    <Grid container spacing={2} justifyContent="center">
      {userProjects ? userProjects.map( (project, index) =>
        <Grid item key={index}>
          <Button onClick={initializeMirador}>{project.name}</Button>
        </Grid>) :
        ('You have no projects !')}
    </Grid>
  )
}
