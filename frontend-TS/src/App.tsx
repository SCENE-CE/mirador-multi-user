import "./App.css";
import { AppRoutes } from "routes/routes.tsx";
import { Toaster } from "react-hot-toast";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from './assets/theme/mainTheme.ts'
import { AppProvider } from "./features/miscellaneous/AppProvider.tsx";

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
