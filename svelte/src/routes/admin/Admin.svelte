<script>
  import Sitelist from "./sitelist/Sitelist.svelte";
  import Routes from "svelte-spa-router";
  import Submenu from "../menu/Submenu.svelte";
  import Newsitelist from "./sitelist/Newsitelist.svelte";
  import { issubmenu, isLoginerr, isLogincookie } from "../../Store";
  import { onMount } from "svelte";

  onMount(() => {
    isLogincookie();
    isLoginerr();
  });

  const routes = {
    "/admin/sitelist": Sitelist,
    "/admin/sitelist/new": Newsitelist,

    "/admin": Sitelist,
  };

  const menulist = [
    { name: "SITELIST", link: "#/admin/sitelist" },
    { name: "SITELIST", link: "#/admin/sitelist" },
    { name: "SITELIST", link: "#/admin/sitelist" },
    { name: "SITELIST", link: "#/admin/sitelist" },
    { name: "SITELIST", link: "#/admin/sitelist" },
  ];
</script>

<div>
  {#if $issubmenu}
    <div class="menu">
      <Submenu {menulist} />
    </div>
  {/if}

  <div>
    <Routes {routes} />
  </div>
</div>

<style>
  .menu {
    display: flex;
    justify-content: center;
    margin-bottom: 1em;
  }
</style>
