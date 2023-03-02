<script>
  import Mainitem from "./Mainitem.svelte";
  import axios from "axios";
  import { serverhost, isLogincookie } from "../../Store";
  import { onMount } from "svelte";

  onMount(() => {
    isLogincookie();
  });
  $: size = 20;
  $: page = 0;
  $: api = serverhost + "/api/alttuel/list";
  $: data = axios({ method: "get", url: api, params: { size: size, page: page } });
</script>

{#await data}
  <div>Loding</div>
{:then data}
  {#each data.data as item}
    <div class="box">
      <div>
        <Mainitem {item} />
      </div>
    </div>
  {/each}
{/await}

<style>
  .box {
    display: flex;
    justify-content: center;
    padding: 0.4em;
  }
</style>
