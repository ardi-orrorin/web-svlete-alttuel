import { writable, get } from "svelte/store";

export const host = "localhost";
export const protocol = "http";
export const port = "8000";
export const wsprotocal = "ws";
export const serverhost = protocol + "://" + host + ":" + port;
export const ismainmenu = writable(true);
export const issubmenu = writable(true);
export const life = writable(0);
export const isLogin = writable(false);
