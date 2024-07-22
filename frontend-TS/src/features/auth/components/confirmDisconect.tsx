import { Button, Grid, Typography } from "@mui/material";

interface IConfirmDisconnect{
  handleDisconnect:()=>void;
}
export const ConfirmDisconnect = ({handleDisconnect}:IConfirmDisconnect) => {
  return(
    <Grid>
      <Grid item>
        <Typography>
          Are you sure you want to disconnect from ARVEST?
        </Typography>
        <Button
          color="error"
          variant="contained"
          onClick={handleDisconnect}>
          Disconnect
        </Button>
      </Grid>
    </Grid>
  )
}
