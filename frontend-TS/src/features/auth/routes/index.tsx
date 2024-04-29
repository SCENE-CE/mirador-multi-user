import { Route, Routes } from "react-router-dom";
import { Login } from "./Login.tsx";
import { Signin } from "./Signin.tsx";

export const AuthRoutes = () => {
  return(
    <Routes>
      <Route path="/login" Component={Login} />
      <Route path="/signin" Component={Signin}/>
    </Routes>
  )
}
