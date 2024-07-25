<template>
  <div class="loginInfo">
    <span>您好！{{userName}}&emsp;</span>
    <el-button type="primary" @click="logout">登出</el-button>
  </div>
</template>

<script>
  import { LoginRegisterService } from '@/utils/api'
  import { getUser } from '@/utils/commonutil'
  export default {
    data() {
      return {
        userName: "",
      }
    },
    created() {
      let name = getUser().sub
      // console.log(name)
      this.userName = name === "" || typeof(name) === "undefined" ? "匿名用户" : name
    },
    methods: {    
      logout() {
        LoginRegisterService.logout().then(res => {
          if(res.data.code===1){
            // console.log(getUser())
            // console.log(this.$store.getters.getSearchHistory)
            localStorage.removeItem('msToken')
            this.$message.success(res.data.msg);
            this.$router.push('/login')
          }else{
            this.$message.error(res.data.msg)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
    },

  }
</script>
<style>
  .loginInfo {
    height: 100%;
    float: right;
    margin-top: 8px;
    margin-right: 240px;
    cursor: pointer;
    color: #28ccaa;
  }

</style>
