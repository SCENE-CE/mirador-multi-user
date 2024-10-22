import { Button, Grid } from "@mui/material";
import FormField from "components/elements/FormField.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, LoginSchema } from "../types/types.ts";
import { useLogin } from "../../../utils/auth.tsx";
import { LoginCredentialsDTO } from "../api/login.ts";
import { useNavigate } from "react-router-dom";
import '@hcaptcha/types';

export const LoginForm = ()=>{
  const navigate = useNavigate(); // Use hooks at the top level
  const { mutateAsync:loginUser } = useLogin();


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema), // Apply the zodResolver
  });



  const onSubmit = async (data: LoginCredentialsDTO) => {
    try {
      await loginUser(data, {
        onSuccess: () => navigate('/app/my-projects')
      });
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  return(
    <form>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        spacing={2}
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
            type={"password"}
            placeholder={"password"}
            name={"password"}
            register={register}
            required={true}
            error={errors.password}
          />
        </Grid>
        <Grid
          item
          container
        >
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
