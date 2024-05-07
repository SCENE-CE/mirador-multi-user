
import { Landing } from "../features/miscellaneous/Landing.tsx";
import { useRoutes } from "react-router-dom";
import { useUser } from "../utils/auth.tsx";
import { protectedRoutes } from "./protectedRoutes.tsx";
import { publicRoutes } from "./publicRoutes.tsx";
import storage from "../utils/storage.ts";
import { getUser } from "../features/auth/api/getUser.ts";


export function AppRoutes(){
  const auth = useUser();
  async function loadUser() {
    const token = storage.getToken();
    if (token) {
      const data = await getUser();
      return data;
    }
    return null;
  }
  loadUser();
  const commonRoutes = [{
    path: "/",
    element: <Landing /> // Pass navigate directly to the Landing components
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
