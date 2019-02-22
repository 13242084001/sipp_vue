<template>
  <Row :gutter="16" style="padding:20px">
    <Col :xs="{ span: 24}" :sm="{ span: 24}" :md="{ span: 14}" :lg="{ span: 14}">
      <div style="border: #70afc4 1px solid" >
        <div class="ivu-card-head" style="background-color: #70afc4">
        <p slot="title">sip路由配置</p>
        </div>
        <div class="ivu-card-body" >
          <div style="margin-bottom: 10px">
        <Button style="background-color: #a8bc7b; color: #fff" @click="add">添加</Button>
        <Modal v-model="Modal" title="添加">
          <a slot="close" @click="Modal=false; alertStyle.display='none';value1=value2=value3=''"><i
            class="ivu-icon ivu-icon-ios-close"></i></a>
          <div slot="footer"> <!--这里自定义的footer；因为自带的确定按钮始终会点击关闭-->
            <Button type="text" @click="Modal=false; alertStyle.display='none';value1=value2=value3=''">取消</Button>
            <Button type="success" @click="confirm">确定</Button>
          </div>
          <p><span style="color: red">*</span>&nbsp;本地sipp端口</p>
          <Select v-model="selected1" style="width:200px">
            <Option v-for="item in portList" :value="item.value" :key="item.value">{{ item.value }}</Option>
          </Select>
          <p :style="{'display':selected1?'none': '','color': 'red'}">本地sipp端口不能为空</p>

          <p style="margin-top: 10px"><span style="color: red">*</span> 对端ip地址</p>
          <Input v-model="value2" placeholder="对端ip地址"/>
          <p :style="{'display':value2?'none': '','color': 'red'}">对端地址不能为空</p>

          <p style="margin-top: 10px"><span style="color: red">*</span> 对端端口</p>
          <Input v-model="value3" placeholder="目录名"/>
          <p :style="{'display':value3?'none': '','color': 'red'}">对端sip端口不能为空</p>
        </Modal>


        <Button style="background-color: #d9534f; color: #fff" @click="showModal2">删除</Button>
        <Modal v-model="Modal2" @on-ok="deleteSipCfg">
          <p style="color:#f60;">
            <Icon type="ios-information-circle"></Icon>
            <span>确定删除吗？</span>
          </p>

        </Modal>
        </div>

        <Table stripe border ref="selection" @on-select-all="selectAll" @on-select="singleSelect"
               @on-selection-change="changeSelect" :columns="columns" :data="data">
          <template slot-scope="{ row, index }" slot="id">
            <span>{{ row.id }}</span>
          </template>

          <template slot-scope="{ row, index }" slot="localPort">
            <Input type="text" v-model="editLocalPort" v-if="editIndex === index"/>
            <span v-else>{{ row.localPort }}</span>
          </template>

          <template slot-scope="{ row, index }" slot="remoteAddress">
            <Input type="text" v-model="editRemoteAddr" v-if="editIndex === index"/>
            <span v-else>{{ row.remoteAddr }}</span>
          </template>

          <template slot-scope="{ row, index }" slot="remotePort">
            <Input type="text" v-model="editRemotePort" v-if="editIndex === index"/>
            <span v-else>{{ row.remotePort }}</span>
          </template>

          <template slot-scope="{ row, index }" slot="action">
            <div v-if="editIndex === index">
              <Button @click="handleSave(index)">保存</Button>
              <Button @click="editIndex = -1">取消</Button>
            </div>
            <div v-else>
              <Button @click="handleEdit(row, index)">编辑</Button>
            </div>
          </template>
        </Table>
        <sip-cfg-page :total="total" @watchChild="refresh"></sip-cfg-page>
        </div>
        </div>
    </Col>
    <Col :xs="{ span: 24}" :sm="{ span: 24}" :md="{ span: 10}" :lg="{ span: 10}">
      <sys-config></sys-config>
    </Col>
  </Row>
</template>

<script>
  import sipCfgPage from '@/components/sipCfgPage'
  import sysConfig from '@/components/sysConfig'

  export default {
    name: "config",
    data() {
      return {
        columns: [
          {
            type: 'selection',
            width: 60,
            align: "center",
          },
          {
            title: '本地sipp呼叫端口',
            slot: 'localPort'
          },
          {
            title: '对端ip地址',
            slot: 'remoteAddress'
          },
          {
            title: '对端sip端口',
            slot: 'remotePort'
          },
          {
            title: '操作',
            slot: 'action',
          }
        ],
        data: [],
        total: 0,
        editIndex: -1,
        editId: '',
        editLocalPort: '',
        editRemoteAddr: '',
        editRemotePort: '',
        Modal: false,
        Modal2: false,
        value1: '',
        value2: '',
        value3: '',
        portList: [], //可用本地端口列表
        selected1: '',//本地端口下拉选择框的值,
        selectedDatas: [],
        alertStyle: {
          display: "none",
          color: "red"
        }
      }
    },
    components: {
      sipCfgPage,
      sysConfig
    },
    methods: {
      handleEdit(row, index) {
        this.editId = row.id;
        this.editLocalPort = row.localPort;
        this.editRemoteAddr = row.remoteAddr;
        this.editRemotePort = row.remotePort;
        this.editIndex = index
      },
      handleSave(index) {//编辑数据并保存
        //发送axios到后端保存

        var that = this;
        this.$axios.request({
          url: process.env.URL_PATH+"/Config!UpdateSipCfg",
          method: 'post',
          params: {},
          data: {
            id: this.editId,
            localPort: this.editLocalPort,
            remoteAddr: this.editRemoteAddr,
            remotePort: this.editRemotePort,
          }
        }).then(function (ret) {
          if (ret.data.code === 10000) {
            that.$Message.success('修改成功');
            that.data[index].localPort = that.editLocalPort;
            that.data[index].remoteAddr = that.editRemoteAddr;
            that.data[index].remotePort = that.editRemotePort;
            that.editIndex = -1;
          } else {
            that.$Message.error(ret.data.error)
          }
        })
      },
      add() {
        this.Modal = true;
        var that = this;
        this.$axios.request({
          url: process.env.URL_PATH+"/Config!getUsablePortList",
          method: 'get'
        }).then(function (ret) {
          if (ret.data.code === 10000) {
            that.portList = ret.data.data;

          }
        })
      },
      //添加界面对话框的提交按钮
      confirm() {
        var that = this;
        if (this.selected1 && this.value2 && this.value3) {
          this.$axios.request({
            url: process.env.URL_PATH+"/Config!createSipCfg",
            method: "post",
            params: {},
            data: {
              localPort: that.selected1,
              remoteAddr: that.value2,
              remotePort: that.value3
            },
          }).then(function (ret) {
            if (ret.data.code === 10000) {
              that.$Message.success('添加成功');
              that.Modal = false;
              that.value = '';
              that.refresh();
            } else {
              that.$Message.error(ret.data.error)//这里应该搞个目录名不能为空
            }
          }).catch()
        } else {
          this.alertStyle.display = "";
        }
      },

      showModal2() {
        console.log(this.Modal2);
        if (this.selectedDatas.length !== 0) {
          this.Modal2 = true
        }
      },


      deleteSipCfg() {
        var selectedlist = this.selectedDatas.map((item) => item.id);//使用map遍历数组，返回一个数组
        console.log(selectedlist);
        if (selectedlist.length !== 0) {
          var that = this;
          this.$axios.request({
            url: process.env.URL_PATH+'/Config!deleteSipCfg',//删除脚本接口
            method: 'post',
            params: {},
            data: {
              deletePortList: selectedlist,
            }
          }).then(function (ret) {
            if (ret.data.code === 10000) {
              console.log('succ');
              that.refresh()

            }
          }).catch()
        } else {
          console.log(123456)
        }

      },
      refresh: function (limit = 10, offset = 0) {//获取本地端口可用列表
        var that = this;
        this.$axios.request({
          url: process.env.URL_PATH+'/Config!getSippConfig',
          method: 'post',
          params: {},
          data: {
            "order": "asc",
            "limit": limit,
            "offset": offset,
          }
        }).then(function (ret) {
          if (ret.data.code === 10000) {
            that.data = ret.data.data;
            that.total = ret.data.total;
          } else {
            that.$Message.error(ret.data.error)
          }
        })
      },


      selectAll(selection) {//这里绑定的是全选的方法，返回已选项
        this.selectedDatas = selection;
        //console.log(this.columns1);
        console.log(selection);
      },
      singleSelect(selection, row) {//单选绑定的事件，返回已选项和刚选则的项
        this.selectedDatas = selection;
        console.log(selection, row)
      },
      changeSelect(selection) {//在多选后取消某项，返回已选项
        //console.log(selection);
        this.selectedDatas = selection;
      },
    },
    created() {
      this.refresh();
    }


  }
</script>

<style scoped>
.ivu-card-head {
  background-color: #70afc4;
}
</style>
