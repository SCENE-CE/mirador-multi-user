import { useForm } from "react-hook-form";
import { Grid, Typography } from "@mui/material";
import FormField from "components/elements/FormField.tsx";
import { RegisterFormData } from "../types/types.ts";

type RegisterFormProps = {
  onSuccess: () => void;
};

export const RegisterForm = ({onSuccess}: RegisterFormProps)=>{

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>();

  const onSubmit = async (data: FormData) => {
    console.log("SUCCESS", data);
  }

  return(
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid>
          <Typography variant="h2" component="h1" > Register Form</Typography>
          <FormField
          type="email"
          placeholder="email"
          name="email"
          register={register}
          error={errors.email}
          />
        </Grid>
      </form>
  )
}
