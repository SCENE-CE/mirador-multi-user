import { RegisterForm } from "../components/RegisterForm.tsx";
import { Layout } from "../components/layout.tsx";

export const Register = ()=>{
    return(
      <Layout title="Create your account">
        <RegisterForm />
      </Layout>
    )
}
