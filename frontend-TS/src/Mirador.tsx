import { useEffect, useRef } from 'react';
import Mirador from 'mirador';
import miradorAnnotationEditorVideo from "mirador-annotation-editor-video/src/plugin/MiradorAnnotationEditionVideoPlugin";
import LocalStorageAdapter from 'mirador-annotation-editor/src/annotationAdapter/LocalStorageAdapter.js'

const MiradorViewer = () => {

  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewerRef.current) {
      const config = {
        id: viewerRef.current.id,
        catalog: [
          { manifestId: 'https://purl.stanford.edu/sn904cj3429/iiif/manifest' },
          { manifestId: 'https://files.tetras-libre.fr/dev/Clock/manifest.json'}
        ],
        theme: {
          palette: {
            primary: {
              main: '#6e8678',
            },
          },
        },
        annotation: {
          adapter: (canvasId:string) => new LocalStorageAdapter(`localStorage://?canvasId=${canvasId}`),
          exportLocalStorageAnnotations: false,
        },
      };

      Mirador.viewer(config, [
        ...miradorAnnotationEditorVideo,
      ]);
    }
  }, []);

  return <div ref={viewerRef} id="mirador" style={{ width: '100%', height: '100vh' }} />;
};

export default MiradorViewer;
