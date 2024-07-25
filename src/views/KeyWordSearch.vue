<template>
  <div class="search-body" :style="bgstyle">
    <el-autocomplete
      class="demo-form-inline search-box"
      v-model="keyword"
      :fetch-suggestions="querySearch"
      placeholder=""
      @select="handleSelect"
      @keyup.enter.native="search"
    >
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-autocomplete>
  </div>
</template>

<script>
  import { getUser } from '@/utils/commonutil'
  export default {
    data(){
      return{
        keyword: '',
        innerHeight: window.innerHeight,
        timer: false,
        bgstyle:{
          height: Number(innerHeight)*0.92 +'px'
        },
        restaurants: JSON.parse(localStorage.getItem(getUser().jti)) || [],// 根据userId获取历史搜索记录
      }
    },
    created(){
      window.onresize = () => {
        this.innerHeight = window.innerHeight
      }
    },
    watch: {
      innerHeight: {
        immediate: true,
        handler: function(newVal){
          // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
          if (!this.timer) {
            this.innerHeight = newVal;
            this.timer = true;
            setTimeout(() => {
              //在这里做有关浏览器变化时需要做的操作
              this.bgstyle.height = Number(this.innerHeight)*0.92 +'px'
              this.timer = false;
            }, 500);
          }
        }
      }
    },
    methods: {
      querySearch(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect(item) {
        this.keyword = item.value.trim()
        this.search()
      },
      search(){
        if(this.keyword===""){
          this.$message.warning("请输入内容")
          return
        }
        //处理搜索历史记录
        let keywords = this.restaurants.map(item => item.value)
        let idx = keywords.indexOf(this.keyword)
        // console.log(idx)
        if(idx!=-1){
          this.restaurants.splice(idx,1)
        }
        this.restaurants.unshift({
          "value": this.keyword
        })
        this.restaurants.splice(10) //从下标为10的元素开始删除，仅保留十条历史记录
        //存储历史记录
        if(history.length>0){
          localStorage.setItem(getUser().jti, JSON.stringify(this.restaurants))
        }
        //存入vuex
        this.$store.commit('selectMenu', {
          title: this.keyword,
          name: 'searchanalysis',
          query: {
            searchWord: this.keyword
          },
        })
        //发起请求
        this.$router.push({
          name: 'searchanalysis',
          query: {
            searchWord: this.keyword
          }
        })
        
        this.keyword=""
      }
    },

  }
</script>

<style>
.search-box{
  width: 50%;
  margin-top: 10%;
  margin-left: 24%;
  height: 100px;
}
.search-body{
  background-image: url('@/assets/images/search_background.jpg');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
</style>