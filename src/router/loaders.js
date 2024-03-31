import { redirect } from "react-router-dom";
import store from "../stores";

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
