<script>
  import axios from "axios";
  import { serverhost, isLogin } from "../../Store";
  const items = ["id", "email", "pwd1", "pwd2"];

  const newaccount = async (e) => {
    let pwd1 = e.target.pwd1.value;
    let pwd2 = e.target.pwd2.value;
    if (pwd1 === pwd2) {
      let url = serverhost + "/api/user/new";
      let data = {
        id: 0,
        userid: e.target.id.value,
        userpassword: pwd1,
        useremail: e.target.email.value,
        authority: 9,
      };
      let res = await axios({
        method: "post",
        url: url,
        data: data,
        withCredentials: true,
      });
      console.log(res);
      isLogin.set(true);
      location.href = "#/";
    } else {
      alert("비밀번호가 일치 하지않습니다.");
      document.getElementById("pwd1").value = "";
      document.getElementById("pwd2").value = "";
    }
  };
</script>

<div class="main">
  <div class="w800px">
    <form action="submit" on:submit|preventDefault={(e) => newaccount(e)}>
      <div class="d-flex justify-content-center mb-5">
        <h1 class="letterspacing-03em">- SIGN UP -</h1>
      </div>
      {#each items as item}
        <div class="d-flex justify-content-center mb-3">
          <label class="inputlabel">{item.toUpperCase()}</label>
          <input id={item} type={item === "pwd1" || item === "pwd2" ? "password" : "text"} />
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

  input[type="text"],
  input[type="password"] {
    height: 2.3em;
    width: 20em;
    border: 0.3px solid rgba(0, 0, 0, 0.3);
    border-radius: 0;
    transition: 0.3s;
  }
  input[type="text"]:focus,
  input[type="text"]:hover,
  input[type="password"]:focus,
  input[type="password"]:hover {
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
