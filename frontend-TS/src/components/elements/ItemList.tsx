import {
  Divider,
  Grid, IconButton,
  Typography
} from "@mui/material";
import { ListItem } from "../types.ts";
import { BigSpinner } from "./spinner.tsx";
import { ReactNode } from "react";
import DeleteIcon from '@mui/icons-material/Delete';

interface IProjectUserGroup {
  items: ListItem[];
  children?: (item: ListItem) => ReactNode
  removeItem: (itemId:number)=> void
}

export const ItemList = ({ items, children, removeItem }: IProjectUserGroup) => {
  return (
    <Grid container item>
      <Grid item>
        <Typography variant="h5">Access List</Typography>
      </Grid>
      <Grid item container flexDirection="column" spacing={1}>
        {items && items.map((item) => (
          item ? (
            <Grid key={item.id} item container flexDirection="row" alignItems="center" justifyContent="center">
              <Grid item sx={{ flexGrow: 1 }}>
                <Typography>{item.name}</Typography>
              </Grid>
              {children &&(
                <Grid item>
                  {children(item)}
                </Grid>
                )
              }
              <Grid item>
                <IconButton onClick={()=>removeItem(item.id)} aria-lavel="delete" color="error"><DeleteIcon/></IconButton>
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
