import React from "react";
import { FieldError, UseFormRegister } from "react-hook-form";
import { TextField } from "@mui/material";

// Define the interface for the FormField props
interface FormFieldProps {
  type: string;
  placeholder: string;
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError | undefined;
  valueAsNumber?: boolean;
}

const FormField: React.FC<FormFieldProps> = (
  {
    type,
    placeholder,
    name,
    register,
    error,
    valueAsNumber,
  }
) =>{

  return (
  <>
        <TextField
          type={type}
          placeholder={placeholder}
          {...register(name, { valueAsNumber })}
          error={!!error}
        />
    <>
      <input
        type={type}
        placeholder={placeholder}
        {...register(name, { valueAsNumber })}
      />
      {error && <span className="error-message">{error.message}</span>}
    </>
  </>
);
}
export default FormField;
