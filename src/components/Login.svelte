<script>
  import Loader from "./Loader.svelte";
  import { global } from "../store.js";
  import axios from "axios";

  let username = "";
  let password = "";
  let error = null;
  let loading = false;

  async function doLogin() {
    loading = true;
    error = null;
    try {
      let res = await axios.post("/auth/login", { username, password });
      const token = res.data.data.token;
      global.setToken(token);

      res = await axios.get("/profile/");
      const u = res.data.data;
      global.update(n => ({
        ...n,
        user: {
          firstname: u.firstname,
          lastname: u.lastname,
          status: u.status
        }
      }));
    } catch (e) {
      error =
        e.response && e.response.data
          ? e.response.data.message
          : "Unknown error";
    } finally {
      loading = false;
    }
  }
</script>

<style>
  main {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    max-width: 400px;
    min-width: 300px;
    box-shadow: 0 0 30px #ddd;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    padding: 2rem 3rem;
    border-radius: 10px;
  }

  img {
    width: 70px;
  }

  .box {
    margin-top: 0.8rem;
    text-align: center;
  }

  input {
    margin-top: 0.5rem;
    color: #555;
    width: 100%;
    border: 1px solid #eee;
    background-color: #eee;
    padding: 0.7rem 0.6rem;
    transition: all 0.1s ease-in;
    font-weight: 100;
  }

  input:focus {
    border: 1px solid var(--primary);
  }

  h1 {
    font-size: 1.5rem;
    font-weight: 100;
  }

  button {
    margin-top: 1.2rem;
    border: none;
    border-radius: 100%;
    width: 3rem;
    height: 3rem;
    background-color: #eee;
    color: var(--primary);
    transition: all 0.1s ease-in;
    cursor: pointer;
  }

  button:hover {
    background-color: var(--primary);
    color: #fff;
  }

  button:active {
    background-color: #aaa;
  }
</style>

<main>
  <img src="favicon.png" alt="Logo" class="logo" />
  <div class="box">
    <h1>Sign-In</h1>
    <form>
      <input
        autofocus
        type="text"
        name="user"
        bind:value={username}
        placeholder="Username" />
      <input
        on:keydown={e => (e.key == 'Enter' ? doLogin() : console.log())}
        type="password"
        name="pass"
        bind:value={password}
        placeholder="Password" />
    </form>

    {#if error}
      <p class="error">{error}</p>
    {/if}

    {#if loading}
      <Loader />
    {:else}
      <button on:click={doLogin}>
        <i class="fa fa-arrow-right" />
      </button>
    {/if}
  </div>
</main>
