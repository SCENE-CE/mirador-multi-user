import storage from "./storage.ts";
import { getUser } from "../features/auth/api/getUser.ts";
import {
  login,
  LoginCredentialsDTO,
  register,
  RegisterCredentialsDTO,
  User,
  UserResponse
} from "../features/auth/export.ts";
import { configureAuth } from "react-query-auth";
import { CircularProgress, Grid } from "@mui/material";

async function handleTokenResponse(data:UserResponse){
  const {access_token, user } = data;
  console.log('user', user);
  storage.setToken(access_token);
  return user;
}

async function handleImpersonateToken(token:string){
  storage.setToken(token);
  //get user
  return await loadUser();
}

async function loadUser(): Promise<User|null>{
  if(storage.getToken()){
    const data = await getUser();
    return data;
  }
  console.log('USER DATA IS EMPTY')
  return null
}
//TODO: Modifier l'appelle au backend et construire une route en back pour retourner le bon objet souhaité par react query auth
async function loginFn(data: LoginCredentialsDTO){
  if(data.token){
    return await handleImpersonateToken(data.token);
  }
  const response = await login(data);
  return await handleTokenResponse(response);
}

async function registerFn(data: RegisterCredentialsDTO){
  const response = await register(data);
  const user = await handleTokenResponse(response)
  return user;
}

async function logoutFn()
{
  storage.clearToken();
  window.location.assign(window.location.origin as unknown as string);
}


const authConfig= {
  userFn : loadUser,
  loginFn,
  registerFn,
  logoutFn,
  LoaderComponent(){
    return(
      <Grid>
        <CircularProgress/>
      </Grid>
    )
  },
};

export const { useUser, useLogin, useRegister, useLogout } = configureAuth< User | null, unknown, LoginCredentialsDTO, RegisterCredentialsDTO>(authConfig);
