<template>
  <div class="panel">
    <div class="panel-body">
      <el-form 
        :model="formData"
        ref="taskForm"
        label-width="100px"
        class="demo-ruleForm"
        :rules="warningRules">
        <el-form-item 
          label="任务名称"
          prop="taskName">
          <el-input
            v-model="formData.taskName"
            label-width="100px"
            class="inputClass"
            placeholder="请输入内容"
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="任务描述"
          prop="description"
        >
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model="formData.description"
            label-width="100px"
            class="inputClass"
          >
          </el-input>
        </el-form-item>
        <el-form-item 
          label="关键词"
          prop="keyword">
          <el-input
            v-model="formData.keyword"
            label-width="100px"
            class="inputClass"
            placeholder="多个关键词使用'|','&'分隔"
          >
          </el-input>
        </el-form-item>
        <el-form-item 
          label="屏蔽词"
          prop="ignoreword">
          <el-input
            v-model="formData.ignoreword"
            label-width="100px"
            class="inputClass"
            placeholder="多个屏蔽词使用'|','&'分隔"
          >
          </el-input>
        </el-form-item>
        <el-form-item 
          label="位置"
          prop="location">
          <el-input
            v-model="formData.location"
            label-width="100px"
            class="inputClass"
            placeholder="多个位置使用'|'分隔"
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="情感倾向"
          prop="sentiment"
        >
          <el-radio-group v-model="formData.sentiment">
            <el-radio-button label="-1">负面</el-radio-button>
            <el-radio-button label="0">中性</el-radio-button>
            <el-radio-button label="1">正面</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="预警频次"
          prop="frequency"
          :rules="{required: true, message: '请选择预警频次', trigger: 'blur'}"
          class="formItem"
        >
          <el-select
            v-model="formData.frequency"
            placeholder="请选择"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="预警门槛"
          prop="hotIndex"
        >
          <el-input-number
            v-model="formData.hotIndex"
            style="width: 260px"
            :step=100
            :min="0">
          </el-input-number>
        </el-form-item>
        <div v-for="(email,index) in formData.emails" :key="index">
          <el-form-item :label="'预警邮箱'+(index+1)"
                        :key="email.key"
                        :prop="'emails.' + index + '.email'"
                        :rules="[
                        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
                        ]"
          >
            <el-input v-model="email.email" class="inputClass" placeholder="请输入邮箱"></el-input>
            <el-button type="success" icon="el-icon-plus" circle size="mini" @click="addEmail()"></el-button>
            <el-button type="danger" icon="el-icon-minus" circle size="mini" v-if="formData.emails.length>1"
                       @click="removeEmail(index)"></el-button>
          </el-form-item>
        </div>
        <el-form-item 
          label="是否自动运行"
          prop="autoRun" 
          :rules="{required: true, message: '请选择', trigger: 'blur'}">
          <template>
            <el-radio v-model="formData.autoRun" :label="1">是</el-radio>
            <el-radio v-model="formData.autoRun" :label="0">否</el-radio>
          </template>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="validateFrom('taskForm')">保存</el-button>
          <el-button @click="cancelTask()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>

</template>
<script>
  // import {userUtil} from 'common/tools'
  import { WarningTaskService } from "@/utils/api"
  import { getUser } from "@/utils/commonutil"

  export default {
    name: "WarningForm",
    props: {
      taskData: {
        type: Object,
        default: ()=>{
          return {}
        }
      }
    },
    data() {
      return {
        formData: {
          taskId: null,
          taskName: null,
          description: null,
          keyword: null,
          ignoreword: null,
          location: null,
          sentiment: -1,
          frequency: null,
          hotIndex: 100,
          autoRun: 0,
          emails: [{key: '', email: ''}],
        },
        typeOptions: [{
          value: 1,
          label: '1次/1分钟'
        }, {
          value: 5,
          label: '1次/5分钟'
        }, {
          value: 30,
          label: '1次/30分钟'
        }, {
          value: 60,
          label: '1次/1小时'
        }, {
          value: 720,
          label: '1次/12小时'
        }, {
          value: 1440,
          label: '1次/24小时'
        }],
        warningRules: {
          taskName: {required: true, message: '请输入任务名称', trigger: 'blur'},
          description: {required: true, message: '请输入任务描述', trigger: 'blur'},
          sentiment: {required: true, message: '请选择情感倾向', trigger: 'blur'},
          hotIndex: [{required: true, message: '预警门槛不能为空'},
            {type: 'number', message: '预警门槛必须为数字值'}],
          keyword: [{required: true, message: '请输入关键词', trigger: 'blur'},
            {pattern: /^[\u4e00-\u9fa5A-Za-z0-9|&]+$/, message: '含有非法字符', trigger: 'blur'},
            {validator: this.validatePattern, trigger: 'blur' }],
          ignoreword:[{pattern: /^[\u4e00-\u9fa5A-Za-z0-9|&]+$/, message: '含有非法字符', trigger: 'blur'},
            {validator: this.validatePattern, trigger: 'blur' }],
          location:[{pattern: /^[\u4e00-\u9fa5A-Za-z0-9|]+$/, message: '含有非法字符', trigger: 'blur'},
            {validator: this.validatePattern, trigger: 'blur' }]
        },
      }
    },
    created() {
      if(this.taskData!=null){
        this.formData = this.taskData
      }else{
        // console.log(getUser())
        this.formData.emails = [{
          key : Date.now(),
          email: getUser().email
        }]
      }
    },
    computed: {
      emailString(){
        let emailString = "";
        let len = this.formData.emails.length;
        for (let i = 0; i < len - 1; i++) {
          emailString += this.formData.emails[i].email + ","
        }
        emailString += this.formData.emails[len - 1].email
        return emailString
      },
    },
    methods: {
      addEmail(){
        this.formData.emails.push({
          email: '',
          key: Date.now()
        })
      },
      removeEmail(index){
        if (index >= -1 && this.formData.emails.length > 1) {
          this.formData.emails.splice(index, 1)
        }
      },
      validatePattern(rule, value, callback){
        if(value!=null && value.indexOf('|')!=-1 && value.indexOf('&')!==-1){
          callback(new Error("暂不支持'|','&'同时使用"))
        }else if(value!=null && value!="" && value.replaceAll('|','').replaceAll('&','')===''){
          callback(new Error("请输入有效字符"));
        }else{
          callback();
        }
      },
      validateFrom (formName){
        console.log(this)
        this.$refs[formName].validate((valid) => {
          let params = JSON.parse(JSON.stringify(this.formData))
          // console.log(params)
          params.emails = this.emailString
          if (valid) {
            WarningTaskService.saveOrUpdateWarningTask(params).then(res=> {
              if(res.data.code==1){
                this.$message.success(res.data.msg)
                this.$emit('cancledDialog')
                this.$emit('refreshData')
                this.$refs[formName].resetFields()
              }else{
                this.$message.error(res.data.msg)
              }
            }).catch(err => {
              this.$message.error(err)
            })
          } else {
            this.$message.error("表单校验未通过，请修改补充")
            return false;
          }
        });
      },
      cancelTask(){
        this.$emit('cancledDialog')
        this.$refs["taskForm"].resetFields()
      },
    }
  }
  
</script>
<style lang="scss">
  .inputClass {
    width: 80%;
  }

  .el-tag {
    color: #65cea7;
  }

  .formItem {
    .el-select .el-tag {
      background-color: #28ccaa;
      color: #fff;
    }
  }

</style>
