<template>
  <div>
    <div class="status">
      <div class="divBorder">
        <div class="topTen">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="昨天" name="topTenPeriod1"></el-tab-pane>
            <el-tab-pane label="3天" name="topTenPeriod3"></el-tab-pane>
            <el-tab-pane label="7天" name="topTenPeriod7"></el-tab-pane>
            <el-tab-pane label="14天" name="topTenPeriod14"></el-tab-pane>
          </el-tabs>
        </div>
        <div>
          <el-row
            :gutter="20"
          >
            <el-col :span="6">
              <div class="panel">
                <PanelTitle title="累计微博话题数"></PanelTitle>
                <div class="panel-body">
                  <h1 class="number">{{totalTopic}}</h1>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="panel">
                <PanelTitle title="累计微博博文数">
                </PanelTitle>
                <div class="panel-body">
                  <h1 class="number">{{totalArticle}}</h1>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="panel">
                <PanelTitle title="累计负面舆情数">
                </PanelTitle>
                <div class="panel-body">
                  <h1 class="number">{{totalNegative}}</h1>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="panel">
                <PanelTitle title="累计用户评论数">
                </PanelTitle>
                <div class="panel-body">
                  <h1 class="number">{{totalComment}}</h1>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <!--词云图-->
        <div class="panel">
          <PanelTitle title="热门话题"></PanelTitle>
          <div class="panel-body" style="height: 440px">
            <WordCloudChart v-if="wordCloudData != null" :key="timeRefusr" :wordCloudData="wordCloudData"></WordCloudChart>
          </div>
        </div>
        <el-row
          :gutter="20"
        >
          <el-col :span="12">
            <!--舆情走向图-->
            <div class="panel">
              <PanelTitle title="舆情走势"></PanelTitle>
              <div class="panel-body" style="height: 440px">
                <TrendChart v-if="trendData != null" :key="timeRefusr" :trendData="trendData"></TrendChart>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <!--舆情分布地图-->
            <div class="panel">
              <PanelTitle title="舆情分布"></PanelTitle>
              <div class="panel-body" style="height: 440px">
                <AddressChart v-if="addressData != null" :key="timeRefusr" :addressData="addressData"
                ></AddressChart>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
  import PanelTitle from '@/components/PanelTitle.vue'
  import ElFormItem from "../../node_modules/element-ui/packages/form/src/form-item"
  import WordCloudChart from '@/components/chart/WordCloudChart.vue'
  import TrendChart from '@/components/chart/TrendChart.vue'
  import AddressChart from '@/components/chart/AddressChart.vue'
  import {POOverviewServcie} from '@/utils/api'
  import {transferNum} from '@/utils/commonutil'

  require('echarts-wordcloud');


  export default {
    data() {
      return {
        options: [],
        tableData: [],
        loading: true,
        totalNegative: 0,
        totalComment: 0,
        totalArticle: 0,
        totalTopic: 0,
        dayParams: 7,
        wordCloudData: null,
        trendData: null,
        addressData: null,
        activeName: "topTenPeriod7",
        timeRefusr: new Date().getTime(),
      }
    },
    components: {
      ElFormItem,
      PanelTitle,
      WordCloudChart,
      TrendChart,
      AddressChart
    },
    created() {
      this.refreshData()
      window.onresize = () => {
        this.timeRefusr = new Date().getTime()
      }
    },
    methods: {

      getTotalTopic(params) {
        POOverviewServcie.getTotalTopicNearly(params).then(res=>{
          if(res.data.code === 1){
            //console.log(res.data)
            this.totalTopic = transferNum(res.data.data)
          }else{
            this.$message.error(res.data.msg)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      getTotalArticle(params) {
        POOverviewServcie.getTotalArticleNearly(params).then(res=>{
          if(res.data.code === 1){
            //console.log(res.data)
            this.totalArticle = transferNum(res.data.data)
          }else{
            this.$message.error(res.data.msg)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      gettotalNegative(params) {
        POOverviewServcie.getTotalNegativeNearly(params).then(res=>{
          if(res.data.code === 1){
            //console.log(res.data)
            this.totalNegative = transferNum(res.data.data)
          }else{
            this.$message.error(res.data.msg)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      getTotalComment(params) {
        POOverviewServcie.getTotalCommentNearly(params).then(res=>{
          if(res.data.code === 1){
            //console.log(res.data)
            this.totalComment = transferNum(res.data.data)
          }else{
            this.$message.error(res.data.msg)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      getCloudData() {
        POOverviewServcie.getWordCloudData().then(res=>{
          if(res.data.code === 1){
            //console.log(res.data)
            this.wordCloudData = res.data.data
            this.timeRefusr = new Date().getTime()
          }else{
            this.$message.error(res.data.msg)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      getPublicOpinionTrend(params) {
        POOverviewServcie.getPublicOpinionTrend(params).then(res=>{
          if(res.data.code === 1){
            //console.log(res.data)
            this.trendData = res.data.data
            this.timeRefusr = new Date().getTime()
          }else{
            this.$message.error(res.data.msg)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      getProvinceGroupData(params) {
        POOverviewServcie.getProvinceGroupData(params).then(res=>{
          if(res.data.code === 1){
            //console.log(res.data)
            this.addressData = res.data.data
            this.timeRefusr = new Date().getTime()
          }else{
            this.$message.error(res.data.msg)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      async refreshData() {
        const params = {day: this.dayParams}
        this.getTotalTopic(params)
        this.getTotalArticle(params)
        this.gettotalNegative(params)
        this.getTotalComment(params)
        this.getCloudData()
        this.getPublicOpinionTrend(params)
        this.getProvinceGroupData(params)
        
      },
      //切换
      handleClick(tab, event) {
        if ("topTenPeriod1" == tab.name) {
          this.dayParams = 2
        } else if ("topTenPeriod3" == tab.name) {
          this.dayParams = 3
        } else if ("topTenPeriod7" == tab.name) {
          this.dayParams = 7
        } else if ("topTenPeriod14" == tab.name) {
          this.dayParams = 14
        }
        this.refreshData()
      },
    }
  }
</script>

<style>
  .divBorder {
    border: 1px solid grey;
    border-radius: 10px;
    padding: 10px;
  }

  h2 {
    color: #65cea7;
  }

  h1.number {
    font-weight: 100;
    text-align: center;
    color: #65cea7;
    margin-top: 0;
  }

  .panel-body h1 {
    cursor: pointer;
  }
</style>
