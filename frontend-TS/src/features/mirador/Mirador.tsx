import { useEffect, useRef } from 'react';
import Mirador from 'mirador';
import miradorAnnotationEditorVideo from "mirador-annotation-editor-video/src/plugin/MiradorAnnotationEditionVideoPlugin";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import IWorkspace from "./interface/IWorkspace.ts";



interface MiradorViewerProps {
  workspace: IWorkspace; // Use the Workspace interface
}

const MiradorViewer: React.FC<MiradorViewerProps> = ({ workspace }) => {
  const viewerRef = useRef<HTMLDivElement>(null);
console.log(workspace)

  useEffect(() => {
    if (viewerRef.current) {
      const config = {
        id: viewerRef.current.id,
        catalog:[
        {
          "manifestId": "https://files.tetras-libre.fr/manifests/re_walden_cut.json"
        },
        {
          "manifestId": "https://files.tetras-libre.fr/manifests/jf_peyret_re_walden.json"
        },
        {
          "manifestId": "https://files.tetras-libre.fr/manifests/test_markeas_manifest.json"
        },
        {
          "manifestId": "https://files.tetras-libre.fr/manifests/installation_fresnoy_manifest.json"
        },
        {
          "manifestId": "https://files.tetras-libre.fr/manifests/sceno_avignon_manifest.json"
        },
        {
          "manifestId": "https://files.tetras-libre.fr/manifests/walden_nouvel_manifest.json"
        },
        {
          "manifestId": "https://files.tetras-libre.fr/manifests/walden_nouvel2_manifest.json"
        },
        {
          "manifestId": "https://files.tetras-libre.fr/manifests/score_manifest.json"
        },
        {
          "manifestId": "https://files.tetras-libre.fr/manifests/program_manifest.json"
        }
      ],
        workspace
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
