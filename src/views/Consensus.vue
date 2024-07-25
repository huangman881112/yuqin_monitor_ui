<template>
  <div class="panel">
    <PanelTitle title="话题列表"></PanelTitle>
    <div class="panel-body">
      <!--搜索框-->
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="">
          <el-input v-model="searchHotWord" placeholder="话题关键词"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="searchCrawlDate" type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right">
          </el-date-picker>
        </el-form-item>
        <el-button @click="cleanSearch"><i class="fa el-icon-close"></i>&nbsp;清空</el-button>
        <el-button type="primary" @click="getTopicPageData"><i class="fa fa-search"></i>&nbsp;查询</el-button>
        <!--<el-button type="warning" @click="exportExcel"><i class="fa fa-download"></i>&nbsp;导出</el-button>-->
      </el-form>
      <el-table
        size="mini"
        :data="clients.topicList"
        border
        style="width: 100%"
        highlight-current-row
      >
        <el-table-column
          prop="rank"
          label="排名"
          align="center"
          min-width="5%"
        >
          <template slot-scope="scope">
                {{scope.$index+1+(clients.pageNo-1)*clients.pageSize}} 
              </template>
          </el-table-column>
        <!-- <el-table-column
          prop="id"
          label="舆论ID"
          width="80px"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column> -->
        <el-table-column
          prop="title"
          label="舆论话题"
          align="center"
          min-width="20%"
        >
        </el-table-column>
        
        <el-table-column
          prop="hot"
          label="热度"
          align="center"
          min-width="10%"
        >
        </el-table-column>
        <el-table-column
          prop="positive"
          label="正面博文数"
          align="center"
          min-width="10%"
        >
        </el-table-column>
        <el-table-column
          prop="neutral"
          label="中性博文数"
          align="center"
          min-width="10%"
        >
        </el-table-column>
        <el-table-column
          prop="negative"
          label="负面博文数"
          align="center"
          min-width="10%"
        >
        </el-table-column>
        <el-table-column
          prop="total"
          label="累计博文数"
          align="center"
          min-width="10%"
        >
        </el-table-column>
        <el-table-column
          prop="created_time"
          label="时间"
          align="center"
          min-width="15%"
          :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{dateFormat(scope.row.created_time)}}
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="分析"
          align="center"
          min-width="10%"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="jumpToDetail(scope.row.id)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top: 2%;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="clients.pageNo"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="clients.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="clients.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import PanelTitle from '@/components/PanelTitle.vue'
  import {POMonitorServcie} from '@/utils/api'
  import moment from 'moment'

  export default {
    data() {
      return {
        clients: {
          total: 0,
          pageSize: 20,
          pageNo: 1,
          topicList: []
        },
        searchHotWord: null,
        searchCrawlDate: [],
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
        sentimentOptions: [{
          value: 1,
          label: '正面'
        }, {
          value: 0,
          label: '中立'
        }, {
          value: -1,
          label: '负面'
        }],
      }
    },
    components: {
      PanelTitle
    },
    created() {
      this.getTopicPageData()
    },
    methods: {
      //获取数据  
      getTopicPageData() {
        const searchDTO = {
          //查询参数
          pageSize: this.clients.pageSize,
          pageNo: this.clients.pageNo,
          hotWord: this.searchHotWord,
          startDate: this.searchCrawlDate!=null ? this.searchCrawlDate[0] : null,
          endDate: this.searchCrawlDate!=null ? this.searchCrawlDate[1] : null,
        }
        POMonitorServcie.pageSearchTopicList(searchDTO).then(res => {
          if(res.data.code==1){
            this.clients = res.data.data
            // console.log(this.clients)
          }else{
            this.$message.error(res.data.msg)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      handleSizeChange(val) {
        this.clients.pageSize = val
        this.getTopicPageData()
      },
      handleCurrentChange(val) {
        this.clients.pageNo = val
        this.getTopicPageData()
      },
      dateFormat(dateTime) {
        if (dateTime == undefined) {
          return "";
        }
        return moment(Number(dateTime)).format("YYYY-MM-DD HH:mm:ss");
      },
      add(a,b,c){
        return a+b+c
      },
      cleanSearch() {
        this.searchHotWord = null
        this.searchCrawlDate = []
      },
      jumpToDetail(id) {
        this.$router.push({
          name: 'consensusDetail',
          query: {id: id}
        })
        this.$store.commit('selectMenu', {
          title: "话题分析",
          path: "/consensus/detail",
          name: 'consensusDetail',
          icon: "el-icon-date",
        })
      },
      
    },
  }
</script>

<style>
  .line-limit-length {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
