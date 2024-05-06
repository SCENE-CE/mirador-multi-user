import { Button, Grid } from "@mui/material";
import FormField from "components/elements/FormField.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, LoginSchema } from "../types/types.ts";
import { useLogin } from "../../../utils/auth.tsx";
import { LoginCredentialsDTO } from "../api/login.ts";
import { NavLink, useNavigate } from "react-router-dom";


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
      console.log(data)
      const user = loginUser(data,{
        onSuccess: ()=>navigate('/app/my-projects')
      });
      console.log('Login successful', user);
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  return(
    <form>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={10}
        height={'100vh'}
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
          <NavLink to="/auth/signin">
            <Button
            variant="contained"
            >SIGN IN</Button>
          </NavLink>
        </Grid>
      </Grid>
    </form>
)
}
