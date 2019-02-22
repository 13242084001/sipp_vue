<template>
  <div style="border: #d9534f 1px solid">
    <div class="ivu-card-head" style="background-color: #d9534f">
      <p slot="title">服务器配置</p>
    </div>

    <div class="ivu-card-body">

      <Form label-position="top">
        <FormItem>
          <Button style="background-color: #a8bc7b; color: #fff" @click="save">保存</Button>
          <Button style="background-color: #f0ad4e; color: #fff" @click="refresh">刷新</Button>
          <Button style="background-color: #d9534f; color: #fff" @click="reset">立即重启</Button>
        </FormItem>
        <FormItem label="服务器ip地址">
          <Input v-model="input1"/>
        </FormItem>
        <FormItem label="服务器起始sip端口">
          <Input v-model="input2"></Input>
        </FormItem>
        <FormItem label="服务器可分配sip端口数">
          <Input v-model="input3"></Input>
        </FormItem>
        <FormItem label="服务器最大并发数">
          <Input v-model="input4"></Input>
        </FormItem>
      </Form>
    </div>
  </div>

</template>

<script>
  export default {
    name: "sysConfig",
    data() {
      return {

        input1: '',
        input2: '',
        input3: '',
        input4: '',
      }
    },
    methods: {
      refresh() {
        var that = this;
        this.$axios.request({
          url: process.env.URL_PATH+'/Config!getSysConfig',
          method: 'get',
        }).then(function (ret) {
          if (ret.data.code === 10000) {
            that.input1 = ret.data.data.serverIp;
            that.input2 = ret.data.data.localStartSipPort;
            that.input3 = ret.data.data.usablePortCount;
            that.input4 = ret.data.data.concurrencyNum;
            console.log(that.input1, that.input2)
          }
        })
      },
      save() {
        var that = this;
        this.$axios.request({
          url: process.env.URL_PATH+'/Config!saveSysConfig',
          method: 'post',
          params: {},
          data: {
            serverIp: that.input1,
            localStartSipPort: that.input2,
            usablePortCount: that.input3,
            concurrencyNum: that.input4
          }
        }).then(function (ret) {
          if (ret.data.code === 10000) {
            that.$Message.success('保存成功');

            that.refresh();

          }else {
            that.$Message.error(ret.data.error)
          }
        })
      },
      reset() {
        var that=this;
        this.$axios.request({
          url: process.env.URL_PATH+'/Config!reset',
          method: 'get'
        }).then(function (ret) {
          if(ret.data.code === 10000){
            that.$Message.load('正在重启');
          }else {
            that.$Message.error(ret.data.error);
          }
        })
      }
    },

    created: function () {
      this.refresh();
    }
  }
</script>

<style scoped>

</style>
