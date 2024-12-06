import { ImpersonateUserData } from "../features/admin/types/type.ts";

const storagePrefix = 'Mirador-multi-user-'
const storage = {

  getToken:() =>{
    return JSON.parse(localStorage.getItem(`${storagePrefix}token`) as string);
  },
  setToken: (token: string) => {
    if(token == undefined){
      return
    }
    window.localStorage.setItem(`${storagePrefix}token`, JSON.stringify(token));
  },
  clearToken:() => {
    window.localStorage.removeItem(`${storagePrefix}token`);
  },
  GetImpersonateUserData: (): ImpersonateUserData =>{
    return JSON.parse(localStorage.getItem(`${storagePrefix}impersonate-user`) as string);
  },
  SetImpersonateUserId:(id:number)=>{
    window.localStorage.setItem(`${storagePrefix}impersonate-user`, `${id}`);
  }
}

export default storage;
