import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import storage from "../../../utils/storage.ts";
import { useLogin, useLogout } from "../../../utils/auth.tsx";

export const Impersonate = () => {
  const navigate = useNavigate();
  const logout = useLogout({});
  const { mutateAsync:loginUser } = useLogin();

  useEffect(() => {
    const impersonate = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      if (token) {
        console.log("Impersonate session token", token);
        try {
          console.log("Try");
          const userData = storage.GetImpersonateUserData();
          console.log("Get impersonate user data", userData);
          if (userData) {
            console.log("isUserData = true");
            await logout.mutateAsync({});

            // Call `mutateAsync` and handle navigation after it resolves
            await loginUser({ mail: "", password: "", isImpersonate: token });
            console.log("Login successful, navigating...");
            navigate("/app/my-projects");
          }
        } catch (error) {
          console.error("Failed to impersonate user:", error);
        }
      }
    };

    impersonate();
  }, []);

  return (
    <>
      <div>Loading impersonation...</div>
    </>
  );
};

