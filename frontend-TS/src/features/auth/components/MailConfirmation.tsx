import { Button, Grid } from "@mui/material";
import { confirmationMail } from "../api/confirmationMail.ts";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Layout } from "./layout.tsx";

export const MailConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Use hooks at the top level

  const handleConfirmMail = async () => {
    // Extract token from the URL
    const extractToken = () => {
      const tokenMatch = location.pathname.match(/token\/([^/]+)/);
      return tokenMatch ? tokenMatch[1] : null;
    };

    const token = extractToken();

    if (token) {
      const returnData = await confirmationMail(token);
      if(returnData.status === 201){
        toast.success(returnData.message);
        navigate("/");
      }else{
        toast.error('an error occurred')
      }
    } else {
      console.error("Token not found in the URL");
    }
  };

  return (
    <Layout title="Confirmation Mail">
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmMail}>
            Confirm Email
          </Button>
        </Grid>
    </Layout>
  );
}