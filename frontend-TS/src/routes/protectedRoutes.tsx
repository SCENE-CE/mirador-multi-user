import { Navigate } from "react-router-dom";
import { MainContent } from "../features/miscellaneous/MainContent.tsx";

export const protectedRoutes= [
  {
    path: '/app/my-projects',
    element: <MainContent/>,
  },
  { path: '*', element: <Navigate to="/app/my-projects" /> },

]
