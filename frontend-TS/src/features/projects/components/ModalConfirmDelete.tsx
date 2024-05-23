import { Button, Grid, Typography } from "@mui/material";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
interface IModalConfirmDeleteProps {
  projectName: string;
  deleteProject:(projectId:number)=>void,
  projectId:number
}

export const ModalConfirmDelete = ({projectName,deleteProject,projectId}:IModalConfirmDeleteProps) => {
  return(
    <Grid container wrap="nowrap" spacing={2}>
      <Grid item>
        <WarningAmberIcon sx={{color:"red"}} fontSize="large"/>
      </Grid>
      <Grid item container spacing={2}>

      <Grid item>
        <Typography> Are you sure you want to delete <b>{projectName}</b>, this action is <b>irreversible</b>.</Typography>
      </Grid>
      <Grid item>
        <Button
          color="error"
          variant="contained"
          onClick={()=>deleteProject(projectId)}>
          DELETE DEFINITELY
        </Button>
      </Grid>
      </Grid>
    </Grid>
  )
}
