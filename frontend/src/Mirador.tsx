import React, { Component } from "react";
import mirador from 'mirador';

const config = {
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
  annotation: {
  },
};

const plugins: never[] = [];

export class Mirador extends Component {
  componentDidMount() {
    mirador.viewer(config);
  }

  render() {
    return <div id={config.id} />;
  }
}
