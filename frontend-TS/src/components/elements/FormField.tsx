import React from "react";
import { FieldError, UseFormRegister } from "react-hook-form";
import { FormLabel, Grid, TextField } from "@mui/material";

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
    error,
    valueAsNumber,
  }
) =>{
  console.log('error:' ,error)

  return (
  <Grid container alignItems="center" spacing={2} justifyContent="space-between" minWidth="300px">
    <Grid item>
    <TextField
          type={type}
          label={placeholder}
          variant="outlined"
          {...register(name, { valueAsNumber })}
          error={!!error}
        />
    </Grid>
    {
      error && (
        <Grid item width={200}>
    <FormLabel error={true}>{error.message}</FormLabel>
        </Grid>
      )
    }
  </Grid>
);
}
export default FormField;
