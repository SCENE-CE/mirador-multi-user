import { useCallback, useEffect, useRef, useState } from "react";
import Mirador from 'mirador';
import miradorAnnotationEditorVideo from "mirador-annotation-editor-video/src/plugin/MiradorAnnotationEditionVideoPlugin";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import IMiradorState from "./interface/IState.ts";
import LocalStorageAdapter from "mirador-annotation-editor/src/annotationAdapter/LocalStorageAdapter.js";
import { Button, Grid, Tooltip, Typography } from "@mui/material";
import './style/mirador.css'
import { MMUModal } from "../../components/elements/modal.tsx";
import { ModalEditProject } from "../projects/components/ModalEditProject.tsx";
import { Project } from "../projects/types/types.ts";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { importMiradorState } from "mirador/dist/es/src/state/actions/config.js";
interface MiradorViewerProps {
  miradorState: IMiradorState,
  saveMiradorState: (state:IMiradorState, name:string) => void,
  project:Project
  updateUserProject:(project:Project, newProjectName:string)=>void,
}

const MiradorViewer = ({ miradorState, saveMiradorState ,project,updateUserProject }:MiradorViewerProps) => {
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const [viewer, setViewer] = useState<any>(undefined);
  const [openModal, setOpenMOdal] = useState(false)
  const [miradorViewerLoaded, setMiradorViewerLoaded] = useState(false);

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
      if (loadingMiradorViewer && miradorState) {
        loadingMiradorViewer.store.dispatch(
          importMiradorState(miradorState)
        );
      }

      setViewer(loadingMiradorViewer);
    }
  }, []);

  const saveProject = () => {
    saveMiradorState(viewer.store.getState(),project.name);
  }

  const HandleOpenModal = useCallback(()=>{
    setOpenMOdal(!openModal)
  },[setOpenMOdal,openModal])


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
          <Tooltip title={"Project configuration"}>
            <Button
              onClick={HandleOpenModal}
              variant="contained"
            >
              <ModeEditIcon/>
            </Button>
          </Tooltip>
        </Grid>
        <MMUModal openModal={openModal} setOpenModal={HandleOpenModal} children={<ModalEditProject updateUserProject={updateUserProject} project={project}/>}/>
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
