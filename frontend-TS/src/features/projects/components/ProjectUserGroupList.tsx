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
import { Dispatch, SetStateAction } from "react";
import { ProjectRights } from "../../user-group/types/types.ts";
import { updateProject } from "../api/updateProject.ts";

interface IProjectUserGroup {
  projectUser: ProjectUser;
  groupList: ProjectGroup[];
  setGroupList: Dispatch<SetStateAction<ProjectGroup[]>>;
}

export const ProjectUserGroupList = ({ projectUser, groupList, setGroupList }: IProjectUserGroup) => {
  const handleChangeRights = (group: ProjectGroup) => async (event: SelectChangeEvent) => {
    const updatedProjectGroup = await updateProject({
      id: group.id,
      project: projectUser.project,
      group: group.user_group,
      rights: event.target.value as ProjectRights
    });

    setGroupList(prevGroupList => prevGroupList.map(g =>
      g.id === group.id ? { ...g, rights: updatedProjectGroup.rights } : g
    ));
  };

  return (
    <Grid container item>
      <Grid item>
        <Typography variant="h5">Access List</Typography>
      </Grid>
      <Grid item container flexDirection="column" spacing={1}>
        {groupList && groupList.map((projectGroup) => (
          projectGroup.user_group ? (
            <div key={projectGroup.id}>
              <Grid item>
                <ListItem component="div" disablePadding>
                  <ListItemText primary={projectGroup.user_group.name} />
                </ListItem>
                <Grid item>
                  <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel>Rights</InputLabel>
                    <Select
                      value={projectGroup.rights.toUpperCase()}
                      label="Rights"
                      onChange={handleChangeRights(projectGroup)}
                    >
                      {(Object.keys(ProjectRights) as Array<keyof typeof ProjectRights>).map((right, index) => (
                        <MenuItem key={index} value={right}>{right}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid item>
                <Divider />
              </Grid>
            </div>
          ) : (<p key={projectGroup.id}>LOADING</p>)
        ))}
      </Grid>
    </Grid>
  );
}
