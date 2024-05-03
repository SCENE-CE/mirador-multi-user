import { useQuery } from "@tanstack/react-query";
import { ExtractFnReturnType, QueryConfig } from "../../../lib/react-query.ts";
import { User } from "../../auth/types/types.ts";

export const getUsers = async (): Promise<User[]>=>{
    const domain = import.meta.env.VITE_DOMAIN;
    const port = import.meta.env.VITE_PORT;
  try{
    const response = await fetch(`${domain}:${port}/users`, {})
    return response.json();
  }catch(error){
    throw error;
  }
}

type QueryFnType = typeof getUsers;

type UseUsersOptions = {
  config?: QueryConfig<QueryFnType>;
};

export const useUsers = ({ config }: UseUsersOptions = {}) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['users'],
    queryFn: () => getUsers(),
  });
};
