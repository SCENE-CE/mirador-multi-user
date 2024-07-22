import "./App.css";
import { AppProvider } from "providers/app-provider.tsx";
import { AppRoutes } from "routes/routes.tsx";
import { Toaster } from "react-hot-toast";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from './assets/theme/mainTheme.ts'

function App() {

  return (
    <div  style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline/>
          <AppRoutes />
        </ThemeProvider>
      </AppProvider>
      <Toaster />
    </div>
  );
}

export default App;
