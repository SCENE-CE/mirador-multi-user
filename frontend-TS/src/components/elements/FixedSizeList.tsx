import { Box, List } from "@mui/material";
import { ListRow } from "./ListRow.tsx";

interface FixedSizeListProps {
  contents:string[],
}
export const FixedSizeList=({contents}:FixedSizeListProps)=>{
  return(
    <Box sx={{ width: '100%', height: 400, maxWidth: 360, bgcolor: 'background.paper' }}
    >
      <List>
        {
          contents.map((content,index)=>(
            <ListRow content={content} key={index}/>
          ))
        }
      </List>
    </Box>
  )
}
