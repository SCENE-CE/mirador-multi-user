import { UserResponse } from "../types/types.ts";

export type LoginCredentialsDTO = {
  mail:string;
  password:string;
};

export const login= async (data: LoginCredentialsDTO): Promise<UserResponse> => {
  const response = await fetch()
}
