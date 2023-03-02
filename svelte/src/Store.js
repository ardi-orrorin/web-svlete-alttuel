import { writable, get } from "svelte/store";
import axios from "axios";

export const host = "localhost";
export const protocol = "http";
export const port = "8000";
export const wsprotocal = "ws";
export const serverhost = protocol + "://" + host + ":" + port;
export const ismainmenu = writable(true);
export const issubmenu = writable(true);
export const isLogin = writable(false);

export const isLogincookie = async () => {
  let url = serverhost + "/api/user/logincookie";
  let data = await axios({
    method: "post",
    url: url,
    withCredentials: true,
  });
  isLogin.set(true);
  console.log(data);
  if (!data.data) {
    location.href = "#/account/signin";
    isLogin.set(false);
  }
};

export const logOut = () => {
  let url = serverhost + "/api/user/logout";
  let data = axios({ method: "post", url: url, withCredentials: true });
  isLogin.set(false);
  location.href = "#/";
};
