import {  useForm } from "react-hook-form";
import { Button, Grid } from "@mui/material";
import FormField from "components/elements/FormField.tsx";
import { RegisterFormData, UserSchema } from "../types/types.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "../../../utils/auth.tsx";
import { RegisterCredentialsDTO } from "../api/register.ts";
import {  useNavigate } from "react-router-dom";

export const RegisterForm = ()=>{
  const navigate = useNavigate(); // Use hooks at the top level

  //this is a hook from React-Query that allow us to use createUser(data) bellow
  const { mutateAsync:createUser } = useRegister()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(UserSchema),
  });

  const onSubmit = async (data: RegisterCredentialsDTO) => {
    try{
      await createUser(data,{
        onSuccess: () => navigate('/')
      })
    }catch(error){
      console.log("error:", error);
    }
  }

  return(
      <form>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          maxWidth={'600px'}
        >
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
          <Grid item container>
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
