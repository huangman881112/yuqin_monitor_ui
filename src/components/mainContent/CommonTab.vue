<template>
  <div class="tabs">
    <!--closable这里说明home是不能关闭的-->
    <el-tag
      :key="tag.name"
      :color="$route.name === tag.name ? '#65cea7' : ''"
      v-for="(tag, index) in tags"
      :closable="tag.name !== 'home'"
      :disable-transitions="false"
      @close="handleClose(tag, index)"
      @click="changeMenu(tag)"
      :effect="$route.name === tag.name ? 'dark' : 'plain'"
      class="tab-eltag"
    >
      {{ tag.title }}
    </el-tag>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  computed: {
      //获取vuex的标签集合数据
    ...mapState({
      tags: state => state.tabsList
    })
  },
  methods: {
    ...mapMutations({
      close: 'closeTab'
    }),
    //关闭标签
    handleClose(tag, index) {
      let length = this.tags.length - 1
      //vuex调方法的另一种写法
      this.close(tag)
      // 如果关闭的标签不是当前路由的话，就不跳转
      if (tag.name !== this.$route.name) {
        return
      }
      // 关闭的标签是最右边的话，往左边跳转一个
      if (index === length) {
        this.$router.push({ 
          name: this.tags[index - 1].name,
          query: this.tags[index - 1].query
        })
      } else {
        // 否则往右边跳转
        this.$router.push({
          name: this.tags[index].name,
          query: this.tags[index].query
        })
      }
    },

    //选择标签跳转路由
    changeMenu(item) {
      // console.log(this.$route)
      this.$router.push({ 
        name: item.name,
        query: item.query
      })
      this.$store.commit('selectMenu', item)
    }
  }
}
</script>
<style scoped>
  .tab-eltag{
    margin-left: 8px;
    color: #fff;
    font-size: 15px
  }
</style>