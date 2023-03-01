import { writable, get } from "svelte/store";
import axios from "axios";

export const host = "localhost";
export const protocol = "http";
export const port = "8000";
export const wsprotocal = "ws";
export const serverhost = protocol + "://" + host + ":" + port;
export const ismainmenu = writable(true);
export const issubmenu = writable(true);
export const life = writable(0);

export const isLoginerr = () => {
  if (localStorage.getItem("login") === "false") {
    alert("로그인 후 이용하시기 바랍니다.");
    location.href = "#/";
  }
};

export const isLogincookie = async () => {
  let url = serverhost + "/api/user/logincookie";
  let data = await axios({ method: "post", url: url, params: { cookie: localStorage.getItem("accessToken") } });

  if (data.data) {
    localStorage.setItem("accessToken", data.data);
    localStorage.setItem("login", "true");
  } else {
    localStorage.setItem("login", "false");
    localStorage.setItem("accessToken", "");
  }

  console.log(localStorage.getItem("login"));
  console.log(localStorage.getItem("accessToken"));
};

export const logOut = () => {
  localStorage.setItem("accessToken", "");
  localStorage.setItem("login", "false");
};
