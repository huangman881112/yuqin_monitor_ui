<template>
  <div>
    <template v-for="list in this.menuList" >
      <el-submenu
        v-if="list.child != undefined"
        :key="list.path"
        :index="list.path"
      >
        <template slot="title">
          <i :class="list.icon"></i>
          <span v-text="list.title" class="text"></span>
        </template>
        <MyMenu :menuList="list.child"></MyMenu>
      </el-submenu>
      <el-menu-item
        v-else
        :index="list.path"
        :key="list.path+''"
        class="menu-list"
        @click="clickMenu(list)">
        <i :class="list.icon"></i>
        <span v-text="list.title" class="text"></span>
      </el-menu-item>
    </template>
  </div>
</template>
<script type="text/javascript">
  export default {
    name: 'MyMenu',
    props:['menuList'],
    data() {
      return {
      }
    },
    methods: {
      //跳转路由 根据名称跳转
      clickMenu(item) {
        this.$store.commit('selectMenu', item)
        this.$router.push({ 
          path: item.path,
          query: item.query
        })
      }
    }
  }
</script>

<style>
</style>


