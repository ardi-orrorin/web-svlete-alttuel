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
  let data = await axios({
    method: "post",
    url: url,
    params: { cookie: localStorage.getItem("accessToken") },
    withCredentials: true,
  });

  console.log(document.cookie());
  if (data.data) {
    localStorage.setItem("login", "true");
  } else {
    localStorage.setItem("login", "false");
  }

  console.log(localStorage.getItem("login"));
};

export const logOut = () => {
  localStorage.setItem("login", "false");
};
