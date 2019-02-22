<template>
    <Row>
      <Col :span="8">
        <div class="grid-content bg-purple" style="margin-right: 30px;margin-bottom: 20px">
          <div style="float:left;width: 40%;">

          </div>
          <div style="float:right ;width: 60%;background: #fff;border: #DDD 1px solid;">
            <div style="line-height: 20px"><span style="margin-right: 10px;float: right">{{sysData.cpu_rate}}%
              <i :class="['fa fa-arrow-'+sysData.cpu_status]" aria-hidden="true"></i></span>
              <!--这里用中括号将字符串与变量拼接起来组成动态图标-->
              <div style="clear: both"></div>
            </div>
            <div style="height: 70px;line-height: 30px;text-align: left">
              <div style="height: 35px;margin-left: 30px">{{sysData.currCpu}}%</div>
              <div style="height: 35px;margin-left: 30px">cpu使用率</div>
            </div>

          </div>
          <div style="clear: both"></div>
        </div>
      </Col>

      <Col :span="8">
        <div class="grid-content bg-purple" style="margin-right: 30px;">
          <div style="float:left;width: 40%;">

            <div style="clear: both"></div>

          </div>
          <div style="float:right ;width: 60%;background: #fff;border: #DDD 1px solid;">
            <div style="line-height: 20px"><span style="margin-right: 10px;float: right">{{sysData.mem_rate}}%
            <i :class="['fa fa-arrow-'+sysData.mem_status]" aria-hidden="true"></i>
            </span>
              <div style="clear: both"></div>
            </div>
            <div style="height: 70px;line-height: 40px;text-align: left">
              <div style="height: 35px;margin-left: 30px">{{sysData.currMem}}%</div>
              <div style="height: 35px;margin-left: 30px">内存使用率</div>
            </div>

          </div>
          <div style="clear: both"></div>
        </div>
      </Col>

      <Col :span="8">
        <div class="grid-content bg-purple" style="margin-right: 30px;">
          <div style="float:left;width: 40%;"></div>
          <div style="float:right ;width: 60%;background: #fff;border: #DDD 1px solid;">
            <div style="line-height: 20px"><span style="margin-right: 10px;float: right">{{sysData.disk_rate}}%
            <i :class="['fa fa-arrow-'+sysData.disk_status]" aria-hidden="true"></i>
            </span>
              <div style="clear: both"></div>
            </div>
            <div style="height: 70px;line-height: 40px;text-align: left">
              <div style="height: 35px;margin-left: 30px">{{sysData.currDisk}}%</div>
              <div style="height: 35px;margin-left: 30px">当前磁盘使用率</div>
            </div>

          </div>
          <div style="clear: both"></div>
        </div>
      </Col>


    </Row>

    <Row>

      <Col :span="8">
        <div class="grid-content bg-purple" style="margin-right: 30px;margin-bottom: 20px">
          <div style="float:left;width: 40%;"></div>
          <div style="float:right ;width: 60%;background: #fff;border: #DDD 1px solid;">
            <div style="line-height: 20px"><span style="margin-right: 10px;float: right">{{sysData.rx_rate}}
            <i :class="['fa fa-arrow-'+sysData.rx_status]" aria-hidden="true"></i>
            </span>
              <div style="clear: both"></div>
            </div>
            <div style="height: 70px;line-height: 40px;text-align: left">
              <div style="height: 35px;margin-left: 30px">{{sysData.curr_rx}}</div>
              <div style="height: 35px;margin-left: 30px">当前上行网络流量</div>
            </div>

          </div>
          <div style="clear: both"></div>
        </div>
      </Col>

      <Col :span="8">
        <div class="grid-content bg-purple" style="margin-right: 30px;">
          <div style="float:left;width: 40%;">

            <div style="clear: both"></div>

          </div>
          <div style="float:right ;width: 60%;background: #fff;border: #DDD 1px solid;">
            <div style="line-height: 20px"><span style="margin-right: 10px;float: right">{{sysData.tx_rate}}
            <i :class="['fa fa-arrow-'+sysData.tx_status]" aria-hidden="true"></i>
            </span>
              <div style="clear: both"></div>
            </div>
            <div style="height: 70px;line-height: 40px;text-align: left">
              <div style="height: 35px;margin-left: 30px">{{sysData.curr_tx}}</div>
              <div style="height: 35px;margin-left: 30px">当前下行网络流量</div>
            </div>

          </div>
          <div style="clear: both"></div>
        </div>
      </Col>

    </Row>
</template>

<script>
    export default {
        name: "workbencgbackup"
    }
</script>

<style scoped>

</style>
