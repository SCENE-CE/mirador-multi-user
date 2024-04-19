import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Mirador from "./Mirador.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Mirador config={{ id: "mirador" }} plugins={[]} />
  </React.StrictMode>,
)
