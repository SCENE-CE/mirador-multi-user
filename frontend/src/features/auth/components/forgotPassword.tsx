import { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, Container, Grid } from "@mui/material";
import { Layout } from "./layout.tsx";
import { forgotPassword } from "../api/forgotPassword.ts";
import { NavLink } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleForgotPassword = async () => {
    setError('');
    setSuccess('');

    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    const response = await forgotPassword(email)
    if (response) {
      setSuccess('A password reset link has been sent to your email.');
    } else {
      setError('An error occurred. Please try again later.');
    }
  }

  return (
    <Layout title={'Forgot Password ? '} rightButton={
      <Grid>
        <NavLink to="/auth/login">
          <Typography variant="button">
            LOGIN
          </Typography>
        </NavLink>
      </Grid>
    }>
      <Container maxWidth="sm">
        <Box display="flex" justifyContent="center" alignItems="center">
          <Box sx={{ p: 4, borderRadius: 2, boxShadow: 3, width: '100%' }}>
            <Typography variant="h5" align="center" gutterBottom>
              Forgot Password
            </Typography>
            <Typography variant="body2" align="center" sx={{ mb: 2 }}>
              Enter your email address to receive a password reset link.
            </Typography>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
              onClick={handleForgotPassword}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Container>
    </Layout>

  );
};

export default ForgotPassword;