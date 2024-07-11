import { ListItem, ListItemButton, ListItemText } from "@mui/material";

interface ListRowProps {
  content: string;
  key:number;
}
export const ListRow = ({content,key}:ListRowProps) =>{
  return(
    <ListItem key={key} component="div" disablePadding>
      <ListItemButton>
        <ListItemText primary={content} />
      </ListItemButton>
    </ListItem>
  )
}
