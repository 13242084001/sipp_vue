<template>
  <div>

    <Button type="error" ghost @click="deleteScript">批量删除</Button>
    <Button type="error" ghost @click="download">下载文件</Button>
    <Table stripe border ref="selection" @on-select-all="selectAll" @on-select="singleSelect"
           @on-selection-change="changeSelect" height="200" :columns="columns1"
           :data="this.$store.state.ScriptData"></Table>

    <Modal v-model="Modal" title="编辑脚本" width="70%">
      <a slot="close" @click="changeModal"><i
        class="ivu-icon ivu-icon-ios-close"></i></a>
      <div slot="footer"> <!--这里自定义的footer；因为自带的确定按钮始终会点击关闭-->
        <Button type="text" @click="changeModal">取消</Button>
        <Button type="success" @click="confirm">确定</Button>
      </div>

      <quill-editor
        v-model="content"
        ref="myQuillEditor"
        @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
        @change="onEditorChange($event)">
      </quill-editor>


    </Modal>


  </div>

  <!--tatal:数据总条数；current：当前页码; page-size：每页显示条数; placement: 条数切展开弹框方向;-->
  <!--on-change: 页码改变的回调，返回改变后的页码；on-page-size-change: 切换显示每页条数，返回每页条数-->
</template>

<script>
  import page from '@/components/page'

  export default {
    name: "scriptTable",
    components: {
      page
    },
    data() {
      return {
        columns1: [
          {
            type: 'selection',//这是多选列
            width: 60,
            align: 'center'
          },
          {
            title: '脚本名称',
            key: 'fileName',
            render: (h, params) => {
              return h('div', [
                h('Icon', {
                  props: {
                    type: 'Script'
                  }
                }),
                h('strong', params.row.fileName)
              ]);
            },
            filters: [ //这是在脚本名称字段新增一个过滤器
              {
                label: '.xml',
                value: 1
              },
              {
                label: '.csv',
                value: 2
              },
              {
                label: '.pcap',
                value: 3
              },

            ],
            filterMultiple: false,
            filterMethod(value, row) {
              if (value === 1) {
                console.log(row.fileName.split('.').pop());
                return row.fileName.split('.').pop() === 'xml';
              } else if (value === 2) {
                return row.fileName.split('.').pop() === 'csv';
              } else {
                return row.fileName.split('.').pop() === 'pcap';
              }
            },
          },
          {
            title: '创建时间',
            key: 'CreateTime'
          },
          {
            title: '修改时间',
            key: 'ModifyTime',
            sortable: true
          },
          {
            title: '文件大小',
            key: 'Size'
          },

          {
            title: '操作',//自定义列
            key: 'action',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                    marginLeft: '10px'
                  },
                  on: {
                    click: () => {
                      this.show(params.index)
                    }
                  }
                }, 'View'),
                h('span', {//这里是单行删除
                    style: {
                      fontSize: '20px',
                      color: '#19be6b',
                      marginRight: '20px'
                    },
                    domProps: {
                      innerHTML: "<i class=\"fa fa-pencil\" aria-hidden=\"true\" style='margin-left: 10px;cursor: pointer'></i>"//这里是自定义的图标
                    },
                    on: {
                      click: () => {
                        console.log(params.row.fileName);
                        this.Modal = true;
                        //this.deleteScript();
                        this.viewScript(params.row.fileName)//这里还要绑定axios，发送post，后端删除

                      }
                    }
                  },
                )//这里怎么把字符串替换成图标？

              ]);
            }
          }


        ],
        ScriptData: [],
        selectedDatas: [],//所有选中的数据
        Modal: false,
        content: '',

      }
    },
    methods: {
      show(index) {
        this.$Modal.info({
          title: 'User Info',
          content: `脚本名称：${this.$store.state.ScriptData[index].fileName}<br>创建时间：${this.$store.state.ScriptData[index].CreateTime}<br>修改时间：${this.$store.state.ScriptData[index].ModifyTime}<br>文件大小：${this.$store.state.ScriptData[index].Size}`
        })
      },
      remove(index) {
        this.$store.state.ScriptData.splice(index, 1);
      },
      selectAll(selection) {//这里绑定的是全选的方法，返回已选项
        this.selectedDatas = selection;
        console.log(this.columns1);
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
      deleteScript() {
        var selectedlist = this.selectedDatas.map((item) => item.fileName);//使用map遍历数组，返回一个数组
        console.log(selectedlist);
        if (selectedlist.length !== 0) {
          var that = this;
          this.$axios.request({
            url: process.env.URL_PATH + '/SippScript!DeleteScript',//删除脚本接口
            method: 'post',
            params: {},
            data: {
              dirPath: that.$store.state.CurrentPath,
              script_list: selectedlist,
            }
          }).then(function (ret) {
            if (ret.data.code === 10000) {
              console.log('succ');
              //var indexList = that.selectedDatas.map((item) =>that.$store.state.ScriptData.findIndex(function (obj) {
              //console.log(obj.fileName, item.fileName);//找到脚本对象数组中要删除的对象的index
              //return obj.fileName === item.fileName
              //}));
              //console.log(indexList);
              that.selectedDatas.forEach((item) => {
                console.log("####", item);
                console.log(that.$store.state.ScriptData);
                var deleteId = that.$store.state.ScriptData.findIndex(function (obj) {
                  return obj.fileName === item.fileName
                });
                that.$store.state.ScriptData.splice(deleteId, 1);
                that.selectedDatas = [];
                that.$store.commit('changeTotal', that.selectedDatas.length);
                that.$emit('watchChild');
              })
            }
          }).catch()
        } else {

        }

      },

      //下载脚本方法
      download() {
        var selectedlist = this.selectedDatas.map((item) => item.fileName);//使用map遍历数组，返回一个数组
        console.log(selectedlist);
        if (selectedlist.length !== 0) {
          var that = this;

          function myFunction(select) {
            that.$axios.request({
              url: process.env.URL_PATH + '/SippScript!download',//下载脚本接口
              method: 'post',
              params: {},
              data: {
                dirPath: that.$store.state.CurrentPath,
                fileName: select,
              }
            }).then(function (ret) {
              if (ret.headers["content-type"] === "application/octet-stream") {
                let fileDownload = require('js-file-download');
                var fileName = ret.headers["content-disposition"].split("\"")[1];
                console.log(fileName);
                fileDownload(ret.data, fileName);
              }
            }).catch()
          }

          selectedlist.forEach(myFunction)

        } else {

        }

      },


      changeModal() {
        this.Modal = false;

      },
      confirm() {
        console.log(1111)
      },



      viewScript(fileName) {
        var that = this;
        this.$axios.request({
          url: process.env.URL_PATH + '/SippScript!viewScript',//下载脚本接口
          method: 'post',
          params: {},
          data: {
            dirPath: that.$store.state.CurrentPath,
            fileName: fileName,
          }
        }).then(function (ret) {
          console.log(that.content);
          //that.content = ret.data;
          //console.log(that.content);
        })
      },

      onEditorReady(editor) { // 准备编辑器

      },
      onEditorBlur() {
      }, // 失去焦点事件
      onEditorFocus() {
      }, // 获得焦点事件
      onEditorChange() {
      }, // 内容改变事件


    }
  }
</script>

<style scoped>


</style>
