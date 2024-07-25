<template>
  <footer class="footer" v-once>
    Copyright &copy; {{getYear}} Nobug &emsp;
    <a href="https://gitee.com/NoBug_XXH/public_opinion_monitor" 
    target="_blank" 
    style="color: cornflowerblue;">Go gitee, please star or fork!</a>
  </footer>
</template>
<script type="text/javascript">
  export default {
    computed: {
      getYear(){
        return new Date().getFullYear()
      }
    }
  }
</script>
<style>
  .footer{
    text-align: center;
  }
</style>
