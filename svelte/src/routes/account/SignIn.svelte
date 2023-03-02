<script>
  import axios from "axios";
  import { onMount } from "svelte";
  import { serverhost, isLogincookie } from "../../Store";
  const items = ["id", "pwd1"];

  onMount(async () => {
    /* isLogincookie(); */
  });

  const login = async (e) => {
    let userid = e.target.id.value;
    let userpassword = e.target.pwd1.value;
    let url = serverhost + "/api/user/login";
    let data = await axios({
      method: "post",
      url: url,
      params: { userid: userid, userpassword: userpassword },
      withCredentials: true,
    });

    if (data.data) {
      localStorage.setItem("login", "true");
      location.href = "/";
    } else {
      alert("계정 및 비밀번호가 맞지 않습니다");
    }
  };
</script>

<div class="main">
  <div class="w800px">
    <form action="submit" on:submit|preventDefault={(e) => login(e)}>
      <div class="d-flex justify-content-center mb-5">
        <h1 class="letterspacing-03em">- SIGN UP -</h1>
      </div>
      {#each items as item}
        <div class="d-flex justify-content-center mb-3">
          <label class="inputlabel">{item.toUpperCase()}</label>
          <input id={item} type="text" />
        </div>
      {/each}
      <div class="d-flex justify-content-center mt-5">
        <button>SignUp</button>
      </div>
    </form>
  </div>
</div>

<style>
  .main {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50em;
  }
  .w800px {
    width: 800px;
  }

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

  .letterspacing-03em {
    letter-spacing: 0.3em;
  }
</style>
