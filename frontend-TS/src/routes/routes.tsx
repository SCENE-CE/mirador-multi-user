
import { Landing } from "../features/miscellaneous/Landing.tsx";
import { useRoutes } from "react-router-dom";
import { useUser } from "../utils/auth.tsx";
import { protectedRoutes } from "./protectedRoutes.tsx";
import { publicRoutes } from "./publicRoutes.tsx";


export function AppRoutes(){
  const auth = useUser();
  const commonRoutes = [{
    path: "/",
    element: <Landing /> // Pass navigate directly to the Landing component
  }];
  const routes = auth.data ? protectedRoutes: publicRoutes;

  const allRoutes = [...routes, ...commonRoutes];

  const content = useRoutes(allRoutes);

  return(
    <>
      {content}
    </>
  )
}
