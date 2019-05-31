<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let hint = "";
  let search = "";

  function onChange() {
    dispatch("change", search);
  }

  function onEnter() {
    dispatch("search", search);
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
    padding: 1rem 1rem 1rem 0;
    border: none;
    color: #444;
    font-weight: 100;
  }

  i {
    padding: 0 0.6rem 0 1rem;
    color: #aaa;
    align-self: center;
  }
</style>

<div>
  <i class="fa fa-search" />
  <input
    type="text"
    placeholder={hint}
    on:input={onChange}
    on:change={onEnter}
    bind:value={search} />
</div>
