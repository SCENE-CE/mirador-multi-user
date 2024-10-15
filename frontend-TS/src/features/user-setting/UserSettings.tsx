import { Grid, TextField } from "@mui/material";
import storage from "../../utils/storage.ts";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { ModalButton } from "../../components/elements/ModalButton.tsx";
import toast from "react-hot-toast";

export const UserSettings = () => {
  const token = storage.getToken();
  console.log(token);

  const HandleCopyToClipBoard = async () => {
    await navigator.clipboard.writeText(token);
    toast.success('token copied to clipboard');
  }

  return (
    <Grid container flexDirection="row" alignItems="center" justifyContent="center" spacing={2}>
      <Grid item xs={11}>
        <TextField label={'API Token'} disabled={true} fullWidth={true} helperText={'this is for advanced users'} defaultValue={token}></TextField>
      </Grid>
      <Grid item>
        <ModalButton tooltipButton={"Copy token"} onClickFunction={()=>HandleCopyToClipBoard()} disabled={false} icon={<ContentCopyIcon/>}/>
      </Grid>
    </Grid>
  )
}