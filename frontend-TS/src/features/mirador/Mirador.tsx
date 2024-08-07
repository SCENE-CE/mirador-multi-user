import { Dispatch, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
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
import { Project } from "../projects/types/types.ts";
import IState from "./interface/IState.ts";

interface MiradorViewerHandle {
  setViewer:()=>IState;
  saveProject: () => void;
}

interface MiradorViewerProps {
  miradorState: IMiradorState,
  saveMiradorState: (state:IMiradorState, name:string) => void,
  project:Project
  setMiradorState:(state:IState)=>void
  setViewer: Dispatch<any>
  viewer:any
}
const MiradorViewer = forwardRef<MiradorViewerHandle, MiradorViewerProps>((props, ref) => {
   const { miradorState, saveMiradorState, project, setMiradorState, setViewer,viewer } = props;
    const viewerRef = useRef<HTMLDivElement | null>(null);
  const [miradorViewer, setMiradorViewer] = useState<any>(undefined);
  console.log(miradorViewer)
  console.log(viewer)

   useImperativeHandle(ref, () => ({
     saveProject: () => {
     console.log(miradorViewer.store.getState())
     },
     setViewer: ()=>{
       const viewer : IState = miradorViewer.store.getState()
       console.log('setMiradorViewer', viewer)
       setViewer(viewer);
       return viewer
     }
   }));

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
      if(!miradorViewer){
        loadingMiradorViewer = Mirador.viewer(config, [
          ...miradorAnnotationEditorVideo]);
      }
      if(!miradorState){
        saveMiradorState(loadingMiradorViewer.store.getState(),project.name);
      }

      console.log('miradorState', miradorState)

      // Load state only if it is not empty
      if (loadingMiradorViewer && project.id && miradorState) {
        loadingMiradorViewer.store.dispatch(
          Mirador.actions.importMiradorState(miradorState)
        );
      }
      console.log('loadingMiradorViewer',loadingMiradorViewer);
      console.log('viewer',miradorViewer)

      setMiradorViewer(loadingMiradorViewer);
      setViewer(loadingMiradorViewer)
      setMiradorState(loadingMiradorViewer.store.getState());
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
});

export default MiradorViewer;
