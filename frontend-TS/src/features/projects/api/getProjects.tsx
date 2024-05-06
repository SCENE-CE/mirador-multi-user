import { Project } from "../types/types.ts";

export const getProjects = async(userId:number) :Promise<Project[]>=>{
    const domain = import.meta.env.VITE_DOMAIN;
    const port = import.meta.env.VITE_PORT;
  try{
    const response = await fetch(`${domain}:${port}/projects/${userId}`, {})
    return response.json();
  }catch(error){
    throw error;
  }
}
