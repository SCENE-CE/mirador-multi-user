import React, { Component } from 'react';
import Mirador from './Mirador.jsx';
import LocalStorageAdapter from 'mirador-annotation-editor/src/annotationAdapter/LocalStorageAdapter.js';
import miradorAnnotationPlugin from 'mirador-annotation-editor/'
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      manifest:
        'https://purl.stanford.edu/sn904cj3429/iiif/manifest',
    };
  }

  render() {
    return (
      <div className="container">
        <Mirador
          config={{
            id: 'demo',
            catalog: [
              { manifestId: 'https://purl.stanford.edu/sn904cj3429/iiif/manifest' },
              { manifestId: 'https://files.tetras-libre.fr/dev/Clock/manifest.json'}
            ],
            windows:[
              { loadedManifest: "https://purl.stanford.edu/sn904cj3429/iiif/manifest" }
            ],
            annotation: {
              adapter: (canvasId) => new LocalStorageAdapter(`localStorage://?canvasId=${canvasId}`),
              // adapter: (canvasId) => new AnnototAdapter(canvasId, endpointUrl),
              exportLocalStorageAnnotations: false, // display annotation JSON export button
            },
            workspaceControlPanel: {
              enabled:true,
            },
          }}
          plugins={[...miradorAnnotationPlugin,]}
        />
      </div>
    );
  }
}

export default App;
