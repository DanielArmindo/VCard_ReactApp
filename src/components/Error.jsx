import { Navigate, useRouteError } from "react-router-dom";

const Error = () => {
  const error = useRouteError();
  console.log(error.message, error.status, error.statusText);
  //fazer toast para dar erro
  return <Navigate to="/" />;
};

export default Error;
