import {
  changeCredentials,
  createVcard,
  login,
  createCategory as createCategoryApi,
  updateCategory,
  createAdmin as createAdminApi,
  updateAdmin,
} from "../assets/api";
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

export async function createCategory({ request, params }) {
  const formData = await request.formData();

  //Inserting Category
  if (params.id === "new") {
    let error = {};

    !utils.verfStringNotEmpty(formData.get("name")) &&
      (error.name = "Category name cannot be empty!!");

    if (formData.get("type") !== "C" && formData.get("type") !== "D") {
      error.type = "The category type must be between C or D";
    }

    if (Object.keys(error).length !== 0) {
      return error;
    }

    const user = store.getState().user;
    const data = {
      type: user.user_type,
      data: {
        vcard: user.user_type === "V" ? user.id : null,
        name: formData.get("name"),
        type: formData.get("type"),
      },
    };
    const response = await createCategoryApi(data);

    switch (response) {
      case true:
        toast.success(
          `Category ${formData.get("name")} was created successfully!`,
        );
        return redirect("/categories");
      case 422:
        toast.error("Category was not created due to validation errors!");
        break;
      default:
        toast.error("Category was not created due to unknown server error!");
        break;
    }
  }

  //Edit Category
  if (utils.verfIsNumber(params.id)) {
    let error = {};

    !utils.verfStringNotEmpty(formData.get("name")) &&
      (error.name = "Category name cannot be empty!!");

    if (formData.get("type") !== "C" && formData.get("type") !== "D") {
      error.type = "The category type must be between C or D";
    }

    if (Object.keys(error).length !== 0) {
      return error;
    }

    const user = store.getState().user;
    const data = {
      type: user.user_type,
      id: params.id,
      data: {
        vcard: user.user_type === "V" ? user.id : null,
        name: formData.get("name"),
        type: formData.get("type"),
        id: params.id,
      },
    };

    const response = await updateCategory(data);
    switch (response) {
      case true:
        toast.success(
          `Category ${formData.get("name")} was updated successfully!`,
        );
        return redirect("/categories");
      case 422:
        toast.error(
          `Category #${params.id} was not updated due to validation errors!`,
        );
        break;
      default:
        toast.error(
          `Category #${params.id} was not updated due to unknown server error!`,
        );
        break;
    }
  }
  return null;
}

export async function createAdmin({ request, params }) {
  const formData = await request.formData();

  //Inserting Admin
  if (params.id === "new") {
    let error = {};

    !utils.verfStringNotEmpty(formData.get("name")) &&
      (error.name = "Name cannot be empty!!");

    !utils.verfEmail(formData.get("email")) &&
      (error.email = "Must be email format!!");

    !utils.verfPassword(formData.get("password")) &&
      (error.password = "The password must be at least 3 characters long!!");

    !utils.verfPassword(formData.get("passwordConfirmation")) &&
      (error.passwordConfirmation =
        "The password confirmation must be at least 3 characters long!!");

    if (Object.keys(error).length !== 0) {
      return error;
    }

    if (formData.get("passwordConfirmation") !== formData.get("password")) {
      toast.error(
        "The password and confirmation password fields must be the same!",
      );
      return null;
    }

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      password_confirmation: formData.get("passwordConfirmation"),
    };
    const response = await createAdminApi(data);

    switch (response) {
      case true:
        toast.success(
          `Admin '${formData.get("name")}' was created successfully!`,
        );
        return redirect("/admins");
      case 422:
        toast.error("Admin was not created due to validation errors!");
        break;
      default:
        toast.error("Admin was not created due to unknown server error!");
        break;
    }
  }

  //Edit Admin
  if (utils.verfIsNumber(params.id)) {
    let error = {};

    !utils.verfStringNotEmpty(formData.get("name")) &&
      (error.name = "Name cannot be empty!!");

    !utils.verfEmail(formData.get("email")) &&
      (error.email = "Must be email format!!");

    if (Object.keys(error).length !== 0) {
      return error;
    }

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      id: params.id,
    };

    const response = await updateAdmin(data);
    switch (response) {
      case true:
        toast.success("Admin #" + params.id + " was updated successfully.");
        return redirect("/admins");
      case 422:
        toast.error(
          "Admin #" + params.id + " was not updated due to validation errors!",
        );
        break;
      default:
        toast.error(
          "Admin #" +
            params.id +
            " was not updated due to unknown server error!",
        );
        break;
    }
  }
  return null;
}
