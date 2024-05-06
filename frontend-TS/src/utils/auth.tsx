import storage from "./storage.ts";
import { getUser } from "../features/auth/api/getUser.ts";
import {
  login,
  LoginCredentialsDTO,
  LoginResponse,
  register,
  RegisterCredentialsDTO,
  User
} from "../features/auth/export.ts";
import { configureAuth } from "react-query-auth";
import { CircularProgress, Grid } from "@mui/material";

async function handleTokenResponse(data:LoginResponse){
  const {access_token, user } = data;
  storage.setToken(access_token);
  return user;
}

async function loadUser(){
  if(storage.getToken()){
    const data = await getUser();
    return data;
  }
  return null
}
//TODO: Modifier l'appelle au backend et construire une route en back pour retourner le bon objet souhaité par react query auth
async function loginFn(data: LoginCredentialsDTO){
  const response = await login(data);
  const token = await handleTokenResponse(response)
  return token;
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