<script>
  import Routes from "svelte-spa-router";
  import Admin from "./routes/admin/Admin.svelte";
  import Main from "./routes/main/Main.svelte";
  import Mainmenu from "./routes/menu/Mainmenu.svelte";
  import "bootstrap/dist/css/bootstrap.min.css";
  import { ismainmenu } from "./Store";

  const routes = {
    "/": Main,
    "/admin": Admin,
    "/admin/:": Admin,
    "/admin/sitelist/:": Admin,
  };
</script>

<div>
  {#if $ismainmenu}
    <div class="box menu">
      <Mainmenu />
    </div>
  {/if}
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
