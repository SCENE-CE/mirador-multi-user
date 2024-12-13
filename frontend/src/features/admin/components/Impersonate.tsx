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
      const token = params.get('token');
      if (token) {
        console.log('impersonate session token', token);
        try {
          console.log('try')
          const userData = storage.GetImpersonateUserData()
          console.log("get impersonate user Data",userData);
          if(userData){
            console.log('isUserDAta = true');
            await logout.mutateAsync({
            });

            await loginUser(
              { mail: "", password: "", isImpersonate: token },
              {
                onSuccess: () => {
                  console.log("Login successful, navigating...");
                  navigate("/app/my-projects");
                },
                onError: (error) => {
                  console.error("Failed to impersonate user:", error);
                },
              }
            );
          }
        } catch (error) {
          console.error("Failed to impersonate user:", error);
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

