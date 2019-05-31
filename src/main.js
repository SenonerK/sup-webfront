import App from "./App.svelte";
import { global } from "./store.js";
import useLocalStorage from "./useLocalStorage.js";
import axios from "axios";

Date.prototype.getUnix = function() {
  return (this.getTime() / 1000) | 0;
};

axios.defaults.baseURL = "http://116.203.186.158:8080";
useLocalStorage(global, "sup");
const val = localStorage.getItem("sup");
if (val) {
  const obj = JSON.parse(val);
  if (obj && obj.token) {
    global.setToken(obj.token);
  }
}

axios.interceptors.response.use(null, function(err) {
  if (err.response.status == 407) {
    global.setToken("");
  }
  return Promise.reject(err);
});

const app = new App({
  target: document.body
});

export default app;
