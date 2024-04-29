import { FieldError, UseFormRegister } from "react-hook-form";

export type User = {
  id:number;
  mail:string;
  name: string;
  password: string;
  createdAt: string;
}

export type UserResponse = {
  sub:number;
  name:string;
  iat:number;
  access_token: string;
  exp:number;
  user:User;
}


export type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type FormFieldProps = {
  type: string;
  placeholder: string;
  name: ValidFieldNames;
  register: UseFormRegister<RegisterFormData>;
  error: FieldError | undefined;
  valueAsNumber?: boolean;
};


export type ValidFieldNames =
  | "email"
  | "name"
  | "password"
  | "confirmPassword";
