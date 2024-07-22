import { Dispatch, useEffect, useRef } from "react";
import Mirador from 'mirador';
import miradorAnnotationEditorVideo from "mirador-annotation-editor-video/src/plugin/MiradorAnnotationEditionVideoPlugin";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import IMiradorState from "./interface/IState.ts";
import LocalStorageAdapter from "mirador-annotation-editor/src/annotationAdapter/LocalStorageAdapter.js";
import { Grid, Typography } from "@mui/material";
import './style/mirador.css'
import { ProjectUser } from "../projects/types/types.ts";

interface MiradorViewerProps {
  miradorState: IMiradorState,
  ProjectUser:ProjectUser,
  viewer:any;
  setViewer:Dispatch<any>
}

const MiradorViewer = ({ miradorState ,ProjectUser, viewer, setViewer }:MiradorViewerProps) => {
  const viewerRef = useRef<HTMLDivElement | null>(null);
  console.log(ProjectUser)
  const project = ProjectUser.project;

  console.log(ProjectUser.rights)

  useEffect(() => {

    if (viewerRef.current) {
      const config = {
        id: viewerRef.current.id,
        annotation: {
          adapter: (canvasId : string) => new LocalStorageAdapter(`localStorage://?canvasId=${canvasId}`),
          // adapter: (canvasId) => new AnnototAdapter(canvasId, endpointUrl),
          exportLocalStorageAnnotations: false, // display annotation JSON export button
        }
      };


      let loadingMiradorViewer;
      // First displaying of the viewer
      if(!viewer){
        loadingMiradorViewer = Mirador.viewer(config, [
          ...miradorAnnotationEditorVideo]);
      }


      // Load state only if it is not empty
      if (loadingMiradorViewer && project.id && miradorState) {
        loadingMiradorViewer.store.dispatch(
          Mirador.actions.importMiradorState(miradorState)
        );
      }
      setViewer(loadingMiradorViewer);
    }

  }, []);

  return(
    <Grid container flexDirection='column' spacing={2}>
      <Grid item container flexDirection='row'>
        <Grid item container alignContent="center" alignItems='center' justifyContent="flex-end" flexDirection="row" spacing={3} sx={{position:'relative', top: '-20px'}}>
          <Grid item>
            <Typography>
              {project.name}
            </Typography>
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
