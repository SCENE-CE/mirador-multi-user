import { MainLayout } from "../components/layout/MainLayout.tsx";
import { Suspense } from "react";
import { BigSpinner } from "../components/elements/spinner.tsx";
import { Navigate, Outlet } from "react-router-dom";
import { userDummyContent } from "../features/users/components/userDummyContent.tsx";

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
    path: '/',
    element: <App/>,
    children:[
      {path: '/profile', element: userDummyContent},
      { path: '*', element: <Navigate to="." /> },
    ]
  }
]
