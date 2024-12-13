import { Dispatch, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import Mirador from 'mirador';
import miradorAnnotationEditorVideo from "mirador-annotation-editor-video/src/plugin/MiradorAnnotationEditionVideoPlugin";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import IMiradorState from "./interface/IState.ts";
import './style/mirador.css'
import { Project } from "../projects/types/types.ts";
import IState from "./interface/IState.ts";
import MMUAdapter from "./adapter/MMUAdapter";

interface MiradorViewerHandle {
  setViewer:()=>IState;
  saveProject: () => void;
}

interface MiradorViewerProps {
  miradorState: IMiradorState,
  saveMiradorState: (state:IMiradorState, title:string) => void,
  project:Project
  setMiradorState:(state:IState)=>void
  setViewer: Dispatch<any>
  viewer:any
  HandleSetIsRunning:()=>void
}
const MiradorViewer = forwardRef<MiradorViewerHandle, MiradorViewerProps>((props, ref) => {
  const { miradorState, saveMiradorState, project, setMiradorState, setViewer,HandleSetIsRunning } = props;
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const [miradorViewer, setMiradorViewer] = useState<any>(undefined);
  console.log('miradorState',miradorState)
  useImperativeHandle(ref, () => ({
    saveProject: () => {
      console.log(miradorViewer.store.getState())
    },
    setViewer: ()=>{
      const viewer : IState = miradorViewer.store.getState()
      setViewer(viewer);
      return viewer
    }
  }));

  useEffect(() => {
    if (viewerRef.current) {
      HandleSetIsRunning()
      const config = {
        id: viewerRef.current.id,
        annotation: {
          adapter: (canvasId : string) => new MMUAdapter( project.id, `${canvasId}/annotationPage`),
          // adapter: (canvasId : string) => new LocalStorageAdapter(`localStorage://?canvasId=${canvasId}`),
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
        saveMiradorState(loadingMiradorViewer.store.getState(),project.title);
      }


      // Load state only if it is not empty
      if (loadingMiradorViewer && project.id && miradorState) {
        loadingMiradorViewer.store.dispatch(
          Mirador.actions.importMiradorState(miradorState)
        );
      }

      setMiradorViewer(loadingMiradorViewer);
      setViewer(loadingMiradorViewer)
      setMiradorState(loadingMiradorViewer.store.getState());
    }
  }, []);


  return(
      <div ref={viewerRef} id="mirador" style={{height:'100vh'}}></div>
  )
});

export default MiradorViewer;
