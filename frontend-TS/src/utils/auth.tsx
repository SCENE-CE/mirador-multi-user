import { UserResponse } from "features/auth/types/types.ts";
import storage from "./storage.ts";
import { getUser } from "../features/auth/api/getUser.ts";
import { login, LoginCredentialsDTO, register, RegisterCredentialsDTO, User } from "../features/auth/export.ts";
import { configureAuth } from "react-query-auth";

async function handleTokenResponse(data:UserResponse){
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
    //TODO: there it should be a MUI spinner
    return(
      <div>
        <p>HERE SHOULD BE A WONDERFUL SPINNER MAIS TKT CA ARRIVE !</p>
      </div>
    )
  },
};

export const { useUser, useLogin, useRegister, useLogout } = configureAuth< User | null, unknown, LoginCredentialsDTO, RegisterCredentialsDTO>(authConfig);
