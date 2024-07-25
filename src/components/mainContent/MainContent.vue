<template>
  <div class="main-content ofh">
    <HSection></HSection>
    <div class="wrapper">
      <div class="pageContent">
            <slot></slot>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>
<script type="text/javascript">
  import HSection from './HeaderSection.vue'
  import Footer from './Footer.vue'

  export default{
    name: 'MainContent',
    components: {
      HSection,
      Footer
    }
  }
</script>
