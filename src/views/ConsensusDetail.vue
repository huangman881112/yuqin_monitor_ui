<template>
  <div>
    <div class="panel">
      <PanelTitle title="话题详情"></PanelTitle>
      <div class="panel-body">
        <div style="text-align: center;margin-bottom: 10px">
          <h2>{{data.title}}</h2>
          <span>{{dateFormat(data.created_time)}}</span>
          
        </div>
        <el-row :gutter="20">
          <el-col :span="8" v-for="(article,index) in data.articles" :key="index" style=";margin-bottom: 20px">
            <el-card class="box-card">
              <div slot="header" class="clearfix head">
                <el-button type="text"
                           style="cursor: pointer"
                           @click="jumpToDetail(article.link)"
                >热门微博{{index+1}}
                </el-button>
                <el-tag effect="plain" type="warning" >
                  {{translateSentiment(article.sentiment)}}
                </el-tag>
              </div>
              <div style="overflow: auto;height: 80px">
                {{article.text}}
              </div>
              <div class="foot">
                <div class="foot_left">
                  <el-badge :value="article.attitudes_count" class="item">
                    <el-tag size="mini" color="#e3aab1" style="color: #fff;">点赞</el-tag>
                  </el-badge>
                  <el-badge :value="article.comments_count" class="item">
                    <el-tag size="mini" color="#b3d1b1" style="color: #fff;">评论</el-tag>
                  </el-badge>
                  <el-badge :value="article.reposts_count" class="item">
                    <el-tag size="mini" color="#e3e9ce" style="color: #fff;">转发</el-tag>
                  </el-badge>
                </div>
                <div class="foot_right">
                  作者:{{ article.author }}
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="topTen">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="昨天" name="topTenPeriod1"></el-tab-pane>
        <el-tab-pane label="3天" name="topTenPeriod3"></el-tab-pane>
        <el-tab-pane label="7天" name="topTenPeriod7"></el-tab-pane>
        <el-tab-pane label="14天" name="topTenPeriod14"></el-tab-pane>
      </el-tabs>
    </div>
    <!--舆情走向图-->
    <div class="panel">
      <PanelTitle title="舆情走势"></PanelTitle>
      <div class="panel-body" style="height: 440px">
        <TrendChart 
          v-if="trendData != null" 
          :key="timeRefusr" 
          :trendData="trendData">
        </TrendChart>
      </div>
    </div>
    <el-row :gutter="20">
      <el-col :span="12">
        <!--舆情分布地图-->
        <div class="panel">
          <PanelTitle title="舆情分布"></PanelTitle>
          <div class="panel-body" style="height: 440px">
            <AddressChart
              v-if="addressData!=null"
              :key="timeRefusr" 
              :addressData="addressData">
            </AddressChart>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <!--情感倾向图-->
        <div class="panel">
          <PanelTitle title="情感占比"></PanelTitle>
          <div class="panel-body" style="height: 440px">
            <PieChart
            v-if="sentimentData!=null " 
            :key="timeRefusr" 
            :pieData="sentimentData">
            </PieChart>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import PanelTitle from '@/components/PanelTitle.vue'
  import PieChart from '@/components/chart/PieChart'
  import AddressChart from '@/components/chart/AddressChart.vue'
  import TrendChart from '@/components/chart/TrendChart.vue'
  import moment from 'moment'
  import { POAnalysisService } from '@/utils/api' 


  export default { 
    name: 'ConsensusDetail',
    data() {
      return {
        id: null,
        data: {
          id: null,
          title: null,
          created_time: null,
          hot: null,
          articles: [{
            id: null,
            text: null,
            created_time: null,
            author: null,
            comments_count: null,
            attitudes_count: null,
            reposts_count: null,
            link: null,
            sentiment: null,
            source: null
          }],
        },
        addressData: [],
        sentimentData: [],
        trendData: [],
        dayParams: 7,
        activeName: "topTenPeriod7",
        timeRefusr: new Date().getTime(),
      }
    },
    components: {
      PanelTitle,
      PieChart,
      AddressChart,
      TrendChart
    },
    created() {
      this.getTopicWithArticleById()
      window.onresize = () => {
        this.timeRefusr = new Date().getTime()
      }
    },
    computed: {
      articleIds: function () {
        var articleIds = [];
        for (var index in this.data.articles) {
          articleIds.push(this.data.articles[index].id)
        }
        return articleIds.map(Number)
      }
    },
    methods: {
      getTopicWithArticleById() {
        this.id  = this.$route.query.id
        const params = {
          topicId: this.id
        }
        POAnalysisService.getTop6ArticleByTopicId(params).then(res => {
          if(res.data.code == 1){
            this.data = res.data.data
          }else{
            this.$message.error(res.data.msg)
          }
        }).catch(err => {
          this.$message.error(err)
        })
        this.refreshData()
      },
      getPublicOpinionTrendByTopicId(params) {
        POAnalysisService.getPublicOpinionTrendByTopicId(params).then(res => {
          if(res.data.code == 1){
            this.trendData = res.data.data
            this.timeRefusr = new Date().getTime()
          }else{
            this.$message.error(res.data.msg)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      getProvinceGroupDataByTopicId(params) {
        POAnalysisService.getProvinceGroupDataByTopicId(params).then(res => {
          if(res.data.code == 1){
            this.addressData = res.data.data
            this.timeRefusr = new Date().getTime()
          }else{
            this.$message.error(res.data.msg)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      getSentimentPieDataByTopicId(params) {
        POAnalysisService.getSentimentPieDataByTopicId(params).then(res => {
          if(res.data.code == 1){
            this.sentimentData = res.data.data
            this.timeRefusr = new Date().getTime()
          }else{
            this.$message.error(res.data.msg)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      jumpToDetail(url) {
        window.open(url, 'blank')
      },
      dateFormat(dateTime) {
        if (dateTime == undefined) {
          return "";
        }
        return moment(Number(dateTime)).format("YYYY-MM-DD HH:mm:ss");
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
      refreshData(){
        const params = {
          topicId: this.id,
          day: this.dayParams
        }
        this.getPublicOpinionTrendByTopicId(params)
        this.getProvinceGroupDataByTopicId(params)
        this.getSentimentPieDataByTopicId(params)
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
    },
  }
</script>

<style>
.head{
  display: flex;
  justify-content: space-between;
}
.foot{
  margin-top: 3%;
  display: flex;
  justify-content: space-between;
}
.foot_left{
  width: 35%;
  display: flex;
  justify-content: space-around;
}
.foot_right{
  font-size: small;
  color: #b2b3a4;
  height: 28px;
  line-height: 28px;
}

</style>
