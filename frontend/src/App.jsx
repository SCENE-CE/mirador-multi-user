import React, { Component } from 'react';
import Mirador from './Mirador.jsx';
import miradorAnnotationPlugin from 'mirador-annotation-editor'
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      manifest:
        'https://purl.stanford.edu/sn904cj3429/iiif/manifest',
    };
  }

  render() {
    const { manifest } = this.state;

    return (
      <div className="container">
        <Mirador
          config={{
            id: 'demo',
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
            windows:[
              { loadedManifest: "https://purl.stanford.edu/sn904cj3429/iiif/manifest" }
            ],
            annotation: {

            },
            workspaceControlPanel: {
              enabled: false,
            },
          }}
          plugins={[...miradorAnnotationPlugin,]}
        />
      </div>
    );
  }
}

export default App;
