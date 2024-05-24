import "./App.css";
import { AppProvider } from "providers/app-provider.tsx";
import { AppRoutes } from "routes/routes.tsx";
import { Toaster } from "react-hot-toast";

function App() {

  return (
    <>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
      <Toaster />
    </>
  );
}

export default App;
