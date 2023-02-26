<script>
  export let name;
  export let link;
</script>

<div class="menuitem"><a href={link}>{name}</a></div>

<style>
  .menuitem {
    font-size: 0.75em;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 6em;
    max-width: 6em;
    height: 2.5em;
    border-right: 0.2px solid rgba(0, 0, 0, 0.3);
    border-left: 0.2px solid rgba(0, 0, 0, 0.3);
    border-top: 0.2px solid rgba(0, 0, 0, 0.3);
    margin-left: 0.3em;
    margin-right: 0.3em;
    transition: 0.3s;
  }
  .menuitem:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
  a {
    text-decoration: none;
    color: black;
  }
  a:hover {
    color: black;
  }
</style>
