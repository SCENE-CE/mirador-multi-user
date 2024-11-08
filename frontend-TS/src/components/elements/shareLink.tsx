import { Grid, TextField } from "@mui/material";
import { useState } from "react";
import { ModalButton } from "./ModalButton.tsx";
import RotateRightIcon from '@mui/icons-material/RotateRight';
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { getGroupsAccessToProject } from "../../features/projects/api/generateProjectSnapShot.ts";
import toast from "react-hot-toast";

interface IShareLinkProps {
  itemId:number,
  snapShotHash:string,
}
export const ShareLink =({ itemId, snapShotHash }:IShareLinkProps)=>{
  const baseUrl = window.location.origin + window.location.pathname.split('/app')[0];
  const [projectUrl, setProjetUrl] = useState<string|null>(`${baseUrl}/mirador/${snapShotHash}/workspace.json`);

  const HandleCopyToClipBoard = async () => {
    await navigator.clipboard.writeText(projectUrl!);
    console.log(projectUrl);
    toast.success('snapshot url copied to clipboard');
  }

  const HandleGenerateSnapShot = async () => {
    const snapShotUrl = await getGroupsAccessToProject(itemId)
    console.log(snapShotUrl)
    setProjetUrl(`${baseUrl}/mirador/${snapShotUrl.snapShotPath}`);
  }


  console.log(!projectUrl);
  return (
    <Grid container item spacing={2}>
      <Grid item container xs={10} spacing={2} sx={{width:'100%'}}>
        <Grid container item flexDirection="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
          <Grid item xs={2}>
            <ModalButton disabled={false} icon={<RotateRightIcon/>} onClickFunction={HandleGenerateSnapShot} tooltipButton={"Generate project snapshot"}/>
          </Grid>
          {
            projectUrl &&(
              <>
                <Grid item xs={8}>
                  <TextField
                    label="Project snapshot Url"
                    value={projectUrl? `${projectUrl}`:''}
                    disabled
                    fullWidth
                    defaultValue={projectUrl}
                  />
                </Grid>
                <Grid item xs={1}>
                  <ModalButton tooltipButton="Copy Link" onClickFunction={HandleCopyToClipBoard} disabled={false} icon={<ContentCopyIcon />} />
                </Grid>
              </>
            )
          }
        </Grid>
      </Grid>
    </Grid>
  )
}