import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
//Imports Loaders and Actions
import {
  changeConfirmCodeAction,
  changePasswordAction,
  createCategory,
  loginAction,
  vcardAction,
} from "./actions";
import {
categoriesLoader,
  categoryLoader,
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
import Categories from "../components/categories/Categories";
import Category from "../components/categories/Category";

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
      <Route path="categories" element={<Categories />} loader={categoriesLoader} />
      <Route path="categories/:id" action={createCategory} element={<Category />} loader={categoryLoader} />
      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
);
