import './App.css'
import { AppProvider } from "providers/app-provider.tsx";
import { AppRoutes } from "routes/routes.tsx";

function App() {

  return (
  <AppProvider>
    <AppRoutes />
  </AppProvider>
  )
}

export default App
