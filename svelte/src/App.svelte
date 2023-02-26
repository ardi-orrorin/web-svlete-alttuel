<script>
  import Routes from "svelte-spa-router";
  import Admin from "./routes/admin/Admin.svelte";
  import Main from "./routes/main/Main.svelte";
  import Mainmenu from "./routes/menu/Mainmenu.svelte";
  import Sitelist from "./routes/admin/sitelist/Sitelist.svelte";
  import "bootstrap/dist/css/bootstrap.min.css";

  const routes = {
    "/": Main,
    "/admin": Admin,
    "/admin/:": Admin,
  };
</script>

<div>
  <div class="box menu">
    <Mainmenu />
  </div>
  <div>
    <Routes {routes} />
  </div>
</div>

<style>
  .box {
    display: flex;
    justify-content: center;
    padding: 0.4em;
  }
  .menu {
    margin-bottom: 2em;
  }
</style>
