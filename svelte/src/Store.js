import { writable, get } from "svelte/store";
import axios from "axios";

export const host = "192.168.0.49";
export const protocol = "http";
export const port = "9000";
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
  if (!data.data) {
    location.href = "#/account/signin";
    isLogin.set(false);
  }
};

export const logOut = async () => {
  let url = serverhost + "/api/user/logout";
  await axios({ method: "post", url: url, withCredentials: true });
  isLogin.set(false);
  location.href = "#/";
  location.reload();
};
