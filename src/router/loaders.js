import { defer, redirect } from "react-router-dom";
import store from "../stores";
import {
  getAdmins,
  getCategories,
  getCategory,
  getStatistics,
  getAdmin,
} from "../assets/api";
import { verfIsNumber } from "../assets/utils";

export function loginLoader() {
  // console.log("loader", store.getState().user, store.getState().user === null)
  if (!(store.getState().user === null)) {
    return redirect("/");
  }
  return null;
}

export function vcardLoader({ params }) {
  const edit = true;
  if (params.id === "new") {
    if (sessionStorage.getItem("tokken")) {
      return redirect("/");
    }
  } else {
    // if (!Number.isInteger(params.id)) {
    //   return redirect("/");
    // }
  }

  return { id: params.id, edit: edit };
}

export function changePasswordLoader() {
  if (store.getState().user === null) {
    return redirect("/");
  }
  return null;
}

export function changeConfirmCodeLoader() {
  if (!(store.getState().user?.user_type === "V")) {
    return redirect("/");
  }
  return null;
}

// ================== Categories
export async function categoriesLoader() {
  const user = store.getState().user;
  if (user === null) {
    return redirect("/");
  }
  const categoriesPromise = getCategories({
    type: user.user_type,
    id: user.id,
  });
  return defer({ categories: categoriesPromise });
}

export async function categoryLoader({ params }) {
  const user = store.getState().user;
  if (user === null) {
    return redirect("/");
  }
  if (params.id === "new") {
    return null;
  }
  if (verfIsNumber(params.id)) {
    return defer({
      category: getCategory({ type: user.user_type, id: params.id }),
    });
  }

  return redirect("/");
}

// ================== Statistics
export function statisticsLoader() {
  const user = store.getState().user;
  if (user === null) {
    return redirect("/");
  }

  const request = {
    type: user.user_type,
    id: user.id,
  };

  const response = getStatistics(request);

  return defer({ statistics: response });
}

// ================== Admins
export function adminsLoader() {
  const user = store.getState().user;
  if (user === null || user.user_type !== "A") {
    return redirect("/");
  }

  return defer({ admins: getAdmins() });
}

export function adminLoader({ params }) {
  const user = store.getState().user;
  if (user === null || user.user_type !== "A") {
    return redirect("/");
  }
  if (params.id === "new") {
    return defer({ edit: false });
  }
  if (verfIsNumber(params.id)) {
    if (user.id !== parseInt(params.id)) {
      return redirect("/");
    }
    return defer({
      admin: getAdmin(params.id),
      edit: true,
    });
  }

  return redirect("/");
}
