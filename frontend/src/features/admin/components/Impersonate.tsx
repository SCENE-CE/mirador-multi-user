import { useEffect } from "react";
import { impersonateUser } from "../api/impersonateUser.ts";
import { useNavigate } from 'react-router-dom';
import storage from "../../../utils/storage.ts";
import { handleTokenResponse } from "../../../utils/auth.tsx";

export const Impersonate = () => {
  const navigate = useNavigate();

  // const madeRequest = useRef(false);

  useEffect(() => {
    const impersonate = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      console.log('token',token);
      // // Avoid multiple requests if the effect runs multiple times
      // if (madeRequest.current) {
      //   console.log('return ')
      //   return;
      // }

      if (token) {
        console.log('token', token);

        try {
          console.log('try')
          const userData = storage.GetImpersonateUserData()
          console.log("get impersonate user Data",userData);
          const userToImpersonateData = await impersonateUser(token,userData.id);
          await handleTokenResponse(userToImpersonateData);

          navigate('/app/my-projects')

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

