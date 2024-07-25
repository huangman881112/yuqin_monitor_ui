<template>
  <div class="panel">
    <PanelTitle title="任务列表"></PanelTitle>
    <div class="panel-body">
      <!--搜索框-->
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="">
          <el-input v-model="searchTaskName" placeholder="任务名称"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="searchLocation" placeholder="位置"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select
            v-model="searchSentiment"
            placeholder="请选择情感"
            clearable 
          >
            <el-option
              v-for="item in sentimentTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select
            v-model="searchStatus"
            placeholder="请选择状态"
            clearable 
          >
            <el-option
              v-for="item in statusTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="searchCrawlDate"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          >
          </el-date-picker>
        </el-form-item>
        <el-button @click="cleanSearch"
          ><i class="fa el-icon-close"></i>&nbsp;清空</el-button
        >
        <el-button type="primary" @click="getWarningPageData"
          ><i class="fa fa-search"></i>&nbsp;查询</el-button
        >
        <!--<el-button type="warning" @click="exportExcel"><i class="fa fa-download"></i>&nbsp;导出</el-button>-->
      </el-form>
      <!-- 操作栏 -->
      <div class="operate">
        <el-button 
          size="small" 
          @click="addTask()"
          icon="el-icon-circle-plus-outline">新增</el-button>
        <el-button
          size="small"
          @click="updateTask()"
          :disabled="edit_btn_disable"
          icon="el-icon-edit">编辑</el-button>
        <el-button
          size="small"
          @click="deleteTask()"
          :disabled="delete_btn_disable"
          icon="el-icon-delete">删除</el-button>
        <el-button
          size="small"
          @click="analysisTask()"
          :disabled="analysis_btn_disable"
          icon="el-icon-chat-dot-square">分析</el-button>
      </div>
      <!-- 表格 -->
      <el-table size="mini" :data="clients.records" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="taskName"
          label="任务名称"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="description"
          label="任务描述"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="keyword"
          label="关键词"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="ignoreword"
          label="屏蔽词"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ translate(scope.row.ignoreword) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="location"
          label="位置"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ translate(scope.row.location) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="sentiment"
          label="情感"
          width="80px"
          align="center"
        >
          <template slot-scope="scope">
            {{ translateSentiment(scope.row.sentiment) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="frequency"
          label="预警频次"
          align="center"
        >
          <template slot-scope="scope">
            {{ translateFrequency(scope.row.frequency) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="hotIndex"
          label="预警门槛"
          width="100px"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="emails"
          label="预警邮箱"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="80px"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag
              :type="tagType(scope.row.status)"
              style="font-size: 13px;"
            >
              {{ translateStatus(scope.row.status) }}
            </el-tag>
            
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="150px"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ dateFormat(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="autoRun"
          label="操作"
          width="120px"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              round
              :type="btnType(scope.row.status)"       
              @click="changeStatus(scope.row)"
              size="small"
            >
            {{ btnText(scope.row.status) }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="clients.current"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="clients.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="clients.total"
        >
        </el-pagination>
      </div>
      <!-- 新增编辑弹框 -->
      <el-dialog
        :title="formTitle"
        :visible.sync="warningFormVisible"
        :before-close="cancledDialog"
        append-to-body>
        <warning-form 
          v-if="warningFormVisible" 
          :taskData="taskData" 
          ref="warningForm"
          @cancledDialog="cancledDialog"
          @refreshData="getWarningPageData"
        ></warning-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
// import soldsChart from "../../components/chart/soldsChart";
import PanelTitle from '@/components/PanelTitle.vue'
import moment from "moment";
import WarningForm from '@/components/WarningForm.vue';
import { WarningTaskService } from "@/utils/api"

export default {
  name: "warning",
  data() {
    return {
      clients: {
        total: 0,
        size: 10,
        current: 1,
        records: [],
      },
      searchTaskName: null,
      searchLocation: null,
      searchStatus: null,
      searchSentiment: null,
      searchCrawlDate: [],
      warningFormVisible: false,
      formTitle: null,
      edit_btn_disable: true,
      delete_btn_disable: true,
      analysis_btn_disable: true,
      taskData: null,
      pickerOptions: {
        shortcuts: [{
          text: '最近三天',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近两周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 14);
            picker.$emit('pick', [start, end]);
          }
        }],
      },
      sentimentTypeOptions: [{
        value: 1,
        label: '正面'
      }, {
        value: 0,
        label: '中性'
      }, {
        value: -1,
        label: '负面'
      }],
      statusTypeOptions: [{
        value: 1,
        label: '运行'
      }, {
        value: 0,
        label: '停止'
      }, {
        value: -1,
        label: '异常'
      }],
    }
  },
  components: {
    // soldsChart,
    PanelTitle,
    WarningForm
  },
  created() {
    this.getWarningPageData();
  },
  methods: {
    //获取数据
    getWarningPageData() {
      const searchDTO = {
        //查询参数
        pageSize: this.clients.size,
        pageNo: this.clients.current,
        hotWord: this.searchTaskName,
        startDate: this.searchCrawlDate!=null ? this.searchCrawlDate[0] : null,
        endDate: this.searchCrawlDate!=null ? this.searchCrawlDate[1] : null,
        status: this.searchStatus,
        sentiment: this.searchSentiment,
        location: this.searchLocation
      }
      WarningTaskService.pageSearchWarningTask(searchDTO).then(res => {
        if(res.data.code==1){
          // console.log(res.data.data)
          this.clients = res.data.data
          this.clients.records.forEach(e => {
            e.autoRun = Boolean(e.autoRun)
          })
        }else{
          this.$message.error(res.data.msg)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    handleSizeChange(val) {
      this.clients.size = val;
      this.getWarningPageData();
    },
    handleCurrentChange(val) {
      this.clients.current = val;
      this.getWarningPageData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // console.log(this.multipleSelection)
      if(this.multipleSelection.length==0){
        this.edit_btn_disable = true
        this.analysis_btn_disable = true
        this.delete_btn_disable = true
      }else if(this.multipleSelection.length==1){
        this.edit_btn_disable = false
        this.analysis_btn_disable = false
        this.delete_btn_disable = false
      }else{
        this.edit_btn_disable = true
        this.analysis_btn_disable = true
        this.delete_btn_disable = false
      }
    },
    cancledDialog(){
      this.warningFormVisible = false;
      this.taskData = null
    },
    cleanSearch() {
      this.searchTaskName = null;
      this.searchCrawlDate = [];
      this.searchLocation = null;
      this.searchStatus = null;
      this.searchSentiment = null;
    },
    addTask(){
      this.formTitle = "新增预警任务"
      this.warningFormVisible = true;
    },
    updateTask() {
      if(this.multipleSelection[0].status===1){
        this.$message.error("请先停止运行该任务")
        return
      }
      this.taskData = JSON.parse(JSON.stringify(this.multipleSelection[0]))
      let emails = []
      this.taskData.emails.split(',').forEach(e=>{
        emails.push({
          key: Date.now(),
          email: e
        })
      })
      this.taskData.autoRun = Number(this.taskData.autoRun)
      this.taskData.emails = emails
      this.formTitle = "修改预警任务"
      this.warningFormVisible = true
    },
    deleteTask() {
      //校验选中的任务都为停止或异常
      let flag = this.multipleSelection.every(item=>item.status<=0)
      if(!flag){
        this.$message.error("勾选任务中包含正在运行或启动中的任务，请先停止")
        return false
      }
      this.$confirm("此操作将删除该任务, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let ids = this.multipleSelection.map(e => e.taskId);
        // console.log(ids)
        WarningTaskService.deleteTask(ids).then(res =>{
          if(res.data.code===1){
            this.$message.success(res.data.msg)
            this.getWarningPageData()
          }else{
            this.$message.error(res.data.msg)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除",
        });
      });
    },
    analysisTask(){
      // console.log(this.multipleSelection[0])
      this.$router.push({
        name: 'searchanalysis',
        query: {
          keyword: this.multipleSelection[0].keyword,
          ignoreword: this.multipleSelection[0].ignoreword,
          location: this.multipleSelection[0].location
        }
      })
      // console.log(this.multipleSelection[0])
      //存入vuex
      this.$store.commit('selectMenu', {
        name: 'searchanalysis',
        title: this.multipleSelection[0].taskName,
        query: {
          keyword: this.multipleSelection[0].keyword,
          ignoreword: this.multipleSelection[0].ignoreword,
          location: this.multipleSelection[0].location
        }
      })
    },
    // 改变状态
    changeStatus(row) {
      const params = {
        taskId: row.taskId,
        status: row.status==1 ? 0 : 1
      }
      WarningTaskService.changeStatus(params).then(res =>{
        if(res.data.code===1){
          this.$message.success(res.data.msg)
          this.getWarningPageData()
        }else{
          this.$message.error(res.data.msg)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    dateFormat(dateTime) {
      if (dateTime == undefined) {
        return "";
      }
      return moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
    },
    translateFrequency(frequency){
      let label = ""
      switch(frequency){
        case 1:
          label = "1次/1分钟"
          break
        case 5:
          label = "1次/5分钟"
          break
        case 30:
          label = "1次/30分钟"
          break
        case 60:
          label = "1次/1小时"
          break
        case 720:
          label = "1次/12小时"
          break
        case 1440:
          label = "1次/24小时"
          break
      }
      return label
    },
    translateStatus(status){
      if (status == 1) {
        return "运行"
      } else if (status == 0) {
        return "停止"
      }else if(status == -1){
        return "异常"
      }
    },
    translateSentiment(sentiment) {
      if (sentiment == -1) {
        return "负面"
      } else if (sentiment == 1) {
        return "正面"
      } else {
        return "中立"
      }
    },
    translate(params){
      if(typeof(params)=="undefined")
        return "无"
      else
        return params
    },
    btnText(status){
      if(status==1)
        return "停止"
      else
        return "启动"
    },
    btnType(status){
      switch(status){
        case 1:
          return "danger"
        default:
          return "success"
      }
    },
    tagType(status){
      switch(status){
        case 1:
          return "success"
        case -1:
          return "warning"
        case 0:
          return "danger"
      }
    }
  },
};
</script>

<style scoped>
.block {
  margin-top: 20px;
}
.operate{
  margin-bottom: 10px;
}
</style>
