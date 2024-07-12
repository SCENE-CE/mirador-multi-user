import { Grid, Typography } from "@mui/material";
import { UserGroup } from "../types/types.ts";
import { ListRow } from "../../../components/elements/ListRow.tsx";

interface IUserProjectListProps {
  users:UserGroup[];
}
export const UserProjectList = ({users} : IUserProjectListProps) => {

  return(
    <Grid item container flexDirection="column" spacing={1}>
      <Typography>users list</Typography>
      {
        users.map((user)=>(
          <ListRow content={user.name} index={user.name} key={user.id} action={()=>console.log(user.name)}></ListRow>
        ))
      }
    </Grid>
  )
}
