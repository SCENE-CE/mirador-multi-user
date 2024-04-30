
import { Landing } from "../features/miscellaneous/Landing.tsx";
import { useRoutes } from "react-router-dom";
import { useUser } from "../utils/auth.tsx";
import { protectedRoutes } from "./protectedRoutes.tsx";
import { publicRoutes } from "./publicRoutes.tsx";
import storage from "../utils/storage.ts";
import { getUser } from "../features/auth/api/getUser.ts";


export function AppRoutes(){
  const auth = useUser();
  console.log('auth',auth.data)
  async function loadUser() {
    const token = storage.getToken();
    console.log('Token from storage:', token);  // Debugging token retrieval
    if (token) {
      const data = await getUser();
      console.log('User data loaded:', data);  // Debugging user data retrieval
      return data;
    }
    return null;
  }
  loadUser();
  const commonRoutes = [{
    path: "/",
    element: <Landing /> // Pass navigate directly to the Landing component
  }];
  const routes = auth.data ? protectedRoutes: publicRoutes;

  const allRoutes = [...routes, ...commonRoutes];
  console.log('allRoutes',allRoutes)
  const content = useRoutes(allRoutes);

  return(
    <>
      {content}
    </>
  )
}
