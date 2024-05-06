import { useEffect, useRef } from 'react';
import Mirador from 'mirador';
import miradorAnnotationEditorVideo from "mirador-annotation-editor-video/src/plugin/MiradorAnnotationEditionVideoPlugin";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import IWorkspace from "./interface/IWorkspace.ts";
import LocalStorageAdapter from "mirador-annotation-editor/src/annotationAdapter/LocalStorageAdapter.js";

interface MiradorViewerProps {
  workspace: IWorkspace; // Use the Workspace interface
}

const MiradorViewer: React.FC<MiradorViewerProps> = ({ workspace }) => {
  const viewerRef = useRef<HTMLDivElement>(null);
console.log(workspace)

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
  <div>
    <h1>CECI EST NOTRE PROJET</h1>
  <div ref={viewerRef} id="mirador" style={{ width: '100%', height: '100vh' }}>
  </div>;
  </div>
    )
};

export default MiradorViewer;
