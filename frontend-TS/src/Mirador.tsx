// @ts-ignore
import React, { useEffect, useRef } from 'react';
import Mirador from 'mirador';
import annotationPlugins from 'mirador-annotation-editor';
import LocalStorageAdapter from 'mirador-annotation-editor';

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
        ...annotationPlugins,
      ]);
    }

    // Optional: Cleanup function to run when component unmounts
    return () => {
      // Destroy the viewer instance if Mirador provides a method for it
    };
  }, []);

  return <div ref={viewerRef} id="mirador" style={{ width: '100%', height: '100vh' }} />;
};

export default MiradorViewer;
