<template>
    <!-- model 在校验以及重置输入的时候必填 -->
    <el-form
      ref="loginForm" 
      :model="loginForm" 
      :rules="rules" 
      label-width="120px"
      class="loginForm sign-in-form"
      @submit.native.prevent
    >
      <el-form-item prop="telephone">
        <el-input 
          prefix-icon="el-icon-user"
          v-model="loginForm.telephone"
          placeholder="请输入手机号"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          prefix-icon="el-icon-unlock"
          v-model="loginForm.password"
          type="password"
          placeholder="请输入密码"
          autoComplete="on"
          show-password
          @keyup.enter.native="handleLogin('loginForm')"
        />
      </el-form-item>
      <el-form-item>
        <!-- 提交前进行校验 -->
        <el-button @click="handleLogin('loginForm')" type="primary" class="submit-btn"
          >登陆</el-button>
      </el-form-item>
      <el-form-item>
        <!-- 找回密码 -->
        <div class="tiparea">
          <p>忘记密码？ <el-button type="text" @click.prevent="handleForgot">立即找回</el-button></p>
        </div>
      </el-form-item> 
    </el-form>
  </template>
  
  <script>
    import { aesMinEncrypt, isTelephoneExists} from '@/utils/commonutil'
    import { LoginRegisterService } from '@/utils/api'
    import aes from '@/utils/aes'

    export default {
      name: 'LoginForm',
      data() {
        return {
          loginForm: {
            telephone: '',
            password: ''
          },
          rules: {
            telephone: [
              { 
                message: "手机号码不能为空",
                required: true,
                trigger: 'blur'  // 元素失去焦点的时候触发
              },
              {
                pattern: /^1[3|5|7|8|9]\d{9}$/, 
                message: '手机号码格式不正确', 
                trigger: 'blur'
              },
              { 
                validator: this.validateTelephone,
                trigger: 'blur'  // 元素失去焦点的时候触发
              }
            ],
            password: [
              { 
                message: '密码不能为空', 
                required: true,
                trigger: 'blur' 
              },
              {
                min: 6,
                max: 40,
                message: '密码长度范围必须在 6~40 字符内',
                trigger: 'blur'
              }
            ]
          },
        }
      },
      methods: {
        validateTelephone(rule, telephone, callback){
          setTimeout( async ()=>{
            if (!await isTelephoneExists(telephone)) {
                callback(new Error('该手机号尚未注册'));         
            } else {
                callback();
            }
          },1000)
        },
        handleLogin(loginForm){
          this.$refs[loginForm].validate((valid) => {
            if (valid) {
              const loginParams = {
                account: this.loginForm.telephone,
                password: aesMinEncrypt(aes.key, aes.iv, this.loginForm.password)
              }
              LoginRegisterService.login(loginParams).then(res => {
                if(res.data.code===101){
                  // 登陆成功，存储 token 到 LS 中
                  const token = res.data.data
                  localStorage.setItem('msToken', token)        
                  // 路由跳转
                  this.$message.success(res.data.msg);
                  this.$refs[loginForm].resetFields()
                  this.$router.push('/home')
                }else{
                  this.loginForm.password = ""
                  this.$message.error(res.data.msg);
                }
              }).catch(err => {
                this.$message.error(err);
              })
            } else {
              this.$message.error("表单校验未通过，请修改补充")
              return false
            }
          })
        },
        handleForgot(){
          // 跳转路由
          this.$router.push('/forgotpassword')
        }
      }
    }
  </script>
  
  <style scoped>
    /* form */
    .loginForm {
      margin-top: 20px;
      background-color: #fff;
      padding: 20px 40px 20px 20px;
      border-radius: 5px;
      box-shadow: 0px 5px 10px #cccc;
    }
    .submit-btn {
      width: 100%;
    }
    .tiparea {
      text-align: right;
      font-size: 12px;
      color: #333;
    }
    .tiparea p el-button {
      background-color: #fff;
      border: inherit;
      cursor: pointer;
    }
  </style>