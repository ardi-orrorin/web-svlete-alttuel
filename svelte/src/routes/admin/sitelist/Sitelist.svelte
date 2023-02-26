<script>
  import axios from "axios";
  import { serverhost } from "../../../Store";

  $: size = 1000;
  $: page = 0;
  $: api = serverhost + "/api/sitelist/list";
  $: data = axios({ method: "get", url: api, params: { size: size, page: page } });
</script>

{#await data}
  <div>Loding</div>
{:then data}
  <div class="box">
    <div class="w675px">
      <div class="text-right">
        <input type="button" value="N E W" />
      </div>
      <div>
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>chk</th>
              <th>id</th>
              <th>name</th>
              <th>domain</th>
              <th>boardpath</th>
              <th>createdate</th>
            </tr>
          </thead>
          <tbody>
            {#each data.data as item}
              <tr>
                <td><input type="checkbox" /></td>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.domain}</td>
                <td>{item.boardpath}</td>
                <td>createdate</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
{/await}

<style>
  .w675px {
    width: 800px;
  }
  .box {
    display: flex;
    justify-content: center;
    padding: 0.4em;
    /* border: 1px solid red; */
  }
  table {
    font-size: 0.5em;
  }
  .text-right {
    text-align: right;
    margin-bottom: 1em;
  }
  input[type="button"] {
    width: 5em;
    font-size: 0.7em;
    border-radius: 0;
    background-color: white;
    border: 0.2px solid rgba(0, 0, 0, 0.3);
    transition: 0.3s;
  }
  input[type="button"]:hover {
    background-color: rgba(0, 0, 0, 0.3);
    color: white;
  }
</style>
