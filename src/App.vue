<template>
  <div id="app">
    <section class="body-wrap">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </section>
  </div>
  
</template>
<script type="text/javascript">
  import {getUser} from '@/utils/commonutil'
  export default {
    name: 'app',
    created(){
      let user = getUser()
      if(user!=null){
        let history = JSON.parse(localStorage.getItem(getUser().jti))
        if(history!=null){
          this.$store.commit('setSearchHistory', history)
        }
      }
    }
  }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">
  @import './assets/scss/main.scss';

  .fade-enter-active,
  .fade-leave-active {
    transition: all .2s ease;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }
  .body-wrap {
    height: 100%;
  }

  #app{
    position:absolute;
    top:0;
    right:0;
    bottom:0;
    left:0;
  }
</style>
