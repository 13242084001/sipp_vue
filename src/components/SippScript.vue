<template>

  <Row :gutter="16">
    <Col span="6">
      <Button type="success" @click="Modal=true">添加</Button>
      <Modal v-model="Modal" title="新增目录">
        <a slot="close" @click="Modal=false; alertStyle.display='none';value=''"><i class="ivu-icon ivu-icon-ios-close"></i></a>
        <div slot="footer"> <!--这里自定义的footer；因为自带的确定按钮始终会点击关闭-->
          <Button type="text" @click="Modal=false; alertStyle.display='none';value=''">取消</Button>
          <Button type="success" @click="confirm">确定</Button>
        </div>
        <p><span style="color: red">*</span>&nbsp;目录名</p>
        <Input v-model="value" @input="value?alertStyle.display: 'none'" placeholder="目录名"/> <!--这里当input输入有值时，应将display：none-->
        <p :style="alertStyle">目录名不能为空</p>
      </Modal>
      <Button type="error" @click="Modal2=true">删除</Button>
      <Modal v-model="Modal2" @on-ok="deleteConfirm">
        <p style="color:#f60;">
          <Icon type="ios-information-circle"></Icon>
          <span>确定删除吗？</span>
        </p>

      </Modal>

      <path-tree


        :data_="this.$store.state.pathTree"

        :depth="0"

        @choose="chooseItem"

        :current="currentId"
      >

      </path-tree>
      <Upload
        multiple
        type="drag"
        :format="['xml','csv','pcap']"
        :on-format-error="handleFormatError"
        :max-size="10240"
        :on-exceeded-size="handleMaxSize"
        :on-success="handleSuccess"
        :headers="headers"
        :data="data"
        :action="upload_url"
      style="margin-top: 30px">
        <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>选择目录上传文件{{data2}}</p>
        </div>
    </Upload>
    </Col>

    <Col span="18">
      <!--<Button type="error" ghost @click="deleteAll">批量删除</Button>-->
      <!--<Table stripe border ref="selection" @on-select-all="selectAll" @on-select="singleSelect" @on-selection-change="changeSelect" height="200" :columns="columns1" :data="this.$store.state.ScriptData"></Table>-->
      <p v-html="currentDir"></p>
      <script-table @watchChild="parentRecived"></script-table>
      <page></page>
    </Col>
  </Row>


  <!--<div class="grid-content bg-purple" style="border: #ddd 1px solid;color: #428bca;margin: 10px 20px 30px 20px">

      <!--<div v-for="(menuItem,index) in data_.nodes" :key="index">-->





</template>

<script>
  import pathTree from '@/components/pathtree'
  import scriptTable from '@/components/scriptTable'
  import page from '@/components/page'

  export default {
    name: "SippScript", //在父组件中可以动态绑定属性值
    data() {
      return {
        //data_: this.$store.state.pathTree,//{"pathName":"Script","nodes":[{"pathName":"doris","nodes":[],"tags":1,"pid":1,"id":1},{"pathName":"admin","nodes":[{"pathName":"aaa","nodes":[{"pathName":"ccc","nodes":[],"tags":0}],"tags":1,"state":{"expanded":true,"checked":false,"selected":false}}],"tags":2,"state":{"expanded":true,"checked":false,"selected":false},"pid":1,"id":2},{"pathName":"andy","nodes":[],"tags":0,"pid":1,"id":3}],"tags":0,"state":{"expanded":true,"checked":false,"selected":false},"pid":null,"id":1},

        //dirName: '',
        currentId: '',
        currentDir: '',
        Modal: false,
        Modal2: false,
        value: '',
        selectedDatas: [],//所有选中的数据
        alertStyle: {
          display: 'none',
          color: 'red'
        },
        headers: {
              Authorization: this.$store.state.token
            },
            data: {
              dstpath: ''//可以直接用currentDir
            },
            upload_url: process.env.URL_PATH+'/SippScript!upload',
      }
    },

    components: {
      pathTree, //注册子组件
      scriptTable,
      page
    },
    methods: {
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

      chooseItem(info) {
        this.currentId = info.pathName;
        this.currentDir = info.path;
        console.log(this.currentId)

      },
      parentRecived() {
        this.refresh();
      },
      confirm() {
        var that = this;
        if (this.value) {
          this.$axios.request({
            url: process.env.URL_PATH+"/SippScript!newDir",
            method: "post",
            params: {},
            data: {
              dirName: that.value,
              dirPath: that.$store.state.CurrentPath,
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
      deleteConfirm() {
        var that = this;

        this.$axios.request({
          url: process.env.URL_PATH+"/SippScript!DeleteDir",
          method: "post",
          params: {},
          data: {
            dirPath: that.$store.state.CurrentPath,
          },
        }).then(function (ret) {
          if (ret.data.code === 10000) {
            that.$Message.success('删除成功');
            that.Modal2 = false;
            that.refresh();
          } else {
            that.$Message.error(ret.data.error)//这里应该搞个目录名不能为空
          }
        }).catch()
      },

      handleFormatError (file) {
          this.$Notice.warning({
            title: '文件格式不正确',
            desc: file.name + '格式不正确，请选择.xml .csv .pcap'
          });
        },//这是处理上传文件格式的方法
      handleMaxSize (file) {
                this.$Notice.warning({
                    title: '文件大小限制',
                    desc: '文件' + file.name + '太大, 不能超过10M.'
                });
            },//这是处理上传文件大小的方法

      handleSuccess () {
                this.refresh();
            },

    },
    mounted() {
      this.refresh();
    },
    computed: {
          data2() {
            this.data.dstpath = this.$store.state.CurrentPath;
            return null
          }
      },
  }
</script>

<style scoped>
.alertStyle {
          display: none;
          color: red;
        }
.alertStyle1 {
          color: red;
}
</style>
