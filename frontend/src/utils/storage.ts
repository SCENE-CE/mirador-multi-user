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
}

export default storage;
