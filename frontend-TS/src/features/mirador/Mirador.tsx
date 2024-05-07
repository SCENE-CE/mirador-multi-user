import { useEffect, useRef } from 'react';
import Mirador from 'mirador';
import miradorAnnotationEditorVideo from "mirador-annotation-editor-video/src/plugin/MiradorAnnotationEditionVideoPlugin";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import IWorkspace from "./interface/IWorkspace.ts";
import LocalStorageAdapter from "mirador-annotation-editor/src/annotationAdapter/LocalStorageAdapter.js";
import { Button, Grid } from "@mui/material";
import './style/mirador.css'
interface MiradorViewerProps {
  workspace: IWorkspace,
  toggleMirador: () => void,
}

const MiradorViewer: React.FC<MiradorViewerProps> = ({ workspace, toggleMirador }) => {
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewerRef.current) {
      const config = {
        ...workspace.config,
        id: viewerRef.current.id,
        annotation: {
          adapter: (canvasId : string) => new LocalStorageAdapter(`localStorage://?canvasId=${canvasId}`),
          // adapter: (canvasId) => new AnnototAdapter(canvasId, endpointUrl),
          exportLocalStorageAnnotations: false, // display annotation JSON export button
        }
      };

      Mirador.viewer(config, [
        ...miradorAnnotationEditorVideo,
      ]);
    }
  }, []);

  return(
  <Grid container flexDirection='column' spacing={2}>
    <Grid item container flexDirection='row'>
      <Grid item container alignContent="center"justifyContent="flex-end" flexDirection="row" spacing={3} sx={{position:'relative', top: '-40px'}}>
        <Grid item>
        <Button variant="contained" onClick={toggleMirador}>Back To Projects</Button>
        </Grid>
        <Grid item>
        <Button variant="contained" onClick={()=>console.log('SHOULD SAVE THE PROJECT')}>Save Project</Button>
        </Grid>
      </Grid>
    </Grid>
    <Grid item>
    <div ref={viewerRef} id="mirador"></div>
    </Grid>
  </Grid>
  )
}

export default MiradorViewer;
