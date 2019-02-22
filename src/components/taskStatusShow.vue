<template>


  <Tabs type="card">
    <TabPane label="进 度" style="background-color: #dff0d8;">
      <div style="text-align: center">
        <div id="myChart" :style="{width: '550px', height: '400px'}"></div>
        <Row>
        <Col span="12" style="text-align: center">
          <div style="line-height: 40px;margin-bottom: 30px">
            <p class="data-key">已呼叫时间(H:M:S)</p>
            <p class="data-value">{{taskInfo.elapsedTime}}</p>
          </div>
        </Col>
        <Col span="12" style="text-align: center">
          <div style="line-height: 40px;margin-bottom: 30px">
            <p class="data-key">剩余呼叫时间(S)</p>
            <p class="data-value">{{taskInfo.surplusTime}}</p>
          </div>
        </Col>

      </Row>
      </div>

    </TabPane>
    <TabPane label="详 情" style="background-color: #dff0d8;">
      <Row>
        <Col span="12" style="text-align: center">
          <div style="line-height: 40px;margin-bottom: 30px;margin-top: 10px">
            <p class="data-key">当前呼叫数</p>
            <p class="data-value">{{taskInfo.currentCallNum}}</p>
          </div>
        </Col>
        <Col span="12" style="text-align: center">
          <div style="line-height: 40px;margin-bottom: 30px; margin-top: 10px">
            <p class="data-key">当前呼叫频率(cps)</p>
            <p class="data-value">{{taskInfo.callRate}}</p>
          </div>
        </Col>

      </Row>
      <Row>
        <Col span="12" style="text-align: center">
          <div style="line-height: 40px;margin-bottom: 30px">
            <p class="data-key">当前响应时间</p>
            <p class="data-value">{{taskInfo.responseTime}}</p>
          </div>
        </Col>
        <Col span="12" style="text-align: center">
          <div style="line-height: 40px;margin-bottom: 30px">
            <p class="data-key">平均接通率</p>
            <p class="data-value">{{taskInfo.asr}}</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span="12" style="text-align: center">
          <div style="line-height: 40px;margin-bottom: 30px">
            <p class="data-key">平均呼叫时长(s)</p>
            <p class="data-value">{{taskInfo.avgCallLength}}</p>
          </div>
        </Col>
        <Col span="12" style="text-align: center">
          <div style="line-height: 40px;margin-bottom: 30px">
            <p class="data-key">通话总时长</p>
            <p class="data-value">{{taskInfo.callLength}}</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span="12" style="text-align: center">
          <div style="line-height: 40px;margin-bottom: 20px">
            <p class="data-key">总呼叫数</p>
            <p class="data-value">{{taskInfo.totalCallCreatedNum}}</p>
          </div>
        </Col>
        <Col span="12" style="text-align: center">
          <div style="line-height: 40px;margin-bottom: 20px">
            <p class="data-key">呼叫成功数</p>
            <p class="data-value">{{taskInfo.successfulCallNum}}</p>
          </div>
        </Col>
      </Row>

    </TabPane>
    <TabPane label="参 数" style="background-color: #dff0d8;">
      <Row>
        <Col span="12" style="text-align: center">
          <div style="line-height: 40px;margin-bottom: 30px;margin-top: 10px">
            <p class="data-key">呼叫路由</p>
            <p class="data-value">{{taskInfo.callRoute}}</p>
          </div>
        </Col>
        <Col span="12" style="text-align: center">
          <div style="line-height: 40px;margin-bottom: 30px;margin-top: 10px">
            <p class="data-key">起始并发数</p>
            <p class="data-value">{{taskInfo.beginConcurrentNum}}</p>
          </div>
        </Col>

      </Row>
      <Row>
        <Col span="12" style="text-align: center">
          <div style="line-height: 40px;margin-bottom: 30px">
            <p class="data-key">xml脚本</p>
            <p class="data-value">{{taskInfo.xmlScript}}</p>
          </div>
        </Col>
        <Col span="12" style="text-align: center">
          <div style="line-height: 40px;margin-bottom: 30px">
            <p class="data-key">csv脚本</p>
            <p class="data-value">{{taskInfo.csvScript|toZn}}</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span="12" style="text-align: center">
          <div style="line-height: 40px;margin-bottom: 30px">
            <p class="data-key">呼叫总时长(s)</p>
            <p class="data-value">{{taskInfo.lastForCallTime}}</p>
          </div>
        </Col>
        <Col span="12" style="text-align: center">
          <div style="line-height: 40px;margin-bottom: 30px">
            <p class="data-key">呼叫丢包率(%)</p>
            <p class="data-value">{{taskInfo.lostRate|toZn}}</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span="12" style="text-align: center">
          <div style="line-height: 40px;margin-bottom: 20px">
            <p class="data-key">递增规则</p>
            <p class="data-value">{{taskInfo.increase|toZn}}</p>
          </div>
        </Col>
        <Col span="12" style="text-align: center">
          <div style="line-height: 40px;margin-bottom: 20px">
            <p class="data-key">递减规则</p>
            <p class="data-value">{{taskInfo.decrease|toZn}}</p>
          </div>
        </Col>
      </Row>
    </TabPane>
  </Tabs>
</template>


<script>
  export default {
    name: "taskStatusShow",
    data() {
      return {
      }
    },
    props: ['taskInfo'],

    methods: {
      myChart(completionRate) {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'));
        var option = {
          tooltip: {
            formatter: "{a} <br/>{b} : {c}%"
          },
          toolbox: {
            show: false,
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
        option.series[0].data[0].value = completionRate;//(Math.random() * 100).toFixed(2) - 0;
        myChart.setOption(option, true);
        //}, 2000)
      },

    },

    mounted() {
        this.myChart(this.taskInfo.completionRate)

    }
  }
</script>

<style scoped>
  .data-value {
    color: #3c763d;
    font-size: large;
  }

  .data-key {
    font-size: larger;
    color: #000;
  }
</style>
