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
import { ProjectUser } from "../projects/types/types.ts";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

interface MiradorViewerProps {
  miradorState: IMiradorState,
  saveMiradorState: (state:IMiradorState, name:string) => void,
  ProjectUser:ProjectUser,
  updateUserProject:(project:ProjectUser, newProjectName:string)=>void,
}

const MiradorViewer = ({ miradorState, saveMiradorState ,ProjectUser,updateUserProject }:MiradorViewerProps) => {
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const [viewer, setViewer] = useState<any>(undefined);
  const [openModal, setOpenMOdal] = useState(false)
  const project = ProjectUser.project;

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
        <MMUModal width={400} openModal={openModal} setOpenModal={HandleOpenModal} children={<ModalEditProject projectUser={ProjectUser} updateUserProject={updateUserProject} project={project}/>}/>
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
