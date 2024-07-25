<template>
    <el-form
      ref="registerForm" 
      :model="registerForm" 
      :rules="registerRules" 
      label-width="120px"
      class="registerForm sign-up-form"
    >
    <el-form-item label="账号" prop="telephone">
      <el-input 
        v-model="registerForm.telephone"
        placeholder="输入手机号"
      />
    </el-form-item>
    <el-form-item label="登录密码" prop="password">
      <el-input
        v-model="registerForm.password"
        type="password"
        placeholder="输入登录密码"
        show-password
      />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input
        v-model="registerForm.email"
        placeholder="输入邮箱"
      />
    </el-form-item>
    <el-form-item label="用户名" prop="username">
      <el-input
        v-model="registerForm.username"
        placeholder="输入用户名"
      />
    </el-form-item>
    <el-form-item label="验证码" prop="captcha">
      <el-input
        v-model="registerForm.captcha"
        placeholder="输入验证码"
      />
    </el-form-item>
    <el-form-item>
      <el-button @click="sendCaptcha('registerForm')" type="primary" :disabled="getCodeBtnDisable" class="btn">{{buttonText}}</el-button>
      <!-- 提交前进行校验 -->
      <el-button @click="handleRegister('registerForm')" type="primary" class="btn btn_success"
        >注册</el-button>
    </el-form-item>
  </el-form>
  </template>
  
  <script>
    import { aesMinEncrypt, isTelephoneExists } from '@/utils/commonutil'
    import aes from '@/utils/aes'
    import { LoginRegisterService } from '@/utils/api'

    export default {
      name: 'RegisterForm',
      data(){
        return {
          registerForm: {
            telephone: '',
            password: '',
            username: '',
            email: '',
            captcha: '',
          },
          registerRules: {
            telephone: [
              { 
                message: "手机号码不能为空",
                required: true,
                trigger: 'blur'  // 元素失去焦点的时候触发
              },
              {
                pattern: /^1[3|5|7|8|9]\d{9}$/, 
                message: '手机号码格式有误', 
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
            ],
            username: [
              {
                min: 0,
                max: 50,
                message: '用户名必须在 50 字符内',
                trigger: 'blur'
              }
            ],
            email: [
              { 
                message: "邮箱不能为空",
                required: true,
                trigger: 'blur'  // 元素失去焦点的时候触发
              },
              { 
                type: "email",
                message: "邮箱格式有误",
                trigger: 'blur'  // 元素失去焦点的时候触发
              }
            ],
            captcha: [
              { 
                message: '验证码不能为空', 
                required: true,
                trigger: 'blur' 
              },
              {
                min: 6,
                max: 6,
                message: '请输入6位验证码',
                trigger: 'blur'
              }
            ],
          },
          buttonText: "获取验证码",
          getCodeBtnDisable: false,
          waitTime: 60, 
          timer: null
        }
      },
      methods: {
        validateTelephone(rule, telephone, callback){
          setTimeout(async ()=>{
            if (await isTelephoneExists(telephone)) {
                callback(new Error('该手机号已注册'));              
            } else {
                callback();
            }
          },1000)
        },
        resetCaptchaFiled(){
          clearInterval(this.timer)
          this.buttonText = '获取验证码'
          this.getCodeBtnDisable = false
          this.waitTime = 60
        },
        sendCaptcha(registerForm){
          this.$refs[registerForm].validateField("telephone",error => {
            if(!error){
              const params = {
                "telephone": this.registerForm.telephone
              }
              LoginRegisterService.getCaptcha(params).then((res)=>{
                if(res.data.code===1){
                  this.$message.success(res.data.msg)
                  this.waitTime--
                  this.getCodeBtnDisable = true
                  this.buttonText = this.waitTime +"s 后重新发送..."
                  this.timer = setInterval( ()=> {
                      if (this.waitTime > 1) {
                        console.log("~~~~~~~~~~~~~~~~~~")
                        this.waitTime--
                        this.buttonText = this.waitTime + "s 后重新发送..."
                      } else {
                        this.resetCaptchaFiled()
                      }
                    }, 1000)
                }else{
                  this.$message.error(res.data.msg)
                }
              }).catch((err)=>{
                this.$message.error(err)
              })
            }else{
              this.$message.error("请先输入正确的手机号码")
            }
          })
        },
        handleRegister(registerForm){
          this.$refs[registerForm].validate((valid) => {
            if (valid) {
              // 1、校验验证码
              const captchaParams = {
                "telephone": this.registerForm.telephone,
                "captcha": this.registerForm.captcha
              }
              LoginRegisterService.verifyCaptcha(captchaParams).then((res)=>{
                if(res.data.code===1){
                  this.$message.success(res.data.msg);
                  this.resetCaptchaFiled()
                  // 2、注册账号
                  const params = {
                    telephone: this.registerForm.telephone,
                    password: aesMinEncrypt(aes.key, aes.iv, this.registerForm.password),
                    username: this.registerForm.username,
                    email: this.registerForm.email
                  }
                  LoginRegisterService.register(params).then((res) => {
                    if(res.data.code===1){
                      this.$message.success(res.data.msg)
                      this.$refs[registerForm].resetFields()
                      this.$emit("switchView");
                    }else{
                      this.$message.error(res.data.msg)
                    }
                  }).catch(err => {
                    this.$message.error(err)
                  })
                }else{
                  this.$message.error(res.data.msg)
                }
              }).catch(err => {
                this.$message.error(err)
              })
              
            } else {
              this.$message.error("表单校验未通过，请修改补充")
              return false
            }
          })
        },

      }
    }
  </script>
  
  <style scoped>
  .btn {
    width: 45%;
  }
  .btn_success{
    margin-left: 10%;
  }
  </style>