<template>
  <div class="view-page">
    <LeftSlide></LeftSlide>
    <MainContent>
      <router-view></router-view>
    </MainContent>
  </div>
</template>
<script type="text/javascript">
  import MainContent from '@/components/mainContent/MainContent.vue'
  import LeftSlide from '@/components/leftSilde/LeftSlide.vue'
  
  export default{
    name: 'page',
    components: {
      MainContent,
      LeftSlide
    }
  }
</script>
<style>
  .view-page {
    height: 100%;
  }
</style>
