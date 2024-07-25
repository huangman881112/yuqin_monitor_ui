<template>
  <!--地图-->
  <div id="addressChart" ref="addressChart" style="height:400px"></div>
</template>
<script type="text/javascript">
  //require('echarts-map');
  import '../../../node_modules/echarts/map/js/china.js' // 引入中国地图数据

  export default {
    name: 'AddressChart',
    props: ['addressData'],
    data() {
      return {
        addressOption: this.addressData,
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
        var max = 0;
        var min = 0;
        // console.log(this.addressOption)
        for (var i = 0; i < this.addressOption.length; i++) {
          if (this.addressOption[i].value > max&&this.addressOption[i].name!='其他') {

            max = this.addressOption[i].value;
          }
        }
        min=max/1000
        // console.log(min)
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(this.$refs.addressChart, 'shine');
        var option = {
          title: {
            text: '',
            subtext: ''
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            x: 'right',
            selectedMode: false,
          },
          dataRange: {
            orient: 'horizontal',
            min: min,
            max: max,
            text: ['高', '低'],           // 文本，默认为数值文本
            splitNumber: 0
          },
          toolbox: {
            show: true,
            orient: 'vertical',
            x: 'right',
            y: 'center',
            feature: {
              mark: {show: false},
              dataView: {show: true, readOnly: false},
              restore: {show: true},
              saveAsImage: {show: true}
            },

          },
          series: [
            {
              name: '全国舆情分布',
              type: 'map',
              mapType: 'china',
              showLegendSymbol: false,
              itemStyle: {
                normal: {
                  normal: {label: {show: true}},
                  emphasis: {label: {show: true}}
                }
              },
              data: this.addressOption
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
