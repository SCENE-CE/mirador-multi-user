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
          await impersonateUser(token,userData.id);
          navigate("/app/my-projects");
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

