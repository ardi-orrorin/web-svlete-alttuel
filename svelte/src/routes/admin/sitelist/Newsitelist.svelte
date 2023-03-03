<script>
  import axios from "axios";
  import { onMount } from "svelte";
  import { ismainmenu, issubmenu, serverhost, isLogincookie } from "../../../Store";

  const items = ["site", "domain", "path", "memo"];
  onMount(() => {
    $ismainmenu = false;
    $issubmenu = false;
    isLogincookie();
  });

  const newsite = async (e) => {
    let data = {
      id: 1,
      name: e.target.site.value,
      domain: e.target.domain.value,
      boardpath: e.target.path.value,
      createdate: new Date(),
      memo: e.target.memo.value,
    };

    let url = serverhost + "/api/sitelist/list/new";
    await axios({
      method: "post",
      url: url,
      data: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
  };
</script>

<div>
  <div class="m-4">
    <div class="mb-5">
      <h1 class="text-center">New Site</h1>
    </div>
    <form
      on:submit={(e) => {
        window.close();
        newsite(e);
      }}
    >
      {#each items as item}
        <div class="d-flex justify-content-center mb-3">
          <label class="inputlabel">{item.toUpperCase()}</label>
          <input id={item} type="text" />
        </div>
      {/each}
      <div class="d-flex justify-content-center mt-5">
        <button>Register</button>
        <!-- <input type="button" value="Register" /> -->
      </div>
    </form>
  </div>
</div>

<style>
  input[type="text"] {
    height: 2.3em;
    width: 20em;
    border: 0.3px solid rgba(0, 0, 0, 0.3);
    border-radius: 0;
    transition: 0.3s;
  }
  input[type="text"]:focus,
  input[type="text"]:hover {
    outline: 0px;
    background-color: rgba(0, 0, 0, 0.3);
    color: white;
  }
  .inputlabel {
    display: flex;
    min-width: 7em;
    min-height: 2.3em;
    border-top: 0.3px solid rgba(0, 0, 0, 0.3);
    border-left: 0.3px solid rgba(0, 0, 0, 0.3);
    border-bottom: 0.3px solid rgba(0, 0, 0, 0.3);
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.3);
    color: white;
    font-size: 0.8em;
    letter-spacing: 0.2em;
    border-radius: 0;
  }
  input[type="button"],
  button {
    background-color: white;
    min-width: 10em;

    transition: 0.3s;
  }
  input[type="button"]:hover,
  button:hover {
    background-color: rgba(0, 0, 0, 0.3);
    color: white;
  }
</style>
