<script>
  export let name;
  export let link;
</script>

<div class="menuitem"><a href={link}>{name}</a></div>

<style>
  .menuitem {
    font-size: 0.9em;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 6em;
    max-width: 6em;
    height: 2.5em;
    border-right: 0.2px solid rgba(0, 0, 0, 0.1);
    border-left: 0.2px solid rgba(0, 0, 0, 0.1);

    transition: 0.3s;
  }
  .menuitem:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
  a {
    text-decoration: none;
    color: black;
    letter-spacing: 0.2em;
  }
</style>
