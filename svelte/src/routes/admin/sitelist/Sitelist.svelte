<script>
  import axios from "axios";
  import moment from "moment/min/moment-with-locales";
  import { serverhost } from "../../../Store";

  moment.locale("ko");
  let size = 100;
  let page = 0;
  $: data = axios({
    method: "get",
    url: serverhost + "/api/sitelist/list",
    params: { size: size, page: page },
  }).then((res) => res.data);

  const newitem = () => {
    const windowWidth = 500;
    const windowHeight = 500;
    window.open(
      "/#/admin/sitelist/new",
      "newsite",
      "width=" +
        windowWidth +
        ",height=" +
        windowHeight +
        ",top=" +
        (screen.availHeight - windowHeight) / 2 +
        ",left=" +
        (screen.availWidth - windowWidth) / 2
    );
  };
</script>

{#await data then data}
  <div class="box">
    <div class="w675px">
      <div class="text-right">
        <input type="button" value="N E W" on:click={() => newitem()} />
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
            {#each data as item}
              <tr>
                <td><input type="checkbox" /></td>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.domain}</td>
                <td>{item.boardpath}</td>
                <td>{item.createdate ? moment(item.createdate).format("YYYY-MM-DD HH:mm:ss") : "createdate"}</td>
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
