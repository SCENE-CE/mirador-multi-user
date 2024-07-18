import {
  Divider,
  FormControl,
  Grid,
  InputLabel,
  ListItem,
  ListItemText,
  MenuItem,
  Select, SelectChangeEvent,
  Typography
} from "@mui/material";
import { ProjectGroup, ProjectUser } from "../types/types.ts";
import { useEffect, useState } from "react";
import { getGroupsAccessToProject } from "../api/getGroupsAccessToProject.ts";
import { ProjectRights } from "../../user-group/types/types.ts";
import { updateProject } from "../api/updateProject.ts";

interface IProjectUserGroup {
  projectUser: ProjectUser;
}
export const ProjectUserGroupList = ({projectUser}:IProjectUserGroup)=>{
  const [ groupList, setGroupList]=useState<ProjectGroup[]>([]);
  const [project, setProject] = useState(projectUser.project)
  const fetchGroupsForProject=async()=>{
    const groups = await getGroupsAccessToProject(project.id)
    setGroupList(groups);

  }
  useEffect(()=>{
    fetchGroupsForProject()
  },[project])

  const handleChangeRights = (user_group_id: number) => async (event: SelectChangeEvent) => {
    const updatedProject = await updateProject({ ...projectUser, rights: event.target.value as ProjectRights },user_group_id)
    console.log(updatedProject);
  };

  return(
    <Grid container item>
      <Grid item>
        <Typography variant="h5">access list</Typography>
      </Grid>
      <Grid item flexDirection="column" container spacing={1}>
        { groupList &&(
          groupList.map((projectGroup)=>(
            <>
              <Grid item>
                <ListItem key={projectGroup.id} component="div" disablePadding>
                  <ListItemText primary={projectGroup.user_group.name} />
                </ListItem>
                <Grid item>
                  <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel>Rights</InputLabel>
                    <Select
                      value={projectGroup.rights.toUpperCase()}
                      label="Right"
                      onChange={handleChangeRights(projectGroup.user_group.id)}
                    >
                      {
                        (Object.keys(ProjectRights) as Array<keyof typeof ProjectRights>).map((right, index)=>(
                            <MenuItem key={index} value={right}>{right}</MenuItem>
                          )
                        )
                      }
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid item>
                <Divider/>
              </Grid>
            </>
          ))
        )
        }
      </Grid>
    </Grid>
  )
}
