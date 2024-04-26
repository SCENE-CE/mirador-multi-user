type LoginFormProps = {
  onSuccess: () => void;
};

export const LoginForm = ({onSuccess}: LoginFormProps)=>{
return(
  <div>
    <form>
      <p>CECI EST UN FORM </p>
      <button onClick={onSuccess}> GO !</button>
    </form>
  </div>
)
}
