import { Landing } from "../features/miscellaneous/Landing.tsx";
import { useRoutes } from "react-router-dom";
import { protectedRoutes } from "./protectedRoutes.tsx";
import { publicRoutes } from "./publicRoutes.tsx";
import storage from "../utils/storage.ts";

export function AppRoutes(){
  const token = storage.getToken();

  const commonRoutes = [{
    path: "/*",
    element: <Landing /> // Pass navigate directly to the Landing components
  }];
console.log('token',token)
  let routes;
  if(token){
    console.log('JE SUIS UN TOKEN PERDU', token)
    routes = protectedRoutes;;
  } else {
    routes = [...publicRoutes, ...commonRoutes];
  }

  const content = useRoutes(routes);

  return(
    <>
      {content}
    </>
  )
}
