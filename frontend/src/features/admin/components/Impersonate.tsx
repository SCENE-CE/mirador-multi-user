import { useEffect, useRef } from "react";
import { impersonateUser } from "../api/impersonateUser.ts";
import { useNavigate } from 'react-router-dom';
import storage from "../../../utils/storage.ts";

export const Impersonate = () => {
  const navigate = useNavigate();
  const madeRequest = useRef(false);

  useEffect(() => {
    const impersonate = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      console.log('token',token);
      // Avoid multiple requests if the effect runs multiple times
      if (madeRequest.current) {
        return;
      }

      if (token) {
        madeRequest.current = true;

        try {
          const userData = storage.GetImpersonateUserData()
          console.log('userData',userData);
          // Use validateImpersonation function instead of direct fetch
          const response = await impersonateUser(token,userData.id);
          console.log("response",response);
          // Assuming the response contains the JWT token for the impersonated user
          const { access_token } = response;
          const adminToken = storage.getToken()
          console.log('adminToken',adminToken)
          storage.setAdminToken(adminToken);
          // Store JWT in session storage or local storage
          if(!token){
            console.error('token is undefined', token);
          }
            storage.setToken(access_token)
          setTimeout(function(){
            console.log("Executed after 1 second");

          // Redirect to the user's dashboard or home page
          navigate("/app/my-projects");
          }, 1000);
        } catch (error) {
          console.error("Failed to impersonate user:", error);
          // Optional: Redirect to an error page or show an error message
          // navigate("/error");
        }
      }
    };

    impersonate();
  }, [navigate]);

  return (
    <>
      <div>Loading impersonation...</div>
    </>
  );
};

