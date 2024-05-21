import { useEffect, useRef, useState } from "react";
import Mirador from 'mirador';
import miradorAnnotationEditorVideo from "mirador-annotation-editor-video/src/plugin/MiradorAnnotationEditionVideoPlugin";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import IWorkspace from "./interface/IWorkspace.ts";
import LocalStorageAdapter from "mirador-annotation-editor/src/annotationAdapter/LocalStorageAdapter.js";
import { Button, Grid, TextField } from "@mui/material";
import './style/mirador.css'
interface MiradorViewerProps {
  workspace: IWorkspace,
  toggleMirador: () => void,
  saveState: (state:IWorkspace, name:string) => void,
  projectName:string
}

const MiradorViewer = ({ workspace, toggleMirador, saveState, projectName }:MiradorViewerProps) => {
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const [viewer, setViewer] = useState<any>({ });

  const [name, setName] = useState<string>(projectName);

  useEffect(() => {
    if (viewerRef.current) {
      const config = {
        ...workspace.config,
        catalog: workspace.catalog,
        windows: workspace.windows,
        id: viewerRef.current.id,
        annotation: {
          adapter: (canvasId : string) => new LocalStorageAdapter(`localStorage://?canvasId=${canvasId}`),
          // adapter: (canvasId) => new AnnototAdapter(canvasId, endpointUrl),
          exportLocalStorageAnnotations: false, // display annotation JSON export button
        }
      };

      const viewer = Mirador.viewer(config, [
        ...miradorAnnotationEditorVideo]);

      // TODO import corrclty workspace

      setViewer(viewer);


    }
  }, []);

  const saveMiradorState = () => {
    saveState(viewer.store.getState(),name);
  }


  return(
  <Grid container flexDirection='column' spacing={2}>
    <Grid item container flexDirection='row'>
      <Grid item container alignContent="center"justifyContent="flex-end" flexDirection="row" spacing={3} sx={{position:'relative', top: '-40px'}}>
        <TextField
          style={{marginTop: '40px'}}
          label="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        >

        </TextField>
        <Grid item>
        <Button variant="contained" onClick={toggleMirador}>Back To Projects</Button>
        </Grid>
        <Grid item>
        <Button variant="contained" onClick={saveMiradorState}>Save Project</Button>
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
