<script>
  import SearchBar from "../components/SearchBar.svelte";
  import ChatBar from "../components/ChatBar.svelte";
  import Chat from "../components/Chat.svelte";
  import Loader from "../components/Loader.svelte";

  import { global } from "../store.js";

  import axios from "axios";

  let search = null;

  let chats = GetChats();
  let chat = 0;

  let messages = GetMessages();

  let chatbox;

  SyncUnread();

  async function SyncUnread() {
    (await chats).forEach(async e => {
      try {
        const res = await axios.get(
          "/chat/?amount=100&skip=0&from=" +
            new Date().getUnix() +
            "&user=" +
            e.id
        );
        const d = res.data.data;
        if (d && d.length > 0) {
          const idx = (await chats).findIndex(item => {
            return item.id == e.id;
          });
          (await chats)[idx].unread = 0;
          d.forEach(async a => {
            if (a.FromID == "ME") return;
            if (!a.ReceivedAt) {
              try {
                await axios.put("/chat/receive", {
                  chatid: a.Id,
                  time: new Date().toISOString()
                });
              } catch (ex) {}
            }

            if (!a.ReadAt) {
              (await chats)[idx].unread += 1;
              chats = chats;
            }
          });
          chats = chats;
        }
      } catch (ex) {
        console.log(ex);
      }
    });
  }

  setInterval(async () => {
    try {
      const res = await axios.get("/chat/new");
      const d = res.data.data;
      if (d) {
        messages = GetMessages();
        // d.forEach(async e => {
        //   if ((await chats)[chat].id == e.UserID) {
        //     // messages=GetMessages()
        //   } else {
        //     (await chats).forEach(async c => {
        //       if (c.id == e.UserID) {
        //         c.unread = c.unread + e.count;
        //         chats = chats;
        //       }
        //     });
        //   }
        // });
      }
    } catch (e) {
      console.log(e);
    }
  }, 4000);

  async function Readem(msgs) {
    msgs.forEach(e => {
      if (e.FromID == "ME") return;
      try {
        if (!e.ReadAt) {
          axios.put("/chat/read", {
            chatid: e.Id,
            time: new Date().toISOString()
          });
        }
      } catch (ex) {}
    });
    SyncUnread();
  }

  async function GetMessages() {
    try {
      await chats;
      const res = await axios.get(
        "/chat/?amount=60&skip=0&from=" +
          new Date().getUnix() +
          "&user=" +
          (await chats)[chat].id
      );
      const d = res.data.data;
      if (d && d.length > 0) {
        Readem(d);
        return d;
      }
      SyncUnread();
      return [];
    } catch (ex) {
      console.log(ex);
      throw Error("Couldn't get your messages");
    }
  }

  async function GetChats() {
    try {
      const res = await axios.get("/relationship/");
      const d = res.data.data;
      if (d) {
        // chat = d[0];
      } else return [];
      return d;
    } catch (ex) {
      throw Error("Error loading chats");
    }
  }

  async function sendMsg(event) {
    if (event.detail == "") return;
    const m = event.detail;
    try {
      const res = await axios.post("/chat/", {
        to: (await chats)[chat].id,
        message: m
      });
      messages = [
        {
          Message: m,
          FromID: "ME"
        },
        ...(await messages)
      ];
    } catch (ex) {
      console.log(JSON.parse(JSON.stringify(ex)));
    }
  }

  async function SearchUser(user) {
    try {
      const res = await axios.get("/search/?query=" + user);
      if (res.data.data) {
        return res.data.data;
      } else {
        throw Error("No one found 😭");
      }
    } catch (ex) {
      throw Error(ex.message);
    }
  }

  function SearchUserChange(event) {
    if (event.detail == "") {
      search = null;
    }
  }

  async function addFriend(id) {
    try {
      const res = await axios.post("/relationship/", { userid: id });
      search = null;
      chats = GetChats();
    } catch (e) {
      console.log(e);
    }
  }
</script>

<style>
  .grid {
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-columns: 25% auto;
    grid-template-rows: 70px auto 80px;
  }

  .user-search {
    grid-column: 1;
    grid-row: 1;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
  }

  .chats {
    grid-column: 1;
    grid-row-start: 2;
    grid-row-end: 4;
    background-color: #fff;
    border-right: 1px solid #ddd;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .chats .error {
    color: #e74c3c;
    text-align: center;
    padding: 1rem;
  }

  .chats .result {
    padding: 1rem 0.7rem;
    border-bottom: 1px solid #ddd;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .follow {
    background: none;
    color: #3498db;
    padding: 6px 15px;
    border-radius: 20px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    z-index: 100;
    transition: 0.1s;
    border: 1px solid #3498db;
    margin: 0;
  }

  .follow.done {
    color: #2ecc71;
    border-color: #2ecc71;
  }

  .follow.done::before {
    background: #2ecc71;
  }

  .follow::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 0%;
    background: #3498db;
    z-index: -1;
    transition: 0.2s;
  }

  .follow:hover {
    color: #fff;
    border: 1px solid #fff;
  }

  .follow:hover::before {
    height: 100%;
  }

  .chats .result:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }

  .loading {
    text-align: center;
  }

  .chatter {
    grid-column: 2;
    grid-row: 1;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    border-bottom: 1px solid #ddd;
    user-select: none;
    -webkit-user-select: none;
  }

  .chatter h1 {
    font-family: Bahnschrift;
    color: #444;
    font-weight: 100;
  }

  .chatter i {
    font-size: 1.6rem;
    cursor: pointer;
    color: var(--primary);
    transition: all 0.4s ease-in-out;
  }

  .chatter i:hover {
    color: var(--ternary);
  }

  .input {
    grid-column: 2;
    grid-row: 3;
    background-color: #e4e4e4;
  }

  .chatbox {
    grid-column: 2;
    grid-row: 2;
    display: flex;
    flex-direction: column-reverse;
    overflow-y: auto;
    margin-bottom: 10px;
  }

  .msg {
    display: inline-block;
    background-color: var(--primary);
    border-radius: 15px;
    padding: 0.4rem 1rem;
    color: #fff;
    max-width: 70%;
    min-width: 40px;
    margin: 0.3rem 1rem;
    align-self: flex-start;
    border-bottom-left-radius: 0;
  }

  .msg.me {
    align-self: flex-end;
    /* background-color: var(--secondary); */
    background-color: #3498db;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 0;
  }
</style>

<div class="grid">
  <div class="user-search">
    <SearchBar
      hint="Search user"
      on:change={SearchUserChange}
      on:search={e => e.detail != '' && (search = SearchUser(e.detail))} />
  </div>
  <div class="chats">
    {#if search}
      {#await search}
        <div class="loading">
          <Loader />
        </div>
      {:then res}
        {#each res as s}
          <div class="result">
            <span>{s.name}</span>
            <button class="follow" on:click={() => addFriend(s.userID)}>
              <i class="fas fa-plus" />
            </button>
          </div>
        {/each}
      {:catch e}
        <div class="error">{e.message}</div>
      {/await}
    {:else}
      {#await chats}
        <div class="loading">
          <Loader />
        </div>
      {:then cs}
        {#each cs as d, i}
          <Chat
            on:click={() => {
              chat = i;
              messages = GetMessages();
            }}
            name={d.name}
            unread={d.unread}
            selected={i == chat} />
        {:else}
          <div class="error">You have no friends 😫</div>
        {/each}
      {:catch err}
        <div class="error">🤬 {err.message}</div>
      {/await}
    {/if}
  </div>
  <div class="chatter">
    <h1>
      {#await chats}{:then c}{c[chat] && c[chat].name}{:catch}{/await}
    </h1>
    <i class="fa fa-sign-out-alt" on:click={() => global.setToken('')} />
  </div>
  <div class="chatbox" bind:this={chatbox}>
    {#await messages}
      <div class="loading">
        <Loader />
      </div>
    {:then msgs}
      {#each msgs as m}
        <div class="msg" class:me={m.FromID == 'ME'}>{m.Message}</div>
      {/each}
    {:catch err}
      <div class="error">🤬 {err.message}</div>
    {/await}
  </div>
  {#await chats}

  {:then c}
    {#if c[chat]}
      <div class="input">
        <ChatBar hint="Type a message" on:send={sendMsg} />
      </div>
    {/if}
  {:catch}

  {/await}
</div>
