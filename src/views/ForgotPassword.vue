<template>
  <el-form
    ref="forgotpwdForm" 
    :model="validateForm" 
    :rules="validaterules" 
    label-width="120px"
    class="container"
  >
    <el-form-item label="账号" prop="telephone">
      <el-input 
        v-model="validateForm.telephone"
        placeholder="输入手机号"
      />
    </el-form-item>
    <el-form-item label="验证码" prop="captcha">
      <el-input
        v-model="validateForm.captcha"
        placeholder="输入验证码"
      />
      
    </el-form-item>
    <el-form-item>
      <el-button @click="sendCaptcha('forgotpwdForm')" type="primary" :disabled="getCodeBtnDisable" class="btn">{{buttonText}}</el-button>
      <!-- 提交前进行校验 -->
      <el-button @click="handleForgotPassword('forgotpwdForm')" type="primary" class="btn btn_success"
        >确定</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { LoginRegisterService } from '@/utils/api'
  import { isTelephoneExists } from '@/utils/commonutil'

  export default {
    data() {
      return {
        validateForm: {
          telephone: '',
          captcha: '',
        },
        validaterules: {
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
          if (!await isTelephoneExists(telephone)) {
              callback(new Error('该手机号尚未注册'));         
          } else {
              callback();
          }
        },1000)
      },
      sendCaptcha(forgotpwdForm){
        this.$refs[forgotpwdForm].validateField("telephone",error => {
          if(!error){
            const params = {
              "telephone": this.validateForm.telephone
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
                      clearInterval(this.timer)
                      this.buttonText = '获取验证码'
                      this.getCodeBtnDisable = false
                      this.waitTime = 60
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
      handleForgotPassword(forgotpwdForm){
        this.$refs[forgotpwdForm].validate(valid => {
          if (valid) {
            const params = {
              "telephone": this.validateForm.telephone,
              "captcha": this.validateForm.captcha
            }
            LoginRegisterService.verifyCaptcha(params).then((res)=>{
              if(res.data.code===1){
                this.$message.success(res.data.msg);
                clearInterval(this.timer)
                this.$router.push({
                  path:'/resetpassword',
                  query:{telephone: this.validateForm.telephone}
                })
                this.$refs[forgotpwdForm].resetFields()
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
      }
    }
  }
</script>

<style scoped>
.container {
  width: 50%;
  margin: 200px auto;
}
.btn {
  width: 45%;
}
.btn_success{
  margin-left: 10%;
}
</style>