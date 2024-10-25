import {
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select, SelectChangeEvent,
  Typography
} from "@mui/material";
import { ProjectGroup, ProjectUser } from "../types/types.ts";
import { Dispatch, SetStateAction, useState } from "react";
import { ProjectRights } from "../../user-group/types/types.ts";
import { updateProject } from "../api/updateProject.ts";
import { BigSpinner } from "../../../components/elements/spinner.tsx";

interface IProjectUserGroup {
  projectUser: ProjectUser;
  groupList: ProjectGroup[];
  setGroupList: Dispatch<SetStateAction<ProjectGroup[]>>;
}

export const ProjectUserGroupList = ({ projectUser, groupList, setGroupList }: IProjectUserGroup) => {
  const [rights, setRights] = useState<string>();

  const handleChangeRights = (group: ProjectGroup) => async (event: SelectChangeEvent) => {
    console.log(group)
    const updatedProjectGroup = await updateProject({
      project: { ...projectUser.project },
      id: group.id,
      group: group.user_group,
      rights: event.target.value as ProjectRights
    });

    setRights(event.target.value);
    setGroupList(prevGroupList => prevGroupList.map(g =>
      g.id === group.id ? { ...g, rights: updatedProjectGroup.rights } : g
    ));
  };

  return (
    <Grid container item>
      <Grid item>
        <Typography variant="h5">Permissions</Typography>
      </Grid>
      <Grid item container flexDirection="column" spacing={1}>
        {groupList && groupList.map((projectGroup) => (
          projectGroup.user_group ? (
            <Grid key={projectGroup.id} item container flexDirection="row" alignItems="center">
              <Grid item sx={{ flexGrow: 1 }}>
                <Typography>{projectGroup.user_group.title}</Typography>
              </Grid>
              <Grid item container alignItems="center" justifyContent="flex-end" sx={{ width: 'auto' }}>
                <Grid item>
                  <InputLabel>Rights</InputLabel>
                </Grid>
                <Grid item sx={{ ml: 1 }}>
                  <FormControl sx={{ width: 100, mb:1 }} size="small">
                    <Select
                      value={projectGroup.rights ? projectGroup.rights.toUpperCase() : rights}
                      onChange={handleChangeRights(projectGroup)}
                    >
                      {(Object.keys(ProjectRights) as Array<keyof typeof ProjectRights>).map((right, index) => (
                        <MenuItem key={index} value={right}>{right}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid item xs={12} sx={{mb:"5px"}}>
                <Divider />
              </Grid>
            </Grid>
          ) : (<><BigSpinner/></>)
        ))}
      </Grid>
    </Grid>
  );
}
