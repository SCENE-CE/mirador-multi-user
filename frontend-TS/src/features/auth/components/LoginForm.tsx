import { Grid, Typography } from "@mui/material";
import FormField from "components/elements/FormField.tsx";

type LoginFormProps = {
  onSuccess: () => void;
};

export const LoginForm = ({onSuccess}: LoginFormProps)=>{
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
      </Grid>
    </form>
)
}
