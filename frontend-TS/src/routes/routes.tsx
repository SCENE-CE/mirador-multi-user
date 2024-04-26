import { useState, useTransition } from "react";
import { Landing } from "../features/miscellaneous/Landing.tsx";


export function AppRoutes(){
  const [url, setUrl] = useState("/");
  const [isPending, startTransition] = useTransition();

  function navigateTo(url: string) {
    startTransition(()=>{
      setUrl(url);
    })
  }

  let content;

  if(url === '/'){
    content = <Landing navigateTo={navigateTo}/>
    ;
  }else if (url === '/login'){
    content = <div>Other Content for URL: {url}</div>;

  }
  return(
    <>
      {isPending ? <div>Loading...</div> : content}
    </>
  )
}
