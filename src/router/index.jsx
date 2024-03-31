import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
//Imports Loaders and Actions
import {
  changeConfirmCodeAction,
  changePasswordAction,
  loginAction,
  vcardAction,
} from "./actions";
import {
  changeConfirmCodeLoader,
  changePasswordLoader,
  loginLoader,
  vcardLoader,
} from "./loaders";
//Imports of components
import Layout from "../components/Layout";
import NotFound from "../views/NotFound";
import Home from "../views/Home";
import Login from "../components/auth/Login";
import Error from "../components/Error";
import VCard from "../components/vcards/VCard";
import ChangeCredentials from "../components/auth/ChangeCredentials";

export const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<Error />}>
      <Route index element={<Home />} />
      <Route
        path="login"
        element={<Login />}
        action={loginAction}
        loader={loginLoader}
      />
      <Route
        path="vcards/:id"
        element={<VCard />}
        action={vcardAction}
        loader={vcardLoader}
      />
      <Route
        path="credentials/password"
        action={changePasswordAction}
        loader={changePasswordLoader}
        element={<ChangeCredentials changeConfirmationCode={false} />}
      />
      <Route
        path="credentials/confirmation_code"
        action={changeConfirmCodeAction}
        loader={changeConfirmCodeLoader}
        element={<ChangeCredentials changeConfirmationCode={true} />}
      />
      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
);
