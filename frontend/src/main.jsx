import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Mirador from "./Mirador.jsx";
import { miradorConfig } from "./config-mirador.js";
import annotationPlugins from "mirador-annotation-editor";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Mirador config={miradorConfig} plugins={[annotationPlugins]} />
  </React.StrictMode>,
)
