import { useEffect, useState } from "react";
import { Box, TextField, Button, Typography, Alert, Container, Grid } from "@mui/material";
import { Layout } from "./layout.tsx";
import { resetPassword } from "../api/resetPassword.ts";
import { NavLink } from "react-router-dom";

export const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const url = window.location.href;
    const match = url.match(/\/reset-password\/(.+)/);
    if (match) {
      setToken(match[1]);
    } else {
      setError("Invalid or missing reset token");
    }
  }, []);

  const handlePasswordReset = async () => {
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (!token) {
      setError("Invalid or missing reset token");
    }
    if (token) {
      const response = await resetPassword(token, password);
      if (response) {
        setSuccess('Your password has been successfully reset');
      } else {
        setError('An error occurred while resetting the password');
      }
    }
  }
    return (
      <Layout title="Reset password" rightButton={
        <Grid>
        <NavLink to="/auth/login">
          <Typography variant="button">
            LOGIN
          </Typography>
        </NavLink>
      </Grid>
      }>
        <Container maxWidth="sm">
          <Box sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h5" align="center" gutterBottom>
              Reset Password
            </Typography>
            <TextField
              label="New Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <TextField
              label="Confirm New Password"
              type="password"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
              onClick={handlePasswordReset}
            >
              Reset Password
            </Button>
          </Box>
        </Container>
      </Layout>
    );
  };

