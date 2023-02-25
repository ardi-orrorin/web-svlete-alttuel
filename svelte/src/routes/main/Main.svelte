<script>
  import Mainitem from "./Mainitem.svelte";
  import axios from "axios";
  import { serverhost } from "../../Store";

  $: size = 1000;
  $: page = 0;
  $: api = serverhost + "/api/alttuel/list";
  $: data = axios({ method: "get", url: api, params: { size: size, page: page } });
</script>

{#await data}
  <div>Loding</div>
{:then data}
  {#each data.data as item}
    <div class="box">
      <Mainitem {item} />
    </div>
  {/each}
{/await}

<style>
  .header {
    height: 100px;
  }
  .box {
    display: flex;
    justify-content: center;
    padding: 0.4em;
  }
</style>
