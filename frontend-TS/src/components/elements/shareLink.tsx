import { Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { ModalButton } from "./ModalButton.tsx";
import RotateRightIcon from '@mui/icons-material/RotateRight';
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { getGroupsAccessToProject } from "../../features/projects/api/generateProjectSnapShot.ts";
import toast from "react-hot-toast";

interface IShareLinkProps {
  itemId:number,
  snapShotHash:string,
}

export const ShareLink = ({ itemId, snapShotHash }:IShareLinkProps) => {
  const baseUrl = window.location.origin + window.location.pathname.split('/app')[0];
  const [projectUrl, setProjectUrl] = useState(`${baseUrl}/mirador/${snapShotHash}/workspace.json`);
  const [generatedAt, setGeneratedAt] = useState<null|string>(null);

  const handleCopyToClipboard = async () => {
    await navigator.clipboard.writeText(projectUrl);
    toast.success('Snapshot URL copied to clipboard');
  };

  const handleGenerateSnapshot = async () => {
    const snapShotUrl = await getGroupsAccessToProject(itemId);
    console.log(snapShotUrl);
    fetchManifestInfo(snapShotUrl.snapShotHash)
    setProjectUrl(`${baseUrl}/mirador/${snapShotUrl.snapShotHash}/workspace.json`);
  };


  const fetchManifestInfo = async (hash:string) => {
    try {
      console.log('projectUrl',projectUrl)
      const response = await fetch(`${import.meta.env.VITE_CADDY_URL}/${hash}/workspace.json`);
      if (!response.ok) throw new Error('Failed to fetch manifest info');
      const miradorWorkspace = await response.json();
      const date = new Date(miradorWorkspace.generated_at);
      const formattedDate = date.toLocaleString();
      setGeneratedAt(formattedDate)
    } catch (error) {
      console.error('Error fetching manifest info:', error);
    }
  };

  useEffect(() => {
    if (projectUrl) fetchManifestInfo(`${snapShotHash}`);
  }, [projectUrl,
  ]);

console.log('generatedAt',generatedAt)
  return (
    <Grid container item spacing={2}>
      <Grid item container xs={10} spacing={2} sx={{ width: '100%' }}>
        <Grid container item flexDirection="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
          <Grid item xs={2}>
            <ModalButton
              disabled={false}
              icon={<RotateRightIcon />}
              onClickFunction={handleGenerateSnapshot}
              tooltipButton="Generate project snapshot"
            />
          </Grid>
          {projectUrl && (
            <>
              <Grid item xs={8}>
                <TextField
                  label="Project snapshot URL"
                  value={projectUrl}
                  disabled
                  fullWidth
                  helperText={generatedAt ? `Snapshot taken at ${generatedAt}` : null}
                />
              </Grid>
              <Grid item xs={1}>
                <ModalButton
                  tooltipButton="Copy Link"
                  onClickFunction={handleCopyToClipboard}
                  disabled={false}
                  icon={<ContentCopyIcon />}
                />
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};