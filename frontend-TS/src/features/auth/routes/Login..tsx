import { useNavigate } from 'react-router-dom';

import { Layout } from '../components/layout';
import { LoginForm } from '../components/LoginForm';

export const Login = () => {
  const navigate = useNavigate();

  return (
    <Layout title="Log in to your account">
      <LoginForm onSuccess={() => navigate('/')} />
    </Layout>
  );
};
