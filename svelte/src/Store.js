import { writable, get } from "svelte/store";

export const host = "localhost";
export const protocol = "http";
export const port = "8000";
export const wsprotocal = "ws";
export const serverhost = protocol + "://" + host + ":" + port;
