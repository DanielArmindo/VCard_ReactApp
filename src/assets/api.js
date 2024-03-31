import axios from "axios";

const apiDomain = import.meta.env.VITE_API_DOMAIN;
const wsConnection = import.meta.env.VITE_WS_CONNECTION;

export const api = axios.create({
  baseURL: apiDomain + "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ============= Related to User
export async function login(credentials) {
  try {
    const response = await api.post("/auth/login", credentials);
    sessionStorage.setItem("tokken", response.data.access_token);
    api.defaults.headers.common.Authorization =
      "Bearer " + response.data.access_token;
    // socket.emit('loggedIn', user.value)
    return true;
  } catch (error) {
    clearTokken();
    if (error.response && error.response.status) {
      return error.response.status;
    }
    return false;
  }
}

export async function logout() {
  try {
    await api.post("logout");
    clearTokken();
    return true;
  } catch (error) {
    return false;
  }
}

export function clearTokken() {
  sessionStorage.removeItem("tokken");
  api.defaults.headers.common.Authorization = "";
}

export async function changeCredentials(credentials, options) {
  try {
    const url = !options.changePassword
      ? `vcards/${options.id}/confirmation_code`
      : `users/${options.id}/password`;

    await api.patch(url, credentials);
    clearTokken()
    return true;
  } catch (error) {
    if (error.response && error.response.status) {
      return error.response.status;
    }
    return false;
  }
}

// ============= Related to VCards

export async function createVcard(data) {
  try {
    await api.post("/vcards", data);
    return true;
  } catch (err) {
    if (err.response && err.response.status) {
      return err.response;
    }
    return false;
  }
}
