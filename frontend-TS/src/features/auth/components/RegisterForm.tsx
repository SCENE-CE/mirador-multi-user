import { useForm } from "react-hook-form";
import { Button, Grid, Snackbar } from "@mui/material";
import FormField from "components/elements/FormField.tsx";
import { RegisterFormData, UserSchema } from "../types/types.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "../../../utils/auth.tsx";
import { RegisterCredentialsDTO } from "../api/register.ts";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

export const RegisterForm = () => {
  const navigate = useNavigate(); // Use hooks at the top level
  const [token, setToken] = useState<any>(null);
  const captchaRef = useRef(null);

  const onLoad = () => {
    // this reaches out to the hCaptcha JS API and runs the
    // execute function on it. you can use other functions as
    // documented here:
    // https://docs.hcaptcha.com/configuration#jsapi
    hcaptcha.execute();
  };
  //this is a hook from React-Query that allow us to use createUser(data) bellow
  const { mutateAsync: createUser } = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(UserSchema)
  });

  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const onSubmit = async (data: RegisterCredentialsDTO) => {
    try {
      await createUser(data, {
        onSuccess: () => navigate("/")
      });
    } catch (error : any) {
      console.log("error", error);
      setOpen(true);
      setMessage(error.toString());
    }
  };

  useEffect(() => {

    if (token)
      console.log(`hCaptcha Token: ${token}`);

  }, [token]);

  return (
    <form>
      <Snackbar open={open} message={message} autoHideDuration={10} />
      <Grid
        container
        direction="column"
        justifyContent="center"
        spacing={2}
        maxWidth={"1000px"}
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
            placeholder="confirm password"
            name="confirmPassword"
            register={register}
            required={true}
            error={errors.confirmPassword}
          />
        </Grid>
        <form>
          <HCaptcha
            sitekey="your-sitekey"
            onLoad={onLoad}
            onVerify={setToken}
            ref={captchaRef}
          />
        </form>
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
  );
};
