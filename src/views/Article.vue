<template>
  <div class="panel"
       
  >
    <PanelTitle title="博文列表"></PanelTitle>
    <div class="panel-body">
      <!--搜索框-->
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="">
          <el-input v-model="searchHotWord" placeholder="关键词"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="searchLocation" placeholder="位置"></el-input>
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
        <el-form-item label="">
          <el-select
            v-model="searchSentiment"
            placeholder="情感倾向"
            clearable
          >
            <el-option
              v-for="item in sentimentOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button @click="cleanSearch"><i class="fa el-icon-close"></i>&nbsp;清空</el-button>
        <el-button type="primary" @click="getArticlePageData"><i class="fa fa-search"></i>&nbsp;查询</el-button>
        <!--<el-button type="warning" @click="exportExcel"><i class="fa fa-download"></i>&nbsp;导出</el-button>-->
      </el-form>
      <el-table
        size="mini"
        :data="clients.articleList"
        border
        highlight-current-row
        style="width: 100%"
      >
        <!-- <el-table-column
          prop="articleId"
          label="博文ID"
          width="80px"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column> -->
        <el-table-column
          prop="topic"
          label="话题"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="text"
          label="博文内容"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="author"
          label="作者"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="source"
          label="来源"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="attitudes_count"
          label="点赞数"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="comments_count"
          label="评论数"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="reposts_count"
          label="转发数"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="location"
          label="发布位置"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="sentiment"
          label="情感倾向"
          align="center"
        >
          <template slot-scope="scope">
            {{translateSentiment(scope.row.sentiment)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="created_time"
          label="时间"
          align="center"
          :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{dateFormat(scope.row.created_time)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="link"
          label="原文"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="openNewPage(scope.row.link)">打开原文</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
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
  import moment from 'moment'
  import {POMonitorServcie} from '@/utils/api'

  export default {
    data() {
      return {
        clients: {
          total: 0,
          pageSize: 20,
          pageNo: 1,
          data: []
        },
        searchHotWord: null,
        searchCrawlDate: [],
        searchSentiment: null,
        searchLocation: null,
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
      this.getArticlePageData()
    },
    methods: {
      //获取数据
      getArticlePageData() {
        
        const searchDTO = {
          //查询参数
          pageSize: this.clients.pageSize,
          pageNo: this.clients.pageNo,
          hotWord: this.searchHotWord,
          location: this.searchLocation,
          startDate: this.searchCrawlDate!=null ? this.searchCrawlDate[0] : null,
          endDate: this.searchCrawlDate!=null ? this.searchCrawlDate[1] : null,
          sentiment: this.searchSentiment
        }
        POMonitorServcie.pageSearchArticleList(searchDTO).then(res => {
          if(res.data.code==1){
            this.clients = res.data.data
            //console.log(this.clients)
          }else{
            this.$message.error(res.data.msg)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      handleSizeChange(val) {
        this.clients.pageSize = val
        this.getArticlePageData()
      },
      handleCurrentChange(val) {
        this.clients.pageNo = val
        this.getArticlePageData()
      },
      translateSentiment(sentiment){
        if(sentiment==-1){
          return '负面'
        }else if(sentiment==1){
          return '正面'
        }else {
          return '中性'
        }
      },
      openNewPage(url) {
        window.open(url, 'blank')
      },
      dateFormat(dateTime) {
        if (dateTime == undefined) {
          return "";
        }
        return moment(Number(dateTime)).format("YYYY-MM-DD HH:mm:ss");
      },
      cleanSearch() {
        this.searchHotWord = null
        this.searchSentiment = null
        this.searchCrawlDate = []
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
