<template>
  <div>

    <div style="margin: 20px 20px 20px 0;line-height: 20px">

      <!--<Button type="info" style="float: left;" @click="refresh"><i class="fa fa-refresh fa-lg" aria-hidden="true"></i>
      </Button>-->
      <div style="clear: both"></div>
    </div>

    <Row>
      <Col span="12">
        <div id="myChart3" :style="{width: '500px', height: '300px'}">

        </div>
      </Col>
      <Col span="12">
        <div id="myChart2" :style="{width: '500px', height: '260px'}">

        </div>
      </Col>
    </Row>

    <div id="myChart1" :style="{width: 100, height: '300px'}">

    </div>

  </div>

</template>

<script>
  import * as echarts from "echarts";

  export default {
    name: "workbench",
    data() {
      return {
        msg: '我是workbench',
        timer: null
        //cpuRate: [],
        //countTime: [],
        //currentCallNum: []

      }
    },
    methods: {
      refresh() {
        var that = this;
        this.$axios.request({
          url: process.env.URL_PATH+"/WorkBench!getDate",
          method: "get"
        }).then(function (ret) {
          console.log(ret);
          if (ret.data.code === 10000) {
            //that.currCpu = ret.data.data.currCpu;
            //that.currMem = ret.data.data.currMem;
            //that.currDisk = ret.data.data.currDisk;
            //that.cpu_rate = ret.data.data.cpu_rate;
            //Object.keys(ret.data.data).forEach(function (key,) {
            that["sysData"] = ret.data.data.sysData;
            //console.log(key, that[key]);
            that.myChart3(ret.data.data.currCpu, ret.data.data.currMem, ret.data.data.currDisk, ret.data.data.sysTime,
              ret.data.data.currentConNum, ret.data.data.currentCps);
            that.myChart1(ret.data.data.currentCallNum, ret.data.data.countTime, ret.data.data.taskName, ret.data.data.callRate);
            that.myChart2(ret.data.data.curr_rx, ret.data.data.curr_tx, ret.data.data.sysTime);
          }
        })

      },
      myChart3(currCpu, currMem, currDisk, sysTime, currentConNum, currentCps) {
        let myChart = this.$echarts.init(document.getElementById('myChart3'));
        var option = {
          title: {
            text: '系统监控信息',
            subtext: '纯属虚构'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['cpu占用率', '内存占用率', '磁盘占用率', 'sip并发数', 'cps']
          },
          toolbox: {
            show: false,
            feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          calculable: true,
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: sysTime
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: 'cpu(%)',
              type: 'line',
              smooth: true,
              itemStyle: {normal: {areaStyle: {type: 'default'}}},
              data: currCpu
            },
            {
              name: '内存(%)',
              type: 'line',
              smooth: true,
              itemStyle: {normal: {areaStyle: {type: 'default'}}},
              data: currMem
            },
            {
              name: '磁盘(%)',
              type: 'line',
              smooth: true,
              itemStyle: {normal: {areaStyle: {type: 'default'}}},
              data: currDisk
            },
            {
              name: 'sip并发数',
              type: 'line',
              smooth: true,
              itemStyle: {normal: {areaStyle: {type: 'default'}}},
              data: currentConNum
            },
            {
              name: 'cps',
              type: 'line',
              smooth: true,
              itemStyle: {normal: {areaStyle: {type: 'default'}}},
              data: currentCps
            },
          ]
        };
        myChart.setOption(option, true);
      },
      myChart1(currentCallNum, countTime, taskName, callRate) {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart1'));
        var date = countTime;
        var data = currentCallNum;


        var option = {
          tooltip: {
            trigger: 'axis',
            position: function (pt) {
              return [pt[0], '10%'];
            }
          },
          title: {
            left: 'center',
            text: taskName + '并发数及cps',
          },
          toolbox: {
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              restore: {},
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: date
          },
          yAxis: {
            type: 'value',
            boundaryGap: [0, '100%']
          },
          dataZoom: [{
            type: 'inside',
            start: 0,
            end: 100
          }, {
            start: 0,
            end: 10,
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
              color: '#fff',
              shadowBlur: 3,
              shadowColor: 'rgba(0, 0, 0, 0.6)',
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
          }],
          series: [
            {
              name: "在线呼叫数",
              type: 'line',
              smooth: true,
              symbol: 'none',
              sampling: 'average',
              itemStyle: {
                color: 'rgb(255, 70, 131)'
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgb(255, 158, 68)'
                }, {
                  offset: 1,
                  color: 'rgb(255, 70, 131)'
                }])
              },
              data: data
            },
            {
              name: "cps",
              type: 'line',
              smooth: true,
              symbol: 'none',
              sampling: 'average',
              itemStyle: {
                color: 'rgb(62,152, 197)'
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgb(62,152, 197)'
                }, {
                  offset: 1,
                  color: 'rgb(62,152, 197)'
                }])
              },
              data: callRate
            },
          ]
        };
        myChart.setOption(option, true);
      },

      myChart0(cpuRate) {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart1'));
        var option = {
          tooltip: {
            formatter: "{a} <br/>{b} : {c}%"
          },
          toolbox: {
            feature: {
              restore: {},
              saveAsImage: {}
            }
          },
          series: [
            {
              name: '任务进度',
              type: 'gauge',
              detail: {formatter: '{value}%'},
              data: [{value: 50, name: '完成率'}]
            }
          ]
        };

        //clearInterval(timeTicket);
        //var timeTicket = setInterval(function () {
        option.series[0].data[0].value = cpuRate;//(Math.random() * 100).toFixed(2) - 0;
        myChart.setOption(option, true);
        //}, 2000)
      },

      myChart2(curr_rx, curr_tx, sysTime) {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart2'));
        myChart.setOption({
          title: {
            text: '系统流量监控图',
            x: 'center'
          },
          tooltip: {
            trigger: 'axis',
            formatter: function (params) {
              return params[0].name + '<br/>'
                + params[0].seriesName + ' : ' + params[0].value + ' (KB)<br/>'
                + params[1].seriesName + ' : ' + -params[1].value + ' (KB)';
            }
          },
          legend: {
            data: ['上行带宽', '下行带宽'],
            x: 'left'
          },
          toolbox: {
            show: false,
            feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar']},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          dataZoom: {
            show: true,
            realtime: true,
            start: 0,
            end: 100
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              axisLine: {onZero: false},
              data: sysTime//['2009/6/12 2:00', '2009/6/12 3:00', '2009/6/12 4:00', '2009/6/12 5:00', '2009/6/12 6:00', '2009/6/12 7:00']
            }
          ],
          yAxis: [
            {
              name: '上行带宽(KB/s)',
              type: 'value',
              max: 100000000
            },
            {
              name: '下行带宽(KB/s)',
              type: 'value',
              axisLabel: {
                formatter: function (v) {
                  return -v;
                }
              }
            }
          ],
          series: [
            {
              name: '上行带宽',
              type: 'line',
              itemStyle: {normal: {areaStyle: {type: 'default'}}},
              data: curr_rx//[0,0,0.23,0,0,0.14],
            },
            {
              name: '下行带宽',
              type: 'line',
              yAxisIndex: 1,
              itemStyle: {normal: {areaStyle: {type: 'default'}}},
              data: (function (curr_tx) {
                var oriData = curr_tx;//[0,0,0.23,0,0,0.14];
                if (oriData) {
                  var len = oriData.length;
                  while (len--) {
                    oriData[len] *= -1;
                  }
                  console.log("aaaa", oriData);
                  console.log("bbb", curr_tx);
                  return oriData;
                }
              })(curr_tx)
            }
          ]


        });
      },
    },
    mounted() {
      if (this.timer) {
        clearInterval(this.timer)
      } else {
        var that = this;
        this.timer = setInterval(function () {
          that.refresh();

        }, 2000);
      }

    },
    beforeDestroy() {
      clearInterval(this.timer);
      this.timer = null;
    }

  }
</script>

<style scoped>

  .bg-purple {
    background: #DDD;
  }

  .bg-purple-light {
    background: #DDD;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 90px;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #fff;
  }

  .yetou {
    height: 72px;
  }


</style>
