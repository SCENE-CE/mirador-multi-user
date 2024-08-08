import { Button, Grid, Typography } from "@mui/material";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
interface IModalConfirmDeleteProps {
  itemName: string;
  deleteItem:(itemId:number)=>void,
  itemId:number
}

export const ModalConfirmDelete = ({itemName,deleteItem,itemId}:IModalConfirmDeleteProps) => {
  return(
    <Grid container wrap="nowrap" spacing={2}>
      <Grid item>
        <WarningAmberIcon sx={{color:"red"}} fontSize="large"/>
      </Grid>
      <Grid item container spacing={2}>

      <Grid item>
        <Typography> Are you sure you want to delete <b>{itemName}</b>, this action is <b>irreversible</b>.</Typography>
      </Grid>
      <Grid item>
        <Button
          color="error"
          variant="contained"
          onClick={()=>deleteItem(itemId)}>
          DELETE DEFINITELY
        </Button>
      </Grid>
      </Grid>
    </Grid>
  )
}
