<script>
  import Sitelist from "./sitelist/Sitelist.svelte";
  import Routes from "svelte-spa-router";
  import Submenu from "../menu/Submenu.svelte";

  const routes = {
    "/admin/sitelist": Sitelist,
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
  <div class="menu">
    <Submenu {menulist} />
  </div>
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
