import { useQuery } from "@tanstack/react-query";
import { ExtractFnReturnType, QueryConfig } from "../../../lib/react-query.ts";
import { User } from "../../auth/types/types.ts";

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users`, {});
    return response.json();
  } catch (error) {
    throw error;
  }
};

type QueryFnType = typeof getUsers;

type UseUsersOptions = {
  config?: QueryConfig<QueryFnType>;
};

export const useUsers = ({ config }: UseUsersOptions = {}) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["users"],
    queryFn: () => getUsers()
  });
};
