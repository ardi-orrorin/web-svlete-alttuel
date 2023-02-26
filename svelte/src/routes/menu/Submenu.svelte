<script>
  import Submenuitem from "./Submenuitem.svelte";

  export let menulist;
</script>

<div class="w675px">
  <div class="menu">
    {#each menulist as menu}
      <Submenuitem name={menu.name} link={menu.link} />
    {/each}
  </div>
</div>

<style>
  .menu {
    display: flex;
    justify-content: center;
  }
  .w675px {
    width: 800px;

    border-bottom: 0.3px solid rgba(0, 0, 0, 0.3);
  }
</style>
