<template>
  <div class="left-side">
    <div class="left-side-inner">
      <router-link to="/" class="logo block">
        <h2>舆论监测系统</h2>
      </router-link>
      <el-menu
        class="menu-box"
        router
        :default-active="$route.path">
        <MyMenu :menuList="nav_menu_data"></MyMenu>
      </el-menu>
    </div>
  </div>
</template>
<script type="text/javascript">
  import MyMenu from './MyMenu.vue'

  export default {
    name: 'slide',
    data() {
      return {
        nav_menu_data: [
          {
            title: "舆情概览",
            path: "/home",
            name: 'home',
            icon: "el-icon-star-off"
          },
          {
            title: "舆情监测",
            path: "/monitor",
            icon: "el-icon-news",
            child: [
              {
                title: "话题列表",
                path: "/consensus",
                name: 'consensus',
                icon: "el-icon-tickets",
              }, {
                title: "博文列表",
                path: "/article",
                name: 'article',
                icon: "el-icon-tickets",
              },
            ]
          },
          {
            title: "舆情分析",
            path: "/analysis",
            icon: "el-icon-search",
            child: [
              {
                title: "话题分析",
                path: "/consensus/detail",
                name: 'consensusDetail',
                icon: "el-icon-date",
              }, {
                title: "搜索分析",
                path: "/keyword",
                name: 'keyword',
                icon: "el-icon-tickets",
              }, 
            ]
          },
          {
            title: "预警任务",
            path: "/warning",
            name: 'warning',
            icon: "el-icon-message",
          }]
      }
    },
    components: {
      MyMenu
    }
  }
</script>

<style>
  h2 {
    color: #65cea7;
  }
</style>


