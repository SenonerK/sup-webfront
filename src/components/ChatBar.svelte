<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let hint = "";
  let text = "";

  function onChange() {
    dispatch("change", text);
  }

  function onEnter() {
    dispatch("send", text);
    text = "";
  }
</script>

<style>
  div {
    width: 100%;
    height: 100%;
    display: flex;
    background-color: #fff;
  }

  input {
    width: 100%;
    height: 100%;
    padding: 1rem 0 1rem 1rem;
    border: none;
    color: #444;
    font-weight: 100;
  }

  i {
    padding: 0 2rem 0 0.6rem;
    color: #aaa;
    align-self: center;
    font-size: 1.4rem;
    cursor: pointer;
    transition: all 0.1s ease-in;
  }

  i:hover {
    color: #3498db;
  }
</style>

<div>
  <input
    autofocus
    type="text"
    placeholder={hint}
    on:input={onChange}
    on:change={onEnter}
    bind:value={text} />
  <i class="fa fa-paper-plane" on:click={onEnter} />
</div>
