<script>
  import Mainmenuitem from "./Mainmenuitem.svelte";

  const menulist = [
    { name: "MAIN", link: "#/" },
    { name: "TEST", link: "link" },
    { name: "TEST", link: "link" },
    { name: "ADMIN", link: "#/admin" },
  ];
</script>

<div class="w650px">
  <div class="menu">
    {#each menulist as menu}
      <Mainmenuitem name={menu.name} link={menu.link} />
    {/each}
  </div>
</div>

<style>
  .menu {
    display: flex;
    justify-content: center;
  }
  .w650px {
    width: 650px;
    padding: 0.4em;
    box-shadow: 0 0 3px 3px rgba(125, 125, 125, 0.1);
  }
</style>
