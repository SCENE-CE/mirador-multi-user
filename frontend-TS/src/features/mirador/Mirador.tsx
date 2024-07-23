import {  useEffect, useRef, useState } from "react";
import Mirador from 'mirador';
import miradorAnnotationEditorVideo from "mirador-annotation-editor-video/src/plugin/MiradorAnnotationEditionVideoPlugin";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import IMiradorState from "./interface/IState.ts";
import LocalStorageAdapter from "mirador-annotation-editor/src/annotationAdapter/LocalStorageAdapter.js";
import { Button, Grid, Typography } from "@mui/material";
import './style/mirador.css'
import { Project } from "../projects/types/types.ts";
import { useMiradorState } from "../../providers/MiradorContext.tsx";

interface MiradorViewerProps {
  saveMiradorState: (state:IMiradorState, name:string) => void,
  project:Project
}

const MiradorViewer = ({  saveMiradorState ,project, }:MiradorViewerProps) => {
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const [viewer, setViewer] = useState<any>(undefined);
  const { miradorState, setMiradorState } = useMiradorState();

  useEffect(() => {
    if (viewerRef.current && !viewer) {
      const config = {
        id: viewerRef.current.id,
        annotation: {
          adapter: (canvasId: string) => new LocalStorageAdapter(`localStorage://?canvasId=${canvasId}`),
          // adapter: (canvasId) => new AnnototAdapter(canvasId, endpointUrl),
          exportLocalStorageAnnotations: false, // display annotation JSON export button
        }
      };

      const loadingMiradorViewer = Mirador.viewer(config, [
        ...miradorAnnotationEditorVideo
      ]);

      setViewer(loadingMiradorViewer);
      setMiradorState(loadingMiradorViewer.store.getState());

      if (miradorState) {
        loadingMiradorViewer.store.dispatch(
          Mirador.actions.importMiradorState(miradorState)
        );
      }
    }
  }, [viewerRef, viewer, miradorState, setMiradorState]);

    useEffect(() => {
      const updateStateInterval = setInterval(() => {
        if (viewer) {
          const currentState = viewer.store.getState();
          setMiradorState(currentState);
          saveMiradorState(currentState, project.name);
        }
      }, 3000);

    return () => clearInterval(updateStateInterval);
  }, []);

  const saveProject = () => {
    saveMiradorState(viewer.store.getState(),project.name);
  }


  return(
    <Grid container flexDirection='column' spacing={2}>
      <Grid item container flexDirection='row'>
        <Grid item container alignContent="center" alignItems='center' justifyContent="flex-end" flexDirection="row" spacing={3} sx={{position:'relative', top: '-20px'}}>
          <Grid item>
            <Typography>
              {project.name}
            </Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={saveProject}>Save Project</Button>
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
