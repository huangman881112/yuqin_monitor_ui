<template>
  <el-form
    ref="passForm"
    :model="passForm"
    :rules="passRules"
    label-width="120px"
    class="container"
  >
    <el-form-item label="新的密码" prop="newPass">
      <el-input 
        type="password"
        v-model="passForm.newPass"
        placeholder="请输入新的密码"
      />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPass">
      <el-input 
        type="password"
        v-model="passForm.confirmPass"
        placeholder="请再次输入密码"
      />
    </el-form-item>
    <el-form-item>
      <!-- 提交前进行校验 -->
      <el-button @click="handleResetPassword('passForm')" type="primary" class="submit-btn"
        >重设密码</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { LoginRegisterService } from '@/utils/api'
  import { aesMinEncrypt } from '@/utils/commonutil'
  import aes from '@/utils/aes'

  export default {
    data() {
      return {
        passForm: {
          newPass: '',
          confirmPass: '',
        },
        passRules: {
          newPass: [  // ! 键名必须与 template 中的 prop 属性保持一致
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
          confirmPass: [  // ! 键名必须与 template 中的 prop 属性保持一致
            { 
              validator: this.validatePass2,
              trigger: 'blur' 
            }
          ]
        },
      }
    },
    methods: {
      validatePass2(rule, value, callback){
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.passForm.newPass) {
          callback(new Error('请输入相同的密码'))
        } else {
          callback()
        }
      },
      handleResetPassword(passForm){
        this.$refs[passForm].validate(valid => {
          if (valid) {
            const params = {
              telephone: this.$router.currentRoute.query.telephone,
              password: aesMinEncrypt(aes.key, aes.iv, this.passForm.newPass)
            }
            LoginRegisterService.updatePwd(params).then(res => {
              if(res.data.code===1){
                this.$message.success(res.data.msg)
                this.$router.push("/login")
              }else{
                this.$message.error(res.data.msg)
              }
              this.$refs[passForm].resetFields()
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
.submit-btn {
  width: 100%;
}
</style>