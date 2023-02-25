<script>
  import Routes from "svelte-spa-router";
  import Main from "./routes/main/Main.svelte";
  const routes = {
    "/": Main,
  };
</script>

<Routes {routes} />

<style>
</style>
