<template>
  <!--字符云图-->
  <div id="skuChart" ref="topicCloud" style="height:400px;"></div>
</template>
<script type="text/javascript">
  require('echarts-wordcloud');

  export default {
    name: 'WordCloudChart',
    props: ['wordCloudData'],
    data() {
      return {
        cloudOption: this.wordCloudData,
      }
    },
    updated() {
      this.drawChart()
    },
    mounted() {
      this.drawChart()
    },
    methods: {
      drawChart() {
        // console.log(this.cloudOption)
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(this.$refs.topicCloud, 'shine');
        var option = {
          title: {
            text: '',
          },
          tooltip: {
            show: true
          },
          toolbox: {
            show: true,
            feature: {
              dataView: {show: true, readOnly: false},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          series: [{
            name: '话题热度',
            type: 'wordCloud',
            size: ['80%', '80%'],
            rotationRange: [-45, 45],
            textPadding: 0,
            gridSize: 8,
            textStyle: {
              normal: {
              },
              emphasis: {
                shadowBlur: 10,
                shadowColor: '#333'
              }
            },
            autoSize: {
              enable: true,
            },
            data: this.handlerData(this.cloudOption)
          }]
        }
        myChart.setOption(option, true)
      },
      randomColor() {
        return 'rgb(' + [
            Math.round(Math.random() * 160),
            Math.round(Math.random() * 160),
            Math.round(Math.random() * 160)
          ].join(',') + ')';
      },
      handlerData(data){
        return data.map(val => ({
          ...val,
          textStyle: {
            normal: {
              color: this.randomColor()
            }
          }
        }))
      }
    }
  }
</script>

<style>
</style>
