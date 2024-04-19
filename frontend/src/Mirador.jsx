import React, { Component } from "react";
import mirador from "mirador";
import annotationPlugins from "mirador-annotation-editor";
import { miradorConfig } from "./config-mirador.js";
class Mirador extends Component {
  constructor(props) {
    super(props);
    this.miradorInstance = null;
  }
  componentDidMount() {
    this.miradorInstance = mirador.viewer(miradorConfig, [annotationPlugins,]);
    // Example of subscribing to state
    this.miradorInstance.store.subscribe(() => {
      let state = this.miradorInstance.store.getState();
      console.log(state.windows);
    });
    // Hacky example of waiting a specified time to add a window... Don't do this for real
    setTimeout(() => {
      this.miradorInstance.store.dispatch(
        this.miradorInstance.actions.addWindow({
          manifestId: "https://purl.stanford.edu/bk785mr1006/iiif/manifest"
        })
      );
    }, 5000);
  }
  render() {
    return <div id='demo' />;
  }
}

export default Mirador;

