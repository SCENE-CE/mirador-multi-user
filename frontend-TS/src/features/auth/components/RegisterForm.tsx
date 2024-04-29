import {  useForm } from "react-hook-form";
import { Button, Grid, Typography } from "@mui/material";
import FormField from "components/elements/FormField.tsx";
import { RegisterFormData, UserSchema } from "../types/types.ts";
import { zodResolver } from "@hookform/resolvers/zod";

type RegisterFormProps = {
  onSuccess: () => void;
};


export const RegisterForm = ({ onSuccess }: RegisterFormProps)=>{

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(UserSchema), // Apply the zodResolver
  });

  const onSubmit = async (data: RegisterFormData) => {
    console.log('data',data);
    let domain= import.meta.env.VITE_DOMAIN;
    console.log(domain)
    let port = import.meta.env.VITE_PORT;
    console.log(port)
    try{
      const response = await fetch(`http://${domain}:${port}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json();
      console.log('responseData',responseData)
      onSuccess();

    }catch(error){
      console.log("error:", error);
    }
  }

  return(
      <form>
        <Grid
          container
          direction="column"
          spacing={2}
        >
          <Grid item >
          <Typography
            variant="h2"
            component="h1"
          >
            Register Form
          </Typography>
          </Grid>
          <Grid item>
          <FormField
            type="mail"
            placeholder="mail"
            name="mail"
            required={true}
            register={register}
            error={errors.mail}
          />
          </Grid>
          <Grid item>
          <FormField
            type="text"
            placeholder="name"
            name="name"
            required={true}
            register={register}
            error={errors.name}
          />
          </Grid>
          <Grid item>
            <FormField
              type="password"
              placeholder="password"
              name="password"
              register={register}
              required={true}
              error={errors.password}
            />
          </Grid>
          <Grid item>
            <FormField
              type="password"
              placeholder="confirm Password"
              name="confirmPassword"
              register={register}
              required={true}
              error={errors.confirmPassword}
            />
          </Grid>
          <Grid item>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={handleSubmit(onSubmit)}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
  )
}
