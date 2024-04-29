import { Button, Grid, Typography } from "@mui/material";
import FormField from "components/elements/FormField.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, LoginSchema } from "../types/types.ts";

type LoginFormProps = {
  onSuccess: () => void;
};

export const LoginForm = (
  {onSuccess}: LoginFormProps)=>{
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema), // Apply the zodResolver
  });

  return(
    <form>
      <Grid
        container
        direction="column"
        spacing={2}
      >
        <Grid>
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
            error={errors.name}
          />
        </Grid>
        <Grid item>
          <FormField
            type={"password"}
            placeholder={"password"}
            name={"password"}
            register={register}
            required={true}
            error={errors.name}
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
