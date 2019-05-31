<script>
  import { global } from "./store.js";
  import { Router, Route } from "svelte-routing";
  import Login from "./components/Login.svelte";
  import ChatPage from "./pages/Chat.svelte";
  import SettingsPage from "./pages/Settings.svelte";

  export let url = "";
</script>

<Router {url}>
  <Route path="/">
    {#if $global.token}
      <ChatPage />
    {:else}
      <Login />
    {/if}
  </Route>
  <Route path="/settings" component={SettingsPage} />
</Router>
