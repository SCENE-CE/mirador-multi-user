import { Button, Divider, Grid, ListItem, ListItemText, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ProjectUser } from "../types/types.ts";
import { useEffect, useState } from "react";
import { User } from "../../auth/types/types.ts";

interface IProjectUserGroup {
  accessList: ProjectUser[];
}
export const ProjectUserGroupList = ({accessList}:IProjectUserGroup)=>{
  const [userLiser, setUserLiser]=useState<User[]>([]);

  useEffect(()=>{

  },[accessList])
  return(
    <Grid container item>
      <Grid item>
        <Typography variant="h5">access list</Typography>
      </Grid>
      <Grid item flexDirection="column" container spacing={1}>
        { accessList &&(
          accessList.map((ProjectUser)=>(
            <>
              <Grid item>
                <ListItem key={user.id} component="div" disablePadding>
                  <ListItemText primary={user.name} />
                  {currentUser.data!.id === ownerId && currentUser.data!.id !== user.id &&(
                    <Button size="small" variant="contained" onClick={()=>handleRemoveUser(user)}  color="error">
                      <CloseIcon/>
                    </Button>
                  )
                  }
                </ListItem>
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
