<template>

    <Row :gutter="16">
    <Col span="6">
      <a style="float: right;margin-right: 18px;line-height: 38px"
             @click="Modal=true; refresh(); "><i
            class="fa fa-plus fa-lg"
            aria-hidden="true"></i>
          </a>
          <div style="clear: both;"></div>
          <!--添加任务模态对话框-->

          <Modal v-model="Modal" title="创建任务" width="70%">
            <a slot="close" @click="changeModal"><i
              class="ivu-icon ivu-icon-ios-close"></i></a>
            <div slot="footer"> <!--这里自定义的footer；因为自带的确定按钮始终会点击关闭-->
              <Button type="text" @click="changeModal">取消</Button>
              <Button type="success" @click="confirm">确定</Button>
            </div>
            <Row :gutter="16">

              <Col span="16">
                <Tabs :animated="false">
                  <TabPane label="sipp">
                    <sipp ref="sipp" @watchChild="changeModal"></sipp>
                  </TabPane>
                  <TabPane label="python">
                    <python></python>
                  </TabPane>
                </Tabs>

              </Col>


              <Col span="8">
                <path-tree


                  :data_="this.$store.state.pathTree"

                  :depth="0"

                  @choose="chooseItem"

                  :current="currentId"
                >
                </path-tree>

              </Col>
            </Row>
          </Modal>



      <Collapse simple>
        <Panel name="1" :style="{fontSize: '13px', 'font-weight': 'bold'}">
          已完成
          <div slot="content" style="line-height: 40px;font-weight: bold;font-size: larger;color: #428bca;cursor: pointer" v-for="item in completeTaskList"
               :key="item.id" @click="getTaskInfo(item.id)">{{item.taskName}}
            <span style="float: right;margin-left: 10px;cursor: pointer" @click="del(item.taskId)"><i class="fa fa-times"
                                                                                                  aria-hidden="true"></i></span>
            <span style="float: right;cursor: pointer" @click="edit(item.id)"><i class="fa fa-pencil"
                                                                                 aria-hidden="true"></i></span>
          </div>
        </Panel>
        <Panel name="2" :style="{fontSize: '13px', 'font-weight': 'bold'}">
          未完成
          <div slot="content" style="line-height: 40px;font-weight: bold;font-size: larger;color: #428bca;cursor: pointer" v-for="item in runningTaskList"
               :key="item.id" @click="getTaskInfo(item.id)">{{item.taskName}}
            <span style="float: right;margin-left: 10px;cursor: pointer" @click="del(item.taskId)"><i class="fa fa-times"
                                                                                                  aria-hidden="true"></i></span>
            <span style="float: right;cursor: pointer" @click="edit(item.id)"><i class="fa fa-pencil"
                                                                                 aria-hidden="true"></i></span>
          </div>
        </Panel>

      </Collapse>

    </Col>
    <Col span="18">
      <Row :gutter="16">
        <Col span="8">
      <div>

        <Card style="border-bottom: none;text-align: center">
          <p slot="title"><i class="fa" :class="[pause?'fa-play': 'fa-pause'] " aria-hidden="true" style="cursor: pointer;color: #ac2925" @click="pauseOrPlay(taskInfo.id)"><span style="color: black">&nbsp;暂停</span></i>&nbsp;&nbsp;
            <i class="fa fa-stop" aria-hidden="true" style="cursor: pointer;color: #ac2925" @click="stopTask(taskInfo.id)"><span style="color: black">&nbsp;停止</span></i></p>

          <Card :bordered="false">

            <p>任务名称</p>
            <p class="data-value">{{taskInfo.taskName}}</p>
          </Card>
          <Card :bordered="false">

            <p>任务状态</p>
            <p class="data-value">{{taskInfo.taskStatus|toZn}}</p>
          </Card>
          <Card :bordered="false">

            <p>任务开始时间</p>
            <p class="data-value">{{taskInfo.startTime|toZn}}</p>
          </Card>
          <Card :bordered="false">

            <p>任务完成时间</p>
            <p class="data-value">{{taskInfo.endTime|toZn}}</p>
          </Card>
        </Card>
      </div>
    </Col>
      <Col span="16">
      <div>
        <task-status-show :taskInfo="taskInfo" ref="showCompletionRate"></task-status-show>
      </div>
    </Col>
      </Row>
    </Col>

  </Row>



</template>

<script>
  import sipp from '@/components/sipp'
  import python from '@/components/python'
  import pathTree from '@/components/pathtree'
  import taskStatusShow from '@/components/taskStatusShow'

  //import page from '@/components/page'

  export default {
    name: "TaskStatus",
    components: {
      sipp,
      python,
      pathTree,
      taskStatusShow
    },
    data() {
      return {
        currentId: '1',
        isActive: false,
        isActive2: false,
        optionsIsOpen: false,
        Modal: false,
        pause: false,

        alertStyle: {
          display: 'none',
          color: 'red'
        },
        completeTaskList: [],
        runningTaskList: [],
        taskId: '',
        taskInfo: {
          id: null,
          taskId: '-',
          taskName: '-',
          taskStatus: '-',
          startTime: '-',
          endTime: '-',
          callRoute: '-',
          beginConcurrentNum: '-',
          xmlScript: '-',
          csvScript: '-',
          lastForCallTime: '-',
          lostRate: '-',
          increase: '-',
          decrease: '-',
          completionRate: 0,
          elapsedTime: 0,
          surplusTime: 0,//剩余呼叫时间
          callLength: 0,
          totalCallCreatedNum: 0,
          successfulCallNum: 0,
          responseTime: 0,
          currentCallNum: 0,
          avgCallLength: 0,
          asr: 0,
          callRate: 0
        }

      }
    },

    methods: {
      changeModal() {
        this.Modal = false;
        this.alertStyle.display = 'none';
        this.$refs.sipp.initData();

      },
      confirm() {
        this.$refs.sipp.newTask();
      },

      chooseItem(info) {
        this.currentId = info.pathName;
        //this.currentDir = info.path;
        console.log(this.currentId)

      },
      refresh() {
        var that = this;
        this.$axios.request({
          url: process.env.URL_PATH+"/SippScript!getPathTree",
          method: "post",
          params: {},
          data: {
            dirPath: [that.$store.state.username]
          }
        }).then(function (ret) {
          //console.log(ret);
          if (ret.data.code === 10000) {
            //console.log(ret.data);
            //that.data_ = ret.data.data;
            that.$store.commit('savePathTree', ret.data.data)
          }
        })
      },
      getTaskList() {
        var that = this;
        this.$axios.request({
          url: process.env.URL_PATH+'/TaskStatus!getTaskList',
          method: 'get'
        }).then(function (ret) {
          if (ret.data.code === 10000) {
            that.completeTaskList = ret.data.data['0'];
            that.runningTaskList = ret.data.data['1']
          } else {
            that.$Message.error(ret.data.error)
          }
        })
      },
      getTaskInfo(id) {
        var that = this;
        this.$axios.request({
          url: process.env.URL_PATH+'/TaskStatus!getTaskInfo',
          method: 'post',
          params: {},
          data: {
            id: id,
          }
        }).then(function (ret) {
          if (ret.data.code === 10000) {
            that.taskInfo.id = ret.data.data.id;
            that.taskInfo.taskName = ret.data.data.taskName;
            that.taskInfo.taskStatus = ret.data.data.taskStatus;
            that.taskInfo.startTime = ret.data.data.startTime;
            that.taskInfo.endTime = ret.data.data.endTime;
            that.taskInfo.callRoute = ret.data.data.callRoute;
            that.taskInfo.lastForCallTime = ret.data.data.lastForCallTime;
            that.taskInfo.xmlScript = ret.data.data.xmlScript;
            that.taskInfo.csvScript = ret.data.data.csvScript;
            that.taskInfo.beginConcurrentNum = ret.data.data.beginConcurrentNum;
            that.taskInfo.lostRate = ret.data.lostRate;
            that.taskInfo.increase = ret.data.data.increaseTime + "|" + ret.data.data.increaseConNum;
            that.taskInfo.decrease = ret.data.data.decreaseTime + "|" + ret.data.data.decreaseConNum;
            that.taskInfo.elapsedTime = ret.data.data.elapsedTime;
            that.taskInfo.surplusTime = ret.data.data.surplusTime;
            that.taskInfo.callLength = ret.data.data.callLength;
            that.taskInfo.totalCallCreatedNum = ret.data.data.totalCallCreatedNum;
            that.taskInfo.successfulCallNum = ret.data.data.successfulCallNum;

            //that.taskInfo.completionRate = ret.data.data.completionRate;
            that.$refs.showCompletionRate.myChart(ret.data.data.completionRate);
            that.taskInfo.responseTime = ret.data.data.responseTime;
            that.taskInfo.currentCallNum = ret.data.data.currentCallNum;
            that.taskInfo.avgCallLength = ret.data.data.avgCallLength;
            that.taskInfo.asr = ret.data.data.asr;
            that.taskInfo.callRate = ret.data.data.callRate;
          } else {
            that.$Message.error(ret.data.error)
          }
        })
      },
      del(taskId) {
        var that = this;
        this.$axios.request({
          url: process.env.URL_PATH+'/TaskStatus!delTask',
          method: 'post',
          params: {},
          data: {
            taskId: taskId,
          }
        }).then(function (ret) {
          if (ret.status === 200) {
            that.$Message.success('删除成功');
            that.getTaskList();
            that.getTaskInfo();
          }
        })
      },

      pauseOrPlay(id) {
        var that=this;
        if(!this.pause) {//暂停
          var action = "pause";
        }else {
          var action = "play";
        }
        this.$axios.request({
            url: process.env.URL_PATH+"/TaskStatus!handleTask",
            method: "post",
            params: {},
            data: {
              id: id,
              action: action
            }
          }).then(function (ret) {
            if(ret.data.code===10000){
              that.pause = !that.pause;
              that.$Message.success('操作成功')
            }else {
              that.$Message.info(ret.data.error)
            }
          })
      },
      stopTask(id) {
        var that=this;
        this.$axios.request({
            url: process.env.URL_PATH+"/TaskStatus!handleTask",
            method: "post",
            params: {},
            data: {
              id: id,
              action: "stop"
            }
          }).then(function (ret) {
            if(ret.data.code===10000){
            }else {
              that.$Message.info(ret.data.error)
            }
          })
      }


    },
    created() {
      this.getTaskList();
      this.getTaskInfo();
    }
  }
</script>

<style scoped>
  .ivu-collapse-content {
    color: #515a6e;
    padding: 0;
    background-color: #fff;
  }

  .data-value {
    color: #000;
    font-size: larger;
    font-weight: bold;
  }
</style>
