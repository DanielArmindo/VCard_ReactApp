import { changeCredentials, createVcard, login } from "../assets/api";
import * as utils from "../assets/utils";
import store from "../stores";
import { clear, getUser } from "../stores/user";
import { toast } from "react-toastify";
import { redirect } from "react-router-dom";

export async function loginAction({ request }) {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  let error = {};

  !utils.verfPassword(password) &&
    (error.password = "Password dever ter no minimo 3 caracteres");
  !utils.verfUsername(username) &&
    (error.username =
      "Username deve ser um numero de telefone começando em 9 com 9 digitos ou um email");

  if (Object.keys(error).length !== 0) {
    return error;
  }

  const connected = await login({ username, password });
  switch (connected) {
    case true:
      store.dispatch(getUser());
      toast.success("Successful Login!");
      return redirect("/");
    case 400:
      toast.error("Invalid Credentials");
      break;
    case 500:
      toast.error("Error to login...");
      break;
    default:
      toast.error("Unable to log in");
      break;
  }

  return null;
}

export async function vcardAction({ request }) {
  const formData = await request.formData();

  //Implementado apenas para criar vcard ainda
  const requestData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    phone_number: formData.get("phone"),
    photo_url: formData.get("photo_url"),
    deletePhotoOnTheServer:
      formData.get("deletePhotoOnTheServer") == "true" ? true : false,
    base64ImagePhoto: formData.get("base64ImagePhoto"),
    confirmation_code: formData.get("confirmCode"),
  };

  let error = {};

  !utils.verfPhoneNumber(requestData.phone_number) &&
    (error.phone = "Deve começar com 9 e ter 9 digitos");
  !utils.verfEmail(requestData.email) &&
    (error.email = "Deve ser do formato de email");
  !utils.verfPassword(requestData.password) &&
    (error.password = "Password dever ter no minimo 3 caracteres");
  !utils.verfConfirmCode(requestData.confirmation_code) &&
    (error.code = "Code deve ter 3 digitos");

  if (Object.keys(error).length !== 0) {
    return error;
  }

  const response = await createVcard(requestData);

  return response;
}

export async function changePasswordAction({ request }) {
  const formData = await request.formData();

  const requestData = {
    current_password: formData.get("current_password"),
    password: formData.get("password"),
    password_confirmation: formData.get("password_confirmation"),
  };

  const options = {
    changePassword: true,
    id: store.getState().user.id,
  };

  let error = {};

  !utils.verfPassword(requestData.current_password) &&
    (error.currentPassword =
      "Current Password dever ter no minimo 3 caracteres");
  !utils.verfPassword(requestData.password) &&
    (error.password = "Password dever ter no minimo 3 caracteres");
  !utils.verfPassword(requestData.password_confirmation) &&
    (error.passwordConfirmation =
      "Password Confirmation dever ter no minimo 3 caracteres");

  if (Object.keys(error).length !== 0) {
    return error;
  }

  const response = await changeCredentials(requestData, options);

  switch (response) {
    case true:
      store.dispatch(clear());
      toast.success("Credentials Changed Successfully!");
      return redirect("/");
    case 422:
      toast.error(
        "Credentials have not been changed due to validation errors!",
      );
      break;
    default:
      toast.error(
        "Credentials have not been changed due to unknown server error!",
      );
      break;
  }

  return null;
}

export async function changeConfirmCodeAction({ request }) {
  const formData = await request.formData();

  const requestData = {
    current_password: formData.get("current_password"),
    confirmation_code: formData.get("confirmation_code"),
    confirmation_code_confirmation: formData.get(
      "confirmation_code_confirmation",
    ),
  };

  const options = {
    changePassword: false,
    id: store.getState().user.id,
  };

  let error = {};

  !utils.verfPassword(requestData.current_password) &&
    (error.currentPassword =
      "Current Password dever ter no minimo 3 caracteres");
  !utils.verfConfirmCode(requestData.confirmation_code) &&
    (error.confirmation_code = "Confirmation Code deve conter 3 digitos");
  !utils.verfConfirmCode(requestData.confirmation_code_confirmation) &&
    (error.confirmation_code_confirmation =
      "Confirmation Code Confirmation deve conter 3 digitos");

  if (Object.keys(error).length !== 0) {
    return error;
  }

  const response = await changeCredentials(requestData, options);

  switch (response) {
    case true:
      store.dispatch(clear());
      toast.success("Credentials Changed Successfully!");
      return redirect("/");
    case 422:
      toast.error(
        "Credentials have not been changed due to validation errors!",
      );
      break;
    default:
      toast.error(
        "Credentials have not been changed due to unknown server error!",
      );
      break;
  }

  return null;
}
