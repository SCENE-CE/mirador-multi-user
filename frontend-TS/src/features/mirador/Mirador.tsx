import { useEffect, useRef } from 'react';
import Mirador from 'mirador';
import miradorAnnotationEditorVideo from "mirador-annotation-editor-video/src/plugin/MiradorAnnotationEditionVideoPlugin";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import IWorkspace from "./interface/IWorkspace.ts";
import LocalStorageAdapter from "mirador-annotation-editor/src/annotationAdapter/LocalStorageAdapter.js";
import { Button, Grid, Typography } from "@mui/material";
import './style/mirador.css'
interface MiradorViewerProps {
  workspace: IWorkspace,
  toggleMirador: () => void,
  projectTitle: string,
}

const MiradorViewer: React.FC<MiradorViewerProps> = ({ workspace, toggleMirador, projectTitle }) => {
  const viewerRef = useRef<HTMLDivElement>(null);
console.log(workspace)

  useEffect(() => {
    if (viewerRef.current) {
      const config = {
        id: viewerRef.current.id,
        catalog:workspace.catalog,
        companionWindows: workspace.companionWindows,
        config:workspace.config,
        elasticsearch: workspace.elasticLayout,
        layers:workspace.layers,
        manifests: workspace.manifests,
        viewers: workspace.viewers,
        windows: workspace.windows,
        annotation: {
          adapter: (canvasId : string) => new LocalStorageAdapter(`localStorage://?canvasId=${canvasId}`),
          // adapter: (canvasId) => new AnnototAdapter(canvasId, endpointUrl),
          exportLocalStorageAnnotations: false, // display annotation JSON export button
        },
      };

      Mirador.viewer(config, [
        ...miradorAnnotationEditorVideo,
      ]);
    }
  }, []);

  return(
  <Grid container flexDirection='column' spacing={2}>
    <Grid item container flexDirection='row' justifyContent="space-between">
      <Grid item>
        <Typography variant="h2">{projectTitle}</Typography>
      </Grid>
      <Grid item alignContent="center">
        <Button onClick={toggleMirador}>Back To Projects</Button>
        <Button onClick={()=>console.log('SHOULD SAVE THE PROJECT')}>Save Project</Button>
      </Grid>
    </Grid>
    <Grid item>
    <div ref={viewerRef} id="mirador"></div>
    </Grid>
  </Grid>
  )
}

export default MiradorViewer;
