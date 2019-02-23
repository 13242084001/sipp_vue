<template>
  <Form :model="formLeft" label-position="left" :label-width="85">
    <FormItem label="任务名称">
      <Input v-model="formLeft.taskName"></Input>
    </FormItem>
    <FormItem label="呼叫路由">
      <Select v-model="formLeft.callRoute" filterable style="width:200px" @on-open-change="getRouteOptions">
        <Option v-for="item in options" :value="item.value" :key="item.id">{{ item.value }}
        </Option>
      </Select>
    </FormItem>
    <Row>
      <Col span="11">
        <FormItem label="xml脚本">
          <Select filterable clearable v-model="formLeft.xmlScript" @on-open-change="getSciptList('xml')">
            <Option v-for="(item, index) in xmlScriptList" :value="item.fileName"
                    :key="index">{{ item.fileName }}
            </Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="2">&nbsp;</Col>
      <Col span="11">
        <FormItem label="csv脚本">
          <Select filterable clearable v-model="formLeft.csvScript" @on-open-change="getSciptList('csv')">
            <Option v-for="(item, index) in csvScriptList" :value="item.fileName"
                    :key="index">{{ item.fileName }}
            </Option>
          </Select>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="11">
        <FormItem label="呼叫并发数">
          <Input number v-model="formLeft.beginConcurrentNum"></Input>
        </FormItem>
      </Col>
      <Col span="2">&nbsp;</Col>
      <Col span="11">
        <FormItem label="呼叫丢包率">
          <Input number v-model="formLeft.lostRate"></Input>
        </FormItem>

      </Col>
    </Row>
    <FormItem label="呼叫类型">
      <RadioGroup v-model="formLeft.callType">
        <Radio label="1">普通类型
        </Radio>
        <Radio label="2">自定义类型
        </Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="呼叫时长">
      <Input number v-model="formLeft.lastForCallTime"></Input>
    </FormItem>
    <Row v-if="formLeft.callType==='2'">
      <Col span="11">
        <FormItem label="开始递增时间">
          <DatePicker v-model="formLeft.increaseTime" type="datetime" placeholder="Select date and time"
                      style="width: 200px"></DatePicker>
        </FormItem>
      </Col>
      <Col span="2">&nbsp;</Col>
      <Col span="11">
        <FormItem label="新呼叫并发数">
          <Input number v-model="formLeft.increaseConNum"></Input>
        </FormItem>

      </Col>
    </Row>

    <Row v-if="formLeft.callType==='2'">
      <Col span="11">
        <FormItem label="开始递减时间">
          <DatePicker v-model="formLeft.decreaseTime" type="datetime" placeholder="Select date and time"
                      style="width: 200px"></DatePicker>
        </FormItem>
      </Col>
      <Col span="2">&nbsp;</Col>
      <Col span="11">
        <FormItem label="新呼叫并发数">
          <Input number v-model="formLeft.decreaseConNum"></Input>
        </FormItem>

      </Col>
    </Row>
  </Form>
</template>

<script>
  export default {
    name: "sipp",
    props: ["formData"],
    data() {
      return {
        xmlScriptList: [],
        csvScriptList: [],
        options: {},
        formLeft: {
          taskName: '',
          callRoute: '',
          xmlScript: '',
          csvScript: '',
          beginConcurrentNum: null,
          lostRate: null,
          callType: "1",
          lastForCallTime: null,
          increaseTime: null,
          increaseConNum: null,
          decreaseTime: null,
          decreaseConNum: null,
      },
      }
    },


    methods: {
      dateFormat: function (value) {
        if (value) {
          var dateee = new Date(value).toJSON();
          return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
        }else {
          return null
        }
      },
      getRouteOptions() {
        this.optionsIsOpen = !this.optionsIsOpen;
        if (this.optionsIsOpen) {
          var that = this;
          this.$axios.request({
            url: process.env.URL_PATH+"/TaskStatus!getRouteOptions",
            method: "get",
          }).then(function (ret) {
            if (ret.data.code === 10000) {
              that.options = ret.data.data;
            } else {
              that.$Message.error(ret.data.error)
            }
          })
        }

      },
      getSciptList(type) {

        this.optionsIsOpen = !this.optionsIsOpen;
        if (this.$store.state.CurrentPath && this.optionsIsOpen) {

          var that = this;
          this.$axios.request({
            url: process.env.URL_PATH+"/SippScript!ScriptInfo", //{"order":"asc","limit":10,"offset":0,"dirPath":["admin"],"type":".xml"}
            method: "post",
            params: {},
            data: {
              "dirPath": that.$store.state.CurrentPath,
              "order": "asc",
              "limit": null,
              "offset": 0,
              "type": type

            }
          }).then(function (ret) {
            //console.log(ret.data);
            if (ret.data.code === 10000) {
              //console.log(ret.data);
              if (type === 'xml') {
                that.xmlScriptList = ret.data.result.list;
              } else {
                that.csvScriptList = ret.data.result.list;
              }

            } else {
              that.$Message.error(ret.data.error)
            }
          })
        } else if (this.optionsIsOpen) {
          this.$Message.info('请选择查询目录')
        }

      },

      newTask() {
        var that = this;

        if (this.formLeft.callType === '1') {
          var data = {
            taskName: that.formLeft.taskName,
            callRoute: that.formLeft.callRoute,
            xmlScript: that.formLeft.xmlScript,
            csvScript: that.formLeft.csvScript,
            beginConcurrentNum: that.formLeft.beginConcurrentNum,
            lostRate: that.formLeft.lostRate,
            lastForCallTime: that.formLeft.lastForCallTime,
            callType: that.formLeft.callType,
            dirPath: that.$store.state.CurrentPath
          }
        } else {
          var data = {
            taskName: that.formLeft.taskName,
            callRoute: that.formLeft.callRoute,
            xmlScript: that.formLeft.xmlScript,
            csvScript: that.formLeft.csvScript,
            beginConcurrentNum: that.formLeft.beginConcurrentNum,
            lostRate: that.formLeft.lostRate,
            lastForCallTime: that.formLeft.lastForCallTime,
            callType: that.formLeft.callType,
            increaseTime: that.dateFormat(that.formLeft.increaseTime),
            increaseConNum: that.formLeft.increaseConNum,
            decreaseTime: that.dateFormat(that.formLeft.decreaseTime),
            decreaseConNum: that.formLeft.decreaseConNum,
            dirPath: that.$store.state.CurrentPath
          }
        }
        this.$axios.request({
          url: process.env.URL_PATH+'/TaskStatus!newTask',
          method: 'post',
          params: {},
          data: data
        }).then(function (ret) {
          if (ret.data.code === 10000) {
            that.$Message.success('创建任务成功！');
            that.$emit('watchChild');
          } else {
            that.$Message.error(ret.data.error);
          }
        })
      },
    initData() {
        this.formLeft = {
          taskName: '',
          callRoute: '',
          xmlScript: '',
          csvScript: '',
          beginConcurrentNum: null,
          lostRate: null,
          callType: "1",
          lastForCallTime: null,
          increaseTime: null,
          increaseConNum: null,
          decreaseTime: null,
          decreaseConNum: null,
        };
      },
    },

  }
</script>

<style scoped>

</style>
