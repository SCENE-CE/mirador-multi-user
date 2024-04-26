import { useState, useTransition } from "react";
import { Landing } from "../features/miscellaneous/Landing.tsx";
import { useRoutes } from "react-router-dom";
import { useUser } from "../utils/auth.tsx";


export function AppRoutes(){
  const [url, setUrl] = useState("/");
  const [isPending, startTransition] = useTransition();

  function navigateTo(url: string) {
    startTransition(()=>{
      setUrl(url);
    })
  }
  const auth = useUser();
  const commonRoutes = [{path:"/", content:Landing}]

  const routes = auth.data ? protectedRoutes: PublicRoutes

  const content = useRoutes([...routes, ...commonRoutes]);

  return(
    <>
      {isPending ? <div>Loading...</div> : content}
    </>
  )
}
