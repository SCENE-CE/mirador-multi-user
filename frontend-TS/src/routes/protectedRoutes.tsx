import { MainLayout } from "../components/layout/MainLayout.tsx";
import { Suspense } from "react";
import { BigSpinner } from "../components/elements/spinner.tsx";
import { Navigate, Outlet } from "react-router-dom";
import { MyProjects } from "../features/miscellaneous/My-Projects.tsx";

const App = () => {
  return(
    <MainLayout>
      <Suspense fallback={<BigSpinner/>}>
        <Outlet/>
      </Suspense>
    </MainLayout>
  )
}

export const protectedRoutes= [
  {
    path: '/app',
    element: <App/>,
    children:[
      {path: 'my-projects', element:<MyProjects/>},
      { path: '*', element: <Navigate to="my-projects" /> },
    ]
  }
]
