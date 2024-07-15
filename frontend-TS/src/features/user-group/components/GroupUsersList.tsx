import { Button, Divider, Grid, ListItem, ListItemText, Typography } from "@mui/material";
import { User } from "../../auth/types/types.ts";
import { useUser } from "../../../utils/auth.tsx";
import CloseIcon from "@mui/icons-material/Close";

interface IUGroupUsersListPros {
  users:User[];
  handleRemoveUser:(user:User)=>void
  ownerId:number;
}
export const GroupUsersList = ({users,handleRemoveUser,ownerId} : IUGroupUsersListPros) => {
  const currentUser= useUser()


  return(
    <Grid item container flexDirection="column" spacing={1}>
      <Grid item>
        <Typography variant="h5">users list</Typography>
      </Grid>
      <Grid item>
        {
          users.map((user)=>(
            <>
              <ListItem key={user.id} component="div" disablePadding>
                <ListItemText primary={user.name} />
                {currentUser.data!.id === ownerId && currentUser.data!.id !== user.id &&(
                  <Button size="small" variant="contained" onClick={()=>handleRemoveUser(user)}  color="error">
                    <CloseIcon/>
                  </Button>
                )
                }
              </ListItem>
              <Divider/>
            </>
          ))
        }
      </Grid>
    </Grid>
  )
}
