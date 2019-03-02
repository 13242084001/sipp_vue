<template>
  <div class="layout">
    <Layout>
      <Header style="background-color: #ac2925;">
        <div mode="horizontal" style="background-color: #ac2925">
          <div style="float: left"><img src="../assets/cloud.png" style="height: 30px;width: 30px"><span
            style="margin: 0 10px;font-size: 20px;color: white">sipp</span></div>
          <div class="layout-nav">
            <div style="float: right">
              <Dropdown trigger="click" @on-click="handle" style="margin-left: 20px;height: 60px">
                <a href="javascript:void(0)" style="text-decoration: none;color: white">
                  {{this.$store.state.username}}
                  <Icon type="ios-arrow-down"></Icon>
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem>版本 V 1.0</DropdownItem>
                  <DropdownItem name="changePasswd">修改密码
                  </DropdownItem>

                  <Modal v-model="Modal" title="修改密码">
                    <a slot="close" @click="Modal=false; alertStyle.display='none';value=''"><i
                      class="ivu-icon ivu-icon-ios-close"></i></a>

                    <div slot="footer"> <!--这里自定义的footer；因为自带的确定按钮始终会点击关闭-->
                      <Button type="text" @click="Modal=false; alertStyle.display='none';value=''">取消</Button>
                      <!--<Button type="success" @click="confirm">确定</Button>-->
                      <i-button type="success" @click="confirm('formInline')">确 定</i-button>
                      <!--<i-button type="success" long @click="login('formInline')">登&nbsp;陆</i-button>-->
                    </div>

                    <Form ref="formInline" :model="formInline" :rules="ruleInline">
                      <FormItem prop="oldPasswd"><p><span style="color: red">*</span>&nbsp;原密码</p>
                        <Input type="password" v-model="formInline.oldPasswd" placeholder="oldPasswd">
                          <Icon type="ios-lock-outline" slot="prepend"></Icon>
                        </Input>
                      </FormItem>
                      <FormItem prop="newPasswd"><p><span style="color: red">*</span>&nbsp;原密码</p>
                        <Input type="password" v-model="formInline.newPasswd" placeholder="newPasswd">
                          <Icon type="ios-lock-outline" slot="prepend"></Icon>
                        </Input>
                      </FormItem>

                    </Form>

                  </Modal>


                  <DropdownItem name="logOut">注 销</DropdownItem>

                </DropdownMenu>
              </Dropdown>
            </div>
            <div style="clear: both"></div>
          </div>
        </div>
      </Header>

      <Layout>
        <Sider hide-trigger :style="{background: '#ddd'}">
          <Menu :active-name="active" width="auto" :open-names="open" ref="child" @on-select="routeTo" style="background-color: #ddd">
            <!--<MenuItem name="/index/workbench" style="border-right: none">
              <i class="fa fa-tachometer fa-fw"></i>
              <router-link to="/index/workbench" class="left-link">工作台</router-link>
            </MenuItem>

            <MenuItem name="/index/config">
              <i class="fa fa-cogs"></i>
              <router-link to="/index/config" class="left-link">&nbsp;配置</router-link>
            </MenuItem>


            <Submenu name="">
              <template slot="title"><i class="fa fa-tasks"></i>
                &nbsp;<span style="color: black">任务</span>
              </template>
              <MenuItem name="/index/TaskStatus">
                <router-link to="/index/TaskStatus" class="left-link">任务状态</router-link>
              </MenuItem>
              <MenuItem name="/index/TaskContent">
                <router-link to="/index/TaskContent" class="left-link">任务内容</router-link>
              </MenuItem>
            </Submenu>

            <Submenu name="">
              <template slot="title"><i class="fa fa-table fa-fw"></i>
                <span style="color: black">脚本</span>
              </template>
              <MenuItem name="/index/SippScript">
                <router-link to="/index/SippScript" class="left-link">sipp 脚本</router-link>
              </MenuItem>
              <MenuItem name="/index/PythonScript">
                <router-link to="/index/PythonScript" class="left-link">python脚本</router-link>
              </MenuItem>
            </Submenu>-->

            <template  v-for="(item, index) in listdata">
                <template v-if="item.child&&item.child.length>0">
                    <Submenu :name="item.name">
                    <template slot="title">
                        <i :class="item.class"></i>
                        <span>{{item.name}}</span>
                    </template>
                    <template v-for="sub in item.child">
                        <MenuItem :name="sub.href"><span>{{sub.name}}</span></MenuItem>
                    </template>
                        </Submenu>
                </template>
                <template v-else>
                <MenuItem :name="item.href" >
                    <i :class="item.class"></i>
                        <span>{{item.name}}</span>
                </MenuItem>
              </template>
            </template>



          </Menu>
        </Sider>
        <Layout :style="{padding: 0}">
          <Breadcrumb :style="{margin:  '10px'}">
            <BreadcrumbItem to="/index/workbench">首页</BreadcrumbItem>
            <BreadcrumbItem>{{this.$route.name|breadcrumb}}</BreadcrumbItem>
          </Breadcrumb>
          <Content :style="{padding: '24px', margin: '24px, 0, 0, 0', minHeight: '700px', minWidth: '10px', background: '#fff'}">

            <router-view/>

          </Content>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>

<script>
  import Cookie from 'vue-cookies';

  export default {
    name: "index",

    data() {
      return {
        name: this.$store.state.username,
        Modal: false,
        formInline: {
          oldPasswd: '',
          newPasswd: '',
        },
        ruleInline: {
          oldPasswd: [
            {required: true, message: '原密码不能为空', trigger: 'blur'}
          ],
          newPasswd: [
            {required: true, message: '新密码不能为空', trigger: 'blur'},
            {type: 'string', min: 3, message: '原密码不能小于3个字符', trigger: 'blur'}
          ]
        },

        alertStyle: {
          display: 'none',
          color: 'red'
        },

        open: [],
        active: '/index/workbench',

        listdata:[
                {
                    'name':'工作台',
                    'class':"fa fa-tachometer fa-fw",
                    'href':'/index/workbench',
                },
                {
                    'name':'配置',
                    'class':"fa fa-cogs",
                    'href':'/index/config',
                },
                {
                    'name':'任务',
                    'class':"fa fa-tasks",
                    'child':[
                        {
                            'name':'任务状态',
                            'href':'/index/TaskStatus',
                        },
                      {
                        'name': '任务内容',
                        'href': '/index/TaskContent',
                      }
                ]
                },
                {
                    'name':'脚本',
                    'class':"fa fa-table fa-fw",
                    'child':[
                        {
                            'name':'sipp脚本',
                            'href':'/index/SippScript',
                        },
                      {
                        'name': 'python脚本',
                        'href': '/index/PythonScript',
                      }
                ]
                }
        ]
      }
    },
    methods: {
      routeTo(name) {
        this.$router.push(name);
      },

      handle(name) {
        console.log(name);
        if (name === "changePasswd") {
          this.Modal = true
        } else if (name === "logOut") {
          Cookie.set('username', '');
          Cookie.set('token', '');
          this.$router.push({path: '/'})
        }
      },

      confirm(pwd) {
        this.$refs[pwd].validate((valid) => {
          if (valid) {
            var that = this;
            this.$axios.request({
              url: process.env.URL_PATH+"/changePasswd",
              method: "post",
              params: {},
              data: {
                oldPasswd: that.formInline.oldPasswd,
                newPasswd: that.formInline.newPasswd,
              },
            }).then(function (ret) {
              if (ret.data.code === 10000) {
                that.$Message.success('修改成功');
                that.Modal = false;
                that.oldPasswd = '';
                that.newPasswd = '';
                that.$router.push({path: '/'})
              } else {
                that.$Message.error(ret.data.error)//这里应该搞个目录名不能为空
              }
            }).catch()
          } else {
            //
          }
        });

      },

      watchRoute(){
        console.log(this.$route.name);
            if((this.$route.name=="SippScript")||(this.$route.name=="PythonScript")){
                this.open = ['脚本'];
                    //this.$refs.child.$children[2].opened = false;
            }else if((this.$route.name=="TaskStatus")||(this.$route.name=="TaskContent")){
                this.open = ['任务']
            }else {
                this.open = [];
            }
            this.$nextTick(()=> {
                    this.$refs.child.updateOpened();
                    this.active = this.$route.path;
                    this.$refs.child.updateActiveName();
                });
        }

    },

    watch: {
      $route(){
                this.watchRoute();
            }
    },

    mounted(){
      this.$nextTick(()=>{
        this.watchRoute();
      })
    }
  }
</script>

<style scoped>
  .layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }

  .layout-nav {
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
  }

  i {
    color: black;
  }

  span {
    color: black;
  }

</style>
