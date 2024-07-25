<template>
  <div id="trendChart" ref="trendChart" style="height:400px;"></div>
</template>
<script type="text/javascript">
  export default {
    name: 'TrendChart',
    props: ['trendData'],
    data() {
      return {
        data: this.trendData,
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
        let myChart = this.$echarts.init(this.$refs.trendChart, 'shine');
        var option = {
          legend: {
             data: ["正面舆论","中性舆论","负面舆论"]
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#65cea7'
              }
            }
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          grid: {
            left: '5%',
            right: '5%',
            bottom: '5%',
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: this.data.timeSeries
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '正面舆论',
              type: 'line',
              data: this.data.positiveSeries,
              smooth:true,
              itemStyle: {
                normal: {
                    color: '#6bae91', //改变折线点的颜色
                    lineStyle: {
                        color: '#6bae91' //改变折线颜色
                    }
                }
			        },
              areaStyle: {
                normal: {
                  color: '#8cc0aa',
                  opacity: 0.1,
                  origin: 'start'
                }
              },
            },
            {
              name: '中性舆论',
              type: 'line',
              data: this.data.neuterSeries,
              smooth:true,
              itemStyle: {
                normal: {
                    color: '#ce9974', //改变折线点的颜色
                    lineStyle: {
                        color: '#ce9974' //改变折线颜色
                    }
                }
			        },
              areaStyle: {
                normal: {
                  color: '#debba2',
                  opacity: 0.1,
                  origin: 'start'
                }
              },
            },
            {
              name: '负面舆论',
              type: 'line',
              data: this.data.negativeSeries,
              smooth:true,
              itemStyle: {
                normal: {
                    color: '#9f444e', //改变折线点的颜色
                    lineStyle: {
                        color: '#9f444e' //改变折线颜色
                    }
                }
			        },
              areaStyle: {
                normal: {
                  color: '#9f444e',
                  opacity: 0.1,
                  origin: 'start'
                }
              },
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
