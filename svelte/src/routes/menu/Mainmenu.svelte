<script>
  import Mainmenuitem from "./Mainmenuitem.svelte";
  import { isLogincookie, logOut } from "../../Store";
  import { onMount } from "svelte";

  onMount(() => {
    isLogincookie();
  });
  const menulist = [
    { name: "MAIN", link: "#/" },
    { name: "TEST", link: "link" },
    { name: "TEST", link: "link" },
  ];
</script>

<div class="w650px">
  <div class="menu">
    {#each menulist as menu}
      <Mainmenuitem name={menu.name} link={menu.link} />
    {/each}
    {#if localStorage.getItem("login") === "true"}
      <Mainmenuitem name="ADMIN" link="#/admin" />
      <div
        on:click={() => {
          logOut();
          location.href = "/";
        }}
      >
        <Mainmenuitem name="LOGOUT" link="#/" />
      </div>
    {:else}
      <Mainmenuitem name="LOGIN" link="#/account/signin" />
    {/if}
    <div>
      <!-- <input type="button" value="loginswitch" on:click={() => loginswicth()} /> -->
    </div>
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
