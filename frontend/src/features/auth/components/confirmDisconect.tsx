import { Button, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

interface IConfirmDisconnect{
  handleDisconnect:()=>void;
}
export const ConfirmDisconnect = ({handleDisconnect}:IConfirmDisconnect) => {
  const { t } = useTranslation();

  return(
    <Grid>
      <Grid item>
        <Typography>
          {t('messageDisconnect')}
        </Typography>
        <Button
          color="error"
          variant="contained"
          onClick={handleDisconnect}>
          {t('disconnect')}
        </Button>
      </Grid>
    </Grid>
  )
}
