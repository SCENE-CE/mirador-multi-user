import { Navigate } from "react-router-dom";
import { MyProjects } from "../features/miscellaneous/My-Projects.tsx";

export const protectedRoutes= [
  {
    path: '/app/my-projects',
    element: <MyProjects/>,
  },
  { path: '*', element: <Navigate to="/app/my-projects" /> },

]
