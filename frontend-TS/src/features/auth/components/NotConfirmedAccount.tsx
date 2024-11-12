import { Button, CircularProgress, Grid, TextField, Typography } from "@mui/material";
import { ResendConfirmationMail } from "../api/resendConfirmationMail.ts";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


export const NotConfirmedAccount = ({}) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(''); // Prepopulate if email is available
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResendConfirmation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await ResendConfirmationMail(email); // Pass the email as argument
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000); // Navigate home after a delay
    } catch (err) {
      setError('Failed to resend confirmation email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Grid container direction="column" alignItems="center" spacing={2}>
      <Grid item>
        <Typography variant="h6" color="error">
          You must confirm your email
        </Typography>
      </Grid>
      <Grid item>
        <TextField
          label="Email Address"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={handleResendConfirmation}
          disabled={isLoading || success || !email}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Resend Confirmation Link'}
        </Button>
      </Grid>
      {error && (
        <Grid item>
          <Typography color="error">{error}</Typography>
        </Grid>
      )}
      {success && (
        <Grid item>
          <Typography color="primary">
            Confirmation link has been resent. You will be redirected shortly.
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};