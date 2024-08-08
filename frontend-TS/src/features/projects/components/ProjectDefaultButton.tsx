import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Button } from "@mui/material";
import IState from "../../mirador/interface/IState.ts";
import { ProjectUser } from "../types/types.ts";

interface IProjectDefaultButtonProps {
  initializeMirador:(miradorState: (IState | undefined), projectUser: ProjectUser) => void,
  projectUser: ProjectUser,
}


export const ProjectDefaultButton = ({initializeMirador, projectUser}: IProjectDefaultButtonProps) => {
  return(
    <>
      <Button
        onClick={() => {
          initializeMirador(projectUser.project.userWorkspace, projectUser);
        }}
        variant="contained"
      >
        <OpenInNewIcon />
      </Button>
    </>
  )
}
