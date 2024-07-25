<template>
  <div id="pieChart" ref="pieChart" style="height:400px;"></div>
</template>
<script type="text/javascript">
  export default {
    name: 'PieChart',
    props: ['pieData'],
    data() {
      return {
        sentimentData: this.pieData,
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
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(this.$refs.pieChart, 'shine');
        var option = {
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)",
            confine: true,
          },
          legend: {
            orient: 'vertical',
            x: 'left',
          },
          toolbox: {
            show: true,
            x: 'right',
            y: 'top',
            feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: false},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          calculable: true,
          series: [
            {
              name: '情感倾向',
              type: 'pie',
              radius: '70%',
              itemStyle: {
                normal: {
                  color:(params)=>{
                    var colorList = ['#9f444e', '#ce9974', '#6bae91']
                    return colorList[params.dataIndex]
                  },
                  label: {
                    show: true,
                    formatter: '{b}: {d}%'
                  },
                  labelLine: {
                    show: true
                  }
                },
                emphasis: {
                  label: {
                    show: true,
                    position: 'center',
                    textStyle: {
                      fontSize: '30',
                      fontWeight: 'bold'
                    }
                  },
                }
              },
              data: this.sentimentData
            }
          ]
        };
        myChart.setOption(option)
      },
    }
  }
</script>

<style>
</style>
