import { useNavigate } from "react-router-dom";
import { RegisterForm } from "../components/RegisterForm.tsx";
import { Layout } from "../components/layout.tsx";

export const Signin = ()=>{
    const navigate = useNavigate();
    return(
      <Layout title="Create your account">
        <RegisterForm onSuccess={() => navigate('/')} />
      </Layout>
    )
}
