import { useEffect, useRef } from "react";
import { validateImpersonation } from "../api/validateImpersonation.ts";
import { useNavigate } from 'react-router-dom';

export const Impersonate = () => {
  const navigate = useNavigate();
  const madeRequest = useRef(false);

  useEffect(() => {
    const impersonate = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      // Avoid multiple requests if the effect runs multiple times
      if (madeRequest.current) {
        return;
      }

      if (token) {
        madeRequest.current = true;

        try {
          // Use validateImpersonation function instead of direct fetch
          const response = await validateImpersonation(token);

          // Assuming the response contains the JWT token for the impersonated user
          const { jwt } = response;

          // Store JWT in session storage or local storage
          sessionStorage.setItem("authToken", jwt);

          // Redirect to the user's dashboard or home page
          navigate("/app/my-projects");
        } catch (error) {
          console.error("Failed to impersonate user:", error);
          // Optional: Redirect to an error page or show an error message
          navigate("/error");
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

