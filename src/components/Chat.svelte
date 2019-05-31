<script>
  export let selected = false;
  export let name = "";
  export let lastmsg = "";
  export let unread = 0;
</script>

<style>
  .chat {
    width: 100%;
    background-color: #fff;
    display: grid;
    grid-template-columns: auto 30px;
    grid-template-rows: auto auto;
    padding: 0.6rem 1.3rem;
    cursor: pointer;
    border-bottom: 1px solid #ddd;
  }

  .chat:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }

  h3 {
    grid-row: 1;
    grid-column: 1;
    font-weight: 300;
    align-self: flex-end;
  }

  p {
    grid-row: 2;
    grid-column: 1;
    font-size: 0.7rem;
    font-weight: 100;
    overflow: hidden;
  }

  .active {
    background-color: #eee;
  }

  .active:hover {
    background-color: #eee;
  }

  .badge {
    grid-row-start: 1;
    grid-row-end: 3;
    grid-column: 2;
    width: 25px;
    height: 25px;
    line-height: 25px;
    background-color: #2ecc71;
    color: #fff;
    border-radius: 50%;
    text-align: center;
    font-size: 0.8rem;
    align-self: center;
  }
</style>

<div class="chat" on:click class:active={selected}>
  <h3>{name}</h3>
  <p>{lastmsg}</p>
  {#if unread > 0}
    <span class="badge">{unread}</span>
  {/if}
</div>
