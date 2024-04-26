import { useNavigate } from "react-router-dom";

export const Landing = () => {
  let user:string;
  const navigate = useNavigate();
  const HandleStart = () => {
    if (user) {
      navigate('/app');
    } else {
      navigate('/auth/login');
    }
  };

  return(
    <div>
      <h1>Landing Page</h1>
      <button onClick={HandleStart}>Go somewhere else</button>
    </div>
  )
}
