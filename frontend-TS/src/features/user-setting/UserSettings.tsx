import { Grid, TextField } from "@mui/material";
import storage from "../../utils/storage.ts";

export const UserSettings = () => {
  const token = storage.getToken();
  console.log(token);
  return (
    <Grid>
      <TextField label={'API Token'} disabled={true} fullWidth={true} helperText={'this is for advanced users'} defaultValue={token}></TextField>
    </Grid>
  )
}