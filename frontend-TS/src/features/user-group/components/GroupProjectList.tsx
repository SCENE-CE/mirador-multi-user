import { Button, Divider, Grid, List, ListItem, ListItemText, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import { FixedSizeList } from "../../../components/elements/FixedSizeList.tsx";
import { Project } from "../../projects/types/types.ts";

interface IGroupProjectListProps {
  projects:Project[]
  handleRemoveProject:(projectId:number) => void
  handleDisplayProject:()=>void
  displayUserProjects:boolean
  personalProjectsName:string[]
  handleAddProjectToGroup:(projectName:string)=>void
}
export const GroupProjectList = ({projects,handleRemoveProject,handleDisplayProject,displayUserProjects,personalProjectsName,handleAddProjectToGroup}:IGroupProjectListProps)=>{
  return(
    <>
      <Grid item container direction="column" spacing={2} >
        <Grid item container>
          <Typography> Group's Projects</Typography>
        </Grid>
        <List>
          {projects.map((project)=>(
            <>
              <ListItem key={project.id}>
                <ListItemText primary={project.name}>
                </ListItemText>
                <Button variant="contained" onClick={()=>handleRemoveProject(project.id)}  color="error">
                  <CloseIcon/>
                </Button>
              </ListItem>
              <Divider  component="li" />
            </>
          ))}
          <>
            <ListItem>
              <ListItemText primary="Add project">
              </ListItemText>
              <Button variant="contained" onClick={handleDisplayProject}>
                {displayUserProjects ? <ArrowBackIcon /> : <AddIcon />}
              </Button>
            </ListItem>
            <Divider  component="li" />
          </>
          {
            displayUserProjects &&(
              <FixedSizeList contents={personalProjectsName} action={handleAddProjectToGroup}/>
            )
          }
        </List>
      </Grid>
      <Grid item container direction="column"></Grid>
    </>
  )
}
