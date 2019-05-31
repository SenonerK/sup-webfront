import { writable } from "svelte/store";
import axios from "axios";

function CreateGlobal() {
  const { subscribe, set, update } = writable({
    token: "",
    user: {
      firstname: "",
      lastname: "",
      status: ""
    }
  });

  return {
    set,
    update,
    subscribe,
    setToken: token => {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      update(n => ({ ...n, token }));
    }
  };
}

export const global = CreateGlobal();
