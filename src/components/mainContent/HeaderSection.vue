<template>
  <div class="header-section maincontent-head">
    <CommonTab></CommonTab>
    <ULoginInfo></ULoginInfo>
  </div>
</template>
<script type="text/javascript">
  import ULoginInfo from './LoginInfo.vue'
  import CommonTab from './CommonTab.vue'

  export default{
    components: {
      ULoginInfo,
      CommonTab
    }
  }
</script>
<style scoped>
  .maincontent-head{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
