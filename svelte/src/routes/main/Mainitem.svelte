<script>
  export let item;
  import moment from "moment/min/moment-with-locales";
  moment.locale("ko");
  item.createdate[1] = item.createdate[1] - 1; //날짜 한달 차이  api서버 자바스크립 차이 교정
</script>

<table>
  <tr>
    <td class="thumnail"
      ><img referrerpolicy="no-referrer" src={item.boardthumnail} onerror="this.src='./images/notimg.png';" /></td
    >
    <td class="context">
      <div><span class="label"> {item.sitename} </span></div>
      <p />
      <div><a href={item.sitedomain + item.boarddetailpath}><span class="title">{item.boardtitle}</span></a></div>
      <p />
      <div>
        <span class="date">생성날자 : {moment(item.createdate).format("YYYY-MM-DD HH:mm:ss")}</span>
      </div>
    </td>
  </tr>
</table>

<style>
  table {
    display: table;
    border: 0.2px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 0 2px 2px rgba(120, 120, 120, 0.1);
    padding: 10px;
  }
  tr {
    display: flex;
    height: 150px;
  }
  .date {
    font-size: smaller;
  }
  a {
    text-decoration: none;
  }
  .title {
    color: black;
    font-size: medium;
  }

  .label {
    padding-left: 5px;
    padding-right: 5px;
    padding-top: 2px;
    padding-bottom: 2px;
    font-size: 10px;
    background-color: rgba(0, 0, 0, 0.4);
    color: white;
  }
  .thumnail {
    width: 150px;
  }
  .context {
    padding-left: 10px;
    width: 500px;
  }
  td {
    /* border: 0.2px solid rgba(0, 0, 0, 0.1); */
  }
  img {
    width: 150px;
    height: 150px;
    display: block;
    object-fit: cover;
  }
</style>
