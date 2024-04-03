import { defer, redirect } from "react-router-dom";
import store from "../stores";
import { getCategories, getCategory, getStatistics } from "../assets/api";
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
    //Pode nao ser preciso o inserting
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
    id : user.id
  }
  
  const response = getStatistics(request)

  return defer({statistics: response});
}
