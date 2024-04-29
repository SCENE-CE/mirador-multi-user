import React from "react";
import { FieldError, UseFormRegister } from "react-hook-form";
import { FormLabel, TextField } from "@mui/material";

// Define the interface for the FormField props
interface FormFieldProps {
  type: string;
  placeholder: string;
  name: string;
  register: UseFormRegister<any>;
  required:boolean;
  error?: FieldError | undefined;
  valueAsNumber?: boolean;
}

const FormField: React.FC<FormFieldProps> = (
  {
    type,
    placeholder,
    name,
    register,
    required,
    error,
    valueAsNumber,
  }
) =>{
  console.log('error:' ,error)

  return (
  <>
    <FormLabel htmlFor={name} required={required}> {name} : </FormLabel>
    <TextField
          type={type}
          placeholder={placeholder}
          {...register(name, { valueAsNumber })}
          error={!!error}
        />
    {
      error && (
        <>
    <FormLabel error={true}>{error.message}</FormLabel>
        </>
      )
    }
  </>
);
}
export default FormField;
