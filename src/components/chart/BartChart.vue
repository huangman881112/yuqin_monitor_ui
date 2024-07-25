<template>
  <!--柱状图-->
  <div id="barChart" ref="barChart" style="height:400px"></div>
</template>
<script type="text/javascript">
  export default {
    name: 'BarChart',
    props: ['barData'],
    data() {
      return {
        barOption: this.barData,
        xdata: [],
        ydata: []
      }
    },
    updated() {
      this.drawChart()
    },
    mounted() {
      this.drawChart()
    },
    // computed: {
    //   xAxisData: function () {
    //     for (var i = 0; i < this.barOption; i++) {
    //       this.xdata.push(this.barOption[i].value)
    //     }
    //   },
    //   yAxisData: function () {
    //     var ydata = [];
    //     for (var i = 0; i < this.barOption; i++) {
    //       this.ydata.push(this.barOption[i].name)
    //     }
    //   }
    // },
    methods: {
      drawChart() {
        for (var i = 0; i < this.barOption.length; i++) {
          this.xdata.push(this.barOption[i].value)
        }
        // console.log(this.xdata)
        for (var i = 0; i < this.barOption.length; i++) {
          this.ydata.push(this.barOption[i].name)
        }
        // console.log(this.ydata)
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(this.$refs.barChart, 'shine');
        var option = option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: '{b} : {c}'
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
          xAxis: {
            type: 'value',
            show: false,
          },
          yAxis: {
            type: 'category',
            data: this.ydata
          },
          series: [
            {
              data: this.xdata,
              type: 'bar',
              barWidth: 30,
              itemStyle: {
                normal: {
                  color: function (params) {
                    // build a color map as your need.
                    var colorList = [
                      '#ff471a', '#ff9900', '#666699', '#66a3ff', '#bf80ff',
                    ];
                    return colorList[params.dataIndex%5]
                  },
                  label: {
                    show: true,
                    position: 'right',
                    formatter: '{c}'
                  }
                }
              }
            }]
        };
        myChart.setOption(option)
      },
    }
  }
</script>

<style>
</style>
