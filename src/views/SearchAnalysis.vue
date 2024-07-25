<template>
  <div>
    <div class="status">
      <div class="divBorder">
        <!-- tab栏 -->
        <div class="topTen">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="昨天" name="topTenPeriod1"></el-tab-pane>
            <el-tab-pane label="3天" name="topTenPeriod3"></el-tab-pane>
            <el-tab-pane label="7天" name="topTenPeriod7"></el-tab-pane>
            <el-tab-pane label="14天" name="topTenPeriod14"></el-tab-pane>
          </el-tabs>
        </div>
        <!-- 统计栏 -->
        <div>
          <el-row
            :gutter="20"
          >
            <el-col :span="6">
              <div class="panel">
                <PanelTitle title="全部舆情"></PanelTitle>
                <div class="panel-body">
                  <h1 class="number total">{{total}}</h1>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="panel">
                <PanelTitle title="正面舆情">
                </PanelTitle>
                <div class="panel-body">
                  <h1 class="number positive">{{positiveCount}}</h1>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="panel">
                <PanelTitle title="中性舆情">
                </PanelTitle>
                <div class="panel-body">
                  <h1 class="number neuter">{{neuterCount}}</h1>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="panel">
                <PanelTitle title="负面舆情">
                </PanelTitle>
                <div class="panel-body">
                  <h1 class="number negative">{{negativeCount}}</h1>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <!-- 第三行：地图、饼图、柱状图 -->
        <el-row
          :gutter="20" class="search-analysis"
        >
          <!--舆情分布地图-->
          <el-col :span="12">
            <div class="panel">
              <PanelTitle title="舆情分布"></PanelTitle>
              <div class="panel-body" style="height: 440px">
                <AddressChart v-if="addressData != null" :key="timeRefusr" :addressData="addressData"
                ></AddressChart>
              </div>
            </div>
          </el-col>
          <!-- 情感分布饼图 -->
          <el-col :span="12">
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
          <!-- 关键词命中柱状图 -->
          <el-col :span="12">
            <div class="panel">
              <PanelTitle title="关键词命中"></PanelTitle>
              <div class="panel-body" style="height: 440px">
                <BartChart
                v-if="barData!=null " 
                :key="timeRefusr" 
                :barData="barData">
                </BartChart>
              </div>
            </div>
          </el-col>
        </el-row>
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
        <!-- 文章列表 -->
        <div class="artilce-box">
          <el-tabs v-model="activeArticle" @tab-click="handleClickArticle">
            <el-tab-pane label="全部" name="allAtricle"></el-tab-pane>
            <el-tab-pane label="正面" name="positiveAtricle"></el-tab-pane>
            <el-tab-pane label="中性" name="neuterAtricle"></el-tab-pane>
            <el-tab-pane label="负面" name="negativeAtricle"></el-tab-pane>
          </el-tabs>
          <div class="article-list">
            <el-card v-show="articles.length==0" style="text-align: center;"><img src="../assets/images/emptydata.png"></el-card>
            <el-row v-for="(item, idx) in articles" :key="item.id">
              <el-card>
                <div class="head">
                  <div class="head-left">
                    <el-tag class="head-eltag">{{ idx+1 }}</el-tag>&nbsp;&nbsp;
                    <span>{{ '#'+item.topic+'#' }}</span>
                  </div>
                  <div class="head-right">
                    <div><i class="el-icon-time"></i>&nbsp;{{ getTimeUntilNow(item.created_time) }}</div>
                    <div><i class="el-icon-location-information" v-html="item.location"></i>&nbsp;</div>
                    <div><el-tag type="warning" style="font-size: 18px">{{ translateSentiment(item.sentiment) }}</el-tag></div>
                  </div>
                </div>
                <div style="overflow: auto;height: 60px;margin:8px 0" v-html="item.text">
                </div>
                <div class="item-foot">
                  <div class="item-foot-left"><i class="el-icon-user"></i>&nbsp;{{ item.author }}</div>
                  <div class="item-foot-right">
                    <el-tooltip class="item" effect="dark" content="打开原文" placement="bottom">
                      <el-button type="text" size="medium " icon="el-icon-paperclip" @click="openNewPage(item.link)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="添加收藏" placement="bottom">
                      <el-button type="text" size="medium " icon="el-icon-star-off"></el-button>
                    </el-tooltip>
                  </div>
                  
                </div>
              </el-card>
            </el-row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
  import PanelTitle from '@/components/PanelTitle.vue'
  import ElFormItem from "../../node_modules/element-ui/packages/form/src/form-item";
  import PieChart from '@/components/chart/PieChart'
  import TrendChart from '@/components/chart/TrendChart.vue'
  import BartChart from '@/components/chart/BartChart.vue'
  import AddressChart from '@/components/chart/AddressChart.vue'
  import {POAnalysisService} from '@/utils/api'
  import {transferNum} from '@/utils/commonutil'

  export default {
    data() {
      return {
        options: [],
        tableData: [],
        loading: true,
        neuterCount: 0,
        negativeCount: 0,
        positiveCount: 0,
        total: 0,
        dayParams: 7,
        sentimentParams: null,
        sentimentData: [],
        trendData: [],
        addressData: [],
        barData:[],
        activeName: "topTenPeriod7",
        activeArticle: "allAtricle",
        timeRefusr: new Date().getTime(),
        articles: [],
      }
    },
    components: {
      ElFormItem,
      PanelTitle,
      TrendChart,
      AddressChart,
      PieChart,
      BartChart
    },
    created() {
      this.refreshChartData()
      this.refreshArticleList()
      window.onresize = () => {
        this.timeRefusr = new Date().getTime()
      }
    },
    methods: {
      getSearchStats(params) {
        POAnalysisService.getSearchStats(params).then(res=>{
          if(res.data.code === 1){
            //console.log(res.data)
            let data = res.data.data
            this.total = transferNum(data.total)
            this.positiveCount = transferNum(data.positiveCount)
            this.neuterCount = transferNum(data.neuterCount)
            this.negativeCount = transferNum(data.negativeCount)
            this.sentimentData = [
              {"name": "负面", "value": data.negativeCount},
              {"name": "中性", "value": data.neuterCount},
              {"name": "正面", "value": data.positiveCount},
            ]
            this.timeRefusr = new Date().getTime()
          }else{
            this.$message.error(res.data.msg)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      getSearchProvinceGroupData(params) {
        POAnalysisService.getSearchProvinceGroupData(params).then(res=>{
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
      getSearchKeyWordHit(params){
        POAnalysisService.getSearchKeyWordHit(params).then(res=>{
          if(res.data.code === 1){
            //console.log(res.data)
            this.barData = res.data.data
            this.timeRefusr = new Date().getTime()
          }else{
            this.$message.error(res.data.msg)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      getSearchPublicOpinionTrend(params) {
        POAnalysisService.getSearchPublicOpinionTrend(params).then(res=>{
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
      getTop10Articles(params){
        POAnalysisService.getTop10Articles(params).then(res=>{
          if(res.data.code === 1){
            //console.log(res.data)
            this.articles = res.data.data
          }else{
            this.$message.error(res.data.msg)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      async refreshChartData() {
        let searchWord = this.$route.query.searchWord
        let keyword = this.$route.query.keyword
        let ignoreword = this.$route.query.ignoreword
        let location = this.$route.query.location
        const params = {
          day: this.dayParams,
          searchWord: searchWord,
          ignoreWord: ignoreword,
          hotWord: keyword,
          location: location
        }
        this.getSearchStats(params)
        this.getSearchProvinceGroupData(params)
        this.getSearchKeyWordHit(params)
        this.getSearchPublicOpinionTrend(params)
      },
      async refreshArticleList(){
        let searchWord = this.$route.query.searchWord
        let keyword = this.$route.query.keyword
        let ignoreword = this.$route.query.ignoreword
        let location = this.$route.query.location
        const params = {
          sentiment: this.sentimentParams,
          searchWord: searchWord,
          ignoreWord: ignoreword,
          hotWord: keyword,
          location: location
        }
        this.getTop10Articles(params)
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
        this.refreshChartData()
      },
      handleClickArticle(tab, event){
        if ("allAtricle" == tab.name) {
          this.sentimentParams = null
        } else if ("positiveAtricle" == tab.name) {
          this.sentimentParams = 1
        } else if ("neuterAtricle" == tab.name) {
          this.sentimentParams = 0
        } else if ("negativeAtricle" == tab.name) {
          this.sentimentParams = -1
        }
        this.refreshArticleList()
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
      getTimeUntilNow(mss) {
        mss = Date.now() - mss
        let days = parseInt(mss / (1000 * 60 * 60 * 24));
        if (days > 0) {
          return days + " 天前";
        };
        let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if (hours > 0) {
            return hours + " 小时前 ";
        };
        let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
        if (minutes > 0) {
            return minutes + " 分钟前 ";
        };
        let seconds = (mss % (1000 * 60)) / 1000;
        return "刚刚 ";
      },
      openNewPage(url) {
        window.open(url, 'blank')
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

  h1.negative {
    color: red;
  }

  h1.total {
    color: #988fea;
  }

  h1.neuter {
    color: #d6b893;
  }

  h1.positive {
    color: #7cb79d;
  }

  .panel-body h1 {
    cursor: pointer;
  }

  .head{
    display: flex;
    justify-content: space-between;
  } 
  .head-left{
    display: flex;
    align-items: center;
    font-size: 20px;
  }
  .head-right{
    display: flex;
    /* width: 30%; */
    justify-content: space-between;
    align-items: center;
  }
  .head-right div{
    font-size: 13px;
    color:darkgray;
    margin-left: 50px;
  }

  .item-foot{
    display: flex;
    justify-content: space-between;
    font-size: 13px;
  }
  .item-foot-left{
    display: flex;
    align-items: center;
    color:darkgray;
  }
  .item-foot-right {
    display: flex;
    width: 5%;
    justify-content: space-around;
  }
  .artilce-box{
    margin-bottom: 20px;
  }
  div.head-left > span.el-tag.el-tag--light{
    background-color: #80bfff;
    color: #fff;
  }
  div.article-list > div:nth-child(1) > div > div > div.head > div.head-left > span.el-tag.el-tag--light{
    background-color: #ff0065;
  }
  div.article-list > div:nth-child(2) > div > div > div.head > div.head-left > span.el-tag.el-tag--light{
    background-color: #ff751a;
  }
  div.article-list > div:nth-child(3) > div > div > div.head > div.head-left > span.el-tag.el-tag--light{
    background-color: #ffd11a;
  }

  .search-analysis{
    display: flex;
    justify-content: space-between;
  }
  .article-list > div{
    margin-bottom: 0px;
  }

  .article-list > el-card > img{
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }

  span.highlight{
    color: red
  }


</style>
